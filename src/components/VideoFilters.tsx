import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Filter, FILTER_PRESETS } from '../lib/videoEngine';

interface VideoFiltersProps {
  onApplyFilter: (filter: Filter) => void;
  currentFilters: Filter[];
}

const FILTERS: { name: string; type: Filter['type']; preview: string }[] = [
  { name: 'Grayscale', type: 'grayscale', preview: 'Black & White classic' },
  { name: 'Sepia', type: 'sepia', preview: 'Vintage warm tone' },
  { name: 'Vintage', type: 'vintage', preview: 'Retro film look' },
  { name: 'Cool', type: 'cool', preview: 'Blue cinematic' },
  { name: 'Warm', type: 'warm', preview: 'Golden hour glow' },
  { name: 'Vibrant', type: 'vibrant', preview: 'Saturated colors' },
  { name: 'Noir', type: 'noir', preview: 'Dark dramatic' },
];

export default function VideoFilters({ onApplyFilter, currentFilters }: VideoFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isFilterActive = (type: Filter['type']) => {
    return currentFilters.some(f => f.type === type && f.intensity > 0);
  };

  const handleFilterClick = (type: Filter['type']) => {
    const existingFilter = currentFilters.find(f => f.type === type);
    const intensity = existingFilter && existingFilter.intensity > 0 ? 0 : 1.0;
    onApplyFilter({ type, intensity });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Sparkles className="w-5 h-5" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-black/95 backdrop-blur-xl border border-purple-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Artistic Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {FILTERS.map((filter) => (
              <button
                key={filter.type}
                onClick={() => handleFilterClick(filter.type)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isFilterActive(filter.type)
                    ? 'bg-purple-600/50 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold mb-1">{filter.name}</div>
                <div className="text-xs text-white/60">{filter.preview}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <div className="text-xs text-white/60">
              Click any filter to apply or remove it from your video
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
