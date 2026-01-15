'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBase32Translations } from '@/lib/i18n-base32';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let result = '';
  let buffer = 0;
  let bitsInBuffer = 0;

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bitsInBuffer += 8;

    while (bitsInBuffer >= 5) {
      bitsInBuffer -= 5;
      result += BASE32_ALPHABET[(buffer >> bitsInBuffer) & 0x1f];
    }
  }

  if (bitsInBuffer > 0) {
    result += BASE32_ALPHABET[(buffer << (5 - bitsInBuffer)) & 0x1f];
  }

  // Add padding
  while (result.length % 8 !== 0) {
    result += '=';
  }

  return result;
}

function base32Decode(input: string): string {
  const cleanInput = input.replace(/=+$/, '').toUpperCase();
  const bytes: number[] = [];
  let buffer = 0;
  let bitsInBuffer = 0;

  for (const char of cleanInput) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value === -1) {
      throw new Error('Invalid Base32 character: ' + char);
    }

    buffer = (buffer << 5) | value;
    bitsInBuffer += 5;

    if (bitsInBuffer >= 8) {
      bitsInBuffer -= 8;
      bytes.push((buffer >> bitsInBuffer) & 0xff);
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function Base32Converter() {
  const { locale } = useI18n();
  const t = getBase32Translations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = base32Encode(input);
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
      const decoded = base32Decode(input.trim());
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidBase32);
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
