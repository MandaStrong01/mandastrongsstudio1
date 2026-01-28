import { useState } from 'react';
import { Upload, Download, Sparkles, Wrench, Link, CheckCircle2, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { acceptMedia, acceptGeneratedVideo, acceptDownloadedVideo, acceptToolboardMedia, MediaSource } from '../lib/mediaAcceptor';

interface UniversalMediaAcceptorProps {
  onMediaAccepted?: (mediaId: string) => void;
  onClose?: () => void;
}

export default function UniversalMediaAcceptor({ onMediaAccepted, onClose }: UniversalMediaAcceptorProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'download' | 'url' | 'generated'>('upload');
  const [processing, setProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [acceptedMedia, setAcceptedMedia] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files) return;

    setProcessing(true);
    setError(null);

    const files = Array.from(e.target.files);

    for (const file of files) {
      const source: MediaSource = {
        type: 'upload',
        file,
        name: file.name,
      };

      const result = await acceptMedia(source, user.id);
      if (result) {
        setAcceptedMedia(prev => [...prev, result.id]);
        if (onMediaAccepted) onMediaAccepted(result.id);
      }
    }

    setProcessing(false);
  };

  const handleUrlImport = async () => {
    if (!user || !urlInput.trim()) return;

    setProcessing(true);
    setError(null);

    try {
      const fileName = urlInput.split('/').pop() || 'imported_video.mp4';
      const source: MediaSource = {
        type: 'url',
        url: urlInput,
        name: fileName,
      };

      const result = await acceptMedia(source, user.id);
      if (result) {
        setAcceptedMedia(prev => [...prev, result.id]);
        if (onMediaAccepted) onMediaAccepted(result.id);
        setUrlInput('');
      } else {
        setError('Failed to import from URL');
      }
    } catch (err) {
      setError('Invalid URL or download failed');
    }

    setProcessing(false);
  };

  const tabs = [
    { id: 'upload' as const, label: 'Upload Files', icon: Upload },
    { id: 'download' as const, label: 'Import Download', icon: Download },
    { id: 'url' as const, label: 'From URL', icon: Link },
    { id: 'generated' as const, label: 'AI Generated', icon: Sparkles },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Add Media to Project</h2>
          <p className="text-white/60 text-sm">
            Accept media from any source - uploads, downloads, AI generated, or URLs
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <X className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {acceptedMedia.length > 0 && (
        <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-200 text-sm">
            {acceptedMedia.length} file{acceptedMedia.length !== 1 ? 's' : ''} added successfully
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                isActive
                  ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'upload' && (
          <div className="text-center">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-12 hover:border-blue-400/50 hover:bg-white/5 transition-all">
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  {processing ? 'Processing...' : 'Upload Media Files'}
                </h3>
                <p className="text-white/60 mb-4">
                  Videos, Images, Audio - All formats supported
                </p>
                {processing && <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />}
              </div>
              <input
                type="file"
                multiple
                accept="*/*"
                onChange={handleFileUpload}
                disabled={processing}
                className="hidden"
              />
            </label>
          </div>
        )}

        {activeTab === 'download' && (
          <div className="text-center">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-12 hover:border-blue-400/50 hover:bg-white/5 transition-all">
                <Download className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Import Downloaded Files
                </h3>
                <p className="text-white/60 mb-4">
                  Select MP4s or other video files you've downloaded
                </p>
                {processing && <Loader2 className="w-8 h-8 text-green-400 mx-auto animate-spin" />}
              </div>
              <input
                type="file"
                multiple
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                disabled={processing}
                className="hidden"
              />
            </label>
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <div className="bg-white/5 rounded-xl p-8 border border-white/10">
              <Link className="w-12 h-12 text-blue-400 mx-auto mb-4 block" />
              <h3 className="text-white text-xl font-semibold mb-2 text-center">
                Import from URL
              </h3>
              <p className="text-white/60 mb-6 text-center">
                Paste a direct link to a video or media file
              </p>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                  disabled={processing}
                />
                <button
                  onClick={handleUrlImport}
                  disabled={processing || !urlInput.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generated' && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-12 border border-purple-500/30">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">
                AI Generated Content
              </h3>
              <p className="text-white/60 mb-6">
                Videos generated by AI tools are automatically added to your library
              </p>
              <div className="bg-white/5 rounded-lg p-4 text-left">
                <p className="text-white/80 text-sm mb-2">Automatic sources:</p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• AI video generation on Page 11</li>
                  <li>• AI tool outputs from toolboard</li>
                  <li>• Rendered projects from editor</li>
                  <li>• Any AI-created media in the app</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
