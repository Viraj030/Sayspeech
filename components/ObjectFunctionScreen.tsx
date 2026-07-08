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
  customImageHeight?: string;
  imageClassName?: string;
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
  setSelectedOptionText,
  customImageHeight = "h-40 sm:h-56 md:h-64",
  imageClassName = ""
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
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 py-2 overflow-y-auto select-none gap-4">
      {/* 1. Image on top (enlarged, transparent background, no borders/shadows, custom height) */}
      <div className={`w-44 sm:w-64 md:w-72 ${customImageHeight} flex items-center justify-center shrink-0 hover:scale-[1.02] transition-transform duration-300`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={objectName}
          className={`max-w-full max-h-full object-contain select-none pointer-events-none ${imageClassName}`}
          draggable={false}
        />
      </div>

      {/* 2. Below that, the Question block */}
      <div className="w-full text-center flex flex-col gap-1 sm:gap-1.5 max-w-2xl shrink-0 mt-0.5">
        <span
          className="text-[10px] sm:text-xs font-black bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider self-center border border-indigo-200"
          style={{ color: '#312e81', backgroundColor: '#e0e7ff', borderColor: '#c7d2fe' }}
        >
          Question {currentSubQuestionIndex + 1} of {questions.length}
        </span>
        <h2
          style={{ color: '#0f172a', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
          className="text-lg sm:text-2xl font-black tracking-tight leading-snug subpixel-antialiased"
        >
          {activeQuestion.questionText}
        </h2>
      </div>

      {/* 3. Below that, the Options column */}
      <div className="w-full max-w-md flex flex-col gap-3 justify-center items-center px-4 shrink-0">
        {shuffledOptions.map((option, idx) => {
          const isSelected = selectedOptionText === option.text;
          const isWrong = wrongOptions.includes(option.text);
          const isCorrect = option.isCorrect && isSelected;
          const isShaking = shakeOption === option.text;

          let inlineStyle: React.CSSProperties = {
            color: '#334155',
            borderColor: '#cbd5e1',
            backgroundColor: '#ffffff',
          };
          let iconElement = null;

          if (isCorrect) {
            inlineStyle = {
              color: '#065f46',
              borderColor: '#10b981',
              backgroundColor: '#ecfdf5',
              boxShadow: '0 0 0 4px #6ee7b7',
            };
            iconElement = <Check className="w-5 h-5 text-emerald-600 shrink-0 stroke-[3px]" />;
          } else if (isWrong) {
            inlineStyle = {
              color: '#991b1b',
              borderColor: '#f43f5e',
              backgroundColor: '#fff1f2',
              boxShadow: '0 0 0 4px #fda4af',
            };
            iconElement = <X className="w-5 h-5 text-rose-500 shrink-0 stroke-[3px]" />;
          } else if (isSelected) {
            inlineStyle = {
              color: '#3730a3',
              borderColor: '#6366f1',
              backgroundColor: '#e0e7ff',
            };
          }

          return (
            <motion.button
              key={`${option.text}-${idx}`}
              onClick={() => handleOptionClick(option)}
              disabled={isSolved && !isCorrect}
              className={`w-full text-center p-3 sm:p-4 rounded-2xl border-[3px] flex items-center justify-between font-black text-sm sm:text-lg shadow-md transition-all ${isSolved && !isCorrect ? 'cursor-default' : 'cursor-pointer'
                }`}
              style={inlineStyle}
              animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              whileHover={isSolved && !isCorrect ? {} : { scale: 1.02 }}
              whileTap={isSolved && !isCorrect ? {} : { scale: 0.98 }}
            >
              <span className="flex-1 text-center leading-tight">{option.text}</span>
              <AnimatePresence mode="wait">
                {iconElement && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 shrink-0"
                  >
                    {iconElement}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Success checklist overlay placeholder */}
      <div className="h-8 sm:h-12 flex items-center justify-center shrink-0">
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm font-black shadow-md"
              style={{ color: '#047857', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
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
