'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getScientificNotationTranslations } from '@/lib/i18n-scientific-notation';
import toast from 'react-hot-toast';

type Mode = 'toScientific' | 'toStandard';

function toScientificNotation(numStr: string, precision: number): string {
  const num = parseFloat(numStr);
  if (isNaN(num)) return '';
  if (num === 0) return '0e+0';
  return num.toExponential(precision - 1);
}

function toStandardNumber(scientific: string): string {
  const num = parseFloat(scientific);
  if (isNaN(num)) return '';

  // Handle very large or small numbers
  if (Math.abs(num) >= 1e21 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
  }

  // For regular numbers, return full precision
  return num.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
}

const EXAMPLES = [
  { standard: '1000', scientific: '1e+3' },
  { standard: '0.001', scientific: '1e-3' },
  { standard: '123456789', scientific: '1.23456789e+8' },
  { standard: '0.00000001', scientific: '1e-8' },
];

export function ScientificNotation() {
  const { locale } = useI18n();
  const t = getScientificNotationTranslations(locale);

  const [mode, setMode] = useState<Mode>('toScientific');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [precision, setPrecision] = useState(6);

  const handleToScientific = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const result = toScientificNotation(input, precision);
    if (!result) {
      toast.error(t.invalidInput);
      return;
    }

    setOutput(result);
    toast.success(t.convertedSuccess);
  };

  const handleToStandard = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const result = toStandardNumber(input);
    if (!result) {
      toast.error(t.invalidInput);
      return;
    }

    setOutput(result);
    toast.success(t.convertedSuccess);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleProcess = () => {
    if (mode === 'toScientific') {
      handleToScientific();
    } else {
      handleToStandard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('toScientific'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'toScientific'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.toScientific}
        </button>
        <button
          onClick={() => { setMode('toStandard'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'toStandard'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.toStandard}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'toScientific' ? t.toScientificPlaceholder : t.toStandardPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          {mode === 'toScientific' && (
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">
                {t.precision} <span className="text-gray-500">({t.precisionHint})</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="flex-1 accent-hub-accent"
                />
                <span className="font-mono text-hub-accent w-8 text-center">{precision}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'toScientific' ? t.toScientificButton : t.toStandardButton}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.clearButton}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.outputLabel}</h3>
            {output && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                {t.copyButton}
              </button>
            )}
          </div>

          <div className="w-full min-h-20 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xl break-all flex items-center justify-center">
            {output || <span className="text-hub-muted text-lg">...</span>}
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EXAMPLES.map(({ standard, scientific }, index) => (
            <div key={index} className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">{standard}</div>
              <div className="text-hub-accent my-1">=</div>
              <div className="font-mono text-white">{scientific}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
