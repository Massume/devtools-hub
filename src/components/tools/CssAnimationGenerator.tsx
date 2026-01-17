'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssAnimationGeneratorTranslations } from '@/lib/i18n-css-animation-generator';
import toast from 'react-hot-toast';

interface Keyframe {
  id: number;
  percentage: number;
  transform: string;
  opacity: number;
  backgroundColor: string;
}

interface AnimationSettings {
  name: string;
  duration: number;
  timingFunction: string;
  delay: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
}

const DEFAULT_KEYFRAMES: Keyframe[] = [
  { id: 1, percentage: 0, transform: '', opacity: 1, backgroundColor: '#3b82f6' },
  { id: 2, percentage: 100, transform: '', opacity: 1, backgroundColor: '#3b82f6' },
];

const DEFAULT_SETTINGS: AnimationSettings = {
  name: 'myAnimation',
  duration: 1,
  timingFunction: 'ease',
  delay: 0,
  iterationCount: 'infinite',
  direction: 'normal',
  fillMode: 'none',
};

const PRESETS: Record<string, { settings: Partial<AnimationSettings>; keyframes: Keyframe[] }> = {
  bounce: {
    settings: { duration: 0.6, timingFunction: 'ease' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'translateY(0)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 50, transform: 'translateY(-30px)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 3, percentage: 100, transform: 'translateY(0)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  fadeIn: {
    settings: { duration: 1, timingFunction: 'ease-in', iterationCount: '1', fillMode: 'forwards' },
    keyframes: [
      { id: 1, percentage: 0, transform: '', opacity: 0, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 100, transform: '', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  slideIn: {
    settings: { duration: 0.5, timingFunction: 'ease-out', iterationCount: '1', fillMode: 'forwards' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'translateX(-100px)', opacity: 0, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 100, transform: 'translateX(0)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  pulse: {
    settings: { duration: 1, timingFunction: 'ease-in-out' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'scale(1)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 50, transform: 'scale(1.1)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 3, percentage: 100, transform: 'scale(1)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  shake: {
    settings: { duration: 0.5, timingFunction: 'ease-in-out' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'translateX(0)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 25, transform: 'translateX(-10px)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 3, percentage: 50, transform: 'translateX(10px)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 4, percentage: 75, transform: 'translateX(-10px)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 5, percentage: 100, transform: 'translateX(0)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  rotate: {
    settings: { duration: 2, timingFunction: 'linear' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'rotate(0deg)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 100, transform: 'rotate(360deg)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  zoom: {
    settings: { duration: 0.3, timingFunction: 'ease', iterationCount: '1', fillMode: 'forwards' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'scale(0)', opacity: 0, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 100, transform: 'scale(1)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
  flip: {
    settings: { duration: 0.6, timingFunction: 'ease-in-out' },
    keyframes: [
      { id: 1, percentage: 0, transform: 'rotateY(0deg)', opacity: 1, backgroundColor: '#3b82f6' },
      { id: 2, percentage: 50, transform: 'rotateY(90deg)', opacity: 0.5, backgroundColor: '#8b5cf6' },
      { id: 3, percentage: 100, transform: 'rotateY(0deg)', opacity: 1, backgroundColor: '#3b82f6' },
    ],
  },
};

export function CssAnimationGenerator() {
  const { locale } = useI18n();
  const t = getCssAnimationGeneratorTranslations(locale);

  const [settings, setSettings] = useState<AnimationSettings>(DEFAULT_SETTINGS);
  const [keyframes, setKeyframes] = useState<Keyframe[]>(DEFAULT_KEYFRAMES);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const updateSetting = (key: keyof AnimationSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateKeyframe = (id: number, key: keyof Keyframe, value: number | string) => {
    setKeyframes(prev => prev.map(kf =>
      kf.id === id ? { ...kf, [key]: value } : kf
    ).sort((a, b) => a.percentage - b.percentage));
  };

  const addKeyframe = () => {
    const newId = Math.max(...keyframes.map(k => k.id), 0) + 1;
    const lastKeyframe = keyframes[keyframes.length - 1];
    setKeyframes([...keyframes, {
      id: newId,
      percentage: 50,
      transform: lastKeyframe?.transform || '',
      opacity: 1,
      backgroundColor: lastKeyframe?.backgroundColor || '#3b82f6',
    }].sort((a, b) => a.percentage - b.percentage));
  };

  const removeKeyframe = (id: number) => {
    if (keyframes.length > 2) {
      setKeyframes(keyframes.filter(kf => kf.id !== id));
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setSettings({ ...DEFAULT_SETTINGS, ...preset.settings });
      setKeyframes(preset.keyframes);
      setAnimationKey(prev => prev + 1);
    }
  };

  const resetAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cssCode = useMemo(() => {
    const keyframeCSS = keyframes.map(kf => {
      const props: string[] = [];
      if (kf.transform) props.push(`transform: ${kf.transform};`);
      if (kf.opacity !== 1) props.push(`opacity: ${kf.opacity};`);
      if (kf.backgroundColor) props.push(`background-color: ${kf.backgroundColor};`);
      return `  ${kf.percentage}% {\n    ${props.join('\n    ')}\n  }`;
    }).join('\n');

    const animationProps = [
      `${settings.name}`,
      `${settings.duration}s`,
      settings.timingFunction,
      `${settings.delay}s`,
      settings.iterationCount,
      settings.direction,
      settings.fillMode,
    ].join(' ');

    return `@keyframes ${settings.name} {\n${keyframeCSS}\n}\n\n.element {\n  animation: ${animationProps};\n}`;
  }, [settings, keyframes]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    toast.success(t.copied);
  };

  const animationStyle = useMemo(() => {
    const keyframeCSS = keyframes.map(kf => {
      const props: string[] = [];
      if (kf.transform) props.push(`transform: ${kf.transform}`);
      if (kf.opacity !== 1) props.push(`opacity: ${kf.opacity}`);
      if (kf.backgroundColor) props.push(`background-color: ${kf.backgroundColor}`);
      return `${kf.percentage}% { ${props.join('; ')} }`;
    }).join(' ');

    return {
      animation: isPlaying
        ? `${settings.name} ${settings.duration}s ${settings.timingFunction} ${settings.delay}s ${settings.iterationCount} ${settings.direction} ${settings.fillMode}`
        : 'none',
      '--keyframes': keyframeCSS,
    } as React.CSSProperties;
  }, [settings, keyframes, isPlaying]);

  const injectKeyframes = () => {
    const keyframeCSS = keyframes.map(kf => {
      const props: string[] = [];
      if (kf.transform) props.push(`transform: ${kf.transform}`);
      if (kf.opacity !== 1) props.push(`opacity: ${kf.opacity}`);
      if (kf.backgroundColor) props.push(`background-color: ${kf.backgroundColor}`);
      return `${kf.percentage}% { ${props.join('; ')} }`;
    }).join(' ');

    return `@keyframes ${settings.name} { ${keyframeCSS} }`;
  };

  return (
    <div className="space-y-6">
      <style>{injectKeyframes()}</style>

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

      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.previewLabel}</h3>
          <div className="flex gap-2">
            <button
              onClick={togglePlay}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
            >
              {isPlaying ? t.pauseButton : t.playButton}
            </button>
            <button
              onClick={resetAnimation}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
            >
              {t.resetButton}
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center bg-hub-darker rounded-lg h-64">
          <div
            key={animationKey}
            className="w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold"
            style={{
              ...animationStyle,
              backgroundColor: keyframes[0]?.backgroundColor || '#3b82f6',
            }}
          >
            DIV
          </div>
        </div>
      </div>

      {/* Animation Settings */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.animationSettings}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.animationName}</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSetting('name', e.target.value.replace(/\s/g, ''))}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.duration} (s)</label>
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={settings.duration}
              onChange={(e) => updateSetting('duration', parseFloat(e.target.value) || 0.1)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.delay} (s)</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={settings.delay}
              onChange={(e) => updateSetting('delay', parseFloat(e.target.value) || 0)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.iterationCount}</label>
            <select
              value={settings.iterationCount}
              onChange={(e) => updateSetting('iterationCount', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            >
              <option value="infinite">{t.infinite}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.timingFunction}</label>
            <select
              value={settings.timingFunction}
              onChange={(e) => updateSetting('timingFunction', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            >
              {['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'].map(tf => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.direction}</label>
            <select
              value={settings.direction}
              onChange={(e) => updateSetting('direction', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            >
              {['normal', 'reverse', 'alternate', 'alternate-reverse'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.fillMode}</label>
            <select
              value={settings.fillMode}
              onChange={(e) => updateSetting('fillMode', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            >
              {['none', 'forwards', 'backwards', 'both'].map(fm => (
                <option key={fm} value={fm}>{fm}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.keyframesLabel}</h3>
          <button
            onClick={addKeyframe}
            className="text-sm px-3 py-1 bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors"
          >
            {t.addKeyframe}
          </button>
        </div>

        <div className="space-y-3">
          {keyframes.map((kf) => (
            <div key={kf.id} className="bg-hub-darker rounded-lg p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-hub-muted">{t.percentage} (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kf.percentage}
                    onChange={(e) => updateKeyframe(kf.id, 'percentage', parseInt(e.target.value) || 0)}
                    className="w-full bg-hub-dark border border-hub-border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hub-muted">{t.transform}</label>
                  <input
                    type="text"
                    value={kf.transform}
                    onChange={(e) => updateKeyframe(kf.id, 'transform', e.target.value)}
                    placeholder="translateX(0)"
                    className="w-full bg-hub-dark border border-hub-border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hub-muted">{t.opacity}</label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={kf.opacity}
                    onChange={(e) => updateKeyframe(kf.id, 'opacity', parseFloat(e.target.value) || 0)}
                    className="w-full bg-hub-dark border border-hub-border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hub-muted">{t.backgroundColor}</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={kf.backgroundColor}
                      onChange={(e) => updateKeyframe(kf.id, 'backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-hub-border"
                    />
                    <input
                      type="text"
                      value={kf.backgroundColor}
                      onChange={(e) => updateKeyframe(kf.id, 'backgroundColor', e.target.value)}
                      className="flex-1 bg-hub-dark border border-hub-border rounded px-2 py-1 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeKeyframe(kf.id)}
                    disabled={keyframes.length <= 2}
                    className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.removeKeyframe}
                  </button>
                </div>
              </div>
            </div>
          ))}
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
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-64 overflow-auto">
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
