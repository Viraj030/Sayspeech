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
      className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 p-4 sm:p-8 w-full max-w-4xl mx-auto overflow-y-auto sm:overflow-hidden text-center sm:text-left h-full"
    >
      {/* Left side: Branding text & Play button */}
      <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-5 max-w-md">
        {/* Decorative Badge */}
        <div className="flex items-center gap-1.5 bg-[#fef9c3] border-2 border-[#eab308]/40 text-[#ca8a04] px-4 py-1.5 rounded-full text-xs font-black shadow-sm shrink-0">
          <Sparkles className="w-3.5 h-3.5 fill-[#ca8a04]" />
          <span>Speech Therapy Game</span>
        </div>

        {/* Branding text */}
        <div className="flex flex-col gap-2 shrink-0">
          <h2 className="text-3xl sm:text-5xl font-black text-[#9333ea] tracking-wide leading-none drop-shadow-sm font-display uppercase">
            {title}
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed mt-1 max-w-sm sm:max-w-none">
            {description}
          </p>
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onStart}
          style={{
            backgroundColor: '#4caf50',
            borderRadius: '40px',
            padding: '10px 24px',
            fontSize: '1rem',
            fontWeight: 900,
            color: 'white',
            cursor: 'pointer',
            border: '4px solid white',
            boxShadow: '0 6px 0 rgba(0, 0, 0, 0.15)',
          }}
          className="flex items-center gap-3 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#4caf50] shrink-0">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <span className="tracking-wide">Start Activity</span>
        </motion.button>
      </div>

      {/* Right side: Image Banner with thick white frame */}
      <div className="relative w-[180px] sm:w-[360px] aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl flex items-center justify-center p-0 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/make_a_dosa_images/image_001.png"
          alt="Mom and Child making dosa"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
