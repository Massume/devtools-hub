import type { Locale } from './i18n';

export type { Locale };

export const gradientTranslations = {
  en: {
    // Page metadata
    pageTitle: 'CSS Gradient Generator - Linear, Radial, Conic',
    pageDescription: 'Create beautiful CSS gradients with live preview. Export to CSS, SCSS, Tailwind, or CSS variables.',

    // Gradient types
    linear: 'Linear',
    radial: 'Radial',
    conic: 'Conic',

    // Controls
    angle: 'Angle',
    shape: 'Shape',
    position: 'Position',
    colorStops: 'Color Stops',
    addColorStop: 'Add Color Stop',
    removeColorStop: 'Remove',

    // Shape options
    circle: 'Circle',
    ellipse: 'Ellipse',

    // Output formats
    outputFormat: 'Output Format',
    formatCss: 'CSS',
    formatScss: 'SCSS',
    formatTailwind: 'Tailwind',
    formatCssVar: 'CSS Variables',

    // Actions
    copyCode: 'Copy Code',
    downloadCode: 'Download',
    resetGradient: 'Reset',
    saveGradient: 'Save',
    loadPreset: 'Load Preset',
    copied: 'Copied!',

    // Preset gallery
    presetGallery: 'Preset Gallery',
    allPresets: 'All',
    popularPresets: 'Popular',
    warmPresets: 'Warm',
    coolPresets: 'Cool',
    darkPresets: 'Dark',
    pastelPresets: 'Pastel',

    // Preview
    preview: 'Preview',
    code: 'Code',

    // Messages
    minStopsWarning: 'Minimum 2 color stops required',
    gradientSaved: 'Gradient saved!',
    presetLoaded: 'Preset loaded!',

    // Features
    featuresTitle: 'Features',
    feature1: 'Live preview with real-time updates',
    feature2: 'Support for linear, radial, and conic gradients',
    feature3: 'Export to CSS, SCSS, Tailwind, or CSS variables',
    feature4: '16 beautiful preset gradients',
    feature5: 'Unlimited color stops',
    feature6: 'Precise angle and position controls',

    // Placeholders
    angleHelp: 'Set gradient direction (0-360°)',
    positionHelp: 'Set gradient center position',
    colorStopHelp: 'Click to select and edit color',
  },
  ru: {
    // Page metadata
    pageTitle: 'Генератор CSS Градиентов - Linear, Radial, Conic',
    pageDescription: 'Создание красивых CSS градиентов с предпросмотром в реальном времени. Экспорт в CSS, SCSS, Tailwind или CSS переменные.',

    // Gradient types
    linear: 'Линейный',
    radial: 'Радиальный',
    conic: 'Конический',

    // Controls
    angle: 'Угол',
    shape: 'Форма',
    position: 'Позиция',
    colorStops: 'Цветовые Точки',
    addColorStop: 'Добавить Точку',
    removeColorStop: 'Удалить',

    // Shape options
    circle: 'Круг',
    ellipse: 'Эллипс',

    // Output formats
    outputFormat: 'Формат Вывода',
    formatCss: 'CSS',
    formatScss: 'SCSS',
    formatTailwind: 'Tailwind',
    formatCssVar: 'CSS Переменные',

    // Actions
    copyCode: 'Копировать Код',
    downloadCode: 'Скачать',
    resetGradient: 'Сбросить',
    saveGradient: 'Сохранить',
    loadPreset: 'Загрузить Пресет',
    copied: 'Скопировано!',

    // Preset gallery
    presetGallery: 'Галерея Пресетов',
    allPresets: 'Все',
    popularPresets: 'Популярные',
    warmPresets: 'Теплые',
    coolPresets: 'Холодные',
    darkPresets: 'Темные',
    pastelPresets: 'Пастельные',

    // Preview
    preview: 'Предпросмотр',
    code: 'Код',

    // Messages
    minStopsWarning: 'Требуется минимум 2 цветовые точки',
    gradientSaved: 'Градиент сохранен!',
    presetLoaded: 'Пресет загружен!',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Предпросмотр в реальном времени',
    feature2: 'Поддержка линейных, радиальных и конических градиентов',
    feature3: 'Экспорт в CSS, SCSS, Tailwind или CSS переменные',
    feature4: '16 красивых готовых градиентов',
    feature5: 'Неограниченное количество цветовых точек',
    feature6: 'Точный контроль углов и позиций',

    // Placeholders
    angleHelp: 'Установите направление градиента (0-360°)',
    positionHelp: 'Установите центральную позицию градиента',
    colorStopHelp: 'Кликните для выбора и редактирования цвета',
  },
};

export function getGradientTranslations(locale: Locale) {
  return gradientTranslations[locale];
}
