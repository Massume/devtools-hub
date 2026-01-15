import type { Locale } from './i18n';

export const natoPhoneticTranslations = {
  en: {
    pageTitle: 'NATO Phonetic Alphabet Converter',
    pageDescription: 'Convert text to NATO phonetic alphabet or decode phonetic words back to text',

    encode: 'Text to NATO',
    decode: 'NATO to Text',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Phonetic',
    decodeButton: 'Convert to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to convert (e.g., HELLO)...',
    decodePlaceholder: 'Enter phonetic words (e.g., Hotel Echo Lima Lima Oscar)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Convert text to NATO phonetic alphabet',
    feature2: 'Decode phonetic words to text',
    feature3: 'International standard',
    feature4: 'Supports letters and numbers',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About NATO Phonetic Alphabet',
    aboutText: 'The NATO phonetic alphabet (also known as the International Radiotelephony Spelling Alphabet) is the most widely used spelling alphabet. It assigns code words to letters to ensure clarity in voice communication, especially in noisy environments or over radio/telephone. Each letter is represented by a distinct word (Alpha, Bravo, Charlie, etc.).',

    referenceTitle: 'Phonetic Alphabet Reference',
    letters: 'Letters',
    numbers: 'Numbers',
  },
  ru: {
    pageTitle: 'Конвертер Фонетического Алфавита НАТО',
    pageDescription: 'Конвертация текста в фонетический алфавит НАТО или декодирование фонетических слов обратно в текст',

    encode: 'Текст в НАТО',
    decode: 'НАТО в Текст',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Фонетический',
    decodeButton: 'Конвертировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для конвертации (например, HELLO)...',
    decodePlaceholder: 'Введите фонетические слова (например, Hotel Echo Lima Lima Oscar)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в фонетический алфавит НАТО',
    feature2: 'Декодирование фонетических слов в текст',
    feature3: 'Международный стандарт',
    feature4: 'Поддержка букв и цифр',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Фонетическом Алфавите НАТО',
    aboutText: 'Фонетический алфавит НАТО (также известный как Международный радиотелефонный орфографический алфавит) — это наиболее широко используемый орфографический алфавит. Он присваивает кодовые слова буквам для обеспечения ясности голосовой связи, особенно в шумной среде или по радио/телефону. Каждая буква представлена отдельным словом (Alpha, Bravo, Charlie и т.д.).',

    referenceTitle: 'Справочник Фонетического Алфавита',
    letters: 'Буквы',
    numbers: 'Цифры',
  },
};

export function getNatoPhoneticTranslations(locale: Locale) {
  return natoPhoneticTranslations[locale];
}
