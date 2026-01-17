'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHtmlListGeneratorTranslations } from '@/lib/i18n-html-list-generator';
import toast from 'react-hot-toast';

type ListType = 'ul' | 'ol' | 'dl';

interface ListItem {
  id: string;
  content: string;
  term?: string; // For dl
  nested?: ListItem[];
}

interface ListOptions {
  listStyleType: string;
  startNumber: number;
  reversed: boolean;
  includeStyles: boolean;
}

const DEFAULT_OPTIONS: ListOptions = {
  listStyleType: 'disc',
  startNumber: 1,
  reversed: false,
  includeStyles: false,
};

const SAMPLE_ITEMS: ListItem[] = [
  { id: '1', content: 'First item', nested: [] },
  { id: '2', content: 'Second item', nested: [
    { id: '2-1', content: 'Nested item 1', nested: [] },
    { id: '2-2', content: 'Nested item 2', nested: [] },
  ]},
  { id: '3', content: 'Third item', nested: [] },
];

export function HtmlListGenerator() {
  const { locale } = useI18n();
  const t = getHtmlListGeneratorTranslations(locale);

  const [listType, setListType] = useState<ListType>('ul');
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', content: '', term: '', nested: [] },
  ]);
  const [options, setOptions] = useState<ListOptions>(DEFAULT_OPTIONS);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), content: '', term: '', nested: [] }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: 'content' | 'term', value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addNestedItem = (parentId: string) => {
    setItems(items.map(item =>
      item.id === parentId
        ? { ...item, nested: [...(item.nested || []), { id: Date.now().toString(), content: '', nested: [] }] }
        : item
    ));
  };

  const updateNestedItem = (parentId: string, nestedId: string, value: string) => {
    setItems(items.map(item =>
      item.id === parentId
        ? {
            ...item,
            nested: item.nested?.map(n => n.id === nestedId ? { ...n, content: value } : n)
          }
        : item
    ));
  };

  const removeNestedItem = (parentId: string, nestedId: string) => {
    setItems(items.map(item =>
      item.id === parentId
        ? { ...item, nested: item.nested?.filter(n => n.id !== nestedId) }
        : item
    ));
  };

  const loadSample = () => {
    setItems(SAMPLE_ITEMS);
  };

  const clearAll = () => {
    setItems([{ id: '1', content: '', term: '', nested: [] }]);
  };

  const generatedHtml = useMemo(() => {
    const indent = '  ';
    const filteredItems = items.filter(item => item.content || item.term);

    if (filteredItems.length === 0) return '';

    const renderItems = (itemList: ListItem[], level: number = 0): string => {
      const baseIndent = indent.repeat(level + 1);
      let html = '';

      itemList.forEach(item => {
        if (!item.content && !item.term) return;

        if (listType === 'dl') {
          if (item.term) html += `${baseIndent}<dt>${item.term}</dt>\n`;
          if (item.content) html += `${baseIndent}<dd>${item.content}</dd>\n`;
        } else {
          html += `${baseIndent}<li>${item.content}`;
          if (item.nested && item.nested.length > 0) {
            const nestedFiltered = item.nested.filter(n => n.content);
            if (nestedFiltered.length > 0) {
              html += `\n${baseIndent}${indent}<${listType}>\n`;
              html += renderItems(nestedFiltered, level + 2);
              html += `${baseIndent}${indent}</${listType}>\n${baseIndent}`;
            }
          }
          html += `</li>\n`;
        }
      });

      return html;
    };

    let tag = listType;
    let attrs = '';

    if (listType === 'ol') {
      if (options.startNumber !== 1) attrs += ` start="${options.startNumber}"`;
      if (options.reversed) attrs += ' reversed';
    }

    if (options.includeStyles && listType !== 'dl') {
      attrs += ` style="list-style-type: ${options.listStyleType};"`;
    }

    let html = `<${tag}${attrs}>\n`;
    html += renderItems(filteredItems);
    html += `</${tag}>`;

    return html;
  }, [items, listType, options]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    toast.success(t.copied);
  };

  const styleOptions = listType === 'ul'
    ? [
        { value: 'disc', label: t.styleDisc },
        { value: 'circle', label: t.styleCircle },
        { value: 'square', label: t.styleSquare },
        { value: 'none', label: t.styleNone },
      ]
    : [
        { value: 'decimal', label: t.styleDecimal },
        { value: 'lower-alpha', label: t.styleLowerAlpha },
        { value: 'upper-alpha', label: t.styleUpperAlpha },
        { value: 'lower-roman', label: t.styleLowerRoman },
        { value: 'upper-roman', label: t.styleUpperRoman },
        { value: 'none', label: t.styleNone },
      ];

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSample} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.loadSample}
        </button>
        <button onClick={clearAll} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
          {t.clearAll}
        </button>
      </div>

      {/* List Type */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.listType}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'ul' as const, label: t.typeUnordered },
            { value: 'ol' as const, label: t.typeOrdered },
            { value: 'dl' as const, label: t.typeDescription },
          ].map(type => (
            <button
              key={type.value}
              onClick={() => setListType(type.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                listType === type.value
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Options (for ol/ul) */}
      {listType !== 'dl' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{listType === 'ol' ? t.orderedOptions : t.styling}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.listStyleType}</label>
              <select
                value={options.listStyleType}
                onChange={(e) => setOptions({ ...options, listStyleType: e.target.value })}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
              >
                {styleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {listType === 'ol' && (
              <>
                <div>
                  <label className="block text-sm text-hub-muted mb-1">{t.startNumber}</label>
                  <input
                    type="number"
                    value={options.startNumber}
                    onChange={(e) => setOptions({ ...options, startNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.reversed}
                      onChange={(e) => setOptions({ ...options, reversed: e.target.checked })}
                      className="rounded border-hub-border bg-hub-darker accent-hub-accent"
                    />
                    <span className="text-sm text-hub-muted">{t.reversed}</span>
                  </label>
                </div>
              </>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeStyles}
              onChange={(e) => setOptions({ ...options, includeStyles: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.includeStyles}</span>
          </label>
        </div>
      )}

      {/* Items Editor */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-hub-muted">{t.items}</h3>

        {items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex gap-2">
              {listType === 'dl' && (
                <input
                  type="text"
                  value={item.term || ''}
                  onChange={(e) => updateItem(item.id, 'term', e.target.value)}
                  placeholder={t.termPlaceholder}
                  className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                />
              )}
              <input
                type="text"
                value={item.content}
                onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                placeholder={listType === 'dl' ? t.descriptionPlaceholder : t.itemPlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              {listType !== 'dl' && (
                <button
                  onClick={() => addNestedItem(item.id)}
                  className="px-3 py-2 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50"
                >
                  {t.addNested}
                </button>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="px-3 py-2 text-sm text-red-400 hover:text-red-300"
              >
                {t.removeItem}
              </button>
            </div>

            {/* Nested items */}
            {item.nested && item.nested.length > 0 && (
              <div className="ml-8 space-y-2">
                {item.nested.map(nested => (
                  <div key={nested.id} className="flex gap-2">
                    <input
                      type="text"
                      value={nested.content}
                      onChange={(e) => updateNestedItem(item.id, nested.id, e.target.value)}
                      placeholder={t.itemPlaceholder}
                      className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                    />
                    <button
                      onClick={() => removeNestedItem(item.id, nested.id)}
                      className="px-3 py-2 text-sm text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addItem}
          className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80"
        >
          {t.addItem}
        </button>
      </div>

      {/* Preview */}
      {generatedHtml && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div
            className="bg-white rounded-lg p-4 text-black"
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
          />
        </div>
      )}

      {/* Generated Code */}
      {generatedHtml && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
              {t.copyButton}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">{generatedHtml}</code>
          </pre>
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
