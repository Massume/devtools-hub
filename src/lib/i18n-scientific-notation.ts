import type { Locale } from './i18n';

export const scientificNotationTranslations = {
  en: {
    pageTitle: 'Scientific Notation Converter',
    pageDescription: 'Convert between standard numbers and scientific notation (e.g., 1.23e+10)',

    toScientific: 'Number to Scientific',
    toStandard: 'Scientific to Number',

    inputLabel: 'Input',
    outputLabel: 'Output',

    toScientificButton: 'Convert to Scientific',
    toStandardButton: 'Convert to Number',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    toScientificPlaceholder: 'Enter a number (e.g., 123000000)...',
    toStandardPlaceholder: 'Enter scientific notation (e.g., 1.23e+8)...',

    precision: 'Precision',
    precisionHint: 'Number of significant digits',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please enter some data',

    examplesTitle: 'Examples',
    example1: '1000 = 1e+3',
    example2: '0.001 = 1e-3',
    example3: '6.022e+23 (Avogadro\'s number)',
    example4: '3e+8 (Speed of light in m/s)',

    featuresTitle: 'Features',
    feature1: 'Convert to scientific notation',
    feature2: 'Convert from scientific notation',
    feature3: 'Adjustable precision',
    feature4: 'Support for very large/small numbers',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Scientific Notation',
    aboutText: 'Scientific notation is a way of expressing numbers that are too large or too small to be conveniently written in decimal form. It is commonly used by scientists, mathematicians, and engineers. A number in scientific notation is written as a × 10^n, where 1 ≤ |a| < 10 and n is an integer.',
  },
  ru: {
    pageTitle: 'Конвертер Научной Нотации',
    pageDescription: 'Конвертация между обычными числами и научной нотацией (например, 1.23e+10)',

    toScientific: 'Число в Научную',
    toStandard: 'Научная в Число',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    toScientificButton: 'Конвертировать в Научную',
    toStandardButton: 'Конвертировать в Число',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    toScientificPlaceholder: 'Введите число (например, 123000000)...',
    toStandardPlaceholder: 'Введите научную нотацию (например, 1.23e+8)...',

    precision: 'Точность',
    precisionHint: 'Количество значащих цифр',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, введите данные',

    examplesTitle: 'Примеры',
    example1: '1000 = 1e+3',
    example2: '0.001 = 1e-3',
    example3: '6.022e+23 (Число Авогадро)',
    example4: '3e+8 (Скорость света в м/с)',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация в научную нотацию',
    feature2: 'Конвертация из научной нотации',
    feature3: 'Настраиваемая точность',
    feature4: 'Поддержка очень больших/маленьких чисел',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Научной Нотации',
    aboutText: 'Научная нотация — это способ записи чисел, которые слишком велики или слишком малы для удобной записи в десятичной форме. Она широко используется учёными, математиками и инженерами. Число в научной нотации записывается как a × 10^n, где 1 ≤ |a| < 10 и n — целое число.',
  },
};

export function getScientificNotationTranslations(locale: Locale) {
  return scientificNotationTranslations[locale];
}
