import { PlanNode } from '@/types/plan';
import { parseJSONPlan, detectFormat } from './json-parser';
import { parseTextPlan } from './text-parser';

export interface ParseResult {
  plan: PlanNode;
  executionTime: number;
  planningTime?: number;
}

export function parsePlan(input: string, format?: 'json' | 'text' | 'auto'): ParseResult {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    throw new Error('Empty input');
  }
  
  const detectedFormat = format === 'auto' || !format 
    ? detectFormat(trimmedInput) 
    : format;
  
  if (detectedFormat === 'json') {
    return parseJSONPlan(trimmedInput);
  } else {
    return parseTextPlan(trimmedInput);
  }
}

export { detectFormat } from './json-parser';
