'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMarkdownFormatterTranslations } from '@/lib/i18n-markdown-formatter';
import toast from 'react-hot-toast';
import * as prettier from 'prettier/standalone';
import type { Plugin } from 'prettier';
import markdownParser from 'prettier/plugins/markdown';

type ProseWrap = 'always' | 'never' | 'preserve';

export function MarkdownFormatter() {
  const { locale } = useI18n();
  const t = getMarkdownFormatterTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [proseWrap, setProseWrap] = useState<ProseWrap>('preserve');
  const [tabWidth, setTabWidth] = useState(2);

  const formatMarkdown = async () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const formatted = await prettier.format(input, {
        parser: 'markdown',
        plugins: [markdownParser as Plugin],
        proseWrap: proseWrap,
        tabWidth: tabWidth,
      });
      setOutput(formatted);
      toast.success(t.formatSuccess);
    } catch {
      toast.error(t.formatError);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.proseWrap}</label>
            <select
              value={proseWrap}
              onChange={(e) => setProseWrap(e.target.value as ProseWrap)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="preserve">{t.proseWrapPreserve}</option>
              <option value="always">{t.proseWrapAlways}</option>
              <option value="never">{t.proseWrapNever}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.tabWidth}</label>
            <select
              value={tabWidth}
              onChange={(e) => setTabWidth(Number(e.target.value))}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-80 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={formatMarkdown}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.formatButton}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyButton}
        </button>
        <button
          onClick={handleDownload}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.downloadButton}
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
