import type { Locale } from './i18n';

export const calendarWeekTranslations = {
  en: {
    pageTitle: 'Calendar Week Calculator',
    pageDescription: 'Find ISO week number for any date or get dates for a specific week',

    dateToWeek: 'Date to Week',
    weekToDate: 'Week to Date',

    inputDate: 'Select Date',
    inputYear: 'Year',
    inputWeek: 'Week Number',

    calculateButton: 'Calculate',
    clearButton: 'Clear',
    todayButton: 'Today',
    thisWeekButton: 'This Week',

    result: 'Result',
    weekNumber: 'Week Number',
    weekYear: 'Week Year',
    weekStart: 'Week Start (Monday)',
    weekEnd: 'Week End (Sunday)',
    daysInWeek: 'Days',

    isoWeekFormat: 'ISO Week Format',

    weekOfYear: 'of',
    weeksInYear: 'weeks in year',

    copied: 'Copied to clipboard!',
    calculatedSuccess: 'Calculated!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please enter date or week number',
    invalidWeek: 'Invalid week number (1-52/53)',

    currentWeekInfo: 'Current Week',
    today: 'Today',

    yearOverview: 'Year Overview',
    weeksTotal: 'Total Weeks',
    firstWeekStart: 'First Week Starts',
    lastWeekEnd: 'Last Week Ends',

    featuresTitle: 'Features',
    feature1: 'ISO 8601 week numbering',
    feature2: 'Convert date to week number',
    feature3: 'Convert week number to dates',
    feature4: 'Year overview with week count',
    feature5: 'Handles 52 and 53 week years',
    feature6: 'All processing done locally',

    aboutTitle: 'About ISO Week Numbers',
    aboutText: 'ISO 8601 defines week numbering where weeks start on Monday and the first week of the year contains January 4th. Most years have 52 weeks, but some have 53. Week numbers are commonly used in business planning, project management, and logistics across Europe.',
  },
  ru: {
    pageTitle: 'Калькулятор Недели Года',
    pageDescription: 'Определение номера ISO недели для любой даты или получение дат для конкретной недели',

    dateToWeek: 'Дата в Неделю',
    weekToDate: 'Неделя в Дату',

    inputDate: 'Выберите Дату',
    inputYear: 'Год',
    inputWeek: 'Номер Недели',

    calculateButton: 'Рассчитать',
    clearButton: 'Очистить',
    todayButton: 'Сегодня',
    thisWeekButton: 'Эта Неделя',

    result: 'Результат',
    weekNumber: 'Номер Недели',
    weekYear: 'Год Недели',
    weekStart: 'Начало Недели (Понедельник)',
    weekEnd: 'Конец Недели (Воскресенье)',
    daysInWeek: 'Дни',

    isoWeekFormat: 'Формат ISO Недели',

    weekOfYear: 'из',
    weeksInYear: 'недель в году',

    copied: 'Скопировано в буфер обмена!',
    calculatedSuccess: 'Рассчитано!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, введите дату или номер недели',
    invalidWeek: 'Неверный номер недели (1-52/53)',

    currentWeekInfo: 'Текущая Неделя',
    today: 'Сегодня',

    yearOverview: 'Обзор Года',
    weeksTotal: 'Всего Недель',
    firstWeekStart: 'Начало Первой Недели',
    lastWeekEnd: 'Конец Последней Недели',

    featuresTitle: 'Возможности',
    feature1: 'Нумерация недель по ISO 8601',
    feature2: 'Конвертация даты в номер недели',
    feature3: 'Конвертация номера недели в даты',
    feature4: 'Обзор года с количеством недель',
    feature5: 'Поддержка 52 и 53 недельных годов',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Номерах Недель ISO',
    aboutText: 'ISO 8601 определяет нумерацию недель, где недели начинаются в понедельник, а первая неделя года содержит 4 января. Большинство лет имеют 52 недели, но некоторые — 53. Номера недель широко используются в бизнес-планировании, управлении проектами и логистике по всей Европе.',
  },
};

export function getCalendarWeekTranslations(locale: Locale) {
  return calendarWeekTranslations[locale];
}
