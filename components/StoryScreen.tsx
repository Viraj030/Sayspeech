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
  isCentered?: boolean;
  isBgTop?: boolean;
}

export default function StoryScreen({
  image,
  dialogues = [],
  onDialogueComplete,
  leftPanelImage,
  initialOverlays = [],
  bottomItems = [],
  showBottomLabels = false,
  isCentered = false,
  isBgTop = false,
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
            className={`w-full h-full object-top pointer-events-none ${isBgTop ? 'object-top' : 'object-center'}`}
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

          {/* Items scattered on counter (Receptive Scene style) */}
          {bottomItems && bottomItems.length > 0 && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 28 }}>
              {bottomItems.map((item) => {
                const itemPositions: Record<string, { left: number; top: number; width: number; height: number }> = {
                  batter: { left: 6, top: 82, width: 23, height: 20 },
                  masala: { left: 28, top: 82, width: 23, height: 20 },
                  oil: { left: 51, top: 81, width: 10, height: 18 },
                  spatula: { left: 65, top: 77, width: 8, height: 23 },
                  plate: { left: 74, top: 84, width: 24, height: 16 }
                };
                
                const pos = itemPositions[item.id];
                if (!pos) return null;
                
                return (
                  <div
                    key={item.id}
                    className="absolute flex items-center justify-center select-none pointer-events-auto"
                    style={{
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      width: `${pos.width}%`,
                      height: `${pos.height}%`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.label}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                );
              })}
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
                isCentered={isCentered}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

