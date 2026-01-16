import type { Locale } from './i18n';

export const duplicateFinderTranslations = {
  en: {
    pageTitle: 'Duplicate Finder - Find Duplicate Lines & Words',
    pageDescription: 'Find and highlight duplicate lines or words in text',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Paste text to find duplicates...',

    findButton: 'Find Duplicates',
    removeButton: 'Remove Duplicates',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    emptyInput: 'Please enter text to analyze',
    copied: 'Copied to clipboard!',
    noDuplicates: 'No duplicates found!',

    mode: 'Search Mode',
    modeLines: 'Lines',
    modeWords: 'Words',

    options: 'Options',
    caseSensitive: 'Case Sensitive',
    trimWhitespace: 'Trim Whitespace',

    resultsTitle: 'Duplicate Results',
    item: 'Item',
    occurrences: 'Occurrences',
    totalItems: 'Total Items',
    uniqueItems: 'Unique Items',
    duplicateItems: 'Duplicate Items',
    duplicateCount: 'Duplicate Count',

    featuresTitle: 'Features',
    feature1: 'Find duplicate lines or words',
    feature2: 'Case sensitive option',
    feature3: 'Remove duplicates with one click',
    feature4: 'Visual occurrence count',

    aboutTitle: 'About Duplicate Finder',
    aboutText: 'Find and remove duplicate lines or words in text. Perfect for cleaning up data, finding repeated content, and ensuring uniqueness.',
  },
  ru: {
    pageTitle: 'Поиск Дубликатов - Найти Повторяющиеся Строки и Слова',
    pageDescription: 'Поиск и выделение дублирующихся строк или слов в тексте',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Вставьте текст для поиска дубликатов...',

    findButton: 'Найти дубликаты',
    removeButton: 'Удалить дубликаты',
    copyButton: 'Копировать результат',
    clearButton: 'Очистить',

    emptyInput: 'Введите текст для анализа',
    copied: 'Скопировано!',
    noDuplicates: 'Дубликаты не найдены!',

    mode: 'Режим поиска',
    modeLines: 'Строки',
    modeWords: 'Слова',

    options: 'Настройки',
    caseSensitive: 'Учитывать регистр',
    trimWhitespace: 'Убрать пробелы',

    resultsTitle: 'Результаты поиска дубликатов',
    item: 'Элемент',
    occurrences: 'Повторений',
    totalItems: 'Всего элементов',
    uniqueItems: 'Уникальных',
    duplicateItems: 'Дубликатов',
    duplicateCount: 'Количество дубликатов',

    featuresTitle: 'Возможности',
    feature1: 'Поиск дублирующихся строк или слов',
    feature2: 'Опция учёта регистра',
    feature3: 'Удаление дубликатов одним кликом',
    feature4: 'Визуальный подсчёт повторений',

    aboutTitle: 'О Поиске Дубликатов',
    aboutText: 'Поиск и удаление дублирующихся строк или слов в тексте. Идеально для очистки данных, поиска повторяющегося контента и обеспечения уникальности.',
  },
};

export function getDuplicateFinderTranslations(locale: Locale) {
  return duplicateFinderTranslations[locale];
}
