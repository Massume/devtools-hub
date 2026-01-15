'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCronParserTranslations } from '@/lib/i18n-cron-parser';
import toast from 'react-hot-toast';

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

interface ParsedCron {
  parts: CronParts;
  description: string;
  nextRuns: Date[];
}

const COMMON_EXPRESSIONS = [
  { expr: '* * * * *', desc: 'Every minute' },
  { expr: '*/5 * * * *', desc: 'Every 5 minutes' },
  { expr: '0 * * * *', desc: 'Every hour' },
  { expr: '0 0 * * *', desc: 'Every day at midnight' },
  { expr: '0 0 * * 0', desc: 'Every Sunday at midnight' },
  { expr: '0 0 1 * *', desc: 'First day of every month' },
  { expr: '0 9-17 * * 1-5', desc: 'Every hour 9-17 on weekdays' },
  { expr: '30 4 1,15 * *', desc: 'At 4:30 on 1st and 15th' },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseField(field: string, min: number, max: number): number[] {
  const values: Set<number> = new Set();

  const parts = field.split(',');
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      let start = min;
      let end = max;

      if (range !== '*') {
        if (range.includes('-')) {
          [start, end] = range.split('-').map(n => parseInt(n, 10));
        } else {
          start = parseInt(range, 10);
        }
      }

      for (let i = start; i <= end; i += step) values.add(i);
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n, 10));
      for (let i = start; i <= end; i++) values.add(i);
    } else {
      values.add(parseInt(part, 10));
    }
  }

  return Array.from(values).sort((a, b) => a - b);
}

function describePart(field: string, type: string, locale: string): string {
  if (field === '*') {
    return locale === 'ru' ? 'каждый' : 'every';
  }

  if (field.startsWith('*/')) {
    const step = field.slice(2);
    return locale === 'ru' ? `каждые ${step}` : `every ${step}`;
  }

  if (field.includes('-')) {
    return field;
  }

  if (field.includes(',')) {
    return field;
  }

  if (type === 'dayOfWeek') {
    const num = parseInt(field, 10);
    return DAY_NAMES[num] || field;
  }

  if (type === 'month') {
    const num = parseInt(field, 10);
    return MONTH_NAMES[num - 1] || field;
  }

  return field;
}

function getNextRuns(parts: CronParts, count: number): Date[] {
  const runs: Date[] = [];
  const now = new Date();
  let current = new Date(now);

  const minutes = parseField(parts.minute, 0, 59);
  const hours = parseField(parts.hour, 0, 23);
  const daysOfMonth = parseField(parts.dayOfMonth, 1, 31);
  const months = parseField(parts.month, 1, 12);
  const daysOfWeek = parseField(parts.dayOfWeek, 0, 6);

  // Simple implementation - check each minute for the next year
  const maxIterations = 60 * 24 * 365;
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    current = new Date(current.getTime() + 60000); // Add 1 minute
    iterations++;

    const min = current.getMinutes();
    const hr = current.getHours();
    const dom = current.getDate();
    const mon = current.getMonth() + 1;
    const dow = current.getDay();

    if (
      minutes.includes(min) &&
      hours.includes(hr) &&
      months.includes(mon) &&
      (daysOfMonth.includes(dom) || daysOfWeek.includes(dow))
    ) {
      runs.push(new Date(current));
    }
  }

  return runs;
}

function parseCron(expr: string, locale: string): ParsedCron {
  const fields = expr.trim().split(/\s+/);

  if (fields.length !== 5) {
    throw new Error('Invalid cron expression');
  }

  const parts: CronParts = {
    minute: fields[0],
    hour: fields[1],
    dayOfMonth: fields[2],
    month: fields[3],
    dayOfWeek: fields[4],
  };

  // Validate fields
  parseField(parts.minute, 0, 59);
  parseField(parts.hour, 0, 23);
  parseField(parts.dayOfMonth, 1, 31);
  parseField(parts.month, 1, 12);
  parseField(parts.dayOfWeek, 0, 6);

  // Generate human-readable description
  const descParts: string[] = [];

  if (parts.minute === '*' && parts.hour === '*') {
    descParts.push(locale === 'ru' ? 'Каждую минуту' : 'Every minute');
  } else if (parts.minute.startsWith('*/')) {
    descParts.push(locale === 'ru'
      ? `Каждые ${parts.minute.slice(2)} минут`
      : `Every ${parts.minute.slice(2)} minutes`);
  } else if (parts.minute === '0' && parts.hour === '*') {
    descParts.push(locale === 'ru' ? 'Каждый час' : 'Every hour');
  } else {
    const minDesc = describePart(parts.minute, 'minute', locale);
    const hourDesc = describePart(parts.hour, 'hour', locale);
    descParts.push(locale === 'ru'
      ? `В ${hourDesc}:${minDesc.padStart(2, '0')}`
      : `At ${hourDesc}:${minDesc.padStart(2, '0')}`);
  }

  if (parts.dayOfMonth !== '*' || parts.month !== '*') {
    const domDesc = describePart(parts.dayOfMonth, 'dayOfMonth', locale);
    const monDesc = describePart(parts.month, 'month', locale);
    descParts.push(locale === 'ru'
      ? `${domDesc} ${monDesc}`
      : `on ${domDesc} ${monDesc}`);
  }

  if (parts.dayOfWeek !== '*') {
    const dowDesc = describePart(parts.dayOfWeek, 'dayOfWeek', locale);
    descParts.push(locale === 'ru' ? `в ${dowDesc}` : `on ${dowDesc}`);
  }

  return {
    parts,
    description: descParts.join(' '),
    nextRuns: getNextRuns(parts, 5),
  };
}

export function CronParser() {
  const { locale } = useI18n();
  const t = getCronParserTranslations(locale);

  const [input, setInput] = useState('');
  const [result, setResult] = useState<ParsedCron | null>(null);

  const handleParse = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const parsed = parseCron(input, locale);
      setResult(parsed);
      toast.success(t.parsedSuccess);
    } catch {
      toast.error(t.invalidCron);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handlePreset = (expr: string) => {
    setInput(expr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
        />

        <div className="flex gap-2">
          <button
            onClick={handleParse}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.parseButton}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-6">
          {/* Human Readable */}
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.humanReadable}</h4>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <p className="text-xl text-hub-accent">{result.description}</p>
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.breakdown}</h4>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: t.minute, value: result.parts.minute },
                { label: t.hour, value: result.parts.hour },
                { label: t.dayOfMonth, value: result.parts.dayOfMonth },
                { label: t.month, value: result.parts.month },
                { label: t.dayOfWeek, value: result.parts.dayOfWeek },
              ].map(({ label, value }, i) => (
                <div key={i} className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
                  <div className="text-xs text-hub-muted mb-1">{label}</div>
                  <div className="font-mono text-hub-accent">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Runs */}
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.nextRuns}</h4>
            <div className="bg-hub-darker border border-hub-border rounded-lg divide-y divide-hub-border">
              {result.nextRuns.map((date, i) => (
                <div key={i} className="p-3 font-mono text-sm flex items-center justify-between">
                  <span>{formatDate(date)}</span>
                  <button
                    onClick={() => handleCopy(date.toISOString())}
                    className="text-hub-accent hover:text-hub-accent-dim text-xs"
                  >
                    {t.copyButton}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Common Expressions */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.commonExpressions}</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON_EXPRESSIONS.map(({ expr, desc }) => (
            <button
              key={expr}
              onClick={() => handlePreset(expr)}
              className="p-3 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-left"
            >
              <div className="font-mono text-hub-accent text-sm">{expr}</div>
              <div className="text-xs text-gray-400 mt-1">{desc}</div>
            </button>
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
