import { useState } from 'react';
import { Film, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const demoPages = [
  {
    title: 'Welcome to MandaStrong Studio!',
    subtitle: 'An All In One Make A Movie App! 2 ~ 2.5 Hours Duration',
    content: 'Create professional movies from concept to completion with our intuitive interface.',
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
  {
    title: 'Ready to Create?',
    subtitle: 'Start Your Filmmaking Journey',
    content: 'Join MandaStrong Studio and bring your stories to life.',
    description: 'Sign up now to access all features and start creating your first movie project. Our platform provides everything you need to go from concept to final cut.',
  },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNext = () => {
    if (currentPage < demoPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onGetStarted();
    }
  };

  const goToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const page = demoPages[currentPage];
  const isLastPage = currentPage === demoPages.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Film className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
            <p className="text-xl text-purple-100">{page.subtitle}</p>
          </div>

          <div className="px-8 py-12">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 mb-8">
                {demoPages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentPage
                        ? 'w-12 bg-purple-600'
                        : index < currentPage
                        ? 'w-8 bg-purple-400'
                        : 'w-8 bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                <p className="text-xl font-semibold text-slate-900 dark:text-white">
                  {page.content}
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  {page.description}
                </p>
              </div>

            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              {currentPage + 1} of {demoPages.length}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {isLastPage ? 'Get Started' : 'Next'}
              {isLastPage ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onGetStarted}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm"
          >
            Skip to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
