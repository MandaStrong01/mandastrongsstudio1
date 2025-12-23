import { useState, useRef, useEffect } from 'react';
import { Film, Volume2, Type, Scissors, Trash2, Copy, MoveHorizontal } from 'lucide-react';
import { VideoClip, AudioClip, TextOverlay, VideoProject } from '../lib/videoEngine';

interface AdvancedTimelineProps {
  project: VideoProject;
  currentTime: number;
  onSeek: (time: number) => void;
  onUpdateProject: (project: VideoProject) => void;
  onSplitClip: (clipId: string, time: number) => void;
  onDeleteClip: (clipId: string) => void;
}

export default function AdvancedTimeline({
  project,
  currentTime,
  onSeek,
  onUpdateProject,
  onSplitClip,
  onDeleteClip,
}: AdvancedTimelineProps) {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 50 * zoom;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / pixelsPerSecond);
    onSeek(Math.max(0, Math.min(time, project.duration)));
  };

  const handleClipDragStart = (clipId: string) => {
    setSelectedClip(clipId);
    setIsDragging(true);
  };

  const handleClipDragEnd = () => {
    setIsDragging(false);
  };

  const renderVideoTrack = () => {
    return (
      <div className="relative h-16 bg-purple-900/20 border-b border-purple-500/20">
        {project.videoClips.map((clip) => {
          const left = clip.startTime * pixelsPerSecond;
          const width = (clip.endTime - clip.startTime) * pixelsPerSecond;

          return (
            <div
              key={clip.id}
              className={`absolute top-1 h-14 rounded border-2 cursor-move transition-all ${
                selectedClip === clip.id
                  ? 'border-purple-400 bg-purple-600/60'
                  : 'border-purple-500/50 bg-purple-600/40 hover:bg-purple-600/50'
              }`}
              style={{ left: `${left}px`, width: `${width}px` }}
              onMouseDown={() => handleClipDragStart(clip.id)}
              onMouseUp={handleClipDragEnd}
            >
              <div className="px-2 py-1 text-xs font-semibold text-white truncate">
                Video Clip
              </div>
              <div className="absolute bottom-1 right-1 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSplitClip(clip.id, currentTime);
                  }}
                  className="p-1 bg-black/50 hover:bg-black/70 rounded transition-all"
                  title="Split at playhead"
                >
                  <Scissors className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClip(clip.id);
                  }}
                  className="p-1 bg-black/50 hover:bg-red-600/70 rounded transition-all"
                  title="Delete clip"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAudioTrack = () => {
    return (
      <div className="relative h-16 bg-green-900/20 border-b border-green-500/20">
        {project.audioClips.map((clip) => {
          const left = clip.startTime * pixelsPerSecond;
          const width = (clip.endTime - clip.startTime) * pixelsPerSecond;

          return (
            <div
              key={clip.id}
              className={`absolute top-1 h-14 rounded border-2 cursor-move ${
                selectedClip === clip.id
                  ? 'border-green-400 bg-green-600/60'
                  : 'border-green-500/50 bg-green-600/40 hover:bg-green-600/50'
              }`}
              style={{ left: `${left}px`, width: `${width}px` }}
              onMouseDown={() => setSelectedClip(clip.id)}
            >
              <div className="px-2 py-1 text-xs font-semibold text-white truncate">
                Audio
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextTrack = () => {
    return (
      <div className="relative h-16 bg-yellow-900/20 border-b border-yellow-500/20">
        {project.textOverlays.map((overlay) => {
          const left = overlay.startTime * pixelsPerSecond;
          const width = (overlay.endTime - overlay.startTime) * pixelsPerSecond;

          return (
            <div
              key={overlay.id}
              className={`absolute top-1 h-14 rounded border-2 cursor-move ${
                selectedClip === overlay.id
                  ? 'border-yellow-400 bg-yellow-600/60'
                  : 'border-yellow-500/50 bg-yellow-600/40 hover:bg-yellow-600/50'
              }`}
              style={{ left: `${left}px`, width: `${width}px` }}
              onMouseDown={() => setSelectedClip(overlay.id)}
            >
              <div className="px-2 py-1 text-xs font-semibold text-white truncate">
                {overlay.text}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const timelineWidth = Math.max(project.duration * pixelsPerSecond, 800);

  return (
    <div className="bg-black/50 rounded-lg border border-purple-500/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">Timeline</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-purple-400 font-mono">
            {formatTime(currentTime)} / {formatTime(project.duration)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70">Zoom:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <div
          ref={timelineRef}
          className="relative bg-black/30 rounded-lg border border-purple-500/20"
          style={{ width: `${timelineWidth}px` }}
          onClick={handleTimelineClick}
        >
          <div className="h-8 border-b border-purple-500/20 flex items-center px-2 bg-black/20">
            <div className="flex items-center gap-2 text-xs text-white/70">
              {Array.from({ length: Math.ceil(project.duration) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${i * pixelsPerSecond}px` }}
                >
                  <div className="text-xs font-mono">{i}s</div>
                  <div className="w-px h-2 bg-white/30 mt-1"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-2 bg-purple-900/20 border-b border-purple-500/20">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-white">VIDEO</span>
          </div>
          {renderVideoTrack()}

          <div className="flex items-center gap-2 px-2 py-2 bg-green-900/20 border-b border-green-500/20">
            <Volume2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-white">AUDIO</span>
          </div>
          {renderAudioTrack()}

          <div className="flex items-center gap-2 px-2 py-2 bg-yellow-900/20 border-b border-yellow-500/20">
            <Type className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-white">TEXT</span>
          </div>
          {renderTextTrack()}

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-purple-400 pointer-events-none z-10"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max={project.duration}
          step="0.01"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
