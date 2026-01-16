import type { Locale } from './i18n';

export const markdownFormatterTranslations = {
  en: {
    pageTitle: 'Markdown Formatter - Format & Beautify Markdown',
    pageDescription: 'Format and beautify Markdown documents with consistent styling',

    inputLabel: 'Input Markdown',
    outputLabel: 'Formatted Markdown',
    inputPlaceholder: '# Paste your Markdown here...',

    formatButton: 'Format',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    emptyInput: 'Please enter Markdown to format',
    formatSuccess: 'Markdown formatted!',
    formatError: 'Failed to format Markdown',
    copied: 'Copied to clipboard!',

    options: 'Options',
    proseWrap: 'Prose Wrap',
    proseWrapAlways: 'Always',
    proseWrapNever: 'Never',
    proseWrapPreserve: 'Preserve',
    tabWidth: 'Tab Width',

    featuresTitle: 'Features',
    feature1: 'Consistent list formatting',
    feature2: 'Proper heading spacing',
    feature3: 'Code block formatting',
    feature4: 'Table alignment',

    aboutTitle: 'About Markdown Formatter',
    aboutText: 'Format Markdown documents with consistent styling. Uses Prettier to ensure proper spacing, list formatting, and readable output.',
  },
  ru: {
    pageTitle: 'Форматтер Markdown - Форматирование Markdown',
    pageDescription: 'Форматирование Markdown документов с единым стилем',

    inputLabel: 'Входной Markdown',
    outputLabel: 'Отформатированный Markdown',
    inputPlaceholder: '# Вставьте ваш Markdown сюда...',

    formatButton: 'Форматировать',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    emptyInput: 'Введите Markdown для форматирования',
    formatSuccess: 'Markdown отформатирован!',
    formatError: 'Ошибка форматирования Markdown',
    copied: 'Скопировано!',

    options: 'Настройки',
    proseWrap: 'Перенос текста',
    proseWrapAlways: 'Всегда',
    proseWrapNever: 'Никогда',
    proseWrapPreserve: 'Сохранить',
    tabWidth: 'Ширина таба',

    featuresTitle: 'Возможности',
    feature1: 'Единый формат списков',
    feature2: 'Правильные отступы заголовков',
    feature3: 'Форматирование блоков кода',
    feature4: 'Выравнивание таблиц',

    aboutTitle: 'О Форматтере Markdown',
    aboutText: 'Форматирование Markdown документов с единым стилем. Использует Prettier для обеспечения правильных отступов, форматирования списков и читаемого вывода.',
  },
};

export function getMarkdownFormatterTranslations(locale: Locale) {
  return markdownFormatterTranslations[locale];
}
