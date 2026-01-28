import { useState, useEffect } from 'react';
import { Film, Loader2, Sparkles, Download, Edit3, X, AlertCircle, ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import MyMovies from '../components/MyMovies';
import AuthModal from '../components/AuthModal';
import { uploadFile, getAssets } from '../lib/storage';

interface PageProps {
  onNavigate: (page: number) => void;
}

interface Asset {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  asset_type: string;
}

interface RenderJob {
  id: string;
  title: string;
  status: string;
  progress_percent: number;
  current_step: string;
  output_video_url: string;
  error_message: string;
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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (renderJob && (renderJob.status === 'processing' || renderJob.status === 'queued')) {
      interval = setInterval(checkRenderStatus, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [renderJob]);

  const loadAssets = async () => {
    if (!user) return;
    const userAssets = await getAssets(user.id);
    setAssets(userAssets);
  };

  const checkRenderStatus = async () => {
    if (!renderJob) return;

    const { data, error } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('id', renderJob.id)
      .maybeSingle();

    if (!error && data) {
      setRenderJob(data);

      if (data.status === 'completed' && data.output_video_url) {
        const { data: asset } = await supabase
          .from('assets')
          .insert({
            user_id: user!.id,
            file_name: `${data.title.replace(/[^a-z0-9]/gi, '_')}.mp4`,
            file_type: 'video/mp4',
            asset_type: 'video',
            file_url: data.output_video_url,
            file_size: 0,
            metadata: {
              source: 'ai_generated',
              render_job_id: data.id,
            },
          })
          .select()
          .maybeSingle();

        if (asset) {
          console.log('Generated video added to assets:', asset.id);
        }
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const files = Array.from(e.target.files);
      const uploadedAssetIds: string[] = [];

      for (const file of files) {
        const result = await uploadFile(file, user.id);

        if (result.success && result.assetId) {
          uploadedAssetIds.push(result.assetId);
        } else {
          console.error('Upload failed for', file.name, result.error);
        }
      }

      if (uploadedAssetIds.length > 0) {
        await loadAssets();
        setSelectedAssets(prev => [...prev, ...uploadedAssetIds]);
      } else {
        setError('Failed to upload files');
      }
    } catch (err) {
      setError('Failed to upload files');
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleGenerateMovie = async () => {
    if (!user) {
      setError('Please sign in to create a movie');
      setShowAuthModal(true);
      return;
    }

    if (!moviePrompt.trim()) {
      setError('Please enter a description for your movie');
      return;
    }

    setGenerating(true);
    setGeneratedProjectId(null);
    setRenderJob(null);
    setError(null);

    try {
      const { data: job, error: jobError } = await supabase
        .from('render_jobs')
        .insert({
          user_id: user.id,
          title: moviePrompt.substring(0, 100) || 'AI Generated Movie',
          description: moviePrompt,
          target_duration: duration,
          aspect_ratio: '16:9',
          resolution: '1920x1080',
          asset_ids: selectedAssets,
          status: 'queued',
          progress_percent: 0
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-movie`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: job.id })
      });

      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }

      setRenderJob(job);
      setGeneratedProjectId(job.id);
    } catch (error) {
      console.error('Error creating movie:', error);
      setError(error instanceof Error ? error.message : 'Failed to create movie');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!renderJob?.output_video_url) {
      setError('Video not ready for download yet');
      return;
    }

    try {
      const videoUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media-assets/${renderJob.output_video_url}`;

      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `${renderJob.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading video:', error);
      setError('Failed to download video');
    }
  };

  const handleContinueEditing = () => {
    setMoviePrompt('');
    setDuration(30);
    setGeneratedProjectId(null);
    setRenderJob(null);
    setSelectedAssets([]);
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
        <Footer />
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
                    SELECT MEDIA FILES <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                      {assets.map(asset => (
                        <div
                          key={asset.id}
                          onClick={() => !generating && !generatedProjectId && toggleAssetSelection(asset.id)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedAssets.includes(asset.id)
                              ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                              : 'border-slate-600 hover:border-slate-500'
                          } ${generating || generatedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="aspect-video bg-slate-800 flex items-center justify-center relative overflow-hidden">
                            {asset.asset_type === 'video' ? (
                              <>
                                <video
                                  src={asset.file_url}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  onMouseEnter={(e) => e.currentTarget.play()}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                  }}
                                />
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
                                  <Film className="w-3 h-3 text-white" />
                                  <span className="text-white text-xs">Video</span>
                                </div>
                              </>
                            ) : asset.asset_type === 'image' ? (
                              <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-slate-500 text-xs text-center px-2">{asset.file_name}</div>
                            )}
                          </div>
                          {selectedAssets.includes(asset.id) && (
                            <div className="absolute top-1 right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                      <label className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-lg p-4 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="video/*,image/*,audio/*,application/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploading || generating || generatedProjectId !== null}
                        className="hidden"
                      />
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> Uploading...</>
                      ) : (
                        <><Upload className="w-5 h-5 text-slate-400" /><span className="text-slate-400">Upload Any Media (Videos, MP4s, Images, Audio)</span></>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    PASTE YOUR PROMPT
                  </label>
                  <textarea
                    value={moviePrompt}
                    onChange={(e) => setMoviePrompt(e.target.value)}
                    placeholder="A cinematic video of a sunrise over mountains with dramatic orchestral music, smooth camera movements, and golden hour lighting..."
                    className="w-full bg-slate-900/70 border-2 border-cyan-500/30 rounded-xl p-5 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 min-h-[120px] resize-y text-base"
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
                          STARTING...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          GENERATE MOVIE BY AI
                        </>
                      )}
                    </button>
                  </>
                ) : renderJob?.status === 'processing' || renderJob?.status === 'queued' ? (
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
                      </div>
                      <div className="text-center w-full">
                        <p className="text-2xl font-black text-white mb-2">Creating Your Movie...</p>
                        <p className="text-slate-300 mb-6">{renderJob.current_step || 'Initializing...'}</p>
                        <div className="w-full max-w-2xl mx-auto">
                          <div className="flex justify-between text-sm text-slate-400 mb-3">
                            <span className="font-semibold">Progress</span>
                            <span className="text-2xl font-bold text-cyan-400">{renderJob.progress_percent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-4 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300 ease-out shadow-lg shadow-cyan-500/50 relative overflow-hidden"
                              style={{ width: `${Math.min(renderJob.progress_percent, 100)}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span>Estimated time: {Math.max(1, Math.ceil((100 - renderJob.progress_percent) / 100 * 60))} seconds</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : renderJob?.status === 'completed' ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-xl p-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">DONE!</p>
                          <p className="text-slate-300">Your movie is ready</p>
                        </div>
                      </div>

                      {renderJob.output_video_url && (
                        <div className="bg-black rounded-lg overflow-hidden mb-4">
                          <video
                            controls
                            className="w-full"
                            poster={renderJob.output_video_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media-assets/${renderJob.output_video_url}-thumbnail.jpg` : undefined}
                          >
                            <source
                              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media-assets/${renderJob.output_video_url}`}
                              type="video/mp4"
                            />
                            Your browser does not support video playback.
                          </video>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-500/50 transform hover:scale-105"
                      >
                        <Download className="w-6 h-6" />
                        DOWNLOAD MP4
                      </button>
                      <button
                        onClick={handleContinueEditing}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transform hover:scale-105"
                      >
                        <Edit3 className="w-6 h-6" />
                        CREATE ANOTHER
                      </button>
                    </div>
                  </div>
                ) : renderJob?.status === 'failed' ? (
                  <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <p className="text-xl font-bold text-white mb-2">Generation Failed</p>
                    <p className="text-red-200 mb-4">{renderJob.error_message || 'An error occurred'}</p>
                    <button
                      onClick={handleContinueEditing}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(11)}
            className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <QuickAccess onNavigate={onNavigate} />
      <Footer />

      {showMyMovies && (
        <MyMovies
          onClose={() => setShowMyMovies(false)}
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
