import type { Locale } from './i18n';

export const markdownHtmlTranslations = {
  en: {
    pageTitle: 'Markdown ↔ HTML Converter',
    pageDescription: 'Convert between Markdown and HTML formats',

    mdToHtml: 'Markdown to HTML',
    htmlToMd: 'HTML to Markdown',

    inputLabel: 'Input',
    outputLabel: 'Output',
    previewLabel: 'Preview',

    mdToHtmlButton: 'Convert to HTML',
    htmlToMdButton: 'Convert to Markdown',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    mdPlaceholder: 'Enter Markdown text...',
    htmlPlaceholder: 'Enter HTML...',

    showPreview: 'Show preview',

    copied: 'Copied to clipboard!',
    convertedSuccess: 'Successfully converted!',
    invalidHtml: 'Invalid HTML input',
    emptyInput: 'Please enter some data',

    featuresTitle: 'Features',
    feature1: 'Markdown to HTML conversion',
    feature2: 'HTML to Markdown conversion',
    feature3: 'Live preview',
    feature4: 'GitHub-flavored Markdown',
    feature5: 'Copy results to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About Markdown',
    aboutText: 'Markdown is a lightweight markup language created by John Gruber. It allows you to write formatted text using a simple plain text syntax. Markdown is widely used for documentation, README files, and content management systems. This tool converts between Markdown and HTML formats.',
  },
  ru: {
    pageTitle: 'Markdown ↔ HTML Конвертер',
    pageDescription: 'Конвертация между форматами Markdown и HTML',

    mdToHtml: 'Markdown в HTML',
    htmlToMd: 'HTML в Markdown',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',
    previewLabel: 'Предпросмотр',

    mdToHtmlButton: 'Конвертировать в HTML',
    htmlToMdButton: 'Конвертировать в Markdown',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    mdPlaceholder: 'Введите Markdown текст...',
    htmlPlaceholder: 'Введите HTML...',

    showPreview: 'Показать предпросмотр',

    copied: 'Скопировано в буфер обмена!',
    convertedSuccess: 'Успешно сконвертировано!',
    invalidHtml: 'Неверный HTML ввод',
    emptyInput: 'Пожалуйста, введите данные',

    featuresTitle: 'Возможности',
    feature1: 'Конвертация Markdown в HTML',
    feature2: 'Конвертация HTML в Markdown',
    feature3: 'Предпросмотр в реальном времени',
    feature4: 'GitHub-flavored Markdown',
    feature5: 'Копирование результатов в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О Markdown',
    aboutText: 'Markdown — это лёгкий язык разметки, созданный Джоном Грубером. Он позволяет писать форматированный текст с использованием простого синтаксиса обычного текста. Markdown широко используется для документации, README файлов и систем управления контентом. Этот инструмент конвертирует между форматами Markdown и HTML.',
  },
};

export function getMarkdownHtmlTranslations(locale: Locale) {
  return markdownHtmlTranslations[locale];
}
