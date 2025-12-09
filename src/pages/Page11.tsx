import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, File, Sparkles, Volume2, Maximize, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

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
  const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [ratio, setRatio] = useState('16:9');
  const [size, setSize] = useState('1080p');

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
      if (data && data.length > 0) {
        setSelectedAsset(data[0]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-full w-full mx-auto flex-1 flex flex-col">
          <h1 className="text-3xl font-black text-purple-400 mb-4 text-center">DOXY THE SCHOOL BULLY - Editor Dashboard</h1>

          <div className="grid grid-cols-12 gap-4 flex-1">
            <div className="col-span-3 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4">
              <h2 className="text-xl font-bold mb-4 text-purple-400">MEDIA BOX</h2>
              <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-slate-400">Loading...</p>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm text-slate-400">No assets yet</p>
                  </div>
                ) : (
                  assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`w-full bg-purple-900/20 border rounded-lg p-3 text-left transition-all hover:bg-purple-900/40 ${
                        selectedAsset?.id === asset.id ? 'border-purple-400 bg-purple-900/40' : 'border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm truncate">{asset.tool_name}</h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="col-span-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-purple-400">VIEWER</h2>
              <div className="flex-1 flex flex-col">
                <div className="aspect-video bg-black rounded-lg border border-purple-500/30 mb-4 flex items-center justify-center">
                  {selectedAsset ? (
                    <div className="text-center p-8">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                      <h3 className="text-lg font-bold mb-2">{selectedAsset.tool_name}</h3>
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto text-left">
                        {JSON.stringify(selectedAsset.output_data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center">
                      <File className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400">Select an asset to preview</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-slate-400">{formatTime(currentTime)}</span>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      step="0.1"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                      className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #9333ea ${(currentTime / duration) * 100}%, rgba(147, 51, 234, 0.2) ${(currentTime / duration) * 100}%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0:00</span>
                      <span>180:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4">
              <h2 className="text-xl font-bold mb-4 text-purple-400">CONTROLS</h2>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">{volume}%</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Maximize className="w-4 h-4 text-purple-400" />
                    Ratio
                  </label>
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="16:9">16:9</option>
                    <option value="4:3">4:3</option>
                    <option value="21:9">21:9</option>
                    <option value="1:1">1:1</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="1440p">1440p</option>
                    <option value="4K">4K</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Duration</label>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{formatTime(currentTime)}</div>
                      <div className="text-xs text-slate-400 mt-1">/ {formatTime(duration)}</div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer mt-3"
                    />
                    <div className="text-xs text-slate-400 mt-1 text-center">Max: 180 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => onNavigate(10)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(12)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
