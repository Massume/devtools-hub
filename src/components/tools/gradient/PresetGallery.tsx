'use client';

import { useState } from 'react';
import { Gradient } from '@/types/gradient';
import { gradientPresets, categories } from '@/data/gradient-presets';
import { getGradientValue } from '@/lib/gradient/gradientToCSS';

interface PresetGalleryProps {
  onLoadPreset: (gradient: Gradient) => void;
  translations: {
    presetGallery: string;
    allPresets: string;
    popularPresets: string;
    warmPresets: string;
    coolPresets: string;
    darkPresets: string;
    pastelPresets: string;
    presetLoaded: string;
  };
}

export function PresetGallery({ onLoadPreset, translations }: PresetGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showToast, setShowToast] = useState(false);

  const filteredPresets =
    selectedCategory === 'all'
      ? gradientPresets
      : gradientPresets.filter((preset) => preset.category === selectedCategory);

  const handleLoadPreset = (gradient: Gradient) => {
    onLoadPreset(gradient);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const categoryTranslations: Record<string, string> = {
    all: translations.allPresets,
    popular: translations.popularPresets,
    warm: translations.warmPresets,
    cool: translations.coolPresets,
    dark: translations.darkPresets,
    pastel: translations.pastelPresets,
  };

  return (
    <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-white">{translations.presetGallery}</h3>
        <span className="text-sm text-hub-muted">
          {filteredPresets.length} {filteredPresets.length === 1 ? 'preset' : 'presets'}
        </span>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${
                selectedCategory === category.id
                  ? 'bg-hub-accent text-hub-dark'
                  : 'bg-hub-dark text-hub-muted hover:text-white hover:bg-hub-darker border border-hub-border'
              }
            `}
          >
            {categoryTranslations[category.id] || category.name}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleLoadPreset(preset.gradient)}
            className="group relative overflow-hidden rounded-lg border-2 border-hub-border hover:border-hub-accent transition-all duration-200 hover:shadow-lg hover:shadow-hub-accent/20"
          >
            {/* Gradient Preview */}
            <div
              className="aspect-[4/3] w-full"
              style={{ background: getGradientValue(preset.gradient) }}
            />

            {/* Name Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
              <span className="text-white font-medium text-sm">{preset.name}</span>
            </div>

            {/* Load Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="p-1.5 bg-hub-accent rounded-full">
                <svg className="w-4 h-4 text-hub-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPresets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-hub-muted">No presets found in this category</p>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="px-6 py-3 bg-hub-accent text-hub-dark rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{translations.presetLoaded}</span>
          </div>
        </div>
      )}
    </div>
  );
}
