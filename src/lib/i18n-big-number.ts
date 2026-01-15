import type { Locale } from './i18n';

export const bigNumberTranslations = {
  en: {
    pageTitle: 'Big Number Calculator',
    pageDescription: 'Perform arithmetic operations with arbitrarily large integers using BigInt',

    firstNumber: 'First Number',
    secondNumber: 'Second Number',
    result: 'Result',

    firstPlaceholder: 'Enter first number...',
    secondPlaceholder: 'Enter second number...',

    operation: 'Operation',
    add: 'Add (+)',
    subtract: 'Subtract (−)',
    multiply: 'Multiply (×)',
    divide: 'Divide (÷)',
    modulo: 'Modulo (%)',
    power: 'Power (^)',

    calculateButton: 'Calculate',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    swapButton: 'Swap',

    copied: 'Copied to clipboard!',
    calculatedSuccess: 'Successfully calculated!',
    invalidInput: 'Invalid input - please enter valid integers',
    emptyInput: 'Please enter both numbers',
    divisionByZero: 'Cannot divide by zero',
    negativePower: 'Exponent must be non-negative',

    digitCount: 'digits',

    featuresTitle: 'Features',
    feature1: 'Arbitrary precision arithmetic',
    feature2: 'Support for very large integers',
    feature3: 'Basic arithmetic operations',
    feature4: 'Modulo and power operations',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Big Numbers',
    aboutText: 'BigInt is a built-in JavaScript object that provides a way to represent whole numbers larger than 2^53 - 1, which is the largest number JavaScript can reliably represent with the Number primitive. BigInt can be used for arbitrarily large integers, making it useful for cryptography, scientific computing, and other applications requiring high precision.',

    examplesTitle: 'Try These Examples',
    example1: 'Factorial of 100',
    example2: '2^1000',
    example3: 'Large prime multiplication',
  },
  ru: {
    pageTitle: 'Калькулятор Больших Чисел',
    pageDescription: 'Выполнение арифметических операций с произвольно большими целыми числами с помощью BigInt',

    firstNumber: 'Первое Число',
    secondNumber: 'Второе Число',
    result: 'Результат',

    firstPlaceholder: 'Введите первое число...',
    secondPlaceholder: 'Введите второе число...',

    operation: 'Операция',
    add: 'Сложение (+)',
    subtract: 'Вычитание (−)',
    multiply: 'Умножение (×)',
    divide: 'Деление (÷)',
    modulo: 'Остаток (%)',
    power: 'Степень (^)',

    calculateButton: 'Вычислить',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    swapButton: 'Поменять',

    copied: 'Скопировано в буфер обмена!',
    calculatedSuccess: 'Успешно вычислено!',
    invalidInput: 'Неверный ввод — введите корректные целые числа',
    emptyInput: 'Пожалуйста, введите оба числа',
    divisionByZero: 'Нельзя делить на ноль',
    negativePower: 'Показатель степени должен быть неотрицательным',

    digitCount: 'цифр',

    featuresTitle: 'Возможности',
    feature1: 'Арифметика произвольной точности',
    feature2: 'Поддержка очень больших целых чисел',
    feature3: 'Основные арифметические операции',
    feature4: 'Операции остатка и степени',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Больших Числах',
    aboutText: 'BigInt — это встроенный объект JavaScript, который позволяет представлять целые числа больше 2^53 - 1, что является максимальным числом, которое JavaScript может надёжно представить с примитивом Number. BigInt можно использовать для произвольно больших целых чисел, что полезно для криптографии, научных вычислений и других приложений, требующих высокой точности.',

    examplesTitle: 'Попробуйте Эти Примеры',
    example1: 'Факториал 100',
    example2: '2^1000',
    example3: 'Умножение больших простых чисел',
  },
};

export function getBigNumberTranslations(locale: Locale) {
  return bigNumberTranslations[locale];
}
