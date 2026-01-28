import { useState } from 'react';
import { Smile, X, Plus, Upload } from 'lucide-react';
import { Sticker } from '../lib/videoEngine';

interface StickerPanelProps {
  stickers: Sticker[];
  currentTime: number;
  onAddSticker: (url: string, duration: number) => void;
  onUpdateSticker: (id: string, updates: Partial<Sticker>) => void;
  onRemoveSticker: (id: string) => void;
}

const EMOJI_STICKERS = [
  '😀', '😂', '❤️', '🔥', '⭐', '✨', '🎉', '🎊', '🎈', '🌟',
  '👍', '👏', '💯', '🚀', '💪', '🎯', '🏆', '💎', '🌈', '☀️',
];

export default function StickerPanel({
  stickers,
  currentTime,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
}: StickerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(2);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const handleAddEmoji = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);

    const url = canvas.toDataURL();
    onAddSticker(url, duration);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onAddSticker(e.target.result as string, duration);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    e.target.value = '';
  };

  const selectedStickerData = stickers.find(s => s.id === selectedSticker);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Smile className="w-5 h-5" />
        Stickers
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-96 bg-black/95 backdrop-blur-xl border border-pink-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Stickers & Emojis</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <button
              onClick={() => document.getElementById('sticker-upload')?.click()}
              className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg font-semibold transition-all text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Custom Sticker
            </button>
            <input
              id="sticker-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Emoji Stickers</h4>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-lg">
              {EMOJI_STICKERS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleAddEmoji(emoji)}
                  className="text-3xl hover:scale-110 transition-transform p-2 hover:bg-white/10 rounded"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white mb-3">Active Stickers</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stickers.length === 0 ? (
                <div className="text-center py-4 text-white/50 text-sm">
                  No stickers added yet
                </div>
              ) : (
                stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={sticker.url} alt="Sticker" className="w-8 h-8" />
                        <span className="text-sm text-white">
                          {sticker.startTime.toFixed(1)}s - {sticker.endTime.toFixed(1)}s
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveSticker(sticker.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedSticker(sticker.id === selectedSticker ? null : sticker.id)}
                      className="text-xs text-pink-400 hover:text-pink-300"
                    >
                      {sticker.id === selectedSticker ? 'Hide' : 'Edit'} Properties
                    </button>

                    {sticker.id === selectedSticker && selectedStickerData && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-white/10">
                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Scale: {selectedStickerData.scale.toFixed(1)}x
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={selectedStickerData.scale}
                            onChange={(e) => onUpdateSticker(sticker.id, { scale: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Rotation: {selectedStickerData.rotation}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={selectedStickerData.rotation}
                            onChange={(e) => onUpdateSticker(sticker.id, { rotation: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white mb-1">
                            Animation
                          </label>
                          <select
                            value={selectedStickerData.animation || 'none'}
                            onChange={(e) => onUpdateSticker(sticker.id, { animation: e.target.value as any })}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                          >
                            <option value="none">None</option>
                            <option value="fade">Fade</option>
                            <option value="pulse">Pulse</option>
                            <option value="bounce">Bounce</option>
                            <option value="spin">Spin</option>
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
