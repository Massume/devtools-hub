import type { Locale } from './i18n';

export const cssFormatterTranslations = {
  en: {
    pageTitle: 'CSS Formatter/Minifier - Format and Beautify CSS',
    pageDescription: 'Format, beautify or minify CSS code with customizable options',

    format: 'Format',
    minify: 'Minify',

    inputLabel: 'Input CSS',
    outputLabel: 'Output',
    inputPlaceholder: 'Paste your CSS code here...',

    formatButton: 'Format CSS',
    minifyButton: 'Minify CSS',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    options: 'Options',
    indentSize: 'Indent Size',
    singleLine: 'Single Line Selectors',

    copied: 'Copied to clipboard!',
    formatSuccess: 'CSS formatted successfully!',
    minifySuccess: 'CSS minified successfully!',
    emptyInput: 'Please enter CSS code',
    formatError: 'Error formatting CSS',

    originalSize: 'Original',
    resultSize: 'Result',
    savings: 'Savings',

    featuresTitle: 'Features',
    feature1: 'Format CSS with customizable indentation',
    feature2: 'Minify CSS for production',
    feature3: 'Remove comments and whitespace',
    feature4: 'Copy or download result',

    aboutTitle: 'About CSS Formatter',
    aboutText: 'Format and beautify your CSS code for better readability, or minify it to reduce file size for production use.',
  },
  ru: {
    pageTitle: 'CSS Форматтер/Минификатор - Форматирование CSS',
    pageDescription: 'Форматирование, украшение или минификация CSS кода с настраиваемыми опциями',

    format: 'Форматировать',
    minify: 'Минифицировать',

    inputLabel: 'Входной CSS',
    outputLabel: 'Результат',
    inputPlaceholder: 'Вставьте ваш CSS код здесь...',

    formatButton: 'Форматировать CSS',
    minifyButton: 'Минифицировать CSS',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    options: 'Настройки',
    indentSize: 'Размер отступа',
    singleLine: 'Однострочные селекторы',

    copied: 'Скопировано!',
    formatSuccess: 'CSS успешно отформатирован!',
    minifySuccess: 'CSS успешно минифицирован!',
    emptyInput: 'Введите CSS код',
    formatError: 'Ошибка форматирования CSS',

    originalSize: 'Оригинал',
    resultSize: 'Результат',
    savings: 'Экономия',

    featuresTitle: 'Возможности',
    feature1: 'Форматирование CSS с настраиваемыми отступами',
    feature2: 'Минификация CSS для продакшена',
    feature3: 'Удаление комментариев и пробелов',
    feature4: 'Копирование или скачивание результата',

    aboutTitle: 'О CSS Форматтере',
    aboutText: 'Форматируйте и украшайте CSS код для лучшей читаемости или минифицируйте для уменьшения размера файла.',
  },
};

export function getCssFormatterTranslations(locale: Locale) {
  return cssFormatterTranslations[locale];
}
