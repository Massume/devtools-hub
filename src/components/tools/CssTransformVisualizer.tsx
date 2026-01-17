'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssTransformVisualizerTranslations } from '@/lib/i18n-css-transform-visualizer';
import toast from 'react-hot-toast';

interface TransformValues {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  originX: number;
  originY: number;
}

const DEFAULT_VALUES: TransformValues = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  perspective: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  originX: 50,
  originY: 50,
};

const PRESETS: Record<string, Partial<TransformValues>> = {
  none: { ...DEFAULT_VALUES },
  flip: { scaleX: -1 },
  rotate45: { rotate: 45 },
  scale150: { scaleX: 1.5, scaleY: 1.5 },
  skew: { skewX: 15, skewY: 5 },
  '3dFlip': { perspective: 800, rotateY: 180 },
  perspective: { perspective: 500, rotateX: 25, rotateY: -15 },
};

export function CssTransformVisualizer() {
  const { locale } = useI18n();
  const t = getCssTransformVisualizerTranslations(locale);

  const [values, setValues] = useState<TransformValues>(DEFAULT_VALUES);
  const [is3D, setIs3D] = useState(false);

  const updateValue = (key: keyof TransformValues, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const { transformString, originString } = useMemo(() => {
    const transforms: string[] = [];

    if (values.perspective > 0) {
      transforms.push(`perspective(${values.perspective}px)`);
    }

    if (values.translateX !== 0 || values.translateY !== 0) {
      transforms.push(`translate(${values.translateX}px, ${values.translateY}px)`);
    }

    if (is3D) {
      if (values.rotateX !== 0) transforms.push(`rotateX(${values.rotateX}deg)`);
      if (values.rotateY !== 0) transforms.push(`rotateY(${values.rotateY}deg)`);
      if (values.rotateZ !== 0) transforms.push(`rotateZ(${values.rotateZ}deg)`);
    } else {
      if (values.rotate !== 0) transforms.push(`rotate(${values.rotate}deg)`);
    }

    if (values.scaleX !== 1 || values.scaleY !== 1) {
      transforms.push(`scale(${values.scaleX}, ${values.scaleY})`);
    }

    if (values.skewX !== 0 || values.skewY !== 0) {
      transforms.push(`skew(${values.skewX}deg, ${values.skewY}deg)`);
    }

    const origin = `${values.originX}% ${values.originY}%`;

    return {
      transformString: transforms.length > 0 ? transforms.join(' ') : 'none',
      originString: origin,
    };
  }, [values, is3D]);

  const cssCode = `transform: ${transformString};\ntransform-origin: ${originString};`;

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
      if (presetKey === '3dFlip' || presetKey === 'perspective') {
        setIs3D(true);
      }
    }
  };

  const sliders2D: { key: keyof TransformValues; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: 'translateX', label: t.translateX, min: -200, max: 200, step: 1, unit: 'px' },
    { key: 'translateY', label: t.translateY, min: -200, max: 200, step: 1, unit: 'px' },
    { key: 'rotate', label: t.rotate, min: -360, max: 360, step: 1, unit: 'deg' },
    { key: 'scaleX', label: t.scaleX, min: -2, max: 3, step: 0.1, unit: '' },
    { key: 'scaleY', label: t.scaleY, min: -2, max: 3, step: 0.1, unit: '' },
    { key: 'skewX', label: t.skewX, min: -45, max: 45, step: 1, unit: 'deg' },
    { key: 'skewY', label: t.skewY, min: -45, max: 45, step: 1, unit: 'deg' },
  ];

  const sliders3D: { key: keyof TransformValues; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: 'translateX', label: t.translateX, min: -200, max: 200, step: 1, unit: 'px' },
    { key: 'translateY', label: t.translateY, min: -200, max: 200, step: 1, unit: 'px' },
    { key: 'perspective', label: t.perspective, min: 0, max: 2000, step: 50, unit: 'px' },
    { key: 'rotateX', label: t.rotateX, min: -180, max: 180, step: 1, unit: 'deg' },
    { key: 'rotateY', label: t.rotateY, min: -180, max: 180, step: 1, unit: 'deg' },
    { key: 'rotateZ', label: t.rotateZ, min: -180, max: 180, step: 1, unit: 'deg' },
    { key: 'scaleX', label: t.scaleX, min: -2, max: 3, step: 0.1, unit: '' },
    { key: 'scaleY', label: t.scaleY, min: -2, max: 3, step: 0.1, unit: '' },
  ];

  const activeSliders = is3D ? sliders3D : sliders2D;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setIs3D(false)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            !is3D
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-darker border border-hub-border hover:border-hub-accent/50'
          }`}
        >
          {t.mode2d}
        </button>
        <button
          onClick={() => setIs3D(true)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            is3D
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-darker border border-hub-border hover:border-hub-accent/50'
          }`}
        >
          {t.mode3d}
        </button>
      </div>

      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.previewLabel}</h3>
        <div
          className="relative flex justify-center items-center bg-hub-darker rounded-lg overflow-hidden"
          style={{ height: '300px', perspective: is3D && values.perspective > 0 ? `${values.perspective}px` : 'none' }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* Origin indicator */}
          <div
            className="absolute w-3 h-3 bg-hub-accent rounded-full"
            style={{
              left: `calc(50% + ${values.translateX}px)`,
              top: `calc(50% + ${values.translateY}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Transform element */}
          <div
            className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              transform: transformString,
              transformOrigin: originString,
              transformStyle: is3D ? 'preserve-3d' : 'flat',
            }}
          >
            <span className="text-white font-bold text-xl">DIV</span>
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

      {/* Transforms */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.transformsLabel}</h3>
          <button
            onClick={handleReset}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.resetButton}
          </button>
        </div>

        <div className="grid gap-4">
          {activeSliders.map(slider => (
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
                step={slider.step}
                value={values[slider.key]}
                onChange={(e) => updateValue(slider.key, parseFloat(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transform Origin */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.transformOrigin}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-hub-muted">{t.originX}</label>
              <span className="text-white font-mono">{values.originX}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values.originX}
              onChange={(e) => updateValue('originX', parseFloat(e.target.value))}
              className="w-full accent-hub-accent"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-hub-muted">{t.originY}</label>
              <span className="text-white font-mono">{values.originY}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values.originY}
              onChange={(e) => updateValue('originY', parseFloat(e.target.value))}
              className="w-full accent-hub-accent"
            />
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
          <code className="text-sm text-green-400 font-mono whitespace-pre">{cssCode}</code>
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
