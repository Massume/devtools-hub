'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCssSpecificityCalculatorTranslations } from '@/lib/i18n-css-specificity-calculator';
import toast from 'react-hot-toast';

interface Specificity {
  inline: number;
  ids: number;
  classes: number;
  elements: number;
  score: number;
}

interface CompareItem {
  id: number;
  selector: string;
}

function calculateSpecificity(selector: string): Specificity | null {
  if (!selector.trim()) {
    return { inline: 0, ids: 0, classes: 0, elements: 0, score: 0 };
  }

  try {
    // Remove :not(), :is(), :where(), :has() wrappers but keep their contents
    let processed = selector;

    // Handle :not(), :is(), :has() - count the contents
    const notMatches = processed.match(/:not\(([^)]+)\)/g) || [];
    const isMatches = processed.match(/:is\(([^)]+)\)/g) || [];
    const hasMatches = processed.match(/:has\(([^)]+)\)/g) || [];

    // :where() has 0 specificity, remove it entirely
    processed = processed.replace(/:where\([^)]*\)/g, '');

    // For :not, :is, :has - extract contents
    notMatches.forEach(match => {
      const content = match.match(/:not\(([^)]+)\)/)?.[1] || '';
      processed = processed.replace(match, ` ${content} `);
    });
    isMatches.forEach(match => {
      const content = match.match(/:is\(([^)]+)\)/)?.[1] || '';
      processed = processed.replace(match, ` ${content} `);
    });
    hasMatches.forEach(match => {
      const content = match.match(/:has\(([^)]+)\)/)?.[1] || '';
      processed = processed.replace(match, ` ${content} `);
    });

    let ids = 0;
    let classes = 0;
    let elements = 0;

    // Count IDs (#id)
    const idMatches = processed.match(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
    ids = idMatches.length;
    processed = processed.replace(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g, '');

    // Count attribute selectors [attr] - treated as classes
    const attrMatches = processed.match(/\[[^\]]+\]/g) || [];
    classes += attrMatches.length;
    processed = processed.replace(/\[[^\]]+\]/g, '');

    // Count pseudo-elements (::before, ::after, etc.) - double colon
    const pseudoElementMatches = processed.match(/::[a-zA-Z-]+/g) || [];
    elements += pseudoElementMatches.length;
    processed = processed.replace(/::[a-zA-Z-]+/g, '');

    // Count pseudo-classes (:hover, :focus, etc.) - single colon
    // Exclude :not, :is, :where, :has which are already handled
    const pseudoClassMatches = processed.match(/:[a-zA-Z-]+(?:\([^)]*\))?/g) || [];
    classes += pseudoClassMatches.length;
    processed = processed.replace(/:[a-zA-Z-]+(?:\([^)]*\))?/g, '');

    // Count classes (.class)
    const classMatches = processed.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
    classes += classMatches.length;
    processed = processed.replace(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g, '');

    // Count elements (remaining words that aren't combinators)
    const elementMatches = processed.match(/[a-zA-Z][a-zA-Z0-9]*/g) || [];
    const combinators = ['>', '+', '~', ' '];
    elementMatches.forEach(match => {
      if (!combinators.includes(match) && match !== '*') {
        elements++;
      }
    });

    // Calculate score (1000 * inline + 100 * ids + 10 * classes + elements)
    const score = ids * 100 + classes * 10 + elements;

    return { inline: 0, ids, classes, elements, score };
  } catch {
    return null;
  }
}

export function CssSpecificityCalculator() {
  const { locale } = useI18n();
  const t = getCssSpecificityCalculatorTranslations(locale);

  const [selector, setSelector] = useState('');
  const [compareItems, setCompareItems] = useState<CompareItem[]>([
    { id: 1, selector: '#header .nav a' },
    { id: 2, selector: '.nav-link.active' },
  ]);

  const specificity = useMemo(() => calculateSpecificity(selector), [selector]);

  const compareResults = useMemo(() => {
    return compareItems.map(item => ({
      ...item,
      specificity: calculateSpecificity(item.selector),
    }));
  }, [compareItems]);

  const winnerIndex = useMemo(() => {
    if (compareResults.length < 2) return -1;

    const scores = compareResults.map(r => r.specificity?.score ?? 0);
    const maxScore = Math.max(...scores);
    const winners = scores.filter(s => s === maxScore);

    if (winners.length > 1) return -2; // tie
    return scores.indexOf(maxScore);
  }, [compareResults]);

  const addCompareItem = () => {
    const newId = Math.max(...compareItems.map(i => i.id), 0) + 1;
    setCompareItems([...compareItems, { id: newId, selector: '' }]);
  };

  const removeCompareItem = (id: number) => {
    if (compareItems.length > 2) {
      setCompareItems(compareItems.filter(i => i.id !== id));
    }
  };

  const updateCompareItem = (id: number, selector: string) => {
    setCompareItems(compareItems.map(item =>
      item.id === id ? { ...item, selector } : item
    ));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const examples = [
    { selector: 'div', label: t.exampleElement },
    { selector: '.btn', label: t.exampleClass },
    { selector: '#header', label: t.exampleId },
    { selector: 'div.container p', label: t.exampleCombined },
    { selector: '#main .content ul li a:hover', label: t.exampleComplex },
  ];

  const formatSpecificity = (spec: Specificity) => {
    return `(${spec.inline}, ${spec.ids}, ${spec.classes}, ${spec.elements})`;
  };

  return (
    <div className="space-y-6">
      {/* Main Calculator */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm font-medium text-hub-muted mb-2">
          {t.selectorInput}
        </label>
        <input
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder={t.selectorPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Result */}
      {specificity && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-hub-muted mb-4">{t.resultLabel}</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-hub-accent mb-2">
                {formatSpecificity(specificity)}
              </div>
              <div className="text-sm text-hub-muted">
                {t.totalScore}: <span className="font-mono text-white">{specificity.score}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-hub-darker rounded-lg">
              <div className="text-2xl font-mono font-bold text-red-400">{specificity.inline}</div>
              <div className="text-xs text-hub-muted mt-1">{t.inline}</div>
            </div>
            <div className="text-center p-3 bg-hub-darker rounded-lg">
              <div className="text-2xl font-mono font-bold text-orange-400">{specificity.ids}</div>
              <div className="text-xs text-hub-muted mt-1">{t.ids}</div>
            </div>
            <div className="text-center p-3 bg-hub-darker rounded-lg">
              <div className="text-2xl font-mono font-bold text-yellow-400">{specificity.classes}</div>
              <div className="text-xs text-hub-muted mt-1">{t.classes}</div>
            </div>
            <div className="text-center p-3 bg-hub-darker rounded-lg">
              <div className="text-2xl font-mono font-bold text-green-400">{specificity.elements}</div>
              <div className="text-xs text-hub-muted mt-1">{t.elements}</div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.comparison}</h3>
          <button
            onClick={addCompareItem}
            className="text-sm px-3 py-1 bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors"
          >
            {t.addSelector}
          </button>
        </div>

        <div className="space-y-3">
          {compareResults.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                winnerIndex === index ? 'bg-green-500/10 border border-green-500/30' :
                winnerIndex === -2 && item.specificity?.score === compareResults[0].specificity?.score
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-hub-darker'
              }`}
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={item.selector}
                  onChange={(e) => updateCompareItem(item.id, e.target.value)}
                  placeholder={t.selectorPlaceholder}
                  className="w-full bg-transparent border-none px-0 py-1 font-mono text-white focus:outline-none"
                />
              </div>
              <div className="text-right min-w-[120px]">
                {item.specificity ? (
                  <span className="font-mono text-hub-accent">
                    {formatSpecificity(item.specificity)}
                  </span>
                ) : (
                  <span className="text-red-400 text-sm">{t.invalidSelector}</span>
                )}
              </div>
              {winnerIndex === index && (
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                  {t.winner}
                </span>
              )}
              {winnerIndex === -2 && item.specificity?.score === compareResults[0].specificity?.score && (
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                  {t.tie}
                </span>
              )}
              {compareItems.length > 2 && (
                <button
                  onClick={() => removeCompareItem(item.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  {t.removeSelector}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.examples}</h3>
        <div className="space-y-2">
          {examples.map((example, index) => {
            const spec = calculateSpecificity(example.selector);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-hub-darker rounded-lg cursor-pointer hover:bg-hub-dark transition-colors"
                onClick={() => setSelector(example.selector)}
              >
                <div className="flex items-center gap-4">
                  <code className="font-mono text-white">{example.selector}</code>
                  <span className="text-xs text-hub-muted">{example.label}</span>
                </div>
                {spec && (
                  <span className="font-mono text-hub-accent text-sm">
                    {formatSpecificity(spec)}
                  </span>
                )}
              </div>
            );
          })}
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
