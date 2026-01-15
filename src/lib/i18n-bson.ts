import type { Locale } from './i18n';

export const bsonTranslations = {
  en: {
    pageTitle: 'BSON ↔ JSON Converter',
    pageDescription: 'Convert between BSON (MongoDB binary format) and JSON',

    jsonToBson: 'JSON → BSON',
    bsonToJson: 'BSON → JSON',

    inputLabel: 'Input',
    outputLabel: 'Output',

    jsonPlaceholder: 'Enter JSON or Extended JSON...',
    bsonPlaceholder: 'Enter BSON (Base64 or Hex)...',

    encodeButton: 'Encode',
    decodeButton: 'Decode',
    copyButton: 'Copy',
    clearButton: 'Clear',
    formatJsonButton: 'Format JSON',
    generateObjectId: 'Generate ObjectId',

    outputFormat: 'Output Format',
    base64: 'Base64',
    hex: 'Hex',

    extendedJson: 'Extended JSON Mode',
    relaxed: 'Relaxed',
    canonical: 'Canonical',

    sizeComparison: 'Size Comparison',
    jsonSize: 'JSON Size',
    bsonSize: 'BSON Size',
    bytes: 'bytes',

    specialTypes: 'BSON Special Types',
    objectId: 'ObjectId',
    date: 'Date',
    binary: 'Binary',
    decimal128: 'Decimal128',
    int64: 'Int64',
    timestamp: 'Timestamp',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidJson: 'Invalid JSON',
    invalidBson: 'Invalid BSON data',
    emptyInput: 'Please enter data',
    objectIdGenerated: 'ObjectId generated!',

    examplesTitle: 'Examples',
    exampleSimple: 'Simple Document',
    exampleObjectId: 'With ObjectId',
    exampleDate: 'With Date',
    exampleMixed: 'Mixed Types',

    featuresTitle: 'Features',
    feature1: 'Encode JSON to BSON',
    feature2: 'Decode BSON to Extended JSON',
    feature3: 'ObjectId generation',
    feature4: 'Support for BSON special types',
    feature5: 'Relaxed and Canonical modes',
    feature6: 'All processing done locally',

    aboutTitle: 'About BSON',
    aboutText: 'BSON (Binary JSON) is the binary serialization format used by MongoDB. It extends JSON with additional types like ObjectId, Date, Binary data, and Decimal128. BSON is designed for efficient storage and scanning of MongoDB documents.',
  },
  ru: {
    pageTitle: 'BSON ↔ JSON Конвертер',
    pageDescription: 'Конвертация между BSON (бинарный формат MongoDB) и JSON',

    jsonToBson: 'JSON → BSON',
    bsonToJson: 'BSON → JSON',

    inputLabel: 'Ввод',
    outputLabel: 'Результат',

    jsonPlaceholder: 'Введите JSON или Extended JSON...',
    bsonPlaceholder: 'Введите BSON (Base64 или Hex)...',

    encodeButton: 'Закодировать',
    decodeButton: 'Декодировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    formatJsonButton: 'Форматировать JSON',
    generateObjectId: 'Сгенерировать ObjectId',

    outputFormat: 'Формат Вывода',
    base64: 'Base64',
    hex: 'Hex',

    extendedJson: 'Режим Extended JSON',
    relaxed: 'Relaxed',
    canonical: 'Canonical',

    sizeComparison: 'Сравнение Размеров',
    jsonSize: 'Размер JSON',
    bsonSize: 'Размер BSON',
    bytes: 'байт',

    specialTypes: 'Специальные Типы BSON',
    objectId: 'ObjectId',
    date: 'Date',
    binary: 'Binary',
    decimal128: 'Decimal128',
    int64: 'Int64',
    timestamp: 'Timestamp',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidJson: 'Неверный JSON',
    invalidBson: 'Неверные данные BSON',
    emptyInput: 'Пожалуйста, введите данные',
    objectIdGenerated: 'ObjectId сгенерирован!',

    examplesTitle: 'Примеры',
    exampleSimple: 'Простой документ',
    exampleObjectId: 'С ObjectId',
    exampleDate: 'С датой',
    exampleMixed: 'Смешанные типы',

    featuresTitle: 'Возможности',
    feature1: 'Кодирование JSON в BSON',
    feature2: 'Декодирование BSON в Extended JSON',
    feature3: 'Генерация ObjectId',
    feature4: 'Поддержка специальных типов BSON',
    feature5: 'Режимы Relaxed и Canonical',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О BSON',
    aboutText: 'BSON (Binary JSON) — бинарный формат сериализации, используемый MongoDB. Он расширяет JSON дополнительными типами: ObjectId, Date, Binary данные и Decimal128. BSON разработан для эффективного хранения и сканирования документов MongoDB.',
  },
};

export function getBsonTranslations(locale: Locale) {
  return bsonTranslations[locale];
}
