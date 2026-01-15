import type { Locale } from './i18n';

export const ageCalcTranslations = {
  en: {
    pageTitle: 'Age Calculator',
    pageDescription: 'Calculate exact age from birth date with detailed breakdown',

    birthDate: 'Birth Date',
    targetDate: 'Target Date (optional)',
    targetDateHint: 'Leave empty for current date',

    calculateButton: 'Calculate Age',
    clearButton: 'Clear',
    todayButton: 'Today',

    result: 'Your Age',
    years: 'Years',
    months: 'Months',
    weeks: 'Weeks',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',

    nextBirthday: 'Next Birthday',
    daysUntil: 'days until next birthday',
    birthdayToday: 'Happy Birthday!',

    bornOn: 'Born on',
    dayOfWeek: 'Day of week',

    zodiacSign: 'Zodiac Sign',
    chineseZodiac: 'Chinese Zodiac',

    ageInDays: 'Total Days Lived',
    ageInWeeks: 'Total Weeks Lived',
    ageInMonths: 'Total Months Lived',
    ageInHours: 'Total Hours Lived',

    copied: 'Copied to clipboard!',
    calculatedSuccess: 'Age calculated!',
    invalidDate: 'Invalid date',
    futureDate: 'Birth date cannot be in the future',
    emptyInput: 'Please enter birth date',

    featuresTitle: 'Features',
    feature1: 'Exact age calculation',
    feature2: 'Multiple time units',
    feature3: 'Next birthday countdown',
    feature4: 'Zodiac sign detection',
    feature5: 'Chinese zodiac year',
    feature6: 'All processing done locally',

    aboutTitle: 'About Age Calculation',
    aboutText: 'This calculator determines your exact age by computing the difference between your birth date and the current (or specified) date. It accounts for leap years and varying month lengths to provide accurate results in years, months, days, and other time units.',
  },
  ru: {
    pageTitle: 'Калькулятор Возраста',
    pageDescription: 'Расчёт точного возраста от даты рождения с детальной разбивкой',

    birthDate: 'Дата Рождения',
    targetDate: 'Целевая Дата (опционально)',
    targetDateHint: 'Оставьте пустым для текущей даты',

    calculateButton: 'Рассчитать Возраст',
    clearButton: 'Очистить',
    todayButton: 'Сегодня',

    result: 'Ваш Возраст',
    years: 'Лет',
    months: 'Месяцев',
    weeks: 'Недель',
    days: 'Дней',
    hours: 'Часов',
    minutes: 'Минут',

    nextBirthday: 'Следующий День Рождения',
    daysUntil: 'дней до следующего дня рождения',
    birthdayToday: 'С Днём Рождения!',

    bornOn: 'Родились',
    dayOfWeek: 'День недели',

    zodiacSign: 'Знак Зодиака',
    chineseZodiac: 'Китайский Зодиак',

    ageInDays: 'Всего Дней Прожито',
    ageInWeeks: 'Всего Недель Прожито',
    ageInMonths: 'Всего Месяцев Прожито',
    ageInHours: 'Всего Часов Прожито',

    copied: 'Скопировано в буфер обмена!',
    calculatedSuccess: 'Возраст рассчитан!',
    invalidDate: 'Неверная дата',
    futureDate: 'Дата рождения не может быть в будущем',
    emptyInput: 'Пожалуйста, введите дату рождения',

    featuresTitle: 'Возможности',
    feature1: 'Точный расчёт возраста',
    feature2: 'Несколько единиц времени',
    feature3: 'Обратный отсчёт до дня рождения',
    feature4: 'Определение знака зодиака',
    feature5: 'Год по китайскому зодиаку',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Расчёте Возраста',
    aboutText: 'Этот калькулятор определяет ваш точный возраст, вычисляя разницу между датой рождения и текущей (или указанной) датой. Он учитывает високосные годы и разную длину месяцев для предоставления точных результатов в годах, месяцах, днях и других единицах времени.',
  },
};

export function getAgeCalcTranslations(locale: Locale) {
  return ageCalcTranslations[locale];
}
