'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StoryItem, DialogueBubble as DialogueType } from '../types/game';

// ── Typing bubble ─────────────────────────────────────────────────────────────
function Bubble({
  dialogue,
  visible,
  onDone,
}: {
  dialogue: DialogueType;
  visible: boolean;
  onDone: () => void;
}) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;
    setText('');
    setDone(false);
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setText(dialogue.text.substring(0, i));
      if (i >= dialogue.text.length) {
        clearInterval(ref.current!);
        setDone(true);
        onDone();
      }
    }, 22);
    return () => { if (ref.current) clearInterval(ref.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, dialogue.id]);

  if (!visible) return null;

  const isMom = dialogue.speaker === 'mom';
  const isKid = dialogue.speaker === 'kid';
  const bg = isKid ? '#eff6ff' : isMom ? '#fff' : '#eef2ff';
  const border = isKid ? '#3b82f6' : isMom ? '#1e293b' : '#6366f1';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        position: 'absolute',
        top: `${dialogue.position.top}%`,
        left: `${dialogue.position.left}%`,
        zIndex: 30,
        maxWidth: '42%',
        minWidth: '16%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: bg,
          border: `2.5px solid ${border}`,
          borderRadius: '16px',
          padding: '8px 14px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
          fontSize: 'clamp(10px, 1.7cqw, 15px)',
          fontWeight: 500,
          color: '#1e293b',
          lineHeight: 1.4,
          position: 'relative',
        }}
      >
        {/* Pre-size ghost */}
        <p style={{ visibility: 'hidden', margin: 0, whiteSpace: 'pre-wrap' }} aria-hidden>
          {dialogue.text}
        </p>
        {/* Typed overlay */}
        <p style={{
          position: 'absolute', top: '8px', left: '14px', right: '14px',
          margin: 0, whiteSpace: 'pre-wrap'
        }}>
          {done ? dialogue.text : text}
        </p>
        {/* Tail */}
        {(() => {
          const base: React.CSSProperties = {
            position: 'absolute',
            width: 12, height: 12,
            background: bg,
            border: `2.5px solid ${border}`,
            transform: 'rotate(45deg)',
          };
          const td = dialogue.tailDirection;
          if (td === 'down' || td === 'down-left')
            return <div style={{ ...base, bottom: -7, left: td === 'down-left' ? '15%' : '35%', borderTop: 'none', borderLeft: 'none' }} />;
          if (td === 'down-right')
            return <div style={{ ...base, bottom: -7, right: '15%', borderTop: 'none', borderLeft: 'none' }} />;
          return null;
        })()}
      </div>
    </motion.div>
  );
}

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
        className="relative bg-black rounded-2xl shadow-xl flex flex-col overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'calc((100vh - 150px) * 1.25)',
          maxHeight: 'calc(100vh - 150px)',
          aspectRatio: '1402 / 1122',
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
            <Bubble
              key={`${d.id}-${image}`}
              dialogue={d}
              visible={i < visibleCount}
              onDone={() => handleBubbleDone(i)}
            />
          ))}

          {/* ── Static ingredient labels positioned at the bottom table counter ── */}
          <div
            className="absolute bottom-[3%] left-0 right-0 flex items-center justify-around bg-transparent"
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
