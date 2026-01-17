'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsMinifierTranslations } from '@/lib/i18n-js-minifier';
import { minify } from 'terser';
import toast from 'react-hot-toast';

const SAMPLE_CODE = `// Sample JavaScript code
function calculateTotal(items) {
  // Initialize total
  let total = 0;

  // Loop through items
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const price = item.price * item.quantity;
    total += price;

    // Debug output
    console.log('Item:', item.name, 'Price:', price);
  }

  debugger;

  return total;
}

// Export function
export default calculateTotal;`;

interface MinifyOptions {
  compress: boolean;
  mangle: boolean;
  removeComments: boolean;
  removeConsole: boolean;
  removeDebugger: boolean;
}

export function JsMinifier() {
  const { locale } = useI18n();
  const t = getJsMinifierTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isMinifying, setIsMinifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<MinifyOptions>({
    compress: true,
    mangle: true,
    removeComments: true,
    removeConsole: false,
    removeDebugger: true,
  });

  const statistics = useMemo(() => {
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([output]).size;
    const saved = originalSize - minifiedSize;
    const ratio = originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : '0';

    return { originalSize, minifiedSize, saved, ratio };
  }, [input, output]);

  const handleMinify = async () => {
    if (!input.trim()) return;

    setIsMinifying(true);
    setError(null);

    try {
      const dropConsole = options.removeConsole ? ['console.*'] : [];
      const dropDebugger = options.removeDebugger;

      const result = await minify(input, {
        compress: options.compress ? {
          drop_console: options.removeConsole,
          drop_debugger: dropDebugger,
          pure_funcs: dropConsole,
        } : false,
        mangle: options.mangle,
        format: {
          comments: !options.removeComments,
        },
      });

      if (result.code) {
        setOutput(result.code);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      setError(errorMessage);
      setOutput('');
    } finally {
      setIsMinifying(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_CODE);
    setOutput('');
    setError(null);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const toggleOption = (key: keyof MinifyOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadSample}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.loadSample}
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'compress' as const, label: t.optionCompress },
            { key: 'mangle' as const, label: t.optionMangle },
            { key: 'removeComments' as const, label: t.optionRemoveComments },
            { key: 'removeConsole' as const, label: t.optionRemoveConsole },
            { key: 'removeDebugger' as const, label: t.optionRemoveDebugger },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={() => toggleOption(opt.key)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={12}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Minify Button */}
      <button
        onClick={handleMinify}
        disabled={!input.trim() || isMinifying}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMinifying ? t.minifying : t.minifyButton}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-400 mb-1">{t.error}</h4>
          <p className="text-sm text-red-300 font-mono">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <>
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
            <textarea
              value={output}
              readOnly
              rows={6}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-green-400 focus:outline-none resize-none"
            />
          </div>

          {/* Statistics */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-hub-muted mb-3">{t.statistics}</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-white">
                  {statistics.originalSize}
                </div>
                <div className="text-xs text-hub-muted">{t.originalSize} ({t.bytes})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-hub-accent">
                  {statistics.minifiedSize}
                </div>
                <div className="text-xs text-hub-muted">{t.minifiedSize} ({t.bytes})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-400">
                  -{statistics.saved}
                </div>
                <div className="text-xs text-hub-muted">{t.savedSize} ({t.bytes})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-cyan-400">
                  {statistics.ratio}%
                </div>
                <div className="text-xs text-hub-muted">{t.compressionRatio}</div>
              </div>
            </div>
          </div>
        </>
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
