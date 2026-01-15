export type Locale = 'ru' | 'en';

export const pgTranslations = {
  ru: {
    // Form
    inputPlaceholder: 'Вставьте вывод EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...',
    analyzeButton: 'Анализировать',
    analyzing: 'Анализ...',
    clearButton: 'Очистить',
    exampleButton: 'Загрузить пример',

    // Results
    resultsFor: 'Результаты анализа',
    executionTime: 'Время выполнения',
    planningTime: 'Время планирования',
    rowsProcessed: 'Обработано строк',
    estimationAccuracy: 'Точность оценки',

    // Plan Tree
    planTree: 'План запроса',
    nodeDetails: 'Детали узла',
    actualTime: 'Фактическое время',
    estimatedRows: 'Ожидалось строк',
    actualRows: 'Фактически строк',
    loops: 'Итераций',
    filter: 'Фильтр',
    indexUsed: 'Используемый индекс',
    rowsRemoved: 'Отброшено строк',

    // Recommendations
    recommendations: 'Рекомендации',
    noRecommendations: 'Проблем не обнаружено! План выглядит оптимальным.',
    copySQL: 'Копировать SQL',
    copied: 'Скопировано!',

    // AI Explain
    aiExplain: 'Объяснить с AI',
    aiExplaining: 'AI анализирует...',
    aiExplanation: 'AI-объяснение',
    aiLimitReached: 'Лимит AI-объяснений исчерпан на сегодня',

    // Severity
    severityCritical: 'Критично',
    severityWarning: 'Внимание',
    severityInfo: 'Информация',

    // Errors
    errorInvalidPlan: 'Неверный формат плана. Убедитесь что это вывод EXPLAIN ANALYZE.',
    errorParsing: 'Ошибка при разборе плана',
    errorAnalyzing: 'Ошибка при анализе',
  },

  en: {
    // Form
    inputPlaceholder: 'Paste output of EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...',
    analyzeButton: 'Analyze',
    analyzing: 'Analyzing...',
    clearButton: 'Clear',
    exampleButton: 'Load example',

    // Results
    resultsFor: 'Analysis Results',
    executionTime: 'Execution time',
    planningTime: 'Planning time',
    rowsProcessed: 'Rows processed',
    estimationAccuracy: 'Estimation accuracy',

    // Plan Tree
    planTree: 'Query Plan',
    nodeDetails: 'Node Details',
    actualTime: 'Actual time',
    estimatedRows: 'Estimated rows',
    actualRows: 'Actual rows',
    loops: 'Loops',
    filter: 'Filter',
    indexUsed: 'Index used',
    rowsRemoved: 'Rows removed',

    // Recommendations
    recommendations: 'Recommendations',
    noRecommendations: 'No issues found! The plan looks optimal.',
    copySQL: 'Copy SQL',
    copied: 'Copied!',

    // AI Explain
    aiExplain: 'Explain with AI',
    aiExplaining: 'AI is analyzing...',
    aiExplanation: 'AI Explanation',
    aiLimitReached: 'Daily AI explanation limit reached',

    // Severity
    severityCritical: 'Critical',
    severityWarning: 'Warning',
    severityInfo: 'Info',

    // Errors
    errorInvalidPlan: 'Invalid plan format. Make sure this is EXPLAIN ANALYZE output.',
    errorParsing: 'Error parsing plan',
    errorAnalyzing: 'Error analyzing',
  },
} as const;

export type PgTranslationKey = keyof typeof pgTranslations.ru;

export function tPg(key: PgTranslationKey, locale: Locale): string {
  return pgTranslations[locale][key] || pgTranslations.en[key] || key;
}
