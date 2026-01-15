'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getXmlJsonTranslations } from '@/lib/i18n-xml-json';
import toast from 'react-hot-toast';

type Mode = 'xmlToJson' | 'jsonToXml';

function xmlToJson(xmlStr: string, preserveAttributes: boolean): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'text/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML');
  }

  function nodeToObj(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Handle attributes
    if (preserveAttributes && node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj[`@${attr.name}`] = attr.value;
      }
    }

    // Handle child nodes
    const children = Array.from(node.childNodes);
    const textContent = children
      .filter(child => child.nodeType === Node.TEXT_NODE)
      .map(child => child.textContent?.trim())
      .filter(Boolean)
      .join('');

    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      // Simple text node
      if (Object.keys(obj).length === 0) {
        return textContent || '';
      }
      obj['#text'] = textContent;
    } else {
      // Element children
      const elementChildren = children.filter(child => child.nodeType === Node.ELEMENT_NODE) as Element[];

      // Group by tag name
      const grouped: Record<string, unknown[]> = {};
      elementChildren.forEach(child => {
        const name = child.tagName;
        if (!grouped[name]) {
          grouped[name] = [];
        }
        grouped[name].push(nodeToObj(child));
      });

      // Convert to object, using arrays only for multiple same-named elements
      Object.entries(grouped).forEach(([name, values]) => {
        obj[name] = values.length === 1 ? values[0] : values;
      });

      if (textContent && elementChildren.length > 0) {
        obj['#text'] = textContent;
      }
    }

    return Object.keys(obj).length === 0 ? '' : obj;
  }

  const root = doc.documentElement;
  const result = { [root.tagName]: nodeToObj(root) };

  return JSON.stringify(result, null, 2);
}

function jsonToXml(jsonStr: string, indent: boolean): string {
  const obj = JSON.parse(jsonStr);

  function objToXml(data: unknown, tagName: string, level: number): string {
    const indentStr = indent ? '  '.repeat(level) : '';
    const newline = indent ? '\n' : '';

    if (data === null || data === undefined) {
      return `${indentStr}<${tagName}/>${newline}`;
    }

    if (typeof data !== 'object') {
      return `${indentStr}<${tagName}>${escapeXml(String(data))}</${tagName}>${newline}`;
    }

    if (Array.isArray(data)) {
      return data.map(item => objToXml(item, tagName, level)).join('');
    }

    const record = data as Record<string, unknown>;
    const attrs: string[] = [];
    const children: string[] = [];
    let textContent = '';

    Object.entries(record).forEach(([key, value]) => {
      if (key.startsWith('@')) {
        attrs.push(`${key.slice(1)}="${escapeXml(String(value))}"`);
      } else if (key === '#text') {
        textContent = escapeXml(String(value));
      } else {
        children.push(objToXml(value, key, level + 1));
      }
    });

    const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

    if (children.length === 0 && !textContent) {
      return `${indentStr}<${tagName}${attrStr}/>${newline}`;
    }

    if (children.length === 0) {
      return `${indentStr}<${tagName}${attrStr}>${textContent}</${tagName}>${newline}`;
    }

    return `${indentStr}<${tagName}${attrStr}>${newline}${children.join('')}${textContent ? indentStr + '  ' + textContent + newline : ''}${indentStr}</${tagName}>${newline}`;
  }

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    throw new Error('JSON must have a single root element');
  }

  const rootTag = keys[0];
  return `<?xml version="1.0" encoding="UTF-8"?>\n${objToXml(obj[rootTag], rootTag, 0)}`.trim();
}

export function XmlJson() {
  const { locale } = useI18n();
  const t = getXmlJsonTranslations(locale);

  const [mode, setMode] = useState<Mode>('xmlToJson');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preserveAttributes, setPreserveAttributes] = useState(true);
  const [indentOutput, setIndentOutput] = useState(true);

  const handleXmlToJson = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = xmlToJson(input, preserveAttributes);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidXml);
    }
  };

  const handleJsonToXml = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = jsonToXml(input, indentOutput);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidJson);
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
    if (mode === 'xmlToJson') {
      handleXmlToJson();
    } else {
      handleJsonToXml();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('xmlToJson'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'xmlToJson'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.xmlToJson}
        </button>
        <button
          onClick={() => { setMode('jsonToXml'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'jsonToXml'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.jsonToXml}
        </button>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex flex-wrap gap-6 items-center">
          {mode === 'xmlToJson' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveAttributes}
                onChange={(e) => setPreserveAttributes(e.target.checked)}
                className="w-4 h-4 accent-hub-accent"
              />
              <span className="text-sm">{t.preserveAttributes}</span>
            </label>
          )}

          {mode === 'jsonToXml' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={indentOutput}
                onChange={(e) => setIndentOutput(e.target.checked)}
                className="w-4 h-4 accent-hub-accent"
              />
              <span className="text-sm">{t.indent}</span>
            </label>
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
            placeholder={mode === 'xmlToJson' ? t.xmlPlaceholder : t.jsonPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'xmlToJson' ? t.xmlToJsonButton : t.jsonToXmlButton}
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
