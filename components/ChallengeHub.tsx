'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ChallengeHubProps {
  completedModules: Record<string, boolean>;
  onSelectModule: (moduleKey: string) => void;
}

export default function ChallengeHub({
  completedModules,
  onSelectModule,
}: ChallengeHubProps) {
  const modulesList = [
    {
      key: 'story',
      title: 'Make a Dosa (Story)',
      description: 'Follow Aarav and Mom as they prepare a delicious masala dosa!',
      icon: '🍳',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200',
    },
    {
      key: 'receptiveLanguage',
      title: 'Receptive & Expressive Language',
      description: 'Point to the correct kitchen items to build your vocabulary!',
      icon: '📚',
      color: 'from-sky-400 to-blue-500',
      bgColor: 'bg-sky-50/70',
      borderColor: 'border-sky-200',
    },
    {
      key: 'objectFunction',
      title: 'Object Function',
      description: 'Learn what kitchen tools are and how we use them to cook!',
      icon: '🥣',
      color: 'from-violet-400 to-indigo-500',
      bgColor: 'bg-violet-50/70',
      borderColor: 'border-violet-200',
    },
    {
      key: 'sentenceBuilding',
      title: 'Sentence Building',
      description: 'Put the words in the correct order to make complete sentences!',
      icon: '📝',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-200',
    },
    {
      key: 'whQuestions',
      title: 'WH Questions',
      description: 'Answer who, what, where, and why questions about cooking!',
      icon: '❓',
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50/70',
      borderColor: 'border-orange-200',
    },
    {
      key: 'sequencing',
      title: 'Sequencing',
      description: 'Put the cooking steps in the correct order to make a dosa!',
      icon: '🧩',
      color: 'from-teal-400 to-emerald-500',
      bgColor: 'bg-teal-50/70',
      borderColor: 'border-teal-200',
    },
  ];

  const completedCount = modulesList.filter((m) => completedModules[m.key]).length;
  const totalCount = modulesList.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex-1 flex flex-col w-full h-full max-w-4xl mx-auto px-4 py-2 sm:py-3 overflow-y-auto min-h-0 select-none">

      {/* ── PROGRESS BAR PANEL ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/95 rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-100 flex flex-col gap-2.5 mb-3 sm:mb-4 shrink-0 relative overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute -right-12 -top-12 w-28 h-28 bg-yellow-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Progress label + count */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
            Challenge Progress
          </span>
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-100">
            {completedCount} / {totalCount} Completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>
          <span className="text-[11px] font-black text-slate-600 w-9 text-right shrink-0">
            {progressPercent}%
          </span>
        </div>
      </motion.div>

      {/* ── CHALLENGE CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 justify-items-stretch w-full">
        {modulesList.map((m, index) => {
          const isCompleted = completedModules[m.key];

          return (
            <motion.button
              key={m.key}
              onClick={() => onSelectModule(m.key)}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col text-left p-4 rounded-[24px] border-[3px] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer select-none outline-none group min-h-[135px] ${
                isCompleted
                  ? 'bg-emerald-50/40 border-emerald-500 shadow-emerald-50/30'
                  : `${m.bgColor} ${m.borderColor} hover:border-indigo-400 hover:shadow-indigo-100/50`
              }`}
            >
              {/* Floating Large Soft Background Icon */}
              <div className="absolute right-2 -bottom-2 text-6xl opacity-[0.06] select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
                {m.icon}
              </div>

              {/* Top Row: Icon and Completion Tag */}
              <div className="flex justify-between items-start w-full mb-2.5 shrink-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xl shadow-md border-2 border-white shadow-indigo-100/30 shrink-0`}>
                  <span className="drop-shadow-sm select-none">{m.icon}</span>
                </div>

                {/* Status indicator */}
                {isCompleted ? (
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[9px] font-black border border-emerald-200 shadow-sm shrink-0">
                    <CheckCircle2 className="w-3 h-3 fill-current text-emerald-600" />
                    <span>COMPLETED</span>
                  </span>
                ) : (
                  <span className="bg-slate-200/80 text-slate-650 px-2 py-0.5 rounded-full text-[8px] font-black tracking-wider uppercase border border-slate-300 shadow-sm shrink-0">
                    PLAY
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-0.5 z-10 w-full flex-grow">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                  {m.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 leading-snug line-clamp-2">
                  {m.description}
                </p>
              </div>

              {/* Completed Decorative Ribbon */}
              {isCompleted && (
                <div className="absolute -right-12 -top-12 w-24 h-24 bg-emerald-500 rotate-45 flex items-end justify-center pb-1 shadow-md pointer-events-none border border-emerald-600">
                  <CheckCircle2 className="w-4 h-4 text-white -rotate-45 mb-1.5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
