import type { Locale } from './i18n';

export const unixTimestampTranslations = {
  en: {
    pageTitle: 'Unix Timestamp Converter',
    pageDescription: 'Convert between Unix timestamps and human-readable dates',

    timestampToDate: 'Timestamp to Date',
    dateToTimestamp: 'Date to Timestamp',

    inputLabel: 'Input',
    outputLabel: 'Output',

    timestampPlaceholder: 'Enter Unix timestamp (e.g., 1704067200)...',
    datePlaceholder: 'Select date and time...',

    convertButton: 'Convert',
    copyButton: 'Copy',
    clearButton: 'Clear',
    nowButton: 'Now',

    currentTimestamp: 'Current Timestamp',
    seconds: 'Seconds',
    milliseconds: 'Milliseconds',

    format: 'Format',
    formatLocal: 'Local Time',
    formatUtc: 'UTC',
    formatIso: 'ISO 8601',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidTimestamp: 'Invalid timestamp',
    invalidDate: 'Invalid date',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Unix timestamp to date conversion',
    feature2: 'Date to Unix timestamp conversion',
    feature3: 'Seconds and milliseconds support',
    feature4: 'Multiple format outputs',
    feature5: 'Current time display',
    feature6: 'All processing done locally',

    aboutTitle: 'About Unix Timestamps',
    aboutText: 'Unix timestamp (also known as Epoch time or POSIX time) is a system for describing a point in time as the number of seconds that have elapsed since January 1, 1970 (midnight UTC). It is widely used in computing for recording event timestamps, database records, and API communications.',
  },
  ru: {
    pageTitle: 'Конвертер Unix Timestamp',
    pageDescription: 'Конвертация между Unix временными метками и читаемыми датами',

    timestampToDate: 'Timestamp в Дату',
    dateToTimestamp: 'Дата в Timestamp',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    timestampPlaceholder: 'Введите Unix timestamp (например, 1704067200)...',
    datePlaceholder: 'Выберите дату и время...',

    convertButton: 'Конвертировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    nowButton: 'Сейчас',

    currentTimestamp: 'Текущий Timestamp',
    seconds: 'Секунды',
    milliseconds: 'Миллисекунды',

    format: 'Формат',
    formatLocal: 'Местное время',
    formatUtc: 'UTC',
    formatIso: 'ISO 8601',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidTimestamp: 'Неверный timestamp',
    invalidDate: 'Неверная дата',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация Unix timestamp в дату',
    feature2: 'Конвертация даты в Unix timestamp',
    feature3: 'Поддержка секунд и миллисекунд',
    feature4: 'Множество форматов вывода',
    feature5: 'Отображение текущего времени',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Unix Timestamp',
    aboutText: 'Unix timestamp (также известен как Epoch time или POSIX time) — это система описания момента времени как количества секунд, прошедших с 1 января 1970 года (полночь UTC). Широко используется в вычислительной технике для записи временных меток событий, записей баз данных и коммуникации API.',
  },
};

export function getUnixTimestampTranslations(locale: Locale) {
  return unixTimestampTranslations[locale];
}
