'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, detectLocale, saveLocale } from './i18n';

type TranslationsType = typeof translations[Locale];

interface I18nContextType {
  locale: Locale;
  t: TranslationsType;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  };

  const t = translations[locale];

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: 'en', t: translations.en as TranslationsType, setLocale }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, t: t as TranslationsType, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
