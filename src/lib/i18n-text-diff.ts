import type { Locale } from './i18n';

export const textDiffTranslations = {
  en: {
    pageTitle: 'Text Diff - Compare Text Side by Side',
    pageDescription: 'Compare two texts and see differences highlighted. Shows additions, deletions, and unchanged parts.',

    textALabel: 'Original Text',
    textBLabel: 'Modified Text',
    textAPlaceholder: 'Paste original text here...',
    textBPlaceholder: 'Paste modified text here...',

    compareButton: 'Compare',
    clearButton: 'Clear',
    swapButton: 'Swap',

    viewMode: 'View Mode',
    sideBySide: 'Side by Side',
    inline: 'Inline',
    unified: 'Unified',

    options: 'Options',
    ignoreWhitespace: 'Ignore Whitespace',
    ignoreCase: 'Ignore Case',

    statistics: 'Statistics',
    additions: 'Additions',
    deletions: 'Deletions',
    unchanged: 'Unchanged',
    similarity: 'Similarity',

    noDifferences: 'No differences found',
    emptyInput: 'Please enter text in both fields',

    featuresTitle: 'Features',
    feature1: 'Side-by-side or inline diff view',
    feature2: 'Ignore whitespace or case differences',
    feature3: 'Color-coded additions and deletions',
    feature4: 'Similarity percentage calculation',

    aboutTitle: 'About Text Diff',
    aboutText: 'Compare two texts and visualize the differences. Useful for comparing code, documents, or any text content.',
  },
  ru: {
    pageTitle: 'Сравнение Текстов - Diff',
    pageDescription: 'Сравнение двух текстов с подсветкой различий. Показывает добавления, удаления и неизменённые части.',

    textALabel: 'Оригинальный текст',
    textBLabel: 'Изменённый текст',
    textAPlaceholder: 'Вставьте оригинальный текст...',
    textBPlaceholder: 'Вставьте изменённый текст...',

    compareButton: 'Сравнить',
    clearButton: 'Очистить',
    swapButton: 'Поменять местами',

    viewMode: 'Режим отображения',
    sideBySide: 'Бок о бок',
    inline: 'В строку',
    unified: 'Объединённый',

    options: 'Настройки',
    ignoreWhitespace: 'Игнорировать пробелы',
    ignoreCase: 'Игнорировать регистр',

    statistics: 'Статистика',
    additions: 'Добавлено',
    deletions: 'Удалено',
    unchanged: 'Без изменений',
    similarity: 'Сходство',

    noDifferences: 'Различий не найдено',
    emptyInput: 'Введите текст в оба поля',

    featuresTitle: 'Возможности',
    feature1: 'Отображение бок о бок или в строку',
    feature2: 'Игнорирование пробелов или регистра',
    feature3: 'Цветовая кодировка добавлений и удалений',
    feature4: 'Расчёт процента сходства',

    aboutTitle: 'О Сравнении Текстов',
    aboutText: 'Сравнивайте два текста и визуализируйте различия. Полезно для сравнения кода, документов или любого текстового контента.',
  },
};

export function getTextDiffTranslations(locale: Locale) {
  return textDiffTranslations[locale];
}
