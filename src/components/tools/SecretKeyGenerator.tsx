'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getSecretKeyGeneratorTranslations } from '@/lib/i18n-secret-key-generator';
import toast from 'react-hot-toast';

type OutputFormat = 'hex' | 'base64' | 'base64url' | 'raw';

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

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function bytesToRaw(bytes: Uint8Array): string {
  return Array.from(bytes).join(' ');
}

function generateKey(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function formatKey(bytes: Uint8Array, format: OutputFormat, prefix: string): string {
  let formatted: string;
  switch (format) {
    case 'hex':
      formatted = bytesToHex(bytes);
      break;
    case 'base64':
      formatted = bytesToBase64(bytes);
      break;
    case 'base64url':
      formatted = bytesToBase64Url(bytes);
      break;
    case 'raw':
      formatted = bytesToRaw(bytes);
      break;
    default:
      formatted = bytesToHex(bytes);
  }
  return prefix + formatted;
}

export function SecretKeyGenerator() {
  const { locale } = useI18n();
  const t = getSecretKeyGeneratorTranslations(locale);

  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<OutputFormat>('hex');
  const [prefix, setPrefix] = useState('');
  const [count, setCount] = useState(1);
  const [keys, setKeys] = useState<string[]>([]);

  const handleGenerate = () => {
    const generatedKeys: string[] = [];
    for (let i = 0; i < count; i++) {
      const bytes = generateKey(length);
      generatedKeys.push(formatKey(bytes, format, prefix));
    }
    setKeys(generatedKeys);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(keys.join('\n'));
    toast.success(t.copied);
  };

  const presets = [
    { label: t.preset128, value: 16 },
    { label: t.preset256, value: 32 },
    { label: t.preset512, value: 64 },
    { label: t.preset1024, value: 128 },
  ];

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔐 {t.securityNote}</p>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setLength(preset.value)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                length === preset.value
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Length */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.lengthLabel}</label>
          <span className="text-hub-accent font-mono">{length} {t.bytes} ({length * 8} {t.bits})</span>
        </div>
        <input
          type="range"
          min={8}
          max={256}
          step={8}
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full accent-hub-accent"
        />
        <div className="flex justify-between text-xs text-hub-muted mt-1">
          <span>8 {t.bytes}</span>
          <span>256 {t.bytes}</span>
        </div>
      </div>

      {/* Output Format */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.formatLabel}</label>
        <div className="flex flex-wrap gap-2">
          {([
            { value: 'hex', label: t.formatHex },
            { value: 'base64', label: t.formatBase64 },
            { value: 'base64url', label: t.formatBase64Url },
            { value: 'raw', label: t.formatRaw },
          ] as { value: OutputFormat; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                format === opt.value
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prefix */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.prefixLabel}</label>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder={t.prefixPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Count */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.countLabel}</label>
          <span className="text-hub-accent font-mono">{count}</span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-full accent-hub-accent"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
      >
        {count > 1 ? t.generateMultiple : t.generateButton}
      </button>

      {/* Output */}
      {keys.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">
              {keys.length > 1 ? t.outputLabelMultiple : t.outputLabel}
            </label>
            {keys.length > 1 && (
              <button
                onClick={handleCopyAll}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyAll}
              </button>
            )}
          </div>
          <div className="space-y-2">
            {keys.map((key, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-hub-darker border border-hub-border rounded-lg p-3"
              >
                <code className="flex-1 font-mono text-sm text-green-400 break-all">
                  {key}
                </code>
                <button
                  onClick={() => handleCopy(key)}
                  className="text-xs text-hub-accent hover:underline shrink-0"
                >
                  {t.copyButton}
                </button>
              </div>
            ))}
          </div>

          {/* Key Info */}
          {keys.length === 1 && (
            <div className="mt-4 bg-hub-card border border-hub-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-hub-muted mb-3">{t.keyInfo}</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-hub-muted">{t.entropy}: </span>
                  <span className="text-white font-mono">{length * 8} {t.bits}</span>
                </div>
                <div>
                  <span className="text-hub-muted">{t.length}: </span>
                  <span className="text-white font-mono">{keys[0].length} {t.characters}</span>
                </div>
              </div>
            </div>
          )}
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
