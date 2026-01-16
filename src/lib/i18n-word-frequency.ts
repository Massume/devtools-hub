import type { Locale } from './i18n';

export const wordFrequencyTranslations = {
  en: {
    pageTitle: 'Word Frequency Analyzer - Count Word Occurrences',
    pageDescription: 'Analyze text to find the most frequently used words and phrases',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Paste your text here to analyze word frequency...',

    analyzeButton: 'Analyze',
    copyButton: 'Copy Results',
    clearButton: 'Clear',

    emptyInput: 'Please enter text to analyze',
    copied: 'Copied to clipboard!',

    options: 'Options',
    minWordLength: 'Min Word Length',
    topWords: 'Show Top Words',
    caseSensitive: 'Case Sensitive',
    excludeCommon: 'Exclude Common Words',

    resultsTitle: 'Word Frequency Results',
    word: 'Word',
    count: 'Count',
    percentage: 'Percentage',
    totalWords: 'Total Words',
    uniqueWords: 'Unique Words',

    featuresTitle: 'Features',
    feature1: 'Configurable minimum word length',
    feature2: 'Exclude common stop words',
    feature3: 'Case sensitive option',
    feature4: 'Visual frequency bars',

    aboutTitle: 'About Word Frequency Analyzer',
    aboutText: 'Analyze text to discover the most frequently used words. Perfect for content analysis, SEO optimization, and understanding text patterns.',
  },
  ru: {
    pageTitle: 'Анализатор Частоты Слов - Подсчёт Слов',
    pageDescription: 'Анализ текста для поиска наиболее часто используемых слов и фраз',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Вставьте текст для анализа частоты слов...',

    analyzeButton: 'Анализировать',
    copyButton: 'Копировать результаты',
    clearButton: 'Очистить',

    emptyInput: 'Введите текст для анализа',
    copied: 'Скопировано!',

    options: 'Настройки',
    minWordLength: 'Мин. длина слова',
    topWords: 'Показать топ слов',
    caseSensitive: 'Учитывать регистр',
    excludeCommon: 'Исключить частые слова',

    resultsTitle: 'Результаты анализа частоты',
    word: 'Слово',
    count: 'Количество',
    percentage: 'Процент',
    totalWords: 'Всего слов',
    uniqueWords: 'Уникальных слов',

    featuresTitle: 'Возможности',
    feature1: 'Настраиваемая минимальная длина слова',
    feature2: 'Исключение частых стоп-слов',
    feature3: 'Опция учёта регистра',
    feature4: 'Визуальные полосы частоты',

    aboutTitle: 'Об Анализаторе Частоты Слов',
    aboutText: 'Анализ текста для выявления наиболее часто используемых слов. Идеально подходит для контент-анализа, SEO-оптимизации и понимания паттернов текста.',
  },
};

export function getWordFrequencyTranslations(locale: Locale) {
  return wordFrequencyTranslations[locale];
}
