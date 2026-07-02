'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, Play, Award, Sparkles, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#fdfae6' }} className="min-h-screen flex flex-col font-sans select-none antialiased">
      {/* Top Hero Header */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 sm:py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-black text-slate-800 font-display">
            Say<span className="text-indigo-600">Speech</span>
          </span>
        </div>

        <span className="text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
          Speech Therapy Platform
        </span>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center max-w-5xl w-full mx-auto px-6 py-4 sm:py-12 gap-8 sm:gap-12">
        {/* Pitch / Title Banner */}
        <div className="text-center max-w-2xl flex flex-col gap-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight leading-none font-display"
          >
            Learn to Speak with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Interactive Play!
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-xl font-bold text-slate-700 leading-relaxed max-w-lg mx-auto"
          >
            Engaging, research-backed games designed by experts to support developmental language, sequencing, and expression.
          </motion.p>
        </div>

        {/* Dashboard Games Section */}
        <div className="w-full flex justify-center mt-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Game Card */}
            <Link href="/games/make-dosa" className="group block">
              <div style={{ borderRadius: '32px' }} className="bg-white border border-slate-150 group-hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-4 relative overflow-hidden group-hover:scale-[1.02]">
                {/* Visual Thumbnail */}
                <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/make_a_dosa_images/image_001.png"
                    alt="Make A Dosa"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    draggable={false}
                  />

                  {/* Category overlay label */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 flex items-center gap-1 shadow-sm">
                    <ChefHat className="w-3 h-3" />
                    <span>COOKING THEME</span>
                  </div>
                </div>

                {/* Card description */}
                <div className="flex flex-col gap-1.5 px-1.5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      Make A Dosa
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center shadow-inner group-hover:shadow-md transition-all duration-200">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-normal">
                    Follow the narrative steps, drag cooking tools on the tawa, learn vocabulary, and practice WH questions!
                  </p>
                </div>

                {/* Skills Targeted list */}
                <div className="flex flex-wrap gap-2 px-1 py-1.5 border-t border-slate-100 mt-2">
                  <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
                    Sequencing
                  </span>
                  <span className="text-[10px] sm:text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-100">
                    Vocabulary
                  </span>
                  <span className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold border border-indigo-100">
                    WH Questions
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-8 border-t border-slate-200 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          © {new Date().getFullYear()} SaySpeech. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Interactive Learning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-slate-400" />
            <span>Premium UI/UX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
