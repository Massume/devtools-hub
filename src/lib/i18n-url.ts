import type { Locale } from './i18n';

export const urlTranslations = {
  en: {
    // Page metadata
    pageTitle: 'URL Encoder/Decoder - Encode and Decode URLs',
    pageDescription: 'Encode and decode URL strings and parameters with support for component and full URL encoding',

    // Modes
    encode: 'Encode',
    decode: 'Decode',

    // Labels
    inputLabel: 'Input',
    outputLabel: 'Output',
    urlComponents: 'URL Components',

    // Actions
    encodeButton: 'Encode URL',
    decodeButton: 'Decode URL',
    copyButton: 'Copy Result',
    clearButton: 'Clear',
    swapButton: 'Swap',

    // Placeholders
    encodePlaceholder: 'Enter URL or text to encode...',
    decodePlaceholder: 'Enter encoded URL to decode...',

    // Messages
    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    invalidUrl: 'Invalid URL format',
    emptyInput: 'Please enter some data',

    // URL Components
    protocol: 'Protocol',
    hostname: 'Hostname',
    port: 'Port',
    pathname: 'Pathname',
    search: 'Query String',
    hash: 'Hash/Fragment',
    noComponents: 'Enter a valid URL to see components',

    // Features
    featuresTitle: 'Features',
    feature1: 'Encode URLs and query parameters',
    feature2: 'Decode encoded URLs',
    feature3: 'Parse URL into components',
    feature4: 'Swap encode/decode modes',
    feature5: 'Copy results with one click',
    feature6: 'All processing done locally',

    // About
    aboutTitle: 'About URL Encoding',
    aboutText: 'URL encoding (also called percent-encoding) is a mechanism for encoding information in a URL. URLs can only contain a limited set of characters from the ASCII character set. URL encoding converts characters into a format that can be transmitted over the Internet by replacing unsafe ASCII characters with a "%" followed by two hexadecimal digits.',

    // Examples
    examplesTitle: 'Examples',
    example1: 'Space becomes %20 or +',
    example2: '& becomes %26',
    example3: '= becomes %3D',
    example4: '? becomes %3F',
  },
  ru: {
    // Page metadata
    pageTitle: 'URL Кодировщик/Декодер - Кодирование и Декодирование URL',
    pageDescription: 'Кодирование и декодирование URL строк и параметров с поддержкой компонентного и полного кодирования URL',

    // Modes
    encode: 'Кодировать',
    decode: 'Декодировать',

    // Labels
    inputLabel: 'Ввод',
    outputLabel: 'Вывод',
    urlComponents: 'Компоненты URL',

    // Actions
    encodeButton: 'Кодировать URL',
    decodeButton: 'Декодировать URL',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',
    swapButton: 'Поменять',

    // Placeholders
    encodePlaceholder: 'Введите URL или текст для кодирования...',
    decodePlaceholder: 'Введите закодированный URL для декодирования...',

    // Messages
    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    invalidUrl: 'Неверный формат URL',
    emptyInput: 'Пожалуйста, введите данные',

    // URL Components
    protocol: 'Протокол',
    hostname: 'Имя хоста',
    port: 'Порт',
    pathname: 'Путь',
    search: 'Строка запроса',
    hash: 'Хеш/Фрагмент',
    noComponents: 'Введите корректный URL для просмотра компонентов',

    // Features
    featuresTitle: 'Возможности',
    feature1: 'Кодирование URL и параметров запроса',
    feature2: 'Декодирование закодированных URL',
    feature3: 'Разбор URL на компоненты',
    feature4: 'Переключение режимов кодирования/декодирования',
    feature5: 'Копирование результатов одним кликом',
    feature6: 'Вся обработка выполняется локально',

    // About
    aboutTitle: 'О Кодировании URL',
    aboutText: 'Кодирование URL (также называемое процентным кодированием) — это механизм кодирования информации в URL. URL-адреса могут содержать только ограниченный набор символов из набора символов ASCII. Кодирование URL преобразует символы в формат, который может быть передан через Интернет, заменяя небезопасные символы ASCII на "%" с последующими двумя шестнадцатеричными цифрами.',

    // Examples
    examplesTitle: 'Примеры',
    example1: 'Пробел становится %20 или +',
    example2: '& становится %26',
    example3: '= становится %3D',
    example4: '? становится %3F',
  },
};

export function getUrlTranslations(locale: Locale) {
  return urlTranslations[locale];
}
