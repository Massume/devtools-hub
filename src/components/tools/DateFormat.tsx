'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDateFormatTranslations } from '@/lib/i18n-date-format';
import toast from 'react-hot-toast';

type FormatType = 'auto' | 'iso' | 'rfc' | 'unix' | 'custom';

interface FormatPreset {
  name: string;
  pattern: string;
  example: string;
}

const FORMAT_PRESETS: FormatPreset[] = [
  { name: 'ISO 8601', pattern: '%Y-%m-%dT%H:%M:%S%z', example: '2024-01-15T10:30:00+0000' },
  { name: 'RFC 2822', pattern: '%a, %d %b %Y %H:%M:%S %z', example: 'Mon, 15 Jan 2024 10:30:00 +0000' },
  { name: 'US Format', pattern: '%m/%d/%Y %I:%M %p', example: '01/15/2024 10:30 AM' },
  { name: 'EU Format', pattern: '%d.%m.%Y %H:%M', example: '15.01.2024 10:30' },
  { name: 'SQL DateTime', pattern: '%Y-%m-%d %H:%M:%S', example: '2024-01-15 10:30:00' },
  { name: 'Log Format', pattern: '%Y%m%d_%H%M%S', example: '20240115_103000' },
];

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(input: string): Date | null {
  // Try Unix timestamp
  if (/^\d{10,13}$/.test(input.trim())) {
    const ts = parseInt(input.trim(), 10);
    return new Date(ts > 9999999999 ? ts : ts * 1000);
  }

  // Try ISO 8601
  const isoDate = new Date(input);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  return null;
}

function formatStrftime(date: Date, pattern: string): string {
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');

  const replacements: Record<string, string> = {
    '%Y': date.getFullYear().toString(),
    '%y': (date.getFullYear() % 100).toString().padStart(2, '0'),
    '%m': pad(date.getMonth() + 1),
    '%d': pad(date.getDate()),
    '%H': pad(date.getHours()),
    '%I': pad(date.getHours() % 12 || 12),
    '%M': pad(date.getMinutes()),
    '%S': pad(date.getSeconds()),
    '%p': date.getHours() < 12 ? 'AM' : 'PM',
    '%A': WEEKDAYS_EN[date.getDay()],
    '%a': WEEKDAYS_SHORT_EN[date.getDay()],
    '%B': MONTHS_EN[date.getMonth()],
    '%b': MONTHS_SHORT_EN[date.getMonth()],
    '%w': date.getDay().toString(),
    '%j': Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000).toString().padStart(3, '0'),
    '%z': (() => {
      const offset = -date.getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const hours = pad(Math.floor(Math.abs(offset) / 60));
      const mins = pad(Math.abs(offset) % 60);
      return `${sign}${hours}${mins}`;
    })(),
    '%Z': Intl.DateTimeFormat().resolvedOptions().timeZone,
    '%%': '%',
  };

  let result = pattern;
  for (const [token, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(token.replace('%', '\\%'), 'g'), value);
  }

  return result;
}

function formatToISO(date: Date): string {
  return date.toISOString();
}

function formatToRFC(date: Date): string {
  return date.toUTCString();
}

function formatToUnix(date: Date): string {
  return Math.floor(date.getTime() / 1000).toString();
}

export function DateFormat() {
  const { locale } = useI18n();
  const t = getDateFormatTranslations(locale);

  const [input, setInput] = useState('');
  const [outputFormat, setOutputFormat] = useState<FormatType>('iso');
  const [customPattern, setCustomPattern] = useState('%Y-%m-%d %H:%M:%S');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const date = parseDate(input);
    if (!date) {
      toast.error(t.invalidDate);
      return;
    }

    let result = '';
    switch (outputFormat) {
      case 'iso':
        result = formatToISO(date);
        break;
      case 'rfc':
        result = formatToRFC(date);
        break;
      case 'unix':
        result = formatToUnix(date);
        break;
      case 'custom':
        result = formatStrftime(date, customPattern);
        break;
      default:
        result = formatToISO(date);
    }

    setOutput(result);
    toast.success(t.convertedSuccess);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleNow = () => {
    setInput(new Date().toISOString());
  };

  const handlePreset = (preset: FormatPreset) => {
    setOutputFormat('custom');
    setCustomPattern(preset.pattern);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>
          <button
            onClick={handleNow}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.nowButton}
          </button>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-hub-muted">{t.outputFormat}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'iso', label: t.formatISO },
              { value: 'rfc', label: t.formatRFC },
              { value: 'unix', label: t.formatUnix },
              { value: 'custom', label: t.formatCustom },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setOutputFormat(value as FormatType)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  outputFormat === value
                    ? 'bg-hub-accent text-hub-darker'
                    : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {outputFormat === 'custom' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-hub-muted">{t.customFormat}</label>
            <input
              type="text"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder={t.customPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.convertButton}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.outputLabel}</h3>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-hub-accent break-all">
            {output}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.presetsTitle}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {FORMAT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="p-3 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-left"
            >
              <div className="font-medium text-hub-accent">{preset.name}</div>
              <div className="text-xs text-gray-400 mt-1 font-mono truncate">{preset.example}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Strftime Reference */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.strftimeRef}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {[
            t.strftimeY,
            t.strftimem,
            t.strftimed,
            t.strftimeH,
            t.strftimeM,
            t.strftimeS,
            t.strftimeA,
            t.strftimeB,
            t.strftimez,
          ].map((item, i) => (
            <div key={i} className="font-mono text-gray-400">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
