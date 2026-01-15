'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsonFormdataTranslations } from '@/lib/i18n-json-formdata';
import toast from 'react-hot-toast';

type Mode = 'jsonToForm' | 'formToJson';

function flattenToFormData(obj: unknown, parentKey = '', encode: boolean): string[] {
  const pairs: string[] = [];

  if (obj === null || obj === undefined) {
    return pairs;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : String(index);
      pairs.push(...flattenToFormData(item, key, encode));
    });
  } else if (typeof obj === 'object') {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;
      pairs.push(...flattenToFormData(value, newKey, encode));
    });
  } else {
    const value = String(obj);
    if (encode) {
      pairs.push(`${encodeURIComponent(parentKey)}=${encodeURIComponent(value)}`);
    } else {
      pairs.push(`${parentKey}=${value}`);
    }
  }

  return pairs;
}

function jsonToFormData(jsonStr: string, encode: boolean): string {
  const obj = JSON.parse(jsonStr);

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('mustBeObject');
  }

  const pairs = flattenToFormData(obj, '', encode);
  return pairs.join('\n');
}

function formDataToJson(formStr: string): string {
  // Support both newline-separated and &-separated formats
  const normalized = formStr.includes('&') && !formStr.includes('\n')
    ? formStr.split('&').join('\n')
    : formStr;

  const lines = normalized.split('\n').filter(line => line.trim());
  const result: Record<string, unknown> = {};

  for (const line of lines) {
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const rawKey = line.slice(0, eqIndex);
    const rawValue = line.slice(eqIndex + 1);

    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);

    // Parse nested keys like "user[name]" or "items[0][id]"
    const parts = key.split(/[\[\]]/).filter(Boolean);

    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const isNextArray = /^\d+$/.test(nextPart);

      if (!(part in current)) {
        current[part] = isNextArray ? [] : {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  return JSON.stringify(result, null, 2);
}

export function JsonFormdata() {
  const { locale } = useI18n();
  const t = getJsonFormdataTranslations(locale);

  const [mode, setMode] = useState<Mode>('jsonToForm');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeValues, setEncodeValues] = useState(true);

  const handleJsonToForm = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = jsonToFormData(input, encodeValues);
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

  const handleFormToJson = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = formDataToJson(input);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidForm);
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
    if (mode === 'jsonToForm') {
      handleJsonToForm();
    } else {
      handleFormToJson();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('jsonToForm'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'jsonToForm'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.jsonToForm}
        </button>
        <button
          onClick={() => { setMode('formToJson'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'formToJson'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.formToJson}
        </button>
      </div>

      {/* Options */}
      {mode === 'jsonToForm' && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={encodeValues}
              onChange={(e) => setEncodeValues(e.target.checked)}
              className="w-4 h-4 accent-hub-accent"
            />
            <span className="text-sm">{t.encodeValues}</span>
          </label>
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
            placeholder={mode === 'jsonToForm' ? t.jsonPlaceholder : t.formPlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'jsonToForm' ? t.jsonToFormButton : t.formToJsonButton}
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

          <div className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto whitespace-pre">
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
