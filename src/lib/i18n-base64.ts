import type { Locale } from './i18n';

export const base64Translations = {
  en: {
    // Page metadata
    pageTitle: 'Base64 Encoder/Decoder - Encode and Decode Base64',
    pageDescription: 'Encode text and files to Base64 or decode Base64 strings back to original format',

    // Modes
    encode: 'Encode',
    decode: 'Decode',

    // Labels
    inputLabel: 'Input',
    outputLabel: 'Output',
    textInput: 'Text Input',
    fileInput: 'File Input',

    // Actions
    encodeButton: 'Encode to Base64',
    decodeButton: 'Decode from Base64',
    copyButton: 'Copy Result',
    downloadButton: 'Download',
    clearButton: 'Clear',
    uploadFile: 'Upload File',

    // Placeholders
    encodePlaceholder: 'Enter text to encode...',
    decodePlaceholder: 'Enter Base64 string to decode...',

    // Messages
    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidBase64: 'Invalid Base64 string',
    emptyInput: 'Please enter some data',
    fileTooBig: 'File is too large (max 10MB)',
    fileEncoded: 'File encoded successfully',

    // Features
    featuresTitle: 'Features',
    feature1: 'Encode text to Base64',
    feature2: 'Decode Base64 to text',
    feature3: 'Encode files to Base64',
    feature4: 'Download decoded files',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    // Info
    aboutTitle: 'About Base64',
    aboutText: 'Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. It\'s commonly used to encode binary data for transmission over media designed to handle text.',
  },
  ru: {
    // Page metadata
    pageTitle: 'Base64 Кодировщик/Декодер - Кодирование и Декодирование Base64',
    pageDescription: 'Кодирование текста и файлов в Base64 или декодирование Base64 строк обратно в исходный формат',

    // Modes
    encode: 'Кодировать',
    decode: 'Декодировать',

    // Labels
    inputLabel: 'Ввод',
    outputLabel: 'Вывод',
    textInput: 'Текстовый Ввод',
    fileInput: 'Загрузка Файла',

    // Actions
    encodeButton: 'Кодировать в Base64',
    decodeButton: 'Декодировать из Base64',
    copyButton: 'Копировать Результат',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',
    uploadFile: 'Загрузить Файл',

    // Placeholders
    encodePlaceholder: 'Введите текст для кодирования...',
    decodePlaceholder: 'Введите Base64 строку для декодирования...',

    // Messages
    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidBase64: 'Неверная Base64 строка',
    emptyInput: 'Пожалуйста, введите данные',
    fileTooBig: 'Файл слишком большой (макс 10МБ)',
    fileEncoded: 'Файл успешно закодирован',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Кодирование текста в Base64',
    feature2: 'Декодирование Base64 в текст',
    feature3: 'Кодирование файлов в Base64',
    feature4: 'Скачивание декодированных файлов',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    // Info
    aboutTitle: 'О Base64',
    aboutText: 'Base64 — это схема кодирования бинарных данных в текст, представляющая двоичные данные в формате ASCII строки. Обычно используется для кодирования двоичных данных для передачи по каналам, предназначенным для текста.',
  },
};

export function getBase64Translations(locale: Locale) {
  return base64Translations[locale];
}
