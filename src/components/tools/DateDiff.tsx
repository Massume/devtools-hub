'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDateDiffTranslations } from '@/lib/i18n-date-diff';
import toast from 'react-hot-toast';

interface DateDifference {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

function calculateDifference(start: Date, end: Date): DateDifference {
  // Ensure start is before end
  if (start > end) {
    [start, end] = [end, start];
  }

  const diffMs = end.getTime() - start.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);

  // Calculate years, months, days breakdown
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Time components
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  if (hours < 0) {
    days--;
    hours += 24;
  }

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

export function DateDiff() {
  const { locale } = useI18n();
  const t = getDateDiffTranslations(locale);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<DateDifference | null>(null);

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error(t.invalidDates);
        return;
      }

      const diff = calculateDifference(start, end);
      setResult(diff);
      toast.success(t.calculatedSuccess);
    } catch {
      toast.error(t.invalidDates);
    }
  };

  const handleSwap = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setResult(null);
  };

  const handleToday = (field: 'start' | 'end') => {
    const now = new Date().toISOString().slice(0, 16);
    if (field === 'start') {
      setStartDate(now);
    } else {
      setEndDate(now);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.startDate}</label>
              <button
                onClick={() => handleToday('start')}
                className="text-xs text-hub-accent hover:text-hub-accent-dim"
              >
                {t.todayButton}
              </button>
            </div>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>

          {/* End Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.endDate}</label>
              <button
                onClick={() => handleToday('end')}
                className="text-xs text-hub-accent hover:text-hub-accent-dim"
              >
                {t.todayButton}
              </button>
            </div>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 font-mono focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.calculateButton}
          </button>
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors"
          >
            {t.swapButton}
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
          <h3 className="text-lg font-semibold">{t.result}</h3>

          {/* Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-3">{t.breakdown}</h4>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <p className="text-xl font-mono">
                {result.years > 0 && <span><span className="text-hub-accent">{result.years}</span> {t.years} </span>}
                {result.months > 0 && <span><span className="text-hub-accent">{result.months}</span> {t.months} </span>}
                {result.days > 0 && <span><span className="text-hub-accent">{result.days}</span> {t.days} </span>}
                {result.hours > 0 && <span><span className="text-hub-accent">{result.hours}</span> {t.hours} </span>}
                {result.minutes > 0 && <span><span className="text-hub-accent">{result.minutes}</span> {t.minutes} </span>}
                {result.seconds > 0 && <span><span className="text-hub-accent">{result.seconds}</span> {t.seconds}</span>}
              </p>
            </div>
          </div>

          {/* Totals */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.totalDays}</div>
              <div className="font-mono text-2xl text-hub-accent">{formatNumber(result.totalDays)}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.totalHours}</div>
              <div className="font-mono text-2xl text-hub-accent">{formatNumber(result.totalHours)}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.totalMinutes}</div>
              <div className="font-mono text-2xl text-hub-accent">{formatNumber(result.totalMinutes)}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.totalSeconds}</div>
              <div className="font-mono text-2xl text-hub-accent">{formatNumber(result.totalSeconds)}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.weeks}</div>
              <div className="font-mono text-xl">{formatNumber(result.weeks)}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-sm text-hub-muted mb-1">{t.months}</div>
              <div className="font-mono text-xl">{formatNumber(result.years * 12 + result.months)}</div>
            </div>
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
