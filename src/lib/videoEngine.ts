export interface VideoClip {
  id: string;
  assetId: string;
  startTime: number;
  endTime: number;
  trimStart: number;
  trimEnd: number;
  trackIndex: number;
  effects: Effect[];
  filters: Filter[];
  volume: number;
}

export interface AudioClip {
  id: string;
  assetId: string;
  startTime: number;
  endTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  animation?: 'fade' | 'slide' | 'bounce' | 'none';
  backgroundColor?: string;
  borderColor?: string;
  rotation?: number;
}

export interface Sticker {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  animation?: 'fade' | 'pulse' | 'bounce' | 'spin' | 'none';
}

export interface Effect {
  type: 'blur' | 'sharpen' | 'vignette' | 'glow' | 'pixelate';
  intensity: number;
  startTime: number;
  endTime: number;
}

export interface Filter {
  type: 'grayscale' | 'sepia' | 'vintage' | 'cool' | 'warm' | 'vibrant' | 'noir';
  intensity: number;
}

export interface Transition {
  type: 'cut' | 'fade' | 'dissolve' | 'slide' | 'wipe' | 'zoom';
  duration: number;
}

export interface VideoProject {
  id: string;
  title: string;
  duration: number;
  resolution: { width: number; height: number };
  fps: number;
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  transitions: Map<string, Transition>;
  backgroundColor: string;
}

export const FILTER_PRESETS: Record<string, string> = {
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  vintage: 'sepia(40%) saturate(150%) contrast(110%)',
  cool: 'hue-rotate(180deg) saturate(120%)',
  warm: 'sepia(30%) saturate(130%) brightness(105%)',
  vibrant: 'saturate(200%) contrast(115%)',
  noir: 'grayscale(100%) contrast(150%) brightness(90%)',
};

export const EFFECT_PRESETS: Record<string, string> = {
  blur: 'blur(4px)',
  sharpen: 'contrast(130%) brightness(105%)',
  vignette: 'brightness(70%)',
  glow: 'brightness(120%) saturate(150%)',
  pixelate: 'contrast(200%)',
};

export function createVideoProject(title: string): VideoProject {
  return {
    id: crypto.randomUUID(),
    title,
    duration: 0,
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    videoClips: [],
    audioClips: [],
    textOverlays: [],
    stickers: [],
    transitions: new Map(),
    backgroundColor: '#000000',
  };
}

export function addVideoClip(
  project: VideoProject,
  assetId: string,
  startTime: number,
  duration: number,
  trackIndex: number = 0
): VideoClip {
  const clip: VideoClip = {
    id: crypto.randomUUID(),
    assetId,
    startTime,
    endTime: startTime + duration,
    trimStart: 0,
    trimEnd: duration,
    trackIndex,
    effects: [],
    filters: [],
    volume: 1.0,
  };

  project.videoClips.push(clip);
  project.duration = Math.max(project.duration, clip.endTime);

  return clip;
}

export function addAudioClip(
  project: VideoProject,
  assetId: string,
  startTime: number,
  duration: number
): AudioClip {
  const clip: AudioClip = {
    id: crypto.randomUUID(),
    assetId,
    startTime,
    endTime: startTime + duration,
    volume: 1.0,
    fadeIn: 0,
    fadeOut: 0,
  };

  project.audioClips.push(clip);
  project.duration = Math.max(project.duration, clip.endTime);

  return clip;
}

export function addTextOverlay(
  project: VideoProject,
  text: string,
  startTime: number,
  duration: number,
  x: number = 50,
  y: number = 50
): TextOverlay {
  const overlay: TextOverlay = {
    id: crypto.randomUUID(),
    text,
    startTime,
    endTime: startTime + duration,
    x,
    y,
    fontSize: 48,
    fontFamily: 'Arial',
    color: '#ffffff',
    animation: 'fade',
  };

  project.textOverlays.push(overlay);

  return overlay;
}

export function addSticker(
  project: VideoProject,
  url: string,
  startTime: number,
  duration: number,
  x: number = 50,
  y: number = 50
): Sticker {
  const sticker: Sticker = {
    id: crypto.randomUUID(),
    url,
    startTime,
    endTime: startTime + duration,
    x,
    y,
    scale: 1.0,
    rotation: 0,
    animation: 'fade',
  };

  project.stickers.push(sticker);

  return sticker;
}

export function applyFilterToClip(clip: VideoClip, filter: Filter): void {
  const existingIndex = clip.filters.findIndex(f => f.type === filter.type);
  if (existingIndex >= 0) {
    clip.filters[existingIndex] = filter;
  } else {
    clip.filters.push(filter);
  }
}

export function applyEffectToClip(clip: VideoClip, effect: Effect): void {
  clip.effects.push(effect);
}

export function trimClip(clip: VideoClip, trimStart: number, trimEnd: number): void {
  clip.trimStart = trimStart;
  clip.trimEnd = trimEnd;
  clip.endTime = clip.startTime + (trimEnd - trimStart);
}

export function splitClip(project: VideoProject, clipId: string, splitTime: number): void {
  const clipIndex = project.videoClips.findIndex(c => c.id === clipId);
  if (clipIndex === -1) return;

  const originalClip = project.videoClips[clipIndex];
  if (splitTime <= originalClip.startTime || splitTime >= originalClip.endTime) return;

  const firstClip: VideoClip = {
    ...originalClip,
    id: crypto.randomUUID(),
    endTime: splitTime,
    trimEnd: originalClip.trimStart + (splitTime - originalClip.startTime),
  };

  const secondClip: VideoClip = {
    ...originalClip,
    id: crypto.randomUUID(),
    startTime: splitTime,
    trimStart: originalClip.trimStart + (splitTime - originalClip.startTime),
  };

  project.videoClips.splice(clipIndex, 1, firstClip, secondClip);
}

export function removeClip(project: VideoProject, clipId: string): void {
  project.videoClips = project.videoClips.filter(c => c.id !== clipId);
}

export function removeTextOverlay(project: VideoProject, overlayId: string): void {
  project.textOverlays = project.textOverlays.filter(o => o.id !== overlayId);
}

export function removeSticker(project: VideoProject, stickerId: string): void {
  project.stickers = project.stickers.filter(s => s.id !== stickerId);
}

export function getClipsAtTime(project: VideoProject, time: number): VideoClip[] {
  return project.videoClips.filter(
    clip => time >= clip.startTime && time <= clip.endTime
  );
}

export function exportProjectData(project: VideoProject): string {
  return JSON.stringify({
    ...project,
    transitions: Array.from(project.transitions.entries()),
  });
}

export function importProjectData(data: string): VideoProject {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    transitions: new Map(parsed.transitions),
  };
}
