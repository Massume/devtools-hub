import type { Locale } from './i18n';

export const formatTranslations = {
  en: {
    // Page metadata
    pageTitle: 'Format Converter - JSON, YAML, XML, CSV, TOML',
    pageDescription: 'Convert between JSON, YAML, XML, CSV, and TOML formats with real-time preview',

    // Main UI
    inputLabel: 'Input',
    outputLabel: 'Output',
    convertButton: 'Convert',
    clearButton: 'Clear',
    swapButton: 'Swap Formats',
    pasteButton: 'Paste',
    copyButton: 'Copy',
    downloadButton: 'Download',
    copied: 'Copied!',

    // Format names
    formatJson: 'JSON',
    formatYaml: 'YAML',
    formatXml: 'XML',
    formatCsv: 'CSV',
    formatToml: 'TOML',

    // Placeholders
    inputPlaceholder: 'Enter or paste your data here...',
    outputPlaceholder: 'Converted output will appear here...',

    // Options
    optionsTitle: 'Conversion Options',
    jsonIndent: 'JSON Indentation',
    jsonSortKeys: 'Sort JSON Keys',
    yamlIndent: 'YAML Indentation',
    yamlLineWidth: 'YAML Line Width',
    xmlIndent: 'XML Indentation',
    xmlRootName: 'XML Root Element Name',
    xmlDeclaration: 'Include XML Declaration',
    csvDelimiter: 'CSV Delimiter',
    csvHeader: 'CSV Include Header',

    // Delimiter options
    delimiterComma: 'Comma (,)',
    delimiterSemicolon: 'Semicolon (;)',
    delimiterTab: 'Tab (\\t)',
    delimiterPipe: 'Pipe (|)',

    // Status messages
    conversionSuccess: 'Conversion successful!',
    conversionError: 'Conversion error',
    emptyInput: 'Please enter some data to convert',
    invalidFormat: 'Invalid input format',

    // Features
    featuresTitle: 'Features',
    feature1: 'Real-time conversion between 5 formats',
    feature2: 'Syntax highlighting for all formats',
    feature3: 'Customizable formatting options',
    feature4: 'Swap formats with one click',
    feature5: 'Download converted files',
    feature6: 'All processing done locally',

    // Error messages
    errorJsonParse: 'Invalid JSON format',
    errorYamlParse: 'Invalid YAML format',
    errorXmlParse: 'Invalid XML format',
    errorCsvParse: 'Invalid CSV format',
    errorTomlParse: 'Invalid TOML format',
    errorArrayRequired: 'Input must be an array for CSV conversion',
    errorObjectRequired: 'Input must be an object for TOML conversion',
  },
  ru: {
    // Page metadata
    pageTitle: 'Конвертер Форматов - JSON, YAML, XML, CSV, TOML',
    pageDescription: 'Конвертация между форматами JSON, YAML, XML, CSV и TOML с предпросмотром в реальном времени',

    // Main UI
    inputLabel: 'Ввод',
    outputLabel: 'Вывод',
    convertButton: 'Конвертировать',
    clearButton: 'Очистить',
    swapButton: 'Поменять Форматы',
    pasteButton: 'Вставить',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    copied: 'Скопировано!',

    // Format names
    formatJson: 'JSON',
    formatYaml: 'YAML',
    formatXml: 'XML',
    formatCsv: 'CSV',
    formatToml: 'TOML',

    // Placeholders
    inputPlaceholder: 'Введите или вставьте данные здесь...',
    outputPlaceholder: 'Результат конвертации появится здесь...',

    // Options
    optionsTitle: 'Параметры Конвертации',
    jsonIndent: 'Отступ JSON',
    jsonSortKeys: 'Сортировать Ключи JSON',
    yamlIndent: 'Отступ YAML',
    yamlLineWidth: 'Ширина Строки YAML',
    xmlIndent: 'Отступ XML',
    xmlRootName: 'Имя Корневого Элемента XML',
    xmlDeclaration: 'Включить Декларацию XML',
    csvDelimiter: 'Разделитель CSV',
    csvHeader: 'Включить Заголовок CSV',

    // Delimiter options
    delimiterComma: 'Запятая (,)',
    delimiterSemicolon: 'Точка с запятой (;)',
    delimiterTab: 'Табуляция (\\t)',
    delimiterPipe: 'Вертикальная черта (|)',

    // Status messages
    conversionSuccess: 'Конвертация успешна!',
    conversionError: 'Ошибка конвертации',
    emptyInput: 'Пожалуйста, введите данные для конвертации',
    invalidFormat: 'Неверный формат входных данных',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Конвертация между 5 форматами в реальном времени',
    feature2: 'Подсветка синтаксиса для всех форматов',
    feature3: 'Настраиваемые параметры форматирования',
    feature4: 'Смена форматов одним кликом',
    feature5: 'Скачивание конвертированных файлов',
    feature6: 'Вся обработка выполняется локально',

    // Error messages
    errorJsonParse: 'Неверный формат JSON',
    errorYamlParse: 'Неверный формат YAML',
    errorXmlParse: 'Неверный формат XML',
    errorCsvParse: 'Неверный формат CSV',
    errorTomlParse: 'Неверный формат TOML',
    errorArrayRequired: 'Для конвертации в CSV требуется массив',
    errorObjectRequired: 'Для конвертации в TOML требуется объект',
  },
};

export function getFormatTranslations(locale: Locale) {
  return formatTranslations[locale];
}
