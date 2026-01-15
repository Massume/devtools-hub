import type { Locale } from './i18n';

export const jsonCsvTranslations = {
  en: {
    pageTitle: 'JSON ↔ CSV/TSV Converter',
    pageDescription: 'Convert between JSON arrays and CSV/TSV tabular data',

    jsonToCsv: 'JSON to CSV',
    csvToJson: 'CSV to JSON',

    inputLabel: 'Input',
    outputLabel: 'Output',

    jsonToCsvButton: 'Convert to CSV',
    csvToJsonButton: 'Convert to JSON',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    jsonPlaceholder: 'Enter JSON array (e.g., [{"name": "John", "age": 30}])...',
    csvPlaceholder: 'Enter CSV data with headers...',

    delimiter: 'Delimiter',
    comma: 'Comma (,)',
    semicolon: 'Semicolon (;)',
    tab: 'Tab (TSV)',

    includeHeaders: 'Include headers',
    flattenObjects: 'Flatten nested objects',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidJson: 'Invalid JSON input',
    invalidCsv: 'Invalid CSV input',
    emptyInput: 'Please enter some data',
    notArray: 'JSON must be an array of objects',

    featuresTitle: 'Features',
    feature1: 'JSON array to CSV conversion',
    feature2: 'CSV to JSON array conversion',
    feature3: 'Multiple delimiter support (CSV, TSV)',
    feature4: 'Flatten nested objects',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About JSON and CSV',
    aboutText: 'JSON (JavaScript Object Notation) and CSV (Comma-Separated Values) are two popular data formats. JSON is great for nested, hierarchical data, while CSV is ideal for tabular data and spreadsheet applications. This tool helps convert between these formats for data interchange.',
  },
  ru: {
    pageTitle: 'JSON ↔ CSV/TSV Конвертер',
    pageDescription: 'Конвертация между JSON массивами и табличными данными CSV/TSV',

    jsonToCsv: 'JSON в CSV',
    csvToJson: 'CSV в JSON',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    jsonToCsvButton: 'Конвертировать в CSV',
    csvToJsonButton: 'Конвертировать в JSON',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    jsonPlaceholder: 'Введите JSON массив (например, [{"name": "John", "age": 30}])...',
    csvPlaceholder: 'Введите CSV данные с заголовками...',

    delimiter: 'Разделитель',
    comma: 'Запятая (,)',
    semicolon: 'Точка с запятой (;)',
    tab: 'Табуляция (TSV)',

    includeHeaders: 'Включить заголовки',
    flattenObjects: 'Развернуть вложенные объекты',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidJson: 'Неверный JSON ввод',
    invalidCsv: 'Неверный CSV ввод',
    emptyInput: 'Пожалуйста, введите данные',
    notArray: 'JSON должен быть массивом объектов',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация JSON массива в CSV',
    feature2: 'Конвертация CSV в JSON массив',
    feature3: 'Поддержка разных разделителей (CSV, TSV)',
    feature4: 'Разворачивание вложенных объектов',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О JSON и CSV',
    aboutText: 'JSON (JavaScript Object Notation) и CSV (Comma-Separated Values) — два популярных формата данных. JSON отлично подходит для вложенных, иерархических данных, тогда как CSV идеален для табличных данных и электронных таблиц. Этот инструмент помогает конвертировать между этими форматами для обмена данными.',
  },
};

export function getJsonCsvTranslations(locale: Locale) {
  return jsonCsvTranslations[locale];
}
