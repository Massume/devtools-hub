'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsonCsvTranslations } from '@/lib/i18n-json-csv';
import toast from 'react-hot-toast';

type Mode = 'jsonToCsv' | 'csvToJson';
type Delimiter = ',' | ';' | '\t';

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[newKey] = '';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

function jsonToCsv(jsonStr: string, delimiter: Delimiter, includeHeaders: boolean, flatten: boolean): string {
  const data = JSON.parse(jsonStr);

  if (!Array.isArray(data)) {
    throw new Error('notArray');
  }

  if (data.length === 0) {
    return '';
  }

  const processedData = flatten
    ? data.map(item => flattenObject(item as Record<string, unknown>))
    : data;

  // Get all unique keys
  const allKeys = new Set<string>();
  processedData.forEach((item: Record<string, unknown>) => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  const headers = Array.from(allKeys);

  // Escape function for CSV
  const escapeValue = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows: string[] = [];

  if (includeHeaders) {
    rows.push(headers.map(h => escapeValue(h)).join(delimiter));
  }

  processedData.forEach((item: Record<string, unknown>) => {
    const row = headers.map(header => escapeValue(item[header]));
    rows.push(row.join(delimiter));
  });

  return rows.join('\n');
}

function csvToJson(csvStr: string, delimiter: Delimiter): string {
  const lines = csvStr.trim().split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error('invalidCsv');
  }

  // Parse CSV line respecting quoted values
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  };

  const headers = parseLine(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });

    data.push(obj);
  }

  return JSON.stringify(data, null, 2);
}

export function JsonCsv() {
  const { locale } = useI18n();
  const t = getJsonCsvTranslations(locale);

  const [mode, setMode] = useState<Mode>('jsonToCsv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flattenObjects, setFlattenObjects] = useState(false);

  const handleJsonToCsv = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = jsonToCsv(input, delimiter, includeHeaders, flattenObjects);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch (error) {
      if ((error as Error).message === 'notArray') {
        toast.error(t.notArray);
      } else {
        toast.error(t.invalidJson);
      }
    }
  };

  const handleCsvToJson = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = csvToJson(input, delimiter);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidCsv);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleProcess = () => {
    if (mode === 'jsonToCsv') {
      handleJsonToCsv();
    } else {
      handleCsvToJson();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('jsonToCsv'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'jsonToCsv'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.jsonToCsv}
        </button>
        <button
          onClick={() => { setMode('csvToJson'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'csvToJson'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.csvToJson}
        </button>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.delimiter}</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delimiter)}
              className="bg-hub-darker border border-hub-border rounded-lg px-3 py-2 focus:outline-none focus:border-hub-accent"
            >
              <option value=",">{t.comma}</option>
              <option value=";">{t.semicolon}</option>
              <option value={'\t'}>{t.tab}</option>
            </select>
          </div>

          {mode === 'jsonToCsv' && (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="w-4 h-4 accent-hub-accent"
                />
                <span className="text-sm">{t.includeHeaders}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flattenObjects}
                  onChange={(e) => setFlattenObjects(e.target.checked)}
                  className="w-4 h-4 accent-hub-accent"
                />
                <span className="text-sm">{t.flattenObjects}</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'jsonToCsv' ? t.jsonPlaceholder : t.csvPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'jsonToCsv' ? t.jsonToCsvButton : t.csvToJsonButton}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.clearButton}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.outputLabel}</h3>
            {output && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                {t.copyButton}
              </button>
            )}
          </div>

          <div className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto whitespace-pre">
            {output || <span className="text-hub-muted">...</span>}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
