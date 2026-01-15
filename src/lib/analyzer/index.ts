import { PlanNode, Recommendation, PlanSummary, OperationStat } from '@/types/plan';

// Helper to parse columns from filter expressions
function parseFilterColumns(filter: string): string[] {
  const matches = filter.matchAll(/\((\w+)\s*[=<>!]/g);
  return [...new Set([...matches].map(m => m[1]))];
}

// Generate index SQL
function generateIndexSQL(table: string, columns: string[]): string {
  const safeColumns = columns.map(c => c.replace(/[^a-zA-Z0-9_]/g, ''));
  const indexName = `idx_${table}_${safeColumns.join('_')}`;
  return `CREATE INDEX ${indexName} ON ${table} (${safeColumns.join(', ')});`;
}

// Rule: Sequential Scan on large table
function checkSeqScan(node: PlanNode): Recommendation | null {
  if (node.nodeType !== 'Seq Scan') return null;
  
  const actualRows = node.actualRows ?? node.planRows;
  
  // Small tables are fine
  if (actualRows < 1000) return null;
  
  // Seq Scan with filter on large table
  if (node.filter && actualRows > 1000) {
    const columns = parseFilterColumns(node.filter);
    const tableName = node.relationName || 'table';
    
    return {
      id: `seq-scan-${node.id}`,
      severity: actualRows > 10000 ? 'critical' : 'warning',
      title: `Sequential Scan на ${tableName}`,
      titleEn: `Sequential Scan on ${tableName}`,
      nodeId: node.id,
      issue: `Последовательное сканирование ${actualRows.toLocaleString()} строк`,
      issueEn: `Sequential scan of ${actualRows.toLocaleString()} rows`,
      explanation: `PostgreSQL читает всю таблицу ${tableName} построчно вместо использования индекса. При большом количестве строк это значительно замедляет запрос.`,
      explanationEn: `PostgreSQL reads the entire ${tableName} table row by row instead of using an index. With many rows, this significantly slows down the query.`,
      suggestion: columns.length > 0 
        ? `Создайте индекс по колонкам: ${columns.join(', ')}`
        : 'Создайте индекс по колонкам, используемым в фильтре',
      suggestionEn: columns.length > 0
        ? `Create an index on columns: ${columns.join(', ')}`
        : 'Create an index on the columns used in the filter',
      sql: columns.length > 0 && node.relationName 
        ? generateIndexSQL(node.relationName, columns)
        : undefined,
    };
  }
  
  return null;
}

// Rule: Bad row estimation
function checkEstimation(node: PlanNode): Recommendation | null {
  if (node.actualRows === undefined || node.planRows === undefined) return null;
  
  const ratio = node.actualRows / Math.max(node.planRows, 1);
  
  // Error more than 10x
  if (ratio < 0.1 || ratio > 10) {
    const tableName = node.relationName || node.nodeType;
    
    return {
      id: `estimation-${node.id}`,
      severity: 'warning',
      title: 'Ошибка оценки планировщика',
      titleEn: 'Planner estimation error',
      nodeId: node.id,
      issue: `Ожидалось ${node.planRows} строк, получено ${node.actualRows}`,
      issueEn: `Expected ${node.planRows} rows, got ${node.actualRows}`,
      explanation: `Планировщик PostgreSQL использует устаревшую статистику. Это может приводить к выбору неоптимального плана выполнения.`,
      explanationEn: `PostgreSQL planner uses outdated statistics. This can lead to choosing a suboptimal execution plan.`,
      suggestion: 'Обновите статистику таблицы командой ANALYZE',
      suggestionEn: 'Update table statistics with ANALYZE command',
      sql: node.relationName 
        ? `ANALYZE ${node.relationName};`
        : `ANALYZE;`,
    };
  }
  
  return null;
}

// Rule: Nested Loop with many iterations
function checkNestedLoop(node: PlanNode): Recommendation | null {
  if (node.nodeType !== 'Nested Loop') return null;
  
  const loops = node.actualLoops ?? 1;
  const innerChild = node.children?.[1];
  
  // Many iterations with Seq Scan inside
  if (loops > 1000 && innerChild?.nodeType === 'Seq Scan') {
    return {
      id: `nested-loop-${node.id}`,
      severity: 'critical',
      title: 'Неэффективный Nested Loop',
      titleEn: 'Inefficient Nested Loop',
      nodeId: node.id,
      issue: `Nested Loop с ${loops.toLocaleString()} итерациями и Seq Scan внутри`,
      issueEn: `Nested Loop with ${loops.toLocaleString()} iterations and Seq Scan inside`,
      explanation: `Для каждой строки внешней таблицы выполняется полное сканирование внутренней. Это O(n*m) сложность.`,
      explanationEn: `For each row of the outer table, a full scan of the inner table is performed. This is O(n*m) complexity.`,
      suggestion: innerChild.relationName
        ? `Добавьте индекс на таблицу ${innerChild.relationName} по ключу соединения`
        : 'Добавьте индекс на внутреннюю таблицу по ключу соединения',
      suggestionEn: innerChild.relationName
        ? `Add an index on table ${innerChild.relationName} on the join key`
        : 'Add an index on the inner table on the join key',
    };
  }
  
  return null;
}

// Rule: External sort (disk-based)
function checkSort(node: PlanNode): Recommendation | null {
  if (node.nodeType !== 'Sort') return null;
  
  if (node.sortSpaceType === 'Disk' || node.sortMethod?.includes('external')) {
    return {
      id: `sort-disk-${node.id}`,
      severity: 'warning',
      title: 'Сортировка на диске',
      titleEn: 'Disk-based sort',
      nodeId: node.id,
      issue: `Сортировка выполняется на диске (${node.sortSpaceUsed} KB)`,
      issueEn: `Sort is performed on disk (${node.sortSpaceUsed} KB)`,
      explanation: `Данные не поместились в work_mem и были сброшены на диск, что значительно медленнее сортировки в памяти.`,
      explanationEn: `Data didn't fit in work_mem and was spilled to disk, which is much slower than in-memory sorting.`,
      suggestion: 'Увеличьте work_mem или добавьте индекс для сортировки',
      suggestionEn: 'Increase work_mem or add an index for sorting',
      sql: `SET work_mem = '256MB'; -- Adjust based on available memory`,
    };
  }
  
  return null;
}

// Rule: Hash batches (memory overflow)
function checkHashBatches(node: PlanNode): Recommendation | null {
  if (node.nodeType !== 'Hash') return null;
  
  // Check for batches in extra info (would need to parse from raw plan)
  // For now, simplified check based on typical patterns
  
  return null;
}

// Rule: Bitmap Heap Scan with lossy pages
function checkBitmapLossy(node: PlanNode): Recommendation | null {
  if (node.nodeType !== 'Bitmap Heap Scan') return null;
  
  // Would need to check for "Heap Blocks: exact=X lossy=Y" in raw output
  // Simplified for now
  
  return null;
}

// Collect all recommendations from a node and its children
function collectRecommendations(node: PlanNode): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Apply all rules to this node
  const rules = [
    checkSeqScan,
    checkEstimation,
    checkNestedLoop,
    checkSort,
    checkHashBatches,
    checkBitmapLossy,
  ];
  
  for (const rule of rules) {
    const rec = rule(node);
    if (rec) {
      recommendations.push(rec);
    }
  }
  
  // Recurse into children
  if (node.children) {
    for (const child of node.children) {
      recommendations.push(...collectRecommendations(child));
    }
  }
  
  return recommendations;
}

// Calculate summary statistics
function calculateSummary(node: PlanNode, executionTime: number): PlanSummary {
  const operationCounts: Record<string, { count: number; time: number }> = {};
  let totalRows = 0;
  let estimationErrors = 0;
  let estimationChecks = 0;
  let hasSeqScans = false;

  function traverse(n: PlanNode) {
    // Count operations
    const type = n.nodeType;
    if (!operationCounts[type]) {
      operationCounts[type] = { count: 0, time: 0 };
    }
    operationCounts[type].count++;
    operationCounts[type].time += n.exclusiveTime || 0;

    // Track rows
    if (n.actualRows !== undefined) {
      totalRows += n.actualRows * (n.actualLoops || 1);
    }

    // Track estimation accuracy
    if (n.actualRows !== undefined && n.planRows !== undefined) {
      estimationChecks++;
      const ratio = n.actualRows / Math.max(n.planRows, 1);
      if (ratio < 0.5 || ratio > 2) {
        estimationErrors++;
      }
    }

    // Track seq scans
    if (n.nodeType === 'Seq Scan' && (n.actualRows || n.planRows) > 1000) {
      hasSeqScans = true;
    }

    // Recurse
    n.children?.forEach(traverse);
  }

  traverse(node);

  // Build top operations
  const topOperations: OperationStat[] = Object.entries(operationCounts)
    .map(([nodeType, { count, time }]) => ({
      nodeType,
      count,
      totalTime: time,
      percentage: executionTime > 0 ? (time / executionTime) * 100 : 0,
    }))
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 5);

  // Calculate estimation accuracy
  const estimationAccuracy = estimationChecks > 0
    ? Math.round(((estimationChecks - estimationErrors) / estimationChecks) * 100)
    : 100;

  return {
    executionTime,
    totalRows,
    estimationAccuracy,
    topOperations,
    hasSeqScans,
    hasEstimationErrors: estimationErrors > 0,
  };
}

export function analyze(
  node: PlanNode, 
  executionTime: number, 
  planningTime?: number
): { 
  recommendations: Recommendation[]; 
  summary: PlanSummary;
} {
  const recommendations = collectRecommendations(node);
  const summary = calculateSummary(node, executionTime);
  
  if (planningTime !== undefined) {
    summary.planningTime = planningTime;
  }

  // Sort recommendations by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  recommendations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return { recommendations, summary };
}
