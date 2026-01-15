import type { Locale } from './i18n';

export const rotCipherTranslations = {
  en: {
    pageTitle: 'ROT13/ROT47 Cipher',
    pageDescription: 'Encode or decode text using ROT13 or ROT47 rotation ciphers',

    rot13: 'ROT13',
    rot47: 'ROT47',

    inputLabel: 'Input',
    outputLabel: 'Output',

    processButton: 'Encode/Decode',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    swapButton: 'Swap',

    inputPlaceholder: 'Enter text to encode/decode...',

    copied: 'Copied to clipboard!',
    processedSuccess: 'Successfully processed!',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'ROT13 letter rotation (A-Z)',
    feature2: 'ROT47 ASCII rotation (printable)',
    feature3: 'Symmetric encoding (encode = decode)',
    feature4: 'Instant conversion',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About ROT Ciphers',
    aboutRot13: 'ROT13 ("rotate by 13 places") is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet. Since there are 26 letters, applying ROT13 twice returns the original text. It only affects letters A-Z.',
    aboutRot47: 'ROT47 is a variant that rotates by 47 positions in the ASCII printable character set (characters 33-126). This allows encoding of numbers, symbols, and special characters in addition to letters.',
  },
  ru: {
    pageTitle: 'ROT13/ROT47 Шифр',
    pageDescription: 'Кодирование или декодирование текста с помощью шифров ROT13 или ROT47',

    rot13: 'ROT13',
    rot47: 'ROT47',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    processButton: 'Кодировать/Декодировать',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    swapButton: 'Поменять',

    inputPlaceholder: 'Введите текст для кодирования/декодирования...',

    copied: 'Скопировано в буфер обмена!',
    processedSuccess: 'Успешно обработано!',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'ROT13 сдвиг букв (A-Z)',
    feature2: 'ROT47 сдвиг ASCII (печатные символы)',
    feature3: 'Симметричное кодирование (код = декод)',
    feature4: 'Мгновенная конвертация',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О ROT Шифрах',
    aboutRot13: 'ROT13 ("сдвиг на 13 позиций") — это простой шифр подстановки, который заменяет каждую букву на букву, находящуюся на 13 позиций дальше в алфавите. Поскольку в алфавите 26 букв, применение ROT13 дважды возвращает исходный текст. Влияет только на буквы A-Z.',
    aboutRot47: 'ROT47 — это вариант, который сдвигает на 47 позиций в наборе печатных ASCII символов (символы 33-126). Это позволяет кодировать цифры, знаки и специальные символы помимо букв.',
  },
};

export function getRotCipherTranslations(locale: Locale) {
  return rotCipherTranslations[locale];
}
