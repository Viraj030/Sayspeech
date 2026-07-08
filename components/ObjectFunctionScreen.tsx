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
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 py-2 overflow-y-auto select-none gap-2.5">
      {/* 1. Big Question first */}
      <div className="w-full text-center flex flex-col gap-1 sm:gap-1.5 max-w-2xl shrink-0 mt-0.5">
        <span className="text-[10px] sm:text-xs font-black bg-indigo-100 text-indigo-750 px-3 py-1 rounded-full uppercase tracking-wider self-center border border-indigo-200">
          Question {currentSubQuestionIndex + 1} of {questions.length}
        </span>
        <h2
          style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
          className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug subpixel-antialiased"
        >
          {activeQuestion.questionText}
        </h2>
      </div>

      {/* 2. Below that, 2 divs side-by-side (left: img, right: options) */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-center justify-center gap-6 md:gap-12 flex-grow max-h-[70%]">
        
        {/* Left Side: Image Div */}
        <div className="w-36 h-36 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-gradient-to-br from-violet-50/80 via-white to-white border-[4px] border-slate-800 rounded-[32px] p-6 shadow-xl flex items-center justify-center shrink-0 hover:scale-[1.02] transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={objectName}
            className="max-w-full max-h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Right Side: Options Div */}
        <div className="w-full max-w-md flex flex-col gap-3 justify-center">
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedOptionText === option.text;
            const isWrong = wrongOptions.includes(option.text);
            const isCorrect = option.isCorrect && isSelected;
            const isShaking = shakeOption === option.text;

            let btnClass = 'border-slate-200 text-slate-700 bg-white hover:border-slate-400';
            let iconElement = null;

            if (isCorrect) {
              btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-300';
              iconElement = <Check className="w-5 h-5 text-emerald-600 shrink-0 stroke-[3px]" />;
            } else if (isWrong) {
              btnClass = 'border-rose-450 bg-rose-50 text-rose-800 ring-4 ring-rose-300';
              iconElement = <X className="w-5 h-5 text-rose-500 shrink-0 stroke-[3px]" />;
            } else if (isSelected) {
              btnClass = 'border-indigo-505 bg-indigo-50 text-indigo-800';
            }

            return (
              <motion.button
                key={`${option.text}-${idx}`}
                onClick={() => handleOptionClick(option)}
                disabled={isSolved && !isCorrect}
                className={`w-full text-left p-3.5 sm:p-4.5 rounded-2xl border-[3px] flex items-center justify-between font-black text-sm sm:text-lg shadow-md transition-all ${btnClass} ${isSolved && !isCorrect ? 'cursor-default' : 'cursor-pointer'
                  }`}
                animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={isSolved && !isCorrect ? {} : { scale: 1.02 }}
                whileTap={isSolved && !isCorrect ? {} : { scale: 0.98 }}
              >
                <span className="flex-1 pr-2 leading-tight">{option.text}</span>
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
      <div className="h-8 sm:h-12 flex items-center justify-center shrink-0">
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm font-black shadow-md"
            >
              <Check className="w-5 h-5 stroke-[3px]" />
              <span>Solved! You identified the item and function!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
