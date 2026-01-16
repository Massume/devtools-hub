import type { Locale } from './i18n';

export const anagramCheckerTranslations = {
  en: {
    pageTitle: 'Anagram Checker - Check & Generate Anagrams',
    pageDescription: 'Check if two words or phrases are anagrams of each other',

    text1Label: 'First Text',
    text2Label: 'Second Text',
    inputPlaceholder: 'Enter text...',

    checkButton: 'Check Anagram',
    clearButton: 'Clear',

    emptyInput: 'Please enter both texts to compare',

    options: 'Options',
    ignoreSpaces: 'Ignore Spaces',
    ignoreCase: 'Ignore Case',

    isAnagram: 'These are anagrams!',
    notAnagram: 'These are NOT anagrams',

    letterCount: 'Letter Count',
    text1Letters: 'Text 1 Letters',
    text2Letters: 'Text 2 Letters',
    matching: 'Matching',
    missing: 'Missing',
    extra: 'Extra',

    examples: 'Anagram Examples',

    featuresTitle: 'Features',
    feature1: 'Case insensitive comparison',
    feature2: 'Ignore spaces option',
    feature3: 'Visual letter breakdown',
    feature4: 'Shows missing/extra letters',

    aboutTitle: 'About Anagram Checker',
    aboutText: 'An anagram is a word or phrase formed by rearranging the letters of another word or phrase, using all the original letters exactly once. This tool checks if two texts are anagrams of each other.',
  },
  ru: {
    pageTitle: 'Проверка Анаграмм - Проверить Анаграммы',
    pageDescription: 'Проверка, являются ли два слова или фразы анаграммами друг друга',

    text1Label: 'Первый текст',
    text2Label: 'Второй текст',
    inputPlaceholder: 'Введите текст...',

    checkButton: 'Проверить анаграмму',
    clearButton: 'Очистить',

    emptyInput: 'Введите оба текста для сравнения',

    options: 'Настройки',
    ignoreSpaces: 'Игнорировать пробелы',
    ignoreCase: 'Игнорировать регистр',

    isAnagram: 'Это анаграммы!',
    notAnagram: 'Это НЕ анаграммы',

    letterCount: 'Количество букв',
    text1Letters: 'Буквы текста 1',
    text2Letters: 'Буквы текста 2',
    matching: 'Совпадают',
    missing: 'Отсутствуют',
    extra: 'Лишние',

    examples: 'Примеры анаграмм',

    featuresTitle: 'Возможности',
    feature1: 'Сравнение без учёта регистра',
    feature2: 'Опция игнорирования пробелов',
    feature3: 'Визуальная разбивка по буквам',
    feature4: 'Показ отсутствующих/лишних букв',

    aboutTitle: 'О Проверке Анаграмм',
    aboutText: 'Анаграмма — это слово или фраза, образованная перестановкой букв другого слова или фразы, с использованием всех исходных букв ровно один раз. Этот инструмент проверяет, являются ли два текста анаграммами.',
  },
};

export function getAnagramCheckerTranslations(locale: Locale) {
  return anagramCheckerTranslations[locale];
}
