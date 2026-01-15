export type Locale = 'ru' | 'en';

export const translations = {
  ru: {
    // Header
    badge: 'Бесплатная проверка DNS',
    title1: 'DNS Health',
    title2: 'Check',
    subtitle: 'Проверьте DNS записи вашего домена за секунды. MX, SPF, DMARC, DKIM и другие — с понятными объяснениями.',

    // Form
    placeholder: 'example.com',
    checkButton: 'Проверить',
    checking: 'Проверка...',
    tryExamples: 'Попробуйте:',

    // Results
    resultsFor: 'Результаты для',
    checkedAt: 'Проверено:',
    outOf: 'из',
    points: 'баллов',

    // Score labels
    excellent: 'Отлично',
    good: 'Хорошо',
    normal: 'Нормально',
    needsAttention: 'Требует внимания',
    critical: 'Критично',

    // Sections
    emailSecurity: 'Email безопасность',
    dnsInfrastructure: 'DNS инфраструктура',

    // Status badges
    statusOk: 'OK',
    statusWarning: 'Внимание',
    statusFail: 'Проблема',
    statusInfo: 'Инфо',

    // Recommendation
    recommendation: 'Рекомендация:',

    // Features
    whatWeCheck: 'Что мы проверяем',
    features: {
      mx: { title: 'MX записи', desc: 'Правильно ли настроена доставка почты', link: '/ru/what-is-mx-record' },
      spf: { title: 'SPF', desc: 'Защита от подделки отправителя', link: '/ru/what-is-spf' },
      dmarc: { title: 'DMARC', desc: 'Политика обработки поддельных писем', link: '/ru/what-is-dmarc' },
      dkim: { title: 'DKIM', desc: 'Криптографическая подпись писем', link: '/ru/what-is-dkim' },
    },
    learnMore: 'Подробнее',

    // Footer
    footerDesc: 'DNS Health Check — бесплатный инструмент для проверки DNS',
    madeBy: 'Made by',
    guides: 'Руководства',
    guideLinks: {
      spf: { title: 'Что такое SPF?', link: '/ru/what-is-spf' },
      dmarc: { title: 'Что такое DMARC?', link: '/ru/what-is-dmarc' },
      dkim: { title: 'Что такое DKIM?', link: '/ru/what-is-dkim' },
      mx: { title: 'Что такое MX запись?', link: '/ru/what-is-mx-record' },
      deliverability: { title: 'Гайд по доставляемости', link: '/ru/email-deliverability-guide' },
    },

    // Errors
    errorOccurred: 'Произошла ошибка',
    errorCheck: 'Не удалось выполнить проверку. Попробуйте ещё раз.',

    // Check names
    checkNames: {
      mx: 'MX Records',
      spf: 'SPF Record',
      dmarc: 'DMARC Record',
      dkim: 'DKIM',
      a: 'A Records (IPv4)',
      aaaa: 'AAAA Records (IPv6)',
      ns: 'NS Records',
      caa: 'CAA Records',
    },

    // Check explanations
    checks: {
      mx: {
        notFound: 'MX записи не найдены. Ваш домен не может принимать электронную почту.',
        notFoundRec: 'Добавьте MX записи для вашего почтового провайдера (Google Workspace, Microsoft 365, и т.д.)',
        foundProvider: (provider: string) => `Найдены MX записи для ${provider}. Почта настроена корректно.`,
        found: (count: number) => `Найдено ${count} MX ${count === 1 ? 'запись' : 'записей'}. Домен может принимать почту.`,
      },
      spf: {
        notFound: 'SPF запись не найдена. Это позволяет злоумышленникам отправлять письма от имени вашего домена.',
        notFoundRec: 'Добавьте TXT запись с SPF политикой, например: v=spf1 include:_spf.google.com ~all',
        invalidFormat: 'SPF запись имеет неправильный формат. Должна начинаться с "v=spf1".',
        invalidFormatRec: 'Исправьте формат SPF записи.',
        hardFail: 'SPF настроен с жёсткой политикой (-all). Письма от неавторизованных серверов будут отклоняться.',
        softFail: 'SPF настроен с мягкой политикой (~all). Письма от неавторизованных серверов будут помечаться как подозрительные, но не отклоняться.',
        softFailRec: 'Рассмотрите переход на жёсткую политику (-all) для лучшей защиты.',
        neutral: 'SPF настроен с нейтральной политикой (?all). Это практически не даёт защиты.',
        neutralRec: 'Измените политику на ~all или -all.',
        noPolicy: 'SPF запись найдена, но не содержит явной политики (all).',
        noPolicyRec: 'Добавьте -all или ~all в конец SPF записи.',
      },
      dmarc: {
        notFound: 'DMARC запись не найдена. Без DMARC вы не получаете отчёты о попытках подделки вашего домена.',
        notFoundRec: 'Добавьте TXT запись для _dmarc.вашдомен.com, например: v=DMARC1; p=quarantine; rua=mailto:dmarc@вашдомен.com',
        invalidFormat: 'DMARC запись имеет неправильный формат.',
        invalidFormatRec: 'DMARC запись должна начинаться с "v=DMARC1".',
        reject: 'DMARC настроен с политикой reject. Поддельные письма будут отклоняться.',
        rejectWithReporting: 'DMARC настроен с политикой reject. Поддельные письма будут отклоняться. Отчёты настроены.',
        rejectRec: 'Рассмотрите добавление rua= для получения отчётов.',
        quarantine: 'DMARC настроен с политикой quarantine. Поддельные письма попадут в спам.',
        quarantineWithReporting: 'DMARC настроен с политикой quarantine. Поддельные письма попадут в спам. Отчёты настроены.',
        quarantineRec: 'После проверки отчётов рассмотрите переход на p=reject.',
        none: 'DMARC настроен с политикой none. Это режим мониторинга — поддельные письма не блокируются.',
        noneWithReporting: 'DMARC настроен с политикой none. Это режим мониторинга — поддельные письма не блокируются. Отчёты настроены.',
        noneRec: 'После анализа отчётов перейдите на p=quarantine, затем p=reject.',
        noPolicy: 'DMARC запись найдена, но политика не определена.',
        noPolicyRec: 'Добавьте p=none, p=quarantine или p=reject в запись.',
      },
      dkim: {
        found: 'DKIM запись найдена. Исходящие письма подписываются криптографически.',
        selector: 'Селектор:',
        notFound: 'DKIM записи не найдены для стандартных селекторов. Это не обязательно проблема — селектор может быть нестандартным.',
        notFoundRec: 'Проверьте в настройках вашего почтового провайдера какой DKIM селектор используется.',
      },
      a: {
        notFound: 'A записи не найдены. Домен не указывает на IPv4 адрес.',
        found: (count: number) => `Найдено ${count} A ${count === 1 ? 'запись' : 'записей'}. Домен доступен по IPv4.`,
      },
      aaaa: {
        notFound: 'AAAA записи не найдены. Домен не поддерживает IPv6.',
        notFoundRec: 'Рассмотрите добавление IPv6 для лучшей доступности.',
        found: (count: number) => `Найдено ${count} AAAA ${count === 1 ? 'запись' : 'записей'}. Домен поддерживает IPv6.`,
      },
      ns: {
        notFound: 'NS записи не найдены. Это критическая проблема — домен не может работать без NS.',
        singleNs: 'Найден только один NS сервер. Это единая точка отказа.',
        singleNsRec: 'Добавьте минимум 2 NS сервера для отказоустойчивости.',
        found: (count: number) => `Найдено ${count} NS серверов. Конфигурация отказоустойчива.`,
      },
      caa: {
        notFound: 'CAA записи не найдены. Любой центр сертификации может выпустить сертификат для вашего домена.',
        notFoundRec: 'Рассмотрите добавление CAA записей для ограничения выпуска сертификатов.',
        found: 'CAA записи настроены. Только указанные центры сертификации могут выпускать сертификаты.',
      },
    },
  },

  en: {
    // Header
    badge: 'Free DNS Check',
    title1: 'DNS Health',
    title2: 'Check',
    subtitle: 'Check your domain\'s DNS records in seconds. MX, SPF, DMARC, DKIM and more — with clear explanations.',

    // Form
    placeholder: 'example.com',
    checkButton: 'Check',
    checking: 'Checking...',
    tryExamples: 'Try:',

    // Results
    resultsFor: 'Results for',
    checkedAt: 'Checked:',
    outOf: 'out of',
    points: 'points',

    // Score labels
    excellent: 'Excellent',
    good: 'Good',
    normal: 'Fair',
    needsAttention: 'Needs Attention',
    critical: 'Critical',

    // Sections
    emailSecurity: 'Email Security',
    dnsInfrastructure: 'DNS Infrastructure',

    // Status badges
    statusOk: 'OK',
    statusWarning: 'Warning',
    statusFail: 'Issue',
    statusInfo: 'Info',

    // Recommendation
    recommendation: 'Recommendation:',

    // Features
    whatWeCheck: 'What We Check',
    features: {
      mx: { title: 'MX Records', desc: 'Is email delivery configured correctly', link: '/what-is-mx-record' },
      spf: { title: 'SPF', desc: 'Protection against sender spoofing', link: '/what-is-spf' },
      dmarc: { title: 'DMARC', desc: 'Policy for handling spoofed emails', link: '/what-is-dmarc' },
      dkim: { title: 'DKIM', desc: 'Cryptographic email signing', link: '/what-is-dkim' },
    },
    learnMore: 'Learn more',

    // Footer
    footerDesc: 'DNS Health Check — free tool for DNS verification',
    madeBy: 'Made by',
    guides: 'Guides',
    guideLinks: {
      spf: { title: 'What is SPF?', link: '/what-is-spf' },
      dmarc: { title: 'What is DMARC?', link: '/what-is-dmarc' },
      dkim: { title: 'What is DKIM?', link: '/what-is-dkim' },
      mx: { title: 'What is MX Record?', link: '/what-is-mx-record' },
      deliverability: { title: 'Email Deliverability Guide', link: '/email-deliverability-guide' },
    },

    // Errors
    errorOccurred: 'An error occurred',
    errorCheck: 'Failed to perform check. Please try again.',

    // Check names
    checkNames: {
      mx: 'MX Records',
      spf: 'SPF Record',
      dmarc: 'DMARC Record',
      dkim: 'DKIM',
      a: 'A Records (IPv4)',
      aaaa: 'AAAA Records (IPv6)',
      ns: 'NS Records',
      caa: 'CAA Records',
    },

    // Check explanations
    checks: {
      mx: {
        notFound: 'No MX records found. Your domain cannot receive email.',
        notFoundRec: 'Add MX records for your email provider (Google Workspace, Microsoft 365, etc.)',
        foundProvider: (provider: string) => `MX records found for ${provider}. Email is configured correctly.`,
        found: (count: number) => `Found ${count} MX record${count === 1 ? '' : 's'}. Domain can receive email.`,
      },
      spf: {
        notFound: 'No SPF record found. This allows attackers to send emails on behalf of your domain.',
        notFoundRec: 'Add a TXT record with SPF policy, e.g.: v=spf1 include:_spf.google.com ~all',
        invalidFormat: 'SPF record has invalid format. Must start with "v=spf1".',
        invalidFormatRec: 'Fix the SPF record format.',
        hardFail: 'SPF is configured with hard fail policy (-all). Emails from unauthorized servers will be rejected.',
        softFail: 'SPF is configured with soft fail policy (~all). Emails from unauthorized servers will be marked as suspicious but not rejected.',
        softFailRec: 'Consider switching to hard fail policy (-all) for better protection.',
        neutral: 'SPF is configured with neutral policy (?all). This provides virtually no protection.',
        neutralRec: 'Change policy to ~all or -all.',
        noPolicy: 'SPF record found but no explicit policy (all) specified.',
        noPolicyRec: 'Add -all or ~all at the end of SPF record.',
      },
      dmarc: {
        notFound: 'No DMARC record found. Without DMARC you won\'t receive reports about spoofing attempts.',
        notFoundRec: 'Add TXT record for _dmarc.yourdomain.com, e.g.: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com',
        invalidFormat: 'DMARC record has invalid format.',
        invalidFormatRec: 'DMARC record must start with "v=DMARC1".',
        reject: 'DMARC is configured with reject policy. Spoofed emails will be rejected.',
        rejectWithReporting: 'DMARC is configured with reject policy. Spoofed emails will be rejected. Reporting is enabled.',
        rejectRec: 'Consider adding rua= to receive reports.',
        quarantine: 'DMARC is configured with quarantine policy. Spoofed emails will go to spam.',
        quarantineWithReporting: 'DMARC is configured with quarantine policy. Spoofed emails will go to spam. Reporting is enabled.',
        quarantineRec: 'After reviewing reports, consider upgrading to p=reject.',
        none: 'DMARC is configured with none policy. This is monitoring mode — spoofed emails are not blocked.',
        noneWithReporting: 'DMARC is configured with none policy. This is monitoring mode — spoofed emails are not blocked. Reporting is enabled.',
        noneRec: 'After analyzing reports, upgrade to p=quarantine, then p=reject.',
        noPolicy: 'DMARC record found but policy is not defined.',
        noPolicyRec: 'Add p=none, p=quarantine or p=reject to the record.',
      },
      dkim: {
        found: 'DKIM record found. Outgoing emails are cryptographically signed.',
        selector: 'Selector:',
        notFound: 'No DKIM records found for common selectors. This may not be an issue — selector might be custom.',
        notFoundRec: 'Check your email provider settings for the DKIM selector being used.',
      },
      a: {
        notFound: 'No A records found. Domain does not point to an IPv4 address.',
        found: (count: number) => `Found ${count} A record${count === 1 ? '' : 's'}. Domain is accessible via IPv4.`,
      },
      aaaa: {
        notFound: 'No AAAA records found. Domain does not support IPv6.',
        notFoundRec: 'Consider adding IPv6 for better accessibility.',
        found: (count: number) => `Found ${count} AAAA record${count === 1 ? '' : 's'}. Domain supports IPv6.`,
      },
      ns: {
        notFound: 'No NS records found. This is critical — domain cannot function without NS.',
        singleNs: 'Only one NS server found. This is a single point of failure.',
        singleNsRec: 'Add at least 2 NS servers for redundancy.',
        found: (count: number) => `Found ${count} NS servers. Configuration is redundant.`,
      },
      caa: {
        notFound: 'No CAA records found. Any certificate authority can issue a certificate for your domain.',
        notFoundRec: 'Consider adding CAA records to restrict certificate issuance.',
        found: 'CAA records configured. Only specified certificate authorities can issue certificates.',
      },
    },
  },
} as const;

export type Translations = typeof translations.ru | typeof translations.en;

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const stored = localStorage.getItem('dns-check-locale');
  if (stored === 'ru' || stored === 'en') return stored;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ru')) return 'ru';

  return 'en';
}

export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dns-check-locale', locale);
}
