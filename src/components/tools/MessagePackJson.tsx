'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMessagepackTranslations } from '@/lib/i18n-messagepack';
import toast from 'react-hot-toast';
import { encode, decode } from '@msgpack/msgpack';

type Mode = 'encode' | 'decode';
type OutputFormat = 'base64' | 'hex';

interface SizeInfo {
  jsonSize: number;
  msgpackSize: number;
  savings: number;
  savingsPercent: number;
}

const EXAMPLES = {
  simple: { name: 'John Doe', age: 30, active: true },
  array: [1, 2, 3, 'hello', true, null],
  nested: {
    user: { id: 1, name: 'Alice' },
    items: [{ id: 1, qty: 5 }, { id: 2, qty: 3 }],
    metadata: { created: '2024-01-15', version: '1.0' },
  },
  types: {
    string: 'hello world',
    number: 42,
    float: 3.14159,
    boolean: true,
    null: null,
    array: [1, 2, 3],
    object: { key: 'value' },
  },
};

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function MessagePackJson() {
  const { locale } = useI18n();
  const t = getMessagepackTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('base64');
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);

  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const data = JSON.parse(input);
      const encoded = encode(data);

      const result =
        outputFormat === 'base64'
          ? arrayBufferToBase64(encoded)
          : arrayBufferToHex(encoded);

      setOutput(result);

      // Calculate size comparison
      const jsonSize = new TextEncoder().encode(JSON.stringify(data)).length;
      const msgpackSize = encoded.length;
      const savings = jsonSize - msgpackSize;
      const savingsPercent = Math.round((savings / jsonSize) * 100);

      setSizeInfo({ jsonSize, msgpackSize, savings, savingsPercent });
      toast.success(t.encodedSuccess);
    } catch {
      toast.error(t.invalidJson);
    }
  }, [input, outputFormat, t]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      let bytes: Uint8Array;

      // Auto-detect format
      const cleanInput = input.trim().replace(/\s/g, '');
      if (/^[0-9a-fA-F]+$/.test(cleanInput) && cleanInput.length % 2 === 0) {
        bytes = hexToArrayBuffer(cleanInput);
      } else {
        bytes = base64ToArrayBuffer(cleanInput);
      }

      const decoded = decode(bytes);
      const result = JSON.stringify(decoded, null, 2);

      setOutput(result);
      setSizeInfo(null);
      toast.success(t.decodedSuccess);
    } catch {
      toast.error(t.invalidMsgpack);
    }
  }, [input, t]);

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
    setSizeInfo(null);
  };

  const handleFormatJson = () => {
    try {
      const data = JSON.parse(input);
      setInput(JSON.stringify(data, null, 2));
    } catch {
      toast.error(t.invalidJson);
    }
  };

  const loadExample = (key: keyof typeof EXAMPLES) => {
    setInput(JSON.stringify(EXAMPLES[key], null, 2));
    setMode('encode');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('encode');
              setOutput('');
              setSizeInfo(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'encode'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.jsonToMsgpack}
          </button>
          <button
            onClick={() => {
              setMode('decode');
              setOutput('');
              setSizeInfo(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'decode'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.msgpackToJson}
          </button>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.inputLabel}</h3>
            {mode === 'encode' && (
              <button
                onClick={handleFormatJson}
                className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
              >
                {t.formatJsonButton}
              </button>
            )}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t.jsonPlaceholder : t.msgpackPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          {mode === 'encode' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-hub-muted">{t.outputFormat}:</span>
              <div className="flex gap-2">
                {(['base64', 'hex'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      outputFormat === fmt
                        ? 'bg-hub-accent text-hub-darker'
                        : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
                    }`}
                  >
                    {t[fmt]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={mode === 'encode' ? handleEncode : handleDecode}
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

        {/* Output */}
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

          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="..."
          />

          {/* Size Comparison */}
          {sizeInfo && (
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-hub-muted mb-3">{t.sizeComparison}</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{sizeInfo.jsonSize}</div>
                  <div className="text-xs text-hub-muted">{t.jsonSize} ({t.bytes})</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-hub-accent">{sizeInfo.msgpackSize}</div>
                  <div className="text-xs text-hub-muted">{t.msgpackSize} ({t.bytes})</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${sizeInfo.savings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sizeInfo.savings > 0 ? '-' : '+'}{Math.abs(sizeInfo.savingsPercent)}%
                  </div>
                  <div className="text-xs text-hub-muted">{t.savings}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'simple', label: t.exampleSimple },
            { key: 'array', label: t.exampleArray },
            { key: 'nested', label: t.exampleNested },
            { key: 'types', label: t.exampleTypes },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => loadExample(key as keyof typeof EXAMPLES)}
              className="px-4 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
            >
              {label}
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
