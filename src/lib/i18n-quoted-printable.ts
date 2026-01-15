import type { Locale } from './i18n';

export const quotedPrintableTranslations = {
  en: {
    pageTitle: 'Quoted-Printable Encoder/Decoder',
    pageDescription: 'Encode text to Quoted-Printable format or decode QP strings back to text',

    encode: 'Encode',
    decode: 'Decode',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Encode to QP',
    decodeButton: 'Decode from QP',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text to encode to Quoted-Printable...',
    decodePlaceholder: 'Enter Quoted-Printable encoded text (e.g., Hello=20World)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidQP: 'Invalid Quoted-Printable string',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Encode text to Quoted-Printable',
    feature2: 'Decode QP to readable text',
    feature3: 'MIME standard compliant',
    feature4: 'Email-safe encoding',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Quoted-Printable',
    aboutText: 'Quoted-Printable (QP) is a MIME encoding method designed to represent data that mostly consists of printable ASCII characters. Non-printable or special characters are represented as "=" followed by two hex digits. It is commonly used in email headers and bodies to encode non-ASCII text while maintaining readability.',
  },
  ru: {
    pageTitle: 'Quoted-Printable Кодировщик/Декодер',
    pageDescription: 'Кодирование текста в формат Quoted-Printable или декодирование QP строк обратно в текст',

    encode: 'Кодировать',
    decode: 'Декодировать',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Кодировать в QP',
    decodeButton: 'Декодировать из QP',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст для кодирования в Quoted-Printable...',
    decodePlaceholder: 'Введите Quoted-Printable закодированный текст (например, Hello=20World)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidQP: 'Неверная Quoted-Printable строка',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Кодирование текста в Quoted-Printable',
    feature2: 'Декодирование QP в читаемый текст',
    feature3: 'Соответствие стандарту MIME',
    feature4: 'Безопасное кодирование для email',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Quoted-Printable',
    aboutText: 'Quoted-Printable (QP) — это метод MIME кодирования, предназначенный для представления данных, состоящих в основном из печатных ASCII символов. Непечатные или специальные символы представляются как "=" с двумя hex цифрами. Широко используется в заголовках и теле email для кодирования не-ASCII текста с сохранением читаемости.',
  },
};

export function getQuotedPrintableTranslations(locale: Locale) {
  return quotedPrintableTranslations[locale];
}
