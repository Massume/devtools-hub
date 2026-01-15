import { PlanNode } from '@/types/plan';

interface RawPlanNode {
  'Node Type': string;
  'Relation Name'?: string;
  'Alias'?: string;
  'Schema'?: string;
  'Startup Cost': number;
  'Total Cost': number;
  'Plan Rows': number;
  'Plan Width'?: number;
  'Actual Startup Time'?: number;
  'Actual Total Time'?: number;
  'Actual Rows'?: number;
  'Actual Loops'?: number;
  'Shared Hit Blocks'?: number;
  'Shared Read Blocks'?: number;
  'Shared Dirtied Blocks'?: number;
  'Shared Written Blocks'?: number;
  'Temp Read Blocks'?: number;
  'Temp Written Blocks'?: number;
  'Filter'?: string;
  'Rows Removed by Filter'?: number;
  'Index Name'?: string;
  'Index Cond'?: string;
  'Join Type'?: string;
  'Hash Cond'?: string;
  'Merge Cond'?: string;
  'Sort Key'?: string[];
  'Sort Method'?: string;
  'Sort Space Used'?: number;
  'Sort Space Type'?: string;
  'Plans'?: RawPlanNode[];
  [key: string]: any;
}

interface RawPlan {
  Plan: RawPlanNode;
  'Planning Time'?: number;
  'Execution Time'?: number;
  'Triggers'?: any[];
}

let nodeIdCounter = 0;

function generateNodeId(): string {
  return `node-${++nodeIdCounter}`;
}

function transformNode(raw: RawPlanNode, parentTime?: number): PlanNode {
  const actualTotalTime = raw['Actual Total Time'];
  const actualLoops = raw['Actual Loops'] || 1;
  
  // Calculate exclusive time (this node only, not children)
  let childrenTime = 0;
  if (raw.Plans) {
    childrenTime = raw.Plans.reduce((sum, child) => {
      return sum + (child['Actual Total Time'] || 0) * (child['Actual Loops'] || 1);
    }, 0);
  }
  
  const exclusiveTime = actualTotalTime 
    ? (actualTotalTime * actualLoops) - childrenTime
    : undefined;

  // Calculate rows estimate ratio
  const planRows = raw['Plan Rows'] || 1;
  const actualRows = raw['Actual Rows'];
  const rowsEstimateRatio = actualRows !== undefined 
    ? actualRows / Math.max(planRows, 1)
    : undefined;

  const node: PlanNode = {
    id: generateNodeId(),
    nodeType: raw['Node Type'],
    relationName: raw['Relation Name'],
    alias: raw['Alias'],
    schema: raw['Schema'],
    startupCost: raw['Startup Cost'],
    totalCost: raw['Total Cost'],
    planRows: raw['Plan Rows'],
    planWidth: raw['Plan Width'],
    actualStartupTime: raw['Actual Startup Time'],
    actualTotalTime: raw['Actual Total Time'],
    actualRows: raw['Actual Rows'],
    actualLoops: raw['Actual Loops'],
    sharedHitBlocks: raw['Shared Hit Blocks'],
    sharedReadBlocks: raw['Shared Read Blocks'],
    sharedDirtiedBlocks: raw['Shared Dirtied Blocks'],
    sharedWrittenBlocks: raw['Shared Written Blocks'],
    tempReadBlocks: raw['Temp Read Blocks'],
    tempWrittenBlocks: raw['Temp Written Blocks'],
    filter: raw['Filter'],
    rowsRemovedByFilter: raw['Rows Removed by Filter'],
    indexName: raw['Index Name'],
    indexCond: raw['Index Cond'],
    joinType: raw['Join Type'],
    hashCond: raw['Hash Cond'],
    mergeCond: raw['Merge Cond'],
    sortKey: raw['Sort Key'],
    sortMethod: raw['Sort Method'],
    sortSpaceUsed: raw['Sort Space Used'],
    sortSpaceType: raw['Sort Space Type'],
    exclusiveTime: exclusiveTime !== undefined ? Math.max(0, exclusiveTime) : undefined,
    rowsEstimateRatio,
    children: raw.Plans?.map(child => transformNode(child, actualTotalTime)),
  };

  return node;
}

function calculateTimePercentages(node: PlanNode, totalTime: number): void {
  if (node.exclusiveTime !== undefined && totalTime > 0) {
    node.timePercentage = (node.exclusiveTime / totalTime) * 100;
    node.isBottleneck = node.timePercentage > 30;
  }
  
  node.children?.forEach(child => calculateTimePercentages(child, totalTime));
}

export function parseJSONPlan(input: string): { plan: PlanNode; executionTime: number; planningTime?: number } {
  // Reset counter for each parse
  nodeIdCounter = 0;
  
  // Try to parse JSON
  let parsed: RawPlan | RawPlan[];
  
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    // Try to extract JSON from text (sometimes EXPLAIN adds extra text)
    const jsonMatch = input.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid JSON format');
    }
  }
  
  // Handle array format (EXPLAIN returns array)
  const rawPlan: RawPlan = Array.isArray(parsed) ? parsed[0] : parsed;
  
  if (!rawPlan.Plan) {
    throw new Error('No Plan found in input');
  }
  
  const plan = transformNode(rawPlan.Plan);
  const executionTime = rawPlan['Execution Time'] || 0;
  const planningTime = rawPlan['Planning Time'];
  
  // Calculate time percentages
  if (executionTime > 0) {
    calculateTimePercentages(plan, executionTime);
  }
  
  return { plan, executionTime, planningTime };
}

export function detectFormat(input: string): 'json' | 'text' {
  const trimmed = input.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return 'json';
  }
  return 'text';
}
