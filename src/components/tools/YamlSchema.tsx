'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getYamlSchemaTranslations } from '@/lib/i18n-yaml-schema';
import toast from 'react-hot-toast';
import yaml from 'js-yaml';

interface JsonSchema {
  $schema: string;
  title: string;
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  additionalProperties?: boolean;
}

function inferType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function generateSchemaFromValue(value: unknown, requireAll: boolean, allowAdditional: boolean): JsonSchema {
  const type = inferType(value);

  if (type === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [key, val] of Object.entries(obj)) {
      properties[key] = generateSchemaFromValue(val, requireAll, allowAdditional);
      if (requireAll) {
        required.push(key);
      }
    }

    const schema: JsonSchema = {
      $schema: '',
      title: '',
      type: 'object',
      properties,
    };

    if (required.length > 0) {
      schema.required = required;
    }

    schema.additionalProperties = allowAdditional;

    return schema;
  }

  if (type === 'array' && Array.isArray(value)) {
    if (value.length === 0) {
      return {
        $schema: '',
        title: '',
        type: 'array',
        items: { $schema: '', title: '', type: 'string' },
      };
    }

    // Infer from first item
    return {
      $schema: '',
      title: '',
      type: 'array',
      items: generateSchemaFromValue(value[0], requireAll, allowAdditional),
    };
  }

  if (type === 'number') {
    return {
      $schema: '',
      title: '',
      type: Number.isInteger(value as number) ? 'integer' : 'number',
    };
  }

  return {
    $schema: '',
    title: '',
    type,
  };
}

function generateSchema(data: unknown, title: string, requireAll: boolean, allowAdditional: boolean): JsonSchema {
  const schema = generateSchemaFromValue(data, requireAll, allowAdditional);

  // Clean up nested schemas
  const cleanSchema = (s: JsonSchema): Record<string, unknown> => {
    const result: Record<string, unknown> = { type: s.type };

    if (s.properties) {
      result.properties = Object.fromEntries(
        Object.entries(s.properties).map(([k, v]) => [k, cleanSchema(v)])
      );
    }
    if (s.items) {
      result.items = cleanSchema(s.items);
    }
    if (s.required && s.required.length > 0) {
      result.required = s.required;
    }
    if (s.additionalProperties !== undefined) {
      result.additionalProperties = s.additionalProperties;
    }

    return result;
  };

  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: title || 'GeneratedSchema',
    ...cleanSchema(schema),
  } as JsonSchema;
}

function parseInput(input: string): unknown {
  // Try JSON first
  try {
    return JSON.parse(input);
  } catch {
    // Try YAML
    return yaml.load(input);
  }
}

export function YamlSchema() {
  const { locale } = useI18n();
  const t = getYamlSchemaTranslations(locale);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [schemaTitle, setSchemaTitle] = useState('');
  const [requireAllProps, setRequireAllProps] = useState(true);
  const [additionalProps, setAdditionalProps] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const data = parseInput(input);
      const schema = generateSchema(data, schemaTitle, requireAllProps, additionalProps);
      setOutput(JSON.stringify(schema, null, 2));
      toast.success(t.generatedSuccess);
    } catch {
      toast.error(t.invalidInput);
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

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.schemaTitle}</label>
            <input
              type="text"
              value={schemaTitle}
              onChange={(e) => setSchemaTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="bg-hub-darker border border-hub-border rounded-lg px-3 py-2 focus:outline-none focus:border-hub-accent"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={requireAllProps}
              onChange={(e) => setRequireAllProps(e.target.checked)}
              className="w-4 h-4 accent-hub-accent"
            />
            <span className="text-sm">{t.requireAllProps}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={additionalProps}
              onChange={(e) => setAdditionalProps(e.target.checked)}
              className="w-4 h-4 accent-hub-accent"
            />
            <span className="text-sm">{t.additionalProps}</span>
          </label>
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
            placeholder={t.inputPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {t.generateButton}
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
            <h3 className="text-lg font-semibold">{t.schemaLabel}</h3>
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
            {output || <span className="text-hub-muted">{t.schemaPlaceholder}</span>}
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
