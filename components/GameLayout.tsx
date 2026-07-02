'use client';

import React, { useState } from 'react';
import { Home, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface GameLayoutProps {
  currentStepIndex: number;
  totalSteps: number;
  activityName: string;
  onNext: () => void;
  onPrev: () => void;
  disableNext: boolean;
  disablePrev: boolean;
  children: React.ReactNode;
  onHome: () => void;
  isWide?: boolean;
}

export default function GameLayout({
  currentStepIndex,
  totalSteps,
  activityName,
  onNext,
  onPrev,
  disableNext,
  disablePrev,
  children,
  onHome,
  isWide = false
}: GameLayoutProps) {
  const [audioMuted, setAudioMuted] = useState(false);

  const handleAudioToggle = () => {
    setAudioMuted((prev) => !prev);
    console.log(`[Audio Engine] Toggle mute state: ${!audioMuted}`);
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none font-sans antialiased">
      {/* Immersive Green tablet frame filling viewport exactly */}
      <div className={`w-full ${isWide ? 'max-w-3xl' : 'max-w-3xl'} h-full bg-[#58b368] rounded-[24px] sm:rounded-[32px] p-2.5 flex flex-col shadow-2xl border-4 border-slate-700/20 relative overflow-hidden transition-all duration-300`}>

        {/* Compact Header (fixed height, zero padding waste) */}
        <header className="flex items-center justify-between px-2 py-1.5 shrink-0 select-none">
          {/* HOME Button */}
          <button
            onClick={onHome}
            className="flex items-center gap-1 bg-[#ff5b5b] hover:bg-[#e04a4a] text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Home</span>
          </button>

          {/* Activity Title (uppercase bold white) */}
          <h1 className="text-sm sm:text-xl font-black text-white tracking-wider font-display drop-shadow-sm uppercase text-center truncate px-2">
            {activityName}
          </h1>

          {/* AUDIO Button */}
          <button
            onClick={handleAudioToggle}
            className={`flex items-center gap-1 ${audioMuted ? 'bg-slate-500' : 'bg-[#9b59b6] hover:bg-[#8e44ad]'
              } text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase shrink-0`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Audio</span>
          </button>
        </header>

        {/* Main Content Area (stretches dynamically, min-h-0 prevents overflow scrolling) */}
        <main className="flex-1 flex items-center justify-center relative min-h-0 w-full overflow-hidden">
          {children}
        </main>

        {/* Compact Footer (Single horizontal line, minimal vertical height) */}
        <footer className="flex items-center justify-between px-2 py-1.5 shrink-0 mt-1 sm:mt-2 select-none">
          {/* PREV button */}
          <button
            onClick={onPrev}
            disabled={disablePrev}
            className="flex items-center gap-1 bg-[#f0ad4e] hover:bg-[#ec971f] disabled:bg-slate-400/50 disabled:opacity-40 text-white font-black text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-white/25 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3px]" />
            <span>Prev</span>
          </button>

          {/* Single-line Progress bar and label */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-3 flex items-center justify-center gap-3 text-white">
            <span className="text-[10px] sm:text-xs font-black tracking-wide uppercase drop-shadow-sm whitespace-nowrap shrink-0">
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
            <div className="w-full">
              <ProgressBar current={currentStepIndex + 1} total={totalSteps} />
            </div>
          </div>

          {/* NEXT button */}
          <button
            onClick={onNext}
            disabled={disableNext}
            className={`flex items-center gap-1 text-white font-black text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-white/25 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 ${disableNext
              ? 'bg-slate-400/50 opacity-40'
              : 'bg-[#26a69a] hover:bg-[#00897b]'
              }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </footer>
      </div>
    </div>
  );
}
