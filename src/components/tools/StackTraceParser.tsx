'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getStackTraceParserTranslations } from '@/lib/i18n-stack-trace-parser';
import toast from 'react-hot-toast';

interface StackFrame {
  function: string;
  file: string;
  line: number | null;
  column: number | null;
  isNative: boolean;
  isAnonymous: boolean;
}

interface ParsedTrace {
  errorType: string;
  errorMessage: string;
  frames: StackFrame[];
}

const SAMPLE_TRACE = `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.tsx:42:18)
    at finishClassComponent (node_modules/react-dom/cjs/react-dom.development.js:17485:31)
    at updateClassComponent (node_modules/react-dom/cjs/react-dom.development.js:17435:24)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19073:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:3945:14)
    at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:3994:16)
    at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4056:31)
    at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:23964:7)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:22776:12)
    at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:22707:5)`;

export function StackTraceParser() {
  const { locale } = useI18n();
  const t = getStackTraceParserTranslations(locale);

  const [input, setInput] = useState('');
  const [hideNodeModules, setHideNodeModules] = useState(false);
  const [expandedFrames, setExpandedFrames] = useState<Set<number>>(new Set());

  const parsed = useMemo((): ParsedTrace | null => {
    if (!input.trim()) return null;

    const lines = input.trim().split('\n');
    const frames: StackFrame[] = [];
    let errorType = '';
    let errorMessage = '';

    // Parse first line for error type and message
    const firstLine = lines[0];
    const errorMatch = firstLine.match(/^(\w+Error|TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|Error):\s*(.*)$/);
    if (errorMatch) {
      errorType = errorMatch[1];
      errorMessage = errorMatch[2];
    } else {
      errorMessage = firstLine;
    }

    // Parse stack frames (JavaScript/Node.js format)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('at ')) continue;

      const frameText = line.slice(3).trim();

      // Pattern: functionName (file:line:column)
      // or: file:line:column
      // or: functionName (<anonymous>)
      let func = '';
      let file = '';
      let lineNum: number | null = null;
      let column: number | null = null;
      let isNative = false;
      let isAnonymous = false;

      // Check for native code
      if (frameText.includes('[native code]') || frameText.includes('<native>')) {
        func = frameText.replace(/\s*\[native code\]|\s*<native>/, '').trim();
        isNative = true;
      } else {
        // Try to parse "functionName (location)" format
        const funcMatch = frameText.match(/^(.+?)\s+\((.+)\)$/);
        if (funcMatch) {
          func = funcMatch[1];
          const location = funcMatch[2];

          if (location === '<anonymous>') {
            isAnonymous = true;
          } else {
            const locMatch = location.match(/^(.+):(\d+):(\d+)$/);
            if (locMatch) {
              file = locMatch[1];
              lineNum = parseInt(locMatch[2]);
              column = parseInt(locMatch[3]);
            } else {
              file = location;
            }
          }
        } else {
          // Just a location
          const locMatch = frameText.match(/^(.+):(\d+):(\d+)$/);
          if (locMatch) {
            file = locMatch[1];
            lineNum = parseInt(locMatch[2]);
            column = parseInt(locMatch[3]);
          } else {
            func = frameText;
          }
        }
      }

      frames.push({
        function: func || t.anonymous,
        file,
        line: lineNum,
        column,
        isNative,
        isAnonymous,
      });
    }

    return { errorType, errorMessage, frames };
  }, [input, t.anonymous]);

  const filteredFrames = useMemo(() => {
    if (!parsed) return [];
    if (!hideNodeModules) return parsed.frames;
    return parsed.frames.filter(f => !f.file.includes('node_modules'));
  }, [parsed, hideNodeModules]);

  const statistics = useMemo(() => {
    if (!parsed) return null;
    const uniqueFiles = new Set(parsed.frames.map(f => f.file).filter(Boolean));
    const nativeFrames = parsed.frames.filter(f => f.isNative).length;
    return {
      totalFrames: parsed.frames.length,
      uniqueFiles: uniqueFiles.size,
      nativeFrames,
    };
  }, [parsed]);

  const loadSample = () => {
    setInput(SAMPLE_TRACE);
  };

  const clearInput = () => {
    setInput('');
  };

  const toggleFrame = (index: number) => {
    const newExpanded = new Set(expandedFrames);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFrames(newExpanded);
  };

  const expandAll = () => {
    setExpandedFrames(new Set(filteredFrames.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedFrames(new Set());
  };

  const copyAsJson = async () => {
    if (!parsed) return;
    await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    toast.success(t.copied);
  };

  const copyAsMarkdown = async () => {
    if (!parsed) return;
    let md = `## ${parsed.errorType}: ${parsed.errorMessage}\n\n`;
    md += `| # | Function | File | Line |\n`;
    md += `|---|----------|------|------|\n`;
    parsed.frames.forEach((f, i) => {
      md += `| ${i + 1} | \`${f.function}\` | ${f.file || '-'} | ${f.line || '-'} |\n`;
    });
    await navigator.clipboard.writeText(md);
    toast.success(t.copied);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSample} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.loadSample}
        </button>
        <button onClick={clearInput} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
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

      {/* Parsed Result */}
      {parsed && (
        <>
          {/* Error Info */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            {parsed.errorType && (
              <div className="text-sm text-red-400 font-mono mb-1">{parsed.errorType}</div>
            )}
            <div className="text-white font-medium">{parsed.errorMessage}</div>
          </div>

          {/* Statistics */}
          {statistics && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-hub-muted mb-3">{t.statistics}</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-mono font-bold text-white">{statistics.totalFrames}</div>
                  <div className="text-xs text-hub-muted">{t.totalFrames}</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-hub-accent">{statistics.uniqueFiles}</div>
                  <div className="text-xs text-hub-muted">{t.uniqueFiles}</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">{statistics.nativeFrames}</div>
                  <div className="text-xs text-hub-muted">{t.nativeFrames}</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideNodeModules}
                onChange={(e) => setHideNodeModules(e.target.checked)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{t.hideNodeModules}</span>
            </label>
            <div className="flex gap-2">
              <button onClick={expandAll} className="text-xs text-hub-accent hover:underline">{t.expandAll}</button>
              <button onClick={collapseAll} className="text-xs text-hub-accent hover:underline">{t.collapseAll}</button>
              <button onClick={copyAsJson} className="text-xs text-hub-accent hover:underline">{t.copyJson}</button>
              <button onClick={copyAsMarkdown} className="text-xs text-hub-accent hover:underline">{t.copyMarkdown}</button>
            </div>
          </div>

          {/* Stack Frames */}
          <div className="bg-hub-card border border-hub-border rounded-lg divide-y divide-hub-border">
            <h3 className="text-sm font-medium text-hub-muted p-4">{t.frames}</h3>
            {filteredFrames.map((frame, index) => (
              <div
                key={index}
                className="p-3 hover:bg-hub-darker/50 cursor-pointer"
                onClick={() => toggleFrame(index)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs text-hub-muted font-mono w-6">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono ${frame.isNative ? 'text-yellow-400' : frame.isAnonymous ? 'text-hub-muted' : 'text-cyan-400'}`}>
                        {frame.function}
                      </span>
                      {frame.isNative && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1 rounded">{t.native}</span>}
                    </div>
                    {frame.file && (
                      <div className="text-xs text-hub-muted font-mono mt-1 truncate">
                        {frame.file}
                        {frame.line && <span className="text-hub-accent">:{frame.line}</span>}
                        {frame.column && <span className="text-hub-muted">:{frame.column}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {expandedFrames.has(index) && (
                  <div className="mt-3 ml-9 p-3 bg-hub-darker rounded-lg text-xs font-mono space-y-1">
                    <div><span className="text-hub-muted">{t.function}:</span> <span className="text-white">{frame.function}</span></div>
                    <div><span className="text-hub-muted">{t.file}:</span> <span className="text-white">{frame.file || t.unknown}</span></div>
                    <div><span className="text-hub-muted">{t.line}:</span> <span className="text-white">{frame.line || t.unknown}</span></div>
                    <div><span className="text-hub-muted">{t.column}:</span> <span className="text-white">{frame.column || t.unknown}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
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
