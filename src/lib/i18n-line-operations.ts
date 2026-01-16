import type { Locale } from './i18n';

export const lineOperationsTranslations = {
  en: {
    pageTitle: 'Line Operations - Sort, Dedupe, Transform Lines',
    pageDescription: 'Perform various operations on lines of text: sort, remove duplicates, shuffle, and more',

    inputLabel: 'Input Text',
    outputLabel: 'Output',
    inputPlaceholder: 'Enter or paste text (one item per line)...',

    processButton: 'Process',
    copyButton: 'Copy',
    clearButton: 'Clear',

    operation: 'Operation',
    options: 'Options',

    // Operations
    sortAsc: 'Sort A-Z',
    sortDesc: 'Sort Z-A',
    sortByLength: 'Sort by Length',
    sortByLengthDesc: 'Sort by Length (Desc)',
    sortNatural: 'Natural Sort',
    shuffle: 'Shuffle',
    reverse: 'Reverse Lines',
    dedupe: 'Remove Duplicates',
    dedupeCaseInsensitive: 'Remove Duplicates (Case Insensitive)',
    removeEmpty: 'Remove Empty Lines',
    trimLines: 'Trim Lines',
    numberLines: 'Number Lines',
    removeNumbers: 'Remove Line Numbers',
    addPrefix: 'Add Prefix',
    addSuffix: 'Add Suffix',
    joinLines: 'Join Lines',
    splitByDelimiter: 'Split by Delimiter',

    prefix: 'Prefix',
    suffix: 'Suffix',
    separator: 'Separator',
    delimiter: 'Delimiter',

    linesCount: 'Lines',
    before: 'Before',
    after: 'After',

    copied: 'Copied to clipboard!',
    processSuccess: 'Lines processed successfully!',
    emptyInput: 'Please enter some text',

    featuresTitle: 'Features',
    feature1: 'Sort lines alphabetically or by length',
    feature2: 'Remove duplicates and empty lines',
    feature3: 'Add prefixes, suffixes, or line numbers',
    feature4: 'Join or split lines',

    aboutTitle: 'About Line Operations',
    aboutText: 'A powerful tool for manipulating lines of text. Perfect for cleaning up lists, processing data, and formatting text.',
  },
  ru: {
    pageTitle: 'Операции со Строками - Сортировка, Дедупликация',
    pageDescription: 'Выполнение различных операций со строками текста: сортировка, удаление дубликатов, перемешивание и другое',

    inputLabel: 'Входной текст',
    outputLabel: 'Результат',
    inputPlaceholder: 'Введите или вставьте текст (по одному элементу на строку)...',

    processButton: 'Обработать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    operation: 'Операция',
    options: 'Настройки',

    // Operations
    sortAsc: 'Сортировка А-Я',
    sortDesc: 'Сортировка Я-А',
    sortByLength: 'По длине',
    sortByLengthDesc: 'По длине (убыв.)',
    sortNatural: 'Естественная сортировка',
    shuffle: 'Перемешать',
    reverse: 'Перевернуть порядок',
    dedupe: 'Удалить дубликаты',
    dedupeCaseInsensitive: 'Удалить дубликаты (без учёта регистра)',
    removeEmpty: 'Удалить пустые строки',
    trimLines: 'Обрезать пробелы',
    numberLines: 'Нумерация строк',
    removeNumbers: 'Удалить нумерацию',
    addPrefix: 'Добавить префикс',
    addSuffix: 'Добавить суффикс',
    joinLines: 'Объединить строки',
    splitByDelimiter: 'Разделить по разделителю',

    prefix: 'Префикс',
    suffix: 'Суффикс',
    separator: 'Разделитель',
    delimiter: 'Разделитель',

    linesCount: 'Строк',
    before: 'До',
    after: 'После',

    copied: 'Скопировано!',
    processSuccess: 'Строки успешно обработаны!',
    emptyInput: 'Введите текст',

    featuresTitle: 'Возможности',
    feature1: 'Сортировка строк по алфавиту или длине',
    feature2: 'Удаление дубликатов и пустых строк',
    feature3: 'Добавление префиксов, суффиксов, нумерации',
    feature4: 'Объединение или разделение строк',

    aboutTitle: 'Об Операциях со Строками',
    aboutText: 'Мощный инструмент для манипуляции строками текста. Идеально подходит для очистки списков, обработки данных и форматирования текста.',
  },
};

export function getLineOperationsTranslations(locale: Locale) {
  return lineOperationsTranslations[locale];
}
