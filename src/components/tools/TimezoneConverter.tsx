'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getTimezoneTranslations } from '@/lib/i18n-timezone';
import toast from 'react-hot-toast';

const POPULAR_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Moscow',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
];

const ALL_TIMEZONES = Intl.supportedValuesOf('timeZone');

function formatTimezone(tz: string): string {
  return tz.replace(/_/g, ' ').replace(/\//g, ' / ');
}

function getTimezoneOffset(tz: string, date: Date): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}

function formatOffset(hours: number): string {
  const sign = hours >= 0 ? '+' : '-';
  const absHours = Math.abs(hours);
  const h = Math.floor(absHours);
  const m = Math.round((absHours - h) * 60);
  return `UTC${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function TimezoneConverter() {
  const { locale } = useI18n();
  const t = getTimezoneTranslations(locale);

  const [sourceDate, setSourceDate] = useState('');
  const [sourceTime, setSourceTime] = useState('');
  const [sourceTz, setSourceTz] = useState('UTC');
  const [targetTz, setTargetTz] = useState('America/New_York');
  const [result, setResult] = useState<Date | null>(null);

  const timezoneOptions = useMemo(() => {
    const now = new Date();
    return ALL_TIMEZONES.map((tz) => ({
      value: tz,
      label: formatTimezone(tz),
      offset: formatOffset(getTimezoneOffset(tz, now)),
    }));
  }, []);

  const handleConvert = () => {
    if (!sourceDate || !sourceTime) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const dateTimeStr = `${sourceDate}T${sourceTime}`;
      const sourceDateTime = new Date(dateTimeStr);

      if (isNaN(sourceDateTime.getTime())) {
        toast.error(t.invalidInput);
        return;
      }

      // Create date string in source timezone, then parse to get UTC
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: sourceTz,
      };

      // Get the time in target timezone
      const targetOptions: Intl.DateTimeFormatOptions = {
        ...options,
        timeZone: targetTz,
      };

      // Calculate offset difference
      const sourceOffset = getTimezoneOffset(sourceTz, sourceDateTime);
      const targetOffset = getTimezoneOffset(targetTz, sourceDateTime);
      const diffHours = targetOffset - sourceOffset;

      const resultDate = new Date(sourceDateTime.getTime() + diffHours * 60 * 60 * 1000);
      setResult(resultDate);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidInput);
    }
  };

  const handleNow = () => {
    const now = new Date();
    setSourceDate(now.toISOString().split('T')[0]);
    setSourceTime(now.toTimeString().slice(0, 5));
    setSourceTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  };

  const handleSwap = () => {
    const temp = sourceTz;
    setSourceTz(targetTz);
    setTargetTz(temp);
    setResult(null);
  };

  const handleClear = () => {
    setSourceDate('');
    setSourceTime('');
    setResult(null);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.toISOString());
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const timeDiff = useMemo(() => {
    const now = new Date();
    const sourceOffset = getTimezoneOffset(sourceTz, now);
    const targetOffset = getTimezoneOffset(targetTz, now);
    return targetOffset - sourceOffset;
  }, [sourceTz, targetTz]);

  const formatResultDate = (date: Date) => {
    return date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.sourceTime}</h3>
          <button
            onClick={handleNow}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.nowButton}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.datePlaceholder}</label>
            <input
              type="date"
              value={sourceDate}
              onChange={(e) => setSourceDate(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.timePlaceholder}</label>
            <input
              type="time"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.sourceTimezone}</label>
            <select
              value={sourceTz}
              onChange={(e) => setSourceTz(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            >
              <optgroup label={t.popularTimezones}>
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {formatTimezone(tz)} ({formatOffset(getTimezoneOffset(tz, new Date()))})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t.allTimezones}>
                {timezoneOptions.map(({ value, label, offset }) => (
                  <option key={value} value={value}>
                    {label} ({offset})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="h-12 px-4 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors flex items-center justify-center gap-2"
          >
            <span>⇄</span>
            <span>{t.swapButton}</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.targetTimezone}</label>
          <select
            value={targetTz}
            onChange={(e) => setTargetTz(e.target.value)}
            className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          >
            <optgroup label={t.popularTimezones}>
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {formatTimezone(tz)} ({formatOffset(getTimezoneOffset(tz, new Date()))})
                </option>
              ))}
            </optgroup>
            <optgroup label={t.allTimezones}>
              {timezoneOptions.map(({ value, label, offset }) => (
                <option key={value} value={value}>
                  {label} ({offset})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Time Difference */}
        <div className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
          <span className="text-hub-muted">{t.timeDifference}: </span>
          <span className="text-hub-accent font-medium">
            {timeDiff === 0
              ? t.sameTime
              : timeDiff > 0
              ? `+${timeDiff} ${t.hoursAhead}`
              : `${timeDiff} ${t.hoursBehind}`}
          </span>
        </div>

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

      {/* Result Section */}
      {result && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.result}</h3>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-2xl text-hub-accent font-medium">{formatResultDate(result)}</div>
            <div className="text-sm text-hub-muted mt-2">{formatTimezone(targetTz)}</div>
          </div>
        </div>
      )}

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
