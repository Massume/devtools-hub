import type { Locale } from './i18n';

export const passwordGeneratorTranslations = {
  en: {
    pageTitle: 'Password Generator - Secure Random Passwords',
    pageDescription: 'Generate strong, secure random passwords with customizable options',

    length: 'Length',
    quantity: 'Quantity',

    options: 'Character Types',
    uppercase: 'Uppercase (A-Z)',
    lowercase: 'Lowercase (a-z)',
    numbers: 'Numbers (0-9)',
    symbols: 'Symbols (!@#$%)',

    advanced: 'Advanced Options',
    excludeAmbiguous: 'Exclude ambiguous (0O1lI)',
    excludeSimilar: 'Exclude similar brackets',
    customExclude: 'Custom exclude characters',

    generateButton: 'Generate',
    copyButton: 'Copy',
    copyAll: 'Copy All',
    regenerate: 'Regenerate',

    copied: 'Copied to clipboard!',
    copiedAll: 'All passwords copied!',

    strength: 'Strength',
    strengthWeak: 'Weak',
    strengthFair: 'Fair',
    strengthGood: 'Good',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very Strong',

    entropy: 'Entropy',
    bits: 'bits',

    featuresTitle: 'Features',
    feature1: 'Cryptographically secure random generation',
    feature2: 'Customizable character sets',
    feature3: 'Password strength indicator',
    feature4: 'Bulk password generation',

    aboutTitle: 'About Password Generator',
    aboutText: 'Generate secure passwords using cryptographically secure random number generation. All passwords are generated locally in your browser.',
  },
  ru: {
    pageTitle: 'Генератор Паролей - Безопасные Случайные Пароли',
    pageDescription: 'Генерация надёжных случайных паролей с настраиваемыми опциями',

    length: 'Длина',
    quantity: 'Количество',

    options: 'Типы символов',
    uppercase: 'Заглавные (A-Z)',
    lowercase: 'Строчные (a-z)',
    numbers: 'Цифры (0-9)',
    symbols: 'Символы (!@#$%)',

    advanced: 'Дополнительно',
    excludeAmbiguous: 'Исключить похожие (0O1lI)',
    excludeSimilar: 'Исключить похожие скобки',
    customExclude: 'Исключить символы',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    copyAll: 'Копировать все',
    regenerate: 'Обновить',

    copied: 'Скопировано!',
    copiedAll: 'Все пароли скопированы!',

    strength: 'Надёжность',
    strengthWeak: 'Слабый',
    strengthFair: 'Приемлемый',
    strengthGood: 'Хороший',
    strengthStrong: 'Сильный',
    strengthVeryStrong: 'Очень сильный',

    entropy: 'Энтропия',
    bits: 'бит',

    featuresTitle: 'Возможности',
    feature1: 'Криптографически безопасная генерация',
    feature2: 'Настраиваемые наборы символов',
    feature3: 'Индикатор надёжности пароля',
    feature4: 'Массовая генерация паролей',

    aboutTitle: 'О Генераторе Паролей',
    aboutText: 'Генерация безопасных паролей с использованием криптографически безопасного генератора случайных чисел. Все пароли генерируются локально в браузере.',
  },
};

export function getPasswordGeneratorTranslations(locale: Locale) {
  return passwordGeneratorTranslations[locale];
}
