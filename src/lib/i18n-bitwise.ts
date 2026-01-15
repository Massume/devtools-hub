import type { Locale } from './i18n';

export const bitwiseTranslations = {
  en: {
    pageTitle: 'Bitwise Operations Calculator',
    pageDescription: 'Perform bitwise operations and visualize binary representations',

    firstNumber: 'First Number',
    secondNumber: 'Second Number',
    result: 'Result',

    firstPlaceholder: 'Enter first number...',
    secondPlaceholder: 'Enter second number or shift amount...',

    operation: 'Operation',
    and: 'AND (&)',
    or: 'OR (|)',
    xor: 'XOR (^)',
    not: 'NOT (~)',
    leftShift: 'Left Shift (<<)',
    rightShift: 'Right Shift (>>)',
    unsignedRightShift: 'Unsigned Right (>>>)',

    calculateButton: 'Calculate',
    copyButton: 'Copy',
    clearButton: 'Clear',
    swapButton: 'Swap',

    binaryView: 'Binary View',
    decimalValue: 'Decimal',
    hexValue: 'Hex',
    binaryValue: 'Binary',

    bitWidth: 'Bit Width',
    bits8: '8-bit',
    bits16: '16-bit',
    bits32: '32-bit',

    copied: 'Copied to clipboard!',
    calculatedSuccess: 'Successfully calculated!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please enter numbers',

    truthTableTitle: 'Truth Tables',

    featuresTitle: 'Features',
    feature1: 'AND, OR, XOR, NOT operations',
    feature2: 'Left and Right shift operations',
    feature3: 'Visual binary representation',
    feature4: 'Multiple bit width support',
    feature5: 'Decimal and Hex output',
    feature6: 'All processing done locally',

    aboutTitle: 'About Bitwise Operations',
    aboutText: 'Bitwise operations work directly on the binary representations of numbers. They are fundamental to low-level programming, cryptography, and hardware design. AND (&) returns 1 where both bits are 1, OR (|) returns 1 where either bit is 1, XOR (^) returns 1 where bits differ, and NOT (~) inverts all bits.',
  },
  ru: {
    pageTitle: 'Калькулятор Побитовых Операций',
    pageDescription: 'Выполнение побитовых операций и визуализация двоичных представлений',

    firstNumber: 'Первое Число',
    secondNumber: 'Второе Число',
    result: 'Результат',

    firstPlaceholder: 'Введите первое число...',
    secondPlaceholder: 'Введите второе число или величину сдвига...',

    operation: 'Операция',
    and: 'И (&)',
    or: 'ИЛИ (|)',
    xor: 'XOR (^)',
    not: 'НЕ (~)',
    leftShift: 'Сдвиг влево (<<)',
    rightShift: 'Сдвиг вправо (>>)',
    unsignedRightShift: 'Беззнаковый вправо (>>>)',

    calculateButton: 'Вычислить',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    swapButton: 'Поменять',

    binaryView: 'Двоичный Вид',
    decimalValue: 'Десятичное',
    hexValue: 'Hex',
    binaryValue: 'Двоичное',

    bitWidth: 'Разрядность',
    bits8: '8-бит',
    bits16: '16-бит',
    bits32: '32-бит',

    copied: 'Скопировано в буфер обмена!',
    calculatedSuccess: 'Успешно вычислено!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, введите числа',

    truthTableTitle: 'Таблицы Истинности',

    featuresTitle: 'Возможности',
    feature1: 'Операции AND, OR, XOR, NOT',
    feature2: 'Операции сдвига влево и вправо',
    feature3: 'Визуальное двоичное представление',
    feature4: 'Поддержка разной разрядности',
    feature5: 'Вывод в десятичном и Hex форматах',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Побитовых Операциях',
    aboutText: 'Побитовые операции работают непосредственно с двоичными представлениями чисел. Они являются основой низкоуровневого программирования, криптографии и проектирования аппаратуры. AND (&) возвращает 1, когда оба бита равны 1, OR (|) возвращает 1, когда хотя бы один бит равен 1, XOR (^) возвращает 1, когда биты различаются, а NOT (~) инвертирует все биты.',
  },
};

export function getBitwiseTranslations(locale: Locale) {
  return bitwiseTranslations[locale];
}
