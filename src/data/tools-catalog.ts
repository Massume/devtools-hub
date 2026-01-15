import { Tool, ToolCategoryData } from '@/types';
import { DnsHealthCheck } from '@/components/tools/DnsHealthCheck';
import { PgIndexAdvisor } from '@/components/tools/PgIndexAdvisor';
import { ImageOptimizer } from '@/components/tools/ImageOptimizer';
import { FormatConverter } from '@/components/tools/FormatConverter';
import { CssGradientGenerator } from '@/components/tools/CssGradientGenerator';
import { Base64Converter } from '@/components/tools/Base64Converter';
import { UuidGenerator } from '@/components/tools/UuidGenerator';
import { HashGenerator } from '@/components/tools/HashGenerator';
import { UrlEncoder } from '@/components/tools/UrlEncoder';
import { Base32Converter } from '@/components/tools/Base32Converter';
import { HexConverter } from '@/components/tools/HexConverter';
import { HtmlEntities } from '@/components/tools/HtmlEntities';
import { UnicodeEscape } from '@/components/tools/UnicodeEscape';
import { AsciiBinary } from '@/components/tools/AsciiBinary';
import { RotCipher } from '@/components/tools/RotCipher';
import { PunycodeConverter } from '@/components/tools/PunycodeConverter';
import { MorseCode } from '@/components/tools/MorseCode';
import { QuotedPrintable } from '@/components/tools/QuotedPrintable';
import { BrailleConverter } from '@/components/tools/BrailleConverter';
import { NatoPhonetic } from '@/components/tools/NatoPhonetic';
import { NumberBaseConverter } from '@/components/tools/NumberBaseConverter';
import { RomanNumerals } from '@/components/tools/RomanNumerals';
import { ScientificNotation } from '@/components/tools/ScientificNotation';
import { Ieee754Float } from '@/components/tools/Ieee754Float';
import { BigNumberCalc } from '@/components/tools/BigNumberCalc';
import { BitwiseCalc } from '@/components/tools/BitwiseCalc';
import { JsonCsv } from '@/components/tools/JsonCsv';
import { JsonQuerystring } from '@/components/tools/JsonQuerystring';
import { JsonFormdata } from '@/components/tools/JsonFormdata';
import { XmlJson } from '@/components/tools/XmlJson';
import { MarkdownHtml } from '@/components/tools/MarkdownHtml';
import { YamlSchema } from '@/components/tools/YamlSchema';
import { UnixTimestamp } from '@/components/tools/UnixTimestamp';
import { DateDiff } from '@/components/tools/DateDiff';
import { CronParser } from '@/components/tools/CronParser';
import { DateFormat } from '@/components/tools/DateFormat';
import { TimezoneConverter } from '@/components/tools/TimezoneConverter';
import { AgeCalc } from '@/components/tools/AgeCalc';
import { WorkingDays } from '@/components/tools/WorkingDays';
import { CalendarWeek } from '@/components/tools/CalendarWeek';
import { LeapYear } from '@/components/tools/LeapYear';
import { MessagePackJson } from '@/components/tools/MessagePackJson';
import { BsonJson } from '@/components/tools/BsonJson';

export const categories: ToolCategoryData[] = [
  {
    id: 'networking',
    name: { en: 'Networking', ru: 'Сетевые инструменты' },
    description: { en: 'DNS, HTTP, and network tools', ru: 'DNS, HTTP и сетевые инструменты' },
    icon: '🌐',
    color: 'text-blue-400'
  },
  {
    id: 'database',
    name: { en: 'Database', ru: 'Базы данных' },
    description: { en: 'Database tools and analyzers', ru: 'Инструменты для баз данных' },
    icon: '🗄️',
    color: 'text-purple-400'
  },
  {
    id: 'converters',
    name: { en: 'Converters', ru: 'Конвертеры' },
    description: { en: 'Convert between formats', ru: 'Конвертация форматов' },
    icon: '🔄',
    color: 'text-green-400'
  },
  {
    id: 'formatters',
    name: { en: 'Formatters', ru: 'Форматтеры' },
    description: { en: 'Format and beautify code', ru: 'Форматирование кода' },
    icon: '📝',
    color: 'text-yellow-400'
  },
  {
    id: 'generators',
    name: { en: 'Generators', ru: 'Генераторы' },
    description: { en: 'Generate data and code', ru: 'Генерация данных' },
    icon: '⚡',
    color: 'text-orange-400'
  },
  {
    id: 'analyzers',
    name: { en: 'Analyzers', ru: 'Анализаторы' },
    description: { en: 'Analyze and inspect data', ru: 'Анализ и инспекция данных' },
    icon: '🔍',
    color: 'text-cyan-400'
  },
  {
    id: 'security',
    name: { en: 'Security', ru: 'Безопасность' },
    description: { en: 'Security and encryption tools', ru: 'Инструменты безопасности' },
    icon: '🔐',
    color: 'text-red-400'
  },
  {
    id: 'image',
    name: { en: 'Images', ru: 'Изображения' },
    description: { en: 'Image optimization and conversion', ru: 'Оптимизация изображений' },
    icon: '🖼️',
    color: 'text-pink-400'
  },
  {
    id: 'numbers',
    name: { en: 'Number Systems', ru: 'Системы Счисления' },
    description: { en: 'Number conversion and calculation', ru: 'Конвертация и вычисление чисел' },
    icon: '🔢',
    color: 'text-indigo-400'
  },
  {
    id: 'datetime',
    name: { en: 'Date & Time', ru: 'Дата и Время' },
    description: { en: 'Date parsing, formatting and calculations', ru: 'Парсинг, форматирование и вычисления с датами' },
    icon: '📅',
    color: 'text-teal-400'
  },
];

export const tools: Tool[] = [
  // Networking
  {
    id: 'dns-health-check',
    slug: 'dns-health-check',
    name: { en: 'DNS Health Check', ru: 'Проверка DNS' },
    description: {
      en: 'Analyze DNS records and email deliverability',
      ru: 'Анализ DNS записей и доставляемости почты'
    },
    category: 'networking',
    tags: ['dns', 'mx', 'spf', 'dkim', 'dmarc', 'email'],
    icon: '🌐',
    isPro: false,
    isNew: false,
    isBeta: false,
    component: DnsHealthCheck
  },

  // Database
  {
    id: 'pg-index-advisor',
    slug: 'pg-index-advisor',
    name: { en: 'PostgreSQL Index Advisor', ru: 'Советник по индексам PostgreSQL' },
    description: {
      en: 'Analyze query plans and get index recommendations',
      ru: 'Анализ планов запросов и рекомендации по индексам'
    },
    category: 'database',
    tags: ['postgresql', 'sql', 'performance', 'indexes', 'optimization'],
    icon: '🗄️',
    isPro: false,
    isNew: false,
    isBeta: false,
    component: PgIndexAdvisor
  },

  // Image
  {
    id: 'image-optimizer',
    slug: 'image-optimizer',
    name: { en: 'Image Optimizer', ru: 'Оптимизатор Изображений' },
    description: {
      en: 'Optimize, compress and convert images to WebP/AVIF',
      ru: 'Оптимизация, сжатие и конвертация изображений в WebP/AVIF'
    },
    category: 'image',
    tags: ['image', 'optimize', 'webp', 'avif', 'compress', 'resize'],
    icon: '🖼️',
    isPro: false,
    isNew: false,
    isBeta: false,
    component: ImageOptimizer
  },

  // Converters
  {
    id: 'format-converter',
    slug: 'format-converter',
    name: { en: 'Format Converter', ru: 'Конвертер Форматов' },
    description: {
      en: 'Convert between JSON, YAML, XML, CSV, TOML formats',
      ru: 'Конвертация между JSON, YAML, XML, CSV, TOML форматами'
    },
    category: 'converters',
    tags: ['json', 'yaml', 'xml', 'csv', 'toml', 'convert'],
    icon: '🔄',
    isPro: false,
    isNew: false,
    isBeta: false,
    component: FormatConverter
  },

  // Generators
  {
    id: 'css-gradient-generator',
    slug: 'css-gradient-generator',
    name: { en: 'CSS Gradient Generator', ru: 'Генератор CSS Градиентов' },
    description: {
      en: 'Create beautiful CSS gradients with live preview',
      ru: 'Создание красивых CSS градиентов с предпросмотром'
    },
    category: 'generators',
    tags: ['css', 'gradient', 'linear', 'radial', 'conic', 'tailwind'],
    icon: '🎨',
    isPro: false,
    isNew: false,
    isBeta: false,
    component: CssGradientGenerator
  },

  // Converters & Generators
  {
    id: 'base64-converter',
    slug: 'base64-converter',
    name: { en: 'Base64 Encoder/Decoder', ru: 'Base64 Конвертер' },
    description: {
      en: 'Encode and decode Base64 strings and files',
      ru: 'Кодирование и декодирование Base64 строк и файлов'
    },
    category: 'converters',
    tags: ['base64', 'encode', 'decode', 'encoding'],
    icon: '🔄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Base64Converter
  },

  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: { en: 'UUID Generator', ru: 'Генератор UUID' },
    description: {
      en: 'Generate UUIDs v1, v4, v5 in bulk',
      ru: 'Генерация UUID v1, v4, v5 массово'
    },
    category: 'generators',
    tags: ['uuid', 'guid', 'generate', 'random'],
    icon: '⚡',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UuidGenerator
  },

  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: { en: 'Hash Generator', ru: 'Генератор Хешей' },
    description: {
      en: 'Generate MD5, SHA256, SHA512 hashes for text and files',
      ru: 'Генерация MD5, SHA256, SHA512 хешей для текста и файлов'
    },
    category: 'security',
    tags: ['hash', 'md5', 'sha256', 'sha512', 'checksum', 'crypto'],
    icon: '🔐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HashGenerator
  },

  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: { en: 'URL Encoder/Decoder', ru: 'URL Кодировщик' },
    description: {
      en: 'Encode and decode URL strings and parameters',
      ru: 'Кодирование и декодирование URL строк и параметров'
    },
    category: 'converters',
    tags: ['url', 'encode', 'decode', 'uri', 'percent-encoding'],
    icon: '🔗',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UrlEncoder
  },

  {
    id: 'base32-converter',
    slug: 'base32-converter',
    name: { en: 'Base32 Encoder/Decoder', ru: 'Base32 Конвертер' },
    description: {
      en: 'Encode and decode Base32 strings',
      ru: 'Кодирование и декодирование Base32 строк'
    },
    category: 'converters',
    tags: ['base32', 'encode', 'decode', 'encoding'],
    icon: '🔄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Base32Converter
  },

  {
    id: 'hex-converter',
    slug: 'hex-converter',
    name: { en: 'Hex Converter', ru: 'Hex Конвертер' },
    description: {
      en: 'Convert text to hexadecimal or decode hex to text',
      ru: 'Конвертация текста в шестнадцатеричный формат или декодирование hex в текст'
    },
    category: 'converters',
    tags: ['hex', 'hexadecimal', 'encode', 'decode', 'binary'],
    icon: '🔢',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HexConverter
  },

  {
    id: 'html-entities',
    slug: 'html-entities',
    name: { en: 'HTML Entities', ru: 'HTML Сущности' },
    description: {
      en: 'Encode special characters to HTML entities or decode them back',
      ru: 'Кодирование специальных символов в HTML сущности или декодирование обратно'
    },
    category: 'converters',
    tags: ['html', 'entities', 'encode', 'decode', 'escape'],
    icon: '📄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HtmlEntities
  },

  {
    id: 'unicode-escape',
    slug: 'unicode-escape',
    name: { en: 'Unicode Escape', ru: 'Unicode Escape' },
    description: {
      en: 'Convert text to Unicode escape sequences (\\u0000) or decode them',
      ru: 'Конвертация текста в Unicode escape последовательности (\\u0000) или декодирование'
    },
    category: 'converters',
    tags: ['unicode', 'escape', 'encode', 'decode', 'uxxxx'],
    icon: '🔤',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UnicodeEscape
  },

  {
    id: 'ascii-binary',
    slug: 'ascii-binary',
    name: { en: 'ASCII to Binary', ru: 'ASCII в Двоичный' },
    description: {
      en: 'Convert text to binary code or decode binary back to text',
      ru: 'Конвертация текста в двоичный код или декодирование двоичного кода обратно в текст'
    },
    category: 'converters',
    tags: ['ascii', 'binary', 'encode', 'decode', 'bits'],
    icon: '01',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: AsciiBinary
  },

  {
    id: 'rot-cipher',
    slug: 'rot-cipher',
    name: { en: 'ROT13/ROT47 Cipher', ru: 'ROT13/ROT47 Шифр' },
    description: {
      en: 'Encode or decode text using ROT13 or ROT47 rotation ciphers',
      ru: 'Кодирование или декодирование текста с помощью шифров ROT13 или ROT47'
    },
    category: 'security',
    tags: ['rot13', 'rot47', 'cipher', 'encode', 'decode', 'encryption'],
    icon: '🔐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: RotCipher
  },

  {
    id: 'punycode-converter',
    slug: 'punycode-converter',
    name: { en: 'Punycode Converter', ru: 'Punycode Конвертер' },
    description: {
      en: 'Convert internationalized domain names (IDN) to Punycode or decode',
      ru: 'Конвертация интернационализированных доменных имён (IDN) в Punycode или декодирование'
    },
    category: 'converters',
    tags: ['punycode', 'idn', 'domain', 'encode', 'decode', 'unicode'],
    icon: '🌍',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PunycodeConverter
  },

  {
    id: 'morse-code',
    slug: 'morse-code',
    name: { en: 'Morse Code', ru: 'Азбука Морзе' },
    description: {
      en: 'Convert text to Morse code or decode Morse back to text',
      ru: 'Конвертация текста в азбуку Морзе или декодирование азбуки Морзе обратно в текст'
    },
    category: 'converters',
    tags: ['morse', 'code', 'encode', 'decode', 'telegraph'],
    icon: '📡',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: MorseCode
  },

  {
    id: 'quoted-printable',
    slug: 'quoted-printable',
    name: { en: 'Quoted-Printable', ru: 'Quoted-Printable' },
    description: {
      en: 'Encode text to Quoted-Printable format or decode QP strings',
      ru: 'Кодирование текста в формат Quoted-Printable или декодирование QP строк'
    },
    category: 'converters',
    tags: ['quoted-printable', 'qp', 'mime', 'email', 'encode', 'decode'],
    icon: '📧',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: QuotedPrintable
  },

  {
    id: 'braille-converter',
    slug: 'braille-converter',
    name: { en: 'Braille Converter', ru: 'Конвертер Брайля' },
    description: {
      en: 'Convert text to Braille Unicode characters or decode Braille back to text',
      ru: 'Конвертация текста в Unicode символы Брайля или декодирование Брайля обратно в текст'
    },
    category: 'converters',
    tags: ['braille', 'unicode', 'accessibility', 'encode', 'decode'],
    icon: '⠃',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: BrailleConverter
  },

  {
    id: 'nato-phonetic',
    slug: 'nato-phonetic',
    name: { en: 'NATO Phonetic Alphabet', ru: 'Фонетический Алфавит НАТО' },
    description: {
      en: 'Convert text to NATO phonetic alphabet or decode phonetic words',
      ru: 'Конвертация текста в фонетический алфавит НАТО или декодирование фонетических слов'
    },
    category: 'converters',
    tags: ['nato', 'phonetic', 'alphabet', 'spelling', 'radio'],
    icon: '🎙️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: NatoPhonetic
  },

  // Number Systems
  {
    id: 'number-base',
    slug: 'number-base',
    name: { en: 'Number Base Converter', ru: 'Конвертер Систем Счисления' },
    description: {
      en: 'Convert numbers between binary, decimal, hexadecimal, and octal systems',
      ru: 'Конвертация чисел между двоичной, десятичной, шестнадцатеричной и восьмеричной системами'
    },
    category: 'numbers',
    tags: ['binary', 'decimal', 'hex', 'hexadecimal', 'octal', 'base', 'convert'],
    icon: '🔢',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: NumberBaseConverter
  },

  {
    id: 'roman-numerals',
    slug: 'roman-numerals',
    name: { en: 'Roman Numerals Converter', ru: 'Конвертер Римских Цифр' },
    description: {
      en: 'Convert between Roman numerals and decimal numbers',
      ru: 'Конвертация между римскими и десятичными числами'
    },
    category: 'numbers',
    tags: ['roman', 'numerals', 'decimal', 'convert', 'numbers'],
    icon: 'Ⅶ',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: RomanNumerals
  },

  {
    id: 'scientific-notation',
    slug: 'scientific-notation',
    name: { en: 'Scientific Notation Converter', ru: 'Конвертер Научной Нотации' },
    description: {
      en: 'Convert between standard numbers and scientific notation (e.g., 1.23e+10)',
      ru: 'Конвертация между обычными числами и научной нотацией (например, 1.23e+10)'
    },
    category: 'numbers',
    tags: ['scientific', 'notation', 'exponent', 'convert', 'numbers'],
    icon: '📐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: ScientificNotation
  },

  {
    id: 'ieee-754-float',
    slug: 'ieee-754-float',
    name: { en: 'IEEE 754 Float Visualizer', ru: 'Визуализатор IEEE 754 Float' },
    description: {
      en: 'Visualize and understand IEEE 754 floating-point number representation',
      ru: 'Визуализация и понимание представления чисел с плавающей точкой IEEE 754'
    },
    category: 'numbers',
    tags: ['ieee754', 'float', 'binary', 'bits', 'mantissa', 'exponent'],
    icon: '🔬',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Ieee754Float
  },

  {
    id: 'big-number-calc',
    slug: 'big-number-calc',
    name: { en: 'Big Number Calculator', ru: 'Калькулятор Больших Чисел' },
    description: {
      en: 'Perform arithmetic operations with arbitrarily large integers using BigInt',
      ru: 'Выполнение арифметических операций с произвольно большими целыми числами с помощью BigInt'
    },
    category: 'numbers',
    tags: ['bigint', 'calculator', 'arithmetic', 'large', 'numbers'],
    icon: '🧮',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: BigNumberCalc
  },

  {
    id: 'bitwise-calc',
    slug: 'bitwise-calc',
    name: { en: 'Bitwise Operations Calculator', ru: 'Калькулятор Побитовых Операций' },
    description: {
      en: 'Perform bitwise operations and visualize binary representations',
      ru: 'Выполнение побитовых операций и визуализация двоичных представлений'
    },
    category: 'numbers',
    tags: ['bitwise', 'and', 'or', 'xor', 'shift', 'binary', 'bits'],
    icon: '⚙️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: BitwiseCalc
  },

  // Data Formats
  {
    id: 'json-csv',
    slug: 'json-csv',
    name: { en: 'JSON ↔ CSV Converter', ru: 'JSON ↔ CSV Конвертер' },
    description: {
      en: 'Convert JSON arrays to CSV/TSV format and vice versa',
      ru: 'Конвертация JSON массивов в CSV/TSV формат и обратно'
    },
    category: 'converters',
    tags: ['json', 'csv', 'tsv', 'convert', 'table', 'data'],
    icon: '📊',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: JsonCsv
  },

  {
    id: 'json-querystring',
    slug: 'json-querystring',
    name: { en: 'JSON ↔ Query String', ru: 'JSON ↔ Query String' },
    description: {
      en: 'Convert JSON objects to URL query strings and vice versa',
      ru: 'Конвертация JSON объектов в URL query strings и обратно'
    },
    category: 'converters',
    tags: ['json', 'querystring', 'url', 'params', 'convert'],
    icon: '🔗',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: JsonQuerystring
  },

  {
    id: 'json-formdata',
    slug: 'json-formdata',
    name: { en: 'JSON ↔ Form Data', ru: 'JSON ↔ Form Data' },
    description: {
      en: 'Convert JSON to x-www-form-urlencoded format and vice versa',
      ru: 'Конвертация JSON в формат x-www-form-urlencoded и обратно'
    },
    category: 'converters',
    tags: ['json', 'formdata', 'urlencoded', 'form', 'convert'],
    icon: '📝',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: JsonFormdata
  },

  {
    id: 'xml-json',
    slug: 'xml-json',
    name: { en: 'XML ↔ JSON Converter', ru: 'XML ↔ JSON Конвертер' },
    description: {
      en: 'Convert XML to JSON with attribute preservation and vice versa',
      ru: 'Конвертация XML в JSON с сохранением атрибутов и обратно'
    },
    category: 'converters',
    tags: ['xml', 'json', 'convert', 'attributes', 'data'],
    icon: '📄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: XmlJson
  },

  {
    id: 'markdown-html',
    slug: 'markdown-html',
    name: { en: 'Markdown ↔ HTML', ru: 'Markdown ↔ HTML' },
    description: {
      en: 'Convert Markdown to HTML with live preview and vice versa',
      ru: 'Конвертация Markdown в HTML с предпросмотром и обратно'
    },
    category: 'converters',
    tags: ['markdown', 'html', 'convert', 'preview', 'document'],
    icon: '📑',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: MarkdownHtml
  },

  {
    id: 'yaml-schema',
    slug: 'yaml-schema',
    name: { en: 'YAML/JSON Schema Generator', ru: 'Генератор JSON Schema из YAML/JSON' },
    description: {
      en: 'Generate JSON Schema from YAML or JSON examples',
      ru: 'Генерация JSON Schema из примеров YAML или JSON'
    },
    category: 'generators',
    tags: ['yaml', 'json', 'schema', 'generate', 'validation'],
    icon: '📋',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: YamlSchema
  },

  // Date & Time
  {
    id: 'unix-timestamp',
    slug: 'unix-timestamp',
    name: { en: 'Unix Timestamp Converter', ru: 'Конвертер Unix Timestamp' },
    description: {
      en: 'Convert between Unix timestamps and human-readable dates',
      ru: 'Конвертация между Unix timestamp и читаемыми датами'
    },
    category: 'datetime',
    tags: ['unix', 'timestamp', 'date', 'time', 'convert', 'epoch'],
    icon: '⏰',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UnixTimestamp
  },

  {
    id: 'date-diff',
    slug: 'date-diff',
    name: { en: 'Date Difference Calculator', ru: 'Калькулятор Разницы Дат' },
    description: {
      en: 'Calculate the difference between two dates in various units',
      ru: 'Вычисление разницы между двумя датами в различных единицах'
    },
    category: 'datetime',
    tags: ['date', 'difference', 'calculator', 'days', 'time'],
    icon: '📆',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: DateDiff
  },

  {
    id: 'cron-parser',
    slug: 'cron-parser',
    name: { en: 'Cron Expression Parser', ru: 'Парсер Cron Выражений' },
    description: {
      en: 'Parse cron expressions and see next scheduled run times',
      ru: 'Парсинг cron выражений и просмотр следующих запусков'
    },
    category: 'datetime',
    tags: ['cron', 'parser', 'schedule', 'time', 'jobs'],
    icon: '🕐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CronParser
  },

  {
    id: 'date-format',
    slug: 'date-format',
    name: { en: 'Date Format Converter', ru: 'Конвертер Форматов Дат' },
    description: {
      en: 'Convert dates between ISO 8601, RFC 2822, Unix timestamp and custom formats',
      ru: 'Конвертация дат между ISO 8601, RFC 2822, Unix timestamp и пользовательскими форматами'
    },
    category: 'datetime',
    tags: ['date', 'format', 'iso', 'rfc', 'strftime', 'convert'],
    icon: '📅',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: DateFormat
  },

  {
    id: 'timezone-converter',
    slug: 'timezone-converter',
    name: { en: 'Timezone Converter', ru: 'Конвертер Часовых Поясов' },
    description: {
      en: 'Convert times between different timezones worldwide',
      ru: 'Конвертация времени между различными часовыми поясами мира'
    },
    category: 'datetime',
    tags: ['timezone', 'time', 'convert', 'utc', 'world'],
    icon: '🌍',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: TimezoneConverter
  },

  {
    id: 'age-calc',
    slug: 'age-calc',
    name: { en: 'Age Calculator', ru: 'Калькулятор Возраста' },
    description: {
      en: 'Calculate exact age from birth date with detailed breakdown',
      ru: 'Расчёт точного возраста от даты рождения с детальной разбивкой'
    },
    category: 'datetime',
    tags: ['age', 'birthday', 'calculator', 'zodiac', 'date'],
    icon: '🎂',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: AgeCalc
  },

  {
    id: 'working-days',
    slug: 'working-days',
    name: { en: 'Working Days Calculator', ru: 'Калькулятор Рабочих Дней' },
    description: {
      en: 'Calculate working days between dates excluding weekends',
      ru: 'Расчёт рабочих дней между датами без учёта выходных'
    },
    category: 'datetime',
    tags: ['working', 'business', 'days', 'weekends', 'calculator'],
    icon: '💼',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: WorkingDays
  },

  {
    id: 'calendar-week',
    slug: 'calendar-week',
    name: { en: 'Calendar Week Calculator', ru: 'Калькулятор Недели Года' },
    description: {
      en: 'Find ISO week number for any date or get dates for a specific week',
      ru: 'Определение номера ISO недели для любой даты'
    },
    category: 'datetime',
    tags: ['week', 'calendar', 'iso', 'number', 'date'],
    icon: '📆',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CalendarWeek
  },

  {
    id: 'leap-year',
    slug: 'leap-year',
    name: { en: 'Leap Year Checker', ru: 'Проверка Високосного Года' },
    description: {
      en: 'Check if a year is a leap year and explore leap year patterns',
      ru: 'Проверка, является ли год високосным, и изучение паттернов'
    },
    category: 'datetime',
    tags: ['leap', 'year', 'check', 'february', 'calendar'],
    icon: '🗓️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: LeapYear
  },

  // Binary Formats
  {
    id: 'messagepack-json',
    slug: 'messagepack-json',
    name: { en: 'MessagePack ↔ JSON', ru: 'MessagePack ↔ JSON' },
    description: {
      en: 'Convert between MessagePack binary format and JSON',
      ru: 'Конвертация между бинарным форматом MessagePack и JSON'
    },
    category: 'converters',
    tags: ['messagepack', 'msgpack', 'binary', 'json', 'serialize'],
    icon: '📦',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: MessagePackJson
  },

  {
    id: 'bson-json',
    slug: 'bson-json',
    name: { en: 'BSON ↔ JSON', ru: 'BSON ↔ JSON' },
    description: {
      en: 'Convert between BSON (MongoDB binary format) and JSON with Extended JSON support',
      ru: 'Конвертация между BSON (бинарный формат MongoDB) и JSON с поддержкой Extended JSON'
    },
    category: 'converters',
    tags: ['bson', 'mongodb', 'binary', 'json', 'objectid', 'database'],
    icon: '🍃',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: BsonJson
  },
];

// Helper functions
export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(tool => tool.category === categoryId);
}

export function getCategoryById(id: string): ToolCategoryData | undefined {
  return categories.find(cat => cat.id === id);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.en.toLowerCase().includes(lowerQuery) ||
    tool.name.ru.toLowerCase().includes(lowerQuery) ||
    tool.description.en.toLowerCase().includes(lowerQuery) ||
    tool.description.ru.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
