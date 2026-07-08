'use client';

import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';
import { SequenceItem } from '../types/game';

interface SequenceScreenProps {
  instruction: string;
  items: SequenceItem[];
  onSolved: () => void;
  isSolved: boolean;
}

// Compact Draggable Card
function DraggableSequenceCard({ item, isSolved }: { item: SequenceItem; isSolved: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
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
      {...listeners}
      {...attributes}
      className={`relative w-24 h-32 sm:w-34 sm:h-44 bg-white border-2 border-slate-800 rounded-xl p-1.5 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow select-none touch-none ${isDragging ? 'opacity-0 pointer-events-none' : ''
        } ${isSolved ? 'opacity-95 cursor-default' : ''}`}
    >
      {/* Step Image */}
      <div className="w-full h-14 sm:h-24 relative rounded bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.label}
          className="max-w-full max-h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Step Label */}
      <span className="text-[10px] sm:text-[16px] text-wrap font-black text-slate-700 text-center leading-tight mt-1 flex-grow flex items-center justify-center truncate w-full">
        {item.label}
      </span>
    </div>
  );
}

// Droppable Slot Placeholder
function DroppablePlaceholder({
  index,
  placedItem,
  isSolved
}: {
  index: number;
  placedItem: SequenceItem | null;
  isSolved: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-24 h-32 sm:w-34 sm:h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${placedItem
        ? 'border-solid border-slate-800 bg-white shadow-sm'
        : isOver
          ? 'border-indigo-500 bg-indigo-50/20 scale-[1.02]'
          : 'border-slate-300 bg-slate-50 hover:bg-slate-50'
        } ${isSolved ? 'border-emerald-500 bg-emerald-50/10' : ''}`}
    >
      {placedItem ? (
        <DraggableSequenceCard item={placedItem} isSolved={isSolved} />
      ) : (
        <div className="flex flex-col items-center gap-1 pointer-events-none select-none">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 text-[10px] sm:text-xs font-black">
            {index + 1}
          </div>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-500">Step {index + 1}</span>
        </div>
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

export default function SequenceScreen({
  instruction,
  items,
  onSolved,
  isSolved
}: SequenceScreenProps) {
  const [slots, setSlots] = useState<(SequenceItem | null)[]>(() => new Array(items.length).fill(null));
  const [jumbledPool, setJumbledPool] = useState<SequenceItem[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 }
    })
  );

  useEffect(() => {
    const sortedCopy = [...items];
    let jumbled = [...sortedCopy].sort(() => Math.random() - 0.5);

    // Ensure it's not sorted correctly by chance
    let isSorted = jumbled.every((item, idx) => item.order === idx);
    while (isSorted && jumbled.length > 1) {
      jumbled.sort(() => Math.random() - 0.5);
      isSorted = jumbled.every((item, idx) => item.order === idx);
    }

    setJumbledPool(jumbled);
    setSlots(new Array(items.length).fill(null));
    setHasChecked(false);
    setIsWrong(false);
  }, [items]);

  // Auto-validate immediately when all slots are filled
  useEffect(() => {
    const isFull = slots.every((s) => s !== null);
    if (isFull && !isSolved && !hasChecked) {
      const isCorrect = slots.every((item, idx) => item !== null && item.order === idx);
      setHasChecked(true);
      if (isCorrect) {
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
  }, [slots, isSolved, hasChecked, onSolved]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsWrong(false);
    setHasChecked(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    const draggedItem = items.find((item) => item.id === draggedId);
    if (!draggedItem) return;

    // Resolve slot indices
    let fromSlotIndex = slots.findIndex((s) => s?.id === draggedId);
    let toSlotIndex = -1;

    if (overId.startsWith('slot-')) {
      toSlotIndex = parseInt(overId.split('-')[1], 10);
    } else {
      toSlotIndex = slots.findIndex((s) => s?.id === overId);
    }

    let isOverPool = overId === 'jumbled-pool' || jumbledPool.some((item) => item.id === overId);

    const newSlots = [...slots];
    let newPool = [...jumbledPool];

    if (toSlotIndex !== -1) {
      // Dragged into a slot
      const occupiedItem = slots[toSlotIndex];

      if (fromSlotIndex !== -1) {
        // Dragged from another slot to this slot (Swap them!)
        if (fromSlotIndex === toSlotIndex) return;
        newSlots[toSlotIndex] = draggedItem;
        newSlots[fromSlotIndex] = occupiedItem;
      } else {
        // Dragged from pool to slot
        newSlots[toSlotIndex] = draggedItem;
        newPool = newPool.filter((item) => item.id !== draggedId);

        if (occupiedItem) {
          // Put the occupied item back in pool
          newPool.push(occupiedItem);
        }
      }
      setIsWrong(false);
      setHasChecked(false);
    } else if (isOverPool) {
      // Dragged back to pool
      if (fromSlotIndex !== -1) {
        newSlots[fromSlotIndex] = null;
        if (!newPool.some((item) => item.id === draggedId)) {
          newPool.push(draggedItem);
        }
        setIsWrong(false);
        setHasChecked(false);
      }
    }

    setSlots(newSlots);
    setJumbledPool(newPool);
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    if (isSolved || hasChecked) return;
    const item = slots[slotIndex];
    if (!item) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);

    setJumbledPool((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsWrong(false);
    setHasChecked(false);
  };

  const handleReset = () => {
    if (isSolved) return;
    const sortedCopy = [...items];
    let jumbled = [...sortedCopy].sort(() => Math.random() - 0.5);

    // Ensure it's not sorted correctly by chance
    let isSorted = jumbled.every((item, idx) => item.order === idx);
    while (isSorted && jumbled.length > 1) {
      jumbled.sort(() => Math.random() - 0.5);
      isSorted = jumbled.every((item, idx) => item.order === idx);
    }

    setJumbledPool(jumbled);
    setSlots(new Array(items.length).fill(null));
    setHasChecked(false);
    setIsWrong(false);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-2.5 sm:gap-5 overflow-hidden px-4">
        {/* Instruction */}
        <div className="text-center shrink-0">
          <h2 className="text-xs sm:text-base font-black text-slate-800 leading-snug truncate max-w-full">
            {instruction}
          </h2>
        </div>

        {/* Drop Slots (Timeline Grid) */}
        <motion.div
          animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-3 sm:flex sm:flex-row items-center justify-center sm:gap-6 mt-1 w-full shrink-0 justify-items-center"
        >
          {slots.map((placedItem, idx) => (
            <div
              key={`placeholder-${idx}`}
              onClick={() => handleRemoveFromSlot(idx)}
              className="cursor-pointer"
            >
              <DroppablePlaceholder index={idx} placedItem={placedItem} isSolved={isSolved} />
            </div>
          ))}
        </motion.div>

        {/* Jumbled Pool (Tray) - Hidden when solved */}
        {!isSolved && (
          <DroppablePoolContainer
            id="jumbled-pool"
            className="w-full min-h-[110px] bg-slate-50/50 rounded-2xl border-[2px] border-dashed border-slate-350 p-2.5 flex flex-row items-center sm:justify-center gap-3 sm:gap-6 mt-1 shrink-0 overflow-x-auto overflow-y-hidden"
          >
            <AnimatePresence>
              {jumbledPool.length === 0 && !isSolved && slots.includes(null) ? (
                <span className="text-slate-400 font-extrabold text-[10px] sm:text-xs">Drag items to correct placeholders!</span>
              ) : jumbledPool.length === 0 ? (
                <span className="text-slate-400 font-extrabold text-[10px] sm:text-xs">All steps placed!</span>
              ) : (
                jumbledPool.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="shrink-0"
                  >
                    <DraggableSequenceCard item={item} isSolved={isSolved} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </DroppablePoolContainer>
        )}

        {/* Action Tray & Feedback */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          {!isSolved && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleReset}
                disabled={slots.every((s) => s === null)}
                className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                title="Reset slots"
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
                <span>Sequencing is 100% correct!</span>
              </motion.div>
            )}

            {isWrong && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-250 text-xs font-black shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Not quite right. Try rearranging!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-90 scale-105 pointer-events-none">
            <div className="relative w-24 h-32 sm:w-34 sm:h-44 bg-white border-2 border-indigo-400 rounded-xl p-1.5 flex flex-col items-center justify-between shadow-lg">
              <div className="w-full h-14 sm:h-24 relative rounded bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={items.find((item) => item.id === activeId)?.image}
                  alt=""
                  className="max-w-full max-h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
              <span className="text-[10px] sm:text-[12px] font-black text-slate-700 text-center leading-tight mt-1 flex-grow flex items-center justify-center truncate w-full">
                {items.find((item) => item.id === activeId)?.label}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
