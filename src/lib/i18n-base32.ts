import type { Locale } from './i18n';

export const base32Translations = {
  en: {
    pageTitle: 'Base32 Encoder/Decoder - Encode and Decode Base32',
    pageDescription: 'Encode text to Base32 or decode Base32 strings back to original format',

    encode: 'Encode',
    decode: 'Decode',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Encode to Base32',
    decodeButton: 'Decode from Base32',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to encode...',
    decodePlaceholder: 'Enter Base32 string to decode...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidBase32: 'Invalid Base32 string',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Encode text to Base32',
    feature2: 'Decode Base32 to text',
    feature3: 'RFC 4648 compliant',
    feature4: 'Copy to clipboard',
    feature5: 'All processing done locally',
    feature6: 'No data sent to server',

    aboutTitle: 'About Base32',
    aboutText: 'Base32 is a base-32 encoding scheme that uses 32 ASCII characters (A-Z and 2-7) to represent binary data. It is less efficient than Base64 but uses only uppercase letters and digits, making it more suitable for case-insensitive systems and manual entry.',
  },
  ru: {
    pageTitle: 'Base32 Кодировщик/Декодер - Кодирование и Декодирование Base32',
    pageDescription: 'Кодирование текста в Base32 или декодирование Base32 строк обратно в исходный формат',

    encode: 'Кодировать',
    decode: 'Декодировать',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Кодировать в Base32',
    decodeButton: 'Декодировать из Base32',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для кодирования...',
    decodePlaceholder: 'Введите Base32 строку для декодирования...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidBase32: 'Неверная Base32 строка',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Кодирование текста в Base32',
    feature2: 'Декодирование Base32 в текст',
    feature3: 'Соответствие RFC 4648',
    feature4: 'Копирование в буфер обмена',
    feature5: 'Вся обработка выполняется локально',
    feature6: 'Данные не отправляются на сервер',

    aboutTitle: 'О Base32',
    aboutText: 'Base32 — это схема кодирования с основанием 32, использующая 32 символа ASCII (A-Z и 2-7) для представления двоичных данных. Она менее эффективна чем Base64, но использует только заглавные буквы и цифры, что делает её более подходящей для систем без учёта регистра и ручного ввода.',
  },
};

export function getBase32Translations(locale: Locale) {
  return base32Translations[locale];
}
