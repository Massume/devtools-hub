import type { Locale } from './i18n';

export const usernameGeneratorTranslations = {
  en: {
    pageTitle: 'Username Generator - Create Unique Usernames',
    pageDescription: 'Generate creative and unique usernames for gaming, social media, and more',

    outputLabel: 'Generated Usernames',
    placeholder: 'Click Generate to create usernames...',

    generateButton: 'Generate',
    copyButton: 'Copy All',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',

    options: 'Options',
    style: 'Style',
    styleRandom: 'Random Mix',
    styleGamer: 'Gamer',
    styleCool: 'Cool',
    styleFunny: 'Funny',
    styleProfessional: 'Professional',

    count: 'Count',
    includeNumbers: 'Include Numbers',
    includeSymbols: 'Include Symbols (_)',
    maxLength: 'Max Length',

    featuresTitle: 'Features',
    feature1: 'Multiple username styles',
    feature2: 'Customizable length and count',
    feature3: 'Optional numbers and symbols',
    feature4: 'Click to copy individual names',

    aboutTitle: 'About Username Generator',
    aboutText: 'Generate creative usernames for gaming, social media, forums, and more. Choose from different styles like gamer tags, professional names, or funny combinations.',
  },
  ru: {
    pageTitle: 'Генератор Никнеймов',
    pageDescription: 'Создание креативных и уникальных никнеймов для игр, соцсетей и многого другого',

    outputLabel: 'Сгенерированные никнеймы',
    placeholder: 'Нажмите Сгенерировать для создания никнеймов...',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать все',
    clearButton: 'Очистить',

    copied: 'Скопировано!',

    options: 'Настройки',
    style: 'Стиль',
    styleRandom: 'Случайный микс',
    styleGamer: 'Геймерский',
    styleCool: 'Крутой',
    styleFunny: 'Забавный',
    styleProfessional: 'Профессиональный',

    count: 'Количество',
    includeNumbers: 'Добавить цифры',
    includeSymbols: 'Добавить символы (_)',
    maxLength: 'Макс. длина',

    featuresTitle: 'Возможности',
    feature1: 'Разные стили никнеймов',
    feature2: 'Настраиваемая длина и количество',
    feature3: 'Опциональные цифры и символы',
    feature4: 'Клик для копирования отдельного имени',

    aboutTitle: 'О Генераторе Никнеймов',
    aboutText: 'Генерация креативных никнеймов для игр, социальных сетей, форумов и многого другого. Выбирайте из разных стилей: геймерские теги, профессиональные имена или забавные комбинации.',
  },
};

export function getUsernameGeneratorTranslations(locale: Locale) {
  return usernameGeneratorTranslations[locale];
}
