export type Locale = 'ru' | 'en';

export const translations = {
  ru: {
    // Header
    siteName: 'DevTools Hub',
    siteTagline: 'Инструменты для разработчиков',

    // Navigation
    home: 'Главная',
    tools: 'Инструменты',
    categories: 'Категории',
    favorites: 'Избранное',
    recent: 'Недавние',

    // Hero Section
    heroTitle: 'Инструменты для разработчиков',
    heroSubtitle: 'Всё что нужно для разработки в одном месте. Бесплатно, быстро, приватно.',
    searchPlaceholder: 'Поиск инструмента...',

    // Tool Categories
    categoryNames: {
      networking: 'Сеть',
      database: 'Базы данных',
      converters: 'Конвертеры',
      formatters: 'Форматтеры',
      generators: 'Генераторы',
      analyzers: 'Анализаторы',
      security: 'Безопасность',
      image: 'Изображения',
    },

    // Tool Catalog
    allTools: 'Все инструменты',
    toolsCount: (count: number) => `${count} ${count === 1 ? 'инструмент' : count < 5 ? 'инструмента' : 'инструментов'}`,
    filterByCategory: 'Фильтр по категории',
    allCategories: 'Все категории',

    // Tool badges
    new: 'Новое',
    beta: 'Бета',
    pro: 'PRO',

    // Actions
    tryNow: 'Попробовать',
    learnMore: 'Подробнее',
    copy: 'Копировать',
    copied: 'Скопировано!',
    download: 'Скачать',
    upload: 'Загрузить',
    clear: 'Очистить',
    reset: 'Сбросить',
    generate: 'Генерировать',
    convert: 'Конвертировать',
    format: 'Форматировать',
    analyze: 'Анализировать',

    // Features Section
    featuresTitle: 'Почему DevTools Hub?',
    features: {
      privacy: {
        title: 'Приватность',
        desc: 'Все работает в браузере. Ваши данные не покидают ваш компьютер.',
      },
      free: {
        title: 'Бесплатно',
        desc: 'Большинство инструментов полностью бесплатны. Без скрытых платежей.',
      },
      fast: {
        title: 'Быстро',
        desc: 'Моментальная работа без задержек. Все локально.',
      },
      opensource: {
        title: 'Open Source',
        desc: 'Код открыт. Можно проверить и предложить улучшения.',
      },
    },

    // Footer
    footerDesc: 'Набор полезных инструментов для разработчиков. Бесплатно и с открытым исходным кодом.',
    madeBy: 'Сделано с',
    links: 'Ссылки',
    quickLinks: {
      github: 'GitHub',
      twitter: 'Twitter',
      feedback: 'Обратная связь',
      changelog: 'Изменения',
    },

    // Errors
    error: 'Ошибка',
    errorOccurred: 'Произошла ошибка',
    tryAgain: 'Попробовать снова',
    somethingWentWrong: 'Что-то пошло не так',

    // Tool-specific common translations
    input: 'Ввод',
    output: 'Вывод',
    options: 'Настройки',
    result: 'Результат',
    results: 'Результаты',

    // File operations
    selectFile: 'Выбрать файл',
    dropFile: 'Перетащите файл сюда',
    or: 'или',
    clickToSelect: 'Нажмите для выбора',
  },

  en: {
    // Header
    siteName: 'DevTools Hub',
    siteTagline: 'Developer Tools',

    // Navigation
    home: 'Home',
    tools: 'Tools',
    categories: 'Categories',
    favorites: 'Favorites',
    recent: 'Recent',

    // Hero Section
    heroTitle: 'Developer Tools',
    heroSubtitle: 'Everything you need for development in one place. Free, fast, private.',
    searchPlaceholder: 'Search for a tool...',

    // Tool Categories
    categoryNames: {
      networking: 'Networking',
      database: 'Database',
      converters: 'Converters',
      formatters: 'Formatters',
      generators: 'Generators',
      analyzers: 'Analyzers',
      security: 'Security',
      image: 'Images',
    },

    // Tool Catalog
    allTools: 'All Tools',
    toolsCount: (count: number) => `${count} tool${count === 1 ? '' : 's'}`,
    filterByCategory: 'Filter by category',
    allCategories: 'All Categories',

    // Tool badges
    new: 'New',
    beta: 'Beta',
    pro: 'PRO',

    // Actions
    tryNow: 'Try Now',
    learnMore: 'Learn More',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    upload: 'Upload',
    clear: 'Clear',
    reset: 'Reset',
    generate: 'Generate',
    convert: 'Convert',
    format: 'Format',
    analyze: 'Analyze',

    // Features Section
    featuresTitle: 'Why DevTools Hub?',
    features: {
      privacy: {
        title: 'Privacy',
        desc: 'Everything runs in your browser. Your data never leaves your device.',
      },
      free: {
        title: 'Free',
        desc: 'Most tools are completely free. No hidden charges.',
      },
      fast: {
        title: 'Fast',
        desc: 'Instant performance with no delays. Everything is local.',
      },
      opensource: {
        title: 'Open Source',
        desc: 'Code is open. You can inspect and contribute improvements.',
      },
    },

    // Footer
    footerDesc: 'A collection of useful developer tools. Free and open source.',
    madeBy: 'Made with',
    links: 'Links',
    quickLinks: {
      github: 'GitHub',
      twitter: 'Twitter',
      feedback: 'Feedback',
      changelog: 'Changelog',
    },

    // Errors
    error: 'Error',
    errorOccurred: 'An error occurred',
    tryAgain: 'Try Again',
    somethingWentWrong: 'Something went wrong',

    // Tool-specific common translations
    input: 'Input',
    output: 'Output',
    options: 'Options',
    result: 'Result',
    results: 'Results',

    // File operations
    selectFile: 'Select File',
    dropFile: 'Drop file here',
    or: 'or',
    clickToSelect: 'Click to select',
  },
} as const;

export type Translations = typeof translations.ru | typeof translations.en;

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const stored = localStorage.getItem('devtools-hub-locale');
  if (stored === 'ru' || stored === 'en') return stored;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ru')) return 'ru';

  return 'en';
}

export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('devtools-hub-locale', locale);
}
