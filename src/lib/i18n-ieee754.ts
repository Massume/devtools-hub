import type { Locale } from './i18n';

export const ieee754Translations = {
  en: {
    pageTitle: 'IEEE 754 Float Visualizer',
    pageDescription: 'Visualize and understand IEEE 754 floating-point number representation',

    inputLabel: 'Decimal Number',
    inputPlaceholder: 'Enter a decimal number...',
    hexInput: 'Hexadecimal',
    hexPlaceholder: 'Enter hex representation...',

    precision: 'Precision',
    float32: 'Float32 (Single)',
    float64: 'Float64 (Double)',

    convertButton: 'Visualize',
    copyButton: 'Copy',
    clearButton: 'Clear',

    binaryRepresentation: 'Binary Representation',
    sign: 'Sign',
    exponent: 'Exponent',
    mantissa: 'Mantissa (Fraction)',

    signBit: 'Sign Bit',
    positive: 'Positive (0)',
    negative: 'Negative (1)',

    exponentBits: 'Exponent Bits',
    exponentValue: 'Exponent Value',
    bias: 'Bias',
    biasedExponent: 'Biased Exponent',

    mantissaBits: 'Mantissa Bits',
    implicitBit: 'Implicit leading 1',

    hexValue: 'Hex Value',
    actualValue: 'Actual Value',

    copied: 'Copied to clipboard!',
    visualizedSuccess: 'Successfully visualized!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please enter a number',

    specialValues: 'Special Values',
    positiveInfinity: '+Infinity',
    negativeInfinity: '-Infinity',
    nan: 'NaN',
    positiveZero: '+0',
    negativeZero: '-0',
    maxValue: 'Max Value',
    minPositive: 'Min Positive',

    featuresTitle: 'Features',
    feature1: 'Visualize float32 and float64',
    feature2: 'Interactive bit visualization',
    feature3: 'Sign, exponent, mantissa breakdown',
    feature4: 'Hex representation',
    feature5: 'Special values support',
    feature6: 'All processing done locally',

    aboutTitle: 'About IEEE 754',
    aboutText: 'IEEE 754 is a technical standard for floating-point computation. It defines formats for representing floating-point numbers (including negative zero, denormalized numbers, infinities, and NaN) and specifies rules for operations. Float32 uses 1 sign bit, 8 exponent bits, and 23 mantissa bits. Float64 uses 1 sign bit, 11 exponent bits, and 52 mantissa bits.',
  },
  ru: {
    pageTitle: 'Визуализатор IEEE 754 Float',
    pageDescription: 'Визуализация и понимание представления чисел с плавающей точкой IEEE 754',

    inputLabel: 'Десятичное Число',
    inputPlaceholder: 'Введите десятичное число...',
    hexInput: 'Шестнадцатеричное',
    hexPlaceholder: 'Введите hex представление...',

    precision: 'Точность',
    float32: 'Float32 (Одинарная)',
    float64: 'Float64 (Двойная)',

    convertButton: 'Визуализировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    binaryRepresentation: 'Двоичное Представление',
    sign: 'Знак',
    exponent: 'Экспонента',
    mantissa: 'Мантисса (Дробь)',

    signBit: 'Бит Знака',
    positive: 'Положительный (0)',
    negative: 'Отрицательный (1)',

    exponentBits: 'Биты Экспоненты',
    exponentValue: 'Значение Экспоненты',
    bias: 'Смещение',
    biasedExponent: 'Смещённая Экспонента',

    mantissaBits: 'Биты Мантиссы',
    implicitBit: 'Неявная ведущая 1',

    hexValue: 'Hex Значение',
    actualValue: 'Фактическое Значение',

    copied: 'Скопировано в буфер обмена!',
    visualizedSuccess: 'Успешно визуализировано!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, введите число',

    specialValues: 'Специальные Значения',
    positiveInfinity: '+Infinity',
    negativeInfinity: '-Infinity',
    nan: 'NaN',
    positiveZero: '+0',
    negativeZero: '-0',
    maxValue: 'Макс. Значение',
    minPositive: 'Мин. Положительное',

    featuresTitle: 'Возможности',
    feature1: 'Визуализация float32 и float64',
    feature2: 'Интерактивная визуализация битов',
    feature3: 'Разбор знака, экспоненты, мантиссы',
    feature4: 'Hex представление',
    feature5: 'Поддержка специальных значений',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'Об IEEE 754',
    aboutText: 'IEEE 754 — это технический стандарт для вычислений с плавающей точкой. Он определяет форматы для представления чисел с плавающей точкой (включая отрицательный ноль, денормализованные числа, бесконечности и NaN) и задаёт правила операций. Float32 использует 1 бит знака, 8 бит экспоненты и 23 бита мантиссы. Float64 использует 1 бит знака, 11 бит экспоненты и 52 бита мантиссы.',
  },
};

export function getIeee754Translations(locale: Locale) {
  return ieee754Translations[locale];
}
