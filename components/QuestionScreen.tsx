'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';
import { QuizOption } from '../types/game';

interface QuestionScreenProps {
  question: string;
  options: QuizOption[];
  onSolved: () => void;
  isSolved: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function QuestionScreen({
  question,
  options,
  onSolved,
  isSolved,
  selectedId,
  setSelectedId
}: QuestionScreenProps) {
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<QuizOption[]>([]);

  // Fisher-Yates Shuffle
  const shuffle = (array: QuizOption[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Clear wrong list & shuffle options if question changes
  useEffect(() => {
    setWrongOptionIds([]);
    setShakeId(null);
    setShuffledOptions(shuffle(options));
  }, [question, options]);

  const handleOptionClick = (option: QuizOption) => {
    if (isSolved) return; // Locked once solved

    setSelectedId(option.id);

    if (option.isCorrect) {
      playSound('correct');
      confetti({ particleCount: 80, spread: 60, origin: { x: 0.5, y: 0.5 } });
      onSolved();
    } else {
      playSound('wrong');
      setWrongOptionIds((prev) => [...prev, option.id]);
      setShakeId(option.id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-4 sm:gap-6 overflow-hidden py-3">

      {/* Question Card */}
      <div className="text-center w-full px-4 shrink-0 select-none">
        <h2 className="text-xl sm:text-3xl font-black text-slate-800 leading-snug">
          {question}
        </h2>
      </div>

      {/* Options Grid Layout (Displayed Vertically) */}
      <div className="w-full flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 max-w-md mx-auto">
        {shuffledOptions.map((option) => {
          const isSelected = selectedId === option.id;
          const isWrong = wrongOptionIds.includes(option.id);
          const isCorrect = option.isCorrect && isSolved;
          const isShaking = shakeId === option.id;

          let btnClass = 'border-slate-250 text-slate-700 bg-white hover:border-slate-400';
          let iconElement = null;

          if (isCorrect) {
            btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-300 shadow-emerald-50';
            iconElement = (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1.2, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="flex items-center justify-center animate-pulse"
              >
                <Check className="w-6 h-6 text-emerald-600 stroke-[3px]" />
              </motion.div>
            );
          } else if (isWrong) {
            btnClass = 'border-rose-400 bg-rose-50 text-rose-800 ring-4 ring-rose-300 shadow-rose-50';
            iconElement = <X className="w-5 h-5 text-rose-500 shrink-0 stroke-[3px]" />;
          } else if (isSelected) {
            btnClass = 'border-indigo-500 bg-indigo-50 text-indigo-800';
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={isSolved && !isCorrect}
              className={`relative w-full p-4 sm:p-5 pr-12 rounded-2xl border-[3px] flex items-center justify-center font-black text-base sm:text-xl transition-all shadow-md ${btnClass} ${
                isSolved && !isCorrect ? 'opacity-50 cursor-default' : 'cursor-pointer'
              }`}
              animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : isCorrect ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.4 }}
              whileHover={isSolved ? {} : { scale: 1.02 }}
              whileTap={isSolved ? {} : { scale: 0.98 }}
            >
              <span className="text-center w-full break-words leading-tight">{option.text}</span>
              <AnimatePresence>
                {iconElement && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
                  >
                    {iconElement}
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
