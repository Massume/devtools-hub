import type { Locale } from './i18n';

export const passwordStrengthTranslations = {
  en: {
    pageTitle: 'Password Strength Checker - Test Password Security',
    pageDescription: 'Check how strong your password is with detailed analysis and recommendations',

    inputLabel: 'Password to Check',
    inputPlaceholder: 'Enter password to analyze...',

    strengthLabel: 'Strength',
    strength: {
      0: 'Very Weak',
      1: 'Weak',
      2: 'Fair',
      3: 'Strong',
      4: 'Very Strong',
    },

    scoreLabel: 'Score',
    crackTimeLabel: 'Time to Crack',
    crackTimes: {
      offlineFast: 'Offline (fast hash, many cores)',
      offlineSlow: 'Offline (slow hash, many cores)',
      onlineThrottle: 'Online (rate limited)',
      onlineUnthrottle: 'Online (no rate limit)',
    },

    analysisTitle: 'Analysis',
    warningsTitle: 'Warnings',
    suggestionsTitle: 'Suggestions',

    characterAnalysis: 'Character Analysis',
    length: 'Length',
    lowercase: 'Lowercase (a-z)',
    uppercase: 'Uppercase (A-Z)',
    numbers: 'Numbers (0-9)',
    symbols: 'Symbols (!@#...)',

    patterns: {
      dictionary: 'Common word detected',
      sequence: 'Keyboard pattern detected',
      repeat: 'Repeated characters',
      date: 'Date pattern detected',
    },

    noWarnings: 'No warnings - looking good!',
    noSuggestions: 'No additional suggestions.',

    featuresTitle: 'Features',
    feature1: 'zxcvbn algorithm by Dropbox',
    feature2: 'Realistic crack time estimates',
    feature3: 'Pattern detection (dates, sequences)',
    feature4: 'Actionable suggestions',

    aboutTitle: 'About Password Strength Checker',
    aboutText: 'This tool uses zxcvbn, a realistic password strength estimator developed by Dropbox. Unlike simple rules-based checkers, it considers common patterns, dictionary words, keyboard sequences, and dates to give you a realistic estimate of how long your password would take to crack.',

    privacyNote: 'Your password never leaves your browser. All analysis is done locally.',
  },
  ru: {
    pageTitle: 'Проверка Надёжности Пароля',
    pageDescription: 'Проверьте надёжность вашего пароля с детальным анализом и рекомендациями',

    inputLabel: 'Пароль для проверки',
    inputPlaceholder: 'Введите пароль для анализа...',

    strengthLabel: 'Надёжность',
    strength: {
      0: 'Очень слабый',
      1: 'Слабый',
      2: 'Средний',
      3: 'Сильный',
      4: 'Очень сильный',
    },

    scoreLabel: 'Оценка',
    crackTimeLabel: 'Время взлома',
    crackTimes: {
      offlineFast: 'Офлайн (быстрый хеш, много ядер)',
      offlineSlow: 'Офлайн (медленный хеш, много ядер)',
      onlineThrottle: 'Онлайн (с ограничением)',
      onlineUnthrottle: 'Онлайн (без ограничения)',
    },

    analysisTitle: 'Анализ',
    warningsTitle: 'Предупреждения',
    suggestionsTitle: 'Рекомендации',

    characterAnalysis: 'Анализ символов',
    length: 'Длина',
    lowercase: 'Строчные (a-z)',
    uppercase: 'Заглавные (A-Z)',
    numbers: 'Цифры (0-9)',
    symbols: 'Символы (!@#...)',

    patterns: {
      dictionary: 'Обнаружено словарное слово',
      sequence: 'Обнаружен паттерн клавиатуры',
      repeat: 'Повторяющиеся символы',
      date: 'Обнаружен паттерн даты',
    },

    noWarnings: 'Нет предупреждений - отлично!',
    noSuggestions: 'Дополнительных рекомендаций нет.',

    featuresTitle: 'Возможности',
    feature1: 'Алгоритм zxcvbn от Dropbox',
    feature2: 'Реалистичные оценки времени взлома',
    feature3: 'Обнаружение паттернов (даты, последовательности)',
    feature4: 'Практические рекомендации',

    aboutTitle: 'О Проверке Надёжности Пароля',
    aboutText: 'Этот инструмент использует zxcvbn — реалистичный оценщик надёжности паролей, разработанный Dropbox. В отличие от простых проверок на основе правил, он учитывает распространённые паттерны, словарные слова, клавиатурные последовательности и даты для реалистичной оценки времени взлома.',

    privacyNote: 'Ваш пароль никогда не покидает браузер. Весь анализ выполняется локально.',
  },
};

export function getPasswordStrengthTranslations(locale: Locale) {
  return passwordStrengthTranslations[locale];
}
