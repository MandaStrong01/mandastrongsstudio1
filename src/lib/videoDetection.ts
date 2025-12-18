export function isVideoFile(file: File): boolean {
  const videoMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ];

  return videoMimeTypes.includes(file.type) ||
         /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);
}

export async function extractVideoMetadata(file: File): Promise<any> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight,
      });
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({});
    };

    video.src = URL.createObjectURL(file);
  });
}
