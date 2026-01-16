'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getTextStatisticsTranslations } from '@/lib/i18n-text-statistics';
import { calculateStatistics, getWordFrequency } from '@/lib/text/statisticsUtils';

export function TextStatistics() {
  const { locale } = useI18n();
  const t = getTextStatisticsTranslations(locale);

  const [input, setInput] = useState('');
  const [showFrequency, setShowFrequency] = useState(false);

  const stats = useMemo(() => {
    if (!input) return null;
    return calculateStatistics(input);
  }, [input]);

  const wordFrequency = useMemo(() => {
    if (!input || !showFrequency) return null;
    return getWordFrequency(input, 20);
  }, [input, showFrequency]);

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)} ${t.seconds}`;
    }
    return `${minutes.toFixed(1)} ${t.minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.inputLabel}</label>
          <button
            onClick={() => setInput('')}
            className="text-sm text-hub-muted hover:text-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Statistics Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.characters}</div>
              <div className="text-xs text-hub-muted mt-1">{t.characters}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.charactersNoSpaces}</div>
              <div className="text-xs text-hub-muted mt-1">{t.charactersNoSpaces}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.words}</div>
              <div className="text-xs text-hub-muted mt-1">{t.words}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.sentences}</div>
              <div className="text-xs text-hub-muted mt-1">{t.sentences}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.paragraphs}</div>
              <div className="text-xs text-hub-muted mt-1">{t.paragraphs}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.lines}</div>
              <div className="text-xs text-hub-muted mt-1">{t.lines}</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.avgWordLength}</div>
              <div className="text-xl font-semibold text-white">{stats.avgWordLength.toFixed(1)} chars</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.readingTime}</div>
              <div className="text-xl font-semibold text-white">{formatTime(stats.readingTimeMinutes)}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.speakingTime}</div>
              <div className="text-xl font-semibold text-white">{formatTime(stats.speakingTimeMinutes)}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.longestWord}</div>
              <div className="text-xl font-semibold text-white font-mono truncate">{stats.longestWord || '-'}</div>
            </div>
          </div>

          {/* Word Frequency Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFrequency}
                onChange={(e) => setShowFrequency(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker"
              />
              <span className="text-sm text-hub-muted">{t.showWordFrequency}</span>
            </label>
          </div>

          {/* Word Frequency Table */}
          {showFrequency && wordFrequency && wordFrequency.size > 0 && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">{t.topWords}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {[...wordFrequency.entries()].map(([word, count]) => (
                  <div
                    key={word}
                    className="flex justify-between items-center bg-hub-darker rounded px-3 py-2"
                  >
                    <span className="font-mono text-sm text-white truncate">{word}</span>
                    <span className="text-xs text-hub-accent ml-2">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!input && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-12 text-center">
          <p className="text-hub-muted">{t.inputPlaceholder}</p>
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
