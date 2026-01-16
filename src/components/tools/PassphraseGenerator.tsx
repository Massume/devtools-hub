'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPassphraseGeneratorTranslations } from '@/lib/i18n-passphrase-generator';
import { generatePassphrase, calculatePassphraseEntropy, estimateCrackTime, PassphraseSeparator } from '@/lib/generators/wordlist';
import toast from 'react-hot-toast';

export function PassphraseGenerator() {
  const { locale } = useI18n();
  const t = getPassphraseGeneratorTranslations(locale);

  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState<PassphraseSeparator>('-');
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [quantity, setQuantity] = useState(5);
  const [passphrases, setPassphrases] = useState<string[]>([]);

  const separatorOptions: { value: PassphraseSeparator; label: string }[] = [
    { value: '-', label: t.separatorDash },
    { value: '_', label: t.separatorUnderscore },
    { value: '.', label: t.separatorDot },
    { value: ' ', label: t.separatorSpace },
    { value: '', label: t.separatorNone },
  ];

  const handleGenerate = () => {
    const newPassphrases = [];
    for (let i = 0; i < quantity; i++) {
      newPassphrases.push(generatePassphrase(wordCount, separator, capitalize, includeNumber));
    }
    setPassphrases(newPassphrases);
  };

  const handleCopy = async (passphrase: string) => {
    await navigator.clipboard.writeText(passphrase);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(passphrases.join('\n'));
    toast.success(t.copiedAll);
  };

  const entropy = calculatePassphraseEntropy(wordCount, undefined, includeNumber);
  const crackTime = estimateCrackTime(entropy);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.wordCount}: {wordCount}</label>
            <input
              type="range"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              min={3}
              max={10}
              className="w-full accent-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.separator}</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as PassphraseSeparator)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              {separatorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.quantity}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              min={1}
              max={20}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={capitalize}
              onChange={(e) => setCapitalize(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.capitalize}
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumber}
              onChange={(e) => setIncludeNumber(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.includeNumber}
          </label>
        </div>

        {/* Entropy Info */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-hub-muted">{t.entropy}: </span>
            <span className="text-hub-accent font-medium">{entropy} {t.bits}</span>
          </div>
          <div>
            <span className="text-hub-muted">{t.crackTime}: </span>
            <span className="text-hub-accent font-medium">{crackTime}</span>
          </div>
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
          disabled={passphrases.length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyAll}
        </button>
      </div>

      {/* Generated Passphrases */}
      {passphrases.length > 0 && (
        <div className="space-y-2">
          {passphrases.map((passphrase, index) => (
            <div
              key={index}
              onClick={() => handleCopy(passphrase)}
              className="flex items-center justify-between bg-hub-darker border border-hub-border rounded-lg p-3 cursor-pointer hover:border-hub-accent/50 transition-colors group"
            >
              <code className="font-mono text-white break-all">{passphrase}</code>
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
