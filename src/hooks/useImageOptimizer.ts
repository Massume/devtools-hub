import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import type { ImageFile, OptimizationSettings, OptimizedResult, SrcsetVariant } from '@/types/image';
import { loadImage, calculateResize, getMimeType } from '@/lib/image/imageUtils';

export function useImageOptimizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentFile: '' });

  const optimizeImage = useCallback(
    async (
      file: ImageFile,
      settings: OptimizationSettings
    ): Promise<OptimizedResult> => {
      const img = await loadImage(file.preview);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      let targetWidth = img.width;
      let targetHeight = img.height;

      if (settings.resize) {
        const resized = calculateResize(img.width, img.height, settings.resize);
        targetWidth = resized.width;
        targetHeight = resized.height;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const format = settings.format === 'original'
        ? file.type.split('/')[1] || 'jpeg'
        : settings.format;

      const mimeType = getMimeType(format);
      const quality = settings.quality / 100;

      let blob: Blob;

      if (format === 'avif') {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b || new Blob()),
            mimeType,
            quality
          );
        });
      } else {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b || new Blob()),
            mimeType,
            quality
          );
        });

        if (blob.size > 0) {
          try {
            const compressedFile = await imageCompression(
              new File([blob], file.name, { type: mimeType }),
              {
                maxSizeMB: 10,
                maxWidthOrHeight: Math.max(targetWidth, targetHeight),
                useWebWorker: true,
                initialQuality: quality,
                fileType: mimeType,
              }
            );
            blob = compressedFile;
          } catch {
            // Use canvas blob if compression fails
          }
        }
      }

      const savings = ((file.originalSize - blob.size) / file.originalSize) * 100;

      let srcsetVariants: SrcsetVariant[] | undefined;

      if (settings.generateSrcset) {
        srcsetVariants = await generateSrcsetVariants(
          file,
          settings,
          img
        );
      }

      return {
        blob,
        size: blob.size,
        width: targetWidth,
        height: targetHeight,
        format,
        savings: Math.max(0, savings),
        savingsBytes: Math.max(0, file.originalSize - blob.size),
        srcsetVariants,
      };
    },
    []
  );

  const generateSrcsetVariants = async (
    file: ImageFile,
    settings: OptimizationSettings,
    img: HTMLImageElement
  ): Promise<SrcsetVariant[]> => {
    const variants: SrcsetVariant[] = [];
    const sizes = settings.srcsetSizes.filter((size) => size <= file.width);

    const format = settings.format === 'original'
      ? file.type.split('/')[1] || 'jpeg'
      : settings.format;
    const mimeType = getMimeType(format);
    const quality = settings.quality / 100;

    for (const width of sizes) {
      const aspectRatio = img.width / img.height;
      const height = Math.round(width / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b || new Blob()),
          mimeType,
          quality
        );
      });

      variants.push({
        width,
        blob,
        size: blob.size,
      });
    }

    return variants;
  };

  const optimizeBatch = useCallback(
    async (
      files: ImageFile[],
      settings: OptimizationSettings,
      onProgress?: (file: ImageFile, result: OptimizedResult) => void
    ): Promise<Map<string, OptimizedResult>> => {
      setIsProcessing(true);
      setProgress({ current: 0, total: files.length, currentFile: '' });

      const results = new Map<string, OptimizedResult>();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i, total: files.length, currentFile: file.name });

        try {
          const result = await optimizeImage(file, settings);
          results.set(file.id, result);
          onProgress?.(file, result);
        } catch (error) {
          console.error(`Failed to optimize ${file.name}:`, error);
        }

        setProgress({ current: i + 1, total: files.length, currentFile: '' });
      }

      setIsProcessing(false);
      return results;
    },
    [optimizeImage]
  );

  return {
    optimizeImage,
    optimizeBatch,
    isProcessing,
    progress,
  };
}
