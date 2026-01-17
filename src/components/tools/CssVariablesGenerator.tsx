'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssVariablesGeneratorTranslations } from '@/lib/i18n-css-variables-generator';
import toast from 'react-hot-toast';

interface CssVariable {
  id: string;
  name: string;
  value: string;
}

interface Preset {
  name: string;
  variables: { name: string; value: string }[];
}

const PRESETS: Record<string, Preset> = {
  colors: {
    name: 'Color Palette',
    variables: [
      { name: '--color-primary', value: '#8b5cf6' },
      { name: '--color-secondary', value: '#06b6d4' },
      { name: '--color-accent', value: '#f97316' },
      { name: '--color-success', value: '#22c55e' },
      { name: '--color-warning', value: '#eab308' },
      { name: '--color-error', value: '#ef4444' },
      { name: '--color-text', value: '#1f2937' },
      { name: '--color-background', value: '#ffffff' },
    ],
  },
  spacing: {
    name: 'Spacing Scale',
    variables: [
      { name: '--spacing-xs', value: '0.25rem' },
      { name: '--spacing-sm', value: '0.5rem' },
      { name: '--spacing-md', value: '1rem' },
      { name: '--spacing-lg', value: '1.5rem' },
      { name: '--spacing-xl', value: '2rem' },
      { name: '--spacing-2xl', value: '3rem' },
      { name: '--spacing-3xl', value: '4rem' },
    ],
  },
  typography: {
    name: 'Typography',
    variables: [
      { name: '--font-family', value: 'system-ui, sans-serif' },
      { name: '--font-size-xs', value: '0.75rem' },
      { name: '--font-size-sm', value: '0.875rem' },
      { name: '--font-size-base', value: '1rem' },
      { name: '--font-size-lg', value: '1.125rem' },
      { name: '--font-size-xl', value: '1.25rem' },
      { name: '--font-size-2xl', value: '1.5rem' },
      { name: '--line-height', value: '1.5' },
    ],
  },
  shadows: {
    name: 'Shadows',
    variables: [
      { name: '--shadow-sm', value: '0 1px 2px rgba(0, 0, 0, 0.05)' },
      { name: '--shadow-md', value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
      { name: '--shadow-lg', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
      { name: '--shadow-xl', value: '0 20px 25px rgba(0, 0, 0, 0.15)' },
    ],
  },
  borders: {
    name: 'Borders',
    variables: [
      { name: '--border-width', value: '1px' },
      { name: '--border-color', value: '#e5e7eb' },
      { name: '--border-radius-sm', value: '0.25rem' },
      { name: '--border-radius-md', value: '0.5rem' },
      { name: '--border-radius-lg', value: '1rem' },
      { name: '--border-radius-full', value: '9999px' },
    ],
  },
};

export function CssVariablesGenerator() {
  const { locale } = useI18n();
  const t = getCssVariablesGeneratorTranslations(locale);

  const [variables, setVariables] = useState<CssVariable[]>([
    { id: '1', name: '--primary-color', value: '#8b5cf6' },
  ]);
  const [scope, setScope] = useState<'root' | 'custom'>('root');
  const [customSelector, setCustomSelector] = useState('.theme');
  const [includeDarkMode, setIncludeDarkMode] = useState(false);

  const addVariable = () => {
    setVariables([...variables, { id: Date.now().toString(), name: '', value: '' }]);
  };

  const removeVariable = (id: string) => {
    if (variables.length > 1) {
      setVariables(variables.filter(v => v.id !== id));
    }
  };

  const updateVariable = (id: string, field: 'name' | 'value', value: string) => {
    setVariables(variables.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const loadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      const newVars = preset.variables.map((v, i) => ({
        id: Date.now().toString() + i,
        name: v.name,
        value: v.value,
      }));
      setVariables(newVars);
    }
  };

  const clearAll = () => {
    setVariables([{ id: '1', name: '', value: '' }]);
  };

  const generatedCss = useMemo(() => {
    const filteredVars = variables.filter(v => v.name && v.value);
    if (filteredVars.length === 0) return '';

    const selector = scope === 'root' ? ':root' : customSelector;
    let css = `${selector} {\n`;
    filteredVars.forEach(v => {
      const name = v.name.startsWith('--') ? v.name : `--${v.name}`;
      css += `  ${name}: ${v.value};\n`;
    });
    css += `}`;

    if (includeDarkMode) {
      css += `\n\n@media (prefers-color-scheme: dark) {\n`;
      css += `  ${selector} {\n`;
      filteredVars.forEach(v => {
        const name = v.name.startsWith('--') ? v.name : `--${v.name}`;
        css += `    ${name}: ${v.value}; /* TODO: dark mode value */\n`;
      });
      css += `  }\n`;
      css += `}`;
    }

    return css;
  }, [variables, scope, customSelector, includeDarkMode]);

  const generatedScss = useMemo(() => {
    const filteredVars = variables.filter(v => v.name && v.value);
    if (filteredVars.length === 0) return '';

    let scss = '// SCSS Variables\n';
    filteredVars.forEach(v => {
      const name = v.name.replace('--', '');
      scss += `$${name}: ${v.value};\n`;
    });
    return scss;
  }, [variables]);

  const generatedJson = useMemo(() => {
    const filteredVars = variables.filter(v => v.name && v.value);
    if (filteredVars.length === 0) return '';

    const obj: Record<string, string> = {};
    filteredVars.forEach(v => {
      obj[v.name] = v.value;
    });
    return JSON.stringify(obj, null, 2);
  }, [variables]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const presetLabels: Record<string, string> = {
    colors: t.presetColors,
    spacing: t.presetSpacing,
    typography: t.presetTypography,
    shadows: t.presetShadows,
    borders: t.presetBorders,
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.presets}</h3>
          <button onClick={clearAll} className="text-xs text-hub-accent hover:underline">
            {t.clearAll}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map(key => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {presetLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Scope */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-hub-muted">{t.scope}</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={scope === 'root'}
              onChange={() => setScope('root')}
              className="accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.scopeRoot}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={scope === 'custom'}
              onChange={() => setScope('custom')}
              className="accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.scopeCustom}</span>
          </label>
        </div>
        {scope === 'custom' && (
          <input
            type="text"
            value={customSelector}
            onChange={(e) => setCustomSelector(e.target.value)}
            placeholder={t.customSelectorPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDarkMode}
            onChange={(e) => setIncludeDarkMode(e.target.checked)}
            className="rounded border-hub-border bg-hub-darker accent-hub-accent"
          />
          <span className="text-sm text-hub-muted">{t.includeDarkMode}</span>
        </label>
      </div>

      {/* Variables Editor */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-hub-muted">{t.variables}</h3>

        {variables.map(variable => (
          <div key={variable.id} className="flex gap-2">
            <input
              type="text"
              value={variable.name}
              onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
              placeholder={t.namePlaceholder}
              className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
            />
            <input
              type="text"
              value={variable.value}
              onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
              placeholder={t.valuePlaceholder}
              className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
            />
            {variable.value && variable.value.startsWith('#') && (
              <input
                type="color"
                value={variable.value}
                onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
            )}
            <button
              onClick={() => removeVariable(variable.id)}
              className="px-3 py-2 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={addVariable}
          className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80"
        >
          {t.addVariable}
        </button>
      </div>

      {/* Generated CSS */}
      {generatedCss && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button onClick={() => handleCopy(generatedCss)} className="text-sm text-hub-accent hover:underline">
              {t.copyButton}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">{generatedCss}</code>
          </pre>
        </div>
      )}

      {/* Export Options */}
      {generatedCss && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.exportScss}</label>
              <button onClick={() => handleCopy(generatedScss)} className="text-xs text-hub-accent hover:underline">
                {t.copyButton}
              </button>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-32 overflow-auto">
              <code className="text-xs text-cyan-400 font-mono whitespace-pre">{generatedScss}</code>
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.exportJson}</label>
              <button onClick={() => handleCopy(generatedJson)} className="text-xs text-hub-accent hover:underline">
                {t.copyButton}
              </button>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-32 overflow-auto">
              <code className="text-xs text-yellow-400 font-mono whitespace-pre">{generatedJson}</code>
            </pre>
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
