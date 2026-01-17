'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getXorCipherTranslations } from '@/lib/i18n-xor-cipher';
import toast from 'react-hot-toast';

type KeyFormat = 'text' | 'hex' | 'base64';
type OutputFormat = 'text' | 'hex' | 'base64' | 'binary';

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function hexToBytes(hex: string): Uint8Array | null {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!/^[0-9a-fA-F]*$/.test(cleanHex) || cleanHex.length % 2 !== 0) {
    return null;
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function base64ToBytes(base64: string): Uint8Array | null {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function bytesToBinary(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
}

export function XorCipher() {
  const { locale } = useI18n();
  const t = getXorCipherTranslations(locale);

  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [keyFormat, setKeyFormat] = useState<KeyFormat>('text');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('hex');
  const [output, setOutput] = useState('');

  const keyBytes = useMemo(() => {
    if (!key) return null;
    switch (keyFormat) {
      case 'text':
        return textToBytes(key);
      case 'hex':
        return hexToBytes(key);
      case 'base64':
        return base64ToBytes(key);
      default:
        return null;
    }
  }, [key, keyFormat]);

  const handleProcess = () => {
    if (!key) {
      toast.error(t.keyRequired);
      return;
    }

    if (!keyBytes) {
      if (keyFormat === 'hex') {
        toast.error(t.invalidHex);
      } else if (keyFormat === 'base64') {
        toast.error(t.invalidBase64);
      }
      return;
    }

    // Detect if input is hex (starts with 0x or looks like hex)
    let inputBytes: Uint8Array;
    if (input.startsWith('0x') || /^[0-9a-fA-F]+$/.test(input.replace(/\s/g, ''))) {
      const hexInput = hexToBytes(input.replace(/\s/g, ''));
      inputBytes = hexInput || textToBytes(input);
    } else {
      inputBytes = textToBytes(input);
    }

    const resultBytes = xorBytes(inputBytes, keyBytes);

    switch (outputFormat) {
      case 'text':
        setOutput(bytesToText(resultBytes));
        break;
      case 'hex':
        setOutput('0x' + bytesToHex(resultBytes));
        break;
      case 'base64':
        setOutput(bytesToBase64(resultBytes));
        break;
      case 'binary':
        setOutput(bytesToBinary(resultBytes));
        break;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
    setKey('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-500">🔄 {t.warningSymmetric}</p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Key */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.keyLabel}</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={t.keyPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Key Format */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.keyFormatLabel}</label>
        <div className="flex gap-2">
          {(['text', 'hex', 'base64'] as KeyFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => setKeyFormat(format)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                keyFormat === format
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {format === 'text' ? t.formatText : format === 'hex' ? t.formatHex : t.formatBase64}
            </button>
          ))}
        </div>
      </div>

      {/* Key Visualization */}
      {keyBytes && keyBytes.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-2">{t.keyVisualization}</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-hub-muted">{t.keyHex}: </span>
              <span className="text-hub-accent font-mono">0x{bytesToHex(keyBytes)}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.keyLength}: </span>
              <span className="text-white">{keyBytes.length} {t.bytes}</span>
            </div>
          </div>
        </div>
      )}

      {/* Output Format */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.outputFormatLabel}</label>
        <div className="flex flex-wrap gap-2">
          {(['text', 'hex', 'base64', 'binary'] as OutputFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => setOutputFormat(format)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                outputFormat === format
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {format === 'text' ? t.outputText :
               format === 'hex' ? t.outputHex :
               format === 'base64' ? t.outputBase64 : t.outputBinary}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={!input}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.processButton}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Output */}
      {output && (
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
            className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 resize-none focus:outline-none"
          />
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
