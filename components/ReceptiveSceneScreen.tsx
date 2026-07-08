'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hotspot } from '../types/game';
import { playSound } from '../lib/sound';
import SpeechBubble from './SpeechBubble';

interface ReceptiveSceneScreenProps {
  backgroundImage: string;
  instruction: string;
  correctHotspotId: string;
  hotspots: Hotspot[];
  onSolved: () => void;
  isSolved: boolean;
}

const BASE_BOTTOM_ITEMS = [
  { id: 'batter', image: '/make_a_dosa_images/image_002.png', label: 'Dosa batter' },
  { id: 'masala', image: '/make_a_dosa_images/image_003.png', label: 'Potato filling' },
  { id: 'oil', image: '/make_a_dosa_images/image_004.png', label: 'Oil' },
  { id: 'spatula', image: '/make_a_dosa_images/image_005.png', label: 'Spatula' },
  { id: 'plate', image: '/make_a_dosa_images/image_006.png', label: 'Plate' }
];

export default function ReceptiveSceneScreen({
  backgroundImage,
  instruction,
  correctHotspotId,
  hotspots,
  onSolved,
  isSolved
}: ReceptiveSceneScreenProps) {
  // Speech bubble text
  const [bubbleText, setBubbleText] = useState(instruction);

  // Feedback states
  const [wrongClickId, setWrongClickId] = useState<string | null>(null);
  const [showWrongX, setShowWrongX] = useState<string | null>(null);
  const [showCorrectTick, setShowCorrectTick] = useState(false);

  // Specific position coordinates on counter to scatter elements naturally (not straight line)
  const itemPositions: Record<string, { left: number; top: number; width: number; height: number }> = {
    batter: { left: 3, top: 65, width: 20, height: 20 },
    masala: { left: 20, top: 82, width: 20, height: 16 },
    oil: { left: 45, top: 80, width: 7, height: 18 },
    spatula: { left: 62, top: 78, width: 5, height: 23 },
    plate: { left: 67, top: 72, width: 22, height: 16 }
  };

  // Map for friendly praise sentences
  const objectPraiseNames: Record<string, string> = {
    oil: 'oil bottle',
    plate: 'plate',
    tawa: 'pan',
    batter: 'dosa batter',
    fridge: 'refrigerator',
    spatula: 'spatula',
    masala: 'potato filling',
    stove: 'gas stove'
  };

  // Sync instruction when slide changes
  useEffect(() => {
    setBubbleText(instruction);
    setWrongClickId(null);
    setShowWrongX(null);
    setShowCorrectTick(false);
  }, [instruction]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isSolved || wrongClickId) return;

    if (hotspot.id === correctHotspotId) {
      // Correct click
      playSound('correct');
      setShowCorrectTick(true);

      // Calculate hotspot midpoint to fire confetti from
      const originX = (hotspot.x + hotspot.width / 2) / 100;
      const originY = (hotspot.y + hotspot.height / 2) / 100;

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x: 0.5, y: 0.5 }
      });

      const praiseName = objectPraiseNames[hotspot.id] || hotspot.label.toLowerCase();
      setBubbleText(`Great Job! That's the ${praiseName}!`);

      // Auto advance delay (2.5 seconds)
      setTimeout(() => {
        onSolved();
      }, 2500);

    } else {
      // Wrong click
      playSound('wrong');
      setWrongClickId(hotspot.id);
      setShowWrongX(hotspot.id);
      setBubbleText('Oops! Try again.');

      // Reset state after 1.5 seconds
      setTimeout(() => {
        setWrongClickId(null);
        setShowWrongX(null);
        setBubbleText(instruction);
      }, 1500);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden select-none p-0">
      <div
        className="relative flex flex-col overflow-hidden w-full h-full"
        style={{
          containerType: 'inline-size'
        }}
      >
        {/* Full-Screen Illustrated Kitchen Background */}
        <div className="w-full h-full relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt="Kitchen Scene"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* ── Counter items positioned absolutely on the counter according to itemPositions ── */}
          {BASE_BOTTOM_ITEMS.map((item) => {
            const pos = itemPositions[item.id];
            if (!pos) return null;

            const isCorrect = item.id === correctHotspotId && (isSolved || showCorrectTick);
            const isWrongClicked = wrongClickId === item.id;

            // Construct a placeholder hotspot for handleHotspotClick
            const itemHotspot: Hotspot = {
              id: item.id,
              label: item.label,
              x: pos.left,
              y: pos.top,
              width: pos.width,
              height: pos.height
            };

            return (
              <motion.button
                key={item.id}
                onClick={() => handleHotspotClick(itemHotspot)}
                disabled={isSolved || !!wrongClickId}
                style={{
                  position: 'absolute',
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  width: `${pos.width}%`,
                  height: `${pos.height}%`,
                  zIndex: 30
                }}
                className={`cursor-pointer border border-transparent select-none bg-transparent hover:bg-transparent outline-none focus:outline-none flex items-center justify-center transition-all ${isSolved && item.id !== correctHotspotId ? 'opacity-40' : ''
                  }`}
                animate={isWrongClicked ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.label}
                  className="max-h-full max-w-full object-contain pointer-events-none"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  draggable={false}
                />

                {/* Correct selection checkmark overlay */}
                <AnimatePresence>
                  {isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none"
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-14 h-14 text-emerald-500 drop-shadow-md"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={6.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wrong selection cross overlay */}
                <AnimatePresence>
                  {showWrongX === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none"
                    >
                      <svg
                        className="w-12 h-12 text-rose-500 drop-shadow-md"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={6.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Interactive Clickable Hotspots (Invisible overlays for background items only) */}
          {hotspots
            .filter((h) => !['batter', 'masala', 'oil', 'spatula', 'plate'].includes(h.id))
            .map((h) => {
              const isCorrect = h.id === correctHotspotId && (isSolved || showCorrectTick);
              const isWrongClicked = wrongClickId === h.id;

              return (
                <motion.button
                  key={h.id}
                  onClick={() => handleHotspotClick(h)}
                  disabled={isSolved || !!wrongClickId}
                  style={{
                    position: 'absolute',
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    width: `${h.width}%`,
                    height: `${h.height}%`,
                    zIndex: 25
                  }}
                  className={`absolute cursor-pointer border border-transparent select-none bg-transparent hover:bg-transparent outline-none focus:outline-none flex items-center justify-center ${isSolved && h.id !== correctHotspotId ? 'opacity-40' : ''
                    }`}
                  animate={isWrongClicked ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {/* Correct selection checkmark overlay (Raw checkmark, no circle, no borders) */}
                  <AnimatePresence>
                    {isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none"
                      >
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="w-14 h-14 text-emerald-500 drop-shadow-md"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={6.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Wrong selection cross overlay (Raw cross, no circle) */}
                  <AnimatePresence>
                    {showWrongX === h.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none"
                      >
                        <svg
                          className="w-12 h-12 text-rose-500 drop-shadow-md"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={6.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

          {/* Top-Right Question & Feedback Box */}
          <motion.div
            key={`receptive-feedback-${bubbleText}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-[4%] right-[10%] z-30 max-w-[35cqw] min-w-[25cqw] border-[0.35cqw] rounded-[2cqw] p-[1.5cqw_2.5cqw] shadow-xl text-center select-none font-black flex items-center justify-center"
            style={{
              backgroundColor: bubbleText.includes('Great Job')
                ? '#ecfdf5' // soft green
                : bubbleText.includes('Oops')
                  ? '#fff1f2' // soft red
                  : '#f5f3ff', // soft violet for question
              borderColor: bubbleText.includes('Great Job')
                ? '#10b981'
                : bubbleText.includes('Oops')
                  ? '#f43f5e'
                  : '#818cf8',
              color: bubbleText.includes('Great Job')
                ? '#065f46'
                : bubbleText.includes('Oops')
                  ? '#9f1239'
                  : '#1e1b4b',
              fontSize: (bubbleText.includes('Great Job') || bubbleText.includes('Oops'))
                ? '2.4cqw'
                : '3cqw',
            }}
          >
            {bubbleText}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
