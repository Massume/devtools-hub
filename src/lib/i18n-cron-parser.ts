import type { Locale } from './i18n';

export const cronParserTranslations = {
  en: {
    pageTitle: 'Cron Expression Parser',
    pageDescription: 'Parse and explain cron expressions with next run times',

    inputLabel: 'Cron Expression',
    inputPlaceholder: 'Enter cron expression (e.g., */5 * * * *)...',

    parseButton: 'Parse',
    copyButton: 'Copy',
    clearButton: 'Clear',

    humanReadable: 'Human Readable',
    nextRuns: 'Next 5 Runs',
    breakdown: 'Expression Breakdown',

    minute: 'Minute',
    hour: 'Hour',
    dayOfMonth: 'Day of Month',
    month: 'Month',
    dayOfWeek: 'Day of Week',

    everyMinute: 'Every minute',
    everyHour: 'Every hour',
    everyDay: 'Every day',
    everyMonth: 'Every month',
    everyDayOfWeek: 'Every day of week',

    at: 'at',
    on: 'on',
    every: 'Every',
    minutesPast: 'minutes past the hour',

    commonExpressions: 'Common Expressions',

    copied: 'Copied to clipboard!',
    parsedSuccess: 'Parsed successfully!',
    invalidCron: 'Invalid cron expression',
    emptyInput: 'Please enter a cron expression',

    featuresTitle: 'Features',
    feature1: 'Parse standard cron expressions',
    feature2: 'Human-readable explanations',
    feature3: 'Next run time predictions',
    feature4: 'Field breakdown',
    feature5: 'Common expression presets',
    feature6: 'All processing done locally',

    aboutTitle: 'About Cron Expressions',
    aboutText: 'Cron is a time-based job scheduler in Unix-like operating systems. A cron expression is a string of five fields representing: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday). Special characters include * (any), , (list), - (range), and / (step).',
  },
  ru: {
    pageTitle: 'Парсер Cron Выражений',
    pageDescription: 'Разбор и объяснение cron выражений с временем следующих запусков',

    inputLabel: 'Cron Выражение',
    inputPlaceholder: 'Введите cron выражение (например, */5 * * * *)...',

    parseButton: 'Разобрать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    humanReadable: 'Понятное Описание',
    nextRuns: 'Следующие 5 Запусков',
    breakdown: 'Разбор Выражения',

    minute: 'Минута',
    hour: 'Час',
    dayOfMonth: 'День Месяца',
    month: 'Месяц',
    dayOfWeek: 'День Недели',

    everyMinute: 'Каждую минуту',
    everyHour: 'Каждый час',
    everyDay: 'Каждый день',
    everyMonth: 'Каждый месяц',
    everyDayOfWeek: 'Каждый день недели',

    at: 'в',
    on: 'в',
    every: 'Каждые',
    minutesPast: 'минут после часа',

    commonExpressions: 'Распространённые Выражения',

    copied: 'Скопировано в буфер обмена!',
    parsedSuccess: 'Успешно разобрано!',
    invalidCron: 'Неверное cron выражение',
    emptyInput: 'Пожалуйста, введите cron выражение',

    featuresTitle: 'Возможности',
    feature1: 'Разбор стандартных cron выражений',
    feature2: 'Понятные объяснения',
    feature3: 'Предсказание времени следующих запусков',
    feature4: 'Разбивка по полям',
    feature5: 'Пресеты распространённых выражений',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Cron Выражениях',
    aboutText: 'Cron — это планировщик задач по времени в Unix-подобных операционных системах. Cron выражение — это строка из пяти полей: минута (0-59), час (0-23), день месяца (1-31), месяц (1-12) и день недели (0-6, где 0 — воскресенье). Специальные символы: * (любое), , (список), - (диапазон) и / (шаг).',
  },
};

export function getCronParserTranslations(locale: Locale) {
  return cronParserTranslations[locale];
}
