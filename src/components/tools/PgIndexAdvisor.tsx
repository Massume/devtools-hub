'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AnalysisResult, AnalyzeResponse } from '@/types/plan';
import { PlanInput } from './pg/PlanInput';
import { PlanTree } from './pg/PlanTree';
import { Summary } from './pg/Summary';
import { RecommendationsList } from './pg/RecommendationCard';

export function PgIndexAdvisor() {
  const { locale } = useAppStore();
  const [inputPlan, setInputPlan] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleAnalyze = async (plan: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setSelectedNodeId(null);

    try {
      const response = await fetch('/api/pg-index-advisor/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, format: 'auto' }),
      });

      const data: AnalyzeResponse = await response.json();

      if (data.success && data.data) {
        setAnalysisResult(data.data);
      } else {
        setAnalysisError(locale === 'ru' ? data.error || 'Ошибка анализа' : data.errorEn || 'Analysis error');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(
        locale === 'ru'
          ? 'Ошибка при отправке запроса'
          : 'Error sending request'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputPlan('');
    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedNodeId(null);
  };

  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  };

  const handleJumpToNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">
          PostgreSQL Index Advisor
        </h1>
        <p className="text-hub-muted text-lg">
          {locale === 'ru'
            ? 'Анализ EXPLAIN ANALYZE с рекомендациями по оптимизации'
            : 'Analyze EXPLAIN ANALYZE output and get optimization recommendations'}
        </p>
      </div>

      {/* Input Section */}
      <div>
        <PlanInput
          inputPlan={inputPlan}
          setInputPlan={setInputPlan}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          isLoading={isAnalyzing}
          locale={locale}
        />
      </div>

      {/* Error Display */}
      {analysisError && (
        <div className="p-4 bg-hub-error/10 border border-hub-error/30 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-hub-error">❌</span>
            <p className="text-hub-error">{analysisError}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysisResult && (
        <div className="space-y-6 opacity-0 animate-fade-in">
          {/* Summary */}
          <Summary summary={analysisResult.summary} locale={locale} />

          {/* Plan Tree */}
          <PlanTree
            plan={analysisResult.plan}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
            locale={locale}
          />

          {/* Recommendations */}
          <RecommendationsList
            recommendations={analysisResult.recommendations}
            locale={locale}
            onJumpToNode={handleJumpToNode}
          />
        </div>
      )}

      {/* Info Section */}
      {!analysisResult && !analysisError && !isAnalyzing && (
        <div className="p-6 bg-hub-card border border-hub-border rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">
            {locale === 'ru' ? 'Как использовать' : 'How to use'}
          </h3>
          <ol className="space-y-2 text-hub-muted text-sm list-decimal list-inside">
            <li>
              {locale === 'ru'
                ? 'Выполните запрос с EXPLAIN (ANALYZE, BUFFERS) в PostgreSQL'
                : 'Run your query with EXPLAIN (ANALYZE, BUFFERS) in PostgreSQL'}
            </li>
            <li>
              {locale === 'ru'
                ? 'Скопируйте результат (в формате JSON или TEXT)'
                : 'Copy the output (JSON or TEXT format)'}
            </li>
            <li>
              {locale === 'ru'
                ? 'Вставьте в поле выше и нажмите "Анализировать"'
                : 'Paste it in the field above and click "Analyze"'}
            </li>
            <li>
              {locale === 'ru'
                ? 'Получите детальный анализ и рекомендации по индексам'
                : 'Get detailed analysis and index recommendations'}
            </li>
          </ol>
          <div className="mt-4 p-3 bg-hub-dark/50 rounded-lg">
            <code className="text-xs text-hub-accent font-mono">
              EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT * FROM users WHERE email = 'test@example.com';
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
