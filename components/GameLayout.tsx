'use client';

import React, { useState } from 'react';
import { Home, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div style={{ backgroundColor: '#fdfae6' }} className="h-screen w-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none font-sans antialiased">
      {/* Immersive Green tablet frame filling viewport exactly */}
      <div
        className={`w-full ${isWide ? 'max-w-3xl' : 'max-w-3xl'} h-full rounded-[24px] sm:rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300`}
        style={{
          backgroundColor: '#66bb6a',
          border: '8px solid #4caf50',
        }}
      >

        {/* Compact Header (fixed height, zero padding waste) */}
        <header className="relative flex items-center px-4 pt-3.5 pb-2.5 shrink-0 select-none">
          {/* HOME Button */}
          <button
            onClick={onHome}
            style={{
              backgroundColor: '#ff5252',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 900,
              color: 'white',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 6px 0 rgba(0, 0, 0, 0.15)',
            }}
            className="flex items-center gap-1.5 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 z-10"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* Activity Title (uppercase bold white) */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-xl font-black text-white tracking-wider font-display drop-shadow-sm uppercase text-center truncate px-2 z-0">
            {activityName}
          </h1>
        </header>

        {/* Main Content Area (stretches dynamically, min-h-0 prevents overflow scrolling) */}
        <main className="flex-1 flex items-center justify-center relative min-h-0 w-full overflow-hidden">
          {children}
        </main>

        {/* Floating absolute Footer */}
        <footer className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 z-20 pointer-events-none select-none">
          {/* PREV button */}
          <button
            onClick={onPrev}
            disabled={disablePrev}
            style={{
              backgroundColor: disablePrev ? '#a0a0a0' : '#ff9800',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 900,
              color: 'white',
              cursor: disablePrev ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: disablePrev ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
              opacity: disablePrev ? 0.4 : 1,
            }}
            className="flex items-center gap-1 pointer-events-auto active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3px]" />
            <span>Prev</span>
          </button>

          {/* Single-line Progress bar and label */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-4 flex items-center justify-center gap-3 text-white pointer-events-auto bg-black/20 px-4 py-2.5 rounded-2xl backdrop-blur-[2px] shadow-sm">
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
            style={{
              backgroundColor: disableNext ? '#a0a0a0' : '#009688',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 900,
              color: 'white',
              cursor: disableNext ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: disableNext ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
              opacity: disableNext ? 0.4 : 1,
            }}
            className="flex items-center gap-1 pointer-events-auto active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </footer>
      </div>
    </div>
  );
}
