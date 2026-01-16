'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getLoremIpsumTranslations } from '@/lib/i18n-lorem-ipsum';
import { generateWords, generateSentences, generateParagraphs, LoremStyle } from '@/lib/generators/loremData';
import toast from 'react-hot-toast';

type GenerateType = 'paragraphs' | 'sentences' | 'words';

export function LoremIpsum() {
  const { locale } = useI18n();
  const t = getLoremIpsumTranslations(locale);

  const [generateType, setGenerateType] = useState<GenerateType>('paragraphs');
  const [count, setCount] = useState(3);
  const [style, setStyle] = useState<LoremStyle>('classic');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    let result = '';

    switch (generateType) {
      case 'paragraphs':
        result = generateParagraphs(count, style, startWithLorem);
        break;
      case 'sentences':
        result = generateSentences(count, style, startWithLorem);
        break;
      case 'words':
        result = generateWords(count, style, startWithLorem);
        break;
    }

    setOutput(result);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.generateType}</label>
            <select
              value={generateType}
              onChange={(e) => setGenerateType(e.target.value as GenerateType)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="paragraphs">{t.paragraphs}</option>
              <option value="sentences">{t.sentences}</option>
              <option value="words">{t.words}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.count}</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.style}</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as LoremStyle)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="classic">{t.styleClassic}</option>
              <option value="hipster">{t.styleHipster}</option>
              <option value="office">{t.styleOffice}</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-hub-muted cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker"
              />
              {t.startWithLorem}
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.generateButton}
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
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Output */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
        <div className="w-full min-h-48 bg-hub-darker border border-hub-border rounded-lg p-4 text-white whitespace-pre-wrap">
          {output || <span className="text-hub-muted italic">...</span>}
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
