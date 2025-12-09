import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Image, Video, Music, File, Trash2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

interface Asset {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  asset_type: string;
  title: string;
  file_size: number;
  created_at: string;
}

export default function Page11({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      setAssets(assets.filter(a => a.id !== assetId));
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset');
    }
  };

  const getIcon = (assetType: string) => {
    switch (assetType) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredAssets = filter === 'all'
    ? assets
    : assets.filter(a => a.asset_type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            MEDIA LIBRARY
          </h1>
          <p className="text-lg text-slate-400">
            All your uploaded assets in one place
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filter === 'image'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Image className="w-4 h-4" />
              Images
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filter === 'video'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
            <button
              onClick={() => setFilter('audio')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filter === 'audio'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Music className="w-4 h-4" />
              Audio
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading assets...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg">No assets found</p>
              <p className="text-slate-500 text-sm mt-2">
                Upload assets on the previous page to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-black/50 border border-white/20 rounded-lg p-4 hover:border-white/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        {getIcon(asset.asset_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{asset.title}</h3>
                        <p className="text-xs text-slate-400 truncate">{asset.file_name}</p>
                      </div>
                    </div>
                  </div>

                  {asset.asset_type === 'image' && (
                    <div className="aspect-video bg-black/50 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={asset.file_url}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {asset.asset_type === 'video' && (
                    <div className="aspect-video bg-black/50 rounded-lg mb-3 overflow-hidden">
                      <video
                        src={asset.file_url}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {asset.asset_type === 'audio' && (
                    <div className="mb-3">
                      <audio src={asset.file_url} controls className="w-full" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{formatFileSize(asset.file_size)}</span>
                    <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={asset.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(10)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(12)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
