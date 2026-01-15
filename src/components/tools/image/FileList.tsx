'use client';

import { ImageFile } from '@/types/image';
import { formatBytes } from '@/lib/image/formatters';

interface FileListProps {
  files: ImageFile[];
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  translations: {
    pending: string;
    processing: string;
    complete: string;
    error: string;
    remove: string;
  };
}

export function FileList({ files, onRemove, onSelect, selectedId, translations }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  const getStatusColor = (status: ImageFile['status']) => {
    switch (status) {
      case 'pending':
        return 'text-hub-muted';
      case 'processing':
        return 'text-hub-warning';
      case 'complete':
        return 'text-hub-accent';
      case 'error':
        return 'text-hub-error';
    }
  };

  const getStatusIcon = (status: ImageFile['status']) => {
    switch (status) {
      case 'pending':
        return '⏱️';
      case 'processing':
        return '⚙️';
      case 'complete':
        return '✓';
      case 'error':
        return '✗';
    }
  };

  const getStatusText = (status: ImageFile['status']) => {
    switch (status) {
      case 'pending':
        return translations.pending;
      case 'processing':
        return translations.processing;
      case 'complete':
        return translations.complete;
      case 'error':
        return translations.error;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">
        {files.length} {files.length === 1 ? 'file' : 'files'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onSelect(file.id)}
            className={`
              relative group p-3 rounded-lg cursor-pointer
              transition-all duration-200
              ${selectedId === file.id
                ? 'bg-hub-accent/10 border-2 border-hub-accent glow-accent'
                : 'bg-hub-card border-2 border-hub-border hover:border-hub-accent/50'
              }
            `}
          >
            {/* Thumbnail */}
            <div className="aspect-video rounded-lg overflow-hidden bg-hub-darker mb-3">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <p className="text-sm text-white font-medium truncate" title={file.name}>
                {file.name}
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-hub-muted">
                  {file.width} × {file.height}
                </span>
                <span className="text-hub-muted">
                  {formatBytes(file.originalSize)}
                </span>
              </div>

              {/* Status Badge */}
              <div className={`
                flex items-center gap-1.5 text-xs font-medium
                ${getStatusColor(file.status)}
              `}>
                <span>{getStatusIcon(file.status)}</span>
                <span>{getStatusText(file.status)}</span>
              </div>

              {/* Savings (if complete) */}
              {file.status === 'complete' && file.result && (
                <div className="text-xs">
                  <span className="text-hub-accent font-semibold">
                    -{file.result.savings.toFixed(1)}%
                  </span>
                  <span className="text-hub-muted ml-1">
                    ({formatBytes(file.result.savingsBytes)} saved)
                  </span>
                </div>
              )}

              {/* Error Message */}
              {file.error && (
                <p className="text-xs text-hub-error mt-1">
                  {file.error}
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.id);
              }}
              className="
                absolute top-2 right-2
                w-6 h-6 rounded-full
                bg-hub-error/80 hover:bg-hub-error
                text-white text-xs
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                flex items-center justify-center
              "
              title={translations.remove}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
