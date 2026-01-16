'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPasswordGeneratorTranslations } from '@/lib/i18n-password-generator';
import toast from 'react-hot-toast';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = '0O1lI';
const SIMILAR_BRACKETS = '(){}[]<>';

export function PasswordGenerator() {
  const { locale } = useI18n();
  const t = getPasswordGeneratorTranslations(locale);

  const [length, setLength] = useState(16);
  const [quantity, setQuantity] = useState(5);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customExclude, setCustomExclude] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (useUppercase) charset += UPPERCASE;
    if (useLowercase) charset += LOWERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (excludeAmbiguous) {
      for (const char of AMBIGUOUS) {
        charset = charset.replace(new RegExp(char, 'g'), '');
      }
    }

    if (excludeSimilar) {
      for (const char of SIMILAR_BRACKETS) {
        charset = charset.replace(new RegExp('\\' + char, 'g'), '');
      }
    }

    if (customExclude) {
      for (const char of customExclude) {
        charset = charset.replace(new RegExp('\\' + char, 'g'), '');
      }
    }

    if (charset.length === 0) {
      charset = LOWERCASE;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }

    return password;
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeAmbiguous, excludeSimilar, customExclude]);

  const handleGenerate = () => {
    const newPasswords = [];
    for (let i = 0; i < quantity; i++) {
      newPasswords.push(generatePassword());
    }
    setPasswords(newPasswords);
  };

  const handleCopy = async (password: string) => {
    await navigator.clipboard.writeText(password);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(passwords.join('\n'));
    toast.success(t.copiedAll);
  };

  const calculateEntropy = () => {
    let charsetSize = 0;
    if (useUppercase) charsetSize += 26;
    if (useLowercase) charsetSize += 26;
    if (useNumbers) charsetSize += 10;
    if (useSymbols) charsetSize += SYMBOLS.length;
    if (excludeAmbiguous) charsetSize -= 5;

    return Math.round(Math.log2(Math.pow(charsetSize, length)));
  };

  const getStrength = (entropy: number) => {
    if (entropy < 28) return { label: t.strengthWeak, color: 'text-red-400', width: '20%' };
    if (entropy < 36) return { label: t.strengthFair, color: 'text-orange-400', width: '40%' };
    if (entropy < 60) return { label: t.strengthGood, color: 'text-yellow-400', width: '60%' };
    if (entropy < 80) return { label: t.strengthStrong, color: 'text-green-400', width: '80%' };
    return { label: t.strengthVeryStrong, color: 'text-hub-accent', width: '100%' };
  };

  const entropy = calculateEntropy();
  const strength = getStrength(entropy);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        {/* Length and Quantity */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.length}: {length}</label>
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              min={4}
              max={128}
              className="w-full accent-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.quantity}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              min={1}
              max={50}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>

        {/* Character Types */}
        <div>
          <div className="text-sm text-hub-muted mb-2">{t.options}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.uppercase}
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.lowercase}
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.numbers}
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.symbols}
            </label>
          </div>
        </div>

        {/* Advanced */}
        <div>
          <div className="text-sm text-hub-muted mb-2">{t.advanced}</div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.excludeAmbiguous}
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} className="rounded border-hub-border bg-hub-darker accent-hub-accent" />
              {t.excludeSimilar}
            </label>
          </div>
        </div>

        {/* Strength Indicator */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-hub-muted">{t.strength}</span>
            <span className={strength.color}>{strength.label}</span>
          </div>
          <div className="h-2 bg-hub-darker rounded-full overflow-hidden">
            <div className={`h-full bg-hub-accent transition-all`} style={{ width: strength.width }} />
          </div>
          <div className="text-xs text-hub-muted mt-1">{t.entropy}: {entropy} {t.bits}</div>
        </div>
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
          onClick={handleCopyAll}
          disabled={passwords.length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyAll}
        </button>
      </div>

      {/* Generated Passwords */}
      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((password, index) => (
            <div
              key={index}
              onClick={() => handleCopy(password)}
              className="flex items-center justify-between bg-hub-darker border border-hub-border rounded-lg p-3 cursor-pointer hover:border-hub-accent/50 transition-colors group"
            >
              <code className="font-mono text-white break-all">{password}</code>
              <span className="text-xs text-hub-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                {t.copyButton}
              </span>
            </div>
          ))}
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
