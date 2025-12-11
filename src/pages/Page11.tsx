import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Film, Upload, Loader2, Sparkles, Users, Heart, Palette, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../lib/storage';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import MyMovies from '../components/MyMovies';

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
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [showMyMovies, setShowMyMovies] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user]);

  const loadAssets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssets(data || []);
      if (data && data.length > 0 && !selectedAsset) {
        setSelectedAsset(data[0]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user || files.length === 0) return;

    setUploading(true);
    setUploadProgress({});

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
        const errorMessages = failedFiles.map(r => r.error).join('\n');
        alert(`${successCount} of ${files.length} files uploaded.\n\nErrors:\n${errorMessages}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Creative Studio
              </h1>
              <p className="text-slate-400 text-sm">Where humanity meets creativity</p>
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
                <h2 className="text-xl font-bold text-white mb-2">Empowering Human Creativity</h2>
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
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedAsset?.id === asset.id
                            ? 'bg-cyan-600/20 border-2 border-cyan-500'
                            : 'bg-slate-900/30 border border-slate-700 hover:bg-slate-700/50'
                        }`}
                      >
                        <p className="text-sm font-medium text-white truncate mb-1">{asset.file_name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="px-2 py-0.5 bg-slate-700 rounded">
                            {asset.asset_type || asset.file_type.split('/')[0]}
                          </span>
                          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                        </div>
                      </button>
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

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-cyan-500/30">
                    <h3 className="text-lg font-bold text-white mb-3">Next Steps</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>✓ Upload more assets to build your library</p>
                      <p>✓ Use AI Tools to enhance your content</p>
                      <p>✓ Create movies from your assets</p>
                      <p>✓ Share with your team</p>
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
    </div>
  );
}
