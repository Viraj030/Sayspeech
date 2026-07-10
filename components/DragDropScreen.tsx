'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check } from 'lucide-react';
import { playSound } from '../lib/sound';
import SpeechBubble from './SpeechBubble';
import { DragOption, DialogueBubble as DialogueType, OverlayImage } from '../types/game';

// ─────────────────────────────────────────────────────────────────────────────
// DraggableCard — shown in the bottom tray
// ─────────────────────────────────────────────────────────────────────────────
function DraggableCard({ option, disabled }: { option: DragOption; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: option.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'select-none touch-none flex flex-col items-center',
        disabled ? 'cursor-default opacity-45' : 'cursor-grab active:cursor-grabbing',
        'transition-opacity duration-150',
        isDragging ? 'opacity-20' : '',
      ].join(' ')}
      style={{ userSelect: 'none', width: '200px' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={option.image}
        alt={option.label}
        draggable={false}
        className="pointer-events-none block"
        style={{ width: '200px', height: 'auto' }}
      />
      {option.label && (
        <span
          className="font-extrabold text-slate-800 text-center leading-tight whitespace-nowrap mt-1 select-none pointer-events-none"
          style={{ fontSize: 'clamp(10px, 1.8cqw, 16px)' }}
        >
          {option.label}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FloatingCard — rendered by DragOverlay
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FloatingCard({ option }: { option: DragOption }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ pointerEvents: 'none', width: 180, transform: 'scale(1.1)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={option.image}
        alt={option.label}
        className="w-full object-contain"
        style={{ maxHeight: 180 }}
        draggable={false}
      />
      {option.label && (
        <span className="text-xs font-black text-slate-800 text-center whitespace-nowrap mt-1">
          {option.label}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TawaZone — invisible but interactive droppable
// ─────────────────────────────────────────────────────────────────────────────
function TawaZone({
  isSolved,
  pos,
}: {
  isSolved: boolean;
  pos: { top: number; left: number; width: number; height: number };
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'tawa-target' });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: `${pos.width}%`,
        height: `${pos.height}%`,
        zIndex: 10,
        borderRadius: '50%',
      }}
    >
      <div
        className={[
          'w-full h-full rounded-[50%] flex items-center justify-center transition-all duration-200',
          !isSolved && isOver
            ? 'bg-indigo-300/40 ring-4 ring-dashed ring-indigo-400'
            : '',
        ].join(' ')}
      >
        {!isSolved && isOver && (
          <span
            className="bg-indigo-700 text-white font-black rounded-lg shadow-lg"
            style={{ fontSize: 'clamp(9px, 1.4cqw, 14px)', padding: '4px 10px' }}
          >
            Drop here!
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface DragDropScreenProps {
  instruction: string;
  backgroundImage: string;
  options: DragOption[];
  correctOptionId: string;
  initialOverlays?: OverlayImage[];
  dropTargetPos?: { top: number; left: number; width: number; height: number };
  successTransitionImage?: string;
  nextOverlays?: OverlayImage[];
  nextBackgroundImage?: string;
  onSolved: () => void;
  isSolved: boolean;
  dialogues?: DialogueType[];
  isBgTop?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function DragDropScreen({
  instruction,
  backgroundImage,
  options,
  correctOptionId,
  initialOverlays = [],
  dropTargetPos = { top: 35, left: 5, width: 88, height: 55 },
  successTransitionImage,
  nextOverlays = [],
  nextBackgroundImage,
  onSolved,
  isSolved,
  dialogues = [],
  isBgTop = false,
}: DragDropScreenProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Architecture flow stages
  const [hasDropped, setHasDropped] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [isCompletedState, setIsCompletedState] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 10 } })
  );

  const activeOption = options.find((o) => o.id === activeId) ?? null;

  // Sync state if step changes or resets
  useEffect(() => {
    if (!isSolved) {
      setHasDropped(false);
      setShowSuccessOverlay(false);
      setShowSuccessBadge(false);
      setIsCompletedState(false);
    } else {
      setHasDropped(true);
      setShowSuccessOverlay(false);
      setShowSuccessBadge(false);
      setIsCompletedState(true);
    }
  }, [isSolved, instruction]);

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);

    if (over?.id === 'tawa-target') {
      if (active.id === correctOptionId) {
        setHasDropped(true);
        setShowSuccessOverlay(true);
        setShowSuccessBadge(true);
        playSound('correct');
        confetti({ particleCount: 80, spread: 60, origin: { x: 0.5, y: 0.5 } });

        // STATE 2: Show successOverlay + badge for 2 seconds (2000ms)
        setTimeout(() => {
          // STATE 3: After 2 seconds, remove success message & overlay, update to next background state
          setShowSuccessOverlay(false);
          setShowSuccessBadge(false);
          setIsCompletedState(true);
          onSolved(); // Enable next button
        }, 2000);
      } else {
        playSound('wrong');
        setShakeId(active.id as string);
        setTimeout(() => setShakeId(null), 600);
      }
    }
  };

  // Determine current active background based on stage
  const currentBg = (isCompletedState && nextBackgroundImage) ? nextBackgroundImage : backgroundImage;

  // Determine current active overlays based on stage
  const currentOverlays = isCompletedState ? nextOverlays : initialOverlays;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden select-none p-0">

        {/* 1402:1122 slide canvas (Single screen layout matching PPT) */}
        <div
          className="relative flex flex-col overflow-hidden w-full h-full"
          style={{
            containerType: 'inline-size',
          }}
        >
          <div className="flex-1 flex flex-row w-full h-full overflow-hidden relative">
            {/* Left vertical tray - hidden when solved */}
            <AnimatePresence>
              {!isSolved && (
                <motion.div
                  key="tray"
                  initial={{ width: '24%', opacity: 1 }}
                  exit={{ width: '0%', opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-r border-slate-200 bg-[#fcfbf7] flex flex-col items-center justify-between py-[2cqw] shrink-0 relative overflow-hidden"
                  style={{ width: '24%', height: '100%' }}
                >
                  {/* Up scroll indicator arrow */}
                  <div className="text-slate-400 text-[1.5cqw] font-bold select-none cursor-default">▲</div>

                  {/* Dashed scroll wrapper for draggable option card */}
                  <div className="border-[2.5px] border-dashed border-slate-400 rounded-2xl w-[86%] my-[1cqw] p-[1cqw] px-0 flex-1 flex flex-col justify-around items-center gap-[1.5cqw]">
                    {options.map((option) => (
                      <motion.div
                        key={option.id}
                        animate={shakeId === option.id ? { x: [-8, 8, -8, 8, 0] } : {}}
                        transition={{ duration: 0.45 }}
                        className="w-full flex items-center justify-center"
                      >
                        <DraggableCard option={option} disabled={isSolved || hasDropped} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Down scroll indicator arrow */}
                  <div className="text-slate-400 text-[1.5cqw] font-bold select-none cursor-default">▼</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right kitchen pane - takes full width when tray is hidden */}
            <div
              className="relative overflow-hidden h-full flex-grow flex-shrink-0"
              style={{ width: isSolved ? '100%' : '76%', transition: 'width 0.4s ease-in-out' }}
            >
              {/* Active Base Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentBg}
                alt="Kitchen"
                className={`w-full h-full object-cover pointer-events-none ${isBgTop ? 'object-top' : 'object-center'}`}
                draggable={false}
              />

              {/* Active state overlays (fade in smoothly) */}
              <AnimatePresence>
                {currentOverlays.map((ov, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <motion.img
                    key={`ov-${ov.src}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={ov.src}
                    alt=""
                    className="absolute object-contain pointer-events-none"
                    style={{
                      top: `${ov.top}%`, left: `${ov.left}%`,
                      width: `${ov.width}%`, height: `${ov.height}%`,
                    }}
                    draggable={false}
                  />
                ))}
              </AnimatePresence>

              {/* Target drop area (invisible pointer interactive zone) */}
              {!isSolved && !hasDropped && <TawaZone isSolved={isSolved} pos={dropTargetPos} />}

              {/* STATE 2 Success Transition Image overlay */}
              <AnimatePresence>
                {showSuccessOverlay && successTransitionImage && (
                  <motion.img
                    key="success-transition-ov"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={successTransitionImage}
                    alt=""
                    className="absolute pointer-events-none"
                    style={
                      /image_018|image_022|image_023|image_024|image_025|image_026|image_027|image_028|image_030|image_031|image_032/.test(successTransitionImage)
                        ? {
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 20,
                        }
                        : {
                          top: `${dropTargetPos.top}%`,
                          left: `${dropTargetPos.left}%`,
                          width: `${dropTargetPos.width}%`,
                          height: `${dropTargetPos.height}%`,
                          objectFit: 'contain',
                          zIndex: 20,
                        }
                    }
                    draggable={false}
                  />
                )}
              </AnimatePresence>

              {/* Dialogue bubble */}
              {(() => {
                const activeDialogue = isCompletedState
                  ? dialogues.find((d) => d.showAfterSolve)
                  : dialogues.find((d) => !d.showAfterSolve);

                if (!activeDialogue) return null;

                return (
                  <SpeechBubble
                    key={`drag-bubble-${activeDialogue.id}-${isCompletedState}`}
                    speaker={activeDialogue.speaker}
                    text={activeDialogue.text}
                    position={activeDialogue.position}
                    tailDirection={activeDialogue.tailDirection}
                    maxWidth="42cqw"
                  />
                );
              })()}


              {/* Success badge overlay */}
              <AnimatePresence>
                {showSuccessBadge && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                  >
                    <div className="bg-emerald-500 text-white font-black rounded-2xl flex items-center shadow-2xl"
                      style={{ gap: '0.8cqw', padding: '1.2cqw 2.5cqw' }}>
                      <Check style={{ width: '2.5cqw', height: '2.5cqw', strokeWidth: 4 }} />
                      <span style={{ fontSize: 'clamp(12px, 2.2cqw, 22px)' }}>Great job!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Floating item during drag */}
      <DragOverlay dropAnimation={null}>
        {activeOption ? <FloatingCard option={activeOption} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
