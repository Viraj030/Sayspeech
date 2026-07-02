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
      className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 p-4 sm:p-8 max-w-4xl mx-auto overflow-hidden text-center sm:text-left h-full animate-fade-in"
    >
      {/* Left side: Branding text & Play button */}
      <div className="flex flex-col items-center sm:items-start gap-4 max-w-md">
        {/* Decorative Badge */}
        <div className="flex items-center gap-1.5 bg-[#fef9c3] border-2 border-[#eab308]/40 text-[#ca8a04] px-4 py-1 rounded-full text-xs font-black shadow-sm shrink-0">
          <Sparkles className="w-3.5 h-3.5 fill-[#ca8a04]" />
          <span>Speech Therapy Game</span>
        </div>

        {/* Branding text */}
        <div className="flex flex-col gap-2 shrink-0">
          <h2 className="text-3xl sm:text-5xl font-black text-[#9333ea] tracking-wide leading-none drop-shadow-sm font-display uppercase">
            {title}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed mt-1">
            {description}
          </p>
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-8 py-3 bg-[#26a69a] hover:bg-[#00897b] text-white font-black rounded-full text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 uppercase border border-white/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Game</span>
        </motion.button>
      </div>

      {/* Right side: Image Banner */}
      <div className="relative w-full max-w-[200px] sm:max-w-[320px] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-[3px] border-slate-800 bg-white flex items-center justify-center p-2 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/make_a_dosa_images/image_001.png"
          alt="Mom and Child making dosa"
          className="max-w-full max-h-full object-contain rounded-2xl pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
