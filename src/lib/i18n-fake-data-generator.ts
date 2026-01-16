import type { Locale } from './i18n';

export const fakeDataGeneratorTranslations = {
  en: {
    pageTitle: 'Fake Data Generator - Random Test Data',
    pageDescription: 'Generate realistic fake data for testing: names, emails, addresses, phone numbers, and more',

    category: 'Data Category',
    fields: 'Fields',
    quantity: 'Quantity',
    dataLocale: 'Data Locale',
    outputFormat: 'Output Format',

    categoryPerson: 'Person',
    categoryCompany: 'Company',
    categoryAddress: 'Address',
    categoryInternet: 'Internet',
    categoryFinance: 'Finance',
    categoryCommerce: 'Commerce',
    categoryDate: 'Date',

    fieldFirstName: 'First Name',
    fieldLastName: 'Last Name',
    fieldFullName: 'Full Name',
    fieldEmail: 'Email',
    fieldPhone: 'Phone',
    fieldJobTitle: 'Job Title',
    fieldAvatar: 'Avatar URL',

    fieldCompanyName: 'Company Name',
    fieldCatchPhrase: 'Catch Phrase',
    fieldBs: 'Business',

    fieldStreet: 'Street',
    fieldCity: 'City',
    fieldState: 'State',
    fieldCountry: 'Country',
    fieldZipCode: 'Zip Code',

    fieldUsername: 'Username',
    fieldPassword: 'Password',
    fieldUrl: 'URL',
    fieldIp: 'IP Address',
    fieldUserAgent: 'User Agent',

    fieldAccountNumber: 'Account Number',
    fieldCreditCard: 'Credit Card',
    fieldCurrency: 'Currency',
    fieldBitcoin: 'Bitcoin Address',

    fieldProductName: 'Product Name',
    fieldPrice: 'Price',
    fieldDepartment: 'Department',

    fieldPast: 'Past Date',
    fieldFuture: 'Future Date',
    fieldRecent: 'Recent Date',
    fieldBirthdate: 'Birthdate',

    generateButton: 'Generate',
    copyButton: 'Copy',
    downloadButton: 'Download',
    clearButton: 'Clear',

    copied: 'Copied to clipboard!',

    featuresTitle: 'Features',
    feature1: 'Multiple data categories',
    feature2: 'Locale-aware data generation',
    feature3: 'Export as JSON, CSV, or SQL',
    feature4: 'Realistic data using faker.js',

    aboutTitle: 'About Fake Data Generator',
    aboutText: 'Generate realistic fake data for testing and development. Powered by faker.js with support for multiple locales and data categories.',
  },
  ru: {
    pageTitle: 'Генератор Фейковых Данных - Тестовые Данные',
    pageDescription: 'Генерация реалистичных фейковых данных для тестирования: имена, email, адреса, телефоны и другое',

    category: 'Категория данных',
    fields: 'Поля',
    quantity: 'Количество',
    dataLocale: 'Локаль данных',
    outputFormat: 'Формат вывода',

    categoryPerson: 'Персона',
    categoryCompany: 'Компания',
    categoryAddress: 'Адрес',
    categoryInternet: 'Интернет',
    categoryFinance: 'Финансы',
    categoryCommerce: 'Товары',
    categoryDate: 'Даты',

    fieldFirstName: 'Имя',
    fieldLastName: 'Фамилия',
    fieldFullName: 'Полное имя',
    fieldEmail: 'Email',
    fieldPhone: 'Телефон',
    fieldJobTitle: 'Должность',
    fieldAvatar: 'URL аватара',

    fieldCompanyName: 'Название компании',
    fieldCatchPhrase: 'Слоган',
    fieldBs: 'Бизнес',

    fieldStreet: 'Улица',
    fieldCity: 'Город',
    fieldState: 'Регион',
    fieldCountry: 'Страна',
    fieldZipCode: 'Индекс',

    fieldUsername: 'Логин',
    fieldPassword: 'Пароль',
    fieldUrl: 'URL',
    fieldIp: 'IP адрес',
    fieldUserAgent: 'User Agent',

    fieldAccountNumber: 'Номер счёта',
    fieldCreditCard: 'Кредитная карта',
    fieldCurrency: 'Валюта',
    fieldBitcoin: 'Bitcoin адрес',

    fieldProductName: 'Название товара',
    fieldPrice: 'Цена',
    fieldDepartment: 'Отдел',

    fieldPast: 'Дата в прошлом',
    fieldFuture: 'Дата в будущем',
    fieldRecent: 'Недавняя дата',
    fieldBirthdate: 'Дата рождения',

    generateButton: 'Сгенерировать',
    copyButton: 'Копировать',
    downloadButton: 'Скачать',
    clearButton: 'Очистить',

    copied: 'Скопировано!',

    featuresTitle: 'Возможности',
    feature1: 'Множество категорий данных',
    feature2: 'Генерация с учётом локали',
    feature3: 'Экспорт в JSON, CSV или SQL',
    feature4: 'Реалистичные данные на базе faker.js',

    aboutTitle: 'О Генераторе Фейковых Данных',
    aboutText: 'Генерация реалистичных фейковых данных для тестирования и разработки. Работает на базе faker.js с поддержкой множества локалей и категорий данных.',
  },
};

export function getFakeDataGeneratorTranslations(locale: Locale) {
  return fakeDataGeneratorTranslations[locale];
}
