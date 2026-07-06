'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StoryItem, DialogueBubble as DialogueType } from '../types/game';
import SpeechBubble from './SpeechBubble';

// ── Main ─────────────────────────────────────────────────────────────────────
interface StoryItemsScreenProps {
  image: string;
  dialogues?: DialogueType[];
  items: StoryItem[];
  onComplete: () => void;
}

export default function StoryItemsScreen({
  image,
  dialogues = [],
  items,
  onComplete,
}: StoryItemsScreenProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
    if (dialogues.length === 0) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const handleBubbleDone = (idx: number) => {
    if (idx < dialogues.length - 1) {
      setTimeout(() => setVisibleCount(idx + 2), 400);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden select-none p-0">
      <div
        className="relative flex flex-col overflow-hidden w-full h-full"
        style={{
          containerType: 'inline-size',
        }}
      >
        {/* ── Background image fills the whole slide ── */}
        <div className="w-full h-full relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Scene"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Dialogue bubbles */}
          {dialogues.map((d, i) => (
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
          ))}

          {/* ── Static ingredient labels positioned at the bottom table counter ── */}
          <div
            className="absolute bottom-[10%] left-0 right-0 flex items-center justify-around bg-transparent"
            style={{ height: '22%' }}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-[0.5cqw]"
              >
                <div className="flex items-center justify-center" style={{ height: '11cqw', maxHeight: '80px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.label}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                    style={{ maxWidth: '20cqw', maxHeight: '11cqw' }}
                    draggable={false}
                  />
                </div>
                <span style={{ fontSize: 'clamp(9px, 1.6cqw, 15px)' }} className="font-extrabold text-slate-800 whitespace-nowrap mt-1 select-none">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


