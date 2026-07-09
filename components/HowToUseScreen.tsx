'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HowToUseScreen() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-cover bg-center pt-6 px-1.5 pb-20 sm:pb-24 select-none"
      style={{
        backgroundImage: "url('/make_a_dosa_images/game-bg.jpg')",
      }}
    >
      {/* Semi-transparent Overlay */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      {/* Main Instruction Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-[20px] p-5 sm:p-6 shadow-xl flex flex-col border-[2px] border-dashed border-[#1e88e5] text-slate-800 text-xs sm:text-sm md:text-base leading-snug sm:leading-relaxed"
      >
        <p className="font-bold mb-3 sm:mb-4">
          Follow the engaging story of a mother and child preparing a dosa together. As you progress through the activity, read the narrative and complete each step by dragging the appropriate item from the left side to its correct position on the right.
        </p>

        <p className="font-bold mb-2">
          Designed to support multiple communication and language goals within a meaningful context, this activity targets:
        </p>

        <ul className="list-disc pl-5 space-y-2 mb-3 sm:mb-4 font-medium">
          <li>
            <strong className="text-slate-900">Language Development:</strong> Enhances comprehension and expressive language through action-based instructions and story-based learning.
          </li>
          <li>
            <strong className="text-slate-900">Sequencing Skills:</strong> Develops the ability to understand and organize events in a logical order by following the steps involved in preparing a dosa.
          </li>
          <li>
            <strong className="text-slate-900">WH-Question Comprehension:</strong> Encourages understanding and answering of <em>who, what, where, when</em>, and <em>why</em> questions related to the story and activity.
          </li>
          <li>
            <strong className="text-slate-900">Functional Vocabulary:</strong> Introduces and reinforces everyday cooking and kitchen-related vocabulary, promoting real-world language learning.
          </li>
        </ul>

        <p className="font-medium text-slate-600 text-xs sm:text-sm">
          By combining storytelling, interactive learning, and functional life skills, this activity provides a motivating and meaningful way to build communication, comprehension, and cognitive-linguistic skills.
        </p>
      </motion.div>
    </div>
  );
}
