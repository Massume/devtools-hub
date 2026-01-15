import type { Locale } from './i18n';

export const dateFormatTranslations = {
  en: {
    pageTitle: 'Date Format Converter',
    pageDescription: 'Convert dates between different formats (ISO 8601, RFC 2822, strftime)',

    inputLabel: 'Input Date',
    inputPlaceholder: 'Enter date or select from presets...',
    outputLabel: 'Output',

    inputFormat: 'Input Format',
    outputFormat: 'Output Format',
    customFormat: 'Custom Format',
    customPlaceholder: 'e.g., %Y-%m-%d %H:%M:%S',

    formatAuto: 'Auto-detect',
    formatISO: 'ISO 8601',
    formatRFC: 'RFC 2822',
    formatUnix: 'Unix Timestamp',
    formatCustom: 'Custom (strftime)',

    convertButton: 'Convert',
    copyButton: 'Copy',
    clearButton: 'Clear',
    nowButton: 'Now',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidDate: 'Invalid date format',
    emptyInput: 'Please enter a date',

    strftimeRef: 'Strftime Reference',
    strftimeY: '%Y - 4-digit year (2024)',
    strftimem: '%m - Month (01-12)',
    strftimed: '%d - Day (01-31)',
    strftimeH: '%H - Hour 24h (00-23)',
    strftimeM: '%M - Minute (00-59)',
    strftimeS: '%S - Second (00-59)',
    strftimeA: '%A - Weekday name',
    strftimeB: '%B - Month name',
    strftimez: '%z - Timezone offset',

    presetsTitle: 'Common Formats',
    presetISO: 'ISO 8601',
    presetRFC: 'RFC 2822',
    presetUS: 'US Format',
    presetEU: 'EU Format',
    presetSQL: 'SQL DateTime',
    presetLog: 'Log Format',

    featuresTitle: 'Features',
    feature1: 'ISO 8601 format support',
    feature2: 'RFC 2822 email date format',
    feature3: 'Unix timestamp conversion',
    feature4: 'Custom strftime patterns',
    feature5: 'Auto-detect input format',
    feature6: 'All processing done locally',

    aboutTitle: 'About Date Formats',
    aboutText: 'Different systems use different date formats. ISO 8601 (2024-01-15T10:30:00Z) is the international standard. RFC 2822 (Mon, 15 Jan 2024 10:30:00 +0000) is used in emails. Unix timestamps count seconds since January 1, 1970. Strftime patterns allow custom formatting.',
  },
  ru: {
    pageTitle: 'Конвертер Форматов Дат',
    pageDescription: 'Конвертация дат между различными форматами (ISO 8601, RFC 2822, strftime)',

    inputLabel: 'Входная Дата',
    inputPlaceholder: 'Введите дату или выберите из пресетов...',
    outputLabel: 'Результат',

    inputFormat: 'Входной Формат',
    outputFormat: 'Выходной Формат',
    customFormat: 'Пользовательский Формат',
    customPlaceholder: 'напр., %Y-%m-%d %H:%M:%S',

    formatAuto: 'Авто-определение',
    formatISO: 'ISO 8601',
    formatRFC: 'RFC 2822',
    formatUnix: 'Unix Timestamp',
    formatCustom: 'Пользовательский (strftime)',

    convertButton: 'Конвертировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    nowButton: 'Сейчас',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно конвертировано!',
    invalidDate: 'Неверный формат даты',
    emptyInput: 'Пожалуйста, введите дату',

    strftimeRef: 'Справочник Strftime',
    strftimeY: '%Y - 4-значный год (2024)',
    strftimem: '%m - Месяц (01-12)',
    strftimed: '%d - День (01-31)',
    strftimeH: '%H - Час 24ч (00-23)',
    strftimeM: '%M - Минута (00-59)',
    strftimeS: '%S - Секунда (00-59)',
    strftimeA: '%A - Название дня недели',
    strftimeB: '%B - Название месяца',
    strftimez: '%z - Смещение часового пояса',

    presetsTitle: 'Популярные Форматы',
    presetISO: 'ISO 8601',
    presetRFC: 'RFC 2822',
    presetUS: 'US Формат',
    presetEU: 'EU Формат',
    presetSQL: 'SQL DateTime',
    presetLog: 'Лог Формат',

    featuresTitle: 'Возможности',
    feature1: 'Поддержка формата ISO 8601',
    feature2: 'Формат RFC 2822 для email',
    feature3: 'Конвертация Unix timestamp',
    feature4: 'Пользовательские паттерны strftime',
    feature5: 'Авто-определение входного формата',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Форматах Дат',
    aboutText: 'Разные системы используют разные форматы дат. ISO 8601 (2024-01-15T10:30:00Z) — международный стандарт. RFC 2822 (Mon, 15 Jan 2024 10:30:00 +0000) используется в email. Unix timestamp считает секунды с 1 января 1970 года. Паттерны strftime позволяют создавать пользовательские форматы.',
  },
};

export function getDateFormatTranslations(locale: Locale) {
  return dateFormatTranslations[locale];
}
