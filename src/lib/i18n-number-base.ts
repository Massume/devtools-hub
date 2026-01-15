import type { Locale } from './i18n';

export const numberBaseTranslations = {
  en: {
    pageTitle: 'Number Base Converter',
    pageDescription: 'Convert numbers between binary, decimal, hexadecimal, and octal systems',

    inputLabel: 'Input Number',
    inputPlaceholder: 'Enter a number...',
    fromBase: 'From Base',
    toBase: 'To Base',

    binary: 'Binary (2)',
    octal: 'Octal (8)',
    decimal: 'Decimal (10)',
    hexadecimal: 'Hexadecimal (16)',

    convertButton: 'Convert',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    swapButton: 'Swap',

    allConversions: 'All Conversions',
    result: 'Result',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidInput: 'Invalid input for selected base',
    emptyInput: 'Please enter a number',

    featuresTitle: 'Features',
    feature1: 'Binary, Octal, Decimal, Hexadecimal conversion',
    feature2: 'Real-time conversion preview',
    feature3: 'Support for large numbers',
    feature4: 'Copy results to clipboard',
    feature5: 'Swap bases quickly',
    feature6: 'All processing done locally',

    aboutTitle: 'About Number Bases',
    aboutText: 'Number bases (or radix) define how numbers are represented. Binary (base 2) uses 0-1, Octal (base 8) uses 0-7, Decimal (base 10) uses 0-9, and Hexadecimal (base 16) uses 0-9 and A-F. Different bases are used in computing, mathematics, and various technical fields.',
  },
  ru: {
    pageTitle: 'Конвертер Систем Счисления',
    pageDescription: 'Конвертация чисел между двоичной, десятичной, шестнадцатеричной и восьмеричной системами',

    inputLabel: 'Входное Число',
    inputPlaceholder: 'Введите число...',
    fromBase: 'Из системы',
    toBase: 'В систему',

    binary: 'Двоичная (2)',
    octal: 'Восьмеричная (8)',
    decimal: 'Десятичная (10)',
    hexadecimal: 'Шестнадцатеричная (16)',

    convertButton: 'Конвертировать',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    swapButton: 'Поменять',

    allConversions: 'Все Конверсии',
    result: 'Результат',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidInput: 'Неверный ввод для выбранной системы',
    emptyInput: 'Пожалуйста, введите число',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация между двоичной, восьмеричной, десятичной и шестнадцатеричной',
    feature2: 'Предпросмотр конвертации в реальном времени',
    feature3: 'Поддержка больших чисел',
    feature4: 'Копирование результатов в буфер обмена',
    feature5: 'Быстрая смена систем счисления',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Системах Счисления',
    aboutText: 'Системы счисления (или основание) определяют способ представления чисел. Двоичная (основание 2) использует 0-1, Восьмеричная (основание 8) использует 0-7, Десятичная (основание 10) использует 0-9, а Шестнадцатеричная (основание 16) использует 0-9 и A-F. Разные системы счисления используются в вычислительной технике, математике и различных технических областях.',
  },
};

export function getNumberBaseTranslations(locale: Locale) {
  return numberBaseTranslations[locale];
}
