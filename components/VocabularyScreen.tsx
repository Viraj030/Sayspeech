'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';
import { VocabularyOption } from '../types/game';

interface VocabularyScreenProps {
  instruction: string;
  options: VocabularyOption[];
  correctOptionId: string;
  onSolved: () => void;
  isSolved: boolean;
}

export default function VocabularyScreen({
  instruction,
  options,
  correctOptionId,
  onSolved,
  isSolved
}: VocabularyScreenProps) {
  const [clickedIds, setClickedIds] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [wrongSelectionIds, setWrongSelectionIds] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<VocabularyOption[]>([]);

  // Fisher-Yates Shuffle
  const shuffle = (array: VocabularyOption[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Reset states & shuffle options if instruction changes
  useEffect(() => {
    setClickedIds([]);
    setShakeId(null);
    setWrongSelectionIds([]);
    setShuffledOptions(shuffle(options));
  }, [instruction, options]);

  const handleCardClick = (optionId: string) => {
    if (isSolved) return;

    setClickedIds((prev) => [...prev, optionId]);

    if (optionId === correctOptionId) {
      playSound('correct');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });
      onSolved();
    } else {
      playSound('wrong');
      setWrongSelectionIds((prev) => [...prev, optionId]);
      setShakeId(optionId);
      setTimeout(() => setShakeId(null), 500);
      setTimeout(() => {
        setWrongSelectionIds((prev) => prev.filter((id) => id !== optionId));
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-3 sm:gap-5 overflow-hidden py-2">
      {/* Category Tag */}
      <span className="text-[10px] sm:text-xs font-black text-teal-600 bg-teal-50 px-4 py-1 rounded-full border border-teal-100 uppercase tracking-widest shrink-0 select-none">
        Vocabulary Practice
      </span>

      {/* Point to Prompt */}
      <div className="text-center shrink-0 select-none">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 leading-snug">
          Point to the <span className="text-indigo-600 bg-indigo-50 px-4 py-1 rounded-2xl border border-indigo-100 inline-block font-black uppercase">{instruction.replace('Point to the ', '')}</span>
        </h2>
      </div>

      {/* Grid of Options - Solid cards background */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center w-full max-w-2xl mt-1 px-4">
        {shuffledOptions.map((option) => {
          const isClicked = clickedIds.includes(option.id);
          const isCorrect = option.id === correctOptionId && isSolved;
          const isShaking = shakeId === option.id;

          let borderClass = 'border-slate-200';
          if (isCorrect) {
            borderClass = 'border-emerald-500 ring-2 ring-emerald-300 shadow-emerald-50';
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              disabled={isSolved && !isCorrect}
              className={`relative w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center  transition-all duration-200 overflow-hidden outline-none ${borderClass} ${isSolved && !isCorrect ? 'opacity-40 cursor-default' : 'active:scale-95 cursor-pointer'
                }`}
              animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-full h-full p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={option.image}
                  alt=""
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Wrong selection red X overlay */}
              <AnimatePresence>
                {wrongSelectionIds.includes(option.id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <svg className="w-12 h-12 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Correct selection green Tick overlay with Pop animation */}
              <AnimatePresence>
                {isCorrect && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-14 h-14 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
