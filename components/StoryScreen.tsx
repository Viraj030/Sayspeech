'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DialogueBubble as DialogueType } from '../types/game';

// ─────────────────────────────────────────────────────────────────────────────
// Bubble: types text in, then stays — never disappears
// ─────────────────────────────────────────────────────────────────────────────
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

  const isKid = dialogue.speaker === 'kid';
  const isInstruction = dialogue.speaker === 'instruction';
  const bg = isKid ? '#eff6ff' : isInstruction ? '#eef2ff' : '#ffffff';
  const border = isKid ? '#3b82f6' : isInstruction ? '#6366f1' : '#1e293b';
  const txtColor = isKid ? '#0c4a6e' : isInstruction ? '#1e1b4b' : '#1e293b';

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
        maxWidth: '44%',
        minWidth: '14%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: bg,
          border: `2.5px solid ${border}`,
          borderRadius: 16,
          padding: '8px 14px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
          fontSize: 'clamp(10px, 1.7cqw, 15px)',
          fontWeight: 500,
          color: txtColor,
          lineHeight: 1.4,
          position: 'relative',
        }}
      >
        {/* Ghost text pre-sizes the bubble */}
        <p style={{ visibility: 'hidden', margin: 0, whiteSpace: 'pre-wrap', color: txtColor }} aria-hidden>
          {dialogue.text}
        </p>
        {/* Visible typed overlay */}
        <p style={{
          position: 'absolute', top: 8, left: 14, right: 14,
          margin: 0, whiteSpace: 'pre-wrap', color: txtColor,
        }}>
          {done ? dialogue.text : text}
        </p>

        {/* Tail */}
        {!isInstruction && (() => {
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
          if (td === 'left')
            return <div style={{ ...base, left: -7, top: '35%', borderRight: 'none', borderTop: 'none' }} />;
          if (td === 'right')
            return <div style={{ ...base, right: -7, top: '35%', borderLeft: 'none', borderBottom: 'none' }} />;
          return <div style={{ ...base, bottom: -7, left: '30%', borderTop: 'none', borderLeft: 'none' }} />;
        })()}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoryScreen
// ─────────────────────────────────────────────────────────────────────────────
interface StoryScreenProps {
  image: string;
  dialogues?: DialogueType[];
  onDialogueComplete?: () => void;
  leftPanelImage?: string;
  initialOverlays?: { src: string; top: number; left: number; width: number; height: number }[];
}

export default function StoryScreen({
  image,
  dialogues = [],
  onDialogueComplete,
  leftPanelImage,
  initialOverlays = [],
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

          {/* Dialogue bubbles — all stay visible once shown */}
          {dialogues.map((d, i) => (
            <Bubble
              key={`${d.id}-${image}`}
              dialogue={d}
              visible={i < visibleCount}
              onDone={() => handleBubbleDone(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
