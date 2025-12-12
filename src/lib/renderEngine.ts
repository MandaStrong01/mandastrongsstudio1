import { VideoProject, VideoClip, TextOverlay, Sticker, FILTER_PRESETS } from './videoEngine';
import { ExportFormat, ExportQuality } from '../components/ExportPanel';

export interface RenderOptions {
  format: ExportFormat;
  quality: ExportQuality;
  fps?: number;
  bitrate?: number;
}

export interface RenderProgress {
  percentage: number;
  currentFrame: number;
  totalFrames: number;
  estimatedTimeRemaining: number;
  status: 'preparing' | 'rendering' | 'encoding' | 'complete' | 'error';
  message?: string;
}

const QUALITY_SETTINGS = {
  low: { width: 854, height: 480, bitrate: 1000 },
  medium: { width: 1280, height: 720, bitrate: 2500 },
  high: { width: 1920, height: 1080, bitrate: 5000 },
  ultra: { width: 3840, height: 2160, bitrate: 15000 },
};

export class VideoRenderEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private abortController: AbortController | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
  }

  async renderProject(
    project: VideoProject,
    options: RenderOptions,
    onProgress: (progress: RenderProgress) => void
  ): Promise<Blob> {
    this.abortController = new AbortController();
    const qualitySettings = QUALITY_SETTINGS[options.quality];

    this.canvas.width = qualitySettings.width;
    this.canvas.height = qualitySettings.height;

    const fps = options.fps || project.fps;
    const totalFrames = Math.ceil(project.duration * fps);

    onProgress({
      percentage: 0,
      currentFrame: 0,
      totalFrames,
      estimatedTimeRemaining: 0,
      status: 'preparing',
      message: 'Preparing render...',
    });

    try {
      const frames: Blob[] = [];
      const startTime = Date.now();

      for (let frame = 0; frame < totalFrames; frame++) {
        if (this.abortController.signal.aborted) {
          throw new Error('Render cancelled');
        }

        const time = frame / fps;
        await this.renderFrame(project, time);

        const frameBlob = await new Promise<Blob>((resolve) => {
          this.canvas.toBlob((blob) => {
            resolve(blob!);
          }, 'image/png');
        });

        frames.push(frameBlob);

        const elapsed = Date.now() - startTime;
        const framesRemaining = totalFrames - frame - 1;
        const timePerFrame = elapsed / (frame + 1);
        const estimatedTimeRemaining = Math.ceil((framesRemaining * timePerFrame) / 1000);

        onProgress({
          percentage: ((frame + 1) / totalFrames) * 80,
          currentFrame: frame + 1,
          totalFrames,
          estimatedTimeRemaining,
          status: 'rendering',
          message: `Rendering frame ${frame + 1} of ${totalFrames}...`,
        });
      }

      onProgress({
        percentage: 85,
        currentFrame: totalFrames,
        totalFrames,
        estimatedTimeRemaining: 0,
        status: 'encoding',
        message: 'Encoding video...',
      });

      const videoBlob = await this.encodeFrames(frames, options, fps);

      onProgress({
        percentage: 100,
        currentFrame: totalFrames,
        totalFrames,
        estimatedTimeRemaining: 0,
        status: 'complete',
        message: 'Render complete!',
      });

      return videoBlob;
    } catch (error) {
      onProgress({
        percentage: 0,
        currentFrame: 0,
        totalFrames,
        estimatedTimeRemaining: 0,
        status: 'error',
        message: error instanceof Error ? error.message : 'Render failed',
      });
      throw error;
    }
  }

  private async renderFrame(project: VideoProject, time: number): Promise<void> {
    this.ctx.fillStyle = project.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const activeClips = project.videoClips.filter(
      (clip) => time >= clip.startTime && time < clip.endTime
    );

    for (const clip of activeClips) {
      await this.renderVideoClip(clip, time);
    }

    const activeText = project.textOverlays.filter(
      (overlay) => time >= overlay.startTime && time < overlay.endTime
    );

    for (const text of activeText) {
      this.renderTextOverlay(text, time);
    }

    const activeStickers = project.stickers.filter(
      (sticker) => time >= sticker.startTime && time < sticker.endTime
    );

    for (const sticker of activeStickers) {
      await this.renderSticker(sticker, time);
    }
  }

  private async renderVideoClip(clip: VideoClip, currentTime: number): Promise<void> {
    this.ctx.save();

    const filterStrings = clip.filters.map(f => {
      const preset = FILTER_PRESETS[f.type];
      return preset ? `${preset}` : '';
    }).filter(Boolean);

    if (filterStrings.length > 0) {
      this.ctx.filter = filterStrings.join(' ');
    }

    this.ctx.restore();
  }

  private renderTextOverlay(overlay: TextOverlay, currentTime: number): void {
    this.ctx.save();

    const progress = (currentTime - overlay.startTime) / (overlay.endTime - overlay.startTime);
    let alpha = 1;

    if (overlay.animation === 'fade') {
      if (progress < 0.1) {
        alpha = progress / 0.1;
      } else if (progress > 0.9) {
        alpha = (1 - progress) / 0.1;
      }
    }

    this.ctx.globalAlpha = alpha;
    this.ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
    this.ctx.fillStyle = overlay.color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const x = (overlay.x / 100) * this.canvas.width;
    const y = (overlay.y / 100) * this.canvas.height;

    if (overlay.backgroundColor) {
      const metrics = this.ctx.measureText(overlay.text);
      const padding = 10;
      this.ctx.fillStyle = overlay.backgroundColor;
      this.ctx.fillRect(
        x - metrics.width / 2 - padding,
        y - overlay.fontSize / 2 - padding,
        metrics.width + padding * 2,
        overlay.fontSize + padding * 2
      );
    }

    this.ctx.fillStyle = overlay.color;
    this.ctx.fillText(overlay.text, x, y);

    this.ctx.restore();
  }

  private async renderSticker(sticker: Sticker, currentTime: number): Promise<void> {
    this.ctx.save();

    const progress = (currentTime - sticker.startTime) / (sticker.endTime - sticker.startTime);
    let alpha = 1;
    let scale = sticker.scale;
    let rotation = sticker.rotation;

    if (sticker.animation === 'fade') {
      if (progress < 0.1) alpha = progress / 0.1;
      else if (progress > 0.9) alpha = (1 - progress) / 0.1;
    } else if (sticker.animation === 'pulse') {
      scale = sticker.scale * (1 + Math.sin(progress * Math.PI * 4) * 0.1);
    } else if (sticker.animation === 'bounce') {
      const bounce = Math.abs(Math.sin(progress * Math.PI * 2));
      scale = sticker.scale * (1 + bounce * 0.2);
    } else if (sticker.animation === 'spin') {
      rotation = (rotation + progress * 360) % 360;
    }

    this.ctx.globalAlpha = alpha;

    const x = (sticker.x / 100) * this.canvas.width;
    const y = (sticker.y / 100) * this.canvas.height;

    this.ctx.translate(x, y);
    this.ctx.rotate((rotation * Math.PI) / 180);
    this.ctx.scale(scale, scale);

    const img = await this.loadImage(sticker.url);
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);

    this.ctx.restore();
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private async encodeFrames(
    frames: Blob[],
    options: RenderOptions,
    fps: number
  ): Promise<Blob> {
    return new Blob(frames, { type: 'video/mp4' });
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}

export function createRenderEngine(): VideoRenderEngine {
  return new VideoRenderEngine();
}
