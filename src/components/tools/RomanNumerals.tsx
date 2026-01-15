'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRomanNumeralsTranslations } from '@/lib/i18n-roman-numerals';
import toast from 'react-hot-toast';

type Mode = 'toRoman' | 'toDecimal';

const ROMAN_VALUES: [string, number][] = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
  ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
];

const ROMAN_MAP: Record<string, number> = {
  'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
};

function decimalToRoman(num: number): string {
  if (num < 1 || num > 3999) return '';
  let result = '';
  let remaining = num;

  for (const [roman, value] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += roman;
      remaining -= value;
    }
  }

  return result;
}

function romanToDecimal(roman: string): number | null {
  const upper = roman.toUpperCase().trim();
  if (!upper) return null;
  if (!/^[IVXLCDM]+$/.test(upper)) return null;

  let result = 0;
  let prevValue = 0;

  for (let i = upper.length - 1; i >= 0; i--) {
    const currentValue = ROMAN_MAP[upper[i]];
    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    prevValue = currentValue;
  }

  // Validate by converting back
  if (decimalToRoman(result) !== upper) {
    return null;
  }

  return result;
}

const BASIC_SYMBOLS = [
  { roman: 'I', decimal: 1 },
  { roman: 'V', decimal: 5 },
  { roman: 'X', decimal: 10 },
  { roman: 'L', decimal: 50 },
  { roman: 'C', decimal: 100 },
  { roman: 'D', decimal: 500 },
  { roman: 'M', decimal: 1000 },
];

const COMMON_EXAMPLES = [
  { roman: 'IV', decimal: 4 },
  { roman: 'IX', decimal: 9 },
  { roman: 'XL', decimal: 40 },
  { roman: 'XC', decimal: 90 },
  { roman: 'CD', decimal: 400 },
  { roman: 'CM', decimal: 900 },
  { roman: 'MMXXIV', decimal: 2024 },
  { roman: 'MCMLXXXIV', decimal: 1984 },
];

export function RomanNumerals() {
  const { locale } = useI18n();
  const t = getRomanNumeralsTranslations(locale);

  const [mode, setMode] = useState<Mode>('toRoman');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleToRoman = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const num = parseInt(input, 10);
    if (isNaN(num) || num < 1 || num > 3999) {
      toast.error(t.invalidNumber);
      return;
    }

    const roman = decimalToRoman(num);
    setOutput(roman);
    toast.success(t.convertedSuccess);
  };

  const handleToDecimal = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const decimal = romanToDecimal(input);
    if (decimal === null) {
      toast.error(t.invalidRoman);
      return;
    }

    setOutput(decimal.toString());
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
    if (mode === 'toRoman') {
      handleToRoman();
    } else {
      handleToDecimal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('toRoman'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'toRoman'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.toRoman}
        </button>
        <button
          onClick={() => { setMode('toDecimal'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'toDecimal'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.toDecimal}
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
            placeholder={mode === 'toRoman' ? t.toRomanPlaceholder : t.toDecimalPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xl text-center focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'toRoman' ? t.toRomanButton : t.toDecimalButton}
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

          <div className="w-full h-20 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-3xl flex items-center justify-center">
            {output || <span className="text-hub-muted text-lg">...</span>}
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.referenceTitle}</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.basicSymbols}</h4>
            <div className="grid grid-cols-7 gap-2">
              {BASIC_SYMBOLS.map(({ roman, decimal }) => (
                <div key={roman} className="bg-hub-darker border border-hub-border rounded p-3 text-center">
                  <div className="text-hub-accent font-bold text-xl">{roman}</div>
                  <div className="text-sm text-gray-400 mt-1">{decimal}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.commonExamples}</h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COMMON_EXAMPLES.map(({ roman, decimal }) => (
                <div key={roman} className="bg-hub-darker border border-hub-border rounded p-2 text-center">
                  <div className="text-hub-accent font-bold text-sm">{roman}</div>
                  <div className="text-xs text-gray-400 mt-1">{decimal}</div>
                </div>
              ))}
            </div>
          </div>
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
