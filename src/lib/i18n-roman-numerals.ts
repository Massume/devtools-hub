import type { Locale } from './i18n';

export const romanNumeralsTranslations = {
  en: {
    pageTitle: 'Roman Numerals Converter',
    pageDescription: 'Convert between Roman numerals and decimal numbers',

    toRoman: 'Decimal to Roman',
    toDecimal: 'Roman to Decimal',

    inputLabel: 'Input',
    outputLabel: 'Output',

    toRomanButton: 'Convert to Roman',
    toDecimalButton: 'Convert to Decimal',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    toRomanPlaceholder: 'Enter a number (1-3999)...',
    toDecimalPlaceholder: 'Enter Roman numerals (e.g., MCMLXXXIV)...',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidRoman: 'Invalid Roman numerals',
    invalidNumber: 'Please enter a number between 1 and 3999',
    emptyInput: 'Please enter some data',

    referenceTitle: 'Roman Numerals Reference',
    basicSymbols: 'Basic Symbols',
    commonExamples: 'Common Examples',

    featuresTitle: 'Features',
    feature1: 'Convert decimal to Roman numerals',
    feature2: 'Convert Roman numerals to decimal',
    feature3: 'Support numbers 1-3999',
    feature4: 'Validation of Roman numeral format',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Roman Numerals',
    aboutText: 'Roman numerals are a numeral system originating in ancient Rome. They use combinations of letters from the Latin alphabet (I, V, X, L, C, D, M) to represent values. The system was used throughout the Roman Empire and remains in use today for various purposes including clock faces, book chapters, and movie sequels.',
  },
  ru: {
    pageTitle: 'Конвертер Римских Цифр',
    pageDescription: 'Конвертация между римскими и десятичными числами',

    toRoman: 'Десятичные в Римские',
    toDecimal: 'Римские в Десятичные',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    toRomanButton: 'Конвертировать в Римские',
    toDecimalButton: 'Конвертировать в Десятичные',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    toRomanPlaceholder: 'Введите число (1-3999)...',
    toDecimalPlaceholder: 'Введите римские цифры (например, MCMLXXXIV)...',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidRoman: 'Неверные римские цифры',
    invalidNumber: 'Введите число от 1 до 3999',
    emptyInput: 'Пожалуйста, введите данные',

    referenceTitle: 'Справочник Римских Цифр',
    basicSymbols: 'Основные Символы',
    commonExamples: 'Распространённые Примеры',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация десятичных в римские цифры',
    feature2: 'Конвертация римских цифр в десятичные',
    feature3: 'Поддержка чисел 1-3999',
    feature4: 'Валидация формата римских цифр',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Римских Цифрах',
    aboutText: 'Римские цифры — это система счисления, возникшая в Древнем Риме. Они используют комбинации букв латинского алфавита (I, V, X, L, C, D, M) для представления значений. Система использовалась на всей территории Римской империи и продолжает применяться сегодня в различных целях, включая циферблаты часов, главы книг и продолжения фильмов.',
  },
};

export function getRomanNumeralsTranslations(locale: Locale) {
  return romanNumeralsTranslations[locale];
}
