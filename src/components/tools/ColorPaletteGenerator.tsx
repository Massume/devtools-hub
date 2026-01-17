'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getColorPaletteGeneratorTranslations } from '@/lib/i18n-color-palette-generator';
import toast from 'react-hot-toast';

type PaletteType = 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'splitComplementary' | 'monochromatic';

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToHsl(hex: string): HSL {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
}

function formatHsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function generatePalette(baseHsl: HSL, type: PaletteType): HSL[] {
  const { h, s, l } = baseHsl;
  const colors: HSL[] = [];

  switch (type) {
    case 'analogous':
      colors.push({ h: (h - 30 + 360) % 360, s, l });
      colors.push({ h, s, l });
      colors.push({ h: (h + 30) % 360, s, l });
      colors.push({ h: (h + 60) % 360, s, l });
      colors.push({ h: (h - 60 + 360) % 360, s, l });
      break;
    case 'complementary':
      colors.push({ h, s, l });
      colors.push({ h: (h + 180) % 360, s, l });
      break;
    case 'triadic':
      colors.push({ h, s, l });
      colors.push({ h: (h + 120) % 360, s, l });
      colors.push({ h: (h + 240) % 360, s, l });
      break;
    case 'tetradic':
      colors.push({ h, s, l });
      colors.push({ h: (h + 90) % 360, s, l });
      colors.push({ h: (h + 180) % 360, s, l });
      colors.push({ h: (h + 270) % 360, s, l });
      break;
    case 'splitComplementary':
      colors.push({ h, s, l });
      colors.push({ h: (h + 150) % 360, s, l });
      colors.push({ h: (h + 210) % 360, s, l });
      break;
    case 'monochromatic':
      colors.push({ h, s, l: Math.max(l - 30, 10) });
      colors.push({ h, s, l: Math.max(l - 15, 20) });
      colors.push({ h, s, l });
      colors.push({ h, s, l: Math.min(l + 15, 80) });
      colors.push({ h, s, l: Math.min(l + 30, 90) });
      break;
  }

  return colors;
}

function generateShades(baseHsl: HSL): HSL[] {
  const { h, s, l } = baseHsl;
  return [
    { h, s, l: Math.min(l + 40, 95) },
    { h, s, l: Math.min(l + 30, 90) },
    { h, s, l: Math.min(l + 20, 85) },
    { h, s, l: Math.min(l + 10, 80) },
    { h, s, l },
    { h, s, l: Math.max(l - 10, 20) },
    { h, s, l: Math.max(l - 20, 15) },
    { h, s, l: Math.max(l - 30, 10) },
    { h, s, l: Math.max(l - 40, 5) },
  ];
}

export function ColorPaletteGenerator() {
  const { locale } = useI18n();
  const t = getColorPaletteGeneratorTranslations(locale);

  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState<PaletteType>('analogous');

  const baseHsl = useMemo(() => hexToHsl(baseColor), [baseColor]);

  const palette = useMemo(() => generatePalette(baseHsl, paletteType), [baseHsl, paletteType]);

  const shades = useMemo(() => generateShades(baseHsl), [baseHsl]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const copyAllColors = () => {
    const colors = palette.map(c => hslToHex(c.h, c.s, c.l)).join(', ');
    handleCopy(colors);
  };

  const randomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 50;
    const l = Math.floor(Math.random() * 30) + 40;
    setBaseColor(hslToHex(h, s, l));
  };

  const exportCss = () => {
    const lines = palette.map((c, i) => `  --color-${i + 1}: ${hslToHex(c.h, c.s, c.l)};`);
    const css = `:root {\n${lines.join('\n')}\n}`;
    handleCopy(css);
  };

  const exportScss = () => {
    const lines = palette.map((c, i) => `$color-${i + 1}: ${hslToHex(c.h, c.s, c.l)};`);
    handleCopy(lines.join('\n'));
  };

  const paletteTypes: { key: PaletteType; label: string }[] = [
    { key: 'analogous', label: t.typeAnalogous },
    { key: 'complementary', label: t.typeComplementary },
    { key: 'triadic', label: t.typeTriadic },
    { key: 'tetradic', label: t.typeTetradic },
    { key: 'splitComplementary', label: t.typeSplitComplementary },
    { key: 'monochromatic', label: t.typeMonochromatic },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.baseColor}</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-12 rounded cursor-pointer border border-hub-border"
              />
              <input
                type="text"
                value={baseColor.toUpperCase()}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-white uppercase"
              />
              <button
                onClick={randomColor}
                className="px-3 py-2 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
              >
                {t.randomColor}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.paletteType}</label>
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as PaletteType)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-3 text-white"
            >
              {paletteTypes.map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generated Palette */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.generatedPalette}</h3>
          <div className="flex gap-2">
            <button
              onClick={copyAllColors}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.copyAll}
            </button>
            <button
              onClick={exportCss}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.exportCss}
            </button>
            <button
              onClick={exportScss}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.exportScss}
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {palette.map((color, index) => {
            const hex = hslToHex(color.h, color.s, color.l);
            return (
              <div
                key={index}
                onClick={() => handleCopy(hex)}
                className="flex-1 min-w-[100px] cursor-pointer group"
              >
                <div
                  className="h-24 rounded-t-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: hex }}
                />
                <div className="bg-hub-darker rounded-b-lg p-2 text-center">
                  <div className="text-xs font-mono text-white">{hex.toUpperCase()}</div>
                  <div className="text-xs text-hub-muted">{formatHsl(color.h, color.s, color.l)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shades & Tints */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.shades} / {t.tints}</h3>
        <div className="flex gap-1">
          {shades.map((shade, index) => {
            const hex = hslToHex(shade.h, shade.s, shade.l);
            return (
              <div
                key={index}
                onClick={() => handleCopy(hex)}
                className="flex-1 cursor-pointer group"
              >
                <div
                  className="h-16 rounded transition-transform group-hover:scale-105"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Formats */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.colorFormats}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-hub-darker rounded-lg p-3">
            <div className="text-xs text-hub-muted mb-1">{t.hex}</div>
            <div className="flex items-center justify-between">
              <code className="font-mono text-white">{baseColor.toUpperCase()}</code>
              <button
                onClick={() => handleCopy(baseColor)}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
          <div className="bg-hub-darker rounded-lg p-3">
            <div className="text-xs text-hub-muted mb-1">{t.rgb}</div>
            <div className="flex items-center justify-between">
              <code className="font-mono text-white">{hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l)}</code>
              <button
                onClick={() => handleCopy(hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l))}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
          <div className="bg-hub-darker rounded-lg p-3">
            <div className="text-xs text-hub-muted mb-1">{t.hsl}</div>
            <div className="flex items-center justify-between">
              <code className="font-mono text-white">{formatHsl(baseHsl.h, baseHsl.s, baseHsl.l)}</code>
              <button
                onClick={() => handleCopy(formatHsl(baseHsl.h, baseHsl.s, baseHsl.l))}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
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
