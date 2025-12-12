import { useState } from 'react';
import { Music, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { AudioClip } from '../lib/videoEngine';

interface AudioManagerProps {
  audioClips: AudioClip[];
  onAddAudio: (file: File) => void;
  onUpdateVolume: (clipId: string, volume: number) => void;
  onRemoveAudio: (clipId: string) => void;
}

export default function AudioManager({
  audioClips,
  onAddAudio,
  onUpdateVolume,
  onRemoveAudio,
}: AudioManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        onAddAudio(file);
      }
    });

    e.target.value = '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Music className="w-5 h-5" />
        Audio
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-96 bg-black/95 backdrop-blur-xl border border-green-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Audio Management</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => document.getElementById('audio-upload')?.click()}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg font-semibold mb-4 transition-all"
          >
            <Upload className="w-5 h-5" />
            Add Background Music
          </button>
          <input
            id="audio-upload"
            type="file"
            multiple
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {audioClips.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No audio tracks added yet</p>
              </div>
            ) : (
              audioClips.map((clip) => (
                <div
                  key={clip.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-white">
                        Audio Track
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveAudio(clip.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {clip.volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-white/50" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white/70" />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={clip.volume}
                      onChange={(e) => onUpdateVolume(clip.id, parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-white/70 w-12 text-right">
                      {Math.round(clip.volume * 100)}%
                    </span>
                  </div>

                  <div className="text-xs text-white/50">
                    {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
            <div className="text-xs text-white/60">
              Add music, voiceovers, or sound effects to enhance your video
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
