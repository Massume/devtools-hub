'use client';

import { useState } from 'react';
import { tPg } from '@/lib/i18n-pg';
import { examplePlanJSON } from '@/lib/examples';

interface PlanInputProps {
  inputPlan: string;
  setInputPlan: (plan: string) => void;
  onAnalyze: (plan: string) => void;
  onClear: () => void;
  isLoading: boolean;
  locale: 'en' | 'ru';
}

export function PlanInput({ inputPlan, setInputPlan, onAnalyze, onClear, isLoading, locale }: PlanInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPlan.trim() && !isLoading) {
      onAnalyze(inputPlan.trim());
    }
  };

  const handleLoadExample = () => {
    setInputPlan(examplePlanJSON);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative rounded-xl transition-all duration-300 ${
        isFocused ? 'ring-2 ring-hub-accent/50' : ''
      }`}>
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-hub-accent/20 via-purple-500/20 to-hub-accent/20 rounded-xl blur-lg transition-opacity ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Input area */}
        <div className="relative bg-hub-card border border-hub-border rounded-xl overflow-hidden">
          <textarea
            value={inputPlan}
            onChange={(e) => setInputPlan(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={tPg('inputPlaceholder', locale)}
            disabled={isLoading}
            rows={12}
            className="w-full px-4 py-4 bg-transparent text-white font-mono text-sm placeholder:text-hub-muted/50 focus:outline-none disabled:opacity-50 resize-y min-h-[200px]"
          />

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-hub-dark/50 border-t border-hub-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadExample}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm text-hub-muted hover:text-hub-accent border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50"
              >
                {tPg('exampleButton', locale)}
              </button>
              {inputPlan && (
                <button
                  type="button"
                  onClick={onClear}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm text-hub-muted hover:text-hub-error border border-hub-border rounded-lg hover:border-hub-error/50 transition-colors disabled:opacity-50"
                >
                  {tPg('clearButton', locale)}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputPlan.trim() || isLoading}
              className="px-6 py-2 bg-hub-accent text-hub-dark font-medium rounded-lg hover:bg-hub-accent-dim transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{tPg('analyzing', locale)}</span>
                </>
              ) : (
                <>
                  <span>{tPg('analyzeButton', locale)}</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hints */}
      <p className="mt-3 text-xs text-hub-muted text-center">
        {locale === 'ru'
          ? 'Поддерживается JSON и TEXT формат EXPLAIN'
          : 'Supports JSON and TEXT EXPLAIN format'
        }
      </p>
    </form>
  );
}
