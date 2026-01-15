'use client';

import { useState } from 'react';
import { PlanNode } from '@/types/plan';
import { tPg } from '@/lib/i18n-pg';

interface PlanTreeProps {
  node: PlanNode;
  depth?: number;
  selectedNodeId: string | null;
  onNodeSelect: (id: string | null) => void;
  locale: 'en' | 'ru';
}

function getNodeColor(node: PlanNode): string {
  if (node.isBottleneck) return 'text-hub-error';
  if (node.timePercentage && node.timePercentage > 20) return 'text-hub-warning';
  if (node.nodeType.includes('Seq Scan') && (node.actualRows || node.planRows) > 1000) {
    return 'text-hub-warning';
  }
  if (node.nodeType.includes('Index')) return 'text-hub-accent';
  return 'text-white';
}

function getNodeIcon(nodeType: string): string {
  if (nodeType.includes('Seq Scan')) return '📋';
  if (nodeType.includes('Index')) return '🔍';
  if (nodeType.includes('Nested Loop')) return '🔄';
  if (nodeType.includes('Hash')) return '#️⃣';
  if (nodeType.includes('Merge')) return '🔀';
  if (nodeType.includes('Sort')) return '📊';
  if (nodeType.includes('Aggregate')) return '📈';
  if (nodeType.includes('Limit')) return '✂️';
  return '📦';
}

function formatTime(ms?: number): string {
  if (ms === undefined) return '-';
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatRows(rows?: number): string {
  if (rows === undefined) return '-';
  return rows.toLocaleString();
}

export function PlanTreeNode({ node, depth = 0, selectedNodeId, onNodeSelect, locale }: PlanTreeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    onNodeSelect(isSelected ? null : node.id);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const nodeColor = getNodeColor(node);
  const icon = getNodeIcon(node.nodeType);
  const timePercentage = node.timePercentage?.toFixed(1);

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l border-hub-border' : ''}`}>
      <div
        onClick={handleClick}
        className={`
          group flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-all
          ${isSelected
            ? 'bg-hub-accent/10 border border-hub-accent/30'
            : 'hover:bg-hub-card border border-transparent'
          }
        `}
      >
        {/* Expand toggle */}
        {hasChildren && (
          <button
            onClick={toggleExpand}
            className="mt-0.5 w-5 h-5 flex items-center justify-center text-hub-muted hover:text-hub-accent"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Icon */}
        <span className="text-base">{icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium ${nodeColor}`}>
              {node.nodeType}
            </span>
            {node.relationName && (
              <span className="text-hub-muted">
                on <span className="text-purple-400">{node.relationName}</span>
                {node.alias && node.alias !== node.relationName && (
                  <span className="text-hub-muted"> {node.alias}</span>
                )}
              </span>
            )}
            {node.indexName && (
              <span className="text-hub-muted">
                using <span className="text-hub-accent">{node.indexName}</span>
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-1 text-xs text-hub-muted">
            {node.actualTotalTime !== undefined && (
              <span className={node.isBottleneck ? 'text-hub-error font-medium' : ''}>
                ⏱ {formatTime(node.actualTotalTime)}
                {timePercentage && ` (${timePercentage}%)`}
              </span>
            )}
            {node.actualRows !== undefined && (
              <span>
                📊 {formatRows(node.actualRows)} rows
              </span>
            )}
            {node.actualLoops !== undefined && node.actualLoops > 1 && (
              <span>
                🔁 {node.actualLoops}x
              </span>
            )}
          </div>

          {/* Filter */}
          {node.filter && (
            <div className="mt-1 text-xs text-hub-muted font-mono truncate">
              Filter: {node.filter}
            </div>
          )}
        </div>

        {/* Warnings */}
        {node.isBottleneck && (
          <span className="px-2 py-0.5 bg-hub-error/20 text-hub-error text-xs rounded">
            🔥
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <PlanTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PlanTree({ plan, selectedNodeId, onNodeSelect, locale }: { plan: PlanNode; selectedNodeId: string | null; onNodeSelect: (id: string | null) => void; locale: 'en' | 'ru' }) {
  return (
    <div className="bg-hub-card border border-hub-border rounded-xl overflow-hidden" id="plan-tree">
      <div className="px-4 py-3 border-b border-hub-border">
        <h2 className="font-semibold text-white">{tPg('planTree', locale)}</h2>
      </div>
      <div className="p-4 max-h-[500px] overflow-auto">
        <PlanTreeNode node={plan} selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} locale={locale} />
      </div>
    </div>
  );
}
