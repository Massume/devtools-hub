'use client';

import { useState, useEffect } from 'react';
import { Gradient, OutputFormat, LinearGradient } from '@/types/gradient';
import { useI18n } from '@/lib/i18n-context';
import { getGradientTranslations, Locale } from '@/lib/i18n-gradient';
import { GradientPreview } from './gradient/GradientPreview';
import { GradientControls } from './gradient/GradientControls';
import { ColorStopList } from './gradient/ColorStopList';
import { CodeOutput } from './gradient/CodeOutput';
import { PresetGallery } from './gradient/PresetGallery';
import { nanoid } from 'nanoid';

// Default gradient
const createDefaultGradient = (): LinearGradient => ({
  type: 'linear',
  angle: 90,
  stops: [
    { id: nanoid(), color: '#667eea', position: 0 },
    { id: nanoid(), color: '#764ba2', position: 100 },
  ],
});

const STORAGE_KEY = 'devtools-hub-gradient-state';

export function CssGradientGenerator() {
  const { locale } = useI18n();
  const t = getGradientTranslations(locale as Locale);

  const [gradient, setGradient] = useState<Gradient>(createDefaultGradient());
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('css');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.gradient) {
          setGradient(parsed.gradient);
          setSelectedStopId(parsed.gradient.stops[0]?.id || null);
        }
        if (parsed.outputFormat) {
          setOutputFormat(parsed.outputFormat);
        }
      } else {
        // Set initial selected stop
        const defaultGrad = createDefaultGradient();
        setSelectedStopId(defaultGrad.stops[0].id);
      }
    } catch (error) {
      console.error('Failed to load gradient state:', error);
      const defaultGrad = createDefaultGradient();
      setSelectedStopId(defaultGrad.stops[0].id);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          gradient,
          outputFormat,
        })
      );
    } catch (error) {
      console.error('Failed to save gradient state:', error);
    }
  }, [gradient, outputFormat]);

  const handleGradientChange = (newGradient: Gradient) => {
    setGradient(newGradient);
  };

  const handleStopsUpdate = (newStops: typeof gradient.stops) => {
    setGradient({ ...gradient, stops: newStops });
  };

  const handleReset = () => {
    const defaultGrad = createDefaultGradient();
    setGradient(defaultGrad);
    setSelectedStopId(defaultGrad.stops[0].id);
    setOutputFormat('css');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleLoadPreset = (presetGradient: Gradient) => {
    setGradient(presetGradient);
    setSelectedStopId(presetGradient.stops[0]?.id || null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex px-4 py-1.5 bg-hub-accent/10 border border-hub-accent/20 rounded-full">
          <span className="text-hub-accent text-sm font-medium">CSS Generator</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">
          {t.pageTitle.split(' - ')[0]}
        </h1>

        <p className="text-lg text-hub-muted max-w-2xl mx-auto">{t.pageDescription}</p>
      </div>

      {/* Gradient Preview */}
      <GradientPreview gradient={gradient} label={t.preview} />

      {/* Controls and Color Stops */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gradient Controls */}
        <GradientControls
          gradient={gradient}
          onChange={handleGradientChange}
          translations={{
            linear: t.linear,
            radial: t.radial,
            conic: t.conic,
            angle: t.angle,
            shape: t.shape,
            position: t.position,
            circle: t.circle,
            ellipse: t.ellipse,
          }}
        />

        {/* Color Stops */}
        <ColorStopList
          stops={gradient.stops}
          selectedStopId={selectedStopId}
          onUpdate={handleStopsUpdate}
          onSelectStop={setSelectedStopId}
          translations={{
            colorStops: t.colorStops,
            addColorStop: t.addColorStop,
            removeColorStop: t.removeColorStop,
            minStopsWarning: t.minStopsWarning,
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          className="
            px-6 py-3 rounded-lg font-semibold
            bg-hub-dark text-white border-2 border-hub-border
            hover:bg-hub-darker hover:border-hub-accent/30
            transition-all duration-200
            flex items-center gap-2
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {t.resetGradient}
        </button>
      </div>

      {/* Preset Gallery */}
      <PresetGallery
        onLoadPreset={handleLoadPreset}
        translations={{
          presetGallery: t.presetGallery,
          allPresets: t.allPresets,
          popularPresets: t.popularPresets,
          warmPresets: t.warmPresets,
          coolPresets: t.coolPresets,
          darkPresets: t.darkPresets,
          pastelPresets: t.pastelPresets,
          presetLoaded: t.presetLoaded,
        }}
      />

      {/* Code Output */}
      <CodeOutput
        gradient={gradient}
        outputFormat={outputFormat}
        onFormatChange={setOutputFormat}
        translations={{
          code: t.code,
          formatCss: t.formatCss,
          formatScss: t.formatScss,
          formatTailwind: t.formatTailwind,
          formatCssVar: t.formatCssVar,
          copyCode: t.copyCode,
          downloadCode: t.downloadCode,
          copied: t.copied,
        }}
      />

      {/* Features Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">{t.featuresTitle}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: t.feature1, icon: '⚡' },
            { title: t.feature2, icon: '🎨' },
            { title: t.feature3, icon: '💾' },
            { title: t.feature4, icon: '🖼️' },
            { title: t.feature5, icon: '🎯' },
            { title: t.feature6, icon: '📐' },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-hub-card border border-hub-border rounded-lg hover:border-hub-accent/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <p className="text-hub-muted text-sm">{feature.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
