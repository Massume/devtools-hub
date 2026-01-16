'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getSlugGeneratorTranslations } from '@/lib/i18n-slug-generator';
import { slugify, generateSlugVariants } from '@/lib/text/slugUtils';
import toast from 'react-hot-toast';

type Separator = '-' | '_' | '.' | '';

export function SlugGenerator() {
  const { locale } = useI18n();
  const t = getSlugGeneratorTranslations(locale);

  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<Separator>('-');
  const [maxLength, setMaxLength] = useState(0);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [transliterate, setTransliterate] = useState(true);

  const slug = useMemo(() => {
    if (!input.trim()) return '';
    return slugify(input, {
      separator,
      maxLength: maxLength > 0 ? maxLength : undefined,
      removeStopWords,
      transliterate,
    });
  }, [input, separator, maxLength, removeStopWords, transliterate]);

  const variants = useMemo(() => {
    if (!input.trim()) return null;
    return generateSlugVariants(input);
  }, [input]);

  const separatorOptions: { value: Separator; label: string }[] = [
    { value: '-', label: t.separatorDash },
    { value: '_', label: t.separatorUnderscore },
    { value: '.', label: t.separatorDot },
    { value: '', label: t.separatorNone },
  ];

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-24 bg-hub-darker border border-hub-border rounded-lg p-4 text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.separator}</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as Separator)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              {separatorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.maxLength}</label>
            <input
              type="number"
              value={maxLength || ''}
              onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
              placeholder={t.maxLengthNone}
              min={0}
              max={200}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={removeStopWords}
                onChange={(e) => setRemoveStopWords(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              {t.removeStopWords}
            </label>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={transliterate}
                onChange={(e) => setTransliterate(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              {t.transliterate}
            </label>
          </div>
        </div>
      </div>

      {/* Output */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
        <div
          onClick={() => slug && handleCopy(slug)}
          className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-hub-accent cursor-pointer hover:border-hub-accent/50 transition-colors"
        >
          {slug || <span className="text-hub-muted italic">...</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => slug && handleCopy(slug)}
          disabled={!slug}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Variants */}
      {variants && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.variants}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(variants).map(([key, value]) => (
              <div
                key={key}
                onClick={() => handleCopy(value)}
                className="flex justify-between items-center bg-hub-darker rounded px-3 py-2 cursor-pointer hover:bg-hub-border/50 transition-colors group"
              >
                <code className="font-mono text-sm text-white truncate">{value}</code>
                <span className="text-xs text-hub-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {t.copyButton}
                </span>
              </div>
            ))}
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
