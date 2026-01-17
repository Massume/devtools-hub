'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMetaTagsGeneratorTranslations } from '@/lib/i18n-meta-tags-generator';
import toast from 'react-hot-toast';

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  viewport: string;
  charset: string;
  language: string;
  canonical: string;
}

const DEFAULT_META: MetaData = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1.0',
  charset: 'UTF-8',
  language: 'en',
  canonical: '',
};

export function MetaTagsGenerator() {
  const { locale } = useI18n();
  const t = getMetaTagsGeneratorTranslations(locale);

  const [meta, setMeta] = useState<MetaData>(DEFAULT_META);

  const updateMeta = <K extends keyof MetaData>(key: K, value: MetaData[K]) => {
    setMeta(prev => ({ ...prev, [key]: value }));
  };

  const generatedTags = useMemo(() => {
    const tags: string[] = [];

    // Charset
    if (meta.charset) {
      tags.push(`<meta charset="${meta.charset}">`);
    }

    // Viewport
    if (meta.viewport) {
      tags.push(`<meta name="viewport" content="${meta.viewport}">`);
    }

    // Title
    if (meta.title) {
      tags.push(`<title>${meta.title}</title>`);
    }

    // Description
    if (meta.description) {
      tags.push(`<meta name="description" content="${meta.description}">`);
    }

    // Keywords
    if (meta.keywords) {
      tags.push(`<meta name="keywords" content="${meta.keywords}">`);
    }

    // Author
    if (meta.author) {
      tags.push(`<meta name="author" content="${meta.author}">`);
    }

    // Robots
    const robotsContent: string[] = [];
    robotsContent.push(meta.robots.index ? 'index' : 'noindex');
    robotsContent.push(meta.robots.follow ? 'follow' : 'nofollow');
    tags.push(`<meta name="robots" content="${robotsContent.join(', ')}">`);

    // Language
    if (meta.language) {
      tags.push(`<meta http-equiv="content-language" content="${meta.language}">`);
    }

    // Canonical
    if (meta.canonical) {
      tags.push(`<link rel="canonical" href="${meta.canonical}">`);
    }

    return tags.join('\n');
  }, [meta]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTags);
    toast.success(t.copied);
  };

  const clearAll = () => {
    setMeta(DEFAULT_META);
  };

  const getCharCountColor = (current: number, min: number, max: number) => {
    if (current === 0) return 'text-hub-muted';
    if (current < min) return 'text-yellow-400';
    if (current > max) return 'text-red-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearAll}
        </button>
      </div>

      {/* Form */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.basicMeta}</h3>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.pageTitle}</label>
            <span className={`text-xs ${getCharCountColor(meta.title.length, 30, 60)}`}>
              {meta.title.length}/60 {t.charCount}
            </span>
          </div>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => updateMeta('title', e.target.value)}
            placeholder={t.pageTitlePlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.pageTitleHelp}</p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.description}</label>
            <span className={`text-xs ${getCharCountColor(meta.description.length, 120, 160)}`}>
              {meta.description.length}/160 {t.charCount}
            </span>
          </div>
          <textarea
            value={meta.description}
            onChange={(e) => updateMeta('description', e.target.value)}
            placeholder={t.descriptionPlaceholder}
            rows={3}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
          />
          <p className="text-xs text-hub-muted mt-1">{t.descriptionHelp}</p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.keywords}</label>
          <input
            type="text"
            value={meta.keywords}
            onChange={(e) => updateMeta('keywords', e.target.value)}
            placeholder={t.keywordsPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.keywordsHelp}</p>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.author}</label>
          <input
            type="text"
            value={meta.author}
            onChange={(e) => updateMeta('author', e.target.value)}
            placeholder={t.authorPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        </div>

        {/* Robots */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.robots}</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={meta.robots.index}
                onChange={(e) => updateMeta('robots', { ...meta.robots, index: e.target.checked })}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{t.robotsIndex}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={meta.robots.follow}
                onChange={(e) => updateMeta('robots', { ...meta.robots, follow: e.target.checked })}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{t.robotsFollow}</span>
            </label>
          </div>
        </div>

        {/* Language & Charset */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.charset}</label>
            <select
              value={meta.charset}
              onChange={(e) => updateMeta('charset', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="UTF-8">UTF-8</option>
              <option value="ISO-8859-1">ISO-8859-1</option>
              <option value="windows-1252">Windows-1252</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.language}</label>
            <select
              value={meta.language}
              onChange={(e) => updateMeta('language', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>

        {/* Canonical */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.canonical}</label>
          <input
            type="url"
            value={meta.canonical}
            onChange={(e) => updateMeta('canonical', e.target.value)}
            placeholder={t.canonicalPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        </div>
      </div>

      {/* Search Engine Preview */}
      {(meta.title || meta.description) && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="bg-white rounded-lg p-4">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {meta.title || 'Page Title'}
            </div>
            <div className="text-green-700 text-sm">
              {meta.canonical || 'https://example.com/page'}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {meta.description || 'Page description will appear here...'}
            </div>
          </div>
        </div>
      )}

      {/* Generated Code */}
      {generatedTags && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">
              {generatedTags}
            </code>
          </pre>
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
