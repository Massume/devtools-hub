import type { Locale } from './i18n';

export const workingDaysTranslations = {
  en: {
    pageTitle: 'Working Days Calculator',
    pageDescription: 'Calculate working days between dates excluding weekends and holidays',

    startDate: 'Start Date',
    endDate: 'End Date',

    calculateButton: 'Calculate',
    clearButton: 'Clear',
    swapButton: 'Swap Dates',

    result: 'Result',
    workingDays: 'Working Days',
    calendarDays: 'Calendar Days',
    weekends: 'Weekend Days',
    weeks: 'Full Weeks',

    excludeWeekends: 'Exclude Weekends',
    saturday: 'Saturday',
    sunday: 'Sunday',

    addDaysMode: 'Add Working Days',
    addDaysLabel: 'Days to Add',
    addDaysPlaceholder: 'Enter number of days...',
    resultDate: 'Result Date',

    modeCalculate: 'Calculate Between Dates',
    modeAdd: 'Add Working Days',

    copied: 'Copied to clipboard!',
    calculatedSuccess: 'Calculated successfully!',
    invalidDates: 'Invalid dates',
    emptyInput: 'Please select both dates',
    startAfterEnd: 'Start date must be before end date',

    quickRanges: 'Quick Ranges',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisQuarter: 'This Quarter',
    thisYear: 'This Year',

    featuresTitle: 'Features',
    feature1: 'Calculate working days between dates',
    feature2: 'Add working days to a date',
    feature3: 'Configurable weekend days',
    feature4: 'Quick date range selection',
    feature5: 'Shows weekends breakdown',
    feature6: 'All processing done locally',

    aboutTitle: 'About Working Days',
    aboutText: 'Working days (or business days) typically exclude weekends. This calculator helps you determine the number of working days between two dates or find a future date by adding working days. Useful for project planning, deadline calculations, and business scheduling.',
  },
  ru: {
    pageTitle: 'Калькулятор Рабочих Дней',
    pageDescription: 'Расчёт рабочих дней между датами без учёта выходных и праздников',

    startDate: 'Дата Начала',
    endDate: 'Дата Окончания',

    calculateButton: 'Рассчитать',
    clearButton: 'Очистить',
    swapButton: 'Поменять Даты',

    result: 'Результат',
    workingDays: 'Рабочих Дней',
    calendarDays: 'Календарных Дней',
    weekends: 'Выходных Дней',
    weeks: 'Полных Недель',

    excludeWeekends: 'Исключить Выходные',
    saturday: 'Суббота',
    sunday: 'Воскресенье',

    addDaysMode: 'Добавить Рабочие Дни',
    addDaysLabel: 'Дней для Добавления',
    addDaysPlaceholder: 'Введите количество дней...',
    resultDate: 'Итоговая Дата',

    modeCalculate: 'Расчёт Между Датами',
    modeAdd: 'Добавить Рабочие Дни',

    copied: 'Скопировано в буфер обмена!',
    calculatedSuccess: 'Успешно рассчитано!',
    invalidDates: 'Неверные даты',
    emptyInput: 'Пожалуйста, выберите обе даты',
    startAfterEnd: 'Дата начала должна быть раньше даты окончания',

    quickRanges: 'Быстрый Выбор',
    thisWeek: 'Эта Неделя',
    thisMonth: 'Этот Месяц',
    thisQuarter: 'Этот Квартал',
    thisYear: 'Этот Год',

    featuresTitle: 'Возможности',
    feature1: 'Расчёт рабочих дней между датами',
    feature2: 'Добавление рабочих дней к дате',
    feature3: 'Настраиваемые выходные дни',
    feature4: 'Быстрый выбор диапазона дат',
    feature5: 'Показывает разбивку выходных',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Рабочих Днях',
    aboutText: 'Рабочие дни (или бизнес-дни) обычно исключают выходные. Этот калькулятор помогает определить количество рабочих дней между двумя датами или найти будущую дату, добавив рабочие дни. Полезно для планирования проектов, расчёта дедлайнов и бизнес-планирования.',
  },
};

export function getWorkingDaysTranslations(locale: Locale) {
  return workingDaysTranslations[locale];
}
