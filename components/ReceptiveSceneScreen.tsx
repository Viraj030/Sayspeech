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

  // Bottom overlay items (batter, masala, oil, spatula, plate)
  const bottomItems = [
    { id: 'batter', image: '/make_a_dosa_images/image_002.png', label: 'Dosa batter' },
    { id: 'masala', image: '/make_a_dosa_images/image_003.png', label: 'Potato filling' },
    { id: 'oil', image: '/make_a_dosa_images/image_004.png', label: 'Oil' },
    { id: 'spatula', image: '/make_a_dosa_images/image_005.png', label: 'Spatula' },
    { id: 'plate', image: '/make_a_dosa_images/image_006.png', label: 'Plate' }
  ];

  // Specific position coordinates on counter to scatter elements naturally (not straight line)
  const itemPositions: Record<string, { left: number; top: number; width: number; height: number }> = {
    batter: { left: 3, top: 80, width: 20, height: 16 },
    masala: { left: 28, top: 80, width: 20, height: 16 },
    oil: { left: 56, top: 78, width: 7, height: 18 },
    spatula: { left: 69, top: 74, width: 5, height: 22 },
    plate: { left: 76, top: 80, width: 22, height: 16 }
  };

  // Map for friendly praise sentences
  const objectPraiseNames: Record<string, string> = {
    oil: 'oil bottle',
    plate: 'plate',
    tawa: 'tawa',
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

          {/* ── Counter items positioned in a horizontal row above the footer (flex layout) ── */}
          <div
            className="absolute bottom-[10%] left-0 right-0 flex items-end justify-around bg-transparent px-4"
            style={{ height: '16%' }}
          >
            {bottomItems.map((item) => {
              const isCorrect = item.id === correctHotspotId && (isSolved || showCorrectTick);
              const isWrongClicked = wrongClickId === item.id;

              // Construct a placeholder hotspot for handleHotspotClick
              const itemHotspot: Hotspot = {
                id: item.id,
                label: item.label,
                x: 0,
                y: 0,
                width: 0,
                height: 0
              };

              return (
                <motion.button
                  key={item.id}
                  onClick={(e) => {
                    // Calculate click coordinates relative to full kitchen scene container
                    const rect = e.currentTarget.getBoundingClientRect();
                    const grandparentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                    if (rect && grandparentRect) {
                      const x = ((rect.left + rect.width / 2 - grandparentRect.left) / grandparentRect.width) * 100;
                      const y = ((rect.top + rect.height / 2 - grandparentRect.top) / grandparentRect.height) * 100;
                      itemHotspot.x = x - 5;
                      itemHotspot.y = y - 5;
                      itemHotspot.width = 10;
                      itemHotspot.height = 10;
                    }
                    handleHotspotClick(itemHotspot);
                  }}
                  disabled={isSolved || !!wrongClickId}
                  style={{
                    height: '11cqw',
                    maxHeight: '90px',
                    width: '18%',
                    zIndex: 30
                  }}
                  className={`relative cursor-pointer border border-transparent select-none bg-transparent hover:bg-transparent outline-none focus:outline-none flex flex-col items-center justify-center transition-all ${isSolved && item.id !== correctHotspotId ? 'opacity-40' : ''
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
          </div>

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

          {/* Mom's Speech Bubble displaying instructions or feedback */}
          <SpeechBubble
            key={`receptive-bubble-${instruction}-${bubbleText}`}
            speaker="mom"
            text={bubbleText}
            position={{ top: 4, left: 2 }}
            tailDirection="down"
            delay={0}
          />
        </div>
      </div>
    </div>
  );
}
