import type { Locale } from './i18n';

export const punycodeTranslations = {
  en: {
    pageTitle: 'Punycode Converter - IDN Domain Encoder',
    pageDescription: 'Convert internationalized domain names (IDN) to Punycode or decode Punycode back to Unicode',

    encode: 'To Punycode',
    decode: 'From Punycode',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Convert to Punycode',
    decodeButton: 'Convert to Unicode',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter domain or text (e.g., example.com, )...',
    decodePlaceholder: 'Enter Punycode domain (e.g., xn--e1afmkfd.xn--p1ai)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully converted!',
    decodedSuccess: 'Successfully decoded!',
    invalidPunycode: 'Invalid Punycode string',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Convert Unicode domains to Punycode',
    feature2: 'Decode Punycode to readable text',
    feature3: 'IDN domain support',
    feature4: 'RFC 3492 compliant',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Punycode',
    aboutText: 'Punycode is an encoding syntax used to represent Unicode characters in ASCII for internationalized domain names (IDN). Domain names containing non-ASCII characters (like Cyrillic, Chinese, Arabic) are converted to ASCII-compatible encoding starting with "xn--". For example, "example.com" becomes "xn--e1afmkfd.xn--p1ai".',

    examplesTitle: 'Examples',
    example1Domain: 'example.com',
    example1Punycode: 'xn--e1afmkfd.xn--p1ai',
    example2Domain: 'Example.de',
    example2Punycode: 'xn--bcher-kva.de',
  },
  ru: {
    pageTitle: 'Punycode Конвертер - IDN Домен Кодировщик',
    pageDescription: 'Конвертация интернационализированных доменных имён (IDN) в Punycode или декодирование Punycode обратно в Unicode',

    encode: 'В Punycode',
    decode: 'Из Punycode',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Конвертировать в Punycode',
    decodeButton: 'Конвертировать в Unicode',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите домен или текст (например, пример.рф, Пример.de)...',
    decodePlaceholder: 'Введите Punycode домен (например, xn--e1afmkfd.xn--p1ai)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно сконвертировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidPunycode: 'Неверная Punycode строка',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация Unicode доменов в Punycode',
    feature2: 'Декодирование Punycode в читаемый текст',
    feature3: 'Поддержка IDN доменов',
    feature4: 'Соответствие RFC 3492',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Punycode',
    aboutText: 'Punycode — это синтаксис кодирования, используемый для представления Unicode символов в ASCII для интернационализированных доменных имён (IDN). Доменные имена, содержащие не-ASCII символы (кириллица, китайский, арабский), конвертируются в ASCII-совместимое кодирование, начинающееся с "xn--". Например, "пример.рф" становится "xn--e1afmkfd.xn--p1ai".',

    examplesTitle: 'Примеры',
    example1Domain: 'пример.рф',
    example1Punycode: 'xn--e1afmkfd.xn--p1ai',
    example2Domain: 'Bücher.de',
    example2Punycode: 'xn--bcher-kva.de',
  },
};

export function getPunycodeTranslations(locale: Locale) {
  return punycodeTranslations[locale];
}
