'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDuplicateFinderTranslations } from '@/lib/i18n-duplicate-finder';
import toast from 'react-hot-toast';

type Mode = 'lines' | 'words';

interface DuplicateEntry {
  item: string;
  count: number;
}

export function DuplicateFinder() {
  const { locale } = useI18n();
  const t = getDuplicateFinderTranslations(locale);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('lines');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const results = useMemo(() => {
    if (!input.trim()) {
      return null;
    }

    let items: string[];

    if (mode === 'lines') {
      items = input.split('\n');
      if (trimWhitespace) {
        items = items.map(line => line.trim());
      }
      items = items.filter(line => line.length > 0);
    } else {
      items = input.match(/[\p{L}\p{N}]+/gu) || [];
    }

    const counts = new Map<string, number>();

    for (const item of items) {
      const key = caseSensitive ? item : item.toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const duplicates: DuplicateEntry[] = [];
    const seen = new Set<string>();

    for (const item of items) {
      const key = caseSensitive ? item : item.toLowerCase();
      if (!seen.has(key)) {
        const count = counts.get(key) || 0;
        if (count > 1) {
          duplicates.push({ item, count });
        }
        seen.add(key);
      }
    }

    duplicates.sort((a, b) => b.count - a.count);

    const totalItems = items.length;
    const uniqueItems = counts.size;
    const duplicateCount = duplicates.reduce((sum, d) => sum + (d.count - 1), 0);

    return {
      duplicates,
      totalItems,
      uniqueItems,
      duplicateCount,
      items,
    };
  }, [input, mode, caseSensitive, trimWhitespace]);

  const handleRemoveDuplicates = () => {
    if (!results) return;

    const seen = new Set<string>();
    const unique: string[] = [];

    for (const item of results.items) {
      const key = caseSensitive ? item : item.toLowerCase();
      if (!seen.has(key)) {
        unique.push(item);
        seen.add(key);
      }
    }

    if (mode === 'lines') {
      setInput(unique.join('\n'));
    } else {
      setInput(unique.join(' '));
    }

    toast.success(t.noDuplicates);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(input);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('lines')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'lines'
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
          }`}
        >
          {t.modeLines}
        </button>
        <button
          onClick={() => setMode('words')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'words'
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
          }`}
        >
          {t.modeWords}
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.caseSensitive}
          </label>
          {mode === 'lines' && (
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              {t.trimWhitespace}
            </label>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRemoveDuplicates}
          disabled={!results || results.duplicates.length === 0}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.removeButton}
        </button>
        <button
          onClick={handleCopy}
          disabled={!input.trim()}
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

      {/* Stats */}
      {results && (
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="text-hub-muted">
            {t.totalItems}: <span className="text-white font-medium">{results.totalItems}</span>
          </span>
          <span className="text-hub-muted">
            {t.uniqueItems}: <span className="text-white font-medium">{results.uniqueItems}</span>
          </span>
          <span className="text-hub-muted">
            {t.duplicateCount}: <span className="text-hub-accent font-medium">{results.duplicateCount}</span>
          </span>
        </div>
      )}

      {/* Results */}
      {results && results.duplicates.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-hub-border">
            <h3 className="text-lg font-semibold text-white">{t.resultsTitle}</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-hub-darker sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-sm text-hub-muted font-medium">{t.item}</th>
                  <th className="text-right px-4 py-2 text-sm text-hub-muted font-medium">{t.occurrences}</th>
                </tr>
              </thead>
              <tbody>
                {results.duplicates.map((entry, index) => (
                  <tr key={index} className="border-t border-hub-border hover:bg-hub-darker/50">
                    <td className="px-4 py-2 text-sm text-white font-mono">{entry.item}</td>
                    <td className="px-4 py-2 text-sm text-hub-accent text-right font-medium">{entry.count}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results && results.duplicates.length === 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
          <span className="text-green-400 font-medium">✓ {t.noDuplicates}</span>
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
