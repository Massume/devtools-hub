import type { Locale } from './i18n';

export const randomTextTranslations = {
  en: {
    pageTitle: 'Random Text Generator - Generate Random Strings',
    pageDescription: 'Generate random text, numbers, and alphanumeric strings',

    outputLabel: 'Generated Text',
    placeholder: 'Click Generate to create random text...',

    generateButton: 'Generate',
    copyButton: 'Copy',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',

    options: 'Options',
    textType: 'Text Type',
    typeLetters: 'Letters Only',
    typeNumbers: 'Numbers Only',
    typeAlphanumeric: 'Alphanumeric',
    typeHex: 'Hexadecimal',
    typeSymbols: 'With Symbols',

    length: 'Length',
    count: 'Count (lines)',
    uppercase: 'Include Uppercase',
    lowercase: 'Include Lowercase',
    separator: 'Separator',
    separatorNone: 'None',
    separatorNewline: 'New Line',
    separatorComma: 'Comma',
    separatorSpace: 'Space',

    featuresTitle: 'Features',
    feature1: 'Multiple text types (letters, numbers, hex)',
    feature2: 'Customizable length and count',
    feature3: 'Case options (uppercase/lowercase)',
    feature4: 'Cryptographically secure random',

    aboutTitle: 'About Random Text Generator',
    aboutText: 'Generate random strings for testing, passwords, tokens, and more. Uses cryptographically secure random number generation for high-quality randomness.',
  },
  ru: {
    pageTitle: 'Генератор Случайного Текста',
    pageDescription: 'Генерация случайного текста, чисел и алфавитно-цифровых строк',

    outputLabel: 'Сгенерированный текст',
    placeholder: 'Нажмите Сгенерировать для создания случайного текста...',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',

    options: 'Настройки',
    textType: 'Тип текста',
    typeLetters: 'Только буквы',
    typeNumbers: 'Только цифры',
    typeAlphanumeric: 'Буквы и цифры',
    typeHex: 'Шестнадцатеричный',
    typeSymbols: 'С символами',

    length: 'Длина',
    count: 'Количество (строк)',
    uppercase: 'Заглавные буквы',
    lowercase: 'Строчные буквы',
    separator: 'Разделитель',
    separatorNone: 'Нет',
    separatorNewline: 'Новая строка',
    separatorComma: 'Запятая',
    separatorSpace: 'Пробел',

    featuresTitle: 'Возможности',
    feature1: 'Разные типы текста (буквы, цифры, hex)',
    feature2: 'Настраиваемая длина и количество',
    feature3: 'Опции регистра (заглавные/строчные)',
    feature4: 'Криптографически безопасный генератор',

    aboutTitle: 'О Генераторе Случайного Текста',
    aboutText: 'Генерация случайных строк для тестирования, паролей, токенов и многого другого. Использует криптографически безопасную генерацию случайных чисел.',
  },
};

export function getRandomTextTranslations(locale: Locale) {
  return randomTextTranslations[locale];
}
