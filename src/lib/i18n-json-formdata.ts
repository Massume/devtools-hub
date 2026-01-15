import type { Locale } from './i18n';

export const jsonFormdataTranslations = {
  en: {
    pageTitle: 'JSON ↔ Form Data Converter',
    pageDescription: 'Convert between JSON objects and form data (application/x-www-form-urlencoded)',

    jsonToForm: 'JSON to Form Data',
    formToJson: 'Form Data to JSON',

    inputLabel: 'Input',
    outputLabel: 'Output',

    jsonToFormButton: 'Convert to Form Data',
    formToJsonButton: 'Convert to JSON',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    jsonPlaceholder: 'Enter JSON object...',
    formPlaceholder: 'Enter form data (key=value pairs, one per line or &-separated)...',

    encodeValues: 'URL encode values',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidJson: 'Invalid JSON input',
    invalidForm: 'Invalid form data',
    emptyInput: 'Please enter some data',
    mustBeObject: 'JSON must be an object',

    featuresTitle: 'Features',
    feature1: 'JSON to form data conversion',
    feature2: 'Form data to JSON conversion',
    feature3: 'URL encoding support',
    feature4: 'Nested object flattening',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Form Data',
    aboutText: 'Form data (application/x-www-form-urlencoded) is the default content type for HTML form submissions. It encodes data as key-value pairs where special characters are percent-encoded. This tool helps convert between JSON and form data formats for API development and testing.',
  },
  ru: {
    pageTitle: 'JSON ↔ Form Data Конвертер',
    pageDescription: 'Конвертация между JSON объектами и form data (application/x-www-form-urlencoded)',

    jsonToForm: 'JSON в Form Data',
    formToJson: 'Form Data в JSON',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    jsonToFormButton: 'Конвертировать в Form Data',
    formToJsonButton: 'Конвертировать в JSON',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    jsonPlaceholder: 'Введите JSON объект...',
    formPlaceholder: 'Введите form data (пары ключ=значение, по одной на строку или через &)...',

    encodeValues: 'URL-кодирование значений',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidJson: 'Неверный JSON ввод',
    invalidForm: 'Неверный form data',
    emptyInput: 'Пожалуйста, введите данные',
    mustBeObject: 'JSON должен быть объектом',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация JSON в form data',
    feature2: 'Конвертация form data в JSON',
    feature3: 'Поддержка URL-кодирования',
    feature4: 'Разворачивание вложенных объектов',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Form Data',
    aboutText: 'Form data (application/x-www-form-urlencoded) — это тип контента по умолчанию для отправки HTML форм. Он кодирует данные как пары ключ-значение, где специальные символы кодируются процентами. Этот инструмент помогает конвертировать между JSON и форматом form data для разработки и тестирования API.',
  },
};

export function getJsonFormdataTranslations(locale: Locale) {
  return jsonFormdataTranslations[locale];
}
