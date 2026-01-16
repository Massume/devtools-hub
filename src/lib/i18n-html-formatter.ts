import type { Locale } from './i18n';

export const htmlFormatterTranslations = {
  en: {
    pageTitle: 'HTML Formatter/Minifier - Format and Beautify HTML',
    pageDescription: 'Format, beautify or minify HTML code with customizable options',

    format: 'Format',
    minify: 'Minify',

    inputLabel: 'Input HTML',
    outputLabel: 'Output',
    inputPlaceholder: 'Paste your HTML code here...',

    formatButton: 'Format HTML',
    minifyButton: 'Minify HTML',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    options: 'Options',
    indentSize: 'Indent Size',
    wrapLineLength: 'Wrap Line Length',
    preserveNewlines: 'Preserve Newlines',

    copied: 'Copied to clipboard!',
    formatSuccess: 'HTML formatted successfully!',
    minifySuccess: 'HTML minified successfully!',
    emptyInput: 'Please enter HTML code',
    formatError: 'Error formatting HTML',

    originalSize: 'Original',
    resultSize: 'Result',
    savings: 'Savings',

    featuresTitle: 'Features',
    feature1: 'Format HTML with customizable indentation',
    feature2: 'Minify HTML for production',
    feature3: 'Preserve or remove newlines',
    feature4: 'Copy or download result',

    aboutTitle: 'About HTML Formatter',
    aboutText: 'Format and beautify your HTML code for better readability, or minify it to reduce file size for production use.',
  },
  ru: {
    pageTitle: 'HTML Форматтер/Минификатор - Форматирование HTML',
    pageDescription: 'Форматирование, украшение или минификация HTML кода с настраиваемыми опциями',

    format: 'Форматировать',
    minify: 'Минифицировать',

    inputLabel: 'Входной HTML',
    outputLabel: 'Результат',
    inputPlaceholder: 'Вставьте ваш HTML код здесь...',

    formatButton: 'Форматировать HTML',
    minifyButton: 'Минифицировать HTML',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    options: 'Настройки',
    indentSize: 'Размер отступа',
    wrapLineLength: 'Длина строки',
    preserveNewlines: 'Сохранять переносы',

    copied: 'Скопировано!',
    formatSuccess: 'HTML успешно отформатирован!',
    minifySuccess: 'HTML успешно минифицирован!',
    emptyInput: 'Введите HTML код',
    formatError: 'Ошибка форматирования HTML',

    originalSize: 'Оригинал',
    resultSize: 'Результат',
    savings: 'Экономия',

    featuresTitle: 'Возможности',
    feature1: 'Форматирование HTML с настраиваемыми отступами',
    feature2: 'Минификация HTML для продакшена',
    feature3: 'Сохранение или удаление переносов строк',
    feature4: 'Копирование или скачивание результата',

    aboutTitle: 'О HTML Форматтере',
    aboutText: 'Форматируйте и украшайте HTML код для лучшей читаемости или минифицируйте для уменьшения размера файла.',
  },
};

export function getHtmlFormatterTranslations(locale: Locale) {
  return htmlFormatterTranslations[locale];
}
