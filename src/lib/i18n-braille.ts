import type { Locale } from './i18n';

export const brailleTranslations = {
  en: {
    pageTitle: 'Braille Converter',
    pageDescription: 'Convert text to Braille Unicode characters or decode Braille back to text',

    encode: 'Text to Braille',
    decode: 'Braille to Text',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Braille',
    decodeButton: 'Convert to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to convert to Braille...',
    decodePlaceholder: 'Enter Braille characters (e.g., ⠓⠑⠇⠇⠕)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidBraille: 'Invalid Braille input',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Convert text to Braille Unicode',
    feature2: 'Decode Braille to readable text',
    feature3: 'Standard English Braille (Grade 1)',
    feature4: 'Supports letters and numbers',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Braille',
    aboutText: 'Braille is a tactile writing system used by people who are visually impaired. Each Braille character (cell) consists of up to 6 raised dots arranged in a 2x3 grid. Unicode includes Braille patterns from U+2800 to U+28FF, allowing Braille text to be displayed on screens and in digital documents.',

    referenceTitle: 'Braille Reference',
    letters: 'Letters',
    numbers: 'Numbers',
  },
  ru: {
    pageTitle: 'Конвертер Брайля',
    pageDescription: 'Конвертация текста в Unicode символы Брайля или декодирование Брайля обратно в текст',

    encode: 'Текст в Брайль',
    decode: 'Брайль в Текст',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Брайль',
    decodeButton: 'Конвертировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для конвертации в Брайль...',
    decodePlaceholder: 'Введите символы Брайля (например, ⠓⠑⠇⠇⠕)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidBraille: 'Неверный ввод Брайля',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в Unicode Брайля',
    feature2: 'Декодирование Брайля в читаемый текст',
    feature3: 'Стандартный английский Брайль (Грейд 1)',
    feature4: 'Поддержка букв и цифр',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Шрифте Брайля',
    aboutText: 'Брайль — это тактильная система письма, используемая людьми с нарушениями зрения. Каждый символ Брайля (ячейка) состоит из до 6 выпуклых точек, расположенных в сетке 2x3. Unicode включает паттерны Брайля от U+2800 до U+28FF, позволяя отображать текст Брайля на экранах и в цифровых документах.',

    referenceTitle: 'Справочник Брайля',
    letters: 'Буквы',
    numbers: 'Цифры',
  },
};

export function getBrailleTranslations(locale: Locale) {
  return brailleTranslations[locale];
}
