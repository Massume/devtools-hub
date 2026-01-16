import type { Locale } from './i18n';

export const graphqlFormatterTranslations = {
  en: {
    pageTitle: 'GraphQL Formatter - Format and Beautify GraphQL',
    pageDescription: 'Format and beautify GraphQL queries, mutations, and schemas',

    inputLabel: 'Input GraphQL',
    outputLabel: 'Formatted GraphQL',
    inputPlaceholder: 'Paste your GraphQL query here...',

    formatButton: 'Format GraphQL',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',
    formatSuccess: 'GraphQL formatted successfully!',
    emptyInput: 'Please enter GraphQL code',
    formatError: 'Error formatting GraphQL. Check syntax.',

    featuresTitle: 'Features',
    feature1: 'Format GraphQL queries',
    feature2: 'Format mutations and subscriptions',
    feature3: 'Format schema definitions',
    feature4: 'Syntax validation',

    aboutTitle: 'About GraphQL Formatter',
    aboutText: 'Format and beautify your GraphQL queries, mutations, and schema definitions for better readability.',
  },
  ru: {
    pageTitle: 'GraphQL Форматтер - Форматирование GraphQL',
    pageDescription: 'Форматирование и украшение GraphQL запросов, мутаций и схем',

    inputLabel: 'Входной GraphQL',
    outputLabel: 'Отформатированный GraphQL',
    inputPlaceholder: 'Вставьте ваш GraphQL запрос здесь...',

    formatButton: 'Форматировать GraphQL',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',
    formatSuccess: 'GraphQL успешно отформатирован!',
    emptyInput: 'Введите GraphQL код',
    formatError: 'Ошибка форматирования GraphQL. Проверьте синтаксис.',

    featuresTitle: 'Возможности',
    feature1: 'Форматирование GraphQL запросов',
    feature2: 'Форматирование мутаций и подписок',
    feature3: 'Форматирование схем',
    feature4: 'Валидация синтаксиса',

    aboutTitle: 'О GraphQL Форматтере',
    aboutText: 'Форматируйте и украшайте GraphQL запросы, мутации и определения схем для лучшей читаемости.',
  },
};

export function getGraphqlFormatterTranslations(locale: Locale) {
  return graphqlFormatterTranslations[locale];
}
