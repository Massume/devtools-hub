import type { ResizeSettings } from '@/types/image';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  const img = await loadImage(src);
  return { width: img.width, height: img.height };
}

export function calculateResize(
  origWidth: number,
  origHeight: number,
  settings: ResizeSettings
): { width: number; height: number } {
  const aspectRatio = origWidth / origHeight;

  switch (settings.mode) {
    case 'width':
      return {
        width: settings.width!,
        height: Math.round(settings.width! / aspectRatio),
      };
    case 'height':
      return {
        width: Math.round(settings.height! * aspectRatio),
        height: settings.height!,
      };
    case 'contain':
    case 'cover': {
      const scaleW = settings.width! / origWidth;
      const scaleH = settings.height! / origHeight;
      const scale = settings.mode === 'contain'
        ? Math.min(scaleW, scaleH)
        : Math.max(scaleW, scaleH);
      return {
        width: Math.round(origWidth * scale),
        height: Math.round(origHeight * scale),
      };
    }
    default:
      return { width: origWidth, height: origHeight };
  }
}

export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
  };
  return mimeTypes[format] || 'image/png';
}
