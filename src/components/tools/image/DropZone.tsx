'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { ImageFile } from '@/types/image';
import { getImageDimensions } from '@/lib/image/imageUtils';

interface DropZoneProps {
  onFilesAdded: (files: ImageFile[]) => void;
  translations: {
    dropZone: string;
    dropActive: string;
    formats: string;
    or: string;
    browse: string;
  };
}

export function DropZone({ onFilesAdded, translations }: DropZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const imageFiles: ImageFile[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(preview);

        return {
          id: nanoid(),
          file,
          name: file.name,
          originalSize: file.size,
          width: dimensions.width,
          height: dimensions.height,
          type: file.type,
          preview,
          status: 'pending' as const,
        };
      })
    );

    onFilesAdded(imageFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive
          ? 'border-hub-accent bg-hub-accent/5 glow-accent'
          : 'border-hub-border hover:border-hub-accent/50 bg-hub-card'
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="space-y-4">
        {/* Upload Icon */}
        <div className="flex justify-center">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-200
            ${isDragActive
              ? 'bg-hub-accent/20 text-hub-accent'
              : 'bg-hub-border text-hub-muted'
            }
          `}>
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        {isDragActive ? (
          <div>
            <p className="text-hub-accent font-semibold text-lg">
              {translations.dropActive}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-white font-semibold text-lg">
              {translations.dropZone}
            </p>
            <p className="text-hub-muted text-sm">
              {translations.or}{' '}
              <span className="text-hub-accent hover:underline">
                {translations.browse}
              </span>
            </p>
            <p className="text-hub-muted text-xs pt-2">
              {translations.formats}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
