export type NodeType =
  | 'Seq Scan'
  | 'Index Scan'
  | 'Index Only Scan'
  | 'Bitmap Index Scan'
  | 'Bitmap Heap Scan'
  | 'Nested Loop'
  | 'Hash Join'
  | 'Merge Join'
  | 'Sort'
  | 'Hash'
  | 'Aggregate'
  | 'GroupAggregate'
  | 'HashAggregate'
  | 'Group'
  | 'Limit'
  | 'Unique'
  | 'Append'
  | 'Result'
  | 'Materialize'
  | 'CTE Scan'
  | 'Subquery Scan'
  | 'Function Scan'
  | 'Values Scan'
  | string;

export interface PlanNode {
  id: string;
  nodeType: NodeType;
  relationName?: string;
  alias?: string;
  schema?: string;

  // Costs
  startupCost: number;
  totalCost: number;

  // Timing (from ANALYZE)
  actualStartupTime?: number;
  actualTotalTime?: number;

  // Rows
  planRows: number;
  planWidth?: number;
  actualRows?: number;
  actualLoops?: number;

  // Buffers
  sharedHitBlocks?: number;
  sharedReadBlocks?: number;
  sharedDirtiedBlocks?: number;
  sharedWrittenBlocks?: number;
  tempReadBlocks?: number;
  tempWrittenBlocks?: number;

  // Specific fields
  filter?: string;
  rowsRemovedByFilter?: number;
  indexName?: string;
  indexCond?: string;
  joinType?: string;
  hashCond?: string;
  mergeCond?: string;
  sortKey?: string[];
  sortMethod?: string;
  sortSpaceUsed?: number;
  sortSpaceType?: string;

  // Children
  children?: PlanNode[];

  // Calculated fields
  exclusiveTime?: number;
  timePercentage?: number;
  rowsEstimateRatio?: number;
  isBottleneck?: boolean;
  warnings?: string[];
}

export interface PlanSummary {
  executionTime: number;
  planningTime?: number;
  totalRows: number;
  estimationAccuracy: number;
  topOperations: OperationStat[];
  hasSeqScans: boolean;
  hasEstimationErrors: boolean;
}

export interface OperationStat {
  nodeType: string;
  count: number;
  totalTime: number;
  percentage: number;
}

export type Severity = 'critical' | 'warning' | 'info';

export interface Recommendation {
  id: string;
  severity: Severity;
  title: string;
  titleEn: string;
  nodeId?: string;
  issue: string;
  issueEn: string;
  explanation: string;
  explanationEn: string;
  suggestion: string;
  suggestionEn: string;
  sql?: string;
}

export interface AnalysisResult {
  plan: PlanNode;
  summary: PlanSummary;
  recommendations: Recommendation[];
  rawPlan: string;
}

export interface AnalyzeRequest {
  plan: string;
  format?: 'json' | 'text' | 'auto';
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  errorEn?: string;
}

export interface ExplainRequest {
  plan: PlanNode;
  recommendations: Recommendation[];
  lang: 'ru' | 'en';
}

export interface ExplainResponse {
  success: boolean;
  explanation?: string;
  error?: string;
}
