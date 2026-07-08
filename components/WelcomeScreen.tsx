'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

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
      className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 w-full max-w-2xl mx-auto overflow-y-auto text-center h-full select-none"
    >
      {/* Centered Branding text at the top */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <h2 className="text-3xl sm:text-5xl font-black text-[#9333ea] tracking-wide leading-none drop-shadow-sm font-display uppercase text-center">
          {title}
        </h2>
        <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed max-w-md mx-auto text-center">
          {description}
        </p>
      </div>

      {/* Large Centered Image Banner */}
      <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-[4/3] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl flex items-center justify-center p-0 shrink-0 border-4 border-white bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/make_a_dosa_images/image_001.png"
          alt="Mom and Child making dosa"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Centered Play Button below the image */}
      <motion.button
        onClick={onStart}
        style={{
          backgroundColor: '#4caf50',
          borderRadius: '40px',
          padding: '12px 28px',
          fontSize: '1.05rem',
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
    </motion.div>
  );
}
