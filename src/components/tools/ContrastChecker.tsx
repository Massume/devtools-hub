'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getContrastCheckerTranslations } from '@/lib/i18n-contrast-checker';
import toast from 'react-hot-toast';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(fg: string, bg: string): number {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

// Color blindness simulation matrices
function simulateColorBlindness(r: number, g: number, b: number, type: string): { r: number; g: number; b: number } {
  const matrices: Record<string, number[][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  };

  const m = matrices[type];
  if (!m) return { r, g, b };

  return {
    r: m[0][0] * r + m[0][1] * g + m[0][2] * b,
    g: m[1][0] * r + m[1][1] * g + m[1][2] * b,
    b: m[2][0] * r + m[2][1] * g + m[2][2] * b,
  };
}

export function ContrastChecker() {
  const { locale } = useI18n();
  const t = getContrastCheckerTranslations(locale);

  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');

  const contrastRatio = useMemo(() => {
    return getContrastRatio(foreground, background);
  }, [foreground, background]);

  const wcagResults = useMemo(() => {
    const ratio = contrastRatio;
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [contrastRatio]);

  const suggestions = useMemo(() => {
    if (wcagResults.aaNormal) return [];

    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const results: { color: string; label: string }[] = [];

    // Try darkening foreground
    for (let factor = 0.9; factor >= 0.1; factor -= 0.1) {
      const darkened = {
        r: fgRgb.r * factor,
        g: fgRgb.g * factor,
        b: fgRgb.b * factor,
      };
      const hex = rgbToHex(darkened.r, darkened.g, darkened.b);
      if (getContrastRatio(hex, background) >= 4.5) {
        results.push({ color: hex, label: t.suggestDarken });
        break;
      }
    }

    // Try lightening foreground (if background is dark)
    if (bgLum < 0.5) {
      for (let factor = 1.1; factor <= 3; factor += 0.1) {
        const lightened = {
          r: Math.min(255, fgRgb.r * factor + (255 - fgRgb.r) * (factor - 1)),
          g: Math.min(255, fgRgb.g * factor + (255 - fgRgb.g) * (factor - 1)),
          b: Math.min(255, fgRgb.b * factor + (255 - fgRgb.b) * (factor - 1)),
        };
        const hex = rgbToHex(lightened.r, lightened.g, lightened.b);
        if (getContrastRatio(hex, background) >= 4.5) {
          results.push({ color: hex, label: t.suggestLighten });
          break;
        }
      }
    }

    return results.slice(0, 3);
  }, [foreground, background, wcagResults.aaNormal, t]);

  const colorBlindSimulations = useMemo(() => {
    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    return ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map(type => {
      const fgSim = simulateColorBlindness(fgRgb.r, fgRgb.g, fgRgb.b, type);
      const bgSim = simulateColorBlindness(bgRgb.r, bgRgb.g, bgRgb.b, type);
      return {
        type,
        fg: rgbToHex(fgSim.r, fgSim.g, fgSim.b),
        bg: rgbToHex(bgSim.r, bgSim.g, bgSim.b),
        ratio: getContrastRatio(
          rgbToHex(fgSim.r, fgSim.g, fgSim.b),
          rgbToHex(bgSim.r, bgSim.g, bgSim.b)
        ),
      };
    });
  }, [foreground, background]);

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, keyof typeof t> = {
      protanopia: 'protanopia',
      deuteranopia: 'deuteranopia',
      tritanopia: 'tritanopia',
      achromatopsia: 'achromatopsia',
    };
    return t[labels[type]] as string;
  };

  return (
    <div className="space-y-6">
      {/* Color Inputs */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.foregroundColor}</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="w-16 h-12 rounded cursor-pointer border border-hub-border"
              />
              <input
                type="text"
                value={foreground.toUpperCase()}
                onChange={(e) => setForeground(e.target.value)}
                className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-white uppercase"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.backgroundColor}</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-16 h-12 rounded cursor-pointer border border-hub-border"
              />
              <input
                type="text"
                value={background.toUpperCase()}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-2 font-mono text-white uppercase"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={swapColors}
            className="px-4 py-2 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
          >
            {t.swapColors}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.previewLabel}</h3>
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ backgroundColor: background }}
        >
          <p style={{ color: foreground, fontSize: '24px', fontWeight: 'bold' }}>
            {t.sampleTextLarge}
          </p>
          <p style={{ color: foreground, fontSize: '16px' }}>
            {t.sampleTextNormal}
          </p>
        </div>
      </div>

      {/* Contrast Ratio */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.contrastRatio}</h3>
        <div className="text-center">
          <div className={`text-5xl font-bold mb-2 ${
            wcagResults.aaaNormal ? 'text-green-400' :
            wcagResults.aaNormal ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {contrastRatio.toFixed(2)}:1
          </div>
        </div>
      </div>

      {/* WCAG Results */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.wcagResults}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Level AA */}
          <div className="bg-hub-darker rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">{t.levelAA}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-hub-muted">{t.normalText}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  wcagResults.aaNormal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {wcagResults.aaNormal ? t.pass : t.fail}
                </span>
              </div>
              <p className="text-xs text-hub-muted">{t.minRatioAA}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-hub-muted">{t.largeText}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  wcagResults.aaLarge ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {wcagResults.aaLarge ? t.pass : t.fail}
                </span>
              </div>
              <p className="text-xs text-hub-muted">{t.minRatioAALarge}</p>
            </div>
          </div>

          {/* Level AAA */}
          <div className="bg-hub-darker rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">{t.levelAAA}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-hub-muted">{t.normalText}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  wcagResults.aaaNormal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {wcagResults.aaaNormal ? t.pass : t.fail}
                </span>
              </div>
              <p className="text-xs text-hub-muted">{t.minRatioAAA}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-hub-muted">{t.largeText}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  wcagResults.aaaLarge ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {wcagResults.aaaLarge ? t.pass : t.fail}
                </span>
              </div>
              <p className="text-xs text-hub-muted">{t.minRatioAAALarge}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.suggestions}</h3>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-hub-darker rounded-lg p-2"
              >
                <div
                  className="w-8 h-8 rounded border border-hub-border"
                  style={{ backgroundColor: suggestion.color }}
                />
                <span className="text-sm font-mono text-white">{suggestion.color}</span>
                <span className="text-xs text-hub-muted">{suggestion.label}</span>
                <button
                  onClick={() => setForeground(suggestion.color)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.applySuggestion}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color Blindness Simulation */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.colorBlindness}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {colorBlindSimulations.map(sim => (
            <div key={sim.type} className="bg-hub-darker rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">{getTypeLabel(sim.type)}</span>
                <span className={`text-sm font-mono ${
                  sim.ratio >= 4.5 ? 'text-green-400' : sim.ratio >= 3 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {sim.ratio.toFixed(2)}:1
                </span>
              </div>
              <div
                className="rounded p-3"
                style={{ backgroundColor: sim.bg }}
              >
                <p style={{ color: sim.fg, fontSize: '14px' }}>
                  Sample Text
                </p>
              </div>
            </div>
          ))}
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
