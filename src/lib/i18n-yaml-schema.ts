import type { Locale } from './i18n';

export const yamlSchemaTranslations = {
  en: {
    pageTitle: 'YAML to JSON Schema Generator',
    pageDescription: 'Generate JSON Schema from YAML or JSON examples',

    generateSchema: 'Generate Schema',
    validateData: 'Validate Data',

    inputLabel: 'Input Data (YAML/JSON)',
    schemaLabel: 'Generated Schema',
    validationLabel: 'Validation Result',

    generateButton: 'Generate Schema',
    validateButton: 'Validate',
    copyButton: 'Copy',
    clearButton: 'Clear',

    inputPlaceholder: 'Enter YAML or JSON data to generate schema from...',
    schemaPlaceholder: 'Generated JSON Schema will appear here...',
    dataPlaceholder: 'Enter data to validate against schema...',

    schemaTitle: 'Schema Title',
    titlePlaceholder: 'MySchema',

    requireAllProps: 'Require all properties',
    additionalProps: 'Allow additional properties',

    copied: 'Copied to clipboard!',
    generatedSuccess: 'Schema generated successfully!',
    validationSuccess: 'Validation passed!',
    validationFailed: 'Validation failed',
    invalidInput: 'Invalid YAML/JSON input',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Generate JSON Schema from examples',
    feature2: 'Support YAML and JSON input',
    feature3: 'Infer types automatically',
    feature4: 'Customizable schema options',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About JSON Schema',
    aboutText: 'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the structure, constraints, and data types of JSON data. JSON Schema is widely used for API documentation, configuration validation, and data interchange format definitions.',
  },
  ru: {
    pageTitle: 'Генератор JSON Schema из YAML',
    pageDescription: 'Генерация JSON Schema из примеров YAML или JSON',

    generateSchema: 'Генерация Схемы',
    validateData: 'Валидация Данных',

    inputLabel: 'Входные Данные (YAML/JSON)',
    schemaLabel: 'Сгенерированная Схема',
    validationLabel: 'Результат Валидации',

    generateButton: 'Генерировать Схему',
    validateButton: 'Валидировать',
    copyButton: 'Копировать',
    clearButton: 'Очистить',

    inputPlaceholder: 'Введите YAML или JSON данные для генерации схемы...',
    schemaPlaceholder: 'Здесь появится сгенерированная JSON Schema...',
    dataPlaceholder: 'Введите данные для валидации по схеме...',

    schemaTitle: 'Название Схемы',
    titlePlaceholder: 'MySchema',

    requireAllProps: 'Требовать все свойства',
    additionalProps: 'Разрешить дополнительные свойства',

    copied: 'Скопировано в буфер обмена!',
    generatedSuccess: 'Схема успешно сгенерирована!',
    validationSuccess: 'Валидация пройдена!',
    validationFailed: 'Валидация не пройдена',
    invalidInput: 'Неверный YAML/JSON ввод',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Генерация JSON Schema из примеров',
    feature2: 'Поддержка YAML и JSON ввода',
    feature3: 'Автоматическое определение типов',
    feature4: 'Настраиваемые опции схемы',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О JSON Schema',
    aboutText: 'JSON Schema — это словарь, который позволяет аннотировать и валидировать JSON документы. Он описывает структуру, ограничения и типы данных JSON. JSON Schema широко используется для документации API, валидации конфигурации и определения форматов обмена данными.',
  },
};

export function getYamlSchemaTranslations(locale: Locale) {
  return yamlSchemaTranslations[locale];
}
