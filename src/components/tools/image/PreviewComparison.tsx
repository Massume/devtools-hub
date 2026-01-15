'use client';

import { useState, useRef } from 'react';
import { ImageFile, OptimizedResult } from '@/types/image';
import { formatBytes } from '@/lib/image/formatters';

interface PreviewComparisonProps {
  original: ImageFile;
  optimized: OptimizedResult;
  translations: {
    original: string;
    optimized: string;
    dimensions: string;
    size: string;
    savings: string;
  };
}

export function PreviewComparison({ original, optimized, translations }: PreviewComparisonProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const optimizedUrl = URL.createObjectURL(optimized.blob);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comparison Slider */}
      <div
        ref={containerRef}
        className="relative aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none bg-hub-darker border border-hub-border"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Original (background) */}
        <div className="absolute inset-0">
          <img
            src={original.preview}
            alt="Original"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Optimized (foreground with clip) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={optimizedUrl}
            alt="Optimized"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-hub-accent shadow-lg"
          style={{ left: `${position}%` }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-hub-accent rounded-full shadow-lg flex items-center justify-center cursor-ew-resize hover:scale-110 transition-transform"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <svg className="w-6 h-6 text-hub-dark" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-hub-dark/80 backdrop-blur-sm border border-hub-border rounded-lg text-xs font-medium text-white">
          {translations.original}
        </div>
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-hub-accent/20 backdrop-blur-sm border border-hub-accent rounded-lg text-xs font-medium text-hub-accent">
          {translations.optimized}
        </div>
      </div>

      {/* Stats Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Original Stats */}
        <div className="p-4 bg-hub-card border border-hub-border rounded-lg space-y-2">
          <h4 className="text-sm font-semibold text-hub-muted">{translations.original}</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-hub-muted">{translations.dimensions}:</span>
              <span className="text-white font-mono">
                {original.width} × {original.height}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-hub-muted">{translations.size}:</span>
              <span className="text-white font-mono">
                {formatBytes(original.originalSize)}
              </span>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="p-4 bg-hub-accent/10 border border-hub-accent rounded-lg space-y-2">
          <h4 className="text-sm font-semibold text-hub-accent">{translations.savings}</h4>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-hub-accent">
              -{optimized.savings.toFixed(1)}%
            </div>
            <div className="text-sm text-hub-accent/80">
              {formatBytes(optimized.savingsBytes)} saved
            </div>
          </div>
        </div>

        {/* Optimized Stats */}
        <div className="p-4 bg-hub-card border border-hub-border rounded-lg space-y-2">
          <h4 className="text-sm font-semibold text-hub-muted">{translations.optimized}</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-hub-muted">{translations.dimensions}:</span>
              <span className="text-white font-mono">
                {optimized.width} × {optimized.height}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-hub-muted">{translations.size}:</span>
              <span className="text-hub-accent font-mono">
                {formatBytes(optimized.size)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
