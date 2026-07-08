'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw } from 'lucide-react';

// Import Screens & Components
import GameLayout from '@/components/GameLayout';
import WelcomeScreen from '@/components/WelcomeScreen';
import StoryScreen from '@/components/StoryScreen';
import StoryItemsScreen from '@/components/StoryItemsScreen';
import DragDropScreen from '@/components/DragDropScreen';
import CompletionScreen from '@/components/CompletionScreen';
import QuestionScreen from '@/components/QuestionScreen';
import VocabularyScreen from '@/components/VocabularyScreen';
import SentenceBuilder from '@/components/SentenceBuilder';
import ObjectFunctionScreen from '@/components/ObjectFunctionScreen';
import SequenceScreen from '@/components/SequenceScreen';
import ChallengeHub from '@/components/ChallengeHub';
import RewardPopup from '@/components/RewardPopup';
import ReceptiveSceneScreen from '@/components/ReceptiveSceneScreen';

// Import Data & types
import { gameModules } from '@/data/makeDosa';
import { DragScreenData, GameScreen } from '@/types/game';
import { playSound } from '@/lib/sound';

export default function Home() {
  const router = useRouter();

  // Core navigation states
  const [currentModule, setCurrentModule] = useState<
    'welcome' | 'hub' | 'story' | 'receptiveLanguage' | 'objectFunction' | 'sentenceBuilding' | 'whQuestions' | 'sequencing' | null
  >('welcome');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);

  // Autoplay timer ref
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Completion states
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    story: false,
    receptiveLanguage: false,
    objectFunction: false,
    sentenceBuilding: false,
    whQuestions: false,
    sequencing: false
  });

  // Reward Modal states
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [justCompletedModule, setJustCompletedModule] = useState<string | null>(null);

  // Answer tracking states
  const [solvedSteps, setSolvedSteps] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, string | null>>({});
  const [currentSubQuestionIndices, setCurrentSubQuestionIndices] = useState<Record<string, number>>({});
  const [selectedObjectFunctionTexts, setSelectedObjectFunctionTexts] = useState<Record<string, string | null>>({});

  // Check if all 6 challenges are completed
  const isAllCompleted =
    completedModules.story &&
    completedModules.receptiveLanguage &&
    completedModules.objectFunction &&
    completedModules.sentenceBuilding &&
    completedModules.whQuestions &&
    completedModules.sequencing;

  // Load progress from localStorage on mount (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sayspeech_dosa_progress');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.completedModules) setCompletedModules(parsed.completedModules);
        } catch (e) {
          console.error('[Progress Engine] Failed to parse progress:', e);
        }
      }
    }
  }, []);

  // Save progress helper
  const saveProgress = (newCompleted: any, newModule: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'sayspeech_dosa_progress',
        JSON.stringify({
          completedModules: newCompleted,
          currentModule: newModule
        })
      );
    }
  };

  // Trigger confetti continuously on final celebration mount
  useEffect(() => {
    if (currentModule === 'hub' && isAllCompleted) {
      playSound('correct');
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.5, y: 0.5 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentModule, isAllCompleted]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, []);

  // Current active slide array
  const isGameplay = currentModule && currentModule !== 'welcome' && currentModule !== 'hub';
  const currentModuleSlides = isGameplay ? gameModules[currentModule] || [] : [];
  const totalSteps = currentModuleSlides.length;
  const currentStep = isGameplay ? currentModuleSlides[currentStepIndex] : null;

  const handleSolveStep = (stepId: string) => {
    setSolvedSteps((prev) => ({ ...prev, [stepId]: true }));

    // Autoplay transition logic for "make a dosa" (story & drag slides)
    if (currentStep) {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

      if (currentStep.type === 'story' || currentStep.type === 'story-items') {
        // Dialogue finished: auto advance after 1.5 seconds
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          handleNext();
        }, 1500);
      } else if (currentStep.type === 'drag') {
        // Drag-drop finished: auto advance after 2.2 seconds to show result
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          handleNext();
        }, 2200);
      }
    }
  };

  const isCurrentStepSolved = () => {
    if (!currentStep) return false;
    if (currentStep.type === 'welcome' || currentStep.type === 'completion') return true;
    return !!solvedSteps[currentStep.id];
  };

  const handleNext = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    // If not solved, block advancing
    if (!isCurrentStepSolved()) return;
    playSound('click');

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // End of the active module
      if (currentModule && isGameplay) {
        const completedKey = currentModule;
        setJustCompletedModule(completedKey);
        const nextCompleted = { ...completedModules, [completedKey]: true };
        setCompletedModules(nextCompleted);
        saveProgress(nextCompleted, 'hub');
        setShowRewardPopup(true);
      }
    }
  };

  const handlePrev = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    if (currentStepIndex > 0) {
      playSound('click');
      const currentStepToReset = currentModuleSlides[currentStepIndex];
      const targetStep = currentModuleSlides[currentStepIndex - 1];
      const stepsToReset = [currentStepToReset, targetStep].filter(Boolean);

      if (stepsToReset.length > 0) {
        setSolvedSteps((prev) => {
          const next = { ...prev };
          stepsToReset.forEach((s) => {
            delete next[s.id];
          });
          return next;
        });

        setSelectedQuizAnswers((prev) => {
          const next = { ...prev };
          stepsToReset.forEach((s) => {
            next[s.id] = null;
          });
          return next;
        });

        setCurrentSubQuestionIndices((prev) => {
          const next = { ...prev };
          stepsToReset.forEach((s) => {
            next[s.id] = 0;
          });
          return next;
        });

        setSelectedObjectFunctionTexts((prev) => {
          const next = { ...prev };
          stepsToReset.forEach((s) => {
            next[s.id] = null;
          });
          return next;
        });
      }
      setCurrentStepIndex((prev) => prev - 1);
      setResetCounter((prev) => prev + 1);
    }
  };

  const handleClaimReward = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    setShowRewardPopup(false);
    setJustCompletedModule(null);
    setCurrentModule('hub');
    setCurrentStepIndex(0);
  };

  const handlePlayAgainModule = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    setShowRewardPopup(false);
    setJustCompletedModule(null);
    
    // Reset solved state for all slides in this module to allow fresh play
    if (currentModule) {
      const slides = gameModules[currentModule] || [];
      setSolvedSteps((prev) => {
        const next = { ...prev };
        slides.forEach((s) => {
          delete next[s.id];
        });
        return next;
      });
      slides.forEach((s) => {
        setSelectedQuizAnswers((prev) => ({ ...prev, [s.id]: null }));
        setCurrentSubQuestionIndices((prev) => ({ ...prev, [s.id]: 0 }));
        setSelectedObjectFunctionTexts((prev) => ({ ...prev, [s.id]: null }));
      });
      setCurrentStepIndex(0);
      setResetCounter((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    playSound('click');
    const resetCompleted = {
      story: false,
      receptiveLanguage: false,
      objectFunction: false,
      sentenceBuilding: false,
      whQuestions: false,
      sequencing: false
    };
    setCompletedModules(resetCompleted);
    setCurrentModule('welcome');
    setCurrentStepIndex(0);
    setSolvedSteps({});
    setSelectedQuizAnswers({});
    setCurrentSubQuestionIndices({});
    setSelectedObjectFunctionTexts({});
    setResetCounter(0);
    saveProgress(resetCompleted, 'welcome');
  };

  const handleResetCurrentStep = () => {
    if (!currentStep) return;
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    playSound('click');
    setSolvedSteps((prev) => {
      const next = { ...prev };
      delete next[currentStep.id];
      return next;
    });
    setSelectedQuizAnswers((prev) => ({ ...prev, [currentStep.id]: null }));
    setCurrentSubQuestionIndices((prev) => ({ ...prev, [currentStep.id]: 0 }));
    setSelectedObjectFunctionTexts((prev) => ({ ...prev, [currentStep.id]: null }));
    setResetCounter((prev) => prev + 1);
  };

  const handleRestartCurrentModule = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    playSound('click');
    setCurrentStepIndex(0);
    setSolvedSteps((prev) => {
      const next = { ...prev };
      currentModuleSlides.forEach((s) => {
        delete next[s.id];
      });
      return next;
    });
    currentModuleSlides.forEach((s) => {
      setSelectedQuizAnswers((prev) => ({ ...prev, [s.id]: null }));
      setCurrentSubQuestionIndices((prev) => ({ ...prev, [s.id]: 0 }));
      setSelectedObjectFunctionTexts((prev) => ({ ...prev, [s.id]: null }));
    });
    setResetCounter((prev) => prev + 1);
  };

  const handleHome = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    playSound('click');
    if (currentModule !== 'welcome' && currentModule !== 'hub') {
      // Return to Selection Hub if backing out of an activity
      setCurrentModule('hub');
      setCurrentStepIndex(0);
      saveProgress(completedModules, 'hub');
    } else {
      // Exit back to Welcome Page
      setCurrentModule('welcome');
      saveProgress(completedModules, 'welcome');
    }
  };

  const selectModuleFromHub = (moduleKey: string) => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    playSound('click');
    
    // Reset solved state for all slides in this module if already played
    const slides = gameModules[moduleKey] || [];
    setSolvedSteps((prev) => {
      const next = { ...prev };
      slides.forEach((s) => {
        delete next[s.id];
      });
      return next;
    });
    slides.forEach((s) => {
      setSelectedQuizAnswers((prev) => ({ ...prev, [s.id]: null }));
      setCurrentSubQuestionIndices((prev) => ({ ...prev, [s.id]: 0 }));
      setSelectedObjectFunctionTexts((prev) => ({ ...prev, [s.id]: null }));
    });

    // Set active module
    setCurrentModule(moduleKey as any);
    setCurrentStepIndex(0);
    saveProgress(completedModules, moduleKey);
  };

  // Auto-solve welcome slide (just in case)
  useEffect(() => {
    if (currentStep && currentStep.type === 'welcome') {
      handleSolveStep(currentStep.id);
    }
  }, [currentStepIndex, currentModule, currentStep]);

  const renderScreenContent = () => {
    if (!currentStep) return null;
    const isSolved = isCurrentStepSolved();

    switch (currentStep.type) {
      case 'welcome':
        return (
          <WelcomeScreen
            title={currentStep.title}
            description={currentStep.description}
            onStart={handleNext}
          />
        );

      case 'story':
        return (
          <StoryScreen
            key={`${currentStep.id}-${resetCounter}`}
            image={currentStep.image}
            dialogues={currentStep.dialogues}
            initialOverlays={currentStep.initialOverlays ?? []}
            onDialogueComplete={() => handleSolveStep(currentStep.id)}
            leftPanelImage={currentStep.leftPanelImage}
            bottomItems={(currentStep as any).bottomItems}
            showBottomLabels={(currentStep as any).showBottomLabels}
            isCentered={currentModule !== 'story' && currentStepIndex === 0}
          />
        );

      case 'story-items':
        return (
          <StoryItemsScreen
            key={`${currentStep.id}-${resetCounter}`}
            image={currentStep.image}
            dialogues={currentStep.dialogues}
            items={currentStep.items}
            onComplete={() => handleSolveStep(currentStep.id)}
          />
        );

      case 'drag': {
        const dragStep = currentStep as DragScreenData;
        return (
          <DragDropScreen
            key={`${dragStep.id}-${resetCounter}`}
            instruction={dragStep.instruction}
            backgroundImage={dragStep.backgroundImage}
            options={dragStep.options}
            correctOptionId={dragStep.correctOptionId}
            initialOverlays={dragStep.initialOverlays ?? []}
            dropTargetPos={dragStep.dropTargetPos}
            successTransitionImage={dragStep.successTransitionImage}
            nextOverlays={dragStep.nextOverlays ?? []}
            nextBackgroundImage={dragStep.nextBackgroundImage}
            onSolved={() => handleSolveStep(dragStep.id)}
            isSolved={isSolved}
            dialogues={dragStep.dialogues}
          />
        );
      }

      case 'quiz':
        return (
          <QuestionScreen
            key={`${currentStep.id}-${resetCounter}`}
            question={currentStep.question}
            options={currentStep.options}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
            selectedId={selectedQuizAnswers[currentStep.id] || null}
            setSelectedId={(id) =>
              setSelectedQuizAnswers((prev) => ({ ...prev, [currentStep.id]: id }))
            }
          />
        );

      case 'vocabulary':
        return (
          <VocabularyScreen
            key={`${currentStep.id}-${resetCounter}`}
            instruction={currentStep.instruction}
            options={currentStep.options}
            correctOptionId={currentStep.correctOptionId}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      case 'sentence':
        return (
          <SentenceBuilder
            key={`${currentStep.id}-${resetCounter}`}
            instruction={currentStep.instruction}
            words={currentStep.words}
            correctOrder={currentStep.correctOrder}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      case 'object-function':
        return (
          <ObjectFunctionScreen
            key={`${currentStep.id}-${resetCounter}`}
            image={currentStep.image}
            objectName={currentStep.objectName}
            questions={currentStep.questions}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
            currentSubQuestionIndex={currentSubQuestionIndices[currentStep.id] || 0}
            setCurrentSubQuestionIndex={(idx) =>
              setCurrentSubQuestionIndices((prev) => ({ ...prev, [currentStep.id]: idx }))
            }
            selectedOptionText={selectedObjectFunctionTexts[currentStep.id] || null}
            setSelectedOptionText={(txt) =>
              setSelectedObjectFunctionTexts((prev) => ({ ...prev, [currentStep.id]: txt }))
            }
          />
        );

      case 'sequence':
        return (
          <SequenceScreen
            key={`${currentStep.id}-${resetCounter}`}
            instruction={currentStep.instruction}
            items={currentStep.items}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      case 'receptive-scene':
        return (
          <ReceptiveSceneScreen
            key={`${currentStep.id}-${resetCounter}`}
            backgroundImage={currentStep.backgroundImage}
            instruction={currentStep.instruction}
            correctHotspotId={currentStep.correctHotspotId}
            hotspots={currentStep.hotspots}
            onSolved={() => {
              handleSolveStep(currentStep.id);
              if (currentStepIndex < totalSteps - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                // Complete module
                const completedKey = currentModule!;
                setJustCompletedModule(completedKey);
                const nextCompleted = { ...completedModules, [completedKey]: true };
                setCompletedModules(nextCompleted);
                saveProgress(nextCompleted, 'hub');
                setShowRewardPopup(true);
              }
            }}
            isSolved={isSolved}
          />
        );

      case 'completion':
        return (
          <CompletionScreen
            key={`${currentStep.id}-${resetCounter}`}
            title={currentStep.title}
            subtitle={currentStep.subtitle}
            onRestart={handleRestartCurrentModule}
          />
        );

      default:
        return (
          <div className="text-center p-6 text-red-500 font-bold">
            Unknown activity type.
          </div>
        );
    }
  };

  // Determine Title for Layout
  let activityName = 'Make A Dosa';
  if (currentModule === 'story') {
    activityName = 'Cooking Story';
  } else if (currentModule === 'receptiveLanguage') {
    activityName = 'Receptive Language';
  } else if (currentModule === 'objectFunction') {
    activityName = 'Object Function';
  } else if (currentModule === 'sentenceBuilding') {
    activityName = 'Sentence Building';
  } else if (currentModule === 'whQuestions') {
    activityName = 'WH Questions';
  } else if (currentModule === 'sequencing') {
    activityName = 'Sequencing';
  } else if (currentModule === 'hub' || currentModule === null) {
    activityName = isAllCompleted ? 'Dosa Master Chef! 🏆' : 'Choose Your Activity';
  }

  // ── WELCOME SCREEN RENDERING ──
  if (currentModule === 'welcome') {
    return (
      <GameLayout
        currentStepIndex={0}
        totalSteps={0}
        activityName="Make A Dosa"
        onNext={() => { }}
        onPrev={() => { }}
        disableNext={true}
        disablePrev={true}
        onHome={handleHome}
        isWide={true}
        hideHeader={true}
        hideFooter={true}
      >
        <WelcomeScreen
          title="Make a Dosa"
          description="Follow Aarav and his mom as they cook a yummy masala dosa together!"
          onStart={() => {
            playSound('click');
            setCurrentModule('hub');
            saveProgress(completedModules, 'hub');
          }}
        />
      </GameLayout>
    );
  }

  // ── FINAL CELEBRATION SCREEN RENDERING ──
  if (currentModule === 'hub' && isAllCompleted) {
    return (
      <GameLayout
        currentStepIndex={0}
        totalSteps={0}
        activityName="Ultimate Dosa Chef! 🍽️"
        onNext={() => { }}
        onPrev={() => { }}
        disableNext={true}
        disablePrev={true}
        onHome={handleHome}
        isWide={true}
        hideFooter={true}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-grow flex flex-col items-center justify-center text-center p-6 gap-5 max-w-lg mx-auto overflow-y-auto h-full select-none"
        >
          {/* Large Bouncing Gold Trophy */}
          <motion.div
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-xl text-amber-500 shrink-0 relative"
          >
            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 animate-bounce" />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-3 -top-3 text-2xl select-none"
            >
              ✨
            </motion.div>
          </motion.div>

          {/* Congrats Info */}
          <div className="flex flex-col gap-2 shrink-0">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none uppercase drop-shadow-sm font-display font-black">
              Ultimate Dosa Chef! 🍽️
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-sm mx-auto leading-relaxed">
              Incredible work! You prepared a yummy masala dosa with mom and aced all the activities!
            </p>
          </div>

          {/* ── CHALLENGES COMPLETED PANEL ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-emerald-50 border-2 border-emerald-250 p-4 rounded-3xl shadow-md flex flex-col items-center gap-2 max-w-sm shrink-0"
          >
            <span className="text-3xl select-none">🏆</span>
            <span className="text-base font-black text-emerald-700">All 6 Activities Finished!</span>
            <span className="text-xs font-bold text-slate-500">You're a Dosa Master Chef!</span>
          </motion.div>

          {/* Restart Button */}
          <motion.button
            onClick={handleRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 uppercase border-2 border-white"
          >
            <RefreshCw className="w-4 h-4 stroke-[3px]" />
            <span>Play Again</span>
          </motion.button>
        </motion.div>
      </GameLayout>
    );
  }

  // ── HUB SCREEN RENDERING ──
  if (currentModule === 'hub' || currentModule === null) {
    return (
      <GameLayout
        currentStepIndex={0}
        totalSteps={0}
        activityName={activityName}
        onNext={() => { }}
        onPrev={() => { }}
        disableNext={true}
        disablePrev={true}
        onHome={handleHome}
        isWide={true}
        hideFooter={true}
        hideHome={true} // Hide home button on Choose Your Challenge
      >
        <ChallengeHub
          completedModules={completedModules}
          onSelectModule={selectModuleFromHub}
        />
      </GameLayout>
    );
  }

  // ── CORE GAMEPLAY RENDER ──
  return (
    <>
      <GameLayout
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        activityName={activityName}
        onNext={handleNext}
        onPrev={handlePrev}
        disableNext={!isCurrentStepSolved()}
        disablePrev={currentStepIndex === 0}
        onHome={handleHome}
        isWide={false}
        hideFooter={false}
        onReset={currentStepIndex === totalSteps - 1 ? handleRestartCurrentModule : handleResetCurrentStep}
        resetLabel={currentStepIndex === totalSteps - 1 ? 'Reset' : 'Redo'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentModule}-${currentStep?.id || 'none'}-${resetCounter}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {renderScreenContent()}
          </motion.div>
        </AnimatePresence>
      </GameLayout>

      {/* Celebration & Reward Popup overlay */}
      <AnimatePresence>
        {showRewardPopup && justCompletedModule && (
          <RewardPopup
            activityName={
              justCompletedModule === 'story'
                ? 'Cooking Story'
                : justCompletedModule === 'receptiveLanguage'
                  ? 'Receptive Language'
                  : justCompletedModule === 'objectFunction'
                    ? 'Object Function'
                    : justCompletedModule === 'sentenceBuilding'
                      ? 'Sentence Building'
                      : justCompletedModule === 'whQuestions'
                        ? 'WH Questions'
                        : justCompletedModule === 'sequencing'
                          ? 'Sequencing'
                          : ''
            }
            onClaim={handleClaimReward}
            onPlayAgain={handlePlayAgainModule}
          />
        )}
      </AnimatePresence>
    </>
  );
}
