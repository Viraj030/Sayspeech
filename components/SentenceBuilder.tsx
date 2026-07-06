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
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
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

function SortableWord({ word, isSolved, isPlaced }: { word: DragWord; isSolved: boolean; isPlaced: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: word.id,
    disabled: isSolved
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.3 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black border-2 shadow-sm transition-all cursor-grab active:cursor-grabbing select-none touch-none ${
        isSolved
          ? 'bg-emerald-50 border-emerald-450 text-emerald-800'
          : isPlaced
          ? 'bg-indigo-50 border-indigo-250 text-indigo-800'
          : 'bg-white border-slate-800 text-slate-700 hover:bg-slate-50'
      }`}
    >
      {word.text}
    </div>
  );
}

function DroppableContainer({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
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
  const [placed, setPlaced] = useState<DragWord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } })
  );

  useEffect(() => {
    setPool(words.map((w, idx) => ({ id: `word-${w}-${idx}`, text: w })));
    setPlaced([]);
    setIsWrong(false);
    setShakeTrigger(false);
  }, [words]);

  // Automated validation when all words are placed
  useEffect(() => {
    if (placed.length === words.length && placed.length > 0 && !isSolved) {
      const userSentence = placed.map((w) => w.text).join(' ');
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

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeInPool = pool.find((w) => w.id === activeId);
    const activeInPlaced = placed.find((w) => w.id === activeId);
    if (!activeInPool && !activeInPlaced) return;

    const overInPoolIndex = pool.findIndex((w) => w.id === overId);
    const overInPlacedIndex = placed.findIndex((w) => w.id === overId);

    const isOverPool = overId === 'pool' || overInPoolIndex !== -1;
    const isOverPlaced = overId === 'placed' || overInPlacedIndex !== -1;

    if (activeInPool && isOverPlaced) {
      // Move from pool to placed
      setPool((prev) => prev.filter((w) => w.id !== activeId));
      setPlaced((prev) => {
        const next = [...prev];
        if (overInPlacedIndex !== -1) {
          next.splice(overInPlacedIndex, 0, activeInPool);
        } else {
          next.push(activeInPool);
        }
        return next;
      });
    } else if (activeInPlaced && isOverPool) {
      // Move from placed to pool
      setPlaced((prev) => prev.filter((w) => w.id !== activeId));
      setPool((prev) => {
        const next = [...prev];
        if (overInPoolIndex !== -1) {
          next.splice(overInPoolIndex, 0, activeInPlaced);
        } else {
          next.push(activeInPlaced);
        }
        return next;
      });
    } else if (activeInPlaced && overInPlacedIndex !== -1) {
      // Reorder within placed
      const activeInPlacedIndex = placed.findIndex((w) => w.id === activeId);
      if (activeInPlacedIndex !== -1 && activeInPlacedIndex !== overInPlacedIndex) {
        setPlaced((prev) => arrayMove(prev, activeInPlacedIndex, overInPlacedIndex));
      }
    } else if (activeInPool && overInPoolIndex !== -1) {
      // Reorder within pool
      const activeInPoolIndex = pool.findIndex((w) => w.id === activeId);
      if (activeInPoolIndex !== -1 && activeInPoolIndex !== overInPoolIndex) {
        setPool((prev) => arrayMove(prev, activeInPoolIndex, overInPoolIndex));
      }
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    setPool(words.map((w, idx) => ({ id: `word-${w}-${idx}`, text: w })));
    setPlaced([]);
    setIsWrong(false);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto gap-2.5 sm:gap-4 overflow-hidden">
        {/* Category Header */}
        <span className="text-[10px] sm:text-xs font-black text-amber-500 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-100 uppercase tracking-widest shrink-0">
          Sentence Building
        </span>

        {/* Instruction */}
        <div className="text-center shrink-0">
          <h2 className="text-xs sm:text-base font-black text-slate-800 leading-snug">
            {instruction}
          </h2>
        </div>

        {/* Selected Workspace (Target Line) */}
        <motion.div
          animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-full shrink-0"
        >
          <DroppableContainer
            id="placed"
            className={`w-full min-h-[50px] sm:min-h-[64px] bg-slate-50/50 rounded-xl border-2 border-dashed flex flex-wrap items-center justify-center gap-1.5 p-2 sm:p-3 transition-all duration-300 ${
              isSolved
                ? 'border-emerald-500 bg-emerald-50/20'
                : isWrong
                ? 'border-rose-500 bg-rose-50/20'
                : 'border-slate-300'
            }`}
          >
            <SortableContext items={placed.map((w) => w.id)} strategy={horizontalListSortingStrategy}>
              {placed.length === 0 ? (
                <span className="text-slate-400 font-extrabold text-xs sm:text-sm select-none">
                  Drag words here to build the sentence...
                </span>
              ) : (
                placed.map((word) => (
                  <SortableWord key={word.id} word={word} isSolved={isSolved} isPlaced={true} />
                ))
              )}
            </SortableContext>
          </DroppableContainer>
        </motion.div>

        {/* Pool of Available Words */}
        <DroppableContainer
          id="pool"
          className="w-full min-h-[50px] bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 flex flex-wrap items-center justify-center gap-1.5 p-3 shrink-0"
        >
          <SortableContext items={pool.map((w) => w.id)} strategy={horizontalListSortingStrategy}>
            {pool.length === 0 && !isSolved && (
              <span className="text-slate-400 font-bold text-xs select-none">All words placed!</span>
            )}
            {pool.map((word) => (
              <SortableWord key={word.id} word={word} isSolved={isSolved} isPlaced={false} />
            ))}
          </SortableContext>
        </DroppableContainer>

        {/* Action Buttons & Feedback */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {!isSolved && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleReset}
                disabled={placed.length === 0}
                className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                title="Reset words"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-250 text-xs font-black shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Well done! Sentence is correct.</span>
              </motion.div>
            )}

            {isWrong && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-250 text-xs font-black shadow-sm"
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
          <div className="px-3 py-1.5 bg-indigo-100 border-2 border-indigo-400 text-indigo-900 rounded-lg text-xs sm:text-sm font-black shadow-md opacity-90 scale-105 pointer-events-none">
            {pool.find((w) => w.id === activeId)?.text || placed.find((w) => w.id === activeId)?.text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
