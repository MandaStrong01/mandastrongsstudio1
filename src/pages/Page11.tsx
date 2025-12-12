import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Film, Upload, Loader2, Sparkles, Users, Heart, Palette, Code, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../lib/storage';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import MyMovies from '../components/MyMovies';
import AuthModal from '../components/AuthModal';

interface PageProps {
  onNavigate: (page: number) => void;
}

interface Asset {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  asset_type?: string;
  created_at: string;
}

export default function Page11({ onNavigate }: PageProps) {
  const { user, loading: authLoading } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [showMyMovies, setShowMyMovies] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [moviePrompt, setMoviePrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [duration, setDuration] = useState(90);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
      setLoading(false);
    } else if (user) {
      setShowAuthModal(false);
      loadAssets();
    }
  }, [user, authLoading]);

  const loadAssets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assets:', error);
        setError('Failed to load your assets. Please refresh the page.');
        throw error;
      }

      setAssets(data || []);
      if (data && data.length > 0 && !selectedAsset) {
        setSelectedAsset(data[0]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Delete this asset? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      if (selectedAsset?.id === assetId) {
        setSelectedAsset(null);
      }

      await loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.warn('No files provided for upload');
      return;
    }

    if (!user) {
      setError('Please sign in to upload files');
      setShowAuthModal(true);
      return;
    }

    setUploading(true);
    setUploadProgress({});
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(file =>
        uploadFile(file, user.id, (progress) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }, false)
      );

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.success).length;

      if (successCount > 0) {
        await loadAssets();
      }

      if (results.some(r => !r.success)) {
        const failedFiles = results.filter(r => !r.success);
        const errorMessages = failedFiles.map(r => r.error).join(', ');
        setError(`${successCount} of ${files.length} files uploaded successfully. Errors: ${errorMessages}`);
      } else if (successCount > 0) {
        setError(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

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

    if (assets.length === 0) {
      setError('Please upload some media files first');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const mediaAssets = assets.filter(a =>
        a.file_type.startsWith('image/') ||
        a.file_type.startsWith('video/') ||
        a.file_type.startsWith('audio/')
      );

      if (mediaAssets.length === 0) {
        setError('No media assets found. Please upload images, videos, or audio files.');
        setGenerating(false);
        return;
      }

      const { data: project, error: projectError } = await supabase
        .from('movie_projects')
        .insert({
          user_id: user.id,
          title: moviePrompt.substring(0, 50) || 'New Movie',
          description: moviePrompt,
          duration: duration,
          status: 'draft'
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        setError(`Failed to create project: ${projectError.message}`);
        throw projectError;
      }

      setMoviePrompt('');
      setShowMyMovies(true);
    } catch (error) {
      console.error('Error creating movie:', error);
      setError(error instanceof Error ? error.message : 'Failed to create movie project');
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-lg text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          {/* Error Banner */}
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

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Creating Movie with AI
              </h1>
              <p className="text-slate-400 text-sm">Your Assets</p>
            </div>
            <button
              onClick={() => setShowMyMovies(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transform hover:scale-105"
            >
              <Film className="w-5 h-5" />
              My Projects
            </button>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex gap-3">
                <Heart className="w-6 h-6 text-red-400" />
                <Palette className="w-6 h-6 text-cyan-400" />
                <Users className="w-6 h-6 text-blue-400" />
                <Code className="w-6 h-6 text-teal-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Enhance Human Creativity</h2>
                <p className="text-slate-300 leading-relaxed">
                  A platform built for artists, creators, and developers. Upload your media, organize your assets,
                  and bring your creative vision to life. Supporting files up to <span className="font-bold text-cyan-400">50GB</span> -
                  because great ideas need no limits.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Upload Area */}
            <div
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 p-6 transition-all ${
                isDragging
                  ? 'border-cyan-400 border-dashed bg-cyan-900/20 scale-[1.02]'
                  : 'border-slate-700'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Media Library</h2>

              {/* Upload Section */}
              <div className="mb-6">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-900/20'
                      : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/50'
                  }`}>
                    {uploading ? (
                      <div>
                        <Loader2 className="w-12 h-12 mx-auto mb-3 text-cyan-400 animate-spin" />
                        <p className="text-lg font-bold text-white mb-1">Uploading...</p>
                        <p className="text-sm text-slate-400">Processing your files</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                        <p className="text-lg font-bold text-white mb-1">Upload Media</p>
                        <p className="text-sm text-slate-400 mb-3">Drag & drop or click to browse</p>
                        <p className="text-xs text-slate-500">Supports all media types • Max 50GB per file</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="*/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(uploadProgress).map(([fileName, progress]) => (
                      <div key={fileName} className="bg-slate-900/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-300 truncate flex-1 mr-2">{fileName}</p>
                          <p className="text-xs font-bold text-cyan-400">{Math.round(progress)}%</p>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assets List */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 mb-3">Your Assets ({assets.length})</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 mx-auto text-cyan-400 animate-spin" />
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-500">No assets yet. Upload your first file!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`relative group w-full text-left p-3 rounded-lg transition-all cursor-pointer ${
                          selectedAsset?.id === asset.id
                            ? 'bg-cyan-600/20 border-2 border-cyan-500'
                            : 'bg-slate-900/30 border border-slate-700 hover:bg-slate-700/50'
                        }`}
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <button
                          onClick={(e) => handleDeleteAsset(asset.id, e)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Delete asset"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-sm font-medium text-white truncate mb-1 pr-8">{asset.file_name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="px-2 py-0.5 bg-slate-700 rounded">
                            {asset.asset_type || asset.file_type.split('/')[0]}
                          </span>
                          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Preview</h2>

              {selectedAsset ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-700">
                    {selectedAsset.file_type.startsWith('image/') ? (
                      <img
                        src={selectedAsset.file_url}
                        alt={selectedAsset.file_name}
                        className="w-full h-full object-contain"
                      />
                    ) : selectedAsset.file_type.startsWith('video/') ? (
                      <video
                        src={selectedAsset.file_url}
                        controls
                        className="w-full h-full"
                      />
                    ) : selectedAsset.file_type.startsWith('audio/') ? (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <audio src={selectedAsset.file_url} controls className="w-full" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Film className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                          <p className="text-slate-400">Preview not available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Asset Details */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-3">{selectedAsset.file_name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Type</p>
                        <p className="text-white font-medium">{selectedAsset.file_type}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Uploaded</p>
                        <p className="text-white font-medium">
                          {new Date(selectedAsset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <a
                        href={selectedAsset.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg transition-all"
                      >
                        <Film className="w-4 h-4" />
                        Open in New Tab
                      </a>
                    </div>
                  </div>

                  {/* Movie Creation Prompt */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">Create Movie from Your Media</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">
                      Describe your movie idea and we'll create a project using your uploaded assets.
                    </p>
                    <div className="space-y-3">
                      <textarea
                        value={moviePrompt}
                        onChange={(e) => setMoviePrompt(e.target.value)}
                        placeholder="Example: Create an epic montage of my best moments with dramatic music and smooth transitions..."
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 min-h-[100px] resize-y"
                        disabled={generating}
                      />

                      {/* Duration Slider */}
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-slate-300">Duration</label>
                          <span className="text-lg font-bold text-cyan-400">{duration} min</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="180"
                          step="1"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>0 min</span>
                          <span>180 min</span>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateMovie}
                        disabled={generating || !moviePrompt.trim() || assets.length === 0}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Project...
                          </>
                        ) : (
                          <>
                            <Film className="w-5 h-5" />
                            Generate Movie Project
                          </>
                        )}
                      </button>

                      {/* Export and Continue Editing Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                          <Film className="w-4 h-4" />
                          Export
                        </button>
                        <button
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Continue Editing
                        </button>
                      </div>

                      {assets.length === 0 && (
                        <p className="text-xs text-yellow-400 text-center">
                          Upload some media files first to create a movie!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-20 h-20 mx-auto mb-4 text-slate-700" />
                    <p className="text-xl text-slate-500 mb-2">No asset selected</p>
                    <p className="text-sm text-slate-600">Upload or select an asset to preview</p>
                  </div>
                </div>
              )}
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
