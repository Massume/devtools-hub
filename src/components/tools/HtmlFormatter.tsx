'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHtmlFormatterTranslations } from '@/lib/i18n-html-formatter';
import toast from 'react-hot-toast';
import * as prettier from 'prettier/standalone';
import type { Plugin } from 'prettier';
import htmlParser from 'prettier/plugins/html';

type Mode = 'format' | 'minify';

export function HtmlFormatter() {
  const { locale } = useI18n();
  const t = getHtmlFormatterTranslations(locale);

  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [wrapLineLength, setWrapLineLength] = useState(80);

  const formatHtml = async () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const formatted = await prettier.format(input, {
        parser: 'html',
        plugins: [htmlParser as Plugin],
        tabWidth: indentSize,
        printWidth: wrapLineLength,
        htmlWhitespaceSensitivity: 'ignore',
      });
      setOutput(formatted);
      toast.success(t.formatSuccess);
    } catch {
      toast.error(t.formatError);
    }
  };

  const minifyHtml = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const minified = input
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/>\s+</g, '><') // Remove space between tags
        .replace(/\s+>/g, '>') // Remove space before >
        .replace(/<\s+/g, '<') // Remove space after <
        .trim();
      setOutput(minified);
      toast.success(t.minifySuccess);
    } catch {
      toast.error(t.formatError);
    }
  };

  const handleProcess = () => {
    if (mode === 'format') {
      formatHtml();
    } else {
      minifyHtml();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'format' ? 'formatted.html' : 'minified.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const savings = input.length > 0 && output.length > 0
    ? Math.round((1 - output.length / input.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('format')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'format'
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
          }`}
        >
          {t.format}
        </button>
        <button
          onClick={() => setMode('minify')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'minify'
              ? 'bg-hub-accent text-hub-darker'
              : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
          }`}
        >
          {t.minify}
        </button>
      </div>

      {/* Options */}
      {mode === 'format' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.indentSize}</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.wrapLineLength}</label>
              <select
                value={wrapLineLength}
                onChange={(e) => setWrapLineLength(Number(e.target.value))}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
              >
                <option value={80}>80</option>
                <option value={100}>100</option>
                <option value={120}>120</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>
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

      {/* Size Stats */}
      {input.length > 0 && output.length > 0 && (
        <div className="flex gap-4 text-sm text-hub-muted">
          <span>{t.originalSize}: {input.length} bytes</span>
          <span>{t.resultSize}: {output.length} bytes</span>
          {mode === 'minify' && savings > 0 && (
            <span className="text-hub-accent">{t.savings}: {savings}%</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {mode === 'format' ? t.formatButton : t.minifyButton}
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
