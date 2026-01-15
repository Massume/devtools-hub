import type { Locale } from './i18n';

export const hexTranslations = {
  en: {
    pageTitle: 'Hex Converter - Hexadecimal Encoder/Decoder',
    pageDescription: 'Convert text to hexadecimal or decode hex strings back to text',

    encode: 'Text to Hex',
    decode: 'Hex to Text',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Hex',
    decodeButton: 'Convert to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to convert to hex...',
    decodePlaceholder: 'Enter hex string (e.g., 48656c6c6f)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidHex: 'Invalid hexadecimal string',
    emptyInput: 'Please enter some data',

    // Format options
    formatOptions: 'Format Options',
    uppercase: 'Uppercase (A-F)',
    withSpaces: 'Space between bytes',
    withPrefix: '0x prefix',

    featuresTitle: 'Features',
    feature1: 'Convert text to hexadecimal',
    feature2: 'Decode hex to readable text',
    feature3: 'Multiple format options',
    feature4: 'Copy to clipboard',
    feature5: 'Instant conversion',
    feature6: 'All processing done locally',

    aboutTitle: 'About Hexadecimal',
    aboutText: 'Hexadecimal (base-16) uses digits 0-9 and letters A-F to represent values. Each hex digit represents 4 bits, making two hex digits equal to one byte. It is commonly used in programming for memory addresses, color codes, and binary data representation.',
  },
  ru: {
    pageTitle: 'Hex Конвертер - Шестнадцатеричный Кодировщик/Декодер',
    pageDescription: 'Конвертация текста в шестнадцатеричный формат или декодирование hex строк обратно в текст',

    encode: 'Текст в Hex',
    decode: 'Hex в Текст',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Hex',
    decodeButton: 'Конвертировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для конвертации в hex...',
    decodePlaceholder: 'Введите hex строку (например, 48656c6c6f)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidHex: 'Неверная шестнадцатеричная строка',
    emptyInput: 'Пожалуйста, введите данные',

    formatOptions: 'Опции Формата',
    uppercase: 'Верхний регистр (A-F)',
    withSpaces: 'Пробел между байтами',
    withPrefix: 'Префикс 0x',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в шестнадцатеричный формат',
    feature2: 'Декодирование hex в читаемый текст',
    feature3: 'Множество опций формата',
    feature4: 'Копирование в буфер обмена',
    feature5: 'Мгновенная конвертация',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Шестнадцатеричной Системе',
    aboutText: 'Шестнадцатеричная система (base-16) использует цифры 0-9 и буквы A-F для представления значений. Каждая hex цифра представляет 4 бита, что делает две hex цифры равными одному байту. Широко используется в программировании для адресов памяти, цветовых кодов и представления двоичных данных.',
  },
};

export function getHexTranslations(locale: Locale) {
  return hexTranslations[locale];
}
