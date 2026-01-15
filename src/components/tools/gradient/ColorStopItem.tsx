'use client';

import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ColorStop } from '@/types/gradient';

interface ColorStopItemProps {
  stop: ColorStop;
  isSelected: boolean;
  canDelete: boolean;
  onUpdate: (stop: ColorStop) => void;
  onDelete: () => void;
  onSelect: () => void;
  translations: {
    removeColorStop: string;
  };
}

export function ColorStopItem({
  stop,
  isSelected,
  canDelete,
  onUpdate,
  onDelete,
  onSelect,
  translations,
}: ColorStopItemProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleColorChange = (color: string) => {
    onUpdate({ ...stop, color });
  };

  const handlePositionChange = (position: number) => {
    onUpdate({ ...stop, position });
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      handleColorChange(value);
    }
  };

  return (
    <div
      className={`
        p-4 bg-hub-dark rounded-lg border-2 transition-all duration-200
        ${
          isSelected
            ? 'border-hub-accent shadow-lg shadow-hub-accent/20'
            : 'border-hub-border hover:border-hub-accent/30'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {/* Color Swatch */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
            className="w-12 h-12 rounded-lg border-2 border-hub-border hover:border-hub-accent transition-colors cursor-pointer shadow-md"
            style={{ backgroundColor: stop.color }}
            aria-label="Select color"
          />

          {/* Color Picker Popover */}
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute z-50 top-14 left-0 p-3 bg-hub-card border-2 border-hub-accent rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <HexColorPicker color={stop.color} onChange={handleColorChange} />
            </div>
          )}
        </div>

        {/* Color Input */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={stop.color}
            onChange={handleColorInputChange}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 bg-hub-card border border-hub-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-hub-accent"
            placeholder="#000000"
          />

          {/* Position Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) => {
                e.stopPropagation();
                handlePositionChange(Number(e.target.value));
              }}
              className="flex-1 h-2 bg-hub-card rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <span className="text-hub-accent font-mono text-sm w-12 text-right">
              {stop.position}%
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={!canDelete}
          className={`
            p-2 rounded-lg transition-colors
            ${
              canDelete
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-hub-muted cursor-not-allowed opacity-30'
            }
          `}
          aria-label={translations.removeColorStop}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
