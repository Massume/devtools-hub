import type { Locale } from './i18n';

export const caesarCipherTranslations = {
  en: {
    pageTitle: 'Caesar Cipher - Encrypt & Decrypt',
    pageDescription: 'Encrypt and decrypt text using the classic Caesar cipher with customizable shift',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Enter text to encrypt or decrypt...',
    outputLabel: 'Output',

    encryptButton: 'Encrypt',
    decryptButton: 'Decrypt',
    copyButton: 'Copy',
    clearButton: 'Clear',
    bruteForceButton: 'Brute Force',

    copied: 'Copied to clipboard!',

    shift: 'Shift (1-25)',
    preserveCase: 'Preserve Case',
    includeNumbers: 'Include Numbers (0-9)',

    bruteForceTitle: 'Brute Force Results',
    bruteForceDesc: 'All 25 possible shifts for the input:',

    featuresTitle: 'Features',
    feature1: 'Encrypt and decrypt with any shift',
    feature2: 'Brute force attack to try all shifts',
    feature3: 'Preserve letter case option',
    feature4: 'Optional number shifting',

    aboutTitle: 'About Caesar Cipher',
    aboutText: 'The Caesar cipher is one of the oldest encryption techniques, named after Julius Caesar who used it for secret communication. Each letter is shifted by a fixed number of positions in the alphabet. While historically significant, it provides no real security today and is mainly used for educational purposes.',

    warningInsecure: 'Caesar cipher is NOT secure. It can be broken easily with brute force (only 25 possible keys). Use only for educational purposes or simple obfuscation.',
  },
  ru: {
    pageTitle: 'Шифр Цезаря',
    pageDescription: 'Шифрование и дешифрование текста классическим шифром Цезаря с настраиваемым сдвигом',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Введите текст для шифрования или дешифрования...',
    outputLabel: 'Результат',

    encryptButton: 'Зашифровать',
    decryptButton: 'Расшифровать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    bruteForceButton: 'Перебор',

    copied: 'Скопировано!',

    shift: 'Сдвиг (1-25)',
    preserveCase: 'Сохранять регистр',
    includeNumbers: 'Включить цифры (0-9)',

    bruteForceTitle: 'Результаты перебора',
    bruteForceDesc: 'Все 25 возможных сдвигов для введённого текста:',

    featuresTitle: 'Возможности',
    feature1: 'Шифрование и дешифрование с любым сдвигом',
    feature2: 'Атака перебором для проверки всех сдвигов',
    feature3: 'Опция сохранения регистра букв',
    feature4: 'Опциональный сдвиг цифр',

    aboutTitle: 'О Шифре Цезаря',
    aboutText: 'Шифр Цезаря — один из древнейших методов шифрования, названный в честь Юлия Цезаря, который использовал его для секретной переписки. Каждая буква сдвигается на фиксированное число позиций в алфавите. Исторически важен, но сегодня не обеспечивает реальной защиты и используется в основном в образовательных целях.',

    warningInsecure: 'Шифр Цезаря НЕ безопасен. Его легко взломать перебором (всего 25 возможных ключей). Используйте только в образовательных целях или для простой обфускации.',
  },
};

export function getCaesarCipherTranslations(locale: Locale) {
  return caesarCipherTranslations[locale];
}
