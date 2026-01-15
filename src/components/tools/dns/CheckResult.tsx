'use client';

import { DNSCheck, CheckStatus } from '@/types/dns';
import { translations as dnsTranslations, Locale } from '@/lib/i18n-dns';
import { useI18n } from '@/lib/i18n-context';

interface CheckResultProps {
  check: DNSCheck;
  index: number;
}

const statusConfig: Record<CheckStatus, { icon: string; color: string; bgColor: string; borderColor: string }> = {
  pass: {
    icon: '✓',
    color: 'text-hub-accent',
    bgColor: 'bg-hub-accent/10',
    borderColor: 'border-hub-accent/30',
  },
  warning: {
    icon: '⚠',
    color: 'text-hub-warning',
    bgColor: 'bg-hub-warning/10',
    borderColor: 'border-hub-warning/30',
  },
  fail: {
    icon: '✗',
    color: 'text-hub-error',
    bgColor: 'bg-hub-error/10',
    borderColor: 'border-hub-error/30',
  },
  info: {
    icon: 'ℹ',
    color: 'text-hub-muted',
    bgColor: 'bg-hub-muted/10',
    borderColor: 'border-hub-muted/30',
  },
};

export function CheckResult({ check, index }: CheckResultProps) {
  const { locale } = useI18n();
  const dnsLocale = locale as Locale;
  const t = dnsTranslations[dnsLocale];
  const config = statusConfig[check.status];

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case 'pass': return t.statusOk;
      case 'warning': return t.statusWarning;
      case 'fail': return t.statusFail;
      case 'info': return t.statusInfo;
    }
  };

  return (
    <div
      className={`
        opacity-0 animate-slide-up
        p-4 sm:p-5 rounded-lg border
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 hover:scale-[1.01]
      `}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className={`text-xl ${config.color}`}>{config.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{check.name}</h3>
        </div>
        <span className={`
          px-2 py-0.5 rounded text-xs font-medium uppercase
          ${config.bgColor} ${config.color} border ${config.borderColor}
        `}>
          {getStatusLabel(check.status)}
        </span>
      </div>

      {/* Value */}
      {check.value && (
        <div className="mb-3 p-3 bg-hub-darker/50 rounded border border-hub-border overflow-x-auto">
          <code className="text-sm text-hub-muted break-all">
            {Array.isArray(check.value)
              ? check.value.map((v, i) => (
                  <div key={i} className="py-0.5">{v}</div>
                ))
              : check.value
            }
          </code>
        </div>
      )}

      {/* Explanation */}
      <p className="text-sm text-gray-300 leading-relaxed">
        {check.explanation}
      </p>

      {/* Recommendation */}
      {check.recommendation && (
        <div className={`mt-3 p-3 rounded border-l-2 ${config.borderColor} bg-hub-darker/30`}>
          <p className="text-sm text-hub-muted">
            <span className="font-medium text-white">{t.recommendation} </span>
            {check.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
