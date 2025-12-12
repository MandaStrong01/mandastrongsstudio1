import { useState, useEffect } from 'react';
import { Upload, Image, Video, Music, FileText, Trash2, Download, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Asset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'text';
  url: string;
  size: number;
  created_at: string;
  thumbnail_url?: string;
}

export default function AssetLibrary() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'audio'>('all');

  useEffect(() => {
    loadAssets();
  }, [user]);

  const loadAssets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading assets:', error);
    } else {
      setAssets(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manda-strong-assets')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('manda-strong-assets')
        .getPublicUrl(fileName);

      const assetType = file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'text';

      const { error: dbError } = await supabase.from('assets').insert({
        user_id: user.id,
        name: file.name,
        type: assetType,
        url: urlData.publicUrl,
        size: file.size,
      });

      if (dbError) {
        console.error('Database error:', dbError);
      }
    }

    setUploading(false);
    loadAssets();
  };

  const deleteAsset = async (asset: Asset) => {
    if (!confirm(`Delete ${asset.name}?`)) return;

    const path = asset.url.split('/').slice(-2).join('/');

    await supabase.storage.from('manda-strong-assets').remove([path]);

    const { error } = await supabase.from('assets').delete().eq('id', asset.id);

    if (error) {
      console.error('Error deleting asset:', error);
    } else {
      setAssets(assets.filter((a) => a.id !== asset.id));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'audio':
        return Music;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/60">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Asset Library</h2>
          <p className="text-white/60">Manage your media files and resources</p>
        </div>
        <label className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all cursor-pointer">
          <Upload className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Upload Files'}
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept="video/*,image/*,audio/*"
          />
        </label>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'video', 'image', 'audio'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filterType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-20">
          <Upload className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-white/60 text-lg mb-2">No assets found</h3>
          <p className="text-white/40">Upload your first media files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const Icon = getIcon(asset.type);
            return (
              <div
                key={asset.id}
                className="bg-slate-800/30 border border-white/10 rounded-lg overflow-hidden hover:border-blue-400/50 transition-all group"
              >
                <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                  {asset.type === 'image' ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="w-12 h-12 text-white/30" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <a
                      href={asset.url}
                      download
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </a>
                    <button
                      onClick={() => deleteAsset(asset)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate mb-1">{asset.name}</p>
                  <p className="text-white/40 text-xs">{formatFileSize(asset.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
