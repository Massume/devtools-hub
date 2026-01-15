'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getLeapYearTranslations } from '@/lib/i18n-leap-year';
import toast from 'react-hot-toast';

interface YearResult {
  year: number;
  isLeap: boolean;
  divisibleBy4: boolean;
  divisibleBy100: boolean;
  divisibleBy400: boolean;
  daysInYear: number;
  daysInFebruary: number;
}

interface NearbyYears {
  previous: number;
  next: number;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function checkYear(year: number): YearResult {
  const isLeap = isLeapYear(year);
  return {
    year,
    isLeap,
    divisibleBy4: year % 4 === 0,
    divisibleBy100: year % 100 === 0,
    divisibleBy400: year % 400 === 0,
    daysInYear: isLeap ? 366 : 365,
    daysInFebruary: isLeap ? 29 : 28,
  };
}

function getNearbyLeapYears(year: number): NearbyYears {
  let previous = year - 1;
  let next = year + 1;

  while (!isLeapYear(previous)) previous--;
  while (!isLeapYear(next)) next++;

  return { previous, next };
}

function getLeapYearsInRange(from: number, to: number): number[] {
  const years: number[] = [];
  for (let y = from; y <= to; y++) {
    if (isLeapYear(y)) years.push(y);
  }
  return years;
}

export function LeapYear() {
  const { locale } = useI18n();
  const t = getLeapYearTranslations(locale);

  const [inputYear, setInputYear] = useState('');
  const [result, setResult] = useState<YearResult | null>(null);
  const [rangeFrom, setRangeFrom] = useState('2000');
  const [rangeTo, setRangeTo] = useState('2100');
  const [showRange, setShowRange] = useState(false);

  const nearbyYears = useMemo(() => {
    if (!result) return null;
    return getNearbyLeapYears(result.year);
  }, [result]);

  const rangeYears = useMemo(() => {
    if (!showRange) return [];
    const from = parseInt(rangeFrom, 10);
    const to = parseInt(rangeTo, 10);
    if (isNaN(from) || isNaN(to) || from > to) return [];
    return getLeapYearsInRange(from, to);
  }, [showRange, rangeFrom, rangeTo]);

  const handleCheck = () => {
    if (!inputYear.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    const year = parseInt(inputYear, 10);
    if (isNaN(year)) {
      toast.error(t.invalidYear);
      return;
    }

    setResult(checkYear(year));
    toast.success(t.checkedSuccess);
  };

  const handleClear = () => {
    setInputYear('');
    setResult(null);
  };

  const handleCurrentYear = () => {
    const year = new Date().getFullYear();
    setInputYear(year.toString());
  };

  const handleYearClick = (year: number) => {
    setInputYear(year.toString());
    setResult(checkYear(year));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-semibold">{t.inputYear}</label>
          <button
            onClick={handleCurrentYear}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.currentYearButton}
          </button>
        </div>

        <input
          type="number"
          value={inputYear}
          onChange={(e) => setInputYear(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg p-4 text-2xl font-mono text-center focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />

        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
          >
            {t.checkButton}
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
        <div className="space-y-6">
          {/* Main Result */}
          <div
            className={`border rounded-xl p-6 text-center ${
              result.isLeap
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="text-4xl font-bold mb-2">{result.year}</div>
            <div
              className={`text-xl font-medium ${result.isLeap ? 'text-green-400' : 'text-red-400'}`}
            >
              {result.isLeap ? t.isLeapYear : t.isNotLeapYear}
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm text-hub-muted">
              <span>
                {t.daysInYear}: <span className="text-white font-medium">{result.daysInYear}</span>
              </span>
              <span>
                {t.daysInFebruary}: <span className="text-white font-medium">{result.daysInFebruary}</span>
              </span>
            </div>
          </div>

          {/* Rule Check */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t.ruleResult}</h3>
            <div className="space-y-3">
              {[
                { label: t.divisibleBy4, value: result.divisibleBy4 },
                { label: t.divisibleBy100, value: result.divisibleBy100 },
                { label: t.divisibleBy400, value: result.divisibleBy400 },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex items-center justify-between bg-hub-darker border border-hub-border rounded-lg p-3">
                  <span>{label}</span>
                  <span
                    className={`font-medium ${value ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {value ? t.yes : t.no}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules Explanation */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t.leapYearRules}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-hub-accent">1.</span>
                <span>{t.rule1}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-hub-accent">2.</span>
                <span>{t.rule2}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-hub-accent">3.</span>
                <span>{t.rule3}</span>
              </div>
            </div>
          </div>

          {/* Nearby Leap Years */}
          {nearbyYears && (
            <div className="bg-hub-card border border-hub-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{t.nearbyLeapYears}</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleYearClick(nearbyYears.previous)}
                  className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center hover:border-hub-accent transition-colors"
                >
                  <div className="text-sm text-hub-muted mb-1">{t.previous}</div>
                  <div className="text-2xl font-bold text-hub-accent">{nearbyYears.previous}</div>
                </button>
                <button
                  onClick={() => handleYearClick(nearbyYears.next)}
                  className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center hover:border-hub-accent transition-colors"
                >
                  <div className="text-sm text-hub-muted mb-1">{t.next}</div>
                  <div className="text-2xl font-bold text-hub-accent">{nearbyYears.next}</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leap Years Range */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.leapYearList}</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.fromYear}</label>
            <input
              type="number"
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-2 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.toYear}</label>
            <input
              type="number"
              value={rangeTo}
              onChange={(e) => setRangeTo(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-2 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowRange(!showRange)}
              className="w-full px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {t.showList}
            </button>
          </div>
        </div>

        {showRange && rangeYears.length > 0 && (
          <div>
            <div className="text-sm text-hub-muted mb-2">
              {rangeYears.length} {t.leapYearsFound}
            </div>
            <div
              className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-hub-darker border border-hub-border rounded-lg cursor-pointer"
              onClick={() => handleCopy(rangeYears.join(', '))}
            >
              {rangeYears.map((year) => (
                <button
                  key={year}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleYearClick(year);
                  }}
                  className="px-3 py-1 bg-hub-card border border-hub-border rounded hover:border-hub-accent transition-colors text-sm"
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
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
