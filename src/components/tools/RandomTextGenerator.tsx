'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRandomTextTranslations } from '@/lib/i18n-random-text';
import toast from 'react-hot-toast';

type TextType = 'letters' | 'numbers' | 'alphanumeric' | 'hex' | 'symbols';
type Separator = 'none' | 'newline' | 'comma' | 'space';

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  hex: '0123456789abcdef',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generateRandomString(charset: string, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[getSecureRandomInt(charset.length)];
  }
  return result;
}

export function RandomTextGenerator() {
  const { locale } = useI18n();
  const t = getRandomTextTranslations(locale);

  const [output, setOutput] = useState('');
  const [textType, setTextType] = useState<TextType>('alphanumeric');
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [separator, setSeparator] = useState<Separator>('newline');

  const handleGenerate = () => {
    let charset = '';

    switch (textType) {
      case 'letters':
        if (includeLowercase) charset += CHARSETS.lowercase;
        if (includeUppercase) charset += CHARSETS.uppercase;
        if (!charset) charset = CHARSETS.lowercase;
        break;
      case 'numbers':
        charset = CHARSETS.numbers;
        break;
      case 'alphanumeric':
        if (includeLowercase) charset += CHARSETS.lowercase;
        if (includeUppercase) charset += CHARSETS.uppercase;
        charset += CHARSETS.numbers;
        if (!includeLowercase && !includeUppercase) {
          charset = CHARSETS.lowercase + CHARSETS.numbers;
        }
        break;
      case 'hex':
        charset = CHARSETS.hex;
        break;
      case 'symbols':
        if (includeLowercase) charset += CHARSETS.lowercase;
        if (includeUppercase) charset += CHARSETS.uppercase;
        charset += CHARSETS.numbers + CHARSETS.symbols;
        if (!includeLowercase && !includeUppercase) {
          charset = CHARSETS.lowercase + CHARSETS.numbers + CHARSETS.symbols;
        }
        break;
    }

    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateRandomString(charset, length));
    }

    const separatorMap: Record<Separator, string> = {
      none: '',
      newline: '\n',
      comma: ', ',
      space: ' ',
    };

    setOutput(results.join(separatorMap[separator]));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.options}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Type */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.textType}</label>
            <select
              value={textType}
              onChange={(e) => setTextType(e.target.value as TextType)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="letters">{t.typeLetters}</option>
              <option value="numbers">{t.typeNumbers}</option>
              <option value="alphanumeric">{t.typeAlphanumeric}</option>
              <option value="hex">{t.typeHex}</option>
              <option value="symbols">{t.typeSymbols}</option>
            </select>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.length}</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
              min={1}
              max={1000}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.count}</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Separator */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.separator}</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as Separator)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="newline">{t.separatorNewline}</option>
              <option value="comma">{t.separatorComma}</option>
              <option value="space">{t.separatorSpace}</option>
              <option value="none">{t.separatorNone}</option>
            </select>
          </div>
        </div>

        {/* Case options */}
        {(textType === 'letters' || textType === 'alphanumeric' || textType === 'symbols') && (
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-hub-border">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              {t.uppercase}
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              {t.lowercase}
            </label>
          </div>
        )}
      </div>

      {/* Output */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
        <textarea
          value={output}
          readOnly
          placeholder={t.placeholder}
          className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.generateButton}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyButton}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

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
