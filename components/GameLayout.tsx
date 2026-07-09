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
    <div style={{ backgroundColor: '#fdfae6' }} className="h-screen w-screen flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden select-none font-sans antialiased">
      {/* Wrapper to hold the game screen and the side buttons together */}
      <div className={`relative w-full ${isWide ? 'max-w-3xl' : 'max-w-3xl'} h-full flex items-center justify-center`}>
        {/* Immersive Green tablet frame filling viewport exactly */}
        <div
          className={`w-full h-full rounded-[24px] sm:rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300`}
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
                  {activityName !== 'Say Speech' && (
                    <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
                  )}
                  <h1 className={`text-sm sm:text-2xl font-black text-white font-display drop-shadow-md text-center truncate ${activityName === 'Say Speech' ? 'tracking-normal' : 'tracking-widest uppercase'}`}>
                    {activityName}
                  </h1>
                  {activityName !== 'Say Speech' && (
                    <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
                  )}
                </div>
                {/* Small yellow underline curve */}
                {activityName !== 'Say Speech' && (
                  <div className="w-[45%] h-1 sm:h-1.5 bg-[#fef08a] rounded-full mt-0.5" />
                )}
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

          {/* Navigation moved outside */}
        </div>

        {/* Side Navigation Buttons (Outside the game screen, but close to it) */}
        {!hideFooter && (
          <>
            {/* PREV button */}
            <button
              onClick={onPrev}
              disabled={disablePrev}
              style={{
                backgroundColor: disablePrev ? '#a0a0a0' : '#ff9800',
                borderRadius: '50%',
                color: 'white',
                cursor: disablePrev ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: disablePrev ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
                opacity: disablePrev ? 0.4 : 1,
              }}
              className="absolute -left-3 sm:-left-6 md:-left-20 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 active:translate-y-[calc(-50%+3px)] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all disabled:cursor-not-allowed w-12 h-12 sm:w-14 sm:h-14 shadow-lg scale-75 sm:scale-100"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3px] -ml-1" />
            </button>

            {/* NEXT button */}
            <button
              onClick={onNext}
              disabled={disableNext}
              style={{
                backgroundColor: disableNext ? '#a0a0a0' : '#009688',
                borderRadius: '50%',
                color: 'white',
                cursor: disableNext ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: disableNext ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.15)',
                opacity: disableNext ? 0.4 : 1,
              }}
              className="absolute -right-3 sm:-right-6 md:-right-20 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 active:translate-y-[calc(-50%+3px)] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all disabled:cursor-not-allowed w-12 h-12 sm:w-14 sm:h-14 shadow-lg scale-75 sm:scale-100"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3px] -mr-1" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
