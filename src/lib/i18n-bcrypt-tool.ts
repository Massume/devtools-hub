import type { Locale } from './i18n';

export const bcryptToolTranslations = {
  en: {
    pageTitle: 'Bcrypt Hash Generator & Verifier',
    pageDescription: 'Generate and verify bcrypt password hashes with customizable cost factor',

    tabs: {
      generate: 'Generate',
      verify: 'Verify',
    },

    // Generate
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password to hash...',
    costLabel: 'Cost Factor (Rounds)',
    costHelp: 'Higher = more secure but slower. 10-12 recommended.',
    generateButton: 'Generate Hash',
    hashLabel: 'Bcrypt Hash',

    // Verify
    hashInputLabel: 'Bcrypt Hash',
    hashInputPlaceholder: 'Paste bcrypt hash to verify...',
    verifyPasswordLabel: 'Password to Verify',
    verifyPasswordPlaceholder: 'Enter password to verify...',
    verifyButton: 'Verify',

    verifyResult: {
      match: 'Password matches the hash!',
      noMatch: 'Password does NOT match the hash.',
    },

    // Common
    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied to clipboard!',
    generating: 'Generating...',
    verifying: 'Verifying...',

    hashInfo: 'Hash Information',
    version: 'Version',
    cost: 'Cost',
    salt: 'Salt',
    hashPart: 'Hash',

    featuresTitle: 'Features',
    feature1: 'Adjustable cost factor (4-31)',
    feature2: 'Automatic salt generation',
    feature3: 'Hash verification',
    feature4: 'Hash format analysis',

    aboutTitle: 'About Bcrypt',
    aboutText: 'Bcrypt is a password hashing function designed for security. It includes a salt to protect against rainbow tables and a cost factor that can be increased to make brute-force attacks slower. The cost factor determines how computationally expensive the hashing is - each increment doubles the time required.',

    costGuidelines: 'Cost Factor Guidelines',
    costGuidelinesText: 'Cost 10-12 is suitable for most web applications. Higher values provide better security but increase login time. A cost of 12 takes about 250ms on modern hardware.',
  },
  ru: {
    pageTitle: 'Bcrypt Генератор и Верификатор',
    pageDescription: 'Генерация и проверка bcrypt хешей паролей с настраиваемым фактором стоимости',

    tabs: {
      generate: 'Генерация',
      verify: 'Проверка',
    },

    // Generate
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль для хеширования...',
    costLabel: 'Фактор стоимости (раунды)',
    costHelp: 'Больше = безопаснее, но медленнее. Рекомендуется 10-12.',
    generateButton: 'Сгенерировать хеш',
    hashLabel: 'Bcrypt Хеш',

    // Verify
    hashInputLabel: 'Bcrypt Хеш',
    hashInputPlaceholder: 'Вставьте bcrypt хеш для проверки...',
    verifyPasswordLabel: 'Пароль для проверки',
    verifyPasswordPlaceholder: 'Введите пароль для проверки...',
    verifyButton: 'Проверить',

    verifyResult: {
      match: 'Пароль совпадает с хешем!',
      noMatch: 'Пароль НЕ совпадает с хешем.',
    },

    // Common
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    copied: 'Скопировано!',
    generating: 'Генерация...',
    verifying: 'Проверка...',

    hashInfo: 'Информация о хеше',
    version: 'Версия',
    cost: 'Стоимость',
    salt: 'Соль',
    hashPart: 'Хеш',

    featuresTitle: 'Возможности',
    feature1: 'Настраиваемый фактор стоимости (4-31)',
    feature2: 'Автоматическая генерация соли',
    feature3: 'Верификация хеша',
    feature4: 'Анализ формата хеша',

    aboutTitle: 'О Bcrypt',
    aboutText: 'Bcrypt — функция хеширования паролей, разработанная для безопасности. Включает соль для защиты от радужных таблиц и фактор стоимости, который можно увеличить для замедления брутфорс-атак. Фактор стоимости определяет вычислительную сложность — каждое увеличение удваивает время.',

    costGuidelines: 'Рекомендации по фактору стоимости',
    costGuidelinesText: 'Значение 10-12 подходит для большинства веб-приложений. Большие значения обеспечивают лучшую безопасность, но увеличивают время входа. Стоимость 12 занимает около 250мс на современном оборудовании.',
  },
};

export function getBcryptToolTranslations(locale: Locale) {
  return bcryptToolTranslations[locale];
}
