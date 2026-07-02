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
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });
      onSolved();
    } else {
      playSound('wrong');
      setWrongOptionIds((prev) => [...prev, option.id]);
      setShakeId(option.id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-3 sm:gap-4 overflow-hidden py-1">
      {/* Quiz Category Header */}
      <span className="text-[10px] sm:text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest shrink-0 select-none">
        WH Question
      </span>

      {/* Question Card */}
      <div className="text-center w-full px-2 shrink-0 select-none">
        <h2 className="text-base sm:text-xl font-black text-slate-800 leading-snug">
          {question}
        </h2>
      </div>

      {/* Options Grid Layout (Displayed Vertically) */}
      <div className="w-full flex flex-col gap-2.5 sm:gap-3 px-3 sm:px-5 max-w-md mx-auto">
        {shuffledOptions.map((option) => {
          const isSelected = selectedId === option.id;
          const isWrong = wrongOptionIds.includes(option.id);
          const isCorrect = option.isCorrect && isSolved;
          const isShaking = shakeId === option.id;

          let btnClass = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 text-slate-700 bg-white';
          let iconElement = null;

          if (isCorrect) {
            btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400 shadow-emerald-50';
            iconElement = (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1.2, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-emerald-600 stroke-[3px]" />
              </motion.div>
            );
          } else if (isWrong) {
            btnClass = 'border-rose-450 bg-rose-50 text-rose-800 shadow-rose-50';
            iconElement = <X className="w-4 h-4 text-rose-500 shrink-0" />;
          } else if (isSelected) {
            btnClass = 'border-indigo-500 bg-indigo-50 text-indigo-800';
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={isSolved && !isCorrect}
              className={`relative w-full p-3.5 sm:p-4 pr-12 rounded-xl border-2 flex items-center justify-center font-extrabold text-sm sm:text-base transition-all shadow-sm ${btnClass} ${
                isSolved && !isCorrect ? 'opacity-50 cursor-default' : 'active:scale-[0.98] cursor-pointer'
              }`}
              animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : isCorrect ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.4 }}
              whileHover={isSolved ? {} : { scale: 1.01 }}
            >
              <span className="text-center w-full break-words">{option.text}</span>
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
