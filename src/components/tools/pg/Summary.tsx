'use client';

import { PlanSummary } from '@/types/plan';
import { tPg } from '@/lib/i18n-pg';

interface SummaryProps {
  summary: PlanSummary;
  locale: 'en' | 'ru';
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-hub-accent';
  if (accuracy >= 50) return 'text-hub-warning';
  return 'text-hub-error';
}

export function Summary({ summary, locale }: SummaryProps) {
  const stats = [
    {
      label: tPg('executionTime', locale),
      value: formatTime(summary.executionTime),
      icon: '⏱',
    },
    ...(summary.planningTime !== undefined ? [{
      label: tPg('planningTime', locale),
      value: formatTime(summary.planningTime),
      icon: '📋',
    }] : []),
    {
      label: tPg('rowsProcessed', locale),
      value: summary.totalRows.toLocaleString(),
      icon: '📊',
    },
    {
      label: tPg('estimationAccuracy', locale),
      value: `${summary.estimationAccuracy}%`,
      icon: '🎯',
      colorClass: getAccuracyColor(summary.estimationAccuracy),
    },
  ];

  return (
    <div className="bg-hub-card border border-hub-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-hub-border">
        <h2 className="font-semibold text-white">{tPg('resultsFor', locale)}</h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-semibold ${stat.colorClass || 'text-white'}`}>
              {stat.value}
            </div>
            <div className="text-xs text-hub-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top operations */}
      {summary.topOperations.length > 0 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm text-hub-muted mb-2">
            {locale === 'ru' ? 'Распределение времени' : 'Time distribution'}
          </h3>
          <div className="space-y-2">
            {summary.topOperations.slice(0, 4).map((op, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-hub-muted w-24 truncate">{op.nodeType}</span>
                <div className="flex-1 h-2 bg-hub-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-hub-accent' :
                      index === 1 ? 'bg-purple-500' :
                      index === 2 ? 'bg-hub-warning' : 'bg-hub-muted'
                    }`}
                    style={{ width: `${Math.min(op.percentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-hub-muted w-12 text-right">
                  {op.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {(summary.hasSeqScans || summary.hasEstimationErrors) && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {summary.hasSeqScans && (
            <span className="px-2 py-1 bg-hub-warning/10 text-hub-warning text-xs rounded">
              {locale === 'ru' ? '⚠️ Есть Seq Scan' : '⚠️ Has Seq Scan'}
            </span>
          )}
          {summary.hasEstimationErrors && (
            <span className="px-2 py-1 bg-hub-error/10 text-hub-error text-xs rounded">
              {locale === 'ru' ? '⚠️ Ошибки оценки' : '⚠️ Estimation errors'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
