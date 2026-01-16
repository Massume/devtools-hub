import type { Locale } from './i18n';

export const stringOperationsTranslations = {
  en: {
    pageTitle: 'String Operations - Find, Replace, Extract',
    pageDescription: 'Perform string operations: find & replace with regex, extract emails/URLs/IPs, and more',

    tabFindReplace: 'Find & Replace',
    tabExtract: 'Extract',
    tabTransform: 'Transform',

    inputLabel: 'Input Text',
    outputLabel: 'Output',
    inputPlaceholder: 'Enter or paste text...',

    findLabel: 'Find',
    replaceLabel: 'Replace with',
    findPlaceholder: 'Text or regex pattern...',
    replacePlaceholder: 'Replacement text...',

    useRegex: 'Use Regex',
    caseSensitive: 'Case Sensitive',
    globalReplace: 'Replace All',

    matchesFound: 'matches found',
    noMatches: 'No matches',

    extractType: 'Extract Type',
    extractEmails: 'Emails',
    extractUrls: 'URLs',
    extractIps: 'IP Addresses',
    extractPhones: 'Phone Numbers',
    extractNumbers: 'Numbers',
    extractHashtags: 'Hashtags',
    extractMentions: 'Mentions',
    extractColors: 'Hex Colors',
    extractCustom: 'Custom Regex',

    customPattern: 'Custom Pattern',
    customPatternPlaceholder: 'Enter regex pattern...',

    transformType: 'Transform',
    trimWhitespace: 'Trim Whitespace',
    collapseSpaces: 'Collapse Spaces',
    removeLineBreaks: 'Remove Line Breaks',
    normalizeWhitespace: 'Normalize Whitespace',
    removeNonAlphanumeric: 'Remove Non-Alphanumeric',
    removeNonAscii: 'Remove Non-ASCII',

    processButton: 'Process',
    copyButton: 'Copy',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',
    processSuccess: 'Processed successfully!',
    emptyInput: 'Please enter some text',
    invalidRegex: 'Invalid regex pattern',

    found: 'Found',
    items: 'items',

    featuresTitle: 'Features',
    feature1: 'Find & replace with regex support',
    feature2: 'Extract emails, URLs, IPs, phones',
    feature3: 'Custom regex patterns',
    feature4: 'Text transformations',

    aboutTitle: 'About String Operations',
    aboutText: 'A versatile tool for text manipulation. Find and replace text with regular expression support, extract specific patterns like emails and URLs, or transform text in various ways.',
  },
  ru: {
    pageTitle: 'Строковые Операции - Поиск, Замена, Извлечение',
    pageDescription: 'Операции со строками: поиск и замена с regex, извлечение email/URL/IP и другое',

    tabFindReplace: 'Поиск и Замена',
    tabExtract: 'Извлечение',
    tabTransform: 'Трансформация',

    inputLabel: 'Входной текст',
    outputLabel: 'Результат',
    inputPlaceholder: 'Введите или вставьте текст...',

    findLabel: 'Найти',
    replaceLabel: 'Заменить на',
    findPlaceholder: 'Текст или regex паттерн...',
    replacePlaceholder: 'Текст замены...',

    useRegex: 'Использовать Regex',
    caseSensitive: 'Учитывать регистр',
    globalReplace: 'Заменить все',

    matchesFound: 'совпадений найдено',
    noMatches: 'Совпадений нет',

    extractType: 'Тип извлечения',
    extractEmails: 'Email адреса',
    extractUrls: 'URL ссылки',
    extractIps: 'IP адреса',
    extractPhones: 'Телефоны',
    extractNumbers: 'Числа',
    extractHashtags: 'Хештеги',
    extractMentions: 'Упоминания',
    extractColors: 'HEX цвета',
    extractCustom: 'Свой Regex',

    customPattern: 'Свой паттерн',
    customPatternPlaceholder: 'Введите regex паттерн...',

    transformType: 'Трансформация',
    trimWhitespace: 'Обрезать пробелы',
    collapseSpaces: 'Схлопнуть пробелы',
    removeLineBreaks: 'Удалить переносы строк',
    normalizeWhitespace: 'Нормализовать пробелы',
    removeNonAlphanumeric: 'Удалить спецсимволы',
    removeNonAscii: 'Удалить не-ASCII',

    processButton: 'Обработать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',
    processSuccess: 'Успешно обработано!',
    emptyInput: 'Введите текст',
    invalidRegex: 'Неверный regex паттерн',

    found: 'Найдено',
    items: 'элементов',

    featuresTitle: 'Возможности',
    feature1: 'Поиск и замена с поддержкой regex',
    feature2: 'Извлечение email, URL, IP, телефонов',
    feature3: 'Пользовательские regex паттерны',
    feature4: 'Трансформации текста',

    aboutTitle: 'О Строковых Операциях',
    aboutText: 'Универсальный инструмент для манипуляции текстом. Поиск и замена с поддержкой регулярных выражений, извлечение паттернов как email и URL, или трансформация текста различными способами.',
  },
};

export function getStringOperationsTranslations(locale: Locale) {
  return stringOperationsTranslations[locale];
}
