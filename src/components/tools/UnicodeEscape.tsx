'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUnicodeEscapeTranslations } from '@/lib/i18n-unicode-escape';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

function toUnicodeEscape(text: string, escapeAll: boolean, uppercase: boolean): string {
  return Array.from(text)
    .map(char => {
      const code = char.codePointAt(0) || 0;

      // For characters outside BMP, use surrogate pairs
      if (code > 0xFFFF) {
        const highSurrogate = Math.floor((code - 0x10000) / 0x400) + 0xD800;
        const lowSurrogate = ((code - 0x10000) % 0x400) + 0xDC00;
        const format = uppercase ? 'X' : 'x';
        return `\\u${highSurrogate.toString(16).padStart(4, '0').toUpperCase()}\\u${lowSurrogate.toString(16).padStart(4, '0').toUpperCase()}`;
      }

      // Only escape non-ASCII or all characters based on option
      if (escapeAll || code > 127) {
        const hex = code.toString(16).padStart(4, '0');
        return `\\u${uppercase ? hex.toUpperCase() : hex.toLowerCase()}`;
      }

      return char;
    })
    .join('');
}

function fromUnicodeEscape(text: string): string {
  // Handle both \uXXXX and \\uXXXX formats
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

export function UnicodeEscape() {
  const { locale } = useI18n();
  const t = getUnicodeEscapeTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [escapeAll, setEscapeAll] = useState(false);
  const [uppercase, setUppercase] = useState(true);

  const handleEncode = () => {
    if (!input) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = toUnicodeEscape(input, escapeAll, uppercase);
      setOutput(encoded);
      toast.success(t.encodedSuccess);
    } catch (error) {
      toast.error('Encoding error: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const decoded = fromUnicodeEscape(input);
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidUnicode);
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

      {/* Encode Options */}
      {mode === 'encode' && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-hub-muted mb-3">{t.formatOptions}</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="escapeMode"
                  checked={!escapeAll}
                  onChange={() => setEscapeAll(false)}
                  className="w-4 h-4 border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
                />
                <span className="text-sm text-gray-300">{t.escapeNonAscii}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="escapeMode"
                  checked={escapeAll}
                  onChange={() => setEscapeAll(true)}
                  className="w-4 h-4 border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
                />
                <span className="text-sm text-gray-300">{t.escapeAll}</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="caseMode"
                  checked={uppercase}
                  onChange={() => setUppercase(true)}
                  className="w-4 h-4 border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
                />
                <span className="text-sm text-gray-300">{t.uppercase}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="caseMode"
                  checked={!uppercase}
                  onChange={() => setUppercase(false)}
                  className="w-4 h-4 border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
                />
                <span className="text-sm text-gray-300">{t.lowercase}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t.encodePlaceholder : t.decodePlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
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

          <div className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto break-all">
            {output || <span className="text-hub-muted">...</span>}
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
