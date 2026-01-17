'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBorderRadiusGeneratorTranslations } from '@/lib/i18n-border-radius-generator';
import toast from 'react-hot-toast';

export function BorderRadiusGenerator() {
  const { locale } = useI18n();
  const t = getBorderRadiusGeneratorTranslations(locale);

  const [topLeft, setTopLeft] = useState(16);
  const [topRight, setTopRight] = useState(16);
  const [bottomRight, setBottomRight] = useState(16);
  const [bottomLeft, setBottomLeft] = useState(16);
  const [linked, setLinked] = useState(true);

  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(200);
  const [boxColor, setBoxColor] = useState('#3b82f6');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#60a5fa');

  const updateRadius = (corner: string, value: number) => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      switch (corner) {
        case 'topLeft': setTopLeft(value); break;
        case 'topRight': setTopRight(value); break;
        case 'bottomRight': setBottomRight(value); break;
        case 'bottomLeft': setBottomLeft(value); break;
      }
    }
  };

  const generateCss = (): string => {
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `border-radius: ${topLeft}px;`;
    }
    return `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`;
  };

  const cssOutput = generateCss();
  const fullCss = borderWidth > 0
    ? `${cssOutput}\nborder: ${borderWidth}px solid ${borderColor};`
    : cssOutput;

  const applyPreset = (preset: string) => {
    setLinked(false);
    switch (preset) {
      case 'square':
        setTopLeft(0); setTopRight(0); setBottomRight(0); setBottomLeft(0);
        break;
      case 'rounded':
        setTopLeft(8); setTopRight(8); setBottomRight(8); setBottomLeft(8);
        setLinked(true);
        break;
      case 'pill':
        const radius = Math.min(boxWidth, boxHeight) / 2;
        setTopLeft(radius); setTopRight(radius); setBottomRight(radius); setBottomLeft(radius);
        break;
      case 'circle':
        setBoxWidth(200); setBoxHeight(200);
        setTopLeft(100); setTopRight(100); setBottomRight(100); setBottomLeft(100);
        break;
      case 'leaf':
        setTopLeft(0); setTopRight(50); setBottomRight(0); setBottomLeft(50);
        break;
      case 'drop':
        setTopLeft(50); setTopRight(50); setBottomRight(50); setBottomLeft(0);
        break;
      case 'blob':
        setTopLeft(60); setTopRight(30); setBottomRight(70); setBottomLeft(40);
        break;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
    toast.success(t.copied);
  };

  const handleReset = () => {
    setTopLeft(16); setTopRight(16); setBottomRight(16); setBottomLeft(16);
    setLinked(true);
    setBoxWidth(200); setBoxHeight(200);
    setBoxColor('#3b82f6');
    setBackgroundColor('#1a1a2e');
    setBorderWidth(0);
    setBorderColor('#60a5fa');
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <label className="block text-sm font-medium text-hub-muted mb-4">{t.preview}</label>
        <div
          className="h-72 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor }}
        >
          <div
            className="transition-all"
            style={{
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              backgroundColor: boxColor,
              borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
              border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            }}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'square', label: t.presetSquare },
            { key: 'rounded', label: t.presetRounded },
            { key: 'pill', label: t.presetPill },
            { key: 'circle', label: t.presetCircle },
            { key: 'leaf', label: t.presetLeaf },
            { key: 'drop', label: t.presetDrop },
            { key: 'blob', label: t.presetBlob },
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

      {/* Link Corners Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={linked}
          onChange={(e) => setLinked(e.target.checked)}
          className="rounded border-hub-border bg-hub-darker accent-hub-accent"
        />
        <span className="text-sm text-hub-muted">{t.linkCorners}</span>
      </label>

      {/* Corner Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { key: 'topLeft', label: t.topLeft, value: topLeft },
          { key: 'topRight', label: t.topRight, value: topRight },
          { key: 'bottomLeft', label: t.bottomLeft, value: bottomLeft },
          { key: 'bottomRight', label: t.bottomRight, value: bottomRight },
        ].map(corner => (
          <div key={corner.key} className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-hub-muted">{corner.label}</label>
              <span className="text-sm text-hub-accent font-mono">{corner.value}{t.px}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={corner.value}
              onChange={(e) => updateRadius(corner.key, parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
          </div>
        ))}
      </div>

      {/* Box Dimensions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.boxWidth}</label>
            <span className="text-sm text-hub-accent font-mono">{boxWidth}{t.px}</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            value={boxWidth}
            onChange={(e) => setBoxWidth(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
        </div>
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.boxHeight}</label>
            <span className="text-sm text-hub-accent font-mono">{boxHeight}{t.px}</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            value={boxHeight}
            onChange={(e) => setBoxHeight(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
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

      {/* Border */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-hub-muted">{t.borderWidth}</label>
            <span className="text-sm text-hub-accent font-mono">{borderWidth}{t.px}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={borderWidth}
            onChange={(e) => setBorderWidth(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
        </div>
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <label className="block text-sm text-hub-muted mb-2">{t.borderColor}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-12 h-10 rounded border border-hub-border cursor-pointer"
            />
            <input
              type="text"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-hub-card border border-hub-border text-white rounded-lg hover:border-hub-accent/50 transition-colors"
      >
        {t.reset}
      </button>

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
          {fullCss}
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
