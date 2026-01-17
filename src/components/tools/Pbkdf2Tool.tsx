'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPbkdf2ToolTranslations } from '@/lib/i18n-pbkdf2-tool';
import toast from 'react-hot-toast';

type Algorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';
type OutputFormat = 'hex' | 'base64' | 'raw';

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

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function Pbkdf2Tool() {
  const { locale } = useI18n();
  const t = getPbkdf2ToolTranslations(locale);

  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [iterations, setIterations] = useState(100000);
  const [keyLength, setKeyLength] = useState(32);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('hex');
  const [derivedKey, setDerivedKey] = useState('');
  const [isDeriving, setIsDeriving] = useState(false);

  const generateSalt = () => {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    setSalt(bytesToHex(saltBytes));
  };

  const handleDerive = async () => {
    if (!password || !salt) return;

    setIsDeriving(true);
    try {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = hexToBytes(salt);

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer.buffer as ArrayBuffer,
          iterations: iterations,
          hash: algorithm,
        },
        keyMaterial,
        keyLength * 8
      );

      const keyBytes = new Uint8Array(derivedBits);
      let output: string;

      switch (outputFormat) {
        case 'hex':
          output = bytesToHex(keyBytes);
          break;
        case 'base64':
          output = bytesToBase64(keyBytes);
          break;
        case 'raw':
          output = Array.from(keyBytes).join(' ');
          break;
        default:
          output = bytesToHex(keyBytes);
      }

      setDerivedKey(output);
    } catch (error) {
      toast.error('Key derivation failed');
      console.error(error);
    } finally {
      setIsDeriving(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const presets = [
    { label: t.presetAes128, length: 16 },
    { label: t.presetAes256, length: 32 },
    { label: t.presetHmac, length: 64 },
  ];

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔐 {t.securityNote}</p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.passwordLabel}</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Salt Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.saltLabel}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            placeholder={t.saltPlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <button
            onClick={generateSalt}
            className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors whitespace-nowrap"
          >
            {t.generateSalt}
          </button>
        </div>
        <p className="text-xs text-hub-muted mt-1">{t.saltInfo}</p>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.algorithmLabel}</label>
        <div className="flex gap-2">
          {(['SHA-256', 'SHA-384', 'SHA-512'] as Algorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                algorithm === algo
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Iterations */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.iterationsLabel}</label>
          <span className="text-hub-accent font-mono">{iterations.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={10000}
          max={1000000}
          step={10000}
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
          className="w-full accent-hub-accent"
        />
        <p className="text-xs text-hub-muted mt-1">{t.iterationsHelp}</p>
      </div>

      {/* Key Length Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.length}
              onClick={() => setKeyLength(preset.length)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                keyLength === preset.length
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Length Slider */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.keyLengthLabel}</label>
          <span className="text-hub-accent font-mono">{keyLength} {t.bytes} ({keyLength * 8} {t.bits})</span>
        </div>
        <input
          type="range"
          min={16}
          max={128}
          step={8}
          value={keyLength}
          onChange={(e) => setKeyLength(parseInt(e.target.value))}
          className="w-full accent-hub-accent"
        />
      </div>

      {/* Output Format */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.outputFormatLabel}</label>
        <div className="flex gap-2">
          {([
            { value: 'hex', label: t.formatHex },
            { value: 'base64', label: t.formatBase64 },
            { value: 'raw', label: t.formatRaw },
          ] as { value: OutputFormat; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setOutputFormat(opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                outputFormat === opt.value
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Derive Button */}
      <button
        onClick={handleDerive}
        disabled={!password || !salt || isDeriving}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeriving ? t.deriving : t.deriveButton}
      </button>

      {/* Derived Key Output */}
      {derivedKey && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
            <button
              onClick={() => handleCopy(derivedKey)}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 break-all">
            {derivedKey}
          </div>

          {/* Key Info */}
          <div className="mt-4 bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-hub-muted mb-3">{t.keyInfo}</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-hub-muted">{t.algorithm}: </span>
                <span className="text-white font-mono">{algorithm}</span>
              </div>
              <div>
                <span className="text-hub-muted">{t.iterations}: </span>
                <span className="text-white font-mono">{iterations.toLocaleString()}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-hub-muted">{t.saltHex}: </span>
                <span className="text-white font-mono text-xs">{salt}</span>
              </div>
              <div>
                <span className="text-hub-muted">{t.keyLength}: </span>
                <span className="text-white font-mono">{keyLength} {t.bytes}</span>
              </div>
            </div>
          </div>
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
