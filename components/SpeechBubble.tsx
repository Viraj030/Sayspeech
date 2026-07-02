'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  speaker: 'mom' | 'kid' | 'instruction';
  text: string;
  position: {
    top: number;
    left: number;
  };
  tailDirection: 'left' | 'right' | 'up' | 'down' | 'down-left' | 'down-right' | 'up-left' | 'up-right';
  onComplete?: () => void;
  delay?: number;
}

export default function SpeechBubble({
  speaker,
  text,
  position,
  tailDirection,
  onComplete,
  delay = 0
}: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [hasFinishedTyping, setHasFinishedTyping] = useState(false);
  
  const prevTextRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;
      setDisplayedText('');
      setStartTyping(false);
      setHasFinishedTyping(false);
    }
  }, [text]);

  useEffect(() => {
    if (hasFinishedTyping) return;

    const timer = setTimeout(() => {
      setStartTyping(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, text, hasFinishedTyping]);

  useEffect(() => {
    if (!startTyping || hasFinishedTyping) return;

    if (text.length < 15 || speaker === 'instruction') {
      setDisplayedText(text);
      setHasFinishedTyping(true);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      setDisplayedText((prev) => text.substring(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        setHasFinishedTyping(true);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 25);

    return () => clearInterval(interval);
  }, [startTyping, text, speaker, hasFinishedTyping]);

  let borderClass = 'border-[0.4cqw] border-slate-800 bg-white';
  let textColorClass = 'text-slate-800';

  if (speaker === 'kid') {
    borderClass = 'border-[0.4cqw] border-sky-500 bg-white';
    textColorClass = 'text-sky-900';
  } else if (speaker === 'instruction') {
    borderClass = 'border-[0.4cqw] border-indigo-400 bg-indigo-50/95';
    textColorClass = 'text-indigo-955';
  }

  // Adjusted absolute layout for proportional responsive 16:9 scaling
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}%`,
    left: `${position.left}%`,
    zIndex: 30,
    width: 'auto',
    maxWidth: '28cqw', // Constrains bubble width relative to canvas width
    minWidth: '15cqw',
    fontSize: '2cqw',
    borderWidth: '0.4cqw',
    borderRadius: '1.6cqw',
    padding: '1.1cqw 1.6cqw font-extrabold',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  };

  const renderTail = () => {
    if (speaker === 'instruction') return null;

    let tailStyle: React.CSSProperties = {
      position: 'absolute',
      width: '1.4cqw',
      height: '1.4cqw',
      background: 'white',
      borderStyle: 'solid',
      borderWidth: '0.4cqw',
      borderColor: speaker === 'kid' ? '#0ea5e9' : '#1e293b',
      transform: 'rotate(45deg)',
      zIndex: -1
    };

    switch (tailDirection) {
      case 'down':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.9cqw',
          left: '30%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'down-left':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.9cqw',
          left: '15%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'down-right':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.9cqw',
          right: '15%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'left':
        tailStyle = {
          ...tailStyle,
          left: '-0.9cqw',
          top: '40%',
          borderTop: 'none',
          borderRight: 'none'
        };
        break;
      case 'right':
        tailStyle = {
          ...tailStyle,
          right: '-0.9cqw',
          top: '40%',
          borderBottom: 'none',
          borderLeft: 'none'
        };
        break;
      case 'up':
        tailStyle = {
          ...tailStyle,
          top: '-0.9cqw',
          left: '30%',
          borderBottom: 'none',
          borderRight: 'none'
        };
        break;
      default:
        tailStyle = {
          ...tailStyle,
          bottom: '-0.9cqw',
          left: '30%',
          borderTop: 'none',
          borderLeft: 'none'
        };
    }

    return <div style={tailStyle} />;
  };

  return (
    <motion.div
      style={positionStyle}
      initial={{ scale: 0, opacity: 0 }}
      animate={startTyping ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`font-black select-none ${borderClass} ${textColorClass}`}
    >
      <div className="relative w-full h-full">
        {/* Invisible sizing base */}
        <p className="whitespace-pre-wrap leading-normal invisible select-none pointer-events-none" aria-hidden="true">
          {text}
        </p>
        
        {/* Visible typed overlays */}
        <p className="absolute inset-0 whitespace-pre-wrap leading-normal">
          {hasFinishedTyping ? text : displayedText}
        </p>
      </div>
      {renderTail()}
    </motion.div>
  );
}
