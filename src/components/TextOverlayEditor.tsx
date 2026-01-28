import { useState } from 'react';
import { Type, X, Plus } from 'lucide-react';
import { TextOverlay } from '../lib/videoEngine';

interface TextOverlayEditorProps {
  textOverlays: TextOverlay[];
  currentTime: number;
  onAddText: (text: string, duration: number) => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onRemoveText: (id: string) => void;
}

const ANIMATIONS = ['none', 'fade', 'slide', 'bounce'] as const;
const FONTS = ['Arial', 'Georgia', 'Courier New', 'Comic Sans MS', 'Impact'];

export default function TextOverlayEditor({
  textOverlays,
  currentTime,
  onAddText,
  onUpdateText,
  onRemoveText,
}: TextOverlayEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [duration, setDuration] = useState(3);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);

  const handleAddText = () => {
    if (!newText.trim()) return;
    onAddText(newText, duration);
    setNewText('');
    setDuration(3);
  };

  const selectedTextOverlay = textOverlays.find(t => t.id === selectedOverlay);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Type className="w-5 h-5" />
        Text
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-96 bg-black/95 backdrop-blur-xl border border-yellow-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Text Overlays</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Text Content
              </label>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter your text..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-500"
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
              onClick={handleAddText}
              disabled={!newText.trim()}
              className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Text at {currentTime.toFixed(1)}s
            </button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white mb-3">Existing Text Overlays</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {textOverlays.length === 0 ? (
                <div className="text-center py-4 text-white/50 text-sm">
                  No text overlays added yet
                </div>
              ) : (
                textOverlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white truncate flex-1">
                        {overlay.text}
                      </span>
                      <button
                        onClick={() => onRemoveText(overlay.id)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-white/50">
                      {overlay.startTime.toFixed(1)}s - {overlay.endTime.toFixed(1)}s
                    </div>
                    <button
                      onClick={() => setSelectedOverlay(overlay.id === selectedOverlay ? null : overlay.id)}
                      className="text-xs text-yellow-400 hover:text-yellow-300 mt-2"
                    >
                      {overlay.id === selectedOverlay ? 'Hide' : 'Edit'} Properties
                    </button>

                    {overlay.id === selectedOverlay && selectedTextOverlay && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-white/10">
                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Font Size: {selectedTextOverlay.fontSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="120"
                            value={selectedTextOverlay.fontSize}
                            onChange={(e) => onUpdateText(overlay.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Font Family
                          </label>
                          <select
                            value={selectedTextOverlay.fontFamily}
                            onChange={(e) => onUpdateText(overlay.id, { fontFamily: e.target.value })}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                          >
                            {FONTS.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Color
                          </label>
                          <input
                            type="color"
                            value={selectedTextOverlay.color}
                            onChange={(e) => onUpdateText(overlay.id, { color: e.target.value })}
                            className="w-full h-8 rounded cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Animation
                          </label>
                          <select
                            value={selectedTextOverlay.animation || 'none'}
                            onChange={(e) => onUpdateText(overlay.id, { animation: e.target.value as any })}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                          >
                            {ANIMATIONS.map(anim => (
                              <option key={anim} value={anim}>{anim}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
