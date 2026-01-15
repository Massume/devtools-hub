'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getAgeCalcTranslations } from '@/lib/i18n-age-calc';
import toast from 'react-hot-toast';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthday: number;
  dayOfWeek: string;
  zodiacSign: string;
  chineseZodiac: string;
}

const ZODIAC_SIGNS = [
  { name: { en: 'Capricorn', ru: 'Козерог' }, start: [1, 1], end: [1, 19] },
  { name: { en: 'Aquarius', ru: 'Водолей' }, start: [1, 20], end: [2, 18] },
  { name: { en: 'Pisces', ru: 'Рыбы' }, start: [2, 19], end: [3, 20] },
  { name: { en: 'Aries', ru: 'Овен' }, start: [3, 21], end: [4, 19] },
  { name: { en: 'Taurus', ru: 'Телец' }, start: [4, 20], end: [5, 20] },
  { name: { en: 'Gemini', ru: 'Близнецы' }, start: [5, 21], end: [6, 20] },
  { name: { en: 'Cancer', ru: 'Рак' }, start: [6, 21], end: [7, 22] },
  { name: { en: 'Leo', ru: 'Лев' }, start: [7, 23], end: [8, 22] },
  { name: { en: 'Virgo', ru: 'Дева' }, start: [8, 23], end: [9, 22] },
  { name: { en: 'Libra', ru: 'Весы' }, start: [9, 23], end: [10, 22] },
  { name: { en: 'Scorpio', ru: 'Скорпион' }, start: [10, 23], end: [11, 21] },
  { name: { en: 'Sagittarius', ru: 'Стрелец' }, start: [11, 22], end: [12, 21] },
  { name: { en: 'Capricorn', ru: 'Козерог' }, start: [12, 22], end: [12, 31] },
];

const CHINESE_ZODIAC = [
  { en: 'Rat', ru: 'Крыса' },
  { en: 'Ox', ru: 'Бык' },
  { en: 'Tiger', ru: 'Тигр' },
  { en: 'Rabbit', ru: 'Кролик' },
  { en: 'Dragon', ru: 'Дракон' },
  { en: 'Snake', ru: 'Змея' },
  { en: 'Horse', ru: 'Лошадь' },
  { en: 'Goat', ru: 'Коза' },
  { en: 'Monkey', ru: 'Обезьяна' },
  { en: 'Rooster', ru: 'Петух' },
  { en: 'Dog', ru: 'Собака' },
  { en: 'Pig', ru: 'Свинья' },
];

function getZodiacSign(date: Date, locale: string): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth === endMonth && month === startMonth && day >= startDay && day <= endDay)
    ) {
      return sign.name[locale as 'en' | 'ru'];
    }
  }

  return ZODIAC_SIGNS[0].name[locale as 'en' | 'ru'];
}

function getChineseZodiac(year: number, locale: string): string {
  const index = (year - 4) % 12;
  return CHINESE_ZODIAC[index][locale as 'en' | 'ru'];
}

function calculateAge(birthDate: Date, targetDate: Date, locale: string): AgeResult {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Next birthday
  let nextBirthday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday <= targetDate) {
    nextBirthday = new Date(targetDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  const dayOfWeek = birthDate.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    nextBirthday: daysUntilBirthday,
    dayOfWeek,
    zodiacSign: getZodiacSign(birthDate, locale),
    chineseZodiac: getChineseZodiac(birthDate.getFullYear(), locale),
  };
}

export function AgeCalc() {
  const { locale } = useI18n();
  const t = getAgeCalcTranslations(locale);

  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);

  const handleCalculate = () => {
    if (!birthDate) {
      toast.error(t.emptyInput);
      return;
    }

    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();

    if (isNaN(birth.getTime())) {
      toast.error(t.invalidDate);
      return;
    }

    if (birth > target) {
      toast.error(t.futureDate);
      return;
    }

    const ageResult = calculateAge(birth, target, locale);
    setResult(ageResult);
    toast.success(t.calculatedSuccess);
  };

  const handleClear = () => {
    setBirthDate('');
    setTargetDate('');
    setResult(null);
  };

  const handleToday = () => {
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.birthDate}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.targetDate}</label>
              <button
                onClick={handleToday}
                className="px-2 py-1 text-xs bg-hub-darker border border-hub-border rounded hover:border-hub-accent transition-colors"
              >
                {t.todayButton}
              </button>
            </div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder={t.targetDateHint}
              className="w-full bg-hub-darker border border-hub-border rounded-lg p-3 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
            />
            <p className="text-xs text-hub-muted mt-1">{t.targetDateHint}</p>
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
          {/* Main Age */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t.result}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-hub-accent">{result.years}</div>
                <div className="text-sm text-hub-muted">{t.years}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-hub-accent">{result.months}</div>
                <div className="text-sm text-hub-muted">{t.months}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-hub-accent">{result.days}</div>
                <div className="text-sm text-hub-muted">{t.days}</div>
              </div>
            </div>
          </div>

          {/* Total Stats */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-hub-accent">{result.totalDays.toLocaleString()}</div>
                <div className="text-xs text-hub-muted">{t.ageInDays}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-hub-accent">{result.totalWeeks.toLocaleString()}</div>
                <div className="text-xs text-hub-muted">{t.ageInWeeks}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-hub-accent">{result.totalMonths.toLocaleString()}</div>
                <div className="text-xs text-hub-muted">{t.ageInMonths}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-hub-accent">{result.totalHours.toLocaleString()}</div>
                <div className="text-xs text-hub-muted">{t.ageInHours}</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.nextBirthday}</div>
                <div className="text-xl text-hub-accent">
                  {result.nextBirthday === 0 ? t.birthdayToday : `${result.nextBirthday} ${t.daysUntil}`}
                </div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.bornOn}</div>
                <div className="text-lg">{formatDate(birthDate)}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.zodiacSign}</div>
                <div className="text-xl text-hub-accent">{result.zodiacSign}</div>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.chineseZodiac}</div>
                <div className="text-xl text-hub-accent">{result.chineseZodiac}</div>
              </div>
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
