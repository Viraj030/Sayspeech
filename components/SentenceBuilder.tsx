'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw } from 'lucide-react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  DragOverlay,
  useDraggable
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';

interface SentenceBuilderProps {
  instruction: string;
  words: string[];
  correctOrder: string[];
  onSolved: () => void;
  isSolved: boolean;
}

interface DragWord {
  id: string;
  text: string;
}

function DraggableWord({ word, isSolved, isPlaced }: { word: DragWord; isSolved: boolean; isPlaced: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: word.id,
    disabled: isSolved
  });

  const style = transform && !isDragging
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-5 py-3 rounded-2xl text-base sm:text-xl font-black border-[3px] shadow-md transition-all select-none touch-none ${
        isSolved
          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
          : isPlaced
          ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
          : 'bg-white border-slate-800 text-slate-700 hover:bg-slate-50 cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'opacity-0 pointer-events-none' : ''}`}
    >
      {word.text}
    </div>
  );
}

function DroppableSlot({
  index,
  placedWord,
  isSolved,
  onRemove
}: {
  index: number;
  placedWord: DragWord | null;
  isSolved: boolean;
  onRemove: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: isSolved
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onRemove}
      className={`min-h-[44px] sm:min-h-[58px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
        placedWord
          ? ''
          : isOver
          ? 'border-b-[4px] border-indigo-500 scale-[1.05]'
          : 'border-b-[4px] border-indigo-300/85 hover:border-indigo-400'
      }`}
      style={{
        minWidth: '5rem',
        margin: '0.25rem 0.5rem',
      }}
    >
      {placedWord ? (
        <DraggableWord word={placedWord} isSolved={isSolved} isPlaced={true} />
      ) : (
        <div className="w-16 sm:w-24 h-6 pointer-events-none select-none" />
      )}
    </div>
  );
}

function DroppablePoolContainer({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

export default function SentenceBuilder({
  instruction,
  words,
  correctOrder,
  onSolved,
  isSolved
}: SentenceBuilderProps) {
  const [pool, setPool] = useState<DragWord[]>([]);
  const [placed, setPlaced] = useState<(DragWord | null)[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } })
  );

  useEffect(() => {
    const initialPool = words.map((w, idx) => ({ id: `word-${w}-${idx}`, text: w }));
    const jumbled = [...initialPool].sort(() => Math.random() - 0.5);
    setPool(jumbled);
    setPlaced(new Array(words.length).fill(null));
    setIsWrong(false);
    setShakeTrigger(false);
  }, [words]);

  // Automated validation when all slots are filled
  useEffect(() => {
    const isFull = placed.every((w) => w !== null);
    if (isFull && placed.length > 0 && !isSolved) {
      const userSentence = placed.map((w) => w?.text).join(' ');
      const correctSentence = correctOrder.join(' ');

      if (userSentence === correctSentence) {
        playSound('correct');
        setIsWrong(false);
        confetti({ particleCount: 80, spread: 60, origin: { x: 0.5, y: 0.5 } });
        onSolved();
      } else {
        playSound('wrong');
        setIsWrong(true);
        setShakeTrigger(true);
        setTimeout(() => setShakeTrigger(false), 500);
      }
    }
  }, [placed, words, correctOrder, isSolved, onSolved]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsWrong(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    const draggedWord = pool.find((w) => w.id === draggedId) || placed.find((w) => w?.id === draggedId);
    if (!draggedWord) return;

    let fromSlotIndex = placed.findIndex((w) => w?.id === draggedId);
    let toSlotIndex = -1;

    if (overId.startsWith('slot-')) {
      toSlotIndex = parseInt(overId.split('-')[1], 10);
    } else {
      toSlotIndex = placed.findIndex((w) => w?.id === overId);
    }

    const isOverPool = overId === 'pool' || pool.some((w) => w.id === overId);

    const newPlaced = [...placed];
    let newPool = [...pool];

    if (toSlotIndex !== -1) {
      // Dropped into a slot
      const occupiedWord = placed[toSlotIndex];

      if (fromSlotIndex !== -1) {
        // Swap slots
        if (fromSlotIndex === toSlotIndex) return;
        newPlaced[toSlotIndex] = draggedWord;
        newPlaced[fromSlotIndex] = occupiedWord;
      } else {
        // Move from pool to slot
        newPlaced[toSlotIndex] = draggedWord;
        newPool = newPool.filter((w) => w.id !== draggedId);
        if (occupiedWord) {
          newPool.push(occupiedWord);
        }
      }
      setIsWrong(false);
    } else if (isOverPool) {
      // Dragged back to pool
      if (fromSlotIndex !== -1) {
        newPlaced[fromSlotIndex] = null;
        if (!newPool.some((w) => w.id === draggedId)) {
          newPool.push(draggedWord);
        }
        setIsWrong(false);
      }
    }

    setPlaced(newPlaced);
    setPool(newPool);
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    if (isSolved) return;
    const word = placed[slotIndex];
    if (!word) return;

    const newPlaced = [...placed];
    newPlaced[slotIndex] = null;
    setPlaced(newPlaced);

    setPool((prev) => {
      if (prev.some((p) => p.id === word.id)) return prev;
      return [...prev, word];
    });
    setIsWrong(false);
  };

  const handleReset = () => {
    if (isSolved) return;
    const initialPool = words.map((w, idx) => ({ id: `word-${w}-${idx}`, text: w }));
    setPool([...initialPool].sort(() => Math.random() - 0.5));
    setPlaced(new Array(words.length).fill(null));
    setIsWrong(false);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-4 sm:gap-6 overflow-hidden py-3">
        
        {/* Instruction */}
        <div className="text-center shrink-0">
          <h2 className="text-xl sm:text-3xl font-black text-slate-800 leading-snug">
            {instruction}
          </h2>
        </div>

        {/* Selected Workspace (Target Line) */}
        <motion.div
          animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-full shrink-0 px-2"
        >
          <div
            className={`w-full min-h-[76px] sm:min-h-[100px] bg-slate-50/50 rounded-3xl border-[3px] border-dashed flex flex-wrap items-center justify-center gap-3 p-4 transition-all duration-300 ${
              isSolved
                ? 'border-emerald-500 bg-emerald-50/20'
                : isWrong
                ? 'border-rose-500 bg-rose-50/20'
                : 'border-slate-350'
            }`}
          >
            {placed.map((placedWord, idx) => (
              <DroppableSlot
                key={`slot-${idx}`}
                index={idx}
                placedWord={placedWord}
                isSolved={isSolved}
                onRemove={() => handleRemoveFromSlot(idx)}
              />
            ))}
          </div>
        </motion.div>

        {/* Pool of Available Words */}
        <DroppablePoolContainer
          id="pool"
          className="w-full min-h-[64px] bg-slate-50/50 rounded-3xl border-[3px] border-dashed border-slate-200 flex flex-wrap items-center justify-center gap-3 p-4 shrink-0"
        >
          {pool.map((word) => (
            <DraggableWord key={word.id} word={word} isSolved={isSolved} isPlaced={false} />
          ))}
        </DroppablePoolContainer>

        {/* Action Buttons & Feedback */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {!isSolved && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleReset}
                disabled={placed.every((w) => w === null)}
                className="p-3 bg-slate-100 hover:bg-slate-205 border-2 border-slate-300 rounded-xl text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                title="Reset words"
              >
                <RefreshCw className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-250 text-xs sm:text-sm font-black shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Well done! Sentence is correct.</span>
              </motion.div>
            )}

            {isWrong && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-xl border border-rose-250 text-xs sm:text-sm font-black shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Oops! Try rearranging the words.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-90 scale-105 pointer-events-none">
            <div className="px-5 py-3 bg-indigo-100 border-[3px] border-indigo-400 text-indigo-900 rounded-2xl text-base sm:text-xl font-black shadow-md">
              {pool.find((w) => w.id === activeId)?.text || placed.find((w) => w?.id === activeId)?.text}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
