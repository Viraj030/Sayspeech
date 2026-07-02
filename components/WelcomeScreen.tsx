'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  title: string;
  description: string;
  onStart: () => void;
}

export default function WelcomeScreen({ title, description, onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 p-3 sm:p-6 w-full max-w-3xl mx-auto overflow-y-auto sm:overflow-hidden text-center sm:text-left h-full"
    >
      {/* Left side: Branding text & Play button */}
      <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-4 max-w-md">
        {/* Decorative Badge */}
        <div className="flex items-center gap-1.5 bg-[#fef9c3] border-2 border-[#eab308]/40 text-[#ca8a04] px-3.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-sm shrink-0">
          <Sparkles className="w-3 h-3 fill-[#ca8a04]" />
          <span>Speech Therapy Game</span>
        </div>

        {/* Branding text */}
        <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0">
          <h2 className="text-2xl sm:text-4xl font-black text-[#9333ea] tracking-wide leading-none drop-shadow-sm font-display uppercase">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed mt-0.5 max-w-xs sm:max-w-none">
            {description}
          </p>
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onStart}
          style={{
            backgroundColor: '#009688',
            borderRadius: '20px',
            padding: '8px 20px',
            fontSize: '0.9rem',
            fontWeight: 900,
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 6px 0 rgba(0, 0, 0, 0.15)',
          }}
          className="flex items-center gap-2 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Game</span>
        </motion.button>
      </div>

      {/* Right side: Image Banner */}
      <div className="relative w-[140px] sm:w-[260px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-[2.5px] border-slate-800 bg-white flex items-center justify-center p-1 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/make_a_dosa_images/image_001.png"
          alt="Mom and Child making dosa"
          className="max-w-full max-h-full object-contain rounded-xl pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
