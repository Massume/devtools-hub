'use client';

import { useState } from 'react';
import { Recommendation } from '@/types/plan';
import { tPg } from '@/lib/i18n-pg';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  locale: 'en' | 'ru';
  onJumpToNode: (nodeId: string) => void;
}

export function RecommendationCard({ recommendation, index, locale, onJumpToNode }: RecommendationCardProps) {
  const [copied, setCopied] = useState(false);

  const severityConfig = {
    critical: {
      icon: '🔴',
      badge: 'bg-hub-error/20 text-hub-error',
      border: 'border-hub-error/30',
      bg: 'bg-hub-error/5',
    },
    warning: {
      icon: '🟡',
      badge: 'bg-hub-warning/20 text-hub-warning',
      border: 'border-hub-warning/30',
      bg: 'bg-hub-warning/5',
    },
    info: {
      icon: '🔵',
      badge: 'bg-hub-accent/20 text-hub-accent',
      border: 'border-hub-accent/30',
      bg: 'bg-hub-accent/5',
    },
  };

  const config = severityConfig[recommendation.severity];
  const title = locale === 'ru' ? recommendation.title : recommendation.titleEn;
  const issue = locale === 'ru' ? recommendation.issue : recommendation.issueEn;
  const explanation = locale === 'ru' ? recommendation.explanation : recommendation.explanationEn;
  const suggestion = locale === 'ru' ? recommendation.suggestion : recommendation.suggestionEn;

  const handleCopySQL = async () => {
    if (recommendation.sql) {
      await navigator.clipboard.writeText(recommendation.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJumpToNode = () => {
    if (recommendation.nodeId) {
      onJumpToNode(recommendation.nodeId);
      // Scroll to plan tree
      document.getElementById('plan-tree')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`
        opacity-0 animate-slide-up
        p-5 rounded-xl border ${config.border} ${config.bg}
        transition-all duration-300 hover:scale-[1.01]
      `}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badge}`}>
          {tPg(`severity${recommendation.severity.charAt(0).toUpperCase() + recommendation.severity.slice(1)}` as any, locale)}
        </span>
      </div>

      {/* Issue */}
      <p className="text-white mb-3">{issue}</p>

      {/* Explanation */}
      <div className="p-3 bg-hub-dark/50 rounded-lg mb-3">
        <p className="text-sm text-hub-muted">{explanation}</p>
      </div>

      {/* Suggestion */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-hub-accent">💡</span>
        <p className="text-sm text-white">{suggestion}</p>
      </div>

      {/* SQL */}
      {recommendation.sql && (
        <div className="relative">
          <pre className="p-3 bg-hub-darker rounded-lg text-sm font-mono text-hub-accent overflow-x-auto">
            {recommendation.sql}
          </pre>
          <button
            onClick={handleCopySQL}
            className="absolute top-2 right-2 px-2 py-1 bg-hub-card text-xs text-hub-muted hover:text-white border border-hub-border rounded transition-colors"
          >
            {copied ? tPg('copied', locale) : tPg('copySQL', locale)}
          </button>
        </div>
      )}

      {/* Jump to node */}
      {recommendation.nodeId && (
        <button
          onClick={handleJumpToNode}
          className="mt-3 text-sm text-hub-accent hover:underline"
        >
          {locale === 'ru' ? '→ Показать в плане' : '→ Show in plan'}
        </button>
      )}
    </div>
  );
}

export function RecommendationsList({
  recommendations,
  locale,
  onJumpToNode,
}: {
  recommendations: Recommendation[];
  locale: 'en' | 'ru';
  onJumpToNode: (nodeId: string) => void;
}) {
  if (recommendations.length === 0) {
    return (
      <div className="p-8 bg-hub-card border border-hub-accent/30 rounded-xl text-center">
        <span className="text-4xl mb-4 block">✨</span>
        <p className="text-hub-accent font-medium">{tPg('noRecommendations', locale)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-white text-lg">{tPg('recommendations', locale)}</h2>
      {recommendations.map((rec, index) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          index={index}
          locale={locale}
          onJumpToNode={onJumpToNode}
        />
      ))}
    </div>
  );
}
