'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCaseConverterTranslations } from '@/lib/i18n-case-converter';
import { CASE_TYPES, convertCase, CaseType } from '@/lib/text/caseUtils';
import toast from 'react-hot-toast';

export function CaseConverter() {
  const { locale } = useI18n();
  const t = getCaseConverterTranslations(locale);

  const [input, setInput] = useState('');

  const conversions = useMemo((): Record<CaseType, string> => {
    const results: Record<CaseType, string> = {} as Record<CaseType, string>;
    if (!input.trim()) return results;
    for (const caseType of CASE_TYPES) {
      results[caseType] = convertCase(input, caseType);
    }
    return results;
  }, [input]);

  const caseLabels: Record<CaseType, string> = {
    'lowercase': t.lowercase,
    'uppercase': t.uppercase,
    'camelCase': t.camelCase,
    'pascalCase': t.pascalCase,
    'snake_case': t.snakeCase,
    'CONSTANT_CASE': t.constantCase,
    'kebab-case': t.kebabCase,
    'dot.case': t.dotCase,
    'path/case': t.pathCase,
    'Title Case': t.titleCase,
    'Sentence case': t.sentenceCase,
    'aLtErNaTiNg': t.alternatingCase,
    'reversed': t.reversed,
  };

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
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent"
        />
      </div>

      {/* Clear Button */}
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Conversions Grid */}
      {input.trim() && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASE_TYPES.map((caseType) => (
            <div
              key={caseType}
              onClick={() => handleCopy(conversions[caseType])}
              className="bg-hub-card border border-hub-border rounded-lg p-4 cursor-pointer hover:border-hub-accent/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-hub-accent">{caseLabels[caseType]}</span>
                <span className="text-xs text-hub-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.copyButton}
                </span>
              </div>
              <div className="font-mono text-sm text-white break-all">
                {conversions[caseType]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!input.trim() && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-12 text-center">
          <p className="text-hub-muted">{t.emptyInput}</p>
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
