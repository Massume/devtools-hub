'use client';

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { DataFormat } from '@/types/format';

interface EditorPanelProps {
  value: string;
  onChange?: (value: string) => void;
  format: DataFormat;
  readOnly?: boolean;
  placeholder?: string;
}

// Map formats to Monaco Editor languages
const formatToLanguage: Record<DataFormat, string> = {
  json: 'json',
  yaml: 'yaml',
  xml: 'xml',
  csv: 'plaintext',
  toml: 'plaintext',
};

export function EditorPanel({
  value,
  onChange,
  format,
  readOnly = false,
  placeholder = '',
}: EditorPanelProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full bg-hub-card border border-hub-border rounded-lg overflow-hidden
                 transition-all duration-200
                 group hover:border-hub-accent/30"
    >
      {/* Glow effect on focus */}
      <div className="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 border-2 border-hub-accent/20 rounded-lg glow-accent"></div>
      </div>

      {/* Editor */}
      <div className="h-full">
        {value || !readOnly ? (
          <Editor
            height="100%"
            defaultLanguage={formatToLanguage[format]}
            language={formatToLanguage[format]}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              scrollBeyondLastLine: false,
              renderLineHighlight: 'line',
              contextmenu: true,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              padding: { top: 16, bottom: 16 },
              fontFamily: 'JetBrains Mono, monospace',
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-hub-muted text-center font-mono text-sm">
              {placeholder}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
