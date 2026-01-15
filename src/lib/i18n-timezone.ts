import type { Locale } from './i18n';

export const timezoneTranslations = {
  en: {
    pageTitle: 'Timezone Converter',
    pageDescription: 'Convert times between different timezones worldwide',

    sourceTime: 'Source Time',
    sourceTimezone: 'Source Timezone',
    targetTimezone: 'Target Timezone',
    result: 'Converted Time',

    selectTimezone: 'Select timezone...',
    nowButton: 'Now',
    swapButton: 'Swap',
    convertButton: 'Convert',
    copyButton: 'Copy',
    clearButton: 'Clear',

    datePlaceholder: 'Select date...',
    timePlaceholder: 'Select time...',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidInput: 'Invalid input',
    emptyInput: 'Please select date, time and timezones',

    timeDifference: 'Time Difference',
    hoursAhead: 'hours ahead',
    hoursBehind: 'hours behind',
    sameTime: 'Same time',

    popularTimezones: 'Popular Timezones',
    allTimezones: 'All Timezones',

    featuresTitle: 'Features',
    feature1: 'Convert between any timezones',
    feature2: 'Support for DST (Daylight Saving)',
    feature3: 'Popular timezone shortcuts',
    feature4: 'Show time difference',
    feature5: 'Current time quick fill',
    feature6: 'All processing done locally',

    aboutTitle: 'About Timezones',
    aboutText: 'Timezones are regions that observe the same standard time. UTC (Coordinated Universal Time) is the primary time standard. Most timezones are offset from UTC by whole hours, but some use 30 or 45 minute offsets. Daylight Saving Time (DST) shifts clocks forward in summer in many regions.',
  },
  ru: {
    pageTitle: 'Конвертер Часовых Поясов',
    pageDescription: 'Конвертация времени между различными часовыми поясами мира',

    sourceTime: 'Исходное Время',
    sourceTimezone: 'Исходный Часовой Пояс',
    targetTimezone: 'Целевой Часовой Пояс',
    result: 'Конвертированное Время',

    selectTimezone: 'Выберите часовой пояс...',
    nowButton: 'Сейчас',
    swapButton: 'Поменять',
    convertButton: 'Конвертировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    datePlaceholder: 'Выберите дату...',
    timePlaceholder: 'Выберите время...',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно конвертировано!',
    invalidInput: 'Неверный ввод',
    emptyInput: 'Пожалуйста, выберите дату, время и часовые пояса',

    timeDifference: 'Разница Во Времени',
    hoursAhead: 'часов вперёд',
    hoursBehind: 'часов назад',
    sameTime: 'Одинаковое время',

    popularTimezones: 'Популярные Часовые Пояса',
    allTimezones: 'Все Часовые Пояса',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация между любыми часовыми поясами',
    feature2: 'Поддержка летнего времени (DST)',
    feature3: 'Быстрый доступ к популярным поясам',
    feature4: 'Отображение разницы во времени',
    feature5: 'Быстрая вставка текущего времени',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Часовых Поясах',
    aboutText: 'Часовые пояса — это регионы, соблюдающие единое стандартное время. UTC (Всемирное координированное время) — основной стандарт времени. Большинство часовых поясов смещены от UTC на целые часы, но некоторые используют смещение в 30 или 45 минут. Летнее время (DST) переводит часы вперёд летом во многих регионах.',
  },
};

export function getTimezoneTranslations(locale: Locale) {
  return timezoneTranslations[locale];
}
