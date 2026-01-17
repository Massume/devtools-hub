import type { Locale } from './i18n';

export const jwtToolTranslations = {
  en: {
    pageTitle: 'JWT Decoder/Encoder - JSON Web Token Tool',
    pageDescription: 'Decode, encode, and validate JSON Web Tokens (JWT)',

    tabs: {
      decode: 'Decode',
      encode: 'Encode',
    },

    // Decode
    tokenLabel: 'JWT Token',
    tokenPlaceholder: 'Paste your JWT token here...',
    decodeButton: 'Decode',

    headerLabel: 'Header',
    payloadLabel: 'Payload',
    signatureLabel: 'Signature',

    // Token info
    algorithm: 'Algorithm',
    issuedAt: 'Issued At',
    expiresAt: 'Expires At',
    notBefore: 'Not Before',
    issuer: 'Issuer',
    subject: 'Subject',
    audience: 'Audience',
    jwtId: 'JWT ID',

    tokenStatus: {
      valid: 'Token is valid',
      expired: 'Token has expired',
      notYetValid: 'Token not yet valid',
      malformed: 'Malformed token',
    },

    // Encode
    secretLabel: 'Secret Key',
    secretPlaceholder: 'Enter secret key for signing...',
    payloadInputLabel: 'Payload (JSON)',
    payloadInputPlaceholder: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
    encodeButton: 'Encode & Sign',
    algorithmLabel: 'Algorithm',

    encodedTokenLabel: 'Encoded JWT',

    // Common
    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied to clipboard!',

    featuresTitle: 'Features',
    feature1: 'Decode any JWT without secret',
    feature2: 'Visualize header and payload',
    feature3: 'Check token expiration status',
    feature4: 'Encode tokens with HS256/HS384/HS512',

    aboutTitle: 'About JWT Tool',
    aboutText: 'JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties. This tool allows you to decode JWTs to inspect their contents and encode new tokens with HMAC signatures. Note: Token signature verification requires the secret key.',

    warningDecode: 'JWTs can be decoded without the secret. Never put sensitive data in JWT payload.',
    warningEncode: 'Never expose your secret key. Generated tokens should be used for testing only.',
  },
  ru: {
    pageTitle: 'JWT Декодер/Энкодер',
    pageDescription: 'Декодирование, кодирование и валидация JSON Web Tokens (JWT)',

    tabs: {
      decode: 'Декодировать',
      encode: 'Закодировать',
    },

    // Decode
    tokenLabel: 'JWT Токен',
    tokenPlaceholder: 'Вставьте ваш JWT токен сюда...',
    decodeButton: 'Декодировать',

    headerLabel: 'Заголовок',
    payloadLabel: 'Полезная нагрузка',
    signatureLabel: 'Подпись',

    // Token info
    algorithm: 'Алгоритм',
    issuedAt: 'Выпущен',
    expiresAt: 'Истекает',
    notBefore: 'Действителен с',
    issuer: 'Издатель',
    subject: 'Субъект',
    audience: 'Аудитория',
    jwtId: 'JWT ID',

    tokenStatus: {
      valid: 'Токен действителен',
      expired: 'Токен истёк',
      notYetValid: 'Токен ещё не действителен',
      malformed: 'Некорректный токен',
    },

    // Encode
    secretLabel: 'Секретный ключ',
    secretPlaceholder: 'Введите секретный ключ для подписи...',
    payloadInputLabel: 'Полезная нагрузка (JSON)',
    payloadInputPlaceholder: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
    encodeButton: 'Закодировать и подписать',
    algorithmLabel: 'Алгоритм',

    encodedTokenLabel: 'Закодированный JWT',

    // Common
    copyButton: 'Копировать',
    clearButton: 'Очистить',
    copied: 'Скопировано!',

    featuresTitle: 'Возможности',
    feature1: 'Декодирование любого JWT без секрета',
    feature2: 'Визуализация заголовка и полезной нагрузки',
    feature3: 'Проверка статуса истечения токена',
    feature4: 'Кодирование токенов с HS256/HS384/HS512',

    aboutTitle: 'О JWT Инструменте',
    aboutText: 'JSON Web Tokens (JWT) — компактный, URL-безопасный способ представления утверждений для передачи между двумя сторонами. Этот инструмент позволяет декодировать JWT для просмотра содержимого и кодировать новые токены с HMAC подписью. Примечание: Для проверки подписи токена требуется секретный ключ.',

    warningDecode: 'JWT можно декодировать без секрета. Никогда не помещайте чувствительные данные в JWT payload.',
    warningEncode: 'Никогда не раскрывайте свой секретный ключ. Сгенерированные токены следует использовать только для тестирования.',
  },
};

export function getJwtToolTranslations(locale: Locale) {
  return jwtToolTranslations[locale];
}
