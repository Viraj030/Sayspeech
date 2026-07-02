'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

// Import Screens & Components
import GameLayout from '@/components/GameLayout';
import WelcomeScreen from '@/components/WelcomeScreen';
import StoryScreen from '@/components/StoryScreen';
import StoryItemsScreen from '@/components/StoryItemsScreen';
import DragDropScreen from '@/components/DragDropScreen';
import QuestionScreen from '@/components/QuestionScreen';
import VocabularyScreen from '@/components/VocabularyScreen';
import SentenceBuilder from '@/components/SentenceBuilder';
import ObjectFunctionScreen from '@/components/ObjectFunctionScreen';
import SequenceScreen from '@/components/SequenceScreen';
import CompletionScreen from '@/components/CompletionScreen';

// Import Data & types
import { makeDosaData } from '@/data/makeDosa';
import { DragScreenData } from '@/types/game';
import { playSound } from '@/lib/sound';

export default function MakeDosaGamePage() {
  const router = useRouter();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [solvedSteps, setSolvedSteps] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, string | null>>({});
  const [currentSubQuestionIndices, setCurrentSubQuestionIndices] = useState<Record<string, number>>({});
  const [selectedObjectFunctionTexts, setSelectedObjectFunctionTexts] = useState<Record<string, string | null>>({});

  const totalSteps = makeDosaData.length;
  const currentStep = makeDosaData[currentStepIndex];

  const handleSolveStep = (stepId: string) => {
    setSolvedSteps((prev) => ({ ...prev, [stepId]: true }));
  };

  const isCurrentStepSolved = () => {
    if (!currentStep) return false;
    if (currentStep.type === 'welcome' || currentStep.type === 'completion') return true;
    return !!solvedSteps[currentStep.id];
  };

  const handleNext = () => {
    if (!isCurrentStepSolved()) return;
    playSound('click');
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      playSound('click');
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    playSound('click');
    setCurrentStepIndex(0);
    setSolvedSteps({});
    setSelectedQuizAnswers({});
    setCurrentSubQuestionIndices({});
    setSelectedObjectFunctionTexts({});
  };

  const handleHome = () => {
    handleRestart();
  };

  // Auto-solve welcome and completion
  useEffect(() => {
    if (currentStep && (currentStep.type === 'welcome' || currentStep.type === 'completion')) {
      handleSolveStep(currentStep.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  const renderScreenContent = () => {
    if (!currentStep) return null;
    const isSolved = isCurrentStepSolved();

    switch (currentStep.type) {
      // ── Welcome ──────────────────────────────────────────────────────────
      case 'welcome':
        return (
          <WelcomeScreen
            title={currentStep.title}
            description={currentStep.description}
            onStart={handleNext}
          />
        );

      // ── Story (narrative only) ────────────────────────────────────────────
      case 'story':
        return (
          <StoryScreen
            key={currentStep.id}
            image={currentStep.image}
            dialogues={currentStep.dialogues}
            initialOverlays={currentStep.initialOverlays ?? []}
            onDialogueComplete={() => handleSolveStep(currentStep.id)}
            leftPanelImage={currentStep.leftPanelImage}
          />
        );

      // ── Story-Items (story + static ingredient display) ───────────────────
      case 'story-items':
        return (
          <StoryItemsScreen
            key={currentStep.id}
            image={currentStep.image}
            dialogues={currentStep.dialogues}
            items={currentStep.items}
            onComplete={() => handleSolveStep(currentStep.id)}
          />
        );

      // ── Drag & Drop ───────────────────────────────────────────────────────
      case 'drag': {
        const dragStep = currentStep as DragScreenData;
        return (
          <DragDropScreen
            key={dragStep.id}
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

      // ── Quiz ──────────────────────────────────────────────────────────────
      case 'quiz':
        return (
          <QuestionScreen
            key={currentStep.id}
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

      // ── Vocabulary ────────────────────────────────────────────────────────
      case 'vocabulary':
        return (
          <VocabularyScreen
            key={currentStep.id}
            instruction={currentStep.instruction}
            options={currentStep.options}
            correctOptionId={currentStep.correctOptionId}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      // ── Sentence Building ─────────────────────────────────────────────────
      case 'sentence':
        return (
          <SentenceBuilder
            key={currentStep.id}
            instruction={currentStep.instruction}
            words={currentStep.words}
            correctOrder={currentStep.correctOrder}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      // ── Object Function ───────────────────────────────────────────────────
      case 'object-function':
        return (
          <ObjectFunctionScreen
            key={currentStep.id}
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

      // ── Sequencing ────────────────────────────────────────────────────────
      case 'sequence':
        return (
          <SequenceScreen
            key={currentStep.id}
            instruction={currentStep.instruction}
            items={currentStep.items}
            onSolved={() => handleSolveStep(currentStep.id)}
            isSolved={isSolved}
          />
        );

      // ── Completion ────────────────────────────────────────────────────────
      case 'completion':
        return (
          <CompletionScreen
            title={currentStep.title}
            subtitle={currentStep.subtitle}
            onRestart={handleRestart}
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

  if (!currentStep) return null;

  return (
    <GameLayout
      currentStepIndex={currentStepIndex}
      totalSteps={totalSteps}
      activityName="Make A Dosa"
      onNext={handleNext}
      onPrev={handlePrev}
      disableNext={!isCurrentStepSolved()}
      disablePrev={currentStepIndex === 0}
      onHome={handleHome}
      isWide={currentStepIndex === 0}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
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
  );
}
