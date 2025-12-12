import { useState } from 'react';
import { Film, Loader2, Sparkles, Download, Edit3, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import MyMovies from '../components/MyMovies';
import AuthModal from '../components/AuthModal';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page11({ onNavigate }: PageProps) {
  const { user, loading: authLoading } = useAuth();
  const [moviePrompt, setMoviePrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedProjectId, setGeneratedProjectId] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [showMyMovies, setShowMyMovies] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMovie = async () => {
    if (!user) {
      setError('Please sign in to create a movie project');
      setShowAuthModal(true);
      return;
    }

    if (!moviePrompt.trim()) {
      setError('Please enter a description for your movie');
      return;
    }

    setGenerating(true);
    setGeneratedProjectId(null);
    setError(null);

    try {
      const { data: project, error: projectError } = await supabase
        .from('movie_projects')
        .insert({
          user_id: user.id,
          title: moviePrompt.substring(0, 50) || 'AI Generated Movie',
          description: moviePrompt,
          duration: duration,
          status: 'completed',
          current_phase: 1,
          phase_1_data: {
            prompt: moviePrompt,
            duration: duration,
            generation_started: new Date().toISOString(),
            generation_completed: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        setError(`Failed to create project: ${projectError.message}`);
        throw projectError;
      }

      setGeneratedProjectId(project.id);
    } catch (error) {
      console.error('Error creating movie:', error);
      setError(error instanceof Error ? error.message : 'Failed to create movie project');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedProjectId) return;

    try {
      const { data: project, error } = await supabase
        .from('movie_projects')
        .select('*')
        .eq('id', generatedProjectId)
        .single();

      if (error) throw error;

      const projectData = JSON.stringify(project, null, 2);
      const blob = new Blob([projectData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}_project.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading project:', error);
      setError('Failed to download project');
    }
  };

  const handleContinueEditing = () => {
    setMoviePrompt('');
    setDuration(30);
    setGeneratedProjectId(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-lg text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to Create Movies</h2>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
        <QuickAccess onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => setShowAuthModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Create Movie with AI
              </h1>
              <p className="text-slate-400">Simple. Fast. Powerful.</p>
            </div>
            <button
              onClick={() => setShowMyMovies(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transform hover:scale-105"
            >
              <Film className="w-5 h-5" />
              My Projects
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/50">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Generate Movie by AI
                </h2>
                <p className="text-slate-300">Describe your vision and let AI create your movie</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    PASTE YOUR PROMPT
                  </label>
                  <textarea
                    value={moviePrompt}
                    onChange={(e) => setMoviePrompt(e.target.value)}
                    placeholder="A cinematic video of a sunrise over mountains with dramatic orchestral music, smooth camera movements, and golden hour lighting..."
                    className="w-full bg-slate-900/70 border-2 border-cyan-500/30 rounded-xl p-5 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 min-h-[180px] resize-y text-base"
                    disabled={generating || generatedProjectId !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    USE SLIDER FOR DURATION OF MOVIE
                  </label>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Duration</span>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {duration}
                        </span>
                        <span className="text-slate-400">minutes</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="180"
                      step="5"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      disabled={generating || generatedProjectId !== null}
                      className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-cyan-400 [&::-moz-range-thumb]:to-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-3">
                      <span>5m</span>
                      <span>Quick</span>
                      <span>Standard</span>
                      <span>Long</span>
                      <span>180m</span>
                    </div>
                  </div>
                </div>

                {!generatedProjectId ? (
                  <>
                    <button
                      onClick={handleGenerateMovie}
                      disabled={generating || !moviePrompt.trim()}
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-black text-xl py-6 px-8 rounded-xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 disabled:shadow-none flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          GENERATING...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          GENERATE MOVIE BY AI
                        </>
                      )}
                    </button>

                    {generating && (
                      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <Loader2 className="w-20 h-20 text-cyan-400 animate-spin" />
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-white mb-2">Creating Your Movie...</p>
                            <p className="text-slate-300">AI is processing your request</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-xl p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                          <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white mb-2">DONE!</p>
                          <p className="text-lg text-slate-300">Your movie project is ready</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-500/50 transform hover:scale-105"
                      >
                        <Download className="w-6 h-6" />
                        DOWNLOAD
                      </button>
                      <button
                        onClick={handleContinueEditing}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transform hover:scale-105"
                      >
                        <Edit3 className="w-6 h-6" />
                        CONTINUE EDITING
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickAccess onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />

      {showMyMovies && (
        <MyMovies
          onClose={() => setShowMyMovies(false)}
          onNavigate={onNavigate}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setError(null);
          }}
        />
      )}
    </div>
  );
}
