'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsonPathTesterTranslations } from '@/lib/i18n-json-path-tester';
import { JSONPath } from 'jsonpath-plus';
import toast from 'react-hot-toast';

const SAMPLE_JSON = {
  store: {
    book: [
      { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
      { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
      { category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99 },
      { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings', isbn: '0-395-19395-8', price: 22.99 },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

export function JsonPathTester() {
  const { locale } = useI18n();
  const t = getJsonPathTesterTranslations(locale);

  const [jsonInput, setJsonInput] = useState('');
  const [pathInput, setPathInput] = useState('$.store.book[*].author');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const parsedJson = useMemo(() => {
    if (!jsonInput.trim()) {
      setJsonError(null);
      return null;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError(null);
      return parsed;
    } catch {
      setJsonError(t.invalidJson);
      return null;
    }
  }, [jsonInput, t.invalidJson]);

  const { result, error } = useMemo(() => {
    if (!parsedJson || !pathInput.trim()) {
      return { result: null, error: null };
    }
    try {
      const matches = JSONPath({ path: pathInput, json: parsedJson });
      return { result: matches, error: null };
    } catch (e) {
      return { result: null, error: (e as Error).message };
    }
  }, [parsedJson, pathInput]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
    setPathInput('$.store.book[*].author');
  };

  const formatJson = () => {
    if (parsedJson) {
      setJsonInput(JSON.stringify(parsedJson, null, 2));
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setPathInput('');
  };

  const applyExample = (path: string) => {
    setPathInput(path);
  };

  const syntaxItems = [
    { pattern: '$', desc: t.syntaxRoot },
    { pattern: '.property', desc: t.syntaxChild },
    { pattern: '..', desc: t.syntaxRecursive },
    { pattern: '*', desc: t.syntaxWildcard },
    { pattern: '[0]', desc: t.syntaxArray },
    { pattern: '[0:2]', desc: t.syntaxSlice },
    { pattern: '[?(@.price<10)]', desc: t.syntaxFilter },
  ];

  const examples = [
    { path: '$.store.book[*].author', label: t.exampleAllAuthors },
    { path: '$.store.book[0]', label: t.exampleFirstBook },
    { path: '$.store.book[?(@.price>10)]', label: t.exampleExpensiveBooks },
    { path: '$..price', label: t.exampleAllPrices },
  ];

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadSample}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.loadSample}
        </button>
        <button
          onClick={formatJson}
          disabled={!parsedJson}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50"
        >
          {t.formatJson}
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearAll}
        </button>
      </div>

      {/* JSON Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.jsonInput}</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={t.jsonPlaceholder}
          rows={10}
          className={`w-full bg-hub-darker border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none resize-none ${
            jsonError ? 'border-red-500' : 'border-hub-border focus:border-hub-accent'
          }`}
        />
        {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
      </div>

      {/* Path Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.pathInput}</label>
        <input
          type="text"
          value={pathInput}
          onChange={(e) => setPathInput(e.target.value)}
          placeholder={t.pathPlaceholder}
          className={`w-full bg-hub-darker border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none ${
            error ? 'border-red-500' : 'border-hub-border focus:border-hub-accent'
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{t.invalidPath}: {error}</p>}
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.examples}</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => applyExample(example.path)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              <span className="text-hub-accent font-mono">{example.path}</span>
              <span className="text-hub-muted ml-2">— {example.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result !== null && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">
              {t.resultLabel}
              <span className="ml-2 text-hub-accent">
                {result.length} {t.matchCount}
              </span>
            </label>
            <button
              onClick={() => handleCopy(JSON.stringify(result, null, 2))}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-64 overflow-auto">
            {result.length > 0 ? (
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-hub-muted">{t.noMatches}</p>
            )}
          </div>
        </div>
      )}

      {/* Syntax Help */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.syntaxHelp}</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {syntaxItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <code className="text-hub-accent font-mono bg-hub-darker px-2 py-1 rounded">
                {item.pattern}
              </code>
              <span className="text-hub-muted">{item.desc}</span>
            </div>
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
