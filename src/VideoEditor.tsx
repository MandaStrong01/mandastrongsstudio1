import React, { useRef, useState, useEffect } from "react";
import "./VideoEditor.css";

const VideoEditor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration > 0) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  return (
    <div className="video-editor-container">
      <h2 className="editor-title">🎬 Open Video Editor</h2>

      <div className="video-preview">
        <video
          ref={videoRef}
          src="/videos/background.mp4"
          className="editor-video"
          onTimeUpdate={handleProgress}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
        />
      </div>

      <div className="editor-controls">
        <button className="control-btn" onClick={handlePlayPause}>
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>

        <label className="slider-label">
          🔊 Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </label>

        <label className="slider-label">
          ⚡ Speed:
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          />
        </label>

        <label className="slider-label">
          🕒 Progress:
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
          />
        </label>
      </div>

      <div className="editor-tools">
        <button className="tool-btn">✂️ Trim</button>
        <button className="tool-btn">🎵 Add Music</button>
        <button className="tool-btn">💬 Add Subtitles</button>
        <button className="tool-btn">🎨 Color Grade</button>
        <button className="tool-btn">📸 Snapshot</button>
        <button className="tool-btn">📦 Export</button>
      </div>
    </div>
  );
};

export default VideoEditor;
