'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getTextShadowGeneratorTranslations } from '@/lib/i18n-text-shadow-generator';
import toast from 'react-hot-toast';

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

const defaultShadow: Omit<Shadow, 'id'> = {
  offsetX: 2,
  offsetY: 2,
  blur: 4,
  color: '#000000',
  opacity: 50,
};

export function TextShadowGenerator() {
  const { locale } = useI18n();
  const t = getTextShadowGeneratorTranslations(locale);

  const [shadows, setShadows] = useState<Shadow[]>([
    { ...defaultShadow, id: 1 },
  ]);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [sampleText, setSampleText] = useState('Text Shadow');
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState(700);
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
      return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${color}`;
    });
    return shadowStrings.join(',\n    ');
  };

  const cssOutput = `text-shadow: ${generateCss()};`;

  const updateShadow = (id: number, field: keyof Omit<Shadow, 'id'>, value: number | string) => {
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
      case 'simple':
        setShadows([{ id: nextId, offsetX: 2, offsetY: 2, blur: 4, color: '#000000', opacity: 50 }]);
        setTextColor('#ffffff');
        break;
      case 'outline':
        setShadows([
          { id: nextId, offsetX: -1, offsetY: -1, blur: 0, color: '#000000', opacity: 100 },
          { id: nextId + 1, offsetX: 1, offsetY: -1, blur: 0, color: '#000000', opacity: 100 },
          { id: nextId + 2, offsetX: -1, offsetY: 1, blur: 0, color: '#000000', opacity: 100 },
          { id: nextId + 3, offsetX: 1, offsetY: 1, blur: 0, color: '#000000', opacity: 100 },
        ]);
        setTextColor('#ffffff');
        setNextId(nextId + 4);
        return;
      case 'glow':
        setShadows([
          { id: nextId, offsetX: 0, offsetY: 0, blur: 10, color: '#3b82f6', opacity: 100 },
          { id: nextId + 1, offsetX: 0, offsetY: 0, blur: 20, color: '#3b82f6', opacity: 70 },
          { id: nextId + 2, offsetX: 0, offsetY: 0, blur: 40, color: '#3b82f6', opacity: 40 },
        ]);
        setTextColor('#ffffff');
        setNextId(nextId + 3);
        return;
      case 'neon':
        setShadows([
          { id: nextId, offsetX: 0, offsetY: 0, blur: 5, color: '#ff00ff', opacity: 100 },
          { id: nextId + 1, offsetX: 0, offsetY: 0, blur: 10, color: '#ff00ff', opacity: 100 },
          { id: nextId + 2, offsetX: 0, offsetY: 0, blur: 20, color: '#ff00ff', opacity: 100 },
          { id: nextId + 3, offsetX: 0, offsetY: 0, blur: 40, color: '#ff00ff', opacity: 80 },
        ]);
        setTextColor('#ffffff');
        setBackgroundColor('#0a0a0a');
        setNextId(nextId + 4);
        return;
      case 'retro':
        setShadows([
          { id: nextId, offsetX: 4, offsetY: 4, blur: 0, color: '#ef4444', opacity: 100 },
          { id: nextId + 1, offsetX: 8, offsetY: 8, blur: 0, color: '#f97316', opacity: 100 },
          { id: nextId + 2, offsetX: 12, offsetY: 12, blur: 0, color: '#eab308', opacity: 100 },
        ]);
        setTextColor('#ffffff');
        setNextId(nextId + 3);
        return;
      case '3d':
        const layers: Shadow[] = [];
        for (let i = 1; i <= 6; i++) {
          layers.push({ id: nextId + i - 1, offsetX: i, offsetY: i, blur: 0, color: '#1e3a5f', opacity: 100 });
        }
        setShadows(layers);
        setTextColor('#3b82f6');
        setNextId(nextId + 6);
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
    setTextColor('#ffffff');
    setBackgroundColor('#1a1a2e');
    setSampleText('Text Shadow');
    setFontSize(48);
    setFontWeight(700);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <label className="block text-sm font-medium text-hub-muted mb-4">{t.preview}</label>
        <div
          className="h-48 rounded-lg flex items-center justify-center overflow-hidden transition-all"
          style={{ backgroundColor }}
        >
          <span
            className="transition-all text-center px-4"
            style={{
              color: textColor,
              textShadow: generateCss(),
              fontSize: `${fontSize}px`,
              fontWeight,
            }}
          >
            {sampleText || 'Text Shadow'}
          </span>
        </div>
      </div>

      {/* Sample Text & Font Settings */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-sm text-hub-muted mb-2">{t.sampleText}</label>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder={t.sampleTextPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.fontSize}</label>
            <span className="text-xs text-hub-accent font-mono">{fontSize}{t.px}</span>
          </div>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.fontWeight}</label>
            <span className="text-xs text-hub-accent font-mono">{fontWeight}</span>
          </div>
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={fontWeight}
            onChange={(e) => setFontWeight(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'simple', label: t.presetSimple },
            { key: 'outline', label: t.presetOutline },
            { key: 'glow', label: t.presetGlow },
            { key: 'neon', label: t.presetNeon },
            { key: 'retro', label: t.presetRetro },
            { key: '3d', label: t.preset3d },
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
          <label className="block text-sm text-hub-muted mb-2">{t.textColor}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-10 rounded border border-hub-border cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
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

          <div className="grid sm:grid-cols-3 gap-4">
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
                max={50}
                value={shadow.blur}
                onChange={(e) => updateShadow(shadow.id, 'blur', parseInt(e.target.value))}
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
