import type { Locale } from './i18n';

export const morseCodeTranslations = {
  en: {
    pageTitle: 'Morse Code Translator',
    pageDescription: 'Convert text to Morse code or decode Morse code back to text',

    encode: 'Text to Morse',
    decode: 'Morse to Text',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Morse',
    decodeButton: 'Convert to Text',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    playButton: 'Play Sound',

    encodePlaceholder: 'Enter text to convert to Morse code...',
    decodePlaceholder: 'Enter Morse code (use . for dot, - for dash, space between letters, / between words)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidMorse: 'Invalid Morse code',
    emptyInput: 'Please enter some data',

    legend: 'Morse Code Reference',
    letters: 'Letters',
    numbers: 'Numbers',

    featuresTitle: 'Features',
    feature1: 'Convert text to Morse code',
    feature2: 'Decode Morse to readable text',
    feature3: 'International Morse Code standard',
    feature4: 'Copy to clipboard',
    feature5: 'Supports letters and numbers',
    feature6: 'All processing done locally',

    aboutTitle: 'About Morse Code',
    aboutText: 'Morse code is a method of encoding text characters using standardized sequences of dots (.) and dashes (-). It was developed in the 1830s by Samuel Morse and Alfred Vail for electrical telegraphy. Each letter or number is represented by a unique combination, with pauses used to separate characters and words.',
  },
  ru: {
    pageTitle: 'Переводчик Азбуки Морзе',
    pageDescription: 'Конвертация текста в азбуку Морзе или декодирование азбуки Морзе обратно в текст',

    encode: 'Текст в Морзе',
    decode: 'Морзе в Текст',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Морзе',
    decodeButton: 'Конвертировать в Текст',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    playButton: 'Воспроизвести',

    encodePlaceholder: 'Введите текст для конвертации в азбуку Морзе...',
    decodePlaceholder: 'Введите код Морзе (используйте . для точки, - для тире, пробел между буквами, / между словами)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidMorse: 'Неверный код Морзе',
    emptyInput: 'Пожалуйста, введите данные',

    legend: 'Справочник Кода Морзе',
    letters: 'Буквы',
    numbers: 'Цифры',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация текста в азбуку Морзе',
    feature2: 'Декодирование Морзе в читаемый текст',
    feature3: 'Международный стандарт азбуки Морзе',
    feature4: 'Копирование в буфер обмена',
    feature5: 'Поддержка букв и цифр',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'Об Азбуке Морзе',
    aboutText: 'Азбука Морзе — это метод кодирования текстовых символов с использованием стандартизированных последовательностей точек (.) и тире (-). Была разработана в 1830-х годах Сэмюэлом Морзе и Альфредом Вейлом для электрического телеграфа. Каждая буква или цифра представлена уникальной комбинацией, а паузы используются для разделения символов и слов.',
  },
};

export function getMorseCodeTranslations(locale: Locale) {
  return morseCodeTranslations[locale];
}
