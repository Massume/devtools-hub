'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getSqlFormatterTranslations } from '@/lib/i18n-sql-formatter';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql' | 'plsql' | 'mariadb';
type KeywordCase = 'upper' | 'lower' | 'preserve';

export function SqlFormatter() {
  const { locale } = useI18n();
  const t = getSqlFormatterTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [indentSize, setIndentSize] = useState(2);

  const dialectOptions: { value: Dialect; label: string }[] = [
    { value: 'sql', label: t.dialectStandard },
    { value: 'mysql', label: t.dialectMySQL },
    { value: 'postgresql', label: t.dialectPostgreSQL },
    { value: 'sqlite', label: t.dialectSQLite },
    { value: 'tsql', label: t.dialectTSQL },
    { value: 'plsql', label: t.dialectPLSQL },
    { value: 'mariadb', label: t.dialectMariaDB },
  ];

  const formatSql = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect,
        keywordCase: keywordCase,
        tabWidth: indentSize,
        linesBetweenQueries: 2,
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
    const blob = new Blob([output], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Dialect Tabs */}
      <div className="flex flex-wrap gap-2">
        {dialectOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDialect(opt.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              dialect === opt.value
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.keywordCase}</label>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="upper">{t.caseUpper}</option>
              <option value="lower">{t.caseLower}</option>
              <option value="preserve">{t.casePreserve}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.indentSize}</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
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
          onClick={formatSql}
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
