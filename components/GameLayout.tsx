'use client';

import React, { useState } from 'react';
import { Home, Volume2, VolumeX, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
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
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideHome?: boolean;
  onReset?: () => void;
  resetLabel?: string;
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
  isWide = false,
  hideFooter = false,
  hideHeader = false,
  hideHome = false,
  onReset,
  resetLabel
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
        {!hideHeader && (
          <header className="relative flex items-center px-4 pt-3.5 pb-2.5 min-h-[56px] sm:min-h-[68px] shrink-0 select-none">
            {/* HOME Button */}
            {!hideHome && (
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
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* Activity Title (uppercase bold white with yellow rays and curve underline) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none select-none z-0">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
                <h1 className="text-sm sm:text-2xl font-black text-white tracking-widest font-display drop-shadow-md uppercase text-center truncate">
                  {activityName}
                </h1>
                <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
              </div>
              {/* Small yellow underline curve */}
              <div className="w-[45%] h-1 sm:h-1.5 bg-[#fef08a] rounded-full mt-0.5" />
            </div>

            {/* RESET Button */}
            {onReset && (
              <button
                onClick={onReset}
                style={{
                  backgroundColor: '#3f51b5',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: 'white',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 6px 0 rgba(0, 0, 0, 0.15)',
                  marginLeft: 'auto',
                }}
                className="flex items-center gap-1.5 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 z-10 group"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">{resetLabel || 'Reset'}</span>
              </button>
            )}
          </header>
        )}

        {/* Main Content Area (stretches dynamically, min-h-0 prevents overflow scrolling) */}
        <main className="flex-1 flex items-center justify-center relative min-h-0 w-full overflow-hidden">
          {children}
        </main>

        {/* Floating absolute Footer */}
        {!hideFooter && (
          <footer className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 z-20 pointer-events-none select-none">
            {/* PREV button */}
            <button
              onClick={onPrev}
              disabled={disablePrev}
              style={{
                backgroundColor: disablePrev ? '#a0a0a0' : '#ff9800',
                borderRadius: '20px',
                color: 'white',
                cursor: disablePrev ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: disablePrev ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
                opacity: disablePrev ? 0.4 : 1,
              }}
              className="flex items-center gap-1 pointer-events-auto active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 disabled:cursor-not-allowed px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base font-black"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3px]" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Single-line Progress bar and label */}
            {/* <div className="flex-1 max-w-sm sm:max-w-md mx-4 flex items-center justify-center gap-3 text-white pointer-events-auto bg-black/20 px-4 py-2.5 rounded-2xl backdrop-blur-[2px] shadow-sm">
            <span className="text-[10px] sm:text-xs font-black tracking-wide uppercase drop-shadow-sm whitespace-nowrap shrink-0">
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
            <div className="w-full">
              <ProgressBar current={currentStepIndex + 1} total={totalSteps} />
            </div>
          </div> */}

            {/* NEXT button */}
            <button
              onClick={onNext}
              disabled={disableNext}
              style={{
                backgroundColor: disableNext ? '#a0a0a0' : '#009688',
                borderRadius: '20px',
                color: 'white',
                cursor: disableNext ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: disableNext ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
                opacity: disableNext ? 0.4 : 1,
              }}
              className="flex items-center gap-1 pointer-events-auto active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 disabled:cursor-not-allowed px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base font-black"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
