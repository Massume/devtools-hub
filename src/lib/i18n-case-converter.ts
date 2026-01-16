import type { Locale } from './i18n';

export const caseConverterTranslations = {
  en: {
    pageTitle: 'Case Converter - Transform Text Case',
    pageDescription: 'Convert text between different case formats: camelCase, snake_case, kebab-case, and more',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Enter or paste text to convert...',

    copyButton: 'Copy',
    clearButton: 'Clear All',

    copied: 'Copied to clipboard!',
    emptyInput: 'Please enter some text',

    // Case types
    lowercase: 'lowercase',
    uppercase: 'UPPERCASE',
    camelCase: 'camelCase',
    pascalCase: 'PascalCase',
    snakeCase: 'snake_case',
    constantCase: 'CONSTANT_CASE',
    kebabCase: 'kebab-case',
    dotCase: 'dot.case',
    pathCase: 'path/case',
    titleCase: 'Title Case',
    sentenceCase: 'Sentence case',
    alternatingCase: 'aLtErNaTiNg',
    reversed: 'Reversed',

    featuresTitle: 'Features',
    feature1: 'Convert to 13 different case formats',
    feature2: 'Real-time conversion as you type',
    feature3: 'Click any result to copy',
    feature4: 'Supports Unicode and Cyrillic',

    aboutTitle: 'About Case Converter',
    aboutText: 'Quickly convert text between different naming conventions used in programming and writing.',
  },
  ru: {
    pageTitle: 'Конвертер Регистра - Преобразование Регистра Текста',
    pageDescription: 'Конвертация текста между различными форматами: camelCase, snake_case, kebab-case и другие',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Введите или вставьте текст для конвертации...',

    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',
    emptyInput: 'Введите текст',

    // Case types
    lowercase: 'строчные',
    uppercase: 'ПРОПИСНЫЕ',
    camelCase: 'camelCase',
    pascalCase: 'PascalCase',
    snakeCase: 'snake_case',
    constantCase: 'CONSTANT_CASE',
    kebabCase: 'kebab-case',
    dotCase: 'dot.case',
    pathCase: 'path/case',
    titleCase: 'Заглавные Буквы',
    sentenceCase: 'Первая заглавная',
    alternatingCase: 'чЕрЕдУюЩиЙсЯ',
    reversed: 'Перевёрнутый',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация в 13 различных форматов',
    feature2: 'Конвертация в реальном времени',
    feature3: 'Нажмите на результат для копирования',
    feature4: 'Поддержка Unicode и кириллицы',

    aboutTitle: 'О Конвертере Регистра',
    aboutText: 'Быстро конвертируйте текст между различными соглашениями об именовании, используемыми в программировании и написании.',
  },
};

export function getCaseConverterTranslations(locale: Locale) {
  return caseConverterTranslations[locale];
}
