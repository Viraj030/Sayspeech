'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sound';

interface RewardPopupProps {
  activityName: string;
  onClaim: () => void;
}

export default function RewardPopup({ activityName, onClaim }: RewardPopupProps) {
  // Fire confetti on load and play success sound
  useEffect(() => {
    playSound('correct');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 }
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.5, y: 0.5 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.5, y: 0.5 }
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const handleClaimClick = () => {
    playSound('click');
    onClaim();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative bg-gradient-to-b from-emerald-50 via-white to-emerald-50 border-4 border-emerald-300 w-full max-w-sm rounded-[36px] p-8 shadow-2xl text-center flex flex-col items-center justify-center gap-5 overflow-hidden"
      >
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-200/20 via-transparent to-transparent pointer-events-none" />

        {/* Floating Sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-12 -left-12 w-24 h-24 text-emerald-200/40 pointer-events-none"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>

        {/* Big animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-400 shadow-xl shrink-0"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>

        {/* Challenge Completed Banner */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <motion.h2
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none"
          >
            Challenge Completed! 🎉
          </motion.h2>
          <p className="text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-1 rounded-full border border-emerald-200 mt-1">
            {activityName}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs leading-relaxed">
            Great job! You finished the activity. Keep going to complete all challenges!
          </p>
        </div>

        {/* Claim Button */}
        <motion.button
          onClick={handleClaimClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: '#10b981',
            borderRadius: '24px',
            padding: '12px 40px',
            fontSize: '0.9rem',
            fontWeight: 900,
            color: 'white',
            cursor: 'pointer',
            border: '3px solid white',
            boxShadow: '0 6px 0 rgba(0, 0, 0, 0.15)',
          }}
          className="active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 tracking-wide"
        >
          Continue! 🚀
        </motion.button>
      </motion.div>
    </div>
  );
}
