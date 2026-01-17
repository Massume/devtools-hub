'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getApiKeyGeneratorTranslations } from '@/lib/i18n-api-key-generator';
import toast from 'react-hot-toast';

type KeyFormat = 'uuid' | 'hex' | 'base64' | 'alphanumeric' | 'custom';
type Separator = 'none' | 'dash' | 'underscore';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HEX_CHARS = '0123456789abcdef';

function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
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
  return btoa(binary).replace(/[+/=]/g, (c) => {
    if (c === '+') return '-';
    if (c === '/') return '_';
    return '';
  });
}

function generateUuidV4(): string {
  const bytes = generateRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytesToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateAlphanumeric(length: number): string {
  const bytes = generateRandomBytes(length);
  return Array.from(bytes)
    .map(b => ALPHANUMERIC[b % ALPHANUMERIC.length])
    .join('');
}

function generateFromPattern(pattern: string): string {
  const bytes = generateRandomBytes(pattern.length);
  let byteIndex = 0;
  return pattern
    .split('')
    .map((char) => {
      if (char === 'X' || char === 'x') {
        const byte = bytes[byteIndex++];
        return char === 'X'
          ? ALPHANUMERIC[byte % ALPHANUMERIC.length].toUpperCase()
          : ALPHANUMERIC[byte % ALPHANUMERIC.length].toLowerCase();
      }
      return char;
    })
    .join('');
}

function addSeparators(str: string, separator: string, segmentLength: number): string {
  if (!separator || segmentLength <= 0) return str;
  const segments: string[] = [];
  for (let i = 0; i < str.length; i += segmentLength) {
    segments.push(str.slice(i, i + segmentLength));
  }
  return segments.join(separator);
}

export function ApiKeyGenerator() {
  const { locale } = useI18n();
  const t = getApiKeyGeneratorTranslations(locale);

  const [format, setFormat] = useState<KeyFormat>('alphanumeric');
  const [length, setLength] = useState(32);
  const [prefix, setPrefix] = useState('');
  const [pattern, setPattern] = useState('XXXX-XXXX-XXXX-XXXX');
  const [separator, setSeparator] = useState<Separator>('none');
  const [segmentLength, setSegmentLength] = useState(4);
  const [count, setCount] = useState(1);
  const [keys, setKeys] = useState<string[]>([]);

  const generateKey = (): string => {
    let key: string;

    switch (format) {
      case 'uuid':
        key = generateUuidV4();
        break;
      case 'hex':
        key = bytesToHex(generateRandomBytes(Math.ceil(length / 2))).slice(0, length);
        break;
      case 'base64':
        key = bytesToBase64(generateRandomBytes(Math.ceil(length * 0.75))).slice(0, length);
        break;
      case 'alphanumeric':
        key = generateAlphanumeric(length);
        break;
      case 'custom':
        key = generateFromPattern(pattern);
        break;
      default:
        key = generateAlphanumeric(length);
    }

    // Add separators for non-uuid and non-custom formats
    if (format !== 'uuid' && format !== 'custom' && separator !== 'none') {
      const sep = separator === 'dash' ? '-' : '_';
      key = addSeparators(key, sep, segmentLength);
    }

    return prefix + key;
  };

  const handleGenerate = () => {
    const generatedKeys: string[] = [];
    for (let i = 0; i < count; i++) {
      generatedKeys.push(generateKey());
    }
    setKeys(generatedKeys);
  };

  const applyPreset = (preset: 'stripe' | 'aws' | 'github' | 'openai') => {
    switch (preset) {
      case 'stripe':
        setFormat('alphanumeric');
        setLength(24);
        setPrefix('sk_live_');
        setSeparator('none');
        break;
      case 'aws':
        setFormat('alphanumeric');
        setLength(20);
        setPrefix('AKIA');
        setSeparator('none');
        break;
      case 'github':
        setFormat('alphanumeric');
        setLength(40);
        setPrefix('ghp_');
        setSeparator('none');
        break;
      case 'openai':
        setFormat('alphanumeric');
        setLength(48);
        setPrefix('sk-');
        setSeparator('none');
        break;
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(keys.join('\n'));
    toast.success(t.copied);
  };

  const calculateEntropy = (): number => {
    if (format === 'uuid') return 122;
    if (format === 'hex') return length * 4;
    if (format === 'base64') return Math.floor(length * 6);
    if (format === 'alphanumeric') return Math.floor(length * 5.95);
    if (format === 'custom') {
      const xCount = (pattern.match(/[Xx]/g) || []).length;
      return Math.floor(xCount * 5.95);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">{t.securityNote}</p>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'stripe', label: t.presetStripe },
            { key: 'aws', label: t.presetAws },
            { key: 'github', label: t.presetGithub },
            { key: 'openai', label: t.presetOpenai },
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset.key as 'stripe' | 'aws' | 'github' | 'openai')}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.formatLabel}</label>
        <div className="flex flex-wrap gap-2">
          {([
            { value: 'uuid', label: t.formatUuid },
            { value: 'hex', label: t.formatHex },
            { value: 'base64', label: t.formatBase64 },
            { value: 'alphanumeric', label: t.formatAlphanumeric },
            { value: 'custom', label: t.formatCustom },
          ] as { value: KeyFormat; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
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

      {/* Length (not for UUID or Custom) */}
      {format !== 'uuid' && format !== 'custom' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.lengthLabel}</label>
            <span className="text-hub-accent font-mono">{length} {t.characters}</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-hub-accent"
          />
        </div>
      )}

      {/* Custom Pattern */}
      {format === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.patternLabel}</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t.patternPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.patternHelp}</p>
        </div>
      )}

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
        <p className="text-xs text-hub-muted mt-1">{t.prefixHelp}</p>
      </div>

      {/* Separators (not for UUID or Custom) */}
      {format !== 'uuid' && format !== 'custom' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <label className="block text-sm text-hub-muted mb-2">{t.separatorLabel}</label>
          <div className="flex gap-2 mb-3">
            {([
              { value: 'none', label: t.separatorNone },
              { value: 'dash', label: t.separatorDash },
              { value: 'underscore', label: t.separatorUnderscore },
            ] as { value: Separator; label: string }[]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSeparator(opt.value)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  separator === opt.value
                    ? 'bg-hub-accent text-hub-darker border-hub-accent'
                    : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {separator !== 'none' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-hub-muted">{t.segmentLabel}</label>
                <span className="text-hub-accent font-mono">{segmentLength}</span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                value={segmentLength}
                onChange={(e) => setSegmentLength(parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          )}
        </div>
      )}

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
                  <span className="text-hub-muted">{t.format}: </span>
                  <span className="text-white font-mono">{format.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-hub-muted">{t.entropy}: </span>
                  <span className="text-white font-mono">~{calculateEntropy()} {t.bits}</span>
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
