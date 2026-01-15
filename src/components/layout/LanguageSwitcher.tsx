'use client';

import { useI18n } from '@/lib/i18n-context';
import { Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-hub-card border border-hub-border rounded-lg p-1">
      <button
        onClick={() => setLocale('en')}
        className={`
          px-3 py-1.5 rounded text-sm font-medium transition-all
          ${locale === 'en'
            ? 'bg-hub-accent text-hub-darker'
            : 'text-hub-muted hover:text-white'
          }
        `}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ru')}
        className={`
          px-3 py-1.5 rounded text-sm font-medium transition-all
          ${locale === 'ru'
            ? 'bg-hub-accent text-hub-darker'
            : 'text-hub-muted hover:text-white'
          }
        `}
        aria-label="Переключить на русский"
      >
        RU
      </button>
    </div>
  );
}
