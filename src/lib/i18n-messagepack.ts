import type { Locale } from './i18n';

export const messagepackTranslations = {
  en: {
    pageTitle: 'MessagePack ↔ JSON Converter',
    pageDescription: 'Convert between MessagePack binary format and JSON',

    jsonToMsgpack: 'JSON → MessagePack',
    msgpackToJson: 'MessagePack → JSON',

    inputLabel: 'Input',
    outputLabel: 'Output',

    jsonPlaceholder: 'Enter JSON...',
    msgpackPlaceholder: 'Enter MessagePack (Base64 or Hex)...',

    encodeButton: 'Encode',
    decodeButton: 'Decode',
    copyButton: 'Copy',
    clearButton: 'Clear',
    formatJsonButton: 'Format JSON',

    outputFormat: 'Output Format',
    base64: 'Base64',
    hex: 'Hex',

    sizeComparison: 'Size Comparison',
    jsonSize: 'JSON Size',
    msgpackSize: 'MessagePack Size',
    savings: 'Savings',
    bytes: 'bytes',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidJson: 'Invalid JSON',
    invalidMsgpack: 'Invalid MessagePack data',
    emptyInput: 'Please enter data',

    examplesTitle: 'Examples',
    exampleSimple: 'Simple Object',
    exampleArray: 'Array',
    exampleNested: 'Nested Data',
    exampleTypes: 'Various Types',

    featuresTitle: 'Features',
    feature1: 'Encode JSON to MessagePack',
    feature2: 'Decode MessagePack to JSON',
    feature3: 'Base64 and Hex output formats',
    feature4: 'Size comparison with JSON',
    feature5: 'Support for all JSON types',
    feature6: 'All processing done locally',

    aboutTitle: 'About MessagePack',
    aboutText: 'MessagePack is an efficient binary serialization format. It\'s like JSON, but faster and smaller. MessagePack is used in many applications including Redis, Fluentd, and game engines. It supports all JSON types plus binary data and extension types.',
  },
  ru: {
    pageTitle: 'MessagePack ↔ JSON Конвертер',
    pageDescription: 'Конвертация между бинарным форматом MessagePack и JSON',

    jsonToMsgpack: 'JSON → MessagePack',
    msgpackToJson: 'MessagePack → JSON',

    inputLabel: 'Ввод',
    outputLabel: 'Результат',

    jsonPlaceholder: 'Введите JSON...',
    msgpackPlaceholder: 'Введите MessagePack (Base64 или Hex)...',

    encodeButton: 'Закодировать',
    decodeButton: 'Декодировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    formatJsonButton: 'Форматировать JSON',

    outputFormat: 'Формат Вывода',
    base64: 'Base64',
    hex: 'Hex',

    sizeComparison: 'Сравнение Размеров',
    jsonSize: 'Размер JSON',
    msgpackSize: 'Размер MessagePack',
    savings: 'Экономия',
    bytes: 'байт',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidJson: 'Неверный JSON',
    invalidMsgpack: 'Неверные данные MessagePack',
    emptyInput: 'Пожалуйста, введите данные',

    examplesTitle: 'Примеры',
    exampleSimple: 'Простой объект',
    exampleArray: 'Массив',
    exampleNested: 'Вложенные данные',
    exampleTypes: 'Разные типы',

    featuresTitle: 'Возможности',
    feature1: 'Кодирование JSON в MessagePack',
    feature2: 'Декодирование MessagePack в JSON',
    feature3: 'Форматы вывода Base64 и Hex',
    feature4: 'Сравнение размера с JSON',
    feature5: 'Поддержка всех типов JSON',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О MessagePack',
    aboutText: 'MessagePack — эффективный бинарный формат сериализации. Он похож на JSON, но быстрее и компактнее. MessagePack используется во многих приложениях, включая Redis, Fluentd и игровые движки. Он поддерживает все типы JSON плюс бинарные данные и типы расширений.',
  },
};

export function getMessagepackTranslations(locale: Locale) {
  return messagepackTranslations[locale];
}
