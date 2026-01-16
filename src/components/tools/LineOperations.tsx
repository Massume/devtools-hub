'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getLineOperationsTranslations } from '@/lib/i18n-line-operations';
import toast from 'react-hot-toast';

type Operation =
  | 'sort-asc' | 'sort-desc' | 'sort-length' | 'sort-length-desc' | 'sort-natural'
  | 'shuffle' | 'reverse'
  | 'dedupe' | 'dedupe-case-insensitive'
  | 'remove-empty' | 'trim'
  | 'number' | 'remove-numbers'
  | 'add-prefix' | 'add-suffix'
  | 'join' | 'split';

export function LineOperations() {
  const { locale } = useI18n();
  const t = getLineOperationsTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState<Operation>('sort-asc');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [separator, setSeparator] = useState(', ');
  const [delimiter, setDelimiter] = useState(',');

  const operations: { value: Operation; label: string }[] = [
    { value: 'sort-asc', label: t.sortAsc },
    { value: 'sort-desc', label: t.sortDesc },
    { value: 'sort-length', label: t.sortByLength },
    { value: 'sort-length-desc', label: t.sortByLengthDesc },
    { value: 'sort-natural', label: t.sortNatural },
    { value: 'shuffle', label: t.shuffle },
    { value: 'reverse', label: t.reverse },
    { value: 'dedupe', label: t.dedupe },
    { value: 'dedupe-case-insensitive', label: t.dedupeCaseInsensitive },
    { value: 'remove-empty', label: t.removeEmpty },
    { value: 'trim', label: t.trimLines },
    { value: 'number', label: t.numberLines },
    { value: 'remove-numbers', label: t.removeNumbers },
    { value: 'add-prefix', label: t.addPrefix },
    { value: 'add-suffix', label: t.addSuffix },
    { value: 'join', label: t.joinLines },
    { value: 'split', label: t.splitByDelimiter },
  ];

  const processLines = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    let lines = input.split('\n');
    let result: string[];

    switch (operation) {
      case 'sort-asc':
        result = [...lines].sort((a, b) => a.localeCompare(b));
        break;
      case 'sort-desc':
        result = [...lines].sort((a, b) => b.localeCompare(a));
        break;
      case 'sort-length':
        result = [...lines].sort((a, b) => a.length - b.length);
        break;
      case 'sort-length-desc':
        result = [...lines].sort((a, b) => b.length - a.length);
        break;
      case 'sort-natural':
        result = [...lines].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        break;
      case 'shuffle':
        result = [...lines];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        break;
      case 'reverse':
        result = [...lines].reverse();
        break;
      case 'dedupe':
        result = [...new Set(lines)];
        break;
      case 'dedupe-case-insensitive':
        const seen = new Set<string>();
        result = lines.filter(line => {
          const lower = line.toLowerCase();
          if (seen.has(lower)) return false;
          seen.add(lower);
          return true;
        });
        break;
      case 'remove-empty':
        result = lines.filter(line => line.trim() !== '');
        break;
      case 'trim':
        result = lines.map(line => line.trim());
        break;
      case 'number':
        result = lines.map((line, i) => `${i + 1}. ${line}`);
        break;
      case 'remove-numbers':
        result = lines.map(line => line.replace(/^\d+[.\-)\]]\s*/, ''));
        break;
      case 'add-prefix':
        result = lines.map(line => prefix + line);
        break;
      case 'add-suffix':
        result = lines.map(line => line + suffix);
        break;
      case 'join':
        setOutput(lines.join(separator));
        toast.success(t.processSuccess);
        return;
      case 'split':
        result = input.split(delimiter).map(s => s.trim());
        break;
      default:
        result = lines;
    }

    setOutput(result.join('\n'));
    toast.success(t.processSuccess);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const inputLines = input.split('\n').length;
  const outputLines = output.split('\n').filter(Boolean).length;

  const showPrefixOption = operation === 'add-prefix';
  const showSuffixOption = operation === 'add-suffix';
  const showSeparatorOption = operation === 'join';
  const showDelimiterOption = operation === 'split';

  return (
    <div className="space-y-6">
      {/* Operation Selector */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.operation}</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value as Operation)}
          className="w-full md:w-auto bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-hub-accent"
        >
          {operations.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {/* Options */}
      {(showPrefixOption || showSuffixOption || showSeparatorOption || showDelimiterOption) && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
          <div className="flex gap-4">
            {showPrefixOption && (
              <div className="flex-1">
                <label className="block text-sm text-hub-muted mb-1">{t.prefix}</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
                />
              </div>
            )}
            {showSuffixOption && (
              <div className="flex-1">
                <label className="block text-sm text-hub-muted mb-1">{t.suffix}</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
                />
              </div>
            )}
            {showSeparatorOption && (
              <div className="flex-1">
                <label className="block text-sm text-hub-muted mb-1">{t.separator}</label>
                <input
                  type="text"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
                />
              </div>
            )}
            {showDelimiterOption && (
              <div className="flex-1">
                <label className="block text-sm text-hub-muted mb-1">{t.delimiter}</label>
                <input
                  type="text"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.inputLabel}</label>
            <span className="text-xs text-hub-muted">{t.linesCount}: {inputLines}</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
            <span className="text-xs text-hub-muted">{t.linesCount}: {outputLines}</span>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      {input && output && (
        <div className="flex gap-4 text-sm text-hub-muted">
          <span>{t.before}: {inputLines} {t.linesCount.toLowerCase()}</span>
          <span>{t.after}: {outputLines} {t.linesCount.toLowerCase()}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={processLines}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.processButton}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
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
