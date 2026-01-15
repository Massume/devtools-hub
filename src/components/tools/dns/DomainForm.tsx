'use client';

import { useState, FormEvent } from 'react';
import { translations as dnsTranslations, Locale } from '@/lib/i18n-dns';
import { useI18n } from '@/lib/i18n-context';

interface DomainFormProps {
  onSubmit: (domain: string) => void;
  isLoading: boolean;
}

export function DomainForm({ onSubmit, isLoading }: DomainFormProps) {
  const [domain, setDomain] = useState('');
  const { locale } = useI18n();
  const dnsLocale = locale as Locale;
  const t = dnsTranslations[dnsLocale];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (domain.trim() && !isLoading) {
      onSubmit(domain.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-hub-accent/20 via-cyan-500/20 to-hub-accent/20 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

        {/* Input container */}
        <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-hub-card border border-hub-border rounded-xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="
              flex-1 px-4 py-3 sm:py-4
              bg-hub-darker border border-hub-border rounded-lg
              text-white text-lg font-mono
              placeholder:text-hub-muted/50
              focus:outline-none focus:border-hub-accent/50 focus:ring-1 focus:ring-hub-accent/30
              disabled:opacity-50
              transition-all
            "
          />
          <button
            type="submit"
            disabled={!domain.trim() || isLoading}
            className="
              px-6 py-3 sm:py-4 sm:px-8
              bg-hub-accent text-hub-darker font-semibold
              rounded-lg
              hover:bg-hub-accent-dim
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{t.checking}</span>
              </>
            ) : (
              <>
                <span>{t.checkButton}</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hints */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
        <span className="text-hub-muted">{t.tryExamples}</span>
        {['google.com', 'github.com', 'cloudflare.com'].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setDomain(example)}
            className="text-hub-accent/70 hover:text-hub-accent transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
