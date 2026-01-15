import { DNSCheck, CheckStatus } from '@/types/dns';
import { Locale, translations } from './i18n-dns';

type CheckTranslations = typeof translations.ru.checks;

// Анализ MX записей
export function analyzeMX(records: string[] | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.mx;
  const checkNames = translations[locale].checkNames;

  if (!records || records.length === 0) {
    return {
      name: checkNames.mx,
      status: 'fail',
      value: null,
      explanation: t.notFound,
      recommendation: t.notFoundRec,
    };
  }

  // Проверяем на известные почтовые сервисы
  const knownProviders = [
    { pattern: /google|gmail/i, name: 'Google Workspace' },
    { pattern: /outlook|microsoft/i, name: 'Microsoft 365' },
    { pattern: /zoho/i, name: 'Zoho Mail' },
    { pattern: /protonmail/i, name: 'ProtonMail' },
    { pattern: /yandex/i, name: 'Yandex' },
    { pattern: /mail\.ru/i, name: 'Mail.ru' },
  ];

  const recordsStr = records.join(', ');
  const provider = knownProviders.find(p => p.pattern.test(recordsStr));

  return {
    name: checkNames.mx,
    status: 'pass',
    value: records,
    explanation: provider
      ? t.foundProvider(provider.name)
      : t.found(records.length),
  };
}

// Анализ SPF записи
export function analyzeSPF(record: string | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.spf;
  const checkNames = translations[locale].checkNames;

  if (!record) {
    return {
      name: checkNames.spf,
      status: 'fail',
      value: null,
      explanation: t.notFound,
      recommendation: t.notFoundRec,
    };
  }

  // Проверяем валидность
  if (!record.startsWith('v=spf1')) {
    return {
      name: checkNames.spf,
      status: 'warning',
      value: record,
      explanation: t.invalidFormat,
      recommendation: t.invalidFormatRec,
    };
  }

  // Проверяем политику
  const hasHardFail = record.includes('-all');
  const hasSoftFail = record.includes('~all');
  const hasNeutral = record.includes('?all');

  if (hasHardFail) {
    return {
      name: checkNames.spf,
      status: 'pass',
      value: record,
      explanation: t.hardFail,
    };
  }

  if (hasSoftFail) {
    return {
      name: checkNames.spf,
      status: 'warning',
      value: record,
      explanation: t.softFail,
      recommendation: t.softFailRec,
    };
  }

  if (hasNeutral) {
    return {
      name: checkNames.spf,
      status: 'warning',
      value: record,
      explanation: t.neutral,
      recommendation: t.neutralRec,
    };
  }

  return {
    name: checkNames.spf,
    status: 'warning',
    value: record,
    explanation: t.noPolicy,
    recommendation: t.noPolicyRec,
  };
}

// Анализ DMARC записи
export function analyzeDMARC(record: string | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.dmarc;
  const checkNames = translations[locale].checkNames;

  if (!record) {
    return {
      name: checkNames.dmarc,
      status: 'fail',
      value: null,
      explanation: t.notFound,
      recommendation: t.notFoundRec,
    };
  }

  if (!record.startsWith('v=DMARC1')) {
    return {
      name: checkNames.dmarc,
      status: 'warning',
      value: record,
      explanation: t.invalidFormat,
      recommendation: t.invalidFormatRec,
    };
  }

  // Проверяем политику
  const policyMatch = record.match(/p=(none|quarantine|reject)/i);
  const policy = policyMatch ? policyMatch[1].toLowerCase() : null;

  // Проверяем наличие rua (reporting)
  const hasReporting = record.includes('rua=');

  if (policy === 'reject') {
    return {
      name: checkNames.dmarc,
      status: 'pass',
      value: record,
      explanation: hasReporting ? t.rejectWithReporting : t.reject,
      recommendation: hasReporting ? undefined : t.rejectRec,
    };
  }

  if (policy === 'quarantine') {
    return {
      name: checkNames.dmarc,
      status: 'warning',
      value: record,
      explanation: hasReporting ? t.quarantineWithReporting : t.quarantine,
      recommendation: t.quarantineRec,
    };
  }

  if (policy === 'none') {
    return {
      name: checkNames.dmarc,
      status: 'warning',
      value: record,
      explanation: hasReporting ? t.noneWithReporting : t.none,
      recommendation: t.noneRec,
    };
  }

  return {
    name: checkNames.dmarc,
    status: 'warning',
    value: record,
    explanation: t.noPolicy,
    recommendation: t.noPolicyRec,
  };
}

// Анализ DKIM (упрощённый — проверяем наличие)
export function analyzeDKIM(found: boolean, selector: string | undefined, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.dkim;
  const checkNames = translations[locale].checkNames;

  if (found) {
    return {
      name: checkNames.dkim,
      status: 'pass',
      value: selector ? `${t.selector} ${selector}` : null,
      explanation: t.found,
    };
  }

  return {
    name: checkNames.dkim,
    status: 'info',
    value: null,
    explanation: t.notFound,
    recommendation: t.notFoundRec,
  };
}

// Анализ A записей
export function analyzeA(records: string[] | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.a;
  const checkNames = translations[locale].checkNames;

  if (!records || records.length === 0) {
    return {
      name: checkNames.a,
      status: 'info',
      value: null,
      explanation: t.notFound,
    };
  }

  return {
    name: checkNames.a,
    status: 'pass',
    value: records,
    explanation: t.found(records.length),
  };
}

// Анализ AAAA записей
export function analyzeAAAA(records: string[] | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.aaaa;
  const checkNames = translations[locale].checkNames;

  if (!records || records.length === 0) {
    return {
      name: checkNames.aaaa,
      status: 'info',
      value: null,
      explanation: t.notFound,
      recommendation: t.notFoundRec,
    };
  }

  return {
    name: checkNames.aaaa,
    status: 'pass',
    value: records,
    explanation: t.found(records.length),
  };
}

// Анализ NS записей
export function analyzeNS(records: string[] | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.ns;
  const checkNames = translations[locale].checkNames;

  if (!records || records.length === 0) {
    return {
      name: checkNames.ns,
      status: 'fail',
      value: null,
      explanation: t.notFound,
    };
  }

  if (records.length === 1) {
    return {
      name: checkNames.ns,
      status: 'warning',
      value: records,
      explanation: t.singleNs,
      recommendation: t.singleNsRec,
    };
  }

  return {
    name: checkNames.ns,
    status: 'pass',
    value: records,
    explanation: t.found(records.length),
  };
}

// Анализ CAA записей
export function analyzeCAA(records: string[] | null, locale: Locale = 'en'): DNSCheck {
  const t = translations[locale].checks.caa;
  const checkNames = translations[locale].checkNames;

  if (!records || records.length === 0) {
    return {
      name: checkNames.caa,
      status: 'info',
      value: null,
      explanation: t.notFound,
      recommendation: t.notFoundRec,
    };
  }

  return {
    name: checkNames.caa,
    status: 'pass',
    value: records,
    explanation: t.found,
  };
}

// Расчёт общего счёта
export function calculateScore(checks: Record<string, DNSCheck>): { score: number; maxScore: number } {
  const weights: Record<string, number> = {
    mx: 20,
    spf: 25,
    dmarc: 25,
    dkim: 15,
    ns: 10,
    a: 0,
    aaaa: 0,
    caa: 5,
  };

  let score = 0;
  let maxScore = 0;

  for (const [key, check] of Object.entries(checks)) {
    const weight = weights[key] || 0;
    maxScore += weight;

    if (check.status === 'pass') {
      score += weight;
    } else if (check.status === 'warning') {
      score += weight * 0.5;
    } else if (check.status === 'info') {
      score += weight * 0.75; // info не критично
    }
    // fail = 0 очков
  }

  return { score: Math.round(score), maxScore };
}
