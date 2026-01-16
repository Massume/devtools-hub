import type { Locale } from './i18n';

export const slugGeneratorTranslations = {
  en: {
    pageTitle: 'Slug Generator - URL-Friendly Strings',
    pageDescription: 'Convert any text to URL-friendly slugs with transliteration and customizable options',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Enter text to convert to slug...',

    options: 'Options',
    separator: 'Separator',
    maxLength: 'Max Length',
    maxLengthNone: 'No limit',
    removeStopWords: 'Remove Stop Words',
    transliterate: 'Transliterate (Cyrillic)',

    separatorDash: 'Dash (-)',
    separatorUnderscore: 'Underscore (_)',
    separatorDot: 'Dot (.)',
    separatorNone: 'No separator',

    outputLabel: 'Generated Slug',
    copyButton: 'Copy',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',

    variants: 'Slug Variants',
    kebab: 'kebab-case',
    snake: 'snake_case',
    dot: 'dot.case',
    noSep: 'no separator',
    noStopWords: 'without stop words',

    featuresTitle: 'Features',
    feature1: 'Automatic transliteration (Cyrillic, German, French)',
    feature2: 'Customizable separators',
    feature3: 'Optional stop word removal',
    feature4: 'Real-time conversion',

    aboutTitle: 'About Slug Generator',
    aboutText: 'Generate URL-friendly slugs from any text. Supports transliteration of non-ASCII characters and optional removal of common stop words.',
  },
  ru: {
    pageTitle: 'Генератор Slug - URL-Дружественные Строки',
    pageDescription: 'Преобразование текста в URL-дружественные slug с транслитерацией и настройками',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Введите текст для преобразования в slug...',

    options: 'Настройки',
    separator: 'Разделитель',
    maxLength: 'Макс. длина',
    maxLengthNone: 'Без ограничений',
    removeStopWords: 'Удалить стоп-слова',
    transliterate: 'Транслитерация (кириллица)',

    separatorDash: 'Дефис (-)',
    separatorUnderscore: 'Подчёркивание (_)',
    separatorDot: 'Точка (.)',
    separatorNone: 'Без разделителя',

    outputLabel: 'Сгенерированный Slug',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',

    variants: 'Варианты Slug',
    kebab: 'kebab-case',
    snake: 'snake_case',
    dot: 'dot.case',
    noSep: 'без разделителя',
    noStopWords: 'без стоп-слов',

    featuresTitle: 'Возможности',
    feature1: 'Автоматическая транслитерация (кириллица, немецкий, французский)',
    feature2: 'Настраиваемые разделители',
    feature3: 'Опциональное удаление стоп-слов',
    feature4: 'Преобразование в реальном времени',

    aboutTitle: 'О Генераторе Slug',
    aboutText: 'Генерация URL-дружественных slug из любого текста. Поддерживает транслитерацию не-ASCII символов и опциональное удаление распространённых стоп-слов.',
  },
};

export function getSlugGeneratorTranslations(locale: Locale) {
  return slugGeneratorTranslations[locale];
}
