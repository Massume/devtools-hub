'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getFakeDataGeneratorTranslations } from '@/lib/i18n-fake-data-generator';
import { faker, Faker } from '@faker-js/faker';
import { faker as fakerRU } from '@faker-js/faker/locale/ru';
import { faker as fakerDE } from '@faker-js/faker/locale/de';
import { faker as fakerFR } from '@faker-js/faker/locale/fr';
import { faker as fakerES } from '@faker-js/faker/locale/es';
import { faker as fakerZH_CN } from '@faker-js/faker/locale/zh_CN';
import { faker as fakerJA } from '@faker-js/faker/locale/ja';
import toast from 'react-hot-toast';

type DataCategory = 'person' | 'company' | 'address' | 'internet' | 'finance' | 'commerce' | 'date';
type OutputFormat = 'json' | 'csv' | 'sql';

const locales: Record<string, Faker> = {
  en: faker,
  ru: fakerRU,
  de: fakerDE,
  fr: fakerFR,
  es: fakerES,
  zh: fakerZH_CN,
  ja: fakerJA,
};

const categoryFields: Record<DataCategory, { id: string; labelKey: string }[]> = {
  person: [
    { id: 'firstName', labelKey: 'fieldFirstName' },
    { id: 'lastName', labelKey: 'fieldLastName' },
    { id: 'fullName', labelKey: 'fieldFullName' },
    { id: 'email', labelKey: 'fieldEmail' },
    { id: 'phone', labelKey: 'fieldPhone' },
    { id: 'jobTitle', labelKey: 'fieldJobTitle' },
    { id: 'avatar', labelKey: 'fieldAvatar' },
  ],
  company: [
    { id: 'companyName', labelKey: 'fieldCompanyName' },
    { id: 'catchPhrase', labelKey: 'fieldCatchPhrase' },
    { id: 'bs', labelKey: 'fieldBs' },
  ],
  address: [
    { id: 'street', labelKey: 'fieldStreet' },
    { id: 'city', labelKey: 'fieldCity' },
    { id: 'state', labelKey: 'fieldState' },
    { id: 'country', labelKey: 'fieldCountry' },
    { id: 'zipCode', labelKey: 'fieldZipCode' },
  ],
  internet: [
    { id: 'username', labelKey: 'fieldUsername' },
    { id: 'email', labelKey: 'fieldEmail' },
    { id: 'password', labelKey: 'fieldPassword' },
    { id: 'url', labelKey: 'fieldUrl' },
    { id: 'ip', labelKey: 'fieldIp' },
    { id: 'userAgent', labelKey: 'fieldUserAgent' },
  ],
  finance: [
    { id: 'accountNumber', labelKey: 'fieldAccountNumber' },
    { id: 'creditCard', labelKey: 'fieldCreditCard' },
    { id: 'currency', labelKey: 'fieldCurrency' },
    { id: 'bitcoin', labelKey: 'fieldBitcoin' },
  ],
  commerce: [
    { id: 'productName', labelKey: 'fieldProductName' },
    { id: 'price', labelKey: 'fieldPrice' },
    { id: 'department', labelKey: 'fieldDepartment' },
  ],
  date: [
    { id: 'past', labelKey: 'fieldPast' },
    { id: 'future', labelKey: 'fieldFuture' },
    { id: 'recent', labelKey: 'fieldRecent' },
    { id: 'birthdate', labelKey: 'fieldBirthdate' },
  ],
};

function generateFieldValue(f: Faker, fieldId: string): string {
  switch (fieldId) {
    case 'firstName': return f.person.firstName();
    case 'lastName': return f.person.lastName();
    case 'fullName': return f.person.fullName();
    case 'email': return f.internet.email();
    case 'phone': return f.phone.number();
    case 'jobTitle': return f.person.jobTitle();
    case 'avatar': return f.image.avatar();
    case 'companyName': return f.company.name();
    case 'catchPhrase': return f.company.catchPhrase();
    case 'bs': return f.company.buzzPhrase();
    case 'street': return f.location.streetAddress();
    case 'city': return f.location.city();
    case 'state': return f.location.state();
    case 'country': return f.location.country();
    case 'zipCode': return f.location.zipCode();
    case 'username': return f.internet.username();
    case 'password': return f.internet.password();
    case 'url': return f.internet.url();
    case 'ip': return f.internet.ip();
    case 'userAgent': return f.internet.userAgent();
    case 'accountNumber': return f.finance.accountNumber();
    case 'creditCard': return f.finance.creditCardNumber();
    case 'currency': return f.finance.currencyCode();
    case 'bitcoin': return f.finance.bitcoinAddress();
    case 'productName': return f.commerce.productName();
    case 'price': return f.commerce.price();
    case 'department': return f.commerce.department();
    case 'past': return f.date.past().toISOString();
    case 'future': return f.date.future().toISOString();
    case 'recent': return f.date.recent().toISOString();
    case 'birthdate': return f.date.birthdate().toISOString().split('T')[0];
    default: return '';
  }
}

export function FakeDataGenerator() {
  const { locale } = useI18n();
  const t = getFakeDataGeneratorTranslations(locale);

  const [category, setCategory] = useState<DataCategory>('person');
  const [selectedFields, setSelectedFields] = useState<string[]>(['firstName', 'lastName', 'email']);
  const [quantity, setQuantity] = useState(10);
  const [dataLocale, setDataLocale] = useState('en');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [output, setOutput] = useState('');

  const categories: { value: DataCategory; labelKey: string }[] = [
    { value: 'person', labelKey: 'categoryPerson' },
    { value: 'company', labelKey: 'categoryCompany' },
    { value: 'address', labelKey: 'categoryAddress' },
    { value: 'internet', labelKey: 'categoryInternet' },
    { value: 'finance', labelKey: 'categoryFinance' },
    { value: 'commerce', labelKey: 'categoryCommerce' },
    { value: 'date', labelKey: 'categoryDate' },
  ];

  const availableLocales = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Russian' },
    { value: 'de', label: 'German' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
  ];

  const handleCategoryChange = (newCategory: DataCategory) => {
    setCategory(newCategory);
    const defaultFields = categoryFields[newCategory].slice(0, 3).map(f => f.id);
    setSelectedFields(defaultFields);
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleGenerate = () => {
    const f = locales[dataLocale] || faker;
    const data: Record<string, string>[] = [];

    for (let i = 0; i < quantity; i++) {
      const row: Record<string, string> = {};
      for (const fieldId of selectedFields) {
        row[fieldId] = generateFieldValue(f, fieldId);
      }
      data.push(row);
    }

    let result = '';
    switch (outputFormat) {
      case 'json':
        result = JSON.stringify(data, null, 2);
        break;
      case 'csv':
        const headers = selectedFields.join(',');
        const rows = data.map(row => selectedFields.map(f => `"${row[f]}"`).join(','));
        result = [headers, ...rows].join('\n');
        break;
      case 'sql':
        const tableName = 'fake_data';
        const columns = selectedFields.join(', ');
        const values = data.map(row =>
          `(${selectedFields.map(f => `'${row[f].replace(/'/g, "''")}'`).join(', ')})`
        ).join(',\n');
        result = `INSERT INTO ${tableName} (${columns}) VALUES\n${values};`;
        break;
    }

    setOutput(result);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleDownload = () => {
    const ext = outputFormat === 'json' ? 'json' : outputFormat === 'csv' ? 'csv' : 'sql';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake_data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              category === cat.value
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-card border border-hub-border text-white hover:border-hub-accent/50'
            }`}
          >
            {t[cat.labelKey as keyof typeof t]}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        {/* Fields */}
        <div>
          <label className="block text-sm text-hub-muted mb-2">{t.fields}</label>
          <div className="flex flex-wrap gap-2">
            {categoryFields[category].map((field) => (
              <label
                key={field.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                  selectedFields.includes(field.id)
                    ? 'bg-hub-accent/20 text-hub-accent border border-hub-accent/30'
                    : 'bg-hub-darker text-hub-muted border border-hub-border hover:border-hub-accent/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => handleFieldToggle(field.id)}
                  className="hidden"
                />
                {t[field.labelKey as keyof typeof t]}
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.quantity}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
              min={1}
              max={1000}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.dataLocale}</label>
            <select
              value={dataLocale}
              onChange={(e) => setDataLocale(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              {availableLocales.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.outputFormat}</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="sql">SQL INSERT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={selectedFields.length === 0}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.generateButton}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyButton}
        </button>
        <button
          onClick={handleDownload}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.downloadButton}
        </button>
        <button
          onClick={handleClear}
          disabled={!output}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
      )}

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.featuresTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-hub-muted">
              <span className="text-hub-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{t.aboutTitle}</h3>
        <p className="text-hub-muted">{t.aboutText}</p>
      </div>
    </div>
  );
}
