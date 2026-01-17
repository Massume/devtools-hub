'use client';

import { useState, useMemo, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getColorConverterTranslations } from '@/lib/i18n-color-converter';
import toast from 'react-hot-toast';

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface CMYK { c: number; m: number; y: number; k: number; }

// Color conversion functions
function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }
  // Handle 3-digit hex
  const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
  if (short) {
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorConverter() {
  const { locale } = useI18n();
  const t = getColorConverterTranslations(locale);

  const [inputValue, setInputValue] = useState('#8b5cf6');
  const [rgb, setRgb] = useState<RGB>({ r: 139, g: 92, b: 246 });
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Try to parse input as various formats
    let parsed: RGB | null = null;

    // HEX
    parsed = hexToRgb(inputValue);

    // RGB/RGBA
    if (!parsed) {
      const rgbMatch = inputValue.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (rgbMatch) {
        parsed = { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
      }
    }

    // HSL
    if (!parsed) {
      const hslMatch = inputValue.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
      if (hslMatch) {
        parsed = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
      }
    }

    if (parsed) {
      setRgb(parsed);
      const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
      if (!history.includes(hex)) {
        setHistory(prev => [hex, ...prev].slice(0, 10));
      }
    }
  }, [inputValue]);

  const formats = useMemo(() => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return {
      hex,
      hex8: hex + 'ff',
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
      hsv: `hsv(${hsl.h}, ${hsl.s}%, ${Math.round(Math.max(rgb.r, rgb.g, rgb.b) / 255 * 100)}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      cssVariable: `--color-primary: ${hex};`,
    };
  }, [rgb]);

  const accessibility = useMemo(() => {
    const lum = getLuminance(rgb.r, rgb.g, rgb.b);
    const whiteLum = 1;
    const blackLum = 0;

    const contrastWhite = getContrastRatio(lum, whiteLum);
    const contrastBlack = getContrastRatio(lum, blackLum);

    return {
      contrastWhite: contrastWhite.toFixed(2),
      contrastBlack: contrastBlack.toFixed(2),
      aaWhite: contrastWhite >= 4.5,
      aaaWhite: contrastWhite >= 7,
      aaBlack: contrastBlack >= 4.5,
      aaaBlack: contrastBlack >= 7,
    };
  }, [rgb]);

  const tints = useMemo(() => {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return [90, 80, 70, 60, 50].map(l => {
      const { r, g, b } = hslToRgb(hsl.h, hsl.s, l);
      return rgbToHex(r, g, b);
    });
  }, [rgb]);

  const shades = useMemo(() => {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return [40, 30, 20, 10, 5].map(l => {
      const { r, g, b } = hslToRgb(hsl.h, hsl.s, l);
      return rgbToHex(r, g, b);
    });
  }, [rgb]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const adjustColor = (type: 'lighten' | 'darken' | 'saturate' | 'desaturate' | 'rotate' | 'invert' | 'complement' | 'grayscale') => {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let newRgb: RGB;

    switch (type) {
      case 'lighten':
        newRgb = hslToRgb(hsl.h, hsl.s, Math.min(100, hsl.l + 10));
        break;
      case 'darken':
        newRgb = hslToRgb(hsl.h, hsl.s, Math.max(0, hsl.l - 10));
        break;
      case 'saturate':
        newRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), hsl.l);
        break;
      case 'desaturate':
        newRgb = hslToRgb(hsl.h, Math.max(0, hsl.s - 10), hsl.l);
        break;
      case 'rotate':
        newRgb = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l);
        break;
      case 'invert':
        newRgb = { r: 255 - rgb.r, g: 255 - rgb.g, b: 255 - rgb.b };
        break;
      case 'complement':
        newRgb = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
        break;
      case 'grayscale':
        const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
        newRgb = { r: gray, g: gray, b: gray };
        break;
      default:
        return;
    }

    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setInputValue(hex);
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.inputColor}</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
          />
          <input
            type="color"
            value={formats.hex}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer border-0"
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
        <div
          className="h-24 rounded-lg border border-hub-border"
          style={{ backgroundColor: formats.hex }}
        />
      </div>

      {/* Color Formats */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.formats}</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {Object.entries({
            [t.hex]: formats.hex,
            [t.rgb]: formats.rgb,
            [t.rgba]: formats.rgba,
            [t.hsl]: formats.hsl,
            [t.hsla]: formats.hsla,
            [t.cmyk]: formats.cmyk,
          }).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between bg-hub-darker rounded-lg px-3 py-2">
              <span className="text-xs text-hub-muted">{label}</span>
              <div className="flex items-center gap-2">
                <code className="text-xs text-green-400 font-mono">{value}</code>
                <button onClick={() => handleCopy(value)} className="text-xs text-hub-accent hover:underline">
                  {t.copyButton}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.adjustments}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'lighten' as const, label: t.lighten },
            { type: 'darken' as const, label: t.darken },
            { type: 'saturate' as const, label: t.saturate },
            { type: 'desaturate' as const, label: t.desaturate },
            { type: 'rotate' as const, label: t.rotate },
            { type: 'invert' as const, label: t.invert },
            { type: 'complement' as const, label: t.complement },
            { type: 'grayscale' as const, label: t.grayscale },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => adjustColor(type)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tints & Shades */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.tints}</h3>
          <div className="flex gap-1">
            {tints.map((color, i) => (
              <button
                key={i}
                className="flex-1 h-10 rounded cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setInputValue(color)}
                title={color}
              />
            ))}
          </div>
        </div>
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.shades}</h3>
          <div className="flex gap-1">
            {shades.map((color, i) => (
              <button
                key={i}
                className="flex-1 h-10 rounded cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setInputValue(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.accessibility}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hub-muted">{t.contrastWhite}</span>
              <span className="text-sm font-mono text-white">{accessibility.contrastWhite}:1</span>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${accessibility.aaWhite ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {t.wcagAA}: {accessibility.aaWhite ? t.passes : t.fails}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${accessibility.aaaWhite ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {t.wcagAAA}: {accessibility.aaaWhite ? t.passes : t.fails}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hub-muted">{t.contrastBlack}</span>
              <span className="text-sm font-mono text-white">{accessibility.contrastBlack}:1</span>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${accessibility.aaBlack ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {t.wcagAA}: {accessibility.aaBlack ? t.passes : t.fails}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${accessibility.aaaBlack ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {t.wcagAAA}: {accessibility.aaaBlack ? t.passes : t.fails}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-hub-muted">{t.history}</h3>
            <button onClick={clearHistory} className="text-xs text-hub-accent hover:underline">
              {t.clearHistory}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((color, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded border border-hub-border cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setInputValue(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

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
