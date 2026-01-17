'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCaesarCipherTranslations } from '@/lib/i18n-caesar-cipher';
import toast from 'react-hot-toast';

function caesarShift(
  text: string,
  shift: number,
  preserveCase: boolean,
  includeNumbers: boolean
): string {
  return text
    .split('')
    .map((char) => {
      // Handle uppercase letters
      if (char >= 'A' && char <= 'Z') {
        const shifted = ((char.charCodeAt(0) - 65 + shift + 26) % 26) + 65;
        return preserveCase ? String.fromCharCode(shifted) : String.fromCharCode(shifted).toLowerCase();
      }

      // Handle lowercase letters
      if (char >= 'a' && char <= 'z') {
        const shifted = ((char.charCodeAt(0) - 97 + shift + 26) % 26) + 97;
        return preserveCase ? String.fromCharCode(shifted) : String.fromCharCode(shifted).toUpperCase();
      }

      // Handle numbers if enabled
      if (includeNumbers && char >= '0' && char <= '9') {
        const shifted = ((char.charCodeAt(0) - 48 + shift + 10) % 10) + 48;
        return String.fromCharCode(shifted);
      }

      // Keep other characters unchanged
      return char;
    })
    .join('');
}

export function CaesarCipher() {
  const { locale } = useI18n();
  const t = getCaesarCipherTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [preserveCase, setPreserveCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [showBruteForce, setShowBruteForce] = useState(false);

  const bruteForceResults = useMemo(() => {
    if (!input) return [];
    return Array.from({ length: 25 }, (_, i) => ({
      shift: i + 1,
      result: caesarShift(input, -(i + 1), preserveCase, includeNumbers),
    }));
  }, [input, preserveCase, includeNumbers]);

  const handleEncrypt = () => {
    const result = caesarShift(input, shift, preserveCase, includeNumbers);
    setOutput(result);
    setShowBruteForce(false);
  };

  const handleDecrypt = () => {
    const result = caesarShift(input, -shift, preserveCase, includeNumbers);
    setOutput(result);
    setShowBruteForce(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setShowBruteForce(false);
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-500">⚠️ {t.warningInsecure}</p>
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

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.shift}</label>
            <input
              type="number"
              value={shift}
              onChange={(e) => setShift(Math.max(1, Math.min(25, parseInt(e.target.value) || 1)))}
              min={1}
              max={25}
              className="w-24 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={preserveCase}
              onChange={(e) => setPreserveCase(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.preserveCase}
          </label>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.includeNumbers}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEncrypt}
          disabled={!input}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.encryptButton}
        </button>
        <button
          onClick={handleDecrypt}
          disabled={!input}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.decryptButton}
        </button>
        <button
          onClick={() => setShowBruteForce(!showBruteForce)}
          disabled={!input}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.bruteForceButton}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Output */}
      {output && !showBruteForce && (
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
            className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
      )}

      {/* Brute Force Results */}
      {showBruteForce && input && (
        <div>
          <h3 className="text-sm font-medium text-hub-muted mb-2">{t.bruteForceTitle}</h3>
          <p className="text-xs text-hub-muted mb-3">{t.bruteForceDesc}</p>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {bruteForceResults.map(({ shift: s, result }) => (
              <div
                key={s}
                className="bg-hub-darker border border-hub-border rounded-lg p-3 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-hub-accent mr-2">Shift {s}:</span>
                  <span className="font-mono text-sm text-white break-all">{result}</span>
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(result);
                    toast.success(t.copied);
                  }}
                  className="px-2 py-1 text-xs bg-hub-card border border-hub-border text-white rounded hover:border-hub-accent/50 transition-colors flex-shrink-0"
                >
                  {t.copyButton}
                </button>
              </div>
            ))}
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
