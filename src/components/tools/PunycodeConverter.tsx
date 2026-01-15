'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPunycodeTranslations } from '@/lib/i18n-punycode';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

// Punycode constants
const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = '-';

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
  delta += Math.floor(delta / numPoints);

  let k = 0;
  while (delta > Math.floor(((BASE - TMIN) * TMAX) / 2)) {
    delta = Math.floor(delta / (BASE - TMIN));
    k += BASE;
  }

  return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function encodeDigit(d: number): string {
  return String.fromCharCode(d + (d < 26 ? 97 : 22));
}

function decodeDigit(cp: number): number {
  if (cp >= 48 && cp <= 57) return cp - 22;
  if (cp >= 65 && cp <= 90) return cp - 65;
  if (cp >= 97 && cp <= 122) return cp - 97;
  return BASE;
}

function punycodeEncode(input: string): string {
  const output: string[] = [];
  const inputLength = input.length;

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  // Handle basic code points
  for (const char of input) {
    if (char.charCodeAt(0) < 128) {
      output.push(char);
    }
  }

  const basicLength = output.length;
  let handledCPCount = basicLength;

  if (basicLength > 0) {
    output.push(DELIMITER);
  }

  while (handledCPCount < inputLength) {
    let m = 0x7FFFFFFF;

    for (const char of input) {
      const cp = char.codePointAt(0) || 0;
      if (cp >= n && cp < m) {
        m = cp;
      }
    }

    delta += (m - n) * (handledCPCount + 1);
    n = m;

    for (const char of input) {
      const cp = char.codePointAt(0) || 0;

      if (cp < n) {
        delta++;
      }

      if (cp === n) {
        let q = delta;

        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;

          if (q < t) break;

          output.push(encodeDigit(t + ((q - t) % (BASE - t))));
          q = Math.floor((q - t) / (BASE - t));
        }

        output.push(encodeDigit(q));
        bias = adapt(delta, handledCPCount + 1, handledCPCount === basicLength);
        delta = 0;
        handledCPCount++;
      }
    }

    delta++;
    n++;
  }

  return output.join('');
}

function punycodeDecode(input: string): string {
  const output: number[] = [];
  const inputLength = input.length;

  let i = 0;
  let n = INITIAL_N;
  let bias = INITIAL_BIAS;

  let basic = input.lastIndexOf(DELIMITER);
  if (basic < 0) basic = 0;

  for (let j = 0; j < basic; j++) {
    output.push(input.charCodeAt(j));
  }

  let index = basic > 0 ? basic + 1 : 0;

  while (index < inputLength) {
    const oldi = i;
    let w = 1;

    for (let k = BASE; ; k += BASE) {
      if (index >= inputLength) throw new Error('Invalid input');

      const digit = decodeDigit(input.charCodeAt(index++));
      if (digit >= BASE) throw new Error('Invalid input');

      i += digit * w;

      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;

      if (digit < t) break;

      w *= BASE - t;
    }

    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);

    n += Math.floor(i / out);
    i %= out;

    output.splice(i, 0, n);
    i++;
  }

  return String.fromCodePoint(...output);
}

function toASCII(domain: string): string {
  return domain
    .split('.')
    .map(label => {
      if (/[^\x00-\x7F]/.test(label)) {
        return 'xn--' + punycodeEncode(label.toLowerCase());
      }
      return label;
    })
    .join('.');
}

function toUnicode(domain: string): string {
  return domain
    .split('.')
    .map(label => {
      if (label.startsWith('xn--')) {
        try {
          return punycodeDecode(label.slice(4));
        } catch {
          return label;
        }
      }
      return label;
    })
    .join('.');
}

export function PunycodeConverter() {
  const { locale } = useI18n();
  const t = getPunycodeTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = toASCII(input.trim());
      setOutput(encoded);
      toast.success(t.encodedSuccess);
    } catch (error) {
      toast.error('Encoding error: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const decoded = toUnicode(input.trim());
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidPunycode);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.encode}
        </button>
        <button
          onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.decode}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t.encodePlaceholder : t.decodePlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'encode' ? t.encodeButton : t.decodeButton}
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

          <div className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto break-all">
            {output || <span className="text-hub-muted">...</span>}
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-sm text-hub-muted mb-1">Unicode:</div>
            <div className="font-mono text-hub-accent">{t.example1Domain}</div>
            <div className="text-sm text-hub-muted mt-2 mb-1">Punycode:</div>
            <div className="font-mono text-white">{t.example1Punycode}</div>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-sm text-hub-muted mb-1">Unicode:</div>
            <div className="font-mono text-hub-accent">{t.example2Domain}</div>
            <div className="text-sm text-hub-muted mt-2 mb-1">Punycode:</div>
            <div className="font-mono text-white">{t.example2Punycode}</div>
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
