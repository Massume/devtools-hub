'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBoxShadowGeneratorTranslations } from '@/lib/i18n-box-shadow-generator';
import toast from 'react-hot-toast';

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const defaultShadow: Omit<Shadow, 'id'> = {
  offsetX: 0,
  offsetY: 4,
  blur: 10,
  spread: 0,
  color: '#000000',
  opacity: 25,
  inset: false,
};

export function BoxShadowGenerator() {
  const { locale } = useI18n();
  const t = getBoxShadowGeneratorTranslations(locale);

  const [shadows, setShadows] = useState<Shadow[]>([
    { ...defaultShadow, id: 1 },
  ]);
  const [boxColor, setBoxColor] = useState('#3b82f6');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [nextId, setNextId] = useState(2);

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const generateCss = (): string => {
    const shadowStrings = shadows.map(s => {
      const color = hexToRgba(s.color, s.opacity);
      const inset = s.inset ? 'inset ' : '';
      return `${inset}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${color}`;
    });
    return shadowStrings.join(',\n    ');
  };

  const cssOutput = `box-shadow: ${generateCss()};`;

  const updateShadow = (id: number, field: keyof Omit<Shadow, 'id'>, value: number | string | boolean) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addShadow = () => {
    setShadows([...shadows, { ...defaultShadow, id: nextId }]);
    setNextId(nextId + 1);
  };

  const removeShadow = (id: number) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(s => s.id !== id));
    }
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'subtle':
        setShadows([{ id: nextId, offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false }]);
        break;
      case 'medium':
        setShadows([{ id: nextId, offsetX: 0, offsetY: 4, blur: 15, spread: -3, color: '#000000', opacity: 30, inset: false }]);
        break;
      case 'hard':
        setShadows([{ id: nextId, offsetX: 5, offsetY: 5, blur: 0, spread: 0, color: '#000000', opacity: 50, inset: false }]);
        break;
      case 'soft':
        setShadows([{ id: nextId, offsetX: 0, offsetY: 0, blur: 30, spread: 10, color: '#3b82f6', opacity: 40, inset: false }]);
        break;
      case 'layered':
        setShadows([
          { id: nextId, offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: '#000000', opacity: 5, inset: false },
          { id: nextId + 1, offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 10, inset: false },
          { id: nextId + 2, offsetX: 0, offsetY: 16, blur: 32, spread: -8, color: '#000000', opacity: 15, inset: false },
        ]);
        setNextId(nextId + 3);
        return;
      case 'neumorphism':
        setShadows([
          { id: nextId, offsetX: 10, offsetY: 10, blur: 20, spread: 0, color: '#000000', opacity: 25, inset: false },
          { id: nextId + 1, offsetX: -10, offsetY: -10, blur: 20, spread: 0, color: '#ffffff', opacity: 10, inset: false },
        ]);
        setBackgroundColor('#e0e0e0');
        setBoxColor('#e0e0e0');
        setNextId(nextId + 2);
        return;
    }
    setNextId(nextId + 1);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssOutput);
    toast.success(t.copied);
  };

  const handleReset = () => {
    setShadows([{ ...defaultShadow, id: nextId }]);
    setNextId(nextId + 1);
    setBoxColor('#3b82f6');
    setBackgroundColor('#1a1a2e');
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <label className="block text-sm font-medium text-hub-muted mb-4">{t.preview}</label>
        <div
          className="h-64 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor }}
        >
          <div
            className="w-32 h-32 rounded-lg transition-all"
            style={{
              backgroundColor: boxColor,
              boxShadow: generateCss(),
            }}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'subtle', label: t.presetSubtle },
            { key: 'medium', label: t.presetMedium },
            { key: 'hard', label: t.presetHard },
            { key: 'soft', label: t.presetSoft },
            { key: 'layered', label: t.presetLayered },
            { key: 'neumorphism', label: t.presetNeumorphism },
          ].map(preset => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset.key)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <label className="block text-sm text-hub-muted mb-2">{t.boxColor}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-12 h-10 rounded border border-hub-border cursor-pointer"
            />
            <input
              type="text"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-sm text-white"
            />
          </div>
        </div>
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <label className="block text-sm text-hub-muted mb-2">{t.backgroundColor}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-10 rounded border border-hub-border cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* Shadow Layers */}
      {shadows.map((shadow, index) => (
        <div key={shadow.id} className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{t.layer} {index + 1}</span>
            {shadows.length > 1 && (
              <button
                onClick={() => removeShadow(shadow.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                {t.removeShadow}
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Horizontal Offset */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted">{t.horizontalOffset}</label>
                <span className="text-xs text-hub-accent font-mono">{shadow.offsetX}{t.px}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={shadow.offsetX}
                onChange={(e) => updateShadow(shadow.id, 'offsetX', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>

            {/* Vertical Offset */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted">{t.verticalOffset}</label>
                <span className="text-xs text-hub-accent font-mono">{shadow.offsetY}{t.px}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={shadow.offsetY}
                onChange={(e) => updateShadow(shadow.id, 'offsetY', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted">{t.blurRadius}</label>
                <span className="text-xs text-hub-accent font-mono">{shadow.blur}{t.px}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={shadow.blur}
                onChange={(e) => updateShadow(shadow.id, 'blur', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>

            {/* Spread */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted">{t.spreadRadius}</label>
                <span className="text-xs text-hub-accent font-mono">{shadow.spread}{t.px}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={shadow.spread}
                onChange={(e) => updateShadow(shadow.id, 'spread', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          </div>

          {/* Color & Opacity */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-hub-muted mb-1">{t.shadowColor}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shadow.color}
                  onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                  className="w-10 h-8 rounded border border-hub-border cursor-pointer"
                />
                <input
                  type="text"
                  value={shadow.color}
                  onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                  className="flex-1 bg-hub-darker border border-hub-border rounded px-2 py-1 font-mono text-xs text-white"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted">{t.opacity}</label>
                <span className="text-xs text-hub-accent font-mono">{shadow.opacity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={shadow.opacity}
                onChange={(e) => updateShadow(shadow.id, 'opacity', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          </div>

          {/* Inset */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shadow.inset}
              onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.inset}</span>
          </label>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={addShadow}
          className="px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.addShadow}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-hub-card border border-hub-border text-white rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.reset}
        </button>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
          <button
            onClick={handleCopy}
            className="text-sm text-hub-accent hover:underline"
          >
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
          {cssOutput}
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
