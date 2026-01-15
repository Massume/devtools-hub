'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsonQuerystringTranslations } from '@/lib/i18n-json-querystring';
import toast from 'react-hot-toast';

type Mode = 'jsonToQuery' | 'queryToJson';

function jsonToQueryString(jsonStr: string, encode: boolean, flattenArrays: boolean): string {
  const obj = JSON.parse(jsonStr);

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('mustBeObject');
  }

  const params: string[] = [];

  const addParam = (key: string, value: unknown) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      if (flattenArrays) {
        value.forEach((item, index) => {
          addParam(`${key}[${index}]`, item);
        });
      } else {
        value.forEach(item => {
          addParam(key, item);
        });
      }
    } else if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        addParam(`${key}[${k}]`, v);
      });
    } else {
      const strValue = String(value);
      params.push(`${encode ? encodeURIComponent(key) : key}=${encode ? encodeURIComponent(strValue) : strValue}`);
    }
  };

  Object.entries(obj).forEach(([key, value]) => {
    addParam(key, value);
  });

  return params.join('&');
}

function queryStringToJson(queryStr: string): string {
  // Remove leading ? if present
  const cleaned = queryStr.startsWith('?') ? queryStr.slice(1) : queryStr;

  if (!cleaned.trim()) {
    return '{}';
  }

  const result: Record<string, unknown> = {};

  const pairs = cleaned.split('&');

  for (const pair of pairs) {
    if (!pair) continue;

    const [rawKey, rawValue = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);

    // Handle array notation like key[0] or key[]
    const arrayMatch = key.match(/^(.+?)\[(\d*)\]$/);
    const objectMatch = key.match(/^(.+?)\[(.+?)\]$/);

    if (arrayMatch) {
      const [, baseKey, index] = arrayMatch;
      if (!result[baseKey]) {
        result[baseKey] = [];
      }
      if (Array.isArray(result[baseKey])) {
        if (index) {
          (result[baseKey] as unknown[])[parseInt(index, 10)] = value;
        } else {
          (result[baseKey] as unknown[]).push(value);
        }
      }
    } else if (objectMatch) {
      const [, baseKey, subKey] = objectMatch;
      if (!result[baseKey]) {
        result[baseKey] = {};
      }
      if (typeof result[baseKey] === 'object' && !Array.isArray(result[baseKey])) {
        (result[baseKey] as Record<string, unknown>)[subKey] = value;
      }
    } else {
      // Check if key already exists (multiple values = array)
      if (key in result) {
        if (Array.isArray(result[key])) {
          (result[key] as unknown[]).push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }
  }

  return JSON.stringify(result, null, 2);
}

export function JsonQuerystring() {
  const { locale } = useI18n();
  const t = getJsonQuerystringTranslations(locale);

  const [mode, setMode] = useState<Mode>('jsonToQuery');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeValues, setEncodeValues] = useState(true);
  const [flattenArrays, setFlattenArrays] = useState(false);

  const handleJsonToQuery = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = jsonToQueryString(input, encodeValues, flattenArrays);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch (error) {
      if ((error as Error).message === 'mustBeObject') {
        toast.error(t.mustBeObject);
      } else {
        toast.error(t.invalidJson);
      }
    }
  };

  const handleQueryToJson = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = queryStringToJson(input);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidQuery);
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
    if (mode === 'jsonToQuery') {
      handleJsonToQuery();
    } else {
      handleQueryToJson();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('jsonToQuery'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'jsonToQuery'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.jsonToQuery}
        </button>
        <button
          onClick={() => { setMode('queryToJson'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'queryToJson'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.queryToJson}
        </button>
      </div>

      {/* Options */}
      {mode === 'jsonToQuery' && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-4">
          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={encodeValues}
                onChange={(e) => setEncodeValues(e.target.checked)}
                className="w-4 h-4 accent-hub-accent"
              />
              <span className="text-sm">{t.encodeValues}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flattenArrays}
                onChange={(e) => setFlattenArrays(e.target.checked)}
                className="w-4 h-4 accent-hub-accent"
              />
              <span className="text-sm">{t.flattenArrays}</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'jsonToQuery' ? t.jsonPlaceholder : t.queryPlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'jsonToQuery' ? t.jsonToQueryButton : t.queryToJsonButton}
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

          <div className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto whitespace-pre-wrap break-all">
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
