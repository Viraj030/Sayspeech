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
  maxWidth?: string;
}

export default function SpeechBubble({
  speaker,
  text,
  position,
  tailDirection,
  onComplete,
  delay = 0,
  maxWidth = '42cqw'
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

  let borderBg = '#ffffff';
  let borderColor = '#1e293b';
  let textColorClass = 'text-slate-800';
  let txtColor = '#1e293b';

  if (speaker === 'kid') {
    borderBg = '#eff6ff';
    borderColor = '#3b82f6';
    textColorClass = 'text-sky-900';
    txtColor = '#0c4a6e';
  } else if (speaker === 'instruction') {
    borderBg = '#f5f3ff';
    borderColor = '#818cf8';
    textColorClass = 'text-indigo-950';
    txtColor = '#1e1b4b';
  }

  const borderThickness = '0.35cqw';

  // Adjusted absolute layout for proportional responsive 16:9 scaling
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}%`,
    left: `${position.left}%`,
    zIndex: 30,
    width: 'auto',
    maxWidth: maxWidth,
    minWidth: '15cqw',
    fontSize: '1.9cqw',
    borderStyle: 'solid',
    borderWidth: borderThickness,
    borderColor: borderColor,
    borderRadius: '1.5cqw',
    padding: '1cqw 1.5cqw',
    background: borderBg,
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  };

  const renderTail = () => {
    if (speaker === 'instruction') return null;

    let tailStyle: React.CSSProperties = {
      position: 'absolute',
      width: '1.3cqw',
      height: '1.3cqw',
      background: borderBg,
      borderStyle: 'solid',
      borderWidth: borderThickness,
      borderColor: borderColor,
      transform: 'rotate(45deg)',
      zIndex: -1
    };

    switch (tailDirection) {
      case 'down':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.85cqw',
          left: '30%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'down-left':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.85cqw',
          left: '15%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'down-right':
        tailStyle = {
          ...tailStyle,
          bottom: '-0.85cqw',
          right: '15%',
          borderTop: 'none',
          borderLeft: 'none'
        };
        break;
      case 'left':
        tailStyle = {
          ...tailStyle,
          left: '-0.85cqw',
          top: '40%',
          borderTop: 'none',
          borderRight: 'none'
        };
        break;
      case 'right':
        tailStyle = {
          ...tailStyle,
          right: '-0.85cqw',
          top: '40%',
          borderBottom: 'none',
          borderLeft: 'none'
        };
        break;
      case 'up':
        tailStyle = {
          ...tailStyle,
          top: '-0.85cqw',
          left: '30%',
          borderBottom: 'none',
          borderRight: 'none'
        };
        break;
      case 'up-left':
        tailStyle = {
          ...tailStyle,
          top: '-0.85cqw',
          left: '15%',
          borderBottom: 'none',
          borderRight: 'none'
        };
        break;
      case 'up-right':
        tailStyle = {
          ...tailStyle,
          top: '-0.85cqw',
          right: '15%',
          borderBottom: 'none',
          borderLeft: 'none'
        };
        break;
      default:
        tailStyle = {
          ...tailStyle,
          bottom: '-0.85cqw',
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
      className={`font-black select-none ${textColorClass}`}
    >
      <div className="relative w-full h-full">
        {/* Invisible sizing base */}
        <p style={{ color: txtColor }} className="whitespace-pre-wrap leading-normal invisible select-none pointer-events-none" aria-hidden="true">
          {text}
        </p>

        {/* Visible typed overlays */}
        <p style={{ color: txtColor }} className="absolute inset-0 whitespace-pre-wrap leading-normal">
          {hasFinishedTyping ? text : displayedText}
        </p>
      </div>
      {renderTail()}
    </motion.div>
  );
}

