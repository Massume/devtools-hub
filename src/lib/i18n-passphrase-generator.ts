import type { Locale } from './i18n';

export const passphraseGeneratorTranslations = {
  en: {
    pageTitle: 'Passphrase Generator - Memorable Secure Passwords',
    pageDescription: 'Generate secure passphrases using the diceware method - memorable yet strong',

    wordCount: 'Word Count',
    separator: 'Separator',
    quantity: 'Quantity',

    capitalize: 'Capitalize Words',
    includeNumber: 'Include Number',

    separatorDash: 'Dash (-)',
    separatorUnderscore: 'Underscore (_)',
    separatorDot: 'Dot (.)',
    separatorSpace: 'Space ( )',
    separatorNone: 'None',

    generateButton: 'Generate',
    copyButton: 'Copy',
    copyAll: 'Copy All',

    copied: 'Copied to clipboard!',
    copiedAll: 'All passphrases copied!',

    entropy: 'Entropy',
    bits: 'bits',
    crackTime: 'Time to crack',

    featuresTitle: 'Features',
    feature1: 'EFF diceware wordlist',
    feature2: 'Cryptographically secure',
    feature3: 'Easy to remember',
    feature4: 'Configurable separators',

    aboutTitle: 'About Passphrase Generator',
    aboutText: 'Passphrases are more secure and easier to remember than random character passwords. Using the EFF diceware wordlist, each word adds about 10 bits of entropy.',
  },
  ru: {
    pageTitle: 'Генератор Парольных Фраз',
    pageDescription: 'Генерация безопасных парольных фраз методом diceware - запоминаемых и надёжных',

    wordCount: 'Количество слов',
    separator: 'Разделитель',
    quantity: 'Количество',

    capitalize: 'С заглавной буквы',
    includeNumber: 'Добавить число',

    separatorDash: 'Дефис (-)',
    separatorUnderscore: 'Подчёркивание (_)',
    separatorDot: 'Точка (.)',
    separatorSpace: 'Пробел ( )',
    separatorNone: 'Без разделителя',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    copyAll: 'Копировать все',

    copied: 'Скопировано!',
    copiedAll: 'Все фразы скопированы!',

    entropy: 'Энтропия',
    bits: 'бит',
    crackTime: 'Время взлома',

    featuresTitle: 'Возможности',
    feature1: 'Словарь EFF diceware',
    feature2: 'Криптографически безопасно',
    feature3: 'Легко запомнить',
    feature4: 'Настраиваемые разделители',

    aboutTitle: 'О Генераторе Парольных Фраз',
    aboutText: 'Парольные фразы более безопасны и легче запоминаются, чем случайные пароли. Используя словарь EFF diceware, каждое слово добавляет около 10 бит энтропии.',
  },
};

export function getPassphraseGeneratorTranslations(locale: Locale) {
  return passphraseGeneratorTranslations[locale];
}
