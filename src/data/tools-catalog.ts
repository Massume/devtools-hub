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
// Formatters
import { HtmlFormatter } from '@/components/tools/HtmlFormatter';
import { CssFormatter } from '@/components/tools/CssFormatter';
import { JsFormatter } from '@/components/tools/JsFormatter';
import { SqlFormatter } from '@/components/tools/SqlFormatter';
import { GraphqlFormatter } from '@/components/tools/GraphqlFormatter';
// Text Manipulation
import { CaseConverter } from '@/components/tools/CaseConverter';
import { LineOperations } from '@/components/tools/LineOperations';
import { StringOperations } from '@/components/tools/StringOperations';
// Text Analysis
import { TextStatistics } from '@/components/tools/TextStatistics';
import { TextDiff } from '@/components/tools/TextDiff';
// Generators
import { LoremIpsum } from '@/components/tools/LoremIpsum';
import { PasswordGenerator } from '@/components/tools/PasswordGenerator';
import { PassphraseGenerator } from '@/components/tools/PassphraseGenerator';
import { SlugGenerator } from '@/components/tools/SlugGenerator';
import { UlidGenerator } from '@/components/tools/UlidGenerator';
import { NanoidGenerator } from '@/components/tools/NanoidGenerator';
import { FakeDataGenerator } from '@/components/tools/FakeDataGenerator';
// Additional Text Tools
import { MarkdownFormatter } from '@/components/tools/MarkdownFormatter';
import { WordFrequency } from '@/components/tools/WordFrequency';
import { PalindromeChecker } from '@/components/tools/PalindromeChecker';
import { AnagramChecker } from '@/components/tools/AnagramChecker';
import { DuplicateFinder } from '@/components/tools/DuplicateFinder';
import { RandomTextGenerator } from '@/components/tools/RandomTextGenerator';
import { UsernameGenerator } from '@/components/tools/UsernameGenerator';
// Cryptography & Security Tools
import { MultiHash } from '@/components/tools/MultiHash';
import { HashIdentifier } from '@/components/tools/HashIdentifier';
import { CaesarCipher } from '@/components/tools/CaesarCipher';
import { JwtTool } from '@/components/tools/JwtTool';
import { PasswordStrength } from '@/components/tools/PasswordStrength';
import { BcryptTool } from '@/components/tools/BcryptTool';
import { AesEncrypt } from '@/components/tools/AesEncrypt';
import { VigenereCipher } from '@/components/tools/VigenereCipher';
import { XorCipher } from '@/components/tools/XorCipher';
import { RsaKeygen } from '@/components/tools/RsaKeygen';
import { HibpChecker } from '@/components/tools/HibpChecker';
import { SecretKeyGenerator } from '@/components/tools/SecretKeyGenerator';
import { SriGenerator } from '@/components/tools/SriGenerator';
import { Argon2Tool } from '@/components/tools/Argon2Tool';
import { Pbkdf2Tool } from '@/components/tools/Pbkdf2Tool';
import { OtpCipher } from '@/components/tools/OtpCipher';
import { CspGenerator } from '@/components/tools/CspGenerator';
import { CorsGenerator } from '@/components/tools/CorsGenerator';
import { ChaCha20Encrypt } from '@/components/tools/ChaCha20Encrypt';
import { ApiKeyGenerator } from '@/components/tools/ApiKeyGenerator';
import { PemParser } from '@/components/tools/PemParser';
import { X509Decoder } from '@/components/tools/X509Decoder';
import { Asn1Parser } from '@/components/tools/Asn1Parser';

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
  {
    id: 'text',
    name: { en: 'Text Tools', ru: 'Текстовые инструменты' },
    description: { en: 'Text manipulation and processing', ru: 'Обработка и манипуляции с текстом' },
    icon: '📝',
    color: 'text-emerald-400'
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

  // Formatters
  {
    id: 'html-formatter',
    slug: 'html-formatter',
    name: { en: 'HTML Formatter', ru: 'Форматтер HTML' },
    description: {
      en: 'Format and beautify HTML code or minify it for production',
      ru: 'Форматирование и украшение HTML кода или минификация для продакшена'
    },
    category: 'formatters',
    tags: ['html', 'format', 'beautify', 'minify', 'prettier'],
    icon: '📄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HtmlFormatter
  },

  {
    id: 'css-formatter',
    slug: 'css-formatter',
    name: { en: 'CSS Formatter', ru: 'Форматтер CSS' },
    description: {
      en: 'Format and beautify CSS code or minify it for production',
      ru: 'Форматирование и украшение CSS кода или минификация для продакшена'
    },
    category: 'formatters',
    tags: ['css', 'format', 'beautify', 'minify', 'prettier'],
    icon: '🎨',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CssFormatter
  },

  {
    id: 'js-formatter',
    slug: 'js-formatter',
    name: { en: 'JavaScript Formatter', ru: 'Форматтер JavaScript' },
    description: {
      en: 'Format and beautify JavaScript/TypeScript code or minify it',
      ru: 'Форматирование JavaScript/TypeScript кода или минификация'
    },
    category: 'formatters',
    tags: ['javascript', 'typescript', 'format', 'beautify', 'minify', 'prettier'],
    icon: '📜',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: JsFormatter
  },

  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    name: { en: 'SQL Formatter', ru: 'Форматтер SQL' },
    description: {
      en: 'Format SQL queries with support for multiple dialects (MySQL, PostgreSQL, etc.)',
      ru: 'Форматирование SQL запросов с поддержкой разных диалектов (MySQL, PostgreSQL и др.)'
    },
    category: 'formatters',
    tags: ['sql', 'format', 'mysql', 'postgresql', 'sqlite', 'query'],
    icon: '🗃️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: SqlFormatter
  },

  {
    id: 'graphql-formatter',
    slug: 'graphql-formatter',
    name: { en: 'GraphQL Formatter', ru: 'Форматтер GraphQL' },
    description: {
      en: 'Format and beautify GraphQL queries and schemas',
      ru: 'Форматирование GraphQL запросов и схем'
    },
    category: 'formatters',
    tags: ['graphql', 'format', 'beautify', 'query', 'schema'],
    icon: '◈',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: GraphqlFormatter
  },

  // Text Manipulation
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: { en: 'Case Converter', ru: 'Конвертер Регистра' },
    description: {
      en: 'Convert text between camelCase, snake_case, PascalCase, kebab-case and more',
      ru: 'Конвертация текста между camelCase, snake_case, PascalCase, kebab-case и другими'
    },
    category: 'text',
    tags: ['case', 'camel', 'snake', 'pascal', 'kebab', 'convert', 'text'],
    icon: 'Aa',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CaseConverter
  },

  {
    id: 'line-operations',
    slug: 'line-operations',
    name: { en: 'Line Operations', ru: 'Операции со Строками' },
    description: {
      en: 'Sort, deduplicate, reverse, shuffle and filter lines in text',
      ru: 'Сортировка, дедупликация, реверс, перемешивание и фильтрация строк текста'
    },
    category: 'text',
    tags: ['lines', 'sort', 'deduplicate', 'unique', 'reverse', 'shuffle', 'filter'],
    icon: '📋',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: LineOperations
  },

  {
    id: 'string-operations',
    slug: 'string-operations',
    name: { en: 'String Operations', ru: 'Операции со Строками' },
    description: {
      en: 'Find & replace, extract emails/URLs/IPs, and other string operations',
      ru: 'Поиск и замена, извлечение email/URL/IP и другие операции со строками'
    },
    category: 'text',
    tags: ['string', 'find', 'replace', 'extract', 'email', 'url', 'ip', 'regex'],
    icon: '🔤',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: StringOperations
  },

  // Text Analysis
  {
    id: 'text-statistics',
    slug: 'text-statistics',
    name: { en: 'Text Statistics', ru: 'Статистика Текста' },
    description: {
      en: 'Count characters, words, sentences, paragraphs and estimate reading time',
      ru: 'Подсчёт символов, слов, предложений, абзацев и оценка времени чтения'
    },
    category: 'analyzers',
    tags: ['text', 'statistics', 'count', 'words', 'characters', 'reading', 'time'],
    icon: '📊',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: TextStatistics
  },

  {
    id: 'text-diff',
    slug: 'text-diff',
    name: { en: 'Text Diff', ru: 'Сравнение Текста' },
    description: {
      en: 'Compare two texts side-by-side or inline with Levenshtein distance',
      ru: 'Сравнение двух текстов бок о бок или inline с расстоянием Левенштейна'
    },
    category: 'analyzers',
    tags: ['diff', 'compare', 'text', 'levenshtein', 'side-by-side', 'inline'],
    icon: '⇄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: TextDiff
  },

  // Generators (Text)
  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum',
    name: { en: 'Lorem Ipsum Generator', ru: 'Генератор Lorem Ipsum' },
    description: {
      en: 'Generate Lorem Ipsum placeholder text in classic, hipster, or office styles',
      ru: 'Генерация текста-заполнителя Lorem Ipsum в классическом, хипстерском или офисном стиле'
    },
    category: 'generators',
    tags: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'generate'],
    icon: '📝',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: LoremIpsum
  },

  {
    id: 'password-generator',
    slug: 'password-generator',
    name: { en: 'Password Generator', ru: 'Генератор Паролей' },
    description: {
      en: 'Generate strong secure passwords with customizable options',
      ru: 'Генерация надёжных паролей с настраиваемыми параметрами'
    },
    category: 'generators',
    tags: ['password', 'generate', 'secure', 'random', 'strong'],
    icon: '🔑',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PasswordGenerator
  },

  {
    id: 'passphrase-generator',
    slug: 'passphrase-generator',
    name: { en: 'Passphrase Generator', ru: 'Генератор Парольных Фраз' },
    description: {
      en: 'Generate memorable passphrases using EFF Diceware wordlist',
      ru: 'Генерация запоминаемых парольных фраз на основе EFF Diceware словаря'
    },
    category: 'generators',
    tags: ['passphrase', 'diceware', 'eff', 'words', 'secure', 'memorable'],
    icon: '🎲',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PassphraseGenerator
  },

  {
    id: 'slug-generator',
    slug: 'slug-generator',
    name: { en: 'Slug Generator', ru: 'Генератор Slug' },
    description: {
      en: 'Generate URL-friendly slugs from text with transliteration support',
      ru: 'Генерация URL-совместимых slug из текста с поддержкой транслитерации'
    },
    category: 'generators',
    tags: ['slug', 'url', 'seo', 'generate', 'transliteration'],
    icon: '🔗',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: SlugGenerator
  },

  {
    id: 'ulid-generator',
    slug: 'ulid-generator',
    name: { en: 'ULID Generator', ru: 'Генератор ULID' },
    description: {
      en: 'Generate ULIDs with timestamp extraction (sortable unique IDs)',
      ru: 'Генерация ULID с извлечением timestamp (сортируемые уникальные ID)'
    },
    category: 'generators',
    tags: ['ulid', 'id', 'unique', 'sortable', 'timestamp', 'generate'],
    icon: '🆔',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UlidGenerator
  },

  {
    id: 'nanoid-generator',
    slug: 'nanoid-generator',
    name: { en: 'NanoID Generator', ru: 'Генератор NanoID' },
    description: {
      en: 'Generate compact unique IDs with customizable alphabet and length',
      ru: 'Генерация компактных уникальных ID с настраиваемым алфавитом и длиной'
    },
    category: 'generators',
    tags: ['nanoid', 'id', 'unique', 'compact', 'generate', 'alphabet'],
    icon: '🔢',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: NanoidGenerator
  },

  {
    id: 'fake-data-generator',
    slug: 'fake-data-generator',
    name: { en: 'Fake Data Generator', ru: 'Генератор Фейковых Данных' },
    description: {
      en: 'Generate realistic fake data for testing: names, emails, addresses, and more',
      ru: 'Генерация реалистичных фейковых данных для тестирования: имена, email, адреса и другое'
    },
    category: 'generators',
    tags: ['fake', 'data', 'faker', 'mock', 'test', 'names', 'emails', 'addresses'],
    icon: '🎭',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: FakeDataGenerator
  },

  // Additional Text Tools
  {
    id: 'markdown-formatter',
    slug: 'markdown-formatter',
    name: { en: 'Markdown Formatter', ru: 'Форматтер Markdown' },
    description: {
      en: 'Format and beautify Markdown files with configurable options',
      ru: 'Форматирование и украшение Markdown файлов с настраиваемыми параметрами'
    },
    category: 'formatters',
    tags: ['markdown', 'format', 'beautify', 'prettier', 'md'],
    icon: '📝',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: MarkdownFormatter
  },

  {
    id: 'word-frequency',
    slug: 'word-frequency',
    name: { en: 'Word Frequency Analyzer', ru: 'Анализатор Частоты Слов' },
    description: {
      en: 'Analyze word frequency in text with stop words filtering',
      ru: 'Анализ частоты слов в тексте с фильтрацией стоп-слов'
    },
    category: 'analyzers',
    tags: ['word', 'frequency', 'count', 'analyze', 'text', 'statistics'],
    icon: '📊',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: WordFrequency
  },

  {
    id: 'palindrome-checker',
    slug: 'palindrome-checker',
    name: { en: 'Palindrome Checker', ru: 'Проверка Палиндрома' },
    description: {
      en: 'Check if text is a palindrome with customizable options',
      ru: 'Проверка, является ли текст палиндромом с настраиваемыми параметрами'
    },
    category: 'analyzers',
    tags: ['palindrome', 'check', 'text', 'reverse', 'analyze'],
    icon: '🔄',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PalindromeChecker
  },

  {
    id: 'anagram-checker',
    slug: 'anagram-checker',
    name: { en: 'Anagram Checker', ru: 'Проверка Анаграммы' },
    description: {
      en: 'Check if two words or phrases are anagrams of each other',
      ru: 'Проверка, являются ли два слова или фразы анаграммами друг друга'
    },
    category: 'analyzers',
    tags: ['anagram', 'check', 'text', 'letters', 'compare'],
    icon: '🔀',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: AnagramChecker
  },

  {
    id: 'duplicate-finder',
    slug: 'duplicate-finder',
    name: { en: 'Duplicate Finder', ru: 'Поиск Дубликатов' },
    description: {
      en: 'Find and remove duplicate lines or words in text',
      ru: 'Поиск и удаление дублирующихся строк или слов в тексте'
    },
    category: 'text',
    tags: ['duplicate', 'find', 'remove', 'unique', 'lines', 'words'],
    icon: '🔍',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: DuplicateFinder
  },

  {
    id: 'random-text-generator',
    slug: 'random-text-generator',
    name: { en: 'Random Text Generator', ru: 'Генератор Случайного Текста' },
    description: {
      en: 'Generate random text, numbers, and alphanumeric strings',
      ru: 'Генерация случайного текста, чисел и алфавитно-цифровых строк'
    },
    category: 'generators',
    tags: ['random', 'text', 'generate', 'string', 'alphanumeric'],
    icon: '🎲',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: RandomTextGenerator
  },

  {
    id: 'username-generator',
    slug: 'username-generator',
    name: { en: 'Username Generator', ru: 'Генератор Никнеймов' },
    description: {
      en: 'Generate creative usernames for gaming, social media, and more',
      ru: 'Генерация креативных никнеймов для игр, соцсетей и многого другого'
    },
    category: 'generators',
    tags: ['username', 'nickname', 'generate', 'gaming', 'social'],
    icon: '👤',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: UsernameGenerator
  },

  // Cryptography & Security Tools
  {
    id: 'multi-hash',
    slug: 'multi-hash',
    name: { en: 'Multi-Hash Generator', ru: 'Мульти-Хеш Генератор' },
    description: {
      en: 'Generate hashes using MD5, SHA-1, SHA-256, SHA-512, SHA-3, BLAKE2, and more',
      ru: 'Генерация хешей MD5, SHA-1, SHA-256, SHA-512, SHA-3, BLAKE2 и других'
    },
    category: 'security',
    tags: ['hash', 'md5', 'sha256', 'sha512', 'sha3', 'blake2', 'crypto'],
    icon: '#️⃣',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: MultiHash
  },

  {
    id: 'hash-identifier',
    slug: 'hash-identifier',
    name: { en: 'Hash Identifier', ru: 'Идентификатор Хешей' },
    description: {
      en: 'Identify the type of hash from its format and characteristics',
      ru: 'Определение типа хеша по его формату и характеристикам'
    },
    category: 'security',
    tags: ['hash', 'identify', 'detect', 'md5', 'sha', 'bcrypt'],
    icon: '🔍',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HashIdentifier
  },

  {
    id: 'caesar-cipher',
    slug: 'caesar-cipher',
    name: { en: 'Caesar Cipher', ru: 'Шифр Цезаря' },
    description: {
      en: 'Encrypt and decrypt text using the classic Caesar cipher',
      ru: 'Шифрование и дешифрование текста классическим шифром Цезаря'
    },
    category: 'security',
    tags: ['caesar', 'cipher', 'encrypt', 'decrypt', 'classic', 'rot'],
    icon: '🏛️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CaesarCipher
  },

  {
    id: 'jwt-tool',
    slug: 'jwt-tool',
    name: { en: 'JWT Decoder/Encoder', ru: 'JWT Декодер/Энкодер' },
    description: {
      en: 'Decode, encode, and validate JSON Web Tokens (JWT)',
      ru: 'Декодирование, кодирование и валидация JSON Web Tokens (JWT)'
    },
    category: 'security',
    tags: ['jwt', 'token', 'decode', 'encode', 'auth', 'json'],
    icon: '🎫',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: JwtTool
  },

  {
    id: 'password-strength',
    slug: 'password-strength',
    name: { en: 'Password Strength Checker', ru: 'Проверка Надёжности Пароля' },
    description: {
      en: 'Check password strength with detailed analysis and crack time estimates',
      ru: 'Проверка надёжности пароля с детальным анализом и оценкой времени взлома'
    },
    category: 'security',
    tags: ['password', 'strength', 'security', 'zxcvbn', 'check'],
    icon: '💪',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PasswordStrength
  },

  {
    id: 'bcrypt-tool',
    slug: 'bcrypt-tool',
    name: { en: 'Bcrypt Hash Tool', ru: 'Bcrypt Генератор' },
    description: {
      en: 'Generate and verify bcrypt password hashes with customizable cost factor',
      ru: 'Генерация и проверка bcrypt хешей паролей с настраиваемым фактором стоимости'
    },
    category: 'security',
    tags: ['bcrypt', 'hash', 'password', 'verify', 'salt'],
    icon: '🔐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: BcryptTool
  },

  {
    id: 'aes-encrypt',
    slug: 'aes-encrypt',
    name: { en: 'AES Encrypt/Decrypt', ru: 'AES Шифрование' },
    description: {
      en: 'Encrypt and decrypt data using AES-256-GCM symmetric encryption',
      ru: 'Шифрование и дешифрование данных с помощью AES-256-GCM'
    },
    category: 'security',
    tags: ['aes', 'encrypt', 'decrypt', 'gcm', 'symmetric', 'crypto'],
    icon: '🔒',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: AesEncrypt
  },

  {
    id: 'vigenere-cipher',
    slug: 'vigenere-cipher',
    name: { en: 'Vigenère Cipher', ru: 'Шифр Виженера' },
    description: {
      en: 'Encrypt and decrypt text using the classic Vigenère polyalphabetic cipher',
      ru: 'Шифрование и дешифрование текста классическим полиалфавитным шифром Виженера'
    },
    category: 'security',
    tags: ['vigenere', 'cipher', 'encrypt', 'decrypt', 'polyalphabetic', 'classic'],
    icon: '🔣',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: VigenereCipher
  },

  {
    id: 'xor-cipher',
    slug: 'xor-cipher',
    name: { en: 'XOR Cipher', ru: 'XOR Шифр' },
    description: {
      en: 'Encrypt and decrypt data using XOR operation with multiple key formats',
      ru: 'Шифрование и дешифрование данных с помощью операции XOR с разными форматами ключей'
    },
    category: 'security',
    tags: ['xor', 'cipher', 'encrypt', 'decrypt', 'binary', 'hex'],
    icon: '⊕',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: XorCipher
  },

  {
    id: 'rsa-keygen',
    slug: 'rsa-keygen',
    name: { en: 'RSA Key Generator', ru: 'Генератор RSA Ключей' },
    description: {
      en: 'Generate RSA key pairs for asymmetric encryption with PEM export',
      ru: 'Генерация пар RSA ключей для асимметричного шифрования с экспортом в PEM'
    },
    category: 'security',
    tags: ['rsa', 'key', 'generate', 'asymmetric', 'pem', 'pkcs8', 'spki'],
    icon: '🔑',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: RsaKeygen
  },

  {
    id: 'hibp-checker',
    slug: 'hibp-checker',
    name: { en: 'Password Breach Checker', ru: 'Проверка Утечки Паролей' },
    description: {
      en: 'Check if your password has been exposed in data breaches using HIBP API',
      ru: 'Проверка, был ли ваш пароль раскрыт в утечках данных через HIBP API'
    },
    category: 'security',
    tags: ['hibp', 'password', 'breach', 'security', 'pwned', 'check'],
    icon: '🔓',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: HibpChecker
  },

  {
    id: 'secret-key-generator',
    slug: 'secret-key-generator',
    name: { en: 'Secret Key Generator', ru: 'Генератор Секретных Ключей' },
    description: {
      en: 'Generate cryptographically secure random keys for encryption and APIs',
      ru: 'Генерация криптографически безопасных случайных ключей для шифрования и API'
    },
    category: 'security',
    tags: ['secret', 'key', 'generate', 'random', 'crypto', 'api'],
    icon: '🗝️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: SecretKeyGenerator
  },

  {
    id: 'sri-generator',
    slug: 'sri-generator',
    name: { en: 'SRI Hash Generator', ru: 'Генератор SRI Хешей' },
    description: {
      en: 'Generate Subresource Integrity hashes for secure script and style loading',
      ru: 'Генерация SRI хешей для безопасной загрузки скриптов и стилей'
    },
    category: 'security',
    tags: ['sri', 'integrity', 'hash', 'security', 'cdn', 'script'],
    icon: '🛡️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: SriGenerator
  },

  {
    id: 'argon2-tool',
    slug: 'argon2-tool',
    name: { en: 'Argon2 Hash Tool', ru: 'Argon2 Генератор' },
    description: {
      en: 'Generate and verify Argon2 password hashes (2d, 2i, 2id variants)',
      ru: 'Генерация и проверка Argon2 хешей паролей (варианты 2d, 2i, 2id)'
    },
    category: 'security',
    tags: ['argon2', 'hash', 'password', 'phc', 'wasm'],
    icon: '🏆',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Argon2Tool
  },

  {
    id: 'pbkdf2-tool',
    slug: 'pbkdf2-tool',
    name: { en: 'PBKDF2 Key Derivation', ru: 'PBKDF2 Деривация Ключей' },
    description: {
      en: 'Derive cryptographic keys from passwords using PBKDF2',
      ru: 'Деривация криптографических ключей из паролей с помощью PBKDF2'
    },
    category: 'security',
    tags: ['pbkdf2', 'key', 'derivation', 'password', 'crypto'],
    icon: '🔑',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Pbkdf2Tool
  },

  {
    id: 'otp-cipher',
    slug: 'otp-cipher',
    name: { en: 'One-Time Pad Cipher', ru: 'Шифр Одноразового Блокнота' },
    description: {
      en: 'Encrypt with perfect secrecy using one-time pad (Vernam cipher)',
      ru: 'Шифрование с абсолютной секретностью с помощью одноразового блокнота (шифр Вернама)'
    },
    category: 'security',
    tags: ['otp', 'vernam', 'cipher', 'perfect', 'secrecy', 'xor'],
    icon: '📜',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: OtpCipher
  },

  {
    id: 'csp-generator',
    slug: 'csp-generator',
    name: { en: 'CSP Header Generator', ru: 'Генератор CSP Заголовков' },
    description: {
      en: 'Build Content Security Policy headers to protect against XSS',
      ru: 'Создание заголовков Content Security Policy для защиты от XSS'
    },
    category: 'security',
    tags: ['csp', 'security', 'header', 'xss', 'policy'],
    icon: '🛡️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CspGenerator
  },

  {
    id: 'cors-generator',
    slug: 'cors-generator',
    name: { en: 'CORS Header Generator', ru: 'Генератор CORS Заголовков' },
    description: {
      en: 'Configure Cross-Origin Resource Sharing headers for your API',
      ru: 'Настройка заголовков Cross-Origin Resource Sharing для вашего API'
    },
    category: 'security',
    tags: ['cors', 'header', 'api', 'security', 'origin'],
    icon: '🔗',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: CorsGenerator
  },

  {
    id: 'chacha20-encrypt',
    slug: 'chacha20-encrypt',
    name: { en: 'ChaCha20-Poly1305 Encrypt', ru: 'ChaCha20-Poly1305 Шифрование' },
    description: {
      en: 'Authenticated encryption using ChaCha20-Poly1305 algorithm',
      ru: 'Аутентифицированное шифрование с использованием алгоритма ChaCha20-Poly1305'
    },
    category: 'security',
    tags: ['chacha20', 'poly1305', 'encrypt', 'aead', 'stream'],
    icon: '🔐',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: ChaCha20Encrypt
  },

  {
    id: 'api-key-generator',
    slug: 'api-key-generator',
    name: { en: 'API Key Generator', ru: 'Генератор API Ключей' },
    description: {
      en: 'Generate secure API keys in various formats (Stripe, AWS, GitHub style)',
      ru: 'Генерация безопасных API ключей в различных форматах (Stripe, AWS, GitHub)'
    },
    category: 'security',
    tags: ['api', 'key', 'token', 'generate', 'auth'],
    icon: '🗝️',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: ApiKeyGenerator
  },

  {
    id: 'pem-parser',
    slug: 'pem-parser',
    name: { en: 'PEM Parser', ru: 'Парсер PEM' },
    description: {
      en: 'Parse and analyze PEM encoded certificates, keys, and CSRs',
      ru: 'Парсинг и анализ сертификатов, ключей и CSR в формате PEM'
    },
    category: 'security',
    tags: ['pem', 'certificate', 'key', 'csr', 'parse'],
    icon: '📜',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: PemParser
  },

  {
    id: 'x509-decoder',
    slug: 'x509-decoder',
    name: { en: 'X.509 Certificate Decoder', ru: 'Декодер X.509 Сертификатов' },
    description: {
      en: 'Decode and inspect X.509 certificates with full details',
      ru: 'Декодирование и просмотр X.509 сертификатов со всеми деталями'
    },
    category: 'security',
    tags: ['x509', 'certificate', 'ssl', 'tls', 'decode'],
    icon: '📋',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: X509Decoder
  },

  {
    id: 'asn1-parser',
    slug: 'asn1-parser',
    name: { en: 'ASN.1 Parser', ru: 'Парсер ASN.1' },
    description: {
      en: 'Parse and visualize ASN.1 DER/BER encoded structures',
      ru: 'Парсинг и визуализация структур в формате ASN.1 DER/BER'
    },
    category: 'security',
    tags: ['asn1', 'der', 'ber', 'parse', 'structure'],
    icon: '🌳',
    isPro: false,
    isNew: true,
    isBeta: false,
    component: Asn1Parser
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
