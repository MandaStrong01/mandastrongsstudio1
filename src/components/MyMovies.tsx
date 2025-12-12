import { useState, useEffect } from 'react';
import { Film, Download, Loader2, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RenderJob {
  id: string;
  title: string;
  description: string;
  target_duration: number;
  aspect_ratio: string;
  resolution: string;
  status: string;
  progress_percent: number;
  current_step: string;
  error_message: string;
  scene_count: number;
  output_video_url: string;
  thumbnail_url: string;
  actual_duration: number;
  created_at: string;
  completed_at: string;
  processing_time_seconds: number;
}

interface MyMoviesProps {
  onClose: () => void;
}

export default function MyMovies({ onClose }: MyMoviesProps) {
  const { user } = useAuth();
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<RenderJob | null>(null);

  useEffect(() => {
    if (user) {
      loadRenderJobs();
      const interval = setInterval(loadRenderJobs, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadRenderJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('render_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRenderJobs(data || []);
    } catch (error) {
      console.error('Error loading render jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processing':
      case 'rendering':
      case 'queued':
        return <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-400/30 bg-green-900/20';
      case 'failed':
        return 'text-red-400 border-red-400/30 bg-red-900/20';
      case 'processing':
      case 'rendering':
      case 'queued':
        return 'text-purple-400 border-purple-400/30 bg-purple-900/20';
      default:
        return 'text-slate-400 border-slate-400/30 bg-slate-900/20';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const downloadMovie = async (job: RenderJob) => {
    if (!job.output_video_url) return;

    try {
      alert('Movie download will be available once video processing is fully implemented with FFmpeg.');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download movie');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-6xl w-full my-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">My Movies</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-spin" />
            <p className="text-slate-400">Loading your movies...</p>
          </div>
        ) : renderJobs.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No movies generated yet</p>
            <p className="text-slate-500 text-sm mt-2">Upload some media and click "Generate Movie" to create your first film!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {renderJobs.map((job) => (
              <div
                key={job.id}
                className="bg-black/40 border border-purple-500/30 rounded-xl p-5 hover:border-purple-400/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.toUpperCase()}
                      </span>
                    </div>

                    {job.description && (
                      <p className="text-slate-400 text-sm mb-3">{job.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2">
                        <p className="text-xs text-purple-300 mb-1">Duration</p>
                        <p className="text-sm font-bold text-white">{formatTime(job.target_duration)}</p>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2">
                        <p className="text-xs text-purple-300 mb-1">Resolution</p>
                        <p className="text-sm font-bold text-white">{job.resolution}</p>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2">
                        <p className="text-xs text-purple-300 mb-1">Aspect Ratio</p>
                        <p className="text-sm font-bold text-white">{job.aspect_ratio}</p>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2">
                        <p className="text-xs text-purple-300 mb-1">Scenes</p>
                        <p className="text-sm font-bold text-white">{job.scene_count}</p>
                      </div>
                    </div>

                    {job.status === 'processing' || job.status === 'rendering' || job.status === 'queued' ? (
                      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-purple-300">{job.current_step}</span>
                          <span className="text-purple-400 font-bold">{job.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-purple-900/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${job.progress_percent}%` }}
                          />
                        </div>
                      </div>
                    ) : job.status === 'failed' ? (
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p className="text-sm text-red-300">
                          <span className="font-bold">Error:</span> {job.error_message || 'Unknown error occurred'}
                        </p>
                      </div>
                    ) : job.status === 'completed' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                          <Play className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadMovie(job)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Created {new Date(job.created_at).toLocaleString()}</span>
                      {job.completed_at && (
                        <span>Completed {new Date(job.completed_at).toLocaleString()}</span>
                      )}
                      {job.processing_time_seconds && (
                        <span>Processing time: {Math.floor(job.processing_time_seconds / 60)}m {job.processing_time_seconds % 60}s</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
          <div className="bg-gradient-to-br from-slate-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-4xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedJob.title}</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <Film className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <p className="text-slate-300 mb-4">
                Video preview will be available once the full video processing pipeline is implemented.
              </p>
              <p className="text-sm text-slate-400">
                The system is now generating real movie files from your uploads. Once FFmpeg integration is complete,
                you'll be able to preview and download your generated movies here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
