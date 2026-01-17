import type { Locale } from './i18n';

export const multiHashTranslations = {
  en: {
    pageTitle: 'Multi-Hash Generator - All Hash Algorithms',
    pageDescription: 'Generate hashes using MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA-3, BLAKE2, RIPEMD-160, CRC32, and more',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Enter text to hash...',
    outputLabel: 'Hash Results',

    hashButton: 'Generate Hashes',
    copyButton: 'Copy',
    copyAllButton: 'Copy All',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',
    allCopied: 'All hashes copied!',

    selectAlgorithms: 'Select Algorithms',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',

    categories: {
      legacy: 'Legacy (Not Secure)',
      sha2: 'SHA-2 Family',
      sha3: 'SHA-3 Family',
      blake: 'BLAKE Family',
      other: 'Other Algorithms',
      checksum: 'Checksums',
    },

    algorithms: {
      md5: 'MD5',
      sha1: 'SHA-1',
      sha256: 'SHA-256',
      sha384: 'SHA-384',
      sha512: 'SHA-512',
      sha3_256: 'SHA-3 (256)',
      sha3_384: 'SHA-3 (384)',
      sha3_512: 'SHA-3 (512)',
      keccak256: 'Keccak-256',
      blake2b: 'BLAKE2b',
      blake2s: 'BLAKE2s',
      ripemd160: 'RIPEMD-160',
      crc32: 'CRC-32',
      adler32: 'Adler-32',
    },

    encoding: 'Output Encoding',
    encodingHex: 'Hexadecimal',
    encodingBase64: 'Base64',
    encodingUppercase: 'Uppercase',

    compareMode: 'Compare Mode',
    compareLabel: 'Expected Hash',
    comparePlaceholder: 'Paste expected hash to compare...',
    compareMatch: 'Match! Hashes are identical.',
    compareMismatch: 'Mismatch! Hashes are different.',

    featuresTitle: 'Features',
    feature1: '14 hash algorithms in one tool',
    feature2: 'Hex and Base64 output encoding',
    feature3: 'Quick compare mode for verification',
    feature4: 'Web Crypto API for secure hashing',

    aboutTitle: 'About Multi-Hash Generator',
    aboutText: 'Generate cryptographic hashes using multiple algorithms simultaneously. Includes modern secure algorithms (SHA-2, SHA-3, BLAKE2) and legacy algorithms (MD5, SHA-1) for compatibility. All hashing is performed locally in your browser.',

    warningLegacy: 'MD5 and SHA-1 are considered cryptographically broken. Use only for checksums or legacy compatibility.',
  },
  ru: {
    pageTitle: 'Мульти-Хеш Генератор',
    pageDescription: 'Генерация хешей MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA-3, BLAKE2, RIPEMD-160, CRC32 и других',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Введите текст для хеширования...',
    outputLabel: 'Результаты хеширования',

    hashButton: 'Сгенерировать хеши',
    copyButton: 'Копировать',
    copyAllButton: 'Копировать все',
    clearButton: 'Очистить',

    copied: 'Скопировано!',
    allCopied: 'Все хеши скопированы!',

    selectAlgorithms: 'Выбрать алгоритмы',
    selectAll: 'Выбрать все',
    deselectAll: 'Снять все',

    categories: {
      legacy: 'Устаревшие (небезопасные)',
      sha2: 'Семейство SHA-2',
      sha3: 'Семейство SHA-3',
      blake: 'Семейство BLAKE',
      other: 'Другие алгоритмы',
      checksum: 'Контрольные суммы',
    },

    algorithms: {
      md5: 'MD5',
      sha1: 'SHA-1',
      sha256: 'SHA-256',
      sha384: 'SHA-384',
      sha512: 'SHA-512',
      sha3_256: 'SHA-3 (256)',
      sha3_384: 'SHA-3 (384)',
      sha3_512: 'SHA-3 (512)',
      keccak256: 'Keccak-256',
      blake2b: 'BLAKE2b',
      blake2s: 'BLAKE2s',
      ripemd160: 'RIPEMD-160',
      crc32: 'CRC-32',
      adler32: 'Adler-32',
    },

    encoding: 'Кодировка вывода',
    encodingHex: 'Шестнадцатеричная',
    encodingBase64: 'Base64',
    encodingUppercase: 'Верхний регистр',

    compareMode: 'Режим сравнения',
    compareLabel: 'Ожидаемый хеш',
    comparePlaceholder: 'Вставьте ожидаемый хеш для сравнения...',
    compareMatch: 'Совпадает! Хеши идентичны.',
    compareMismatch: 'Не совпадает! Хеши отличаются.',

    featuresTitle: 'Возможности',
    feature1: '14 алгоритмов хеширования в одном инструменте',
    feature2: 'Hex и Base64 кодировка вывода',
    feature3: 'Быстрый режим сравнения для проверки',
    feature4: 'Web Crypto API для безопасного хеширования',

    aboutTitle: 'О Мульти-Хеш Генераторе',
    aboutText: 'Генерация криптографических хешей с использованием нескольких алгоритмов одновременно. Включает современные безопасные алгоритмы (SHA-2, SHA-3, BLAKE2) и устаревшие (MD5, SHA-1) для совместимости. Всё хеширование выполняется локально в браузере.',

    warningLegacy: 'MD5 и SHA-1 считаются криптографически небезопасными. Используйте только для контрольных сумм или совместимости.',
  },
};

export function getMultiHashTranslations(locale: Locale) {
  return multiHashTranslations[locale];
}
