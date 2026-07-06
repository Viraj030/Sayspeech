'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';
import { ObjectFunctionQuestion } from '../types/game';

interface ObjectFunctionScreenProps {
  image: string;
  objectName: string;
  questions: ObjectFunctionQuestion[];
  onSolved: () => void;
  isSolved: boolean;
  currentSubQuestionIndex: number;
  setCurrentSubQuestionIndex: (idx: number) => void;
  selectedOptionText: string | null;
  setSelectedOptionText: (txt: string | null) => void;
}

export default function ObjectFunctionScreen({
  image,
  objectName,
  questions,
  onSolved,
  isSolved,
  currentSubQuestionIndex,
  setCurrentSubQuestionIndex,
  selectedOptionText,
  setSelectedOptionText
}: ObjectFunctionScreenProps) {
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);

  const activeQuestion = questions[currentSubQuestionIndex];

  // Shuffle options and reset states on active question load
  useEffect(() => {
    setWrongOptions([]);
    setShakeOption(null);
    if (activeQuestion) {
      const arr = [...activeQuestion.options];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledOptions(arr);
    }
  }, [objectName, currentSubQuestionIndex, activeQuestion]);

  const handleOptionClick = (option: { text: string; isCorrect: boolean }) => {
    if (isSolved) return;
    if (selectedOptionText && activeQuestion.options.find(o => o.text === selectedOptionText)?.isCorrect) return;

    setSelectedOptionText(option.text);

    if (option.isCorrect) {
      playSound('correct');
      if (currentSubQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentSubQuestionIndex(currentSubQuestionIndex + 1);
          setSelectedOptionText(null);
        }, 1200);
      } else {
        confetti({ particleCount: 80, spread: 60, origin: { x: 0.5, y: 0.5 } });
        onSolved();
      }
    } else {
      playSound('wrong');
      setWrongOptions((prev) => [...prev, option.text]);
      setShakeOption(option.text);
      setTimeout(() => setShakeOption(null), 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full gap-2 sm:gap-4 overflow-hidden">
      {/* Category Tag */}
      <span className="text-[10px] sm:text-xs font-black text-violet-600 bg-violet-50 px-3 py-0.5 rounded-full border border-violet-100 uppercase tracking-widest shrink-0">
        Object Function
      </span>

      {/* Responsive layout: flex-col on mobile, grid on desktop */}
      <div className="w-full flex flex-col sm:grid sm:grid-cols-[260px_1fr] sm:grid-rows-[auto_1fr] gap-3 sm:gap-x-8 sm:gap-y-2 mt-1 max-w-2xl px-4 items-center sm:items-start justify-center">
        
        {/* Top: Compact Question Info (col-start-2 row-start-1 on desktop) */}
        <div className="w-full flex flex-col gap-1 sm:col-start-2 sm:row-start-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1 shrink-0">
            <span className="text-[9px] sm:text-xs font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
              Q {currentSubQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <h3 className="text-xs sm:text-base font-black text-slate-800 leading-snug">
            {activeQuestion.questionText}
          </h3>
        </div>

        {/* Middle/Left: Compact Object Image Card (col-start-1 row-start-1 row-span-2 on desktop) */}
        <div className="w-36 h-36 sm:w-60 sm:h-60 bg-gradient-to-br from-violet-50/80 via-white to-white border-[3px] border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-center shrink-0 sm:col-start-1 sm:row-start-1 sm:row-span-2 hover:scale-[1.02] transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={objectName}
            className="max-w-full max-h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Bottom/Right: Answer Options (col-start-2 row-start-2 on desktop) */}
        <div className="w-full flex flex-col gap-2 sm:col-start-2 sm:row-start-2">
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedOptionText === option.text;
            const isWrong = wrongOptions.includes(option.text);
            const isCorrect = option.isCorrect && isSelected;
            const isShaking = shakeOption === option.text;

            let btnClass = 'border-slate-200 text-slate-700 bg-white';
            let iconElement = null;

            if (isCorrect) {
              btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400';
              iconElement = <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
            } else if (isWrong) {
              btnClass = 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-300';
              iconElement = <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
            } else if (isSelected) {
              btnClass = 'border-indigo-500 bg-indigo-50 text-indigo-800';
            }

            return (
              <motion.button
                key={`${option.text}-${idx}`}
                onClick={() => handleOptionClick(option)}
                disabled={isSolved && !isCorrect}
                className={`w-full text-left p-2.5 sm:p-3.5 rounded-xl border-2 flex items-center justify-between font-extrabold text-xs sm:text-sm shadow-sm transition-all ${btnClass} ${isSolved && !isCorrect ? 'cursor-default' : 'cursor-pointer'
                  }`}
                animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={isSolved && !isCorrect ? {} : { scale: 1.025 }}
                whileTap={isSolved && !isCorrect ? {} : { scale: 0.98 }}
              >
                <span className="flex-1 pr-2 truncate">{option.text}</span>
                <AnimatePresence mode="wait">
                  {iconElement && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
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

      {/* Success checklist overlay placeholder */}
      <div className="h-8 sm:h-10 flex items-center justify-center shrink-0">
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-250 text-[10px] sm:text-xs font-black shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Solved! You identified the item and function!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
