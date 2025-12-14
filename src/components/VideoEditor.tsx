import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Layers, Volume2, Type, Sparkles, Upload } from 'lucide-react';
import Timeline from './Timeline';
import VideoFilters from './VideoFilters';
import VideoEffects from './VideoEffects';
import TextOverlayEditor from './TextOverlayEditor';
import AudioManager from './AudioManager';
import ExportPanel from './ExportPanel';
import UniversalMediaAcceptor from './UniversalMediaAcceptor';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface VideoEditorProps {
  projectId?: string;
}

export default function VideoEditor({ projectId }: VideoEditorProps) {
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState<'timeline' | 'filters' | 'effects' | 'text' | 'audio' | 'export'>('timeline');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [clips, setClips] = useState<any[]>([]);
  const [showMediaAcceptor, setShowMediaAcceptor] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
    if (user) {
      loadAvailableAssets();
    }
  }, [projectId, user]);

  const loadProject = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('movie_projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (data && !error) {
      setClips(data.clips || []);
      setDuration(data.duration || 60);
    }
  };

  const loadAvailableAssets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setAvailableAssets(data);
    }
  };

  const handleMediaAccepted = async (mediaId: string) => {
    await loadAvailableAssets();

    if (projectId) {
      const { data: project } = await supabase
        .from('movie_projects')
        .select('asset_ids')
        .eq('id', projectId)
        .maybeSingle();

      const existingAssetIds = project?.asset_ids || [];
      const updatedAssetIds = [...new Set([...existingAssetIds, mediaId])];

      await supabase
        .from('movie_projects')
        .update({ asset_ids: updatedAssetIds })
        .eq('id', projectId);
    }
  };

  const panels = [
    { id: 'timeline' as const, label: 'Timeline', icon: Layers },
    { id: 'filters' as const, label: 'Filters', icon: Sparkles },
    { id: 'effects' as const, label: 'Effects', icon: Sparkles },
    { id: 'text' as const, label: 'Text', icon: Type },
    { id: 'audio' as const, label: 'Audio', icon: Volume2 },
    { id: 'export' as const, label: 'Export', icon: Download },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'timeline':
        return <Timeline clips={clips} onClipsChange={setClips} />;
      case 'filters':
        return <VideoFilters />;
      case 'effects':
        return <VideoEffects />;
      case 'text':
        return <TextOverlayEditor />;
      case 'audio':
        return <AudioManager />;
      case 'export':
        return <ExportPanel projectId={projectId} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex-1 flex flex-col">
        <div className="bg-black/40 border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Video Editor</h2>
          <button
            onClick={() => setShowMediaAcceptor(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
          >
            <Upload className="w-4 h-4" />
            Add Media
          </button>
        </div>

        <div className="flex-1 bg-black/30 flex items-center justify-center border-b border-white/10">
          <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-white/10 flex items-center justify-center">
            <Play className="w-16 h-16 text-white/20" />
          </div>
        </div>

        <div className="bg-black/40 border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-white/60 text-sm">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2 px-6">
            {panels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;

              return (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                    isActive
                      ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{panel.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {renderPanel()}
        </div>
      </div>

      {showMediaAcceptor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <UniversalMediaAcceptor
            onMediaAccepted={handleMediaAccepted}
            onClose={() => setShowMediaAcceptor(false)}
          />
        </div>
      )}
    </div>
  );
}
