import type { Locale } from './i18n';

export const uuidTranslations = {
  en: {
    // Page metadata
    pageTitle: 'UUID Generator - Generate UUIDs v1, v4, v5',
    pageDescription: 'Generate unique identifiers (UUIDs) in bulk with support for v1, v4, and v5 formats',

    // Versions
    version1: 'UUID v1',
    version4: 'UUID v4',
    version5: 'UUID v5',

    // Labels
    generateButton: 'Generate UUIDs',
    copyButton: 'Copy',
    copyAllButton: 'Copy All',
    clearButton: 'Clear',
    quantityLabel: 'Quantity',
    formatLabel: 'Format',
    namespaceLabel: 'Namespace (v5)',
    nameLabel: 'Name (v5)',

    // Format options
    formatUppercase: 'Uppercase',
    formatLowercase: 'Lowercase',
    formatHyphens: 'With Hyphens',
    formatNoHyphens: 'No Hyphens',

    // Placeholders
    namespacePlaceholder: 'Enter namespace UUID...',
    namePlaceholder: 'Enter name string...',

    // Messages
    copied: 'Copied to clipboard!',
    copiedAll: 'All UUIDs copied!',
    generated: 'Generated {{count}} UUIDs',
    invalidQuantity: 'Quantity must be between 1 and 1000',
    invalidNamespace: 'Invalid namespace UUID for v5',
    missingName: 'Name is required for UUID v5',

    // Info
    v1Description: 'Time-based UUID (includes timestamp and MAC address)',
    v4Description: 'Random UUID (most commonly used)',
    v5Description: 'SHA-1 hash-based UUID (deterministic from namespace and name)',

    // Features
    featuresTitle: 'Features',
    feature1: 'Generate up to 1000 UUIDs at once',
    feature2: 'Support for UUID v1, v4, and v5',
    feature3: 'Uppercase or lowercase format',
    feature4: 'With or without hyphens',
    feature5: 'Copy individual or all UUIDs',
    feature6: 'All generation done locally',

    // About
    aboutTitle: 'About UUIDs',
    aboutText: 'A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information. UUIDs are standardized by RFC 4122 and are designed to be unique across time and space without requiring a central registry.',
  },
  ru: {
    // Page metadata
    pageTitle: 'Генератор UUID - Генерация UUID v1, v4, v5',
    pageDescription: 'Генерация уникальных идентификаторов (UUID) массово с поддержкой форматов v1, v4 и v5',

    // Versions
    version1: 'UUID v1',
    version4: 'UUID v4',
    version5: 'UUID v5',

    // Labels
    generateButton: 'Генерировать UUID',
    copyButton: 'Копировать',
    copyAllButton: 'Копировать Все',
    clearButton: 'Очистить',
    quantityLabel: 'Количество',
    formatLabel: 'Формат',
    namespaceLabel: 'Пространство имён (v5)',
    nameLabel: 'Имя (v5)',

    // Format options
    formatUppercase: 'Верхний регистр',
    formatLowercase: 'Нижний регистр',
    formatHyphens: 'С дефисами',
    formatNoHyphens: 'Без дефисов',

    // Placeholders
    namespacePlaceholder: 'Введите UUID пространства имён...',
    namePlaceholder: 'Введите строку имени...',

    // Messages
    copied: 'Скопировано в буфер обмена!',
    copiedAll: 'Все UUID скопированы!',
    generated: 'Сгенерировано {{count}} UUID',
    invalidQuantity: 'Количество должно быть от 1 до 1000',
    invalidNamespace: 'Неверный UUID пространства имён для v5',
    missingName: 'Для UUID v5 требуется имя',

    // Info
    v1Description: 'UUID на основе времени (включает временную метку и MAC-адрес)',
    v4Description: 'Случайный UUID (наиболее часто используемый)',
    v5Description: 'UUID на основе SHA-1 хеша (детерминированный из пространства имён и имени)',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Генерация до 1000 UUID за раз',
    feature2: 'Поддержка UUID v1, v4 и v5',
    feature3: 'Формат в верхнем или нижнем регистре',
    feature4: 'С дефисами или без',
    feature5: 'Копирование отдельных UUID или всех сразу',
    feature6: 'Вся генерация выполняется локально',

    // About
    aboutTitle: 'О UUID',
    aboutText: 'UUID (Universally Unique Identifier) — это 128-битное число, используемое для уникальной идентификации информации. UUID стандартизированы RFC 4122 и разработаны для обеспечения уникальности во времени и пространстве без необходимости в централизованном реестре.',
  },
};

export function getUuidTranslations(locale: Locale) {
  return uuidTranslations[locale];
}
