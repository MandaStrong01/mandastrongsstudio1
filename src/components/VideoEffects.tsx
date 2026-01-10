import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import { Effect } from '../lib/videoEngine';

interface VideoEffectsProps {
  onApplyEffect: (effect: Effect) => void;
  currentTime: number;
}

const EFFECTS: { name: string; type: Effect['type']; description: string }[] = [
  { name: 'Blur', type: 'blur', description: 'Soft focus effect' },
  { name: 'Sharpen', type: 'sharpen', description: 'Enhanced clarity' },
  { name: 'Vignette', type: 'vignette', description: 'Darkened edges' },
  { name: 'Glow', type: 'glow', description: 'Luminous highlights' },
  { name: 'Pixelate', type: 'pixelate', description: 'Retro digital look' },
];

export default function VideoEffects({ onApplyEffect, currentTime }: VideoEffectsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect['type'] | null>(null);
  const [intensity, setIntensity] = useState(0.5);
  const [duration, setDuration] = useState(2);

  const handleApply = () => {
    if (!selectedEffect) return;

    const effect: Effect = {
      type: selectedEffect,
      intensity,
      startTime: currentTime,
      endTime: currentTime + duration,
    };

    onApplyEffect(effect);
    setIsOpen(false);
    setSelectedEffect(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Zap className="w-5 h-5" />
        Effects
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-96 bg-black/95 backdrop-blur-xl border border-purple-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Video Effects</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {EFFECTS.map((effect) => (
              <button
                key={effect.type}
                onClick={() => setSelectedEffect(effect.type)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedEffect === effect.type
                    ? 'bg-purple-600/50 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold mb-1">{effect.name}</div>
                <div className="text-xs text-white/60">{effect.description}</div>
              </button>
            ))}
          </div>

          {selectedEffect && (
            <div className="space-y-4 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Intensity: {Math.round(intensity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Duration: {duration}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Apply Effect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
