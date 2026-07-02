'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompletionScreenProps {
  title: string;
  subtitle: string;
  onRestart: () => void;
}

export default function CompletionScreen({ title, subtitle, onRestart }: CompletionScreenProps) {
  // Fire confetti upon load
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.1, y: 0.6 }
    });
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.9, y: 0.6 }
    });
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-grow flex flex-col items-center justify-center text-center p-2 gap-3 sm:gap-4 max-w-md mx-auto overflow-hidden shrink-0"
    >
      {/* Animated Trophy Icon */}
      <motion.div
        initial={{ rotate: -15, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
        className="w-16 h-16 sm:w-24 sm:h-24 bg-amber-50 rounded-full flex items-center justify-center border-[3px] border-amber-300 shadow-md text-amber-500 shrink-0"
      >
        <Trophy className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce" />
      </motion.div>

      {/* Celebration Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-900 max-w-xs mx-auto leading-relaxed mt-1">
          {subtitle}
        </p>
      </div>

      {/* Reset button */}
      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-black rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 uppercase"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Play Again</span>
      </motion.button>
    </motion.div>
  );
}
