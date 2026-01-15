import type { Locale } from './i18n';

export const xmlJsonTranslations = {
  en: {
    pageTitle: 'XML ↔ JSON Converter',
    pageDescription: 'Convert between XML and JSON formats with attribute support',

    xmlToJson: 'XML to JSON',
    jsonToXml: 'JSON to XML',

    inputLabel: 'Input',
    outputLabel: 'Output',

    xmlToJsonButton: 'Convert to JSON',
    jsonToXmlButton: 'Convert to XML',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    formatButton: 'Format',

    xmlPlaceholder: 'Enter XML...',
    jsonPlaceholder: 'Enter JSON...',

    preserveAttributes: 'Preserve attributes (@attr)',
    indent: 'Indent output',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidXml: 'Invalid XML input',
    invalidJson: 'Invalid JSON input',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'XML to JSON conversion',
    feature2: 'JSON to XML conversion',
    feature3: 'Attribute preservation',
    feature4: 'Pretty printing',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About XML and JSON',
    aboutText: 'XML (eXtensible Markup Language) and JSON (JavaScript Object Notation) are two popular data interchange formats. XML uses tags and attributes, while JSON uses key-value pairs. Converting between them is useful for API integration, data migration, and format standardization.',
  },
  ru: {
    pageTitle: 'XML ↔ JSON Конвертер',
    pageDescription: 'Конвертация между XML и JSON форматами с поддержкой атрибутов',

    xmlToJson: 'XML в JSON',
    jsonToXml: 'JSON в XML',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    xmlToJsonButton: 'Конвертировать в JSON',
    jsonToXmlButton: 'Конвертировать в XML',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    formatButton: 'Форматировать',

    xmlPlaceholder: 'Введите XML...',
    jsonPlaceholder: 'Введите JSON...',

    preserveAttributes: 'Сохранять атрибуты (@attr)',
    indent: 'Форматировать вывод',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidXml: 'Неверный XML ввод',
    invalidJson: 'Неверный JSON ввод',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация XML в JSON',
    feature2: 'Конвертация JSON в XML',
    feature3: 'Сохранение атрибутов',
    feature4: 'Форматированный вывод',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'Об XML и JSON',
    aboutText: 'XML (eXtensible Markup Language) и JSON (JavaScript Object Notation) — два популярных формата обмена данными. XML использует теги и атрибуты, тогда как JSON использует пары ключ-значение. Конвертация между ними полезна для интеграции API, миграции данных и стандартизации форматов.',
  },
};

export function getXmlJsonTranslations(locale: Locale) {
  return xmlJsonTranslations[locale];
}
