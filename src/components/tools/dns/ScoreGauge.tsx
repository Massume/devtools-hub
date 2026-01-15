'use client';

import { translations as dnsTranslations, Locale } from '@/lib/i18n-dns';
import { useI18n } from '@/lib/i18n-context';

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
}

export function ScoreGauge({ score, maxScore }: ScoreGaugeProps) {
  const { locale } = useI18n();
  const dnsLocale = locale as Locale;
  const t = dnsTranslations[dnsLocale];
  const percentage = Math.round((score / maxScore) * 100);

  const getColor = () => {
    if (percentage >= 80) return { text: 'text-hub-accent', bg: 'bg-hub-accent', glow: 'glow-accent' };
    if (percentage >= 50) return { text: 'text-hub-warning', bg: 'bg-hub-warning', glow: 'glow-warning' };
    return { text: 'text-hub-error', bg: 'bg-hub-error', glow: 'glow-error' };
  };

  const getLabel = () => {
    if (percentage >= 90) return t.excellent;
    if (percentage >= 80) return t.good;
    if (percentage >= 60) return t.normal;
    if (percentage >= 40) return t.needsAttention;
    return t.critical;
  };

  const color = getColor();

  return (
    <div className="text-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      {/* Score circle */}
      <div className={`
        relative inline-flex items-center justify-center
        w-32 h-32 sm:w-40 sm:h-40
        rounded-full border-4 ${color.bg}/20 border-${color.bg}
        ${color.glow}
      `}>
        <div className="text-center">
          <div className={`text-4xl sm:text-5xl font-bold ${color.text}`}>
            {percentage}
          </div>
          <div className="text-sm text-hub-muted">{t.outOf} 100</div>
        </div>

        {/* Animated ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-hub-border"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={color.text}
            strokeDasharray={`${percentage * 2.89} 289`}
            style={{
              transition: 'stroke-dasharray 1s ease-out',
            }}
          />
        </svg>
      </div>

      {/* Label */}
      <div className={`mt-4 text-xl font-semibold ${color.text}`}>
        {getLabel()}
      </div>
      <div className="text-sm text-hub-muted mt-1">
        {score} {t.outOf} {maxScore} {t.points}
      </div>
    </div>
  );
}
