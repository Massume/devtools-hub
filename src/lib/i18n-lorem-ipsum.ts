import type { Locale } from './i18n';

export const loremIpsumTranslations = {
  en: {
    pageTitle: 'Lorem Ipsum Generator - Placeholder Text',
    pageDescription: 'Generate Lorem Ipsum placeholder text in various styles and lengths',

    generateType: 'Generate',
    paragraphs: 'Paragraphs',
    sentences: 'Sentences',
    words: 'Words',

    count: 'Count',
    style: 'Style',

    styleClassic: 'Classic',
    styleHipster: 'Hipster',
    styleOffice: 'Corporate',

    startWithLorem: 'Start with "Lorem ipsum..."',

    generateButton: 'Generate',
    copyButton: 'Copy',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',

    outputLabel: 'Generated Text',

    featuresTitle: 'Features',
    feature1: 'Generate paragraphs, sentences, or words',
    feature2: 'Multiple text styles available',
    feature3: 'Configurable output length',
    feature4: 'Copy with one click',

    aboutTitle: 'About Lorem Ipsum',
    aboutText: 'Lorem Ipsum is dummy text used in the printing and typesetting industry. It has been the industry standard dummy text since the 1500s.',
  },
  ru: {
    pageTitle: 'Генератор Lorem Ipsum - Текст-заполнитель',
    pageDescription: 'Генерация текста-заполнителя Lorem Ipsum различных стилей и длины',

    generateType: 'Генерировать',
    paragraphs: 'Абзацы',
    sentences: 'Предложения',
    words: 'Слова',

    count: 'Количество',
    style: 'Стиль',

    styleClassic: 'Классический',
    styleHipster: 'Хипстерский',
    styleOffice: 'Корпоративный',

    startWithLorem: 'Начать с "Lorem ipsum..."',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',

    outputLabel: 'Сгенерированный текст',

    featuresTitle: 'Возможности',
    feature1: 'Генерация абзацев, предложений или слов',
    feature2: 'Несколько стилей текста',
    feature3: 'Настраиваемая длина',
    feature4: 'Копирование одним кликом',

    aboutTitle: 'О Lorem Ipsum',
    aboutText: 'Lorem Ipsum — это текст-заполнитель, используемый в полиграфии и вёрстке. Он является стандартным текстом-заполнителем с 1500-х годов.',
  },
};

export function getLoremIpsumTranslations(locale: Locale) {
  return loremIpsumTranslations[locale];
}
