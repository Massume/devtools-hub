'use client';

import { useState, useMemo, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getAstExplorerTranslations } from '@/lib/i18n-ast-explorer';
import toast from 'react-hot-toast';

interface AstNode {
  type: string;
  name?: string;
  value?: string | number | boolean | null;
  children?: AstNode[];
  raw?: string;
  start?: number;
  end?: number;
}

const SAMPLE_CODE = `// Sample JavaScript code
const greeting = "Hello, World!";

function add(a, b) {
  return a + b;
}

const multiply = (x, y) => x * y;

class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this;
  }
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

if (doubled.length > 0) {
  console.log("Result:", doubled);
}`;

// Simple JavaScript tokenizer and parser
function tokenize(code: string): { type: string; value: string; start: number; end: number }[] {
  const tokens: { type: string; value: string; start: number; end: number }[] = [];
  let i = 0;

  while (i < code.length) {
    // Skip whitespace
    if (/\s/.test(code[i])) {
      i++;
      continue;
    }

    // Comments
    if (code[i] === '/' && code[i + 1] === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      tokens.push({ type: 'Comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    if (code[i] === '/' && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      tokens.push({ type: 'Comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      const start = i;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i++;
        i++;
      }
      i++;
      tokens.push({ type: 'String', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i]) || (code[i] === '.' && /\d/.test(code[i + 1]))) {
      const start = i;
      while (i < code.length && /[\d.eExX]/.test(code[i])) i++;
      tokens.push({ type: 'Number', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
      const value = code.slice(start, i);
      const keywords = ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'throw', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends', 'import', 'export', 'default', 'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'of', 'null', 'undefined', 'true', 'false'];
      const type = keywords.includes(value) ? 'Keyword' : 'Identifier';
      tokens.push({ type, value, start, end: i });
      continue;
    }

    // Operators and punctuation
    const multiCharOps = ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '??', '?.', '=>', '++', '--', '+=', '-=', '*=', '/=', '%=', '**', '...'];
    let matched = false;
    for (const op of multiCharOps) {
      if (code.slice(i, i + op.length) === op) {
        tokens.push({ type: 'Punctuator', value: op, start: i, end: i + op.length });
        i += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Single char
    const start = i;
    tokens.push({ type: 'Punctuator', value: code[i], start, end: i + 1 });
    i++;
  }

  return tokens;
}

// Build a simple AST from tokens
function buildSimpleAst(code: string): AstNode {
  const tokens = tokenize(code);

  const root: AstNode = {
    type: 'Program',
    children: [],
  };

  let i = 0;

  const parseStatement = (): AstNode | null => {
    if (i >= tokens.length) return null;
    const token = tokens[i];

    // Skip comments
    if (token.type === 'Comment') {
      i++;
      return { type: 'Comment', value: token.value, start: token.start, end: token.end };
    }

    // Variable declaration
    if (token.type === 'Keyword' && ['const', 'let', 'var'].includes(token.value)) {
      const kind = token.value;
      i++;
      const declarations: AstNode[] = [];

      while (i < tokens.length) {
        if (tokens[i].type === 'Identifier') {
          const name = tokens[i].value;
          i++;
          let init: AstNode | undefined;

          if (tokens[i]?.value === '=') {
            i++;
            init = parseExpression() ?? undefined;
          }

          declarations.push({
            type: 'VariableDeclarator',
            name,
            children: init ? [{ type: 'init', children: [init] }] : undefined,
          });
        }

        if (tokens[i]?.value === ',') {
          i++;
          continue;
        }
        if (tokens[i]?.value === ';') {
          i++;
          break;
        }
        break;
      }

      return {
        type: 'VariableDeclaration',
        value: kind,
        children: declarations,
      };
    }

    // Function declaration
    if (token.type === 'Keyword' && token.value === 'function') {
      i++;
      const name = tokens[i]?.type === 'Identifier' ? tokens[i++].value : '<anonymous>';

      // Skip params
      const params: string[] = [];
      if (tokens[i]?.value === '(') {
        i++;
        while (i < tokens.length && tokens[i].value !== ')') {
          if (tokens[i].type === 'Identifier') {
            params.push(tokens[i].value);
          }
          i++;
        }
        i++; // skip )
      }

      // Skip body
      let depth = 0;
      const bodyStart = i;
      if (tokens[i]?.value === '{') {
        depth = 1;
        i++;
        while (i < tokens.length && depth > 0) {
          if (tokens[i].value === '{') depth++;
          if (tokens[i].value === '}') depth--;
          i++;
        }
      }

      return {
        type: 'FunctionDeclaration',
        name,
        children: [
          { type: 'params', value: params.join(', ') },
          { type: 'body', value: '{ ... }' },
        ],
      };
    }

    // Class declaration
    if (token.type === 'Keyword' && token.value === 'class') {
      i++;
      const name = tokens[i]?.type === 'Identifier' ? tokens[i++].value : '<anonymous>';

      let superClass: string | undefined;
      if (tokens[i]?.value === 'extends') {
        i++;
        superClass = tokens[i]?.type === 'Identifier' ? tokens[i++].value : undefined;
      }

      // Skip body
      let depth = 0;
      if (tokens[i]?.value === '{') {
        depth = 1;
        i++;
        while (i < tokens.length && depth > 0) {
          if (tokens[i].value === '{') depth++;
          if (tokens[i].value === '}') depth--;
          i++;
        }
      }

      return {
        type: 'ClassDeclaration',
        name,
        children: superClass ? [{ type: 'superClass', value: superClass }] : undefined,
      };
    }

    // If statement
    if (token.type === 'Keyword' && token.value === 'if') {
      i++;

      // Skip condition
      if (tokens[i]?.value === '(') {
        let depth = 1;
        i++;
        while (i < tokens.length && depth > 0) {
          if (tokens[i].value === '(') depth++;
          if (tokens[i].value === ')') depth--;
          i++;
        }
      }

      // Skip consequent
      if (tokens[i]?.value === '{') {
        let depth = 1;
        i++;
        while (i < tokens.length && depth > 0) {
          if (tokens[i].value === '{') depth++;
          if (tokens[i].value === '}') depth--;
          i++;
        }
      }

      return {
        type: 'IfStatement',
        children: [
          { type: 'test', value: '(...)' },
          { type: 'consequent', value: '{ ... }' },
        ],
      };
    }

    // Return statement
    if (token.type === 'Keyword' && token.value === 'return') {
      i++;
      const argument = parseExpression();
      if (tokens[i]?.value === ';') i++;

      return {
        type: 'ReturnStatement',
        children: argument ? [argument] : undefined,
      };
    }

    // Expression statement
    const expr = parseExpression();
    if (expr) {
      if (tokens[i]?.value === ';') i++;
      return {
        type: 'ExpressionStatement',
        children: [expr],
      };
    }

    // Skip unknown token
    i++;
    return null;
  };

  const parseExpression = (): AstNode | null => {
    if (i >= tokens.length) return null;
    const token = tokens[i];

    if (token.type === 'String') {
      i++;
      return { type: 'StringLiteral', value: token.value, start: token.start, end: token.end };
    }

    if (token.type === 'Number') {
      i++;
      return { type: 'NumericLiteral', value: token.value, start: token.start, end: token.end };
    }

    if (token.value === 'true' || token.value === 'false') {
      i++;
      return { type: 'BooleanLiteral', value: token.value };
    }

    if (token.value === 'null') {
      i++;
      return { type: 'NullLiteral' };
    }

    if (token.value === '[') {
      i++;
      const elements: AstNode[] = [];
      while (i < tokens.length && tokens[i].value !== ']') {
        const elem = parseExpression();
        if (elem) elements.push(elem);
        if (tokens[i]?.value === ',') i++;
      }
      i++; // skip ]
      return { type: 'ArrayExpression', children: elements };
    }

    if (token.value === '{') {
      i++;
      const properties: AstNode[] = [];
      while (i < tokens.length && tokens[i].value !== '}') {
        if (tokens[i].type === 'Identifier' || tokens[i].type === 'String') {
          const key = tokens[i++].value;
          if (tokens[i]?.value === ':') {
            i++;
            const value = parseExpression();
            properties.push({
              type: 'Property',
              name: key,
              children: value ? [value] : undefined,
            });
          }
        }
        if (tokens[i]?.value === ',') i++;
      }
      i++; // skip }
      return { type: 'ObjectExpression', children: properties };
    }

    if (token.type === 'Identifier') {
      const name = token.value;
      i++;

      // Arrow function
      if (tokens[i]?.value === '=>') {
        i++;
        const body = parseExpression();
        return {
          type: 'ArrowFunctionExpression',
          children: [
            { type: 'params', value: name },
            { type: 'body', children: body ? [body] : undefined },
          ],
        };
      }

      // Call expression
      if (tokens[i]?.value === '(') {
        i++;
        const args: AstNode[] = [];
        while (i < tokens.length && tokens[i].value !== ')') {
          const arg = parseExpression();
          if (arg) args.push(arg);
          if (tokens[i]?.value === ',') i++;
        }
        i++; // skip )
        return {
          type: 'CallExpression',
          name,
          children: args.length > 0 ? [{ type: 'arguments', children: args }] : undefined,
        };
      }

      // Member expression
      if (tokens[i]?.value === '.') {
        i++;
        const property = tokens[i]?.type === 'Identifier' ? tokens[i++].value : '';
        return {
          type: 'MemberExpression',
          children: [
            { type: 'object', value: name },
            { type: 'property', value: property },
          ],
        };
      }

      return { type: 'Identifier', name };
    }

    return null;
  };

  // Parse all statements
  while (i < tokens.length) {
    const stmt = parseStatement();
    if (stmt) {
      root.children!.push(stmt);
    }
  }

  return root;
}

function countNodes(node: AstNode): { total: number; types: Set<string>; maxDepth: number } {
  let total = 1;
  const types = new Set<string>([node.type]);
  let maxDepth = 1;

  if (node.children) {
    for (const child of node.children) {
      const childStats = countNodes(child);
      total += childStats.total;
      childStats.types.forEach(t => types.add(t));
      maxDepth = Math.max(maxDepth, 1 + childStats.maxDepth);
    }
  }

  return { total, types, maxDepth };
}

interface TreeNodeProps {
  node: AstNode;
  expanded: Set<string>;
  toggleExpand: (path: string) => void;
  path: string;
  search: string;
}

function TreeNode({ node, expanded, toggleExpand, path, search }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(path);
  const matchesSearch = search && (
    node.type.toLowerCase().includes(search.toLowerCase()) ||
    node.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(node.value).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ml-4">
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-hub-darker ${matchesSearch ? 'bg-yellow-500/20' : ''}`}
        onClick={() => hasChildren && toggleExpand(path)}
      >
        {hasChildren ? (
          <span className="text-hub-muted w-4">{isExpanded ? '▼' : '▶'}</span>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-purple-400 font-mono text-sm">{node.type}</span>
        {node.name && (
          <span className="text-cyan-400 font-mono text-sm">{node.name}</span>
        )}
        {node.value !== undefined && (
          <span className="text-green-400 font-mono text-sm truncate max-w-xs">
            {typeof node.value === 'string' && node.value.length > 30
              ? node.value.slice(0, 30) + '...'
              : String(node.value)}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="border-l border-hub-border ml-2">
          {node.children!.map((child, i) => (
            <TreeNode
              key={`${path}-${i}`}
              node={child}
              expanded={expanded}
              toggleExpand={toggleExpand}
              path={`${path}-${i}`}
              search={search}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AstExplorer() {
  const { locale } = useI18n();
  const t = getAstExplorerTranslations(locale);

  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));
  const [viewMode, setViewMode] = useState<'tree' | 'json'>('tree');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const ast = useMemo(() => {
    if (!input.trim()) return null;
    setError('');

    try {
      // Validate syntax first
      new Function(input);
      return buildSimpleAst(input);
    } catch (e) {
      setError(t.syntaxError);
      return null;
    }
  }, [input, t.syntaxError]);

  const statistics = useMemo(() => {
    if (!ast) return null;
    const stats = countNodes(ast);
    return {
      total: stats.total,
      types: stats.types.size,
      maxDepth: stats.maxDepth,
    };
  }, [ast]);

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!ast) return;
    const paths = new Set<string>();

    const collect = (node: AstNode, path: string) => {
      paths.add(path);
      if (node.children) {
        node.children.forEach((child, i) => collect(child, `${path}-${i}`));
      }
    };

    collect(ast, 'root');
    setExpanded(paths);
  }, [ast]);

  const collapseAll = () => {
    setExpanded(new Set(['root']));
  };

  const handleCopy = async () => {
    if (!ast) return;
    await navigator.clipboard.writeText(JSON.stringify(ast, null, 2));
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_CODE);
  };

  const clearAll = () => {
    setInput('');
    setError('');
    setExpanded(new Set(['root']));
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSample} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.loadSample}
        </button>
        <button onClick={clearAll} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.clearButton}
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={10}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <span className="text-sm text-red-400">{t.error}: {error}</span>
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.statistics}</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-mono font-bold text-white">{statistics.total}</div>
              <div className="text-xs text-hub-muted">{t.totalNodes}</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-hub-accent">{statistics.types}</div>
              <div className="text-xs text-hub-muted">{t.nodeTypes}</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-yellow-400">{statistics.maxDepth}</div>
              <div className="text-xs text-hub-muted">{t.maxDepth}</div>
            </div>
          </div>
        </div>
      )}

      {/* AST Output */}
      {ast && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1 text-xs rounded-lg ${viewMode === 'tree' ? 'bg-hub-accent text-white' : 'bg-hub-darker text-hub-muted'}`}
                >
                  {t.treeView}
                </button>
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1 text-xs rounded-lg ${viewMode === 'json' ? 'bg-hub-accent text-white' : 'bg-hub-darker text-hub-muted'}`}
                >
                  {t.jsonView}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={expandAll} className="text-xs text-hub-accent hover:underline">{t.expandAll}</button>
              <button onClick={collapseAll} className="text-xs text-hub-accent hover:underline">{t.collapseAll}</button>
              <button onClick={handleCopy} className="text-xs text-hub-accent hover:underline">{t.copyButton}</button>
            </div>
          </div>

          {viewMode === 'tree' && (
            <>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full mb-2 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-96 overflow-auto">
                <TreeNode
                  node={ast}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  path="root"
                  search={search}
                />
              </div>
            </>
          )}

          {viewMode === 'json' && (
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                {JSON.stringify(ast, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.featuresTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-hub-muted">
              <span className="text-hub-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{t.aboutTitle}</h3>
        <p className="text-hub-muted">{t.aboutText}</p>
      </div>
    </div>
  );
}
