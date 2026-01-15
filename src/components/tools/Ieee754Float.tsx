'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getIeee754Translations } from '@/lib/i18n-ieee754';
import toast from 'react-hot-toast';

type Precision = 'float32' | 'float64';

interface FloatParts {
  sign: string;
  exponent: string;
  mantissa: string;
  hex: string;
  actualValue: string;
  exponentValue: number;
  bias: number;
}

function floatToIeee754(num: number, precision: Precision): FloatParts | null {
  const buffer = new ArrayBuffer(precision === 'float32' ? 4 : 8);
  const view = new DataView(buffer);

  if (precision === 'float32') {
    view.setFloat32(0, num, false);
    const bits = view.getUint32(0, false);
    const sign = (bits >>> 31).toString(2);
    const exponent = ((bits >>> 23) & 0xFF).toString(2).padStart(8, '0');
    const mantissa = (bits & 0x7FFFFF).toString(2).padStart(23, '0');
    const hex = bits.toString(16).toUpperCase().padStart(8, '0');
    const exponentValue = (bits >>> 23) & 0xFF;
    const bias = 127;

    return {
      sign,
      exponent,
      mantissa,
      hex,
      actualValue: num.toString(),
      exponentValue: exponentValue - bias,
      bias,
    };
  } else {
    view.setFloat64(0, num, false);
    const high = view.getUint32(0, false);
    const low = view.getUint32(4, false);

    const sign = (high >>> 31).toString(2);
    const exponent = ((high >>> 20) & 0x7FF).toString(2).padStart(11, '0');
    const mantissaHigh = (high & 0xFFFFF).toString(2).padStart(20, '0');
    const mantissaLow = low.toString(2).padStart(32, '0');
    const mantissa = mantissaHigh + mantissaLow;
    const hex = high.toString(16).toUpperCase().padStart(8, '0') + low.toString(16).toUpperCase().padStart(8, '0');
    const exponentValue = (high >>> 20) & 0x7FF;
    const bias = 1023;

    return {
      sign,
      exponent,
      mantissa,
      hex,
      actualValue: num.toString(),
      exponentValue: exponentValue - bias,
      bias,
    };
  }
}

function hexToFloat(hex: string, precision: Precision): number | null {
  try {
    const cleanHex = hex.replace(/^0x/i, '').replace(/\s/g, '');
    const expectedLength = precision === 'float32' ? 8 : 16;
    if (cleanHex.length !== expectedLength || !/^[0-9A-Fa-f]+$/.test(cleanHex)) {
      return null;
    }

    const buffer = new ArrayBuffer(precision === 'float32' ? 4 : 8);
    const view = new DataView(buffer);

    if (precision === 'float32') {
      view.setUint32(0, parseInt(cleanHex, 16), false);
      return view.getFloat32(0, false);
    } else {
      const high = parseInt(cleanHex.slice(0, 8), 16);
      const low = parseInt(cleanHex.slice(8, 16), 16);
      view.setUint32(0, high, false);
      view.setUint32(4, low, false);
      return view.getFloat64(0, false);
    }
  } catch {
    return null;
  }
}

const SPECIAL_VALUES_32 = [
  { name: 'positiveInfinity', value: Infinity },
  { name: 'negativeInfinity', value: -Infinity },
  { name: 'nan', value: NaN },
  { name: 'positiveZero', value: 0 },
  { name: 'negativeZero', value: -0 },
  { name: 'maxValue', value: 3.4028235e+38 },
  { name: 'minPositive', value: 1.175494e-38 },
];

export function Ieee754Float() {
  const { locale } = useI18n();
  const t = getIeee754Translations(locale);

  const [input, setInput] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [precision, setPrecision] = useState<Precision>('float32');
  const [result, setResult] = useState<FloatParts | null>(null);
  const [inputMode, setInputMode] = useState<'decimal' | 'hex'>('decimal');

  useEffect(() => {
    if (inputMode === 'decimal' && input) {
      const num = parseFloat(input);
      if (!isNaN(num) || input === 'Infinity' || input === '-Infinity' || input === 'NaN') {
        const value = input === 'Infinity' ? Infinity : input === '-Infinity' ? -Infinity : input === 'NaN' ? NaN : num;
        setResult(floatToIeee754(value, precision));
      } else {
        setResult(null);
      }
    } else if (inputMode === 'hex' && hexInput) {
      const num = hexToFloat(hexInput, precision);
      if (num !== null) {
        setResult(floatToIeee754(num, precision));
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [input, hexInput, precision, inputMode]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setHexInput('');
    setResult(null);
  };

  const handleSpecialValue = (value: number) => {
    if (Object.is(value, -0)) {
      setInput('-0');
    } else if (isNaN(value)) {
      setInput('NaN');
    } else if (value === Infinity) {
      setInput('Infinity');
    } else if (value === -Infinity) {
      setInput('-Infinity');
    } else {
      setInput(value.toString());
    }
    setInputMode('decimal');
  };

  const BitGroup = ({ bits, label, color }: { bits: string; label: string; color: string }) => (
    <div className="space-y-2">
      <div className="text-sm font-medium text-hub-muted">{label}</div>
      <div className={`flex flex-wrap gap-0.5 font-mono text-sm p-2 rounded border ${color}`}>
        {bits.split('').map((bit, i) => (
          <span
            key={i}
            className={`w-5 h-6 flex items-center justify-center rounded ${
              bit === '1' ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            {bit}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Precision Toggle */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setPrecision('float32'); setResult(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            precision === 'float32'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.float32}
        </button>
        <button
          onClick={() => { setPrecision('float64'); setResult(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            precision === 'float64'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.float64}
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setInputMode('decimal')}
            className={`text-sm font-medium ${inputMode === 'decimal' ? 'text-hub-accent' : 'text-hub-muted hover:text-white'}`}
          >
            {t.inputLabel}
          </button>
          <button
            onClick={() => setInputMode('hex')}
            className={`text-sm font-medium ${inputMode === 'hex' ? 'text-hub-accent' : 'text-hub-muted hover:text-white'}`}
          >
            {t.hexInput}
          </button>
        </div>

        {inputMode === 'decimal' ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />
        ) : (
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value.toUpperCase())}
            placeholder={t.hexPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />
        )}

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold">{t.binaryRepresentation}</h3>

          {/* Full binary */}
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm break-all">
            <span className="text-red-400">{result.sign}</span>
            <span className="text-yellow-400">{result.exponent}</span>
            <span className="text-green-400">{result.mantissa}</span>
          </div>

          {/* Bit Groups */}
          <div className="grid md:grid-cols-3 gap-4">
            <BitGroup bits={result.sign} label={t.sign} color="border-red-400/30 bg-red-400/5" />
            <BitGroup bits={result.exponent} label={t.exponent} color="border-yellow-400/30 bg-yellow-400/5" />
            <div className="md:col-span-1">
              <div className="text-sm font-medium text-hub-muted mb-2">{t.mantissa}</div>
              <div className="font-mono text-sm p-2 rounded border border-green-400/30 bg-green-400/5 break-all">
                {result.mantissa}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.signBit}</div>
              <div className="font-mono text-lg">
                {result.sign === '0' ? t.positive : t.negative}
              </div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.exponentValue}</div>
              <div className="font-mono text-lg">{result.exponentValue}</div>
              <div className="text-xs text-gray-500">{t.bias}: {result.bias}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.hexValue}</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">0x{result.hex}</span>
                <button
                  onClick={() => handleCopy('0x' + result.hex)}
                  className="text-hub-accent hover:text-hub-accent-dim text-xs"
                >
                  {t.copyButton}
                </button>
              </div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.actualValue}</div>
              <div className="font-mono text-lg break-all">{result.actualValue}</div>
            </div>
          </div>
        </div>
      )}

      {/* Special Values */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.specialValues}</h3>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_VALUES_32.map(({ name, value }) => (
            <button
              key={name}
              onClick={() => handleSpecialValue(value)}
              className="px-3 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm font-mono"
            >
              {t[name as keyof typeof t]}
            </button>
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
