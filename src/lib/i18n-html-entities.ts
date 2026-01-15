import type { Locale } from './i18n';

export const htmlEntitiesTranslations = {
  en: {
    pageTitle: 'HTML Entities Encoder/Decoder',
    pageDescription: 'Encode special characters to HTML entities or decode entities back to characters',

    encode: 'Encode',
    decode: 'Decode',

    inputLabel: 'Input',
    outputLabel: 'Output',

    encodeButton: 'Encode to Entities',
    decodeButton: 'Decode Entities',
    copyButton: 'Copy Result',
    clearButton: 'Clear',

    encodePlaceholder: 'Enter text with special characters (e.g., <div>Hello & World</div>)...',
    decodePlaceholder: 'Enter HTML entities (e.g., &lt;div&gt;)...',

    copied: 'Copied to clipboard!',
    encodedSuccess: 'Successfully encoded!',
    decodedSuccess: 'Successfully decoded!',
    emptyInput: 'Please enter some data',

    // Options
    encodeOptions: 'Encoding Options',
    encodeAll: 'Encode all characters',
    encodeSpecial: 'Encode special only (<>&"\')',

    featuresTitle: 'Features',
    feature1: 'Encode HTML special characters',
    feature2: 'Decode HTML entities',
    feature3: 'Named entities support (&amp;)',
    feature4: 'Numeric entities support (&#38;)',
    feature5: 'Copy to clipboard',
    feature6: 'All processing done locally',

    aboutTitle: 'About HTML Entities',
    aboutText: 'HTML entities are special codes used to display reserved characters in HTML. Characters like <, >, &, and " have special meaning in HTML and must be encoded to be displayed as literal text. Common entities include &lt; for <, &gt; for >, &amp; for &, and &quot; for ".',
  },
  ru: {
    pageTitle: 'HTML Сущности Кодировщик/Декодер',
    pageDescription: 'Кодирование специальных символов в HTML сущности или декодирование сущностей обратно в символы',

    encode: 'Кодировать',
    decode: 'Декодировать',

    inputLabel: 'Ввод',
    outputLabel: 'Вывод',

    encodeButton: 'Кодировать в Сущности',
    decodeButton: 'Декодировать Сущности',
    copyButton: 'Копировать Результат',
    clearButton: 'Очистить',

    encodePlaceholder: 'Введите текст со специальными символами (например, <div>Привет & Мир</div>)...',
    decodePlaceholder: 'Введите HTML сущности (например, &lt;div&gt;)...',

    copied: 'Скопировано в буфер обмена!',
    encodedSuccess: 'Успешно закодировано!',
    decodedSuccess: 'Успешно декодировано!',
    emptyInput: 'Пожалуйста, введите данные',

    encodeOptions: 'Опции Кодирования',
    encodeAll: 'Кодировать все символы',
    encodeSpecial: 'Кодировать только специальные (<>&"\')',

    featuresTitle: 'Возможности',
    feature1: 'Кодирование специальных HTML символов',
    feature2: 'Декодирование HTML сущностей',
    feature3: 'Поддержка именованных сущностей (&amp;)',
    feature4: 'Поддержка числовых сущностей (&#38;)',
    feature5: 'Копирование в буфер обмена',
    feature6: 'Вся обработка выполняется локально',

    aboutTitle: 'О HTML Сущностях',
    aboutText: 'HTML сущности — это специальные коды, используемые для отображения зарезервированных символов в HTML. Символы вроде <, >, & и " имеют особое значение в HTML и должны быть закодированы для отображения как обычный текст. Распространённые сущности: &lt; для <, &gt; для >, &amp; для &, и &quot; для ".',
  },
};

export function getHtmlEntitiesTranslations(locale: Locale) {
  return htmlEntitiesTranslations[locale];
}
