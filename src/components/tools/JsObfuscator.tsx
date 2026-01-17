'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsObfuscatorTranslations } from '@/lib/i18n-js-obfuscator';
import toast from 'react-hot-toast';

interface ObfuscatorOptions {
  renameVariables: boolean;
  stringEncoding: boolean;
  deadCodeInjection: boolean;
  controlFlowFlattening: boolean;
  compactOutput: boolean;
}

const SAMPLE_CODE = `// Sample JavaScript code
function calculateTotal(items) {
  let total = 0;
  const taxRate = 0.08;

  for (const item of items) {
    const price = item.price * item.quantity;
    total += price;
  }

  const tax = total * taxRate;
  const grandTotal = total + tax;

  return {
    subtotal: total,
    tax: tax,
    total: grandTotal
  };
}

const cart = [
  { name: "Product A", price: 29.99, quantity: 2 },
  { name: "Product B", price: 49.99, quantity: 1 }
];

const result = calculateTotal(cart);
console.log("Total:", result.total);`;

const DEAD_CODE_SNIPPETS = [
  'if(false){console.log("unreachable")}',
  'var _0x0=function(){return null}',
  'void function(){}()',
  'typeof undefined=="undefined"&&void 0',
  'var _0x1=(function(){return!1})()',
  '!function(){}()',
];

export function JsObfuscator() {
  const { locale } = useI18n();
  const t = getJsObfuscatorTranslations(locale);

  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ObfuscatorOptions>({
    renameVariables: true,
    stringEncoding: true,
    deadCodeInjection: false,
    controlFlowFlattening: false,
    compactOutput: true,
  });
  const [error, setError] = useState('');

  const generateVarName = (index: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let name = '_0x';
    name += chars[index % 26];
    name += Math.floor(index / 26).toString(16);
    return name;
  };

  const encodeString = (str: string): string => {
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code > 127 || Math.random() > 0.5) {
        return '\\u' + code.toString(16).padStart(4, '0');
      }
      return char;
    }).join('');
  };

  const obfuscatedCode = useMemo(() => {
    if (!input.trim()) return '';
    setError('');

    try {
      // Basic syntax validation
      new Function(input);
    } catch (e) {
      setError(t.syntaxError);
      return '';
    }

    let code = input;

    // Rename variables (simple approach)
    if (options.renameVariables) {
      const varPattern = /\b(let|const|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      const variables = new Map<string, string>();
      let varIndex = 0;

      // Find all variable declarations
      let match;
      const varRegex = /\b(let|const|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = varRegex.exec(code)) !== null) {
        const varName = match[2];
        if (!variables.has(varName) && !['undefined', 'null', 'true', 'false', 'NaN', 'Infinity'].includes(varName)) {
          variables.set(varName, generateVarName(varIndex++));
        }
      }

      // Also find function parameters
      const paramRegex = /function\s*[a-zA-Z_$]*\s*\(([^)]*)\)/g;
      while ((match = paramRegex.exec(code)) !== null) {
        const params = match[1].split(',').map(p => p.trim()).filter(Boolean);
        for (const param of params) {
          const paramName = param.split('=')[0].trim();
          if (!variables.has(paramName)) {
            variables.set(paramName, generateVarName(varIndex++));
          }
        }
      }

      // Replace variables
      variables.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        code = code.replace(regex, newName);
      });
    }

    // Encode strings
    if (options.stringEncoding) {
      code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
        return '"' + encodeString(content) + '"';
      });
      code = code.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (match, content) => {
        return "'" + encodeString(content) + "'";
      });
    }

    // Dead code injection
    if (options.deadCodeInjection) {
      const lines = code.split('\n');
      const newLines: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (Math.random() > 0.7 && lines[i].trim()) {
          const deadCode = DEAD_CODE_SNIPPETS[Math.floor(Math.random() * DEAD_CODE_SNIPPETS.length)];
          newLines.push(deadCode + ';');
        }
      }
      code = newLines.join('\n');
    }

    // Control flow flattening (simplified)
    if (options.controlFlowFlattening) {
      // Wrap in IIFE
      code = `(function(){${code}})();`;

      // Add some control flow obfuscation
      code = code.replace(/if\s*\(/g, 'if(!!');
      code = code.replace(/return\s+/g, 'return void 0||');
    }

    // Compact output
    if (options.compactOutput) {
      // Remove comments
      code = code.replace(/\/\/.*$/gm, '');
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove extra whitespace
      code = code.replace(/\s+/g, ' ');
      code = code.replace(/\s*([{};,():])\s*/g, '$1');
      code = code.replace(/\s*([+\-*/%=<>!&|])\s*/g, '$1');
      code = code.trim();
    }

    return code;
  }, [input, options, t.syntaxError]);

  const statistics = useMemo(() => {
    if (!input || !obfuscatedCode) return null;
    const originalSize = new Blob([input]).size;
    const obfuscatedSize = new Blob([obfuscatedCode]).size;
    const increase = ((obfuscatedSize - originalSize) / originalSize * 100).toFixed(1);
    return { originalSize, obfuscatedSize, increase };
  }, [input, obfuscatedCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(obfuscatedCode);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_CODE);
  };

  const clearAll = () => {
    setInput('');
    setError('');
  };

  const toggleOption = (key: keyof ObfuscatorOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-400 mb-1">{t.warning}</h4>
        <p className="text-xs text-hub-muted">{t.warningText}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSample} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.loadSample}
        </button>
        <button onClick={clearAll} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.clearButton}
        </button>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { key: 'renameVariables' as const, label: t.renameVariables, help: t.renameVariablesHelp },
            { key: 'stringEncoding' as const, label: t.stringEncoding, help: t.stringEncodingHelp },
            { key: 'deadCodeInjection' as const, label: t.deadCodeInjection, help: t.deadCodeInjectionHelp },
            { key: 'controlFlowFlattening' as const, label: t.controlFlowFlattening, help: t.controlFlowFlatteningHelp },
            { key: 'compactOutput' as const, label: t.compactOutput, help: t.compactOutputHelp },
          ].map(opt => (
            <label key={opt.key} className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={() => toggleOption(opt.key)}
                className="mt-1 rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <div>
                <span className="text-sm text-white">{opt.label}</span>
                <p className="text-xs text-hub-muted">{opt.help}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={12}
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
              <div className="text-xl font-mono font-bold text-white">{statistics.originalSize}</div>
              <div className="text-xs text-hub-muted">{t.originalSize} ({t.bytes})</div>
            </div>
            <div>
              <div className="text-xl font-mono font-bold text-hub-accent">{statistics.obfuscatedSize}</div>
              <div className="text-xs text-hub-muted">{t.obfuscatedSize} ({t.bytes})</div>
            </div>
            <div>
              <div className={`text-xl font-mono font-bold ${Number(statistics.increase) > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                {Number(statistics.increase) > 0 ? '+' : ''}{statistics.increase}%
              </div>
              <div className="text-xs text-hub-muted">{t.sizeIncrease}</div>
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      {obfuscatedCode && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
            <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-80 overflow-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">{obfuscatedCode}</pre>
          </div>
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
