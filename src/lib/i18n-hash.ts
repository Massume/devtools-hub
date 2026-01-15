import type { Locale } from './i18n';

export const hashTranslations = {
  en: {
    // Page metadata
    pageTitle: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512',
    pageDescription: 'Generate cryptographic hashes for text and files using MD5, SHA-1, SHA-256, and SHA-512 algorithms',

    // Algorithms
    algorithmMD5: 'MD5',
    algorithmSHA1: 'SHA-1',
    algorithmSHA256: 'SHA-256',
    algorithmSHA512: 'SHA-512',

    // Labels
    inputLabel: 'Input',
    textInput: 'Text Input',
    fileInput: 'File Input',
    hashResult: 'Hash Result',

    // Actions
    generateButton: 'Generate Hash',
    copyButton: 'Copy Hash',
    clearButton: 'Clear',
    uploadFile: 'Upload File',

    // Placeholders
    inputPlaceholder: 'Enter text to hash...',

    // Messages
    copied: 'Hash copied to clipboard!',
    generated: 'Hash generated successfully!',
    emptyInput: 'Please enter some text or upload a file',
    fileTooBig: 'File is too large (max 50MB)',
    fileHashed: 'File hashed successfully',
    processingFile: 'Processing file...',

    // Format options
    formatUppercase: 'Uppercase',
    formatLowercase: 'Lowercase',

    // Info
    md5Description: '128-bit hash (32 hex characters). Fast but not cryptographically secure.',
    sha1Description: '160-bit hash (40 hex characters). Deprecated for security applications.',
    sha256Description: '256-bit hash (64 hex characters). Widely used and secure.',
    sha512Description: '512-bit hash (128 hex characters). Most secure, slower computation.',

    // Features
    featuresTitle: 'Features',
    feature1: 'Support for MD5, SHA-1, SHA-256, SHA-512',
    feature2: 'Hash text instantly',
    feature3: 'Hash files up to 50MB',
    feature4: 'Uppercase or lowercase output',
    feature5: 'Copy hash with one click',
    feature6: 'All processing done locally',

    // About
    aboutTitle: 'About Cryptographic Hashes',
    aboutText: 'A cryptographic hash function is a mathematical algorithm that maps data of arbitrary size to a fixed-size hash value. Hash functions are one-way functions - you cannot reverse the process to get the original data. They are commonly used for data integrity verification, password storage, and digital signatures.',

    // Security note
    securityNote: 'Note: MD5 and SHA-1 are considered cryptographically broken and should not be used for security purposes. Use SHA-256 or SHA-512 for secure applications.',
  },
  ru: {
    // Page metadata
    pageTitle: 'Генератор Хешей - MD5, SHA-1, SHA-256, SHA-512',
    pageDescription: 'Генерация криптографических хешей для текста и файлов с использованием алгоритмов MD5, SHA-1, SHA-256 и SHA-512',

    // Algorithms
    algorithmMD5: 'MD5',
    algorithmSHA1: 'SHA-1',
    algorithmSHA256: 'SHA-256',
    algorithmSHA512: 'SHA-512',

    // Labels
    inputLabel: 'Ввод',
    textInput: 'Текстовый Ввод',
    fileInput: 'Загрузка Файла',
    hashResult: 'Результат Хеша',

    // Actions
    generateButton: 'Генерировать Хеш',
    copyButton: 'Копировать Хеш',
    clearButton: 'Очистить',
    uploadFile: 'Загрузить Файл',

    // Placeholders
    inputPlaceholder: 'Введите текст для хеширования...',

    // Messages
    copied: 'Хеш скопирован в буфер обмена!',
    generated: 'Хеш успешно сгенерирован!',
    emptyInput: 'Пожалуйста, введите текст или загрузите файл',
    fileTooBig: 'Файл слишком большой (макс 50МБ)',
    fileHashed: 'Файл успешно хеширован',
    processingFile: 'Обработка файла...',

    // Format options
    formatUppercase: 'Верхний регистр',
    formatLowercase: 'Нижний регистр',

    // Info
    md5Description: '128-битный хеш (32 hex символа). Быстрый, но криптографически небезопасный.',
    sha1Description: '160-битный хеш (40 hex символов). Устаревший для безопасности.',
    sha256Description: '256-битный хеш (64 hex символа). Широко используется и безопасен.',
    sha512Description: '512-битный хеш (128 hex символов). Самый безопасный, медленнее вычисляется.',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Поддержка MD5, SHA-1, SHA-256, SHA-512',
    feature2: 'Мгновенное хеширование текста',
    feature3: 'Хеширование файлов до 50МБ',
    feature4: 'Вывод в верхнем или нижнем регистре',
    feature5: 'Копирование хеша одним кликом',
    feature6: 'Вся обработка выполняется локально',

    // About
    aboutTitle: 'О Криптографических Хешах',
    aboutText: 'Криптографическая хеш-функция — это математический алгоритм, который отображает данные произвольного размера в хеш-значение фиксированного размера. Хеш-функции — это односторонние функции, вы не можете обратить процесс, чтобы получить исходные данные. Они обычно используются для проверки целостности данных, хранения паролей и цифровых подписей.',

    // Security note
    securityNote: 'Примечание: MD5 и SHA-1 считаются криптографически взломанными и не должны использоваться в целях безопасности. Используйте SHA-256 или SHA-512 для безопасных приложений.',
  },
};

export function getHashTranslations(locale: Locale) {
  return hashTranslations[locale];
}
