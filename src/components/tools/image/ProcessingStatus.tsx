'use client';

import { ProcessingProgress } from '@/types/image';

interface ProcessingStatusProps {
  progress: ProcessingProgress;
  translations: {
    processing: string;
    of: string;
  };
}

export function ProcessingStatus({ progress, translations }: ProcessingStatusProps) {
  if (progress.total === 0) {
    return null;
  }

  const percentage = (progress.current / progress.total) * 100;

  return (
    <div className="p-6 bg-hub-card border border-hub-accent rounded-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-hub-accent/20 flex items-center justify-center animate-pulse">
            <svg
              className="w-6 h-6 text-hub-accent animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {translations.processing}
            </h3>
            <p className="text-sm text-hub-muted">
              {progress.current} {translations.of} {progress.total}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-hub-accent font-mono">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-hub-darker rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-hub-accent to-hub-accent-dim rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Current File */}
      {progress.currentFile && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-hub-muted">Processing:</span>
          <span className="text-white font-medium truncate" title={progress.currentFile}>
            {progress.currentFile}
          </span>
        </div>
      )}
    </div>
  );
}
