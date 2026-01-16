import type { Locale } from './i18n';

export const nanoidGeneratorTranslations = {
  en: {
    pageTitle: 'NanoID Generator - Compact Unique IDs',
    pageDescription: 'Generate compact, URL-safe unique identifiers with customizable length and alphabet',

    length: 'Length',
    quantity: 'Quantity',
    alphabet: 'Alphabet',

    alphabetDefault: 'Default (URL-safe)',
    alphabetCustom: 'Custom',

    customAlphabet: 'Custom Alphabet',
    customAlphabetPlaceholder: 'Enter custom characters...',

    generateButton: 'Generate',
    copyButton: 'Copy',
    copyAll: 'Copy All',

    copied: 'Copied to clipboard!',
    copiedAll: 'All IDs copied!',

    collision: 'Collision Probability',
    toHave1Collision: 'To have 1% collision probability, need to generate',
    ids: 'IDs',

    featuresTitle: 'Features',
    feature1: 'Compact and URL-safe',
    feature2: 'Customizable length',
    feature3: 'Custom alphabet support',
    feature4: 'Cryptographically secure',

    aboutTitle: 'About NanoID',
    aboutText: 'NanoID is a tiny, secure, URL-friendly unique string ID generator. It uses a larger alphabet than UUID, so a similar number of random bits are packed in just 21 characters instead of 36.',
  },
  ru: {
    pageTitle: 'Генератор NanoID - Компактные Уникальные ID',
    pageDescription: 'Генерация компактных, URL-безопасных уникальных идентификаторов с настраиваемой длиной и алфавитом',

    length: 'Длина',
    quantity: 'Количество',
    alphabet: 'Алфавит',

    alphabetDefault: 'По умолчанию (URL-safe)',
    alphabetCustom: 'Пользовательский',

    customAlphabet: 'Пользовательский алфавит',
    customAlphabetPlaceholder: 'Введите символы...',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    copyAll: 'Копировать все',

    copied: 'Скопировано!',
    copiedAll: 'Все ID скопированы!',

    collision: 'Вероятность коллизии',
    toHave1Collision: 'Для 1% вероятности коллизии нужно сгенерировать',
    ids: 'ID',

    featuresTitle: 'Возможности',
    feature1: 'Компактные и URL-безопасные',
    feature2: 'Настраиваемая длина',
    feature3: 'Поддержка своего алфавита',
    feature4: 'Криптографически безопасные',

    aboutTitle: 'О NanoID',
    aboutText: 'NanoID — это крошечный, безопасный, URL-дружественный генератор уникальных строковых ID. Он использует больший алфавит чем UUID, поэтому такое же количество случайных бит помещается в 21 символ вместо 36.',
  },
};

export function getNanoidGeneratorTranslations(locale: Locale) {
  return nanoidGeneratorTranslations[locale];
}
