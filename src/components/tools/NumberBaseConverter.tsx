'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getNumberBaseTranslations } from '@/lib/i18n-number-base';
import toast from 'react-hot-toast';

type Base = 2 | 8 | 10 | 16;

const BASES: { value: Base; labelKey: 'binary' | 'octal' | 'decimal' | 'hexadecimal' }[] = [
  { value: 2, labelKey: 'binary' },
  { value: 8, labelKey: 'octal' },
  { value: 10, labelKey: 'decimal' },
  { value: 16, labelKey: 'hexadecimal' },
];

function isValidForBase(value: string, base: Base): boolean {
  if (!value) return true;
  const patterns: Record<Base, RegExp> = {
    2: /^[01]+$/i,
    8: /^[0-7]+$/i,
    10: /^[0-9]+$/i,
    16: /^[0-9a-f]+$/i,
  };
  return patterns[base].test(value);
}

function convertNumber(value: string, fromBase: Base, toBase: Base): string {
  if (!value) return '';
  try {
    const decimal = BigInt(`0${'box'[fromBase === 2 ? 0 : fromBase === 8 ? 1 : fromBase === 16 ? 2 : 3]}${fromBase === 10 ? '' : ''}${value}`);
    // Parse to decimal first
    const decimalValue = parseInt(value, fromBase);
    if (isNaN(decimalValue)) return '';
    // Convert to target base
    return decimalValue.toString(toBase).toUpperCase();
  } catch {
    return '';
  }
}

function convertToBigInt(value: string, fromBase: Base): bigint | null {
  if (!value) return null;
  try {
    if (fromBase === 10) {
      return BigInt(value);
    } else if (fromBase === 16) {
      return BigInt('0x' + value);
    } else if (fromBase === 8) {
      return BigInt('0o' + value);
    } else if (fromBase === 2) {
      return BigInt('0b' + value);
    }
    return null;
  } catch {
    return null;
  }
}

function bigIntToBase(value: bigint, base: Base): string {
  if (base === 10) return value.toString();
  if (base === 16) return value.toString(16).toUpperCase();
  if (base === 8) return value.toString(8);
  if (base === 2) return value.toString(2);
  return '';
}

export function NumberBaseConverter() {
  const { locale } = useI18n();
  const t = getNumberBaseTranslations(locale);

  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [toBase, setToBase] = useState<Base>(16);
  const [result, setResult] = useState('');
  const [allResults, setAllResults] = useState<Record<Base, string>>({ 2: '', 8: '', 10: '', 16: '' });

  useEffect(() => {
    if (!input) {
      setResult('');
      setAllResults({ 2: '', 8: '', 10: '', 16: '' });
      return;
    }

    if (!isValidForBase(input, fromBase)) {
      setResult('');
      setAllResults({ 2: '', 8: '', 10: '', 16: '' });
      return;
    }

    const bigIntValue = convertToBigInt(input, fromBase);
    if (bigIntValue === null) {
      setResult('');
      setAllResults({ 2: '', 8: '', 10: '', 16: '' });
      return;
    }

    setResult(bigIntToBase(bigIntValue, toBase));
    setAllResults({
      2: bigIntToBase(bigIntValue, 2),
      8: bigIntToBase(bigIntValue, 8),
      10: bigIntToBase(bigIntValue, 10),
      16: bigIntToBase(bigIntValue, 16),
    });
  }, [input, fromBase, toBase]);

  const handleInputChange = (value: string) => {
    // Remove spaces and convert to uppercase for hex
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    setInput(cleaned);
  };

  const handleSwap = () => {
    const temp = fromBase;
    setFromBase(toBase);
    setToBase(temp);
    if (result) {
      setInput(result);
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setAllResults({ 2: '', 8: '', 10: '', 16: '' });
  };

  const isValid = !input || isValidForBase(input, fromBase);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* From Base */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.fromBase}</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value) as Base)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent transition-colors"
            >
              {BASES.map(({ value, labelKey }) => (
                <option key={value} value={value}>{t[labelKey]}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center">
            <button
              onClick={handleSwap}
              className="px-4 py-3 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors"
              title={t.swapButton}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To Base */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.toBase}</label>
            <select
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value) as Base)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent transition-colors"
            >
              {BASES.map(({ value, labelKey }) => (
                <option key={value} value={value}>{t[labelKey]}</option>
              ))}
            </select>
          </div>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t.inputPlaceholder}
          className={`w-full bg-hub-darker border rounded-lg p-4 font-mono text-lg focus:outline-none focus:ring-1 transition-colors ${
            isValid
              ? 'border-hub-border focus:border-hub-accent focus:ring-hub-accent'
              : 'border-red-500 focus:border-red-500 focus:ring-red-500'
          }`}
        />

        {!isValid && (
          <p className="text-red-500 text-sm">{t.invalidInput}</p>
        )}

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Result Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.result}</h3>
          {result && (
            <button
              onClick={() => handleCopy(result)}
              className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
            >
              {t.copyButton}
            </button>
          )}
        </div>

        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xl break-all">
          {result || <span className="text-hub-muted">...</span>}
        </div>
      </div>

      {/* All Conversions */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.allConversions}</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {BASES.map(({ value, labelKey }) => (
            <div key={value} className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-hub-muted">{t[labelKey]}</span>
                {allResults[value] && (
                  <button
                    onClick={() => handleCopy(allResults[value])}
                    className="text-hub-accent hover:text-hub-accent-dim text-sm"
                  >
                    {t.copyButton}
                  </button>
                )}
              </div>
              <div className="font-mono text-lg break-all">
                {allResults[value] || <span className="text-hub-muted">-</span>}
              </div>
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
