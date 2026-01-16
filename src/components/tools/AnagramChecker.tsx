'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getAnagramCheckerTranslations } from '@/lib/i18n-anagram-checker';

const EXAMPLES = [
  ['listen', 'silent'],
  ['astronomer', 'moon starer'],
  ['the eyes', 'they see'],
  ['dormitory', 'dirty room'],
];

export function AnagramChecker() {
  const { locale } = useI18n();
  const t = getAnagramCheckerTranslations(locale);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(true);

  const result = useMemo(() => {
    if (!text1.trim() || !text2.trim()) {
      return null;
    }

    const normalize = (text: string): string => {
      let result = text;
      if (ignoreCase) result = result.toLowerCase();
      if (ignoreSpaces) result = result.replace(/\s+/g, '');
      // Keep only letters
      result = result.replace(/[^\p{L}]/gu, '');
      return result;
    };

    const getLetterCounts = (text: string): Map<string, number> => {
      const counts = new Map<string, number>();
      for (const char of text) {
        counts.set(char, (counts.get(char) || 0) + 1);
      }
      return counts;
    };

    const norm1 = normalize(text1);
    const norm2 = normalize(text2);

    const counts1 = getLetterCounts(norm1);
    const counts2 = getLetterCounts(norm2);

    const sorted1 = norm1.split('').sort().join('');
    const sorted2 = norm2.split('').sort().join('');

    const isAnagram = sorted1 === sorted2;

    // Find differences
    const missing: string[] = [];
    const extra: string[] = [];

    const allLetters = new Set([...counts1.keys(), ...counts2.keys()]);
    for (const letter of allLetters) {
      const count1 = counts1.get(letter) || 0;
      const count2 = counts2.get(letter) || 0;
      const diff = count1 - count2;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) missing.push(letter);
      } else if (diff < 0) {
        for (let i = 0; i < -diff; i++) extra.push(letter);
      }
    }

    return {
      isAnagram,
      norm1,
      norm2,
      counts1,
      counts2,
      missing,
      extra,
    };
  }, [text1, text2, ignoreSpaces, ignoreCase]);

  const handleClear = () => {
    setText1('');
    setText2('');
  };

  const handleExample = (ex: string[]) => {
    setText1(ex[0]);
    setText2(ex[1]);
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.text1Label}</label>
          <input
            type="text"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 text-lg text-white focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.text2Label}</label>
          <input
            type="text"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 text-lg text-white focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
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
          className={`p-6 rounded-lg border-2 ${
            result.isAnagram
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className={`text-2xl font-bold mb-4 text-center ${result.isAnagram ? 'text-green-400' : 'text-red-400'}`}>
            {result.isAnagram ? '✓ ' : '✗ '}
            {result.isAnagram ? t.isAnagram : t.notAnagram}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-hub-darker rounded-lg p-4">
              <div className="text-xs text-hub-muted mb-2">{t.text1Letters}: {result.norm1.length}</div>
              <div className="font-mono text-hub-accent text-lg tracking-wider break-all">
                {result.norm1.split('').sort().join('')}
              </div>
            </div>
            <div className="bg-hub-darker rounded-lg p-4">
              <div className="text-xs text-hub-muted mb-2">{t.text2Letters}: {result.norm2.length}</div>
              <div className="font-mono text-hub-accent text-lg tracking-wider break-all">
                {result.norm2.split('').sort().join('')}
              </div>
            </div>
          </div>

          {!result.isAnagram && (result.missing.length > 0 || result.extra.length > 0) && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {result.missing.length > 0 && (
                <div className="bg-hub-darker rounded-lg p-4">
                  <div className="text-xs text-red-400 mb-2">{t.missing} (in text 1, not in text 2):</div>
                  <div className="font-mono text-red-400 text-lg tracking-wider">
                    {result.missing.join(' ')}
                  </div>
                </div>
              )}
              {result.extra.length > 0 && (
                <div className="bg-hub-darker rounded-lg p-4">
                  <div className="text-xs text-yellow-400 mb-2">{t.extra} (in text 2, not in text 1):</div>
                  <div className="font-mono text-yellow-400 text-lg tracking-wider">
                    {result.extra.join(' ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.examples}</h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExample(example)}
              className="px-3 py-1.5 bg-hub-darker border border-hub-border rounded-lg text-sm text-white hover:border-hub-accent/50 transition-colors"
            >
              {example[0]} ↔ {example[1]}
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
