import type { Locale } from './i18n';

export const sqlFormatterTranslations = {
  en: {
    pageTitle: 'SQL Formatter - Format and Beautify SQL',
    pageDescription: 'Format SQL queries with support for multiple database dialects',

    inputLabel: 'Input SQL',
    outputLabel: 'Formatted SQL',
    inputPlaceholder: 'Paste your SQL query here...',

    formatButton: 'Format SQL',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    options: 'Options',
    dialect: 'SQL Dialect',
    keywordCase: 'Keyword Case',
    indentSize: 'Indent Size',

    dialectStandard: 'Standard SQL',
    dialectMySQL: 'MySQL',
    dialectPostgreSQL: 'PostgreSQL',
    dialectSQLite: 'SQLite',
    dialectTSQL: 'T-SQL (SQL Server)',
    dialectPLSQL: 'PL/SQL (Oracle)',
    dialectMariaDB: 'MariaDB',

    caseUpper: 'UPPERCASE',
    caseLower: 'lowercase',
    casePreserve: 'Preserve',

    copied: 'Copied to clipboard!',
    formatSuccess: 'SQL formatted successfully!',
    emptyInput: 'Please enter SQL query',
    formatError: 'Error formatting SQL',

    featuresTitle: 'Features',
    feature1: 'Support for multiple SQL dialects',
    feature2: 'Configurable keyword case',
    feature3: 'Customizable indentation',
    feature4: 'Copy or download result',

    aboutTitle: 'About SQL Formatter',
    aboutText: 'Format and beautify your SQL queries for better readability. Supports multiple database dialects including MySQL, PostgreSQL, SQLite, and more.',
  },
  ru: {
    pageTitle: 'SQL Форматтер - Форматирование SQL',
    pageDescription: 'Форматирование SQL запросов с поддержкой различных диалектов баз данных',

    inputLabel: 'Входной SQL',
    outputLabel: 'Отформатированный SQL',
    inputPlaceholder: 'Вставьте ваш SQL запрос здесь...',

    formatButton: 'Форматировать SQL',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    options: 'Настройки',
    dialect: 'Диалект SQL',
    keywordCase: 'Регистр ключевых слов',
    indentSize: 'Размер отступа',

    dialectStandard: 'Стандартный SQL',
    dialectMySQL: 'MySQL',
    dialectPostgreSQL: 'PostgreSQL',
    dialectSQLite: 'SQLite',
    dialectTSQL: 'T-SQL (SQL Server)',
    dialectPLSQL: 'PL/SQL (Oracle)',
    dialectMariaDB: 'MariaDB',

    caseUpper: 'UPPERCASE',
    caseLower: 'lowercase',
    casePreserve: 'Сохранить',

    copied: 'Скопировано!',
    formatSuccess: 'SQL успешно отформатирован!',
    emptyInput: 'Введите SQL запрос',
    formatError: 'Ошибка форматирования SQL',

    featuresTitle: 'Возможности',
    feature1: 'Поддержка различных диалектов SQL',
    feature2: 'Настраиваемый регистр ключевых слов',
    feature3: 'Настраиваемые отступы',
    feature4: 'Копирование или скачивание результата',

    aboutTitle: 'О SQL Форматтере',
    aboutText: 'Форматируйте и украшайте SQL запросы для лучшей читаемости. Поддерживает различные диалекты баз данных включая MySQL, PostgreSQL, SQLite и другие.',
  },
};

export function getSqlFormatterTranslations(locale: Locale) {
  return sqlFormatterTranslations[locale];
}
