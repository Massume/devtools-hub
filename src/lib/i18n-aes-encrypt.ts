import type { Locale } from './i18n';

export const aesEncryptTranslations = {
  en: {
    pageTitle: 'AES Encrypt/Decrypt - Secure Encryption Tool',
    pageDescription: 'Encrypt and decrypt data using AES-256-GCM, the gold standard for symmetric encryption',

    tabs: {
      encrypt: 'Encrypt',
      decrypt: 'Decrypt',
    },

    // Encrypt
    plaintextLabel: 'Plaintext',
    plaintextPlaceholder: 'Enter text to encrypt...',
    encryptButton: 'Encrypt',

    // Decrypt
    ciphertextLabel: 'Ciphertext (Base64)',
    ciphertextPlaceholder: 'Paste encrypted data to decrypt...',
    decryptButton: 'Decrypt',
    decryptedLabel: 'Decrypted Text',

    // Common
    passwordLabel: 'Password / Key',
    passwordPlaceholder: 'Enter encryption password...',
    algorithmLabel: 'Algorithm',
    outputLabel: 'Encrypted Output',
    outputFormatLabel: 'Output Format',
    formatBase64: 'Base64',
    formatHex: 'Hexadecimal',

    generateKeyButton: 'Generate Random Key',
    showPassword: 'Show',
    hidePassword: 'Hide',

    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied to clipboard!',
    encrypting: 'Encrypting...',
    decrypting: 'Decrypting...',

    error: {
      decryptFailed: 'Decryption failed. Wrong password or corrupted data.',
      invalidFormat: 'Invalid ciphertext format.',
    },

    algorithmInfo: {
      'AES-GCM': 'AES-GCM (Recommended) - Authenticated encryption with integrity check',
      'AES-CBC': 'AES-CBC - Classic mode, requires separate integrity check',
    },

    featuresTitle: 'Features',
    feature1: 'AES-256-GCM authenticated encryption',
    feature2: 'Secure key derivation with PBKDF2',
    feature3: 'Random IV generation for each encryption',
    feature4: 'Base64 and Hex output formats',

    aboutTitle: 'About AES Encryption',
    aboutText: 'AES (Advanced Encryption Standard) is the gold standard for symmetric encryption, used worldwide to protect sensitive data. AES-GCM provides authenticated encryption, ensuring both confidentiality and integrity. The password is converted to a 256-bit key using PBKDF2 with 100,000 iterations.',

    securityNote: 'Your data is encrypted locally in your browser. Nothing is sent to any server.',
  },
  ru: {
    pageTitle: 'AES Шифрование/Дешифрование',
    pageDescription: 'Шифрование и дешифрование данных с помощью AES-256-GCM — золотого стандарта симметричного шифрования',

    tabs: {
      encrypt: 'Зашифровать',
      decrypt: 'Расшифровать',
    },

    // Encrypt
    plaintextLabel: 'Открытый текст',
    plaintextPlaceholder: 'Введите текст для шифрования...',
    encryptButton: 'Зашифровать',

    // Decrypt
    ciphertextLabel: 'Шифротекст (Base64)',
    ciphertextPlaceholder: 'Вставьте зашифрованные данные для расшифровки...',
    decryptButton: 'Расшифровать',
    decryptedLabel: 'Расшифрованный текст',

    // Common
    passwordLabel: 'Пароль / Ключ',
    passwordPlaceholder: 'Введите пароль шифрования...',
    algorithmLabel: 'Алгоритм',
    outputLabel: 'Зашифрованный вывод',
    outputFormatLabel: 'Формат вывода',
    formatBase64: 'Base64',
    formatHex: 'Шестнадцатеричный',

    generateKeyButton: 'Сгенерировать случайный ключ',
    showPassword: 'Показать',
    hidePassword: 'Скрыть',

    copyButton: 'Копировать',
    clearButton: 'Очистить',
    copied: 'Скопировано!',
    encrypting: 'Шифрование...',
    decrypting: 'Расшифровка...',

    error: {
      decryptFailed: 'Расшифровка не удалась. Неверный пароль или повреждённые данные.',
      invalidFormat: 'Неверный формат шифротекста.',
    },

    algorithmInfo: {
      'AES-GCM': 'AES-GCM (Рекомендуется) - Аутентифицированное шифрование с проверкой целостности',
      'AES-CBC': 'AES-CBC - Классический режим, требует отдельной проверки целостности',
    },

    featuresTitle: 'Возможности',
    feature1: 'AES-256-GCM аутентифицированное шифрование',
    feature2: 'Безопасное получение ключа с PBKDF2',
    feature3: 'Случайный IV для каждого шифрования',
    feature4: 'Форматы вывода Base64 и Hex',

    aboutTitle: 'Об AES Шифровании',
    aboutText: 'AES (Advanced Encryption Standard) — золотой стандарт симметричного шифрования, используемый по всему миру для защиты данных. AES-GCM обеспечивает аутентифицированное шифрование, гарантируя конфиденциальность и целостность. Пароль преобразуется в 256-битный ключ с помощью PBKDF2 со 100,000 итераций.',

    securityNote: 'Ваши данные шифруются локально в браузере. Ничего не отправляется на сервер.',
  },
};

export function getAesEncryptTranslations(locale: Locale) {
  return aesEncryptTranslations[locale];
}
