export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export async function extractVideoMetadata(file: File): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = () => {
      resolve({});
    };

    video.src = URL.createObjectURL(file);
  });
}
