'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getStringOperationsTranslations } from '@/lib/i18n-string-operations';
import { extractByType, extractByRegex, ExtractType } from '@/lib/text/extractors';
import toast from 'react-hot-toast';

type Tab = 'find-replace' | 'extract' | 'transform';
type TransformType = 'trim' | 'collapse-spaces' | 'remove-linebreaks' | 'normalize' | 'remove-non-alphanumeric' | 'remove-non-ascii';

export function StringOperations() {
  const { locale } = useI18n();
  const t = getStringOperationsTranslations(locale);

  const [tab, setTab] = useState<Tab>('find-replace');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Find & Replace state
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [matchCount, setMatchCount] = useState(0);

  // Extract state
  const [extractType, setExtractType] = useState<ExtractType | 'custom'>('emails');
  const [customPattern, setCustomPattern] = useState('');

  // Transform state
  const [transformType, setTransformType] = useState<TransformType>('trim');

  const handleFindReplace = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';

      let pattern: RegExp;
      if (useRegex) {
        pattern = new RegExp(findText, flags);
      } else {
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = new RegExp(escaped, flags);
      }

      const matches = input.match(pattern);
      setMatchCount(matches ? matches.length : 0);

      const result = input.replace(pattern, replaceText);
      setOutput(result);
      toast.success(t.processSuccess);
    } catch {
      toast.error(t.invalidRegex);
    }
  };

  const handleExtract = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      let results: string[];
      if (extractType === 'custom') {
        results = extractByRegex(input, customPattern);
      } else {
        results = extractByType(input, extractType);
      }

      setOutput(results.join('\n'));
      setMatchCount(results.length);
      toast.success(t.processSuccess);
    } catch {
      toast.error(t.invalidRegex);
    }
  };

  const handleTransform = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    let result = input;

    switch (transformType) {
      case 'trim':
        result = input.split('\n').map(line => line.trim()).join('\n');
        break;
      case 'collapse-spaces':
        result = input.replace(/ +/g, ' ');
        break;
      case 'remove-linebreaks':
        result = input.replace(/\n+/g, ' ');
        break;
      case 'normalize':
        result = input.replace(/\s+/g, ' ').trim();
        break;
      case 'remove-non-alphanumeric':
        result = input.replace(/[^a-zA-Z0-9\s]/g, '');
        break;
      case 'remove-non-ascii':
        result = input.replace(/[^\x00-\x7F]/g, '');
        break;
    }

    setOutput(result);
    toast.success(t.processSuccess);
  };

  const handleProcess = () => {
    switch (tab) {
      case 'find-replace':
        handleFindReplace();
        break;
      case 'extract':
        handleExtract();
        break;
      case 'transform':
        handleTransform();
        break;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setMatchCount(0);
  };

  const extractTypes: { value: ExtractType | 'custom'; label: string }[] = [
    { value: 'emails', label: t.extractEmails },
    { value: 'urls', label: t.extractUrls },
    { value: 'ips', label: t.extractIps },
    { value: 'phones', label: t.extractPhones },
    { value: 'numbers', label: t.extractNumbers },
    { value: 'hashtags', label: t.extractHashtags },
    { value: 'mentions', label: t.extractMentions },
    { value: 'colors', label: t.extractColors },
    { value: 'custom', label: t.extractCustom },
  ];

  const transformTypes: { value: TransformType; label: string }[] = [
    { value: 'trim', label: t.trimWhitespace },
    { value: 'collapse-spaces', label: t.collapseSpaces },
    { value: 'remove-linebreaks', label: t.removeLineBreaks },
    { value: 'normalize', label: t.normalizeWhitespace },
    { value: 'remove-non-alphanumeric', label: t.removeNonAlphanumeric },
    { value: 'remove-non-ascii', label: t.removeNonAscii },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-2">
        {(['find-replace', 'extract', 'transform'] as Tab[]).map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              tab === t_
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
            }`}
          >
            {t_ === 'find-replace' ? t.tabFindReplace : t_ === 'extract' ? t.tabExtract : t.tabTransform}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'find-replace' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.findLabel}</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder={t.findPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.replaceLabel}</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder={t.replacePlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-hub-muted cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker"
              />
              {t.useRegex}
            </label>
            <label className="flex items-center gap-2 text-sm text-hub-muted cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker"
              />
              {t.caseSensitive}
            </label>
          </div>
          {matchCount > 0 && (
            <div className="text-sm text-hub-accent">
              {matchCount} {t.matchesFound}
            </div>
          )}
        </div>
      )}

      {tab === 'extract' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.extractType}</label>
            <select
              value={extractType}
              onChange={(e) => setExtractType(e.target.value as ExtractType | 'custom')}
              className="w-full md:w-auto bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              {extractTypes.map((et) => (
                <option key={et.value} value={et.value}>{et.label}</option>
              ))}
            </select>
          </div>
          {extractType === 'custom' && (
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.customPattern}</label>
              <input
                type="text"
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                placeholder={t.customPatternPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
          )}
          {matchCount > 0 && (
            <div className="text-sm text-hub-accent">
              {t.found} {matchCount} {t.items}
            </div>
          )}
        </div>
      )}

      {tab === 'transform' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <label className="block text-sm text-hub-muted mb-1">{t.transformType}</label>
          <select
            value={transformType}
            onChange={(e) => setTransformType(e.target.value as TransformType)}
            className="w-full md:w-auto bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
          >
            {transformTypes.map((tt) => (
              <option key={tt.value} value={tt.value}>{tt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
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
