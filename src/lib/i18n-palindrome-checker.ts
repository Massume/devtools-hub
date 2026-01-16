import type { Locale } from './i18n';

export const palindromeCheckerTranslations = {
  en: {
    pageTitle: 'Palindrome Checker - Check Palindrome Text',
    pageDescription: 'Check if text reads the same forwards and backwards',

    inputLabel: 'Enter Text',
    inputPlaceholder: 'Enter text to check if it\'s a palindrome...',

    checkButton: 'Check',
    clearButton: 'Clear',

    emptyInput: 'Please enter text to check',

    options: 'Options',
    ignoreSpaces: 'Ignore Spaces',
    ignorePunctuation: 'Ignore Punctuation',
    ignoreCase: 'Ignore Case',

    isPalindrome: 'This is a palindrome!',
    notPalindrome: 'This is NOT a palindrome',

    original: 'Original',
    normalized: 'Normalized',
    reversed: 'Reversed',

    examples: 'Palindrome Examples',
    example1: 'A man a plan a canal Panama',
    example2: 'Was it a car or a cat I saw',
    example3: 'Never odd or even',
    example4: 'Do geese see God',

    featuresTitle: 'Features',
    feature1: 'Case insensitive check',
    feature2: 'Ignore spaces and punctuation',
    feature3: 'Shows normalized and reversed text',
    feature4: 'Works with any language',

    aboutTitle: 'About Palindrome Checker',
    aboutText: 'Check if text is a palindrome - a word, phrase, or sequence that reads the same backward as forward. Configure options to ignore spaces, punctuation, and case.',
  },
  ru: {
    pageTitle: 'Проверка Палиндрома - Проверить Палиндром',
    pageDescription: 'Проверка, читается ли текст одинаково в обоих направлениях',

    inputLabel: 'Введите текст',
    inputPlaceholder: 'Введите текст для проверки на палиндром...',

    checkButton: 'Проверить',
    clearButton: 'Очистить',

    emptyInput: 'Введите текст для проверки',

    options: 'Настройки',
    ignoreSpaces: 'Игнорировать пробелы',
    ignorePunctuation: 'Игнорировать пунктуацию',
    ignoreCase: 'Игнорировать регистр',

    isPalindrome: 'Это палиндром!',
    notPalindrome: 'Это НЕ палиндром',

    original: 'Оригинал',
    normalized: 'Нормализованный',
    reversed: 'Перевёрнутый',

    examples: 'Примеры палиндромов',
    example1: 'А роза упала на лапу Азора',
    example2: 'Аргентина манит негра',
    example3: 'Madam I\'m Adam',
    example4: 'А луна канула',

    featuresTitle: 'Возможности',
    feature1: 'Проверка без учёта регистра',
    feature2: 'Игнорирование пробелов и пунктуации',
    feature3: 'Показ нормализованного и перевёрнутого текста',
    feature4: 'Работает с любым языком',

    aboutTitle: 'О Проверке Палиндрома',
    aboutText: 'Проверка, является ли текст палиндромом - словом, фразой или последовательностью, которая читается одинаково в обоих направлениях. Настройте параметры для игнорирования пробелов, пунктуации и регистра.',
  },
};

export function getPalindromeCheckerTranslations(locale: Locale) {
  return palindromeCheckerTranslations[locale];
}
