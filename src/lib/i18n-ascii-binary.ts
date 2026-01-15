import type { Locale } from './i18n';

export const asciiBinaryTranslations = {
  en: {
    pageTitle: 'ASCII to Binary Converter',
    pageDescription: 'Convert text to binary code or decode binary back to text',

    encode: 'Text to Binary',
    decode: 'Binary to Text',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Binary',
    decodeButton: 'Convert to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to convert to binary...',
    decodePlaceholder: 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidBinary: 'Invalid binary string',
    emptyInput: 'Please enter some data',

    // Options
    formatOptions: 'Format Options',
    withSpaces: 'Space between bytes',
    bits8: '8-bit (standard)',

    featuresTitle: 'Features',
    feature1: 'Convert text to binary (0s and 1s)',
    feature2: 'Decode binary back to text',
    feature3: '8-bit ASCII encoding',
    feature4: 'Flexible input format',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Binary',
    aboutText: 'Binary is the most basic number system used by computers, using only two digits: 0 and 1. Each character in text can be represented by 8 bits (1 byte) of binary data. For example, the letter "A" is represented as 01000001 in binary (ASCII code 65).',
  },
  ru: {
    pageTitle: 'Конвертер ASCII в Двоичный Код',
    pageDescription: 'Конвертация текста в двоичный код или декодирование двоичного кода обратно в текст',

    encode: 'Текст в Двоичный',
    decode: 'Двоичный в Текст',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Двоичный',
    decodeButton: 'Конвертировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для конвертации в двоичный код...',
    decodePlaceholder: 'Введите двоичный код (например, 01001000 01100101 01101100 01101100 01101111)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidBinary: 'Неверная двоичная строка',
    emptyInput: 'Пожалуйста, введите данные',

    formatOptions: 'Опции Формата',
    withSpaces: 'Пробел между байтами',
    bits8: '8 бит (стандарт)',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в двоичный код (0 и 1)',
    feature2: 'Декодирование двоичного кода обратно в текст',
    feature3: '8-битное ASCII кодирование',
    feature4: 'Гибкий формат ввода',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Двоичном Коде',
    aboutText: 'Двоичная система — это самая базовая система счисления, используемая компьютерами, использующая только две цифры: 0 и 1. Каждый символ текста может быть представлен 8 битами (1 байт) двоичных данных. Например, буква "A" представляется как 01000001 в двоичном коде (ASCII код 65).',
  },
};

export function getAsciiBinaryTranslations(locale: Locale) {
  return asciiBinaryTranslations[locale];
}
