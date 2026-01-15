import type { Locale } from './i18n';

export const leapYearTranslations = {
  en: {
    pageTitle: 'Leap Year Checker',
    pageDescription: 'Check if a year is a leap year and explore leap year patterns',

    inputYear: 'Enter Year',
    inputPlaceholder: 'e.g., 2024',

    checkButton: 'Check',
    clearButton: 'Clear',
    currentYearButton: 'Current Year',

    result: 'Result',
    isLeapYear: 'is a leap year',
    isNotLeapYear: 'is not a leap year',
    daysInYear: 'Days in year',
    daysInFebruary: 'Days in February',

    leapYearRules: 'Leap Year Rules',
    rule1: 'Divisible by 4',
    rule2: 'NOT divisible by 100 (unless rule 3)',
    rule3: 'Divisible by 400',

    ruleResult: 'Rule Check',
    divisibleBy4: 'Divisible by 4',
    divisibleBy100: 'Divisible by 100',
    divisibleBy400: 'Divisible by 400',
    yes: 'Yes',
    no: 'No',

    nearbyLeapYears: 'Nearby Leap Years',
    previous: 'Previous',
    next: 'Next',

    leapYearList: 'Leap Years in Range',
    fromYear: 'From',
    toYear: 'To',
    showList: 'Show List',
    leapYearsFound: 'leap years found',

    copied: 'Copied to clipboard!',
    checkedSuccess: 'Year checked!',
    invalidYear: 'Invalid year',
    emptyInput: 'Please enter a year',

    featuresTitle: 'Features',
    feature1: 'Instant leap year check',
    feature2: 'Visual rule breakdown',
    feature3: 'Nearby leap years',
    feature4: 'Leap year range finder',
    feature5: 'Gregorian calendar rules',
    feature6: 'All processing done locally',

    aboutTitle: 'About Leap Years',
    aboutText: 'A leap year has 366 days instead of 365, with February having 29 days. The Gregorian calendar adds a leap day to keep the calendar year synchronized with the astronomical year. The rules are: divisible by 4, except for years divisible by 100, unless also divisible by 400. So 2000 was a leap year, but 1900 was not.',
  },
  ru: {
    pageTitle: 'Проверка Високосного Года',
    pageDescription: 'Проверка, является ли год високосным, и изучение паттернов високосных годов',

    inputYear: 'Введите Год',
    inputPlaceholder: 'напр., 2024',

    checkButton: 'Проверить',
    clearButton: 'Очистить',
    currentYearButton: 'Текущий Год',

    result: 'Результат',
    isLeapYear: 'високосный год',
    isNotLeapYear: 'не високосный год',
    daysInYear: 'Дней в году',
    daysInFebruary: 'Дней в феврале',

    leapYearRules: 'Правила Високосного Года',
    rule1: 'Делится на 4',
    rule2: 'НЕ делится на 100 (кроме правила 3)',
    rule3: 'Делится на 400',

    ruleResult: 'Проверка Правил',
    divisibleBy4: 'Делится на 4',
    divisibleBy100: 'Делится на 100',
    divisibleBy400: 'Делится на 400',
    yes: 'Да',
    no: 'Нет',

    nearbyLeapYears: 'Ближайшие Високосные Годы',
    previous: 'Предыдущий',
    next: 'Следующий',

    leapYearList: 'Високосные Годы в Диапазоне',
    fromYear: 'От',
    toYear: 'До',
    showList: 'Показать Список',
    leapYearsFound: 'високосных годов найдено',

    copied: 'Скопировано в буфер обмена!',
    checkedSuccess: 'Год проверен!',
    invalidYear: 'Неверный год',
    emptyInput: 'Пожалуйста, введите год',

    featuresTitle: 'Возможности',
    feature1: 'Мгновенная проверка високосного года',
    feature2: 'Визуальная разбивка по правилам',
    feature3: 'Ближайшие високосные годы',
    feature4: 'Поиск високосных годов в диапазоне',
    feature5: 'Правила григорианского календаря',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Високосных Годах',
    aboutText: 'Високосный год имеет 366 дней вместо 365, при этом февраль содержит 29 дней. Григорианский календарь добавляет високосный день для синхронизации календарного года с астрономическим. Правила: делится на 4, за исключением годов, делящихся на 100, если они также не делятся на 400. Так, 2000 был високосным, а 1900 — нет.',
  },
};

export function getLeapYearTranslations(locale: Locale) {
  return leapYearTranslations[locale];
}
