import type { Locale } from './i18n';

export const jsonQuerystringTranslations = {
  en: {
    pageTitle: 'JSON ↔ Query String Converter',
    pageDescription: 'Convert between JSON objects and URL query strings',

    jsonToQuery: 'JSON to Query String',
    queryToJson: 'Query String to JSON',

    inputLabel: 'Input',
    outputLabel: 'Output',

    jsonToQueryButton: 'Convert to Query String',
    queryToJsonButton: 'Convert to JSON',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    jsonPlaceholder: 'Enter JSON object (e.g., {"name": "John", "age": 30})...',
    queryPlaceholder: 'Enter query string (e.g., name=John&age=30)...',

    encodeValues: 'URL encode values',
    flattenArrays: 'Flatten arrays (a[0]=1&a[1]=2)',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidJson: 'Invalid JSON input',
    invalidQuery: 'Invalid query string',
    emptyInput: 'Please enter some data',
    mustBeObject: 'JSON must be an object',

    featuresTitle: 'Features',
    feature1: 'JSON to query string conversion',
    feature2: 'Query string to JSON conversion',
    feature3: 'URL encoding support',
    feature4: 'Nested object handling',
    feature5: 'Array parameter support',
    feature6: 'All processing done locally',

    aboutTitle: 'About Query Strings',
    aboutText: 'Query strings are a way to pass data in URLs after the "?" character. They consist of key-value pairs separated by "&". This tool helps convert between JSON objects and query strings for API development, debugging, and data manipulation.',
  },
  ru: {
    pageTitle: 'JSON ↔ Query String Конвертер',
    pageDescription: 'Конвертация между JSON объектами и URL query strings',

    jsonToQuery: 'JSON в Query String',
    queryToJson: 'Query String в JSON',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    jsonToQueryButton: 'Конвертировать в Query String',
    queryToJsonButton: 'Конвертировать в JSON',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    jsonPlaceholder: 'Введите JSON объект (например, {"name": "John", "age": 30})...',
    queryPlaceholder: 'Введите query string (например, name=John&age=30)...',

    encodeValues: 'URL-кодирование значений',
    flattenArrays: 'Развернуть массивы (a[0]=1&a[1]=2)',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidJson: 'Неверный JSON ввод',
    invalidQuery: 'Неверный query string',
    emptyInput: 'Пожалуйста, введите данные',
    mustBeObject: 'JSON должен быть объектом',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация JSON в query string',
    feature2: 'Конвертация query string в JSON',
    feature3: 'Поддержка URL-кодирования',
    feature4: 'Обработка вложенных объектов',
    feature5: 'Поддержка параметров-массивов',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Query Strings',
    aboutText: 'Query strings — это способ передачи данных в URL после символа "?". Они состоят из пар ключ-значение, разделённых "&". Этот инструмент помогает конвертировать между JSON объектами и query strings для разработки API, отладки и манипуляции данными.',
  },
};

export function getJsonQuerystringTranslations(locale: Locale) {
  return jsonQuerystringTranslations[locale];
}
