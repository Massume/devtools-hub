'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssUnitsConverterTranslations } from '@/lib/i18n-css-units-converter';
import toast from 'react-hot-toast';

type CssUnit = 'px' | 'em' | 'rem' | '%' | 'vw' | 'vh' | 'pt' | 'cm' | 'mm' | 'in';

interface ConversionResult {
  unit: CssUnit;
  value: number;
  label: string;
}

const UNITS: CssUnit[] = ['px', 'em', 'rem', '%', 'vw', 'vh', 'pt', 'cm', 'mm', 'in'];

// 96 DPI standard
const PX_PER_INCH = 96;
const PX_PER_CM = PX_PER_INCH / 2.54;
const PX_PER_MM = PX_PER_CM / 10;
const PX_PER_PT = PX_PER_INCH / 72;

export function CssUnitsConverter() {
  const { locale } = useI18n();
  const t = getCssUnitsConverterTranslations(locale);

  const [inputValue, setInputValue] = useState<number>(16);
  const [inputUnit, setInputUnit] = useState<CssUnit>('px');
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [viewportHeight, setViewportHeight] = useState<number>(1080);

  const toPixels = (value: number, unit: CssUnit): number => {
    switch (unit) {
      case 'px': return value;
      case 'em': return value * baseFontSize;
      case 'rem': return value * baseFontSize;
      case '%': return (value / 100) * baseFontSize;
      case 'vw': return (value / 100) * viewportWidth;
      case 'vh': return (value / 100) * viewportHeight;
      case 'pt': return value * PX_PER_PT;
      case 'cm': return value * PX_PER_CM;
      case 'mm': return value * PX_PER_MM;
      case 'in': return value * PX_PER_INCH;
      default: return value;
    }
  };

  const fromPixels = (px: number, unit: CssUnit): number => {
    switch (unit) {
      case 'px': return px;
      case 'em': return px / baseFontSize;
      case 'rem': return px / baseFontSize;
      case '%': return (px / baseFontSize) * 100;
      case 'vw': return (px / viewportWidth) * 100;
      case 'vh': return (px / viewportHeight) * 100;
      case 'pt': return px / PX_PER_PT;
      case 'cm': return px / PX_PER_CM;
      case 'mm': return px / PX_PER_MM;
      case 'in': return px / PX_PER_INCH;
      default: return px;
    }
  };

  const getUnitLabel = (unit: CssUnit): string => {
    const labels: Record<CssUnit, keyof typeof t> = {
      'px': 'unitPixels',
      'em': 'unitEm',
      'rem': 'unitRem',
      '%': 'unitPercent',
      'vw': 'unitVw',
      'vh': 'unitVh',
      'pt': 'unitPt',
      'cm': 'unitCm',
      'mm': 'unitMm',
      'in': 'unitIn',
    };
    return t[labels[unit]] as string;
  };

  const conversions = useMemo((): ConversionResult[] => {
    const px = toPixels(inputValue, inputUnit);
    return UNITS.map(unit => ({
      unit,
      value: fromPixels(px, unit),
      label: getUnitLabel(unit),
    }));
  }, [inputValue, inputUnit, baseFontSize, viewportWidth, viewportHeight]);

  const handleCopy = async (value: number, unit: CssUnit) => {
    const formatted = `${formatNumber(value)}${unit}`;
    await navigator.clipboard.writeText(formatted);
    toast.success(t.copied);
  };

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  const commonValues = [
    { px: 8, label: '0.5rem' },
    { px: 12, label: '0.75rem' },
    { px: 14, label: '0.875rem' },
    { px: 16, label: '1rem' },
    { px: 18, label: '1.125rem' },
    { px: 20, label: '1.25rem' },
    { px: 24, label: '1.5rem' },
    { px: 32, label: '2rem' },
    { px: 48, label: '3rem' },
    { px: 64, label: '4rem' },
  ];

  return (
    <div className="space-y-6">
      {/* Base Settings */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.baseSettings}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.baseFontSize}</label>
            <input
              type="number"
              min={1}
              max={100}
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(parseFloat(e.target.value) || 16)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.viewportWidth}</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={viewportWidth}
              onChange={(e) => setViewportWidth(parseFloat(e.target.value) || 1920)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.viewportHeight}</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={viewportHeight}
              onChange={(e) => setViewportHeight(parseFloat(e.target.value) || 1080)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.inputValue}</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-hub-muted">{t.inputUnit}</label>
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value as CssUnit)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 text-lg text-white focus:outline-none focus:border-hub-accent"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit} - {getUnitLabel(unit)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Output */}
      <div>
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.outputLabel}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {conversions.map(conv => (
            <div
              key={conv.unit}
              className={`bg-hub-card border rounded-lg p-4 ${
                conv.unit === inputUnit ? 'border-hub-accent' : 'border-hub-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-hub-muted">{conv.label}</span>
                <button
                  onClick={() => handleCopy(conv.value, conv.unit)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono text-white">
                  {formatNumber(conv.value)}
                </span>
                <span className="text-lg text-hub-accent font-mono">{conv.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Values */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.commonValues}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hub-border">
                <th className="text-left py-2 px-3 text-hub-muted font-medium">px</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">rem</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">em</th>
                <th className="text-left py-2 px-3 text-hub-muted font-medium">pt</th>
              </tr>
            </thead>
            <tbody>
              {commonValues.map(row => (
                <tr key={row.px} className="border-b border-hub-border/50">
                  <td className="py-2 px-3 font-mono text-white">{row.px}px</td>
                  <td className="py-2 px-3 font-mono text-hub-accent">{row.px / baseFontSize}rem</td>
                  <td className="py-2 px-3 font-mono text-cyan-400">{row.px / baseFontSize}em</td>
                  <td className="py-2 px-3 font-mono text-purple-400">{(row.px / PX_PER_PT).toFixed(2)}pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Reference */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.conversionTable}</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-hub-muted">
              <span className="text-white font-mono">1rem</span> = <span className="text-hub-accent font-mono">{baseFontSize}px</span>
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1em</span> = <span className="text-hub-accent font-mono">{baseFontSize}px</span> (parent font-size)
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1vw</span> = <span className="text-hub-accent font-mono">{viewportWidth / 100}px</span>
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1vh</span> = <span className="text-hub-accent font-mono">{viewportHeight / 100}px</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-hub-muted">
              <span className="text-white font-mono">1in</span> = <span className="text-hub-accent font-mono">{PX_PER_INCH}px</span>
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1cm</span> = <span className="text-hub-accent font-mono">{PX_PER_CM.toFixed(2)}px</span>
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1mm</span> = <span className="text-hub-accent font-mono">{PX_PER_MM.toFixed(4)}px</span>
            </p>
            <p className="text-hub-muted">
              <span className="text-white font-mono">1pt</span> = <span className="text-hub-accent font-mono">{PX_PER_PT.toFixed(4)}px</span>
            </p>
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
