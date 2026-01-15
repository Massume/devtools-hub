import { PlanNode } from '@/types/plan';

interface ParsedLine {
  indent: number;
  nodeType: string;
  costs: {
    startupCost: number;
    totalCost: number;
    planRows: number;
    planWidth: number;
  };
  actual?: {
    startupTime: number;
    totalTime: number;
    rows: number;
    loops: number;
  };
  extra: Record<string, string>;
}

let nodeIdCounter = 0;

function generateNodeId(): string {
  return `node-${++nodeIdCounter}`;
}

// Parse a single line of EXPLAIN output
function parseLine(line: string): ParsedLine | null {
  // Match the main node line
  // Example: "  ->  Seq Scan on users  (cost=0.00..1.01 rows=1 width=36) (actual time=0.012..0.013 rows=1 loops=1)"
  const nodePattern = /^(\s*)(->)?\s*(.+?)\s+\(cost=([0-9.]+)\.\.([0-9.]+)\s+rows=(\d+)\s+width=(\d+)\)(?:\s+\(actual time=([0-9.]+)\.\.([0-9.]+)\s+rows=(\d+)\s+loops=(\d+)\))?/;
  
  const match = line.match(nodePattern);
  if (!match) return null;
  
  const [, indent, arrow, nodeType, startupCost, totalCost, rows, width, actualStart, actualEnd, actualRows, loops] = match;
  
  return {
    indent: indent.length + (arrow ? 4 : 0),
    nodeType: nodeType.trim(),
    costs: {
      startupCost: parseFloat(startupCost),
      totalCost: parseFloat(totalCost),
      planRows: parseInt(rows, 10),
      planWidth: parseInt(width, 10),
    },
    actual: actualStart ? {
      startupTime: parseFloat(actualStart),
      totalTime: parseFloat(actualEnd),
      rows: parseInt(actualRows, 10),
      loops: parseInt(loops, 10),
    } : undefined,
    extra: {},
  };
}

// Parse property lines (Filter:, Index Cond:, etc.)
function parseProperty(line: string): { key: string; value: string } | null {
  const propPattern = /^\s+(Filter|Index Cond|Index Name|Sort Key|Sort Method|Hash Cond|Merge Cond|Rows Removed by Filter|Sort Space Used|Sort Space Type):\s*(.+)/;
  const match = line.match(propPattern);
  if (!match) return null;
  
  return { key: match[1], value: match[2].trim() };
}

// Extract table name from node type like "Seq Scan on users" or "Index Scan using idx on users"
function extractTableInfo(nodeType: string): { cleanNodeType: string; tableName?: string; indexName?: string; alias?: string } {
  // "Seq Scan on users u"
  const seqScanMatch = nodeType.match(/^(Seq Scan) on (\w+)(?:\s+(\w+))?$/);
  if (seqScanMatch) {
    return {
      cleanNodeType: seqScanMatch[1],
      tableName: seqScanMatch[2],
      alias: seqScanMatch[3],
    };
  }
  
  // "Index Scan using users_pkey on users u"
  const indexScanMatch = nodeType.match(/^(Index(?:\s+Only)?\s+Scan) using (\w+) on (\w+)(?:\s+(\w+))?$/);
  if (indexScanMatch) {
    return {
      cleanNodeType: indexScanMatch[1],
      indexName: indexScanMatch[2],
      tableName: indexScanMatch[3],
      alias: indexScanMatch[4],
    };
  }
  
  // "Bitmap Heap Scan on users"
  const bitmapMatch = nodeType.match(/^(Bitmap Heap Scan) on (\w+)(?:\s+(\w+))?$/);
  if (bitmapMatch) {
    return {
      cleanNodeType: bitmapMatch[1],
      tableName: bitmapMatch[2],
      alias: bitmapMatch[3],
    };
  }
  
  // "Bitmap Index Scan on users_email_idx"
  const bitmapIndexMatch = nodeType.match(/^(Bitmap Index Scan) on (\w+)$/);
  if (bitmapIndexMatch) {
    return {
      cleanNodeType: bitmapIndexMatch[1],
      indexName: bitmapIndexMatch[2],
    };
  }
  
  return { cleanNodeType: nodeType };
}

interface BuildContext {
  lines: string[];
  index: number;
}

function buildTree(ctx: BuildContext, minIndent: number): PlanNode[] {
  const nodes: PlanNode[] = [];
  
  while (ctx.index < ctx.lines.length) {
    const line = ctx.lines[ctx.index];
    
    // Skip empty lines and timing summary
    if (!line.trim() || line.includes('Planning Time:') || line.includes('Execution Time:')) {
      ctx.index++;
      continue;
    }
    
    const parsed = parseLine(line);
    
    if (parsed) {
      // Check indent level
      if (parsed.indent < minIndent) {
        // This node belongs to parent level
        break;
      }
      
      ctx.index++;
      
      // Extract table/index info from node type
      const { cleanNodeType, tableName, indexName, alias } = extractTableInfo(parsed.nodeType);
      
      // Collect properties
      const properties: Record<string, string> = {};
      while (ctx.index < ctx.lines.length) {
        const propLine = ctx.lines[ctx.index];
        const prop = parseProperty(propLine);
        if (prop) {
          properties[prop.key] = prop.value;
          ctx.index++;
        } else {
          break;
        }
      }
      
      // Build node
      const node: PlanNode = {
        id: generateNodeId(),
        nodeType: cleanNodeType,
        relationName: tableName,
        alias,
        indexName: indexName || properties['Index Name'],
        startupCost: parsed.costs.startupCost,
        totalCost: parsed.costs.totalCost,
        planRows: parsed.costs.planRows,
        planWidth: parsed.costs.planWidth,
        actualStartupTime: parsed.actual?.startupTime,
        actualTotalTime: parsed.actual?.totalTime,
        actualRows: parsed.actual?.rows,
        actualLoops: parsed.actual?.loops,
        filter: properties['Filter'],
        indexCond: properties['Index Cond'],
        hashCond: properties['Hash Cond'],
        mergeCond: properties['Merge Cond'],
        sortKey: properties['Sort Key']?.split(', '),
        sortMethod: properties['Sort Method'],
        rowsRemovedByFilter: properties['Rows Removed by Filter'] 
          ? parseInt(properties['Rows Removed by Filter'], 10) 
          : undefined,
      };
      
      // Recursively build children
      node.children = buildTree(ctx, parsed.indent + 1);
      
      nodes.push(node);
    } else {
      ctx.index++;
    }
  }
  
  return nodes;
}

function extractTiming(input: string): { executionTime?: number; planningTime?: number } {
  const execMatch = input.match(/Execution Time:\s*([0-9.]+)\s*ms/);
  const planMatch = input.match(/Planning Time:\s*([0-9.]+)\s*ms/);
  
  return {
    executionTime: execMatch ? parseFloat(execMatch[1]) : undefined,
    planningTime: planMatch ? parseFloat(planMatch[1]) : undefined,
  };
}

export function parseTextPlan(input: string): { plan: PlanNode; executionTime: number; planningTime?: number } {
  nodeIdCounter = 0;
  
  const lines = input.split('\n');
  const { executionTime, planningTime } = extractTiming(input);
  
  const ctx: BuildContext = { lines, index: 0 };
  const nodes = buildTree(ctx, 0);
  
  if (nodes.length === 0) {
    throw new Error('Could not parse plan');
  }
  
  return {
    plan: nodes[0],
    executionTime: executionTime || 0,
    planningTime,
  };
}
