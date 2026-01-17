'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getOpenGraphGeneratorTranslations } from '@/lib/i18n-open-graph-generator';
import toast from 'react-hot-toast';

interface OGData {
  title: string;
  type: string;
  url: string;
  description: string;
  image: string;
  imageWidth: string;
  imageHeight: string;
  imageAlt: string;
  siteName: string;
  locale: string;
  // Article specific
  articleAuthor: string;
  articlePublished: string;
  articleModified: string;
  articleSection: string;
  articleTags: string;
}

const DEFAULT_OG: OGData = {
  title: '',
  type: 'website',
  url: '',
  description: '',
  image: '',
  imageWidth: '1200',
  imageHeight: '630',
  imageAlt: '',
  siteName: '',
  locale: 'en_US',
  articleAuthor: '',
  articlePublished: '',
  articleModified: '',
  articleSection: '',
  articleTags: '',
};

const OG_TYPES = ['website', 'article', 'product', 'profile', 'video.movie', 'music.song', 'book'];

export function OpenGraphGenerator() {
  const { locale } = useI18n();
  const t = getOpenGraphGeneratorTranslations(locale);

  const [og, setOG] = useState<OGData>(DEFAULT_OG);

  const updateOG = <K extends keyof OGData>(key: K, value: OGData[K]) => {
    setOG(prev => ({ ...prev, [key]: value }));
  };

  const generatedTags = useMemo(() => {
    const tags: string[] = [];

    if (og.title) tags.push(`<meta property="og:title" content="${og.title}">`);
    if (og.type) tags.push(`<meta property="og:type" content="${og.type}">`);
    if (og.url) tags.push(`<meta property="og:url" content="${og.url}">`);
    if (og.description) tags.push(`<meta property="og:description" content="${og.description}">`);
    if (og.image) {
      tags.push(`<meta property="og:image" content="${og.image}">`);
      if (og.imageWidth) tags.push(`<meta property="og:image:width" content="${og.imageWidth}">`);
      if (og.imageHeight) tags.push(`<meta property="og:image:height" content="${og.imageHeight}">`);
      if (og.imageAlt) tags.push(`<meta property="og:image:alt" content="${og.imageAlt}">`);
    }
    if (og.siteName) tags.push(`<meta property="og:site_name" content="${og.siteName}">`);
    if (og.locale) tags.push(`<meta property="og:locale" content="${og.locale}">`);

    // Article specific tags
    if (og.type === 'article') {
      if (og.articleAuthor) tags.push(`<meta property="article:author" content="${og.articleAuthor}">`);
      if (og.articlePublished) tags.push(`<meta property="article:published_time" content="${og.articlePublished}">`);
      if (og.articleModified) tags.push(`<meta property="article:modified_time" content="${og.articleModified}">`);
      if (og.articleSection) tags.push(`<meta property="article:section" content="${og.articleSection}">`);
      if (og.articleTags) {
        og.articleTags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tags.push(`<meta property="article:tag" content="${trimmed}">`);
        });
      }
    }

    return tags.join('\n');
  }, [og]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTags);
    toast.success(t.copied);
  };

  const clearAll = () => {
    setOG(DEFAULT_OG);
  };

  const typeLabels: Record<string, string> = {
    website: t.typeWebsite,
    article: t.typeArticle,
    product: t.typeProduct,
    profile: t.typeProfile,
    'video.movie': t.typeVideo,
    'music.song': t.typeMusic,
    book: t.typeBook,
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

      {/* Basic Info */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.basicInfo}</h3>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.ogType}</label>
          <select
            value={og.type}
            onChange={(e) => updateOG('type', e.target.value)}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          >
            {OG_TYPES.map(type => (
              <option key={type} value={type}>{typeLabels[type] || type}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.ogTitle}</label>
          <input
            type="text"
            value={og.title}
            onChange={(e) => updateOG('title', e.target.value)}
            placeholder={t.ogTitlePlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.ogUrl}</label>
          <input
            type="url"
            value={og.url}
            onChange={(e) => updateOG('url', e.target.value)}
            placeholder={t.ogUrlPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.ogDescription}</label>
          <textarea
            value={og.description}
            onChange={(e) => updateOG('description', e.target.value)}
            placeholder={t.ogDescriptionPlaceholder}
            rows={3}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.ogImage}</label>
          <input
            type="url"
            value={og.image}
            onChange={(e) => updateOG('image', e.target.value)}
            placeholder={t.ogImagePlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.recommendedSize}</p>
        </div>
      </div>

      {/* Image Settings */}
      {og.image && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.imageSettings}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.imageWidth}</label>
              <input
                type="number"
                value={og.imageWidth}
                onChange={(e) => updateOG('imageWidth', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.imageHeight}</label>
              <input
                type="number"
                value={og.imageHeight}
                onChange={(e) => updateOG('imageHeight', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.imageAlt}</label>
              <input
                type="text"
                value={og.imageAlt}
                onChange={(e) => updateOG('imageAlt', e.target.value)}
                placeholder={t.imageAltPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Site Info */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.siteInfo}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.siteName}</label>
            <input
              type="text"
              value={og.siteName}
              onChange={(e) => updateOG('siteName', e.target.value)}
              placeholder={t.siteNamePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.locale}</label>
            <select
              value={og.locale}
              onChange={(e) => updateOG('locale', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="en_US">English (US)</option>
              <option value="en_GB">English (UK)</option>
              <option value="ru_RU">Russian</option>
              <option value="es_ES">Spanish</option>
              <option value="de_DE">German</option>
              <option value="fr_FR">French</option>
              <option value="zh_CN">Chinese (Simplified)</option>
              <option value="ja_JP">Japanese</option>
            </select>
          </div>
        </div>
      </div>

      {/* Article Info */}
      {og.type === 'article' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.articleInfo}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.articleAuthor}</label>
              <input
                type="text"
                value={og.articleAuthor}
                onChange={(e) => updateOG('articleAuthor', e.target.value)}
                placeholder={t.articleAuthorPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.articleSection}</label>
              <input
                type="text"
                value={og.articleSection}
                onChange={(e) => updateOG('articleSection', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.articlePublished}</label>
              <input
                type="datetime-local"
                value={og.articlePublished}
                onChange={(e) => updateOG('articlePublished', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.articleModified}</label>
              <input
                type="datetime-local"
                value={og.articleModified}
                onChange={(e) => updateOG('articleModified', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.articleTags}</label>
            <input
              type="text"
              value={og.articleTags}
              onChange={(e) => updateOG('articleTags', e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {(og.title || og.description || og.image) && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="bg-[#f0f2f5] rounded-lg overflow-hidden max-w-md">
            {og.image && (
              <div className="aspect-[1.91/1] bg-gray-300 flex items-center justify-center text-gray-500">
                <span className="text-sm">1200 x 630</span>
              </div>
            )}
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase">{og.siteName || 'example.com'}</div>
              <div className="text-black font-semibold text-sm mt-1 line-clamp-2">{og.title || 'Page Title'}</div>
              <div className="text-gray-500 text-xs mt-1 line-clamp-2">{og.description || 'Description'}</div>
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
