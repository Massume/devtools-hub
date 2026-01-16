'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPalindromeCheckerTranslations } from '@/lib/i18n-palindrome-checker';

export function PalindromeChecker() {
  const { locale } = useI18n();
  const t = getPalindromeCheckerTranslations(locale);

  const [input, setInput] = useState('');
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(true);

  const result = useMemo(() => {
    if (!input.trim()) {
      return null;
    }

    let normalized = input;

    if (ignoreCase) {
      normalized = normalized.toLowerCase();
    }

    if (ignorePunctuation) {
      normalized = normalized.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    if (ignoreSpaces) {
      normalized = normalized.replace(/\s+/g, '');
    }

    const reversed = normalized.split('').reverse().join('');
    const isPalindrome = normalized === reversed;

    return {
      isPalindrome,
      normalized,
      reversed,
    };
  }, [input, ignoreSpaces, ignorePunctuation, ignoreCase]);

  const handleClear = () => {
    setInput('');
  };

  const handleExample = (example: string) => {
    setInput(example);
  };

  const examples = [t.example1, t.example2, t.example3, t.example4];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 text-lg text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreSpaces}
              onChange={(e) => setIgnoreSpaces(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.ignoreSpaces}
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={ignorePunctuation}
              onChange={(e) => setIgnorePunctuation(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.ignorePunctuation}
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.ignoreCase}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`p-6 rounded-lg border-2 text-center ${
            result.isPalindrome
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className={`text-2xl font-bold mb-4 ${result.isPalindrome ? 'text-green-400' : 'text-red-400'}`}>
            {result.isPalindrome ? '✓ ' : '✗ '}
            {result.isPalindrome ? t.isPalindrome : t.notPalindrome}
          </div>

          <div className="space-y-4 text-left max-w-xl mx-auto">
            <div>
              <div className="text-xs text-hub-muted mb-1">{t.original}</div>
              <div className="font-mono text-white bg-hub-darker rounded p-2 break-all">{input}</div>
            </div>
            <div>
              <div className="text-xs text-hub-muted mb-1">{t.normalized}</div>
              <div className="font-mono text-hub-accent bg-hub-darker rounded p-2 break-all">{result.normalized}</div>
            </div>
            <div>
              <div className="text-xs text-hub-muted mb-1">{t.reversed}</div>
              <div className="font-mono text-hub-accent bg-hub-darker rounded p-2 break-all">{result.reversed}</div>
            </div>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.examples}</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExample(example)}
              className="px-3 py-1.5 bg-hub-darker border border-hub-border rounded-lg text-sm text-white hover:border-hub-accent/50 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
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
