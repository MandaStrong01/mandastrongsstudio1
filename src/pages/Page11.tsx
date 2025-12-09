import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Image, File, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

interface AIAsset {
  id: string;
  tool_name: string;
  output_data: any;
  created_at: string;
}

export default function Page11({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<AIAsset[]>([]);
  const [loading, setLoading] = useState(true);

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
        .from('ai_tool_outputs')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              MEDIA BOX
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Your AI-generated assets from pages 4-9
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg">No assets yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Use the AI tools on pages 4-9 to generate content
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-black/50 border border-white/20 rounded-lg p-4 hover:border-green-400 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{asset.tool_name}</h3>
                      <p className="text-xs text-slate-400">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/50 border border-white/10 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                      {JSON.stringify(asset.output_data, null, 2).slice(0, 200)}...
                    </pre>
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
