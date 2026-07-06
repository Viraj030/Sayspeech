'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DialogueBubble as DialogueType } from '../types/game';
import SpeechBubble from './SpeechBubble';

// ─────────────────────────────────────────────────────────────────────────────
// StoryScreen
// ─────────────────────────────────────────────────────────────────────────────
interface StoryScreenProps {
  image: string;
  dialogues?: DialogueType[];
  onDialogueComplete?: () => void;
  leftPanelImage?: string;
  initialOverlays?: { src: string; top: number; left: number; width: number; height: number }[];
  bottomItems?: { id: string; image: string; label: string }[];
  showBottomLabels?: boolean;
}

export default function StoryScreen({
  image,
  dialogues = [],
  onDialogueComplete,
  leftPanelImage,
  initialOverlays = [],
  bottomItems = [],
  showBottomLabels = false,
}: StoryScreenProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
    if (dialogues.length === 0 && onDialogueComplete) {
      onDialogueComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const handleBubbleDone = (idx: number) => {
    if (idx < dialogues.length - 1) {
      setTimeout(() => setVisibleCount(idx + 2), 400);
    } else {
      setTimeout(() => { if (onDialogueComplete) onDialogueComplete(); }, 600);
    }
  };

  const hasLeftPanel = !!leftPanelImage;

  return (
    <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden select-none p-0">
      <div
        className="relative flex overflow-hidden w-full h-full"
        style={{
          containerType: 'inline-size',
        }}
      >
        {/* Left panel (e.g., action card on slide 7) */}
        {hasLeftPanel && (
          <div
            className="flex-shrink-0 flex flex-col items-center justify-center bg-[#e8f4f0] border-r-2 border-slate-700 overflow-hidden"
            style={{ width: '26%', height: '100%' }}
          >
            <div className="flex-1 flex items-center justify-center p-[2cqw]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leftPanelImage}
                alt="Action"
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* Main scene */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ height: '100%' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Scene"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Static overlays */}
          {initialOverlays.map((ov, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`ov-${i}`}
              src={ov.src}
              alt=""
              className="absolute object-contain pointer-events-none"
              style={{
                top: `${ov.top}%`, left: `${ov.left}%`,
                width: `${ov.width}%`, height: `${ov.height}%`,
              }}
              draggable={false}
            />
          ))}

          {/* Bottom items row */}
          {bottomItems && bottomItems.length > 0 && (
            <div
              className="absolute bottom-[10%] left-0 right-0 flex items-end justify-around bg-transparent px-4"
              style={{ height: '18%', zIndex: 28 }}
            >
              {bottomItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center select-none"
                  style={{ width: '18%' }}
                >
                  <div className="flex items-center justify-center" style={{ height: '10cqw', maxHeight: '75px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.label}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  {/* {showBottomLabels && (
                    <span
                      className="font-extrabold text-slate-800 text-center leading-tight whitespace-nowrap mt-1 select-none border-2 border-slate-700 bg-white rounded shadow-sm"
                      style={{ fontSize: 'clamp(9px, 1.4cqw, 13px)', padding: '2px 6px' }}
                    >
                      {item.label}
                    </span>
                  )} */}
                </div>
              ))}
            </div>
          )}

          {/* Dialogue bubbles — revealed one at a time via visibleCount */}
          {dialogues.map((d, i) =>
            i < visibleCount ? (
              <SpeechBubble
                key={`${d.id}-${image}`}
                speaker={d.speaker}
                text={d.text}
                position={d.position}
                tailDirection={d.tailDirection}
                onComplete={() => handleBubbleDone(i)}
                delay={0}
                maxWidth="42cqw"
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

