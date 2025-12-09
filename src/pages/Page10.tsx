import { useState, useRef } from 'react';
import { Film, ArrowLeft, ArrowRight, Upload, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page10({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setError('Please sign in to upload files');
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `assets/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('movie-assets')
          .upload(filePath, file);

        if (uploadError) {
          const { data: publicURL } = supabase.storage
            .from('movie-assets')
            .getPublicUrl(filePath);

          const assetType = file.type.startsWith('image/') ? 'image' :
                           file.type.startsWith('video/') ? 'video' :
                           file.type.startsWith('audio/') ? 'audio' : 'other';

          await supabase.from('assets').insert({
            user_id: user.id,
            file_name: file.name,
            file_type: file.type,
            file_url: publicURL.publicUrl,
            file_size: file.size,
            asset_type: assetType,
            title: file.name.replace(/\.[^/.]+$/, '')
          });
        } else {
          const { data: publicURL } = supabase.storage
            .from('movie-assets')
            .getPublicUrl(uploadData.path);

          const assetType = file.type.startsWith('image/') ? 'image' :
                           file.type.startsWith('video/') ? 'video' :
                           file.type.startsWith('audio/') ? 'audio' : 'other';

          await supabase.from('assets').insert({
            user_id: user.id,
            file_name: file.name,
            file_type: file.type,
            file_url: publicURL.publicUrl,
            file_size: file.size,
            asset_type: assetType,
            title: file.name.replace(/\.[^/.]+$/, '')
          });
        }
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              DOXY MOVIE
            </h1>
          </div>
          <p className="text-xl text-slate-400 italic">
            Upload your assets to build your movie
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-white/20 mb-6">
            <div className="text-center">
              <Film className="w-20 h-20 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-500 text-lg">
                Video player placeholder
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Your completed movie will appear here
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Assets
            </h3>

            <div className="bg-black/50 border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="bg-white/10 p-4 rounded-full">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-slate-400 text-sm">
                    Images, videos, and audio files
                  </p>
                </div>
              </label>
            </div>

            {uploading && (
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-blue-300">Uploading assets...</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Upload successful! View in Media Library on next page.</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(11)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            Next - Media Library
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
