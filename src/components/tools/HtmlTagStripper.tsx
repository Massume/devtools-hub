'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHtmlTagStripperTranslations } from '@/lib/i18n-html-tag-stripper';
import toast from 'react-hot-toast';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
  <style>body { color: black; }</style>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This is a <strong>sample paragraph</strong> with <em>formatted text</em>.</p>
  <p>Visit <a href="https://example.com">our website</a> for more info.</p>
  <img src="photo.jpg" alt="A beautiful sunset" />
  <ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
  <script>console.log('Hello');</script>
</body>
</html>`;

interface StripOptions {
  preserveLineBreaks: boolean;
  preserveLinks: boolean;
  preserveImages: boolean;
  removeScripts: boolean;
  collapseWhitespace: boolean;
}

export function HtmlTagStripper() {
  const { locale } = useI18n();
  const t = getHtmlTagStripperTranslations(locale);

  const [input, setInput] = useState('');
  const [options, setOptions] = useState<StripOptions>({
    preserveLineBreaks: true,
    preserveLinks: false,
    preserveImages: true,
    removeScripts: true,
    collapseWhitespace: true,
  });

  const { output, tagsRemoved } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', tagsRemoved: 0 };
    }

    let html = input;
    let tagCount = 0;

    // Count tags before processing
    const tagMatches = html.match(/<[^>]+>/g);
    tagCount = tagMatches ? tagMatches.length : 0;

    // Remove script and style content if option enabled
    if (options.removeScripts) {
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    }

    // Preserve links if option enabled
    if (options.preserveLinks) {
      html = html.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi, '$2 ($1)');
    }

    // Preserve image alt text if option enabled
    if (options.preserveImages) {
      html = html.replace(/<img\s+[^>]*alt=["']([^"']+)["'][^>]*\/?>/gi, '[$1]');
    }

    // Handle line breaks if option enabled
    if (options.preserveLineBreaks) {
      html = html.replace(/<br\s*\/?>/gi, '\n');
      html = html.replace(/<\/p>/gi, '\n\n');
      html = html.replace(/<\/div>/gi, '\n');
      html = html.replace(/<\/h[1-6]>/gi, '\n\n');
      html = html.replace(/<\/li>/gi, '\n');
      html = html.replace(/<\/tr>/gi, '\n');
    }

    // Remove all remaining HTML tags
    html = html.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/&amp;/g, '&');
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');
    html = html.replace(/&quot;/g, '"');
    html = html.replace(/&#39;/g, "'");
    html = html.replace(/&apos;/g, "'");

    // Collapse whitespace if option enabled
    if (options.collapseWhitespace) {
      html = html.replace(/[ \t]+/g, ' ');
      html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
    }

    // Trim
    html = html.trim();

    return { output: html, tagsRemoved: tagCount };
  }, [input, options]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_HTML);
  };

  const clearAll = () => {
    setInput('');
  };

  const toggleOption = (key: keyof StripOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'preserveLineBreaks' as const, label: t.preserveLineBreaks },
            { key: 'preserveLinks' as const, label: t.preserveLinks },
            { key: 'preserveImages' as const, label: t.preserveImages },
            { key: 'removeScripts' as const, label: t.removeScrips },
            { key: 'collapseWhitespace' as const, label: t.collapseWhitespace },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={() => toggleOption(opt.key)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={10}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-green-400 focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Statistics */}
      {input && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.statistics}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-white">{input.length}</div>
              <div className="text-xs text-hub-muted">{t.originalLength}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-hub-accent">{output.length}</div>
              <div className="text-xs text-hub-muted">{t.strippedLength}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-red-400">{tagsRemoved}</div>
              <div className="text-xs text-hub-muted">{t.tagsRemoved}</div>
            </div>
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
