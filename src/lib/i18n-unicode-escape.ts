import type { Locale } from './i18n';

export const unicodeEscapeTranslations = {
  en: {
    pageTitle: 'Unicode Escape Converter',
    pageDescription: 'Convert text to Unicode escape sequences (\\u0000) or decode them back to characters',

    encode: 'To Unicode',
    decode: 'From Unicode',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to \\uXXXX',
    decodeButton: 'Decode to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to convert to Unicode escapes...',
    decodePlaceholder: 'Enter Unicode escape sequences (e.g., \\u0048\\u0065\\u006c\\u006c\\u006f)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidUnicode: 'Invalid Unicode escape sequence',
    emptyInput: 'Please enter some data',

    // Options
    formatOptions: 'Format Options',
    escapeAll: 'Escape all characters',
    escapeNonAscii: 'Escape non-ASCII only',
    uppercase: 'Uppercase (\\u004A)',
    lowercase: 'Lowercase (\\u004a)',

    featuresTitle: 'Features',
    feature1: 'Convert text to \\uXXXX format',
    feature2: 'Decode Unicode escapes to text',
    feature3: 'Supports all Unicode characters',
    feature4: 'Multiple format options',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Unicode Escape',
    aboutText: 'Unicode escape sequences (\\uXXXX) are a way to represent Unicode characters using ASCII text. Each \\u is followed by exactly four hexadecimal digits representing the character code point. This format is commonly used in programming languages like JavaScript, Java, and Python for representing special characters in string literals.',
  },
  ru: {
    pageTitle: 'Конвертер Unicode Escape',
    pageDescription: 'Конвертация текста в Unicode escape последовательности (\\u0000) или декодирование обратно в символы',

    encode: 'В Unicode',
    decode: 'Из Unicode',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в \\uXXXX',
    decodeButton: 'Декодировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для конвертации в Unicode escape...',
    decodePlaceholder: 'Введите Unicode escape последовательности (например, \\u0048\\u0065\\u006c\\u006c\\u006f)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidUnicode: 'Неверная Unicode escape последовательность',
    emptyInput: 'Пожалуйста, введите данные',

    formatOptions: 'Опции Формата',
    escapeAll: 'Экранировать все символы',
    escapeNonAscii: 'Экранировать только не-ASCII',
    uppercase: 'Верхний регистр (\\u004A)',
    lowercase: 'Нижний регистр (\\u004a)',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в формат \\uXXXX',
    feature2: 'Декодирование Unicode escapes в текст',
    feature3: 'Поддержка всех Unicode символов',
    feature4: 'Множество опций формата',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Unicode Escape',
    aboutText: 'Unicode escape последовательности (\\uXXXX) — это способ представления Unicode символов с помощью ASCII текста. За каждым \\u следуют ровно четыре шестнадцатеричные цифры, представляющие кодовую точку символа. Этот формат широко используется в языках программирования, таких как JavaScript, Java и Python для представления специальных символов в строковых литералах.',
  },
};

export function getUnicodeEscapeTranslations(locale: Locale) {
  return unicodeEscapeTranslations[locale];
}
