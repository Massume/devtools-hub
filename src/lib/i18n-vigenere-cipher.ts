import type { Locale } from './i18n';

export const vigenereCipherTranslations = {
  en: {
    pageTitle: 'Vigenère Cipher - Polyalphabetic Encryption',
    pageDescription: 'Encrypt and decrypt text using the Vigenère cipher with a keyword',

    inputLabel: 'Input Text',
    inputPlaceholder: 'Enter text to encrypt or decrypt...',
    keyLabel: 'Keyword',
    keyPlaceholder: 'Enter encryption keyword...',
    outputLabel: 'Output',

    encryptButton: 'Encrypt',
    decryptButton: 'Decrypt',
    copyButton: 'Copy',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',
    keyRequired: 'Please enter a keyword',

    preserveCase: 'Preserve Case',
    preserveNonAlpha: 'Preserve Non-Letters',

    visualTitle: 'Key Visualization',
    visualDesc: 'Shows how each letter is shifted:',

    featuresTitle: 'Features',
    feature1: 'Polyalphabetic substitution cipher',
    feature2: 'Custom keyword encryption',
    feature3: 'Visual key mapping display',
    feature4: 'Case and non-letter preservation',

    aboutTitle: 'About Vigenère Cipher',
    aboutText: 'The Vigenère cipher is a polyalphabetic substitution cipher that uses a keyword to shift letters. Each letter in the keyword determines the shift amount for the corresponding plaintext letter. It was considered unbreakable for centuries until Kasiski examination was developed in the 1860s.',

    warningInsecure: 'Vigenère cipher is NOT secure by modern standards. It can be broken with frequency analysis. Use only for educational purposes.',
  },
  ru: {
    pageTitle: 'Шифр Виженера',
    pageDescription: 'Шифрование и дешифрование текста с помощью шифра Виженера с ключевым словом',

    inputLabel: 'Входной текст',
    inputPlaceholder: 'Введите текст для шифрования или дешифрования...',
    keyLabel: 'Ключевое слово',
    keyPlaceholder: 'Введите ключевое слово...',
    outputLabel: 'Результат',

    encryptButton: 'Зашифровать',
    decryptButton: 'Расшифровать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',
    keyRequired: 'Пожалуйста, введите ключевое слово',

    preserveCase: 'Сохранять регистр',
    preserveNonAlpha: 'Сохранять не-буквы',

    visualTitle: 'Визуализация ключа',
    visualDesc: 'Показывает как сдвигается каждая буква:',

    featuresTitle: 'Возможности',
    feature1: 'Полиалфавитный подстановочный шифр',
    feature2: 'Шифрование с ключевым словом',
    feature3: 'Визуальное отображение ключа',
    feature4: 'Сохранение регистра и не-букв',

    aboutTitle: 'О Шифре Виженера',
    aboutText: 'Шифр Виженера — полиалфавитный подстановочный шифр, использующий ключевое слово для сдвига букв. Каждая буква ключа определяет величину сдвига для соответствующей буквы открытого текста. Считался невзламываемым веками, пока в 1860-х не был разработан метод Касиски.',

    warningInsecure: 'Шифр Виженера НЕ безопасен по современным стандартам. Может быть взломан частотным анализом. Используйте только в образовательных целях.',
  },
};

export function getVigenereCipherTranslations(locale: Locale) {
  return vigenereCipherTranslations[locale];
}
