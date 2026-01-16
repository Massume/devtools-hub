import type { Locale } from './i18n';

export const textStatisticsTranslations = {
  en: {
    pageTitle: 'Text Statistics - Character, Word, Line Counter',
    pageDescription: 'Analyze text and get detailed statistics: character count, word count, reading time, and more',

    inputLabel: 'Enter Text',
    inputPlaceholder: 'Type or paste your text here to analyze...',

    clearButton: 'Clear',

    // Statistics
    characters: 'Characters',
    charactersNoSpaces: 'Characters (no spaces)',
    words: 'Words',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    lines: 'Lines',

    avgWordLength: 'Avg Word Length',
    longestWord: 'Longest Word',
    shortestWord: 'Shortest Word',

    readingTime: 'Reading Time',
    speakingTime: 'Speaking Time',
    minutes: 'min',
    seconds: 'sec',

    wordFrequency: 'Word Frequency',
    showWordFrequency: 'Show Word Frequency',
    topWords: 'Top Words',
    word: 'Word',
    count: 'Count',

    featuresTitle: 'Features',
    feature1: 'Real-time text analysis',
    feature2: 'Character and word counting',
    feature3: 'Reading and speaking time',
    feature4: 'Word frequency analysis',

    aboutTitle: 'About Text Statistics',
    aboutText: 'Get detailed statistics about your text including character count, word count, sentence count, and estimated reading time.',
  },
  ru: {
    pageTitle: 'Статистика Текста - Подсчёт Символов, Слов, Строк',
    pageDescription: 'Анализ текста и подробная статистика: количество символов, слов, время чтения и другое',

    inputLabel: 'Введите текст',
    inputPlaceholder: 'Введите или вставьте текст для анализа...',

    clearButton: 'Очистить',

    // Statistics
    characters: 'Символов',
    charactersNoSpaces: 'Символов (без пробелов)',
    words: 'Слов',
    sentences: 'Предложений',
    paragraphs: 'Абзацев',
    lines: 'Строк',

    avgWordLength: 'Средняя длина слова',
    longestWord: 'Самое длинное слово',
    shortestWord: 'Самое короткое слово',

    readingTime: 'Время чтения',
    speakingTime: 'Время произнесения',
    minutes: 'мин',
    seconds: 'сек',

    wordFrequency: 'Частота слов',
    showWordFrequency: 'Показать частоту слов',
    topWords: 'Популярные слова',
    word: 'Слово',
    count: 'Количество',

    featuresTitle: 'Возможности',
    feature1: 'Анализ текста в реальном времени',
    feature2: 'Подсчёт символов и слов',
    feature3: 'Время чтения и произнесения',
    feature4: 'Анализ частоты слов',

    aboutTitle: 'О Статистике Текста',
    aboutText: 'Получите подробную статистику о вашем тексте, включая количество символов, слов, предложений и примерное время чтения.',
  },
};

export function getTextStatisticsTranslations(locale: Locale) {
  return textStatisticsTranslations[locale];
}
