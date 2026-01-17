'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMediaQueryGeneratorTranslations } from '@/lib/i18n-media-query-generator';
import toast from 'react-hot-toast';

interface Condition {
  id: string;
  operator: 'and' | 'or';
  not: boolean;
  feature: string;
  value: string;
  unit: string;
}

const FEATURES = [
  { value: 'min-width', units: ['px', 'em', 'rem'] },
  { value: 'max-width', units: ['px', 'em', 'rem'] },
  { value: 'min-height', units: ['px', 'em', 'rem'] },
  { value: 'max-height', units: ['px', 'em', 'rem'] },
  { value: 'orientation', units: [] },
  { value: 'prefers-color-scheme', units: [] },
  { value: 'prefers-reduced-motion', units: [] },
  { value: 'pointer', units: [] },
  { value: 'hover', units: [] },
  { value: 'resolution', units: ['dpi', 'dppx'] },
  { value: 'aspect-ratio', units: [] },
];

const PRESETS = {
  mobileFirst: '@media (min-width: 768px) { }',
  desktopFirst: '@media (max-width: 1024px) { }',
  tablet: '@media (min-width: 768px) and (max-width: 1024px) { }',
  landscape: '@media (orientation: landscape) { }',
  portrait: '@media (orientation: portrait) { }',
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { }',
  print: '@media print { }',
  dark: '@media (prefers-color-scheme: dark) { }',
  reducedMotion: '@media (prefers-reduced-motion: reduce) { }',
};

const BREAKPOINTS = [
  { name: 'Mobile', width: '320px - 480px' },
  { name: 'Tablet', width: '768px - 1024px' },
  { name: 'Laptop', width: '1024px - 1440px' },
  { name: 'Desktop', width: '1440px - 1920px' },
  { name: '4K', width: '2560px+' },
];

export function MediaQueryGenerator() {
  const { locale } = useI18n();
  const t = getMediaQueryGeneratorTranslations(locale);

  const [mediaType, setMediaType] = useState<string>('screen');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', operator: 'and', not: false, feature: 'min-width', value: '768', unit: 'px' },
  ]);

  const addCondition = () => {
    setConditions(prev => [
      ...prev,
      { id: Date.now().toString(), operator: 'and', not: false, feature: 'min-width', value: '', unit: 'px' },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const getFeatureValue = (condition: Condition): string => {
    const { feature, value, unit } = condition;

    switch (feature) {
      case 'orientation':
        return value || 'landscape';
      case 'prefers-color-scheme':
        return value || 'dark';
      case 'prefers-reduced-motion':
        return value || 'reduce';
      case 'pointer':
        return value || 'fine';
      case 'hover':
        return value || 'hover';
      case 'aspect-ratio':
        return value || '16/9';
      default:
        return value ? `${value}${unit}` : '';
    }
  };

  const generatedQuery = useMemo(() => {
    if (conditions.length === 0) return '';

    const parts: string[] = [];

    conditions.forEach((condition, index) => {
      const featureValue = getFeatureValue(condition);
      if (!featureValue) return;

      let part = '';
      if (index > 0) {
        part += condition.operator === 'or' ? ', ' : ' and ';
      }
      if (condition.not) {
        part += 'not ';
      }
      part += `(${condition.feature}: ${featureValue})`;
      parts.push(part);
    });

    if (parts.length === 0) return '';

    const mediaTypePrefix = mediaType !== 'all' ? `${mediaType} and ` : '';
    return `@media ${mediaTypePrefix}${parts.join('')}`;
  }, [mediaType, conditions]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const applyPreset = (preset: keyof typeof PRESETS) => {
    handleCopy(PRESETS[preset]);
  };

  const clearAll = () => {
    setConditions([
      { id: '1', operator: 'and', not: false, feature: 'min-width', value: '768', unit: 'px' },
    ]);
    setMediaType('screen');
  };

  const getFeatureUnits = (feature: string) => {
    return FEATURES.find(f => f.value === feature)?.units || [];
  };

  const isEnumFeature = (feature: string) => {
    return ['orientation', 'prefers-color-scheme', 'prefers-reduced-motion', 'pointer', 'hover'].includes(feature);
  };

  const getEnumOptions = (feature: string): { value: string; label: string }[] => {
    switch (feature) {
      case 'orientation':
        return [
          { value: 'landscape', label: t.orientationLandscape },
          { value: 'portrait', label: t.orientationPortrait },
        ];
      case 'prefers-color-scheme':
        return [
          { value: 'light', label: t.colorSchemeLight },
          { value: 'dark', label: t.colorSchemeDark },
        ];
      case 'prefers-reduced-motion':
        return [
          { value: 'reduce', label: t.reducedMotionReduce },
          { value: 'no-preference', label: t.reducedMotionNoPreference },
        ];
      case 'pointer':
        return [
          { value: 'none', label: t.pointerNone },
          { value: 'coarse', label: t.pointerCoarse },
          { value: 'fine', label: t.pointerFine },
        ];
      case 'hover':
        return [
          { value: 'none', label: t.hoverNone },
          { value: 'hover', label: t.hoverHover },
        ];
      default:
        return [];
    }
  };

  const presetButtons: { key: keyof typeof PRESETS; label: string }[] = [
    { key: 'mobileFirst', label: t.presetMobile },
    { key: 'desktopFirst', label: t.presetDesktop },
    { key: 'tablet', label: t.presetTablet },
    { key: 'landscape', label: t.presetLandscape },
    { key: 'portrait', label: t.presetPortrait },
    { key: 'retina', label: t.presetRetina },
    { key: 'print', label: t.presetPrint },
    { key: 'dark', label: t.presetDark },
    { key: 'reducedMotion', label: t.presetReducedMotion },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.presets}</h3>
          <button
            onClick={clearAll}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.clearAll}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetButtons.map(preset => (
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

      {/* Custom Builder */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.customBuilder}</h3>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.mediaType}</label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full sm:w-auto bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          >
            <option value="all">{t.typeAll}</option>
            <option value="screen">{t.typeScreen}</option>
            <option value="print">{t.typePrint}</option>
            <option value="speech">{t.typeSpeech}</option>
          </select>
        </div>

        {/* Conditions */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.conditions}</label>
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="flex flex-wrap gap-2 items-center p-3 bg-hub-darker rounded-lg">
                {index > 0 && (
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(condition.id, { operator: e.target.value as 'and' | 'or' })}
                    className="bg-hub-dark border border-hub-border rounded-lg px-2 py-1 text-sm text-white"
                  >
                    <option value="and">{t.conditionAnd}</option>
                    <option value="or">{t.conditionOr}</option>
                  </select>
                )}

                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={condition.not}
                    onChange={(e) => updateCondition(condition.id, { not: e.target.checked })}
                    className="rounded border-hub-border bg-hub-dark accent-hub-accent"
                  />
                  <span className="text-xs text-hub-muted">{t.conditionNot}</span>
                </label>

                <select
                  value={condition.feature}
                  onChange={(e) => {
                    const newFeature = e.target.value;
                    const units = getFeatureUnits(newFeature);
                    updateCondition(condition.id, {
                      feature: newFeature,
                      unit: units[0] || '',
                      value: isEnumFeature(newFeature) ? getEnumOptions(newFeature)[0]?.value || '' : '',
                    });
                  }}
                  className="bg-hub-dark border border-hub-border rounded-lg px-2 py-1 text-sm text-white"
                >
                  {FEATURES.map(f => (
                    <option key={f.value} value={f.value}>{f.value}</option>
                  ))}
                </select>

                {isEnumFeature(condition.feature) ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    className="bg-hub-dark border border-hub-border rounded-lg px-2 py-1 text-sm text-white"
                  >
                    {getEnumOptions(condition.feature).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                      placeholder={t.value}
                      className="w-24 bg-hub-dark border border-hub-border rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-hub-accent"
                    />
                    {getFeatureUnits(condition.feature).length > 0 && (
                      <select
                        value={condition.unit}
                        onChange={(e) => updateCondition(condition.id, { unit: e.target.value })}
                        className="bg-hub-dark border border-hub-border rounded-lg px-2 py-1 text-sm text-white"
                      >
                        {getFeatureUnits(condition.feature).map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}

                {conditions.length > 1 && (
                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.removeCondition}
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addCondition}
            className="mt-3 px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors"
          >
            {t.addCondition}
          </button>
        </div>
      </div>

      {/* Generated Query */}
      {generatedQuery && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button
              onClick={() => handleCopy(generatedQuery + ' { }')}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <code className="text-sm text-green-400 font-mono">
              {generatedQuery} {`{ }`}
            </code>
          </div>
        </div>
      )}

      {/* CSS Example */}
      {generatedQuery && (
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.cssExample}</label>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-cyan-400 font-mono whitespace-pre">
{`${generatedQuery} {
  /* Your styles here */
  .container {
    max-width: 1200px;
  }
}`}
            </code>
          </pre>
        </div>
      )}

      {/* Common Breakpoints */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.commonBreakpoints}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hub-border">
                <th className="text-left py-2 text-hub-muted font-medium">Device</th>
                <th className="text-left py-2 text-hub-muted font-medium">Width</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp, i) => (
                <tr key={i} className="border-b border-hub-border/50">
                  <td className="py-2 text-white">{bp.name}</td>
                  <td className="py-2 text-hub-accent font-mono">{bp.width}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
