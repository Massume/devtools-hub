'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getTextDiffTranslations } from '@/lib/i18n-text-diff';
import { diffChars, diffWords, diffLines, Change } from 'diff';
import toast from 'react-hot-toast';

type ViewMode = 'side-by-side' | 'inline' | 'unified';

export function TextDiff() {
  const { locale } = useI18n();
  const t = getTextDiffTranslations(locale);

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('inline');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);

  const diff = useMemo(() => {
    if (!hasCompared) return null;

    let a = textA;
    let b = textB;

    if (ignoreCase) {
      a = a.toLowerCase();
      b = b.toLowerCase();
    }

    if (ignoreWhitespace) {
      a = a.replace(/\s+/g, ' ').trim();
      b = b.replace(/\s+/g, ' ').trim();
    }

    if (viewMode === 'unified') {
      return diffLines(a, b);
    }
    return diffWords(a, b);
  }, [textA, textB, ignoreWhitespace, ignoreCase, viewMode, hasCompared]);

  const stats = useMemo(() => {
    if (!diff) return { additions: 0, deletions: 0, unchanged: 0, similarity: 100 };

    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    for (const part of diff) {
      const count = part.value.length;
      if (part.added) {
        additions += count;
      } else if (part.removed) {
        deletions += count;
      } else {
        unchanged += count;
      }
    }

    const total = additions + deletions + unchanged;
    const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 100;

    return { additions, deletions, unchanged, similarity };
  }, [diff]);

  const handleCompare = () => {
    if (!textA.trim() || !textB.trim()) {
      toast.error(t.emptyInput);
      return;
    }
    setHasCompared(true);
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    setHasCompared(false);
  };

  const handleSwap = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
    if (hasCompared) {
      setHasCompared(true);
    }
  };

  const renderDiff = (parts: Change[]) => {
    return parts.map((part, index) => {
      if (part.added) {
        return (
          <span key={index} className="bg-green-500/30 text-green-300">
            {part.value}
          </span>
        );
      }
      if (part.removed) {
        return (
          <span key={index} className="bg-red-500/30 text-red-300 line-through">
            {part.value}
          </span>
        );
      }
      return <span key={index}>{part.value}</span>;
    });
  };

  const renderSideBySide = () => {
    if (!diff) return null;

    const charDiff = diffChars(textA, textB);
    const leftParts: Change[] = [];
    const rightParts: Change[] = [];

    for (const part of charDiff) {
      if (part.removed) {
        leftParts.push({ ...part, added: false, removed: true });
      } else if (part.added) {
        rightParts.push({ ...part, added: true, removed: false });
      } else {
        leftParts.push(part);
        rightParts.push(part);
      }
    }

    return (
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-80">
          {renderDiff(leftParts)}
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-80">
          {renderDiff(rightParts)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.textALabel}</label>
          <textarea
            value={textA}
            onChange={(e) => { setTextA(e.target.value); setHasCompared(false); }}
            placeholder={t.textAPlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.textBLabel}</label>
          <textarea
            value={textB}
            onChange={(e) => { setTextB(e.target.value); setHasCompared(false); }}
            placeholder={t.textBPlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.viewMode}</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="inline">{t.inline}</option>
              <option value="side-by-side">{t.sideBySide}</option>
              <option value="unified">{t.unified}</option>
            </select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-hub-muted cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => { setIgnoreWhitespace(e.target.checked); setHasCompared(false); }}
                className="rounded border-hub-border bg-hub-darker"
              />
              {t.ignoreWhitespace}
            </label>
            <label className="flex items-center gap-2 text-sm text-hub-muted cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => { setIgnoreCase(e.target.checked); setHasCompared(false); }}
                className="rounded border-hub-border bg-hub-darker"
              />
              {t.ignoreCase}
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCompare}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.compareButton}
        </button>
        <button
          onClick={handleSwap}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.swapButton}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Results */}
      {hasCompared && diff && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.additions}</div>
              <div className="text-xs text-hub-muted mt-1">{t.additions}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.deletions}</div>
              <div className="text-xs text-hub-muted mt-1">{t.deletions}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-muted">{stats.unchanged}</div>
              <div className="text-xs text-hub-muted mt-1">{t.unchanged}</div>
            </div>
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-hub-accent">{stats.similarity}%</div>
              <div className="text-xs text-hub-muted mt-1">{t.similarity}</div>
            </div>
          </div>

          {/* Diff Output */}
          {viewMode === 'side-by-side' ? (
            renderSideBySide()
          ) : (
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
              {diff.every(part => !part.added && !part.removed) ? (
                <span className="text-hub-muted">{t.noDifferences}</span>
              ) : (
                renderDiff(diff)
              )}
            </div>
          )}
        </>
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
