import type { Locale } from './i18n';

export const ulidGeneratorTranslations = {
  en: {
    pageTitle: 'ULID Generator - Universally Unique Lexicographically Sortable IDs',
    pageDescription: 'Generate ULIDs with timestamp extraction. Lexicographically sortable and URL-safe.',

    quantity: 'Quantity',
    showTimestamp: 'Show Timestamp',

    generateButton: 'Generate',
    copyButton: 'Copy',
    copyAll: 'Copy All',

    copied: 'Copied to clipboard!',
    copiedAll: 'All ULIDs copied!',

    timestamp: 'Timestamp',
    decode: 'Decode ULID',
    decodePlaceholder: 'Enter ULID to decode...',
    decodeButton: 'Decode',
    invalidUlid: 'Invalid ULID format',

    featuresTitle: 'Features',
    feature1: 'Lexicographically sortable',
    feature2: 'Embedded timestamp',
    feature3: 'URL-safe characters',
    feature4: '128-bit compatible with UUID',

    aboutTitle: 'About ULID',
    aboutText: 'ULID (Universally Unique Lexicographically Sortable Identifier) combines a timestamp with randomness. Unlike UUID, ULIDs are sortable by creation time and use only URL-safe characters.',
  },
  ru: {
    pageTitle: 'Генератор ULID - Лексикографически Сортируемые ID',
    pageDescription: 'Генерация ULID с извлечением времени. Лексикографически сортируемые и URL-безопасные.',

    quantity: 'Количество',
    showTimestamp: 'Показать время',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    copyAll: 'Копировать все',

    copied: 'Скопировано!',
    copiedAll: 'Все ULID скопированы!',

    timestamp: 'Время',
    decode: 'Декодировать ULID',
    decodePlaceholder: 'Введите ULID для декодирования...',
    decodeButton: 'Декодировать',
    invalidUlid: 'Неверный формат ULID',

    featuresTitle: 'Возможности',
    feature1: 'Лексикографическая сортировка',
    feature2: 'Встроенная временная метка',
    feature3: 'URL-безопасные символы',
    feature4: '128-бит совместимость с UUID',

    aboutTitle: 'О ULID',
    aboutText: 'ULID (Universally Unique Lexicographically Sortable Identifier) сочетает временную метку со случайностью. В отличие от UUID, ULID сортируются по времени создания и используют только URL-безопасные символы.',
  },
};

export function getUlidGeneratorTranslations(locale: Locale) {
  return ulidGeneratorTranslations[locale];
}
