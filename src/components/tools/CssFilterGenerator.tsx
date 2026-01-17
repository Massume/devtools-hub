'use client';

import { useState, useMemo, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssFilterGeneratorTranslations } from '@/lib/i18n-css-filter-generator';
import toast from 'react-hot-toast';

interface FilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadowX: number;
  dropShadowY: number;
  dropShadowBlur: number;
  dropShadowColor: string;
}

const DEFAULT_VALUES: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
  dropShadowX: 0,
  dropShadowY: 0,
  dropShadowBlur: 0,
  dropShadowColor: '#000000',
};

const PRESETS: Record<string, Partial<FilterValues>> = {
  none: { ...DEFAULT_VALUES },
  vintage: { sepia: 50, contrast: 90, brightness: 110, saturate: 85 },
  dramatic: { contrast: 150, brightness: 90, saturate: 130 },
  frosted: { blur: 5, brightness: 110, saturate: 80 },
  noir: { grayscale: 100, contrast: 120, brightness: 90 },
  warm: { sepia: 20, brightness: 105, saturate: 110, hueRotate: -10 },
  cool: { brightness: 100, saturate: 90, hueRotate: 180 },
  faded: { contrast: 80, brightness: 110, saturate: 70, sepia: 10 },
};

export function CssFilterGenerator() {
  const { locale } = useI18n();
  const t = getCssFilterGeneratorTranslations(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FilterValues>(DEFAULT_VALUES);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const updateValue = (key: keyof FilterValues, value: number | string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const filterString = useMemo(() => {
    const filters: string[] = [];

    if (values.blur !== 0) filters.push(`blur(${values.blur}px)`);
    if (values.brightness !== 100) filters.push(`brightness(${values.brightness}%)`);
    if (values.contrast !== 100) filters.push(`contrast(${values.contrast}%)`);
    if (values.grayscale !== 0) filters.push(`grayscale(${values.grayscale}%)`);
    if (values.hueRotate !== 0) filters.push(`hue-rotate(${values.hueRotate}deg)`);
    if (values.invert !== 0) filters.push(`invert(${values.invert}%)`);
    if (values.opacity !== 100) filters.push(`opacity(${values.opacity}%)`);
    if (values.saturate !== 100) filters.push(`saturate(${values.saturate}%)`);
    if (values.sepia !== 0) filters.push(`sepia(${values.sepia}%)`);
    if (values.dropShadowX !== 0 || values.dropShadowY !== 0 || values.dropShadowBlur !== 0) {
      filters.push(`drop-shadow(${values.dropShadowX}px ${values.dropShadowY}px ${values.dropShadowBlur}px ${values.dropShadowColor})`);
    }

    return filters.length > 0 ? filters.join(' ') : 'none';
  }, [values]);

  const cssCode = `filter: ${filterString};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    toast.success(t.copied);
  };

  const handleReset = () => {
    setValues(DEFAULT_VALUES);
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setValues({ ...DEFAULT_VALUES, ...preset });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sliders: { key: keyof FilterValues; label: string; min: number; max: number; unit: string }[] = [
    { key: 'blur', label: t.blur, min: 0, max: 20, unit: 'px' },
    { key: 'brightness', label: t.brightness, min: 0, max: 200, unit: '%' },
    { key: 'contrast', label: t.contrast, min: 0, max: 200, unit: '%' },
    { key: 'grayscale', label: t.grayscale, min: 0, max: 100, unit: '%' },
    { key: 'hueRotate', label: t.hueRotate, min: -180, max: 180, unit: 'deg' },
    { key: 'invert', label: t.invert, min: 0, max: 100, unit: '%' },
    { key: 'opacity', label: t.opacity, min: 0, max: 100, unit: '%' },
    { key: 'saturate', label: t.saturate, min: 0, max: 200, unit: '%' },
    { key: 'sepia', label: t.sepia, min: 0, max: 100, unit: '%' },
  ];

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.previewLabel}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1 bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
            >
              {t.uploadImage}
            </button>
            {customImage && (
              <button
                onClick={() => setCustomImage(null)}
                className="text-xs px-3 py-1 bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
              >
                {t.useDefaultImage}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-center bg-hub-darker rounded-lg p-8">
          <div
            className="w-64 h-48 rounded-lg overflow-hidden"
            style={{ filter: filterString }}
          >
            {customImage ? (
              <img
                src={customImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">ABC</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.presets}</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map(presetKey => (
            <button
              key={presetKey}
              onClick={() => applyPreset(presetKey)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {t[`preset${presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}` as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.filtersLabel}</h3>
          <button
            onClick={handleReset}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.resetButton}
          </button>
        </div>

        <div className="grid gap-4">
          {sliders.map(slider => (
            <div key={slider.key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="text-hub-muted">{slider.label}</label>
                <span className="text-white font-mono">
                  {values[slider.key]}{slider.unit}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={values[slider.key] as number}
                onChange={(e) => updateValue(slider.key, parseFloat(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          ))}

          {/* Drop Shadow */}
          <div className="border-t border-hub-border pt-4 mt-2">
            <h4 className="text-sm font-medium text-hub-muted mb-3">{t.dropShadow}</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-hub-muted">{t.dropShadowX}</label>
                  <span className="text-white font-mono">{values.dropShadowX}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={values.dropShadowX}
                  onChange={(e) => updateValue('dropShadowX', parseFloat(e.target.value))}
                  className="w-full accent-hub-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-hub-muted">{t.dropShadowY}</label>
                  <span className="text-white font-mono">{values.dropShadowY}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={values.dropShadowY}
                  onChange={(e) => updateValue('dropShadowY', parseFloat(e.target.value))}
                  className="w-full accent-hub-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-hub-muted">{t.dropShadowBlur}</label>
                  <span className="text-white font-mono">{values.dropShadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={values.dropShadowBlur}
                  onChange={(e) => updateValue('dropShadowBlur', parseFloat(e.target.value))}
                  className="w-full accent-hub-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-hub-muted">{t.dropShadowColor}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={values.dropShadowColor}
                    onChange={(e) => updateValue('dropShadowColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-hub-border"
                  />
                  <input
                    type="text"
                    value={values.dropShadowColor}
                    onChange={(e) => updateValue('dropShadowColor', e.target.value)}
                    className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.cssOutput}</label>
          <button
            onClick={handleCopy}
            className="text-sm text-hub-accent hover:underline"
          >
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
          <code className="text-sm text-green-400 font-mono break-all">{cssCode}</code>
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.featuresTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-hub-muted">
              <span className="text-hub-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{t.aboutTitle}</h3>
        <p className="text-hub-muted">{t.aboutText}</p>
      </div>
    </div>
  );
}
