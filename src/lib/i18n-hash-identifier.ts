import type { Locale } from './i18n';

export const hashIdentifierTranslations = {
  en: {
    pageTitle: 'Hash Identifier - Detect Hash Type',
    pageDescription: 'Identify the type of hash from its format and characteristics',

    inputLabel: 'Hash to Identify',
    inputPlaceholder: 'Paste a hash to identify its type...',

    identifyButton: 'Identify Hash',
    clearButton: 'Clear',

    resultsTitle: 'Possible Hash Types',
    noResults: 'Could not identify the hash type. Make sure you entered a valid hash.',

    confidence: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },

    hashInfo: {
      length: 'Length',
      characters: 'Characters',
      bits: 'bits',
    },

    algorithms: {
      md5: 'MD5',
      sha1: 'SHA-1',
      sha224: 'SHA-224',
      sha256: 'SHA-256',
      sha384: 'SHA-384',
      sha512: 'SHA-512',
      sha3_256: 'SHA-3 (256-bit)',
      sha3_512: 'SHA-3 (512-bit)',
      blake2b: 'BLAKE2b',
      blake2s: 'BLAKE2s',
      ripemd160: 'RIPEMD-160',
      crc32: 'CRC-32',
      adler32: 'Adler-32',
      ntlm: 'NTLM',
      mysql: 'MySQL (old)',
      mysql5: 'MySQL5',
      bcrypt: 'bcrypt',
      argon2: 'Argon2',
      scrypt: 'scrypt',
      keccak256: 'Keccak-256',
      keccak512: 'Keccak-512',
      whirlpool: 'Whirlpool',
      tiger: 'Tiger',
      md4: 'MD4',
      md2: 'MD2',
    },

    descriptions: {
      md5: 'Widely used but cryptographically broken. Still used for checksums.',
      sha1: 'Deprecated for security use. Still seen in legacy systems.',
      sha224: 'Truncated version of SHA-256. Rarely used.',
      sha256: 'Secure cryptographic hash. Recommended for most uses.',
      sha384: 'Truncated version of SHA-512. Good security margin.',
      sha512: 'Secure cryptographic hash. Good for high-security applications.',
      sha3_256: 'Latest SHA standard based on Keccak. Very secure.',
      sha3_512: 'Latest SHA standard based on Keccak. Very secure.',
      blake2b: 'Fast modern hash, often faster than MD5 while being secure.',
      blake2s: 'Optimized BLAKE2 for smaller platforms.',
      ripemd160: 'Used in Bitcoin addresses. Less common elsewhere.',
      crc32: 'Non-cryptographic checksum for error detection.',
      adler32: 'Fast checksum, used in zlib compression.',
      ntlm: 'Windows authentication hash. Can be cracked easily.',
      mysql: 'Old MySQL password hash. Very weak.',
      mysql5: 'MySQL 4.1+ password hash. Better but still weak.',
      bcrypt: 'Password hashing algorithm with salt. Very secure.',
      argon2: 'Modern password hashing algorithm. Winner of PHC.',
      scrypt: 'Memory-hard password hashing. Good for passwords.',
      keccak256: 'Original Keccak before SHA-3 standardization. Used in Ethereum.',
      keccak512: 'Original Keccak 512-bit variant.',
      whirlpool: '512-bit hash designed with AES principles.',
      tiger: 'Designed for 64-bit platforms. Less common now.',
      md4: 'Predecessor to MD5. Completely broken.',
      md2: 'Very old hash function. Should never be used.',
    },

    examples: 'Example Hashes',
    tryExample: 'Try',

    featuresTitle: 'Features',
    feature1: 'Identifies 25+ hash types',
    feature2: 'Confidence level indicators',
    feature3: 'Hash format analysis',
    feature4: 'Example hashes to test',

    aboutTitle: 'About Hash Identifier',
    aboutText: 'Identify hash types by analyzing their format, length, and character patterns. Useful for CTF challenges, forensics, and understanding unknown hashes. Note that many hash types share the same format, so multiple possibilities may be shown.',
  },
  ru: {
    pageTitle: 'Идентификатор Хешей',
    pageDescription: 'Определение типа хеша по его формату и характеристикам',

    inputLabel: 'Хеш для идентификации',
    inputPlaceholder: 'Вставьте хеш для определения его типа...',

    identifyButton: 'Определить хеш',
    clearButton: 'Очистить',

    resultsTitle: 'Возможные типы хеша',
    noResults: 'Не удалось определить тип хеша. Убедитесь, что введён корректный хеш.',

    confidence: {
      high: 'Высокая',
      medium: 'Средняя',
      low: 'Низкая',
    },

    hashInfo: {
      length: 'Длина',
      characters: 'Символы',
      bits: 'бит',
    },

    algorithms: {
      md5: 'MD5',
      sha1: 'SHA-1',
      sha224: 'SHA-224',
      sha256: 'SHA-256',
      sha384: 'SHA-384',
      sha512: 'SHA-512',
      sha3_256: 'SHA-3 (256-бит)',
      sha3_512: 'SHA-3 (512-бит)',
      blake2b: 'BLAKE2b',
      blake2s: 'BLAKE2s',
      ripemd160: 'RIPEMD-160',
      crc32: 'CRC-32',
      adler32: 'Adler-32',
      ntlm: 'NTLM',
      mysql: 'MySQL (старый)',
      mysql5: 'MySQL5',
      bcrypt: 'bcrypt',
      argon2: 'Argon2',
      scrypt: 'scrypt',
      keccak256: 'Keccak-256',
      keccak512: 'Keccak-512',
      whirlpool: 'Whirlpool',
      tiger: 'Tiger',
      md4: 'MD4',
      md2: 'MD2',
    },

    descriptions: {
      md5: 'Широко используется, но криптографически взломан. Используется для контрольных сумм.',
      sha1: 'Устарел для безопасности. Встречается в старых системах.',
      sha224: 'Усечённая версия SHA-256. Редко используется.',
      sha256: 'Безопасный криптографический хеш. Рекомендуется для большинства задач.',
      sha384: 'Усечённая версия SHA-512. Хороший запас безопасности.',
      sha512: 'Безопасный криптографический хеш. Для высокой безопасности.',
      sha3_256: 'Новейший стандарт SHA на основе Keccak. Очень безопасен.',
      sha3_512: 'Новейший стандарт SHA на основе Keccak. Очень безопасен.',
      blake2b: 'Быстрый современный хеш, часто быстрее MD5 при высокой безопасности.',
      blake2s: 'Оптимизированный BLAKE2 для небольших платформ.',
      ripemd160: 'Используется в Bitcoin адресах. Менее распространён.',
      crc32: 'Некриптографическая контрольная сумма для обнаружения ошибок.',
      adler32: 'Быстрая контрольная сумма, используется в zlib.',
      ntlm: 'Хеш аутентификации Windows. Легко взламывается.',
      mysql: 'Старый хеш пароля MySQL. Очень слабый.',
      mysql5: 'Хеш пароля MySQL 4.1+. Лучше, но всё ещё слабый.',
      bcrypt: 'Алгоритм хеширования паролей с солью. Очень безопасен.',
      argon2: 'Современный алгоритм хеширования паролей. Победитель PHC.',
      scrypt: 'Память-затратное хеширование паролей. Хорош для паролей.',
      keccak256: 'Оригинальный Keccak до стандартизации SHA-3. Используется в Ethereum.',
      keccak512: 'Оригинальный Keccak 512-битный вариант.',
      whirlpool: '512-битный хеш, разработанный по принципам AES.',
      tiger: 'Разработан для 64-битных платформ. Менее распространён.',
      md4: 'Предшественник MD5. Полностью взломан.',
      md2: 'Очень старая хеш-функция. Никогда не используйте.',
    },

    examples: 'Примеры хешей',
    tryExample: 'Проверить',

    featuresTitle: 'Возможности',
    feature1: 'Определяет 25+ типов хешей',
    feature2: 'Индикаторы уровня уверенности',
    feature3: 'Анализ формата хеша',
    feature4: 'Примеры хешей для тестирования',

    aboutTitle: 'Об Идентификаторе Хешей',
    aboutText: 'Определение типов хешей путём анализа их формата, длины и символов. Полезен для CTF задач, форензики и понимания неизвестных хешей. Многие типы хешей имеют одинаковый формат, поэтому может быть показано несколько вариантов.',
  },
};

export function getHashIdentifierTranslations(locale: Locale) {
  return hashIdentifierTranslations[locale];
}
