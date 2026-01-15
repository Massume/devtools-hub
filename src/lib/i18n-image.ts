export type Locale = 'en' | 'ru';

export interface ImageTranslations {
  // Header
  title: string;
  subtitle: string;
  badge: string;

  // Drop Zone
  dropZone: string;
  dropActive: string;
  supportedFormats: string;
  or: string;
  browse: string;

  // File List
  files: string;
  pending: string;
  processing: string;
  complete: string;
  error: string;
  remove: string;

  // Settings
  settings: string;
  format: string;
  quality: string;
  resize: string;
  enableResize: string;
  resizeMode: string;
  width: string;
  height: string;
  srcset: string;
  enableSrcset: string;
  srcsetSizes: string;

  formats: {
    webp: string;
    avif: string;
    jpeg: string;
    png: string;
    original: string;
  };

  resizeModes: {
    width: string;
    height: string;
    contain: string;
    cover: string;
  };

  // Preview
  original: string;
  optimized: string;
  dimensions: string;
  size: string;
  savings: string;

  // Results
  results: string;
  filename: string;
  actions: string;
  download: string;
  downloadAll: string;
  total: string;
  noResults: string;

  // Processing
  of: string;

  // Actions
  optimize: string;
  optimizeAll: string;
  clear: string;
  preview: string;

  // Info
  howToUse: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;

  features: {
    compression: {
      title: string;
      desc: string;
    };
    formats: {
      title: string;
      desc: string;
    };
    resize: {
      title: string;
      desc: string;
    };
    srcset: {
      title: string;
      desc: string;
    };
    batch: {
      title: string;
      desc: string;
    };
    privacy: {
      title: string;
      desc: string;
    };
  };
}

export const translations: Record<Locale, ImageTranslations> = {
  en: {
    // Header
    title: 'Image Optimizer',
    subtitle: 'Optimize, compress and convert images to modern formats',
    badge: 'Fast & Private',

    // Drop Zone
    dropZone: 'Drop images here',
    dropActive: 'Drop files here...',
    supportedFormats: 'PNG, JPG, GIF, WebP, SVG, AVIF',
    or: 'or',
    browse: 'click to browse',

    // File List
    files: 'files',
    pending: 'Pending',
    processing: 'Processing',
    complete: 'Complete',
    error: 'Error',
    remove: 'Remove',

    // Settings
    settings: 'Optimization Settings',
    format: 'Output Format',
    quality: 'Quality',
    resize: 'Resize',
    enableResize: 'Enable resizing',
    resizeMode: 'Resize Mode',
    width: 'Width',
    height: 'Height',
    srcset: 'Responsive Images',
    enableSrcset: 'Generate srcset variants',
    srcsetSizes: 'Sizes',

    formats: {
      webp: 'WebP',
      avif: 'AVIF',
      jpeg: 'JPEG',
      png: 'PNG',
      original: 'Original',
    },

    resizeModes: {
      width: 'By Width',
      height: 'By Height',
      contain: 'Contain',
      cover: 'Cover',
    },

    // Preview
    original: 'Original',
    optimized: 'Optimized',
    dimensions: 'Dimensions',
    size: 'Size',
    savings: 'Savings',

    // Results
    results: 'Optimization Results',
    filename: 'Filename',
    actions: 'Actions',
    download: 'Download',
    downloadAll: 'Download All as ZIP',
    total: 'Total',
    noResults: 'No results yet',

    // Processing
    of: 'of',

    // Actions
    optimize: 'Optimize',
    optimizeAll: 'Optimize All',
    clear: 'Clear',
    preview: 'Preview',

    // Info
    howToUse: 'How to use',
    step1: 'Upload one or multiple images',
    step2: 'Configure optimization settings',
    step3: 'Click "Optimize All" to process',
    step4: 'Download individual files or all as ZIP',

    features: {
      compression: {
        title: 'Smart Compression',
        desc: 'Reduce file size while maintaining visual quality',
      },
      formats: {
        title: 'Modern Formats',
        desc: 'Convert to WebP, AVIF, JPEG, PNG',
      },
      resize: {
        title: 'Flexible Resizing',
        desc: 'Resize by width, height, or fit within bounds',
      },
      srcset: {
        title: 'Responsive Images',
        desc: 'Generate srcset variants for different screen sizes',
      },
      batch: {
        title: 'Batch Processing',
        desc: 'Process multiple images at once',
      },
      privacy: {
        title: '100% Private',
        desc: 'All processing happens in your browser',
      },
    },
  },

  ru: {
    // Header
    title: 'Оптимизатор Изображений',
    subtitle: 'Оптимизация, сжатие и конвертация изображений в современные форматы',
    badge: 'Быстро и Приватно',

    // Drop Zone
    dropZone: 'Перетащите изображения сюда',
    dropActive: 'Отпустите файлы...',
    supportedFormats: 'PNG, JPG, GIF, WebP, SVG, AVIF',
    or: 'или',
    browse: 'выберите файлы',

    // File List
    files: 'файлов',
    pending: 'Ожидание',
    processing: 'Обработка',
    complete: 'Готово',
    error: 'Ошибка',
    remove: 'Удалить',

    // Settings
    settings: 'Настройки Оптимизации',
    format: 'Формат вывода',
    quality: 'Качество',
    resize: 'Изменение размера',
    enableResize: 'Включить изменение размера',
    resizeMode: 'Режим изменения',
    width: 'Ширина',
    height: 'Высота',
    srcset: 'Адаптивные изображения',
    enableSrcset: 'Генерировать srcset варианты',
    srcsetSizes: 'Размеры',

    formats: {
      webp: 'WebP',
      avif: 'AVIF',
      jpeg: 'JPEG',
      png: 'PNG',
      original: 'Исходный',
    },

    resizeModes: {
      width: 'По ширине',
      height: 'По высоте',
      contain: 'Вписать',
      cover: 'Заполнить',
    },

    // Preview
    original: 'Оригинал',
    optimized: 'Оптимизировано',
    dimensions: 'Размеры',
    size: 'Размер',
    savings: 'Экономия',

    // Results
    results: 'Результаты Оптимизации',
    filename: 'Имя файла',
    actions: 'Действия',
    download: 'Скачать',
    downloadAll: 'Скачать всё ZIP',
    total: 'Итого',
    noResults: 'Пока нет результатов',

    // Processing
    of: 'из',

    // Actions
    optimize: 'Оптимизировать',
    optimizeAll: 'Оптимизировать всё',
    clear: 'Очистить',
    preview: 'Предпросмотр',

    // Info
    howToUse: 'Как использовать',
    step1: 'Загрузите одно или несколько изображений',
    step2: 'Настройте параметры оптимизации',
    step3: 'Нажмите "Оптимизировать всё" для обработки',
    step4: 'Скачайте файлы по отдельности или все вместе',

    features: {
      compression: {
        title: 'Умное Сжатие',
        desc: 'Уменьшение размера файла с сохранением качества',
      },
      formats: {
        title: 'Современные Форматы',
        desc: 'Конвертация в WebP, AVIF, JPEG, PNG',
      },
      resize: {
        title: 'Гибкое Изменение Размера',
        desc: 'Изменение по ширине, высоте или вписывание',
      },
      srcset: {
        title: 'Адаптивные Изображения',
        desc: 'Генерация srcset вариантов для разных экранов',
      },
      batch: {
        title: 'Пакетная Обработка',
        desc: 'Обработка нескольких изображений одновременно',
      },
      privacy: {
        title: '100% Приватность',
        desc: 'Вся обработка происходит в вашем браузере',
      },
    },
  },
};
