'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCalendarWeekTranslations } from '@/lib/i18n-calendar-week';
import toast from 'react-hot-toast';

type Mode = 'dateToWeek' | 'weekToDate';

interface WeekResult {
  weekNumber: number;
  weekYear: number;
  weekStart: Date;
  weekEnd: Date;
  isoFormat: string;
}

function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

function getWeeksInYear(year: number): number {
  const dec31 = new Date(year, 11, 31);
  const { week } = getISOWeekNumber(dec31);
  return week === 1 ? 52 : week;
}

function getDateFromWeek(year: number, week: number): { start: Date; end: Date } {
  // Find January 4th of the year (always in week 1)
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;

  // Find Monday of week 1
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - (dayOfWeek - 1));

  // Calculate Monday of target week
  const targetMonday = new Date(week1Monday);
  targetMonday.setDate(week1Monday.getDate() + (week - 1) * 7);

  // Calculate Sunday
  const targetSunday = new Date(targetMonday);
  targetSunday.setDate(targetMonday.getDate() + 6);

  return { start: targetMonday, end: targetSunday };
}

function calculateWeekResult(date: Date): WeekResult {
  const { week, year } = getISOWeekNumber(date);
  const { start, end } = getDateFromWeek(year, week);

  return {
    weekNumber: week,
    weekYear: year,
    weekStart: start,
    weekEnd: end,
    isoFormat: `${year}-W${week.toString().padStart(2, '0')}`,
  };
}

export function CalendarWeek() {
  const { locale } = useI18n();
  const t = getCalendarWeekTranslations(locale);

  const [mode, setMode] = useState<Mode>('dateToWeek');
  const [inputDate, setInputDate] = useState('');
  const [inputYear, setInputYear] = useState(new Date().getFullYear().toString());
  const [inputWeek, setInputWeek] = useState('');
  const [result, setResult] = useState<WeekResult | null>(null);

  const handleCalculate = () => {
    if (mode === 'dateToWeek') {
      if (!inputDate) {
        toast.error(t.emptyInput);
        return;
      }

      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
        toast.error(t.invalidInput);
        return;
      }

      setResult(calculateWeekResult(date));
      toast.success(t.calculatedSuccess);
    } else {
      if (!inputYear || !inputWeek) {
        toast.error(t.emptyInput);
        return;
      }

      const year = parseInt(inputYear, 10);
      const week = parseInt(inputWeek, 10);
      const maxWeeks = getWeeksInYear(year);

      if (week < 1 || week > maxWeeks) {
        toast.error(t.invalidWeek);
        return;
      }

      const { start, end } = getDateFromWeek(year, week);
      setResult({
        weekNumber: week,
        weekYear: year,
        weekStart: start,
        weekEnd: end,
        isoFormat: `${year}-W${week.toString().padStart(2, '0')}`,
      });
      toast.success(t.calculatedSuccess);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setInputDate(today.toISOString().split('T')[0]);
    setMode('dateToWeek');
  };

  const handleThisWeek = () => {
    const { week, year } = getISOWeekNumber(new Date());
    setInputYear(year.toString());
    setInputWeek(week.toString());
    setMode('weekToDate');
  };

  const handleClear = () => {
    setInputDate('');
    setInputWeek('');
    setResult(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentWeek = getISOWeekNumber(new Date());
  const weeksInCurrentYear = getWeeksInYear(parseInt(inputYear, 10) || new Date().getFullYear());

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('dateToWeek')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'dateToWeek'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.dateToWeek}
          </button>
          <button
            onClick={() => setMode('weekToDate')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'weekToDate'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.weekToDate}
          </button>
        </div>
      </div>

      {/* Current Week Info */}
      <div className="bg-hub-darker border border-hub-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-hub-muted">{t.currentWeekInfo}:</span>
          <span className="text-hub-accent font-mono font-bold">
            {t.weekNumber} {currentWeek.week} {t.weekOfYear} {getWeeksInYear(currentWeek.year)}
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        {mode === 'dateToWeek' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.inputDate}</label>
              <button
                onClick={handleToday}
                className="px-2 py-1 text-xs bg-hub-darker border border-hub-border rounded hover:border-hub-accent transition-colors"
              >
                {t.todayButton}
              </button>
            </div>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputYear}</label>
              <input
                type="number"
                value={inputYear}
                onChange={(e) => setInputYear(e.target.value)}
                min="1"
                className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.inputWeek}</label>
                <button
                  onClick={handleThisWeek}
                  className="px-2 py-1 text-xs bg-hub-darker border border-hub-border rounded hover:border-hub-accent transition-colors"
                >
                  {t.thisWeekButton}
                </button>
              </div>
              <input
                type="number"
                value={inputWeek}
                onChange={(e) => setInputWeek(e.target.value)}
                min="1"
                max={weeksInCurrentYear}
                placeholder={`1-${weeksInCurrentYear}`}
                className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.calculateButton}
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
          <h3 className="text-lg font-semibold">{t.result}</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.weekNumber}</div>
              <div className="text-3xl font-bold text-hub-accent">
                {result.weekNumber}
                <span className="text-lg text-hub-muted ml-2">
                  {t.weekOfYear} {getWeeksInYear(result.weekYear)}
                </span>
              </div>
            </div>
            <div
              className="bg-hub-darker border border-hub-border rounded-lg p-4 cursor-pointer hover:border-hub-accent transition-colors"
              onClick={() => handleCopy(result.isoFormat)}
            >
              <div className="text-sm text-hub-muted mb-1">{t.isoWeekFormat}</div>
              <div className="text-2xl font-mono text-hub-accent">{result.isoFormat}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.weekStart}</div>
              <div className="text-lg">{formatDate(result.weekStart)}</div>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <div className="text-sm text-hub-muted mb-1">{t.weekEnd}</div>
              <div className="text-lg">{formatDate(result.weekEnd)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Year Overview */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.yearOverview}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-hub-accent">{weeksInCurrentYear}</div>
            <div className="text-sm text-hub-muted">{t.weeksTotal}</div>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
            <div className="text-sm text-hub-muted mb-1">{t.firstWeekStart}</div>
            <div className="text-sm">
              {formatDate(getDateFromWeek(parseInt(inputYear, 10) || new Date().getFullYear(), 1).start)}
            </div>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
            <div className="text-sm text-hub-muted mb-1">{t.lastWeekEnd}</div>
            <div className="text-sm">
              {formatDate(
                getDateFromWeek(parseInt(inputYear, 10) || new Date().getFullYear(), weeksInCurrentYear).end
              )}
            </div>
          </div>
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
