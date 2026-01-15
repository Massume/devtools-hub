'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getWorkingDaysTranslations } from '@/lib/i18n-working-days';
import toast from 'react-hot-toast';

type Mode = 'calculate' | 'add';

interface CalcResult {
  workingDays: number;
  calendarDays: number;
  weekends: number;
  weeks: number;
}

interface AddResult {
  resultDate: Date;
}

function isWeekend(date: Date, excludeSat: boolean, excludeSun: boolean): boolean {
  const day = date.getDay();
  return (excludeSat && day === 6) || (excludeSun && day === 0);
}

function calculateWorkingDays(
  start: Date,
  end: Date,
  excludeSat: boolean,
  excludeSun: boolean
): CalcResult {
  const calendarDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let workingDays = 0;
  let weekends = 0;
  const current = new Date(start);

  while (current <= end) {
    if (isWeekend(current, excludeSat, excludeSun)) {
      weekends++;
    } else {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    workingDays,
    calendarDays,
    weekends,
    weeks: Math.floor(calendarDays / 7),
  };
}

function addWorkingDays(
  start: Date,
  daysToAdd: number,
  excludeSat: boolean,
  excludeSun: boolean
): AddResult {
  const result = new Date(start);
  let added = 0;

  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result, excludeSat, excludeSun)) {
      added++;
    }
  }

  return { resultDate: result };
}

export function WorkingDays() {
  const { locale } = useI18n();
  const t = getWorkingDaysTranslations(locale);

  const [mode, setMode] = useState<Mode>('calculate');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysToAdd, setDaysToAdd] = useState('');
  const [excludeSat, setExcludeSat] = useState(true);
  const [excludeSun, setExcludeSun] = useState(true);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [addResult, setAddResult] = useState<AddResult | null>(null);

  const handleCalculate = () => {
    if (mode === 'calculate') {
      if (!startDate || !endDate) {
        toast.error(t.emptyInput);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        toast.error(t.startAfterEnd);
        return;
      }

      const result = calculateWorkingDays(start, end, excludeSat, excludeSun);
      setCalcResult(result);
      setAddResult(null);
      toast.success(t.calculatedSuccess);
    } else {
      if (!startDate || !daysToAdd) {
        toast.error(t.emptyInput);
        return;
      }

      const start = new Date(startDate);
      const days = parseInt(daysToAdd, 10);

      if (isNaN(days) || days < 0) {
        toast.error(t.invalidDates);
        return;
      }

      const result = addWorkingDays(start, days, excludeSat, excludeSun);
      setAddResult(result);
      setCalcResult(null);
      toast.success(t.calculatedSuccess);
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
    setDaysToAdd('');
    setCalcResult(null);
    setAddResult(null);
  };

  const handleQuickRange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 1); // Monday
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Sunday
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('calculate')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'calculate'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.modeCalculate}
          </button>
          <button
            onClick={() => setMode('add')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'add'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.modeAdd}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        {mode === 'calculate' ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.startDate}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.endDate}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
                />
              </div>
            </div>

            {/* Quick Ranges */}
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.quickRanges}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'week', label: t.thisWeek },
                  { key: 'month', label: t.thisMonth },
                  { key: 'quarter', label: t.thisQuarter },
                  { key: 'year', label: t.thisYear },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleQuickRange(key as 'week' | 'month' | 'quarter' | 'year')}
                    className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.startDate}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.addDaysLabel}</label>
              <input
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(e.target.value)}
                placeholder={t.addDaysPlaceholder}
                min="0"
                className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Weekend Options */}
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.excludeWeekends}</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSat}
                onChange={(e) => setExcludeSat(e.target.checked)}
                className="w-4 h-4 rounded border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
              />
              <span>{t.saturday}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSun}
                onChange={(e) => setExcludeSun(e.target.checked)}
                className="w-4 h-4 rounded border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent"
              />
              <span>{t.sunday}</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.calculateButton}
          </button>
          {mode === 'calculate' && (
            <button
              onClick={handleSwap}
              className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.swapButton}
            </button>
          )}
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.clearButton}
          </button>
        </div>
      </div>

      {/* Calculate Result */}
      {calcResult && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{t.result}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-hub-accent">{calcResult.workingDays}</div>
              <div className="text-sm text-hub-muted">{t.workingDays}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{calcResult.calendarDays}</div>
              <div className="text-sm text-hub-muted">{t.calendarDays}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{calcResult.weekends}</div>
              <div className="text-sm text-hub-muted">{t.weekends}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{calcResult.weeks}</div>
              <div className="text-sm text-hub-muted">{t.weeks}</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Result */}
      {addResult && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{t.resultDate}</h3>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <div className="text-2xl text-hub-accent font-medium">{formatDate(addResult.resultDate)}</div>
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
