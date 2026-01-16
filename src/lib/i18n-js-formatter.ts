import type { Locale } from './i18n';

export const jsFormatterTranslations = {
  en: {
    pageTitle: 'JavaScript Formatter/Minifier - Format and Beautify JS',
    pageDescription: 'Format, beautify or minify JavaScript code with customizable options',

    format: 'Format',
    minify: 'Minify',

    inputLabel: 'Input JavaScript',
    outputLabel: 'Output',
    inputPlaceholder: 'Paste your JavaScript code here...',

    formatButton: 'Format JS',
    minifyButton: 'Minify JS',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    options: 'Options',
    indentSize: 'Indent Size',
    semicolons: 'Semicolons',
    singleQuote: 'Single Quotes',
    trailingComma: 'Trailing Comma',

    copied: 'Copied to clipboard!',
    formatSuccess: 'JavaScript formatted successfully!',
    minifySuccess: 'JavaScript minified successfully!',
    emptyInput: 'Please enter JavaScript code',
    formatError: 'Error formatting JavaScript',

    originalSize: 'Original',
    resultSize: 'Result',
    savings: 'Savings',

    featuresTitle: 'Features',
    feature1: 'Format JavaScript with customizable options',
    feature2: 'Minify JavaScript for production',
    feature3: 'Configure quotes, semicolons, trailing commas',
    feature4: 'Copy or download result',

    aboutTitle: 'About JavaScript Formatter',
    aboutText: 'Format and beautify your JavaScript code for better readability, or minify it to reduce file size for production use.',
  },
  ru: {
    pageTitle: 'JavaScript Форматтер/Минификатор - Форматирование JS',
    pageDescription: 'Форматирование, украшение или минификация JavaScript кода с настраиваемыми опциями',

    format: 'Форматировать',
    minify: 'Минифицировать',

    inputLabel: 'Входной JavaScript',
    outputLabel: 'Результат',
    inputPlaceholder: 'Вставьте ваш JavaScript код здесь...',

    formatButton: 'Форматировать JS',
    minifyButton: 'Минифицировать JS',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    options: 'Настройки',
    indentSize: 'Размер отступа',
    semicolons: 'Точки с запятой',
    singleQuote: 'Одинарные кавычки',
    trailingComma: 'Завершающая запятая',

    copied: 'Скопировано!',
    formatSuccess: 'JavaScript успешно отформатирован!',
    minifySuccess: 'JavaScript успешно минифицирован!',
    emptyInput: 'Введите JavaScript код',
    formatError: 'Ошибка форматирования JavaScript',

    originalSize: 'Оригинал',
    resultSize: 'Результат',
    savings: 'Экономия',

    featuresTitle: 'Возможности',
    feature1: 'Форматирование JavaScript с настраиваемыми опциями',
    feature2: 'Минификация JavaScript для продакшена',
    feature3: 'Настройка кавычек, точек с запятой, запятых',
    feature4: 'Копирование или скачивание результата',

    aboutTitle: 'О JavaScript Форматтере',
    aboutText: 'Форматируйте и украшайте JavaScript код для лучшей читаемости или минифицируйте для уменьшения размера файла.',
  },
};

export function getJsFormatterTranslations(locale: Locale) {
  return jsFormatterTranslations[locale];
}
