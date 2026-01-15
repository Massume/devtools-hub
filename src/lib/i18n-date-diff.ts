import type { Locale } from './i18n';

export const dateDiffTranslations = {
  en: {
    pageTitle: 'Date Difference Calculator',
    pageDescription: 'Calculate the difference between two dates in various units',

    startDate: 'Start Date',
    endDate: 'End Date',
    result: 'Difference',

    calculateButton: 'Calculate',
    swapButton: 'Swap Dates',
    clearButton: 'Clear',
    todayButton: 'Today',

    years: 'Years',
    months: 'Months',
    weeks: 'Weeks',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',

    totalDays: 'Total Days',
    totalHours: 'Total Hours',
    totalMinutes: 'Total Minutes',
    totalSeconds: 'Total Seconds',

    breakdown: 'Breakdown',
    andText: 'and',

    emptyInput: 'Please select both dates',
    invalidDates: 'Invalid dates',
    calculatedSuccess: 'Calculated!',

    featuresTitle: 'Features',
    feature1: 'Calculate difference between any two dates',
    feature2: 'Multiple unit outputs',
    feature3: 'Detailed breakdown',
    feature4: 'Swap dates easily',
    feature5: 'Include time for precision',
    feature6: 'All processing done locally',

    aboutTitle: 'About Date Calculations',
    aboutText: 'Date difference calculations are essential for project planning, age calculation, event countdowns, and many other applications. This tool provides accurate calculations accounting for varying month lengths and leap years.',
  },
  ru: {
    pageTitle: 'Калькулятор Разницы Дат',
    pageDescription: 'Вычисление разницы между двумя датами в различных единицах',

    startDate: 'Начальная Дата',
    endDate: 'Конечная Дата',
    result: 'Разница',

    calculateButton: 'Вычислить',
    swapButton: 'Поменять Даты',
    clearButton: 'Очистить',
    todayButton: 'Сегодня',

    years: 'Лет',
    months: 'Месяцев',
    weeks: 'Недель',
    days: 'Дней',
    hours: 'Часов',
    minutes: 'Минут',
    seconds: 'Секунд',

    totalDays: 'Всего Дней',
    totalHours: 'Всего Часов',
    totalMinutes: 'Всего Минут',
    totalSeconds: 'Всего Секунд',

    breakdown: 'Разбивка',
    andText: 'и',

    emptyInput: 'Пожалуйста, выберите обе даты',
    invalidDates: 'Неверные даты',
    calculatedSuccess: 'Вычислено!',

    featuresTitle: 'Возможности',
    feature1: 'Вычисление разницы между любыми двумя датами',
    feature2: 'Вывод в различных единицах',
    feature3: 'Детальная разбивка',
    feature4: 'Лёгкая смена дат местами',
    feature5: 'Включение времени для точности',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Вычислении Дат',
    aboutText: 'Вычисление разницы дат необходимо для планирования проектов, расчёта возраста, отсчёта до событий и многих других применений. Этот инструмент обеспечивает точные вычисления с учётом различной длины месяцев и високосных годов.',
  },
};

export function getDateDiffTranslations(locale: Locale) {
  return dateDiffTranslations[locale];
}
