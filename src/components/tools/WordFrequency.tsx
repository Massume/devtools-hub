'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getWordFrequencyTranslations } from '@/lib/i18n-word-frequency';
import toast from 'react-hot-toast';

const STOP_WORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which',
  'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'as', 'if', 'then', 'because',
]);

const STOP_WORDS_RU = new Set([
  'и', 'в', 'во', 'не', 'что', 'он', 'на', 'я', 'с', 'со', 'как', 'а', 'то', 'все',
  'она', 'так', 'его', 'но', 'да', 'ты', 'к', 'у', 'же', 'вы', 'за', 'бы', 'по',
  'только', 'её', 'мне', 'было', 'вот', 'от', 'меня', 'ещё', 'нет', 'о', 'из', 'ему',
  'теперь', 'когда', 'уже', 'вы', 'ни', 'быть', 'был', 'этот', 'до', 'них', 'для',
]);

interface WordEntry {
  word: string;
  count: number;
  percentage: number;
}

export function WordFrequency() {
  const { locale } = useI18n();
  const t = getWordFrequencyTranslations(locale);

  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(2);
  const [topCount, setTopCount] = useState(50);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [excludeCommon, setExcludeCommon] = useState(true);

  const results = useMemo((): { words: WordEntry[]; totalWords: number; uniqueWords: number } => {
    if (!input.trim()) {
      return { words: [], totalWords: 0, uniqueWords: 0 };
    }

    const stopWords = new Set([...STOP_WORDS_EN, ...STOP_WORDS_RU]);
    const wordRegex = /[\p{L}\p{N}]+/gu;
    const matches = input.match(wordRegex) || [];

    const wordCounts = new Map<string, number>();
    let totalWords = 0;

    for (const match of matches) {
      let word = caseSensitive ? match : match.toLowerCase();

      if (word.length < minLength) continue;
      if (excludeCommon && stopWords.has(word.toLowerCase())) continue;

      totalWords++;
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    const sortedWords: WordEntry[] = Array.from(wordCounts.entries())
      .map(([word, count]) => ({
        word,
        count,
        percentage: totalWords > 0 ? (count / totalWords) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topCount);

    return {
      words: sortedWords,
      totalWords,
      uniqueWords: wordCounts.size,
    };
  }, [input, minLength, topCount, caseSensitive, excludeCommon]);

  const handleCopy = async () => {
    const text = results.words
      .map((w, i) => `${i + 1}. ${w.word}: ${w.count} (${w.percentage.toFixed(1)}%)`)
      .join('\n');
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
  };

  const maxCount = results.words.length > 0 ? results.words[0].count : 1;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-40 bg-hub-darker border border-hub-border rounded-lg p-4 text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.minWordLength}</label>
            <input
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={20}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.topWords}</label>
            <select
              value={topCount}
              onChange={(e) => setTopCount(Number(e.target.value))}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.caseSensitive}
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={excludeCommon}
              onChange={(e) => setExcludeCommon(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.excludeCommon}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          disabled={results.words.length === 0}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      {results.totalWords > 0 && (
        <div className="flex gap-6 text-sm">
          <span className="text-hub-muted">
            {t.totalWords}: <span className="text-hub-accent font-medium">{results.totalWords}</span>
          </span>
          <span className="text-hub-muted">
            {t.uniqueWords}: <span className="text-hub-accent font-medium">{results.uniqueWords}</span>
          </span>
        </div>
      )}

      {/* Results */}
      {results.words.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-hub-border">
            <h3 className="text-lg font-semibold text-white">{t.resultsTitle}</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-hub-darker sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-sm text-hub-muted font-medium">#</th>
                  <th className="text-left px-4 py-2 text-sm text-hub-muted font-medium">{t.word}</th>
                  <th className="text-right px-4 py-2 text-sm text-hub-muted font-medium">{t.count}</th>
                  <th className="text-right px-4 py-2 text-sm text-hub-muted font-medium">{t.percentage}</th>
                  <th className="px-4 py-2 w-1/3"></th>
                </tr>
              </thead>
              <tbody>
                {results.words.map((entry, index) => (
                  <tr key={entry.word} className="border-t border-hub-border hover:bg-hub-darker/50">
                    <td className="px-4 py-2 text-sm text-hub-muted">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-white font-mono">{entry.word}</td>
                    <td className="px-4 py-2 text-sm text-white text-right">{entry.count}</td>
                    <td className="px-4 py-2 text-sm text-hub-muted text-right">{entry.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-2">
                      <div className="h-2 bg-hub-darker rounded-full overflow-hidden">
                        <div
                          className="h-full bg-hub-accent rounded-full"
                          style={{ width: `${(entry.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
