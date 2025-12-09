import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
  onStart: () => void;
}

const tutorialPhases = [
  {
    title: 'Welcome to MandaStrong Studio!',
    subtitle: 'An All In One Make A Movie App! 2 ~ 2.5 Hours Duration',
    content: 'This quick tutorial will show you how to create your first movie in 3 simple phases.',
    description: 'MandaStrong Studio is designed to help you create professional movies from concept to completion. Whether you\'re a beginner or an experienced filmmaker, our intuitive interface guides you through every step of the process.',
  },
  {
    title: 'Phase 1: Story & Concept',
    subtitle: 'Develop Your Vision',
    content: 'Start by defining your movie\'s core concept, characters, and storyline.',
    description: 'In this phase, you\'ll brainstorm ideas, create character profiles, write your plot outline, and establish the tone and style of your movie. This foundation ensures your project has a clear direction from the start.',
  },
  {
    title: 'Phase 2: Development',
    subtitle: 'Plan Your Production',
    content: 'Create detailed scripts, storyboards, and production schedules.',
    description: 'Transform your concept into a concrete plan. Write your screenplay, design scenes, plan your shots, and organize your production timeline. This phase prepares you for efficient filming and ensures nothing is overlooked.',
  },
  {
    title: 'Phase 3: Production',
    subtitle: 'Bring It to Life',
    content: 'Execute your plan and create your movie with our production tools.',
    description: 'Now it\'s time to bring everything together. Film your scenes, edit footage, add music and effects, and polish your final cut. Our tools help you stay organized and focused throughout the production process.',
  },
];

export function Tutorial({ onClose, onStart }: TutorialProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  const goToNext = () => {
    if (currentPhase < tutorialPhases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const goToPrevious = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const handleStartCreating = () => {
    onStart();
    onClose();
  };

  const phase = tutorialPhases[currentPhase];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-3">{phase.title}</h1>
          <p className="text-xl text-blue-100">{phase.subtitle}</p>
        </div>

        <div className="px-8 py-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-8">
              {tutorialPhases.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentPhase
                      ? 'w-12 bg-blue-600'
                      : index < currentPhase
                      ? 'w-8 bg-blue-400'
                      : 'w-8 bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <div className="text-center space-y-4">
              <p className="text-xl font-semibold text-slate-900 dark:text-white">
                {phase.content}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                {phase.description}
              </p>
            </div>

            {currentPhase === tutorialPhases.length - 1 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleStartCreating}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Creating Your Movie
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={goToPrevious}
            disabled={currentPhase === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            {currentPhase + 1} of {tutorialPhases.length}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPhase === tutorialPhases.length - 1}
            className="flex items-center gap-2 px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm"
        >
          Skip tutorial and go to dashboard
        </button>
      </div>
    </div>
  );
}
