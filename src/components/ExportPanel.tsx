import { useState } from 'react';
import { Download, X, Film, Image, FileVideo } from 'lucide-react';
import { VideoProject } from '../lib/videoEngine';

interface ExportPanelProps {
  project: VideoProject;
  onExport: (format: ExportFormat, quality: ExportQuality) => void;
}

export type ExportFormat = 'mp4' | 'webm' | 'gif' | 'frames';
export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

const FORMATS: { value: ExportFormat; label: string; icon: any; description: string }[] = [
  { value: 'mp4', label: 'MP4 Video', icon: Film, description: 'Best for social media and web' },
  { value: 'webm', label: 'WebM Video', icon: FileVideo, description: 'Optimized for web streaming' },
  { value: 'gif', label: 'Animated GIF', icon: Image, description: 'For short loops and memes' },
  { value: 'frames', label: 'Frame Sequence', icon: Image, description: 'Export as PNG frames' },
];

const QUALITIES: { value: ExportQuality; label: string; resolution: string }[] = [
  { value: 'low', label: 'Low', resolution: '480p' },
  { value: 'medium', label: 'Medium', resolution: '720p' },
  { value: 'high', label: 'High', resolution: '1080p' },
  { value: 'ultra', label: 'Ultra', resolution: '4K' },
];

export default function ExportPanel({ project, onExport }: ExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('mp4');
  const [selectedQuality, setSelectedQuality] = useState<ExportQuality>('high');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat, selectedQuality);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        <Download className="w-5 h-5" />
        Export
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-black/95 backdrop-blur-xl border border-blue-500/50 rounded-lg shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Export Video</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-3">Select Format</h4>
            <div className="space-y-2">
              {FORMATS.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedFormat === format.value
                        ? 'bg-blue-600/50 border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold">{format.label}</span>
                    </div>
                    <div className="text-xs text-white/60">{format.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-3">Select Quality</h4>
            <div className="grid grid-cols-2 gap-2">
              {QUALITIES.map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => setSelectedQuality(quality.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedQuality === quality.value
                      ? 'bg-blue-600/50 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-semibold text-sm">{quality.label}</div>
                  <div className="text-xs text-white/60">{quality.resolution}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/30 mb-4">
            <div className="text-xs text-white/80 space-y-1">
              <div><strong>Title:</strong> {project.title}</div>
              <div><strong>Duration:</strong> {project.duration.toFixed(1)}s</div>
              <div><strong>Clips:</strong> {project.videoClips.length}</div>
              <div><strong>Resolution:</strong> {project.resolution.width}x{project.resolution.height}</div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition-all"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
          </button>
        </div>
      )}
    </div>
  );
}
