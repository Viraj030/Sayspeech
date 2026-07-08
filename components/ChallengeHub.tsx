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
      {/* ── CHALLENGE CARDS LIST ── */}
      <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto pt-6 pb-6">
        {modulesList.map((m, index) => {
          const isCompleted = completedModules[m.key];

          return (
            <motion.button
              key={m.key}
              onClick={() => onSelectModule(m.key)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
              className={`relative flex flex-row items-center justify-between text-left p-4 sm:p-5 rounded-[24px] border-[3px] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer select-none outline-none group w-full ${isCompleted
                ? 'bg-emerald-50/80 border-emerald-400'
                : `${m.bgColor} ${m.borderColor} hover:border-indigo-400`
                }`}
            >
              {/* Floating Large Soft Background Icon */}
              <div className="absolute right-2 -bottom-2 text-6xl opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-300">
                {m.icon}
              </div>

              {/* Left Side: Icon & Texts */}
              <div className="flex items-center flex-grow pr-4 z-10 min-w-0">
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl shadow-md border-2 border-white shadow-indigo-100/30 shrink-0 mr-4 group-hover:scale-105 transition-transform`}>
                  <span className="drop-shadow-sm select-none">{m.icon}</span>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 style={{ color: '#1e293b' }} className="text-sm sm:text-lg font-black leading-tight group-hover:text-indigo-600 transition-colors truncate">
                    {m.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm font-bold text-slate-500 leading-snug line-clamp-1">
                    {m.description}
                  </p>
                </div>
              </div>

              {/* Right Side: Play/Replay Button & Status */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
                {isCompleted ? (
                  <div
                    style={{
                      backgroundColor: '#3f51b5',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      fontWeight: 900,
                      color: 'white',
                      border: '3px solid white',
                      boxShadow: '0 4px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    className="flex items-center gap-1 active:translate-y-[2px] transition-all uppercase shrink-0"
                  >
                    Replay
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#4caf50',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      fontWeight: 900,
                      color: 'white',
                      border: '3px solid white',
                      boxShadow: '0 4px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    className="flex items-center gap-1 active:translate-y-[2px] transition-all uppercase shrink-0"
                  >
                    Play
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
