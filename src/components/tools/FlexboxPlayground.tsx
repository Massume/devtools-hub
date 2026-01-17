'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getFlexboxPlaygroundTranslations } from '@/lib/i18n-flexbox-playground';
import toast from 'react-hot-toast';

interface FlexItem {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
];

export function FlexboxPlayground() {
  const { locale } = useI18n();
  const t = getFlexboxPlaygroundTranslations(locale);

  // Container properties
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [alignContent, setAlignContent] = useState('stretch');
  const [gap, setGap] = useState(10);

  // Items
  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
    { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
    { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
  ]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [nextId, setNextId] = useState(4);

  const addItem = () => {
    if (items.length < 10) {
      setItems([...items, { id: nextId, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }]);
      setNextId(nextId + 1);
    }
  };

  const removeItem = () => {
    if (items.length > 1) {
      const newItems = items.slice(0, -1);
      setItems(newItems);
      if (selectedItem && !newItems.find(i => i.id === selectedItem)) {
        setSelectedItem(null);
      }
    }
  };

  const updateItem = (id: number, field: keyof FlexItem, value: number | string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const selectedItemData = items.find(i => i.id === selectedItem);

  const generateContainerCss = (): string => {
    const lines = [
      'display: flex;',
      `flex-direction: ${flexDirection};`,
      `justify-content: ${justifyContent};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${flexWrap};`,
    ];
    if (flexWrap !== 'nowrap') {
      lines.push(`align-content: ${alignContent};`);
    }
    if (gap > 0) {
      lines.push(`gap: ${gap}px;`);
    }
    return lines.join('\n');
  };

  const generateItemCss = (item: FlexItem): string => {
    const lines: string[] = [];
    if (item.flexGrow !== 0) lines.push(`flex-grow: ${item.flexGrow};`);
    if (item.flexShrink !== 1) lines.push(`flex-shrink: ${item.flexShrink};`);
    if (item.flexBasis !== 'auto') lines.push(`flex-basis: ${item.flexBasis};`);
    if (item.alignSelf !== 'auto') lines.push(`align-self: ${item.alignSelf};`);
    if (item.order !== 0) lines.push(`order: ${item.order};`);
    return lines.join('\n');
  };

  const fullCss = `/* Container */\n.container {\n  ${generateContainerCss().split('\n').join('\n  ')}\n}${items.some(i => generateItemCss(i)) ? '\n\n/* Items with custom properties */\n' + items.filter(i => generateItemCss(i)).map((item, idx) => `.item-${idx + 1} {\n  ${generateItemCss(item).split('\n').join('\n  ')}\n}`).join('\n\n') : ''}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
    toast.success(t.copied);
  };

  const handleReset = () => {
    setFlexDirection('row');
    setJustifyContent('flex-start');
    setAlignItems('stretch');
    setFlexWrap('nowrap');
    setAlignContent('stretch');
    setGap(10);
    setItems([
      { id: nextId, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
      { id: nextId + 1, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
      { id: nextId + 2, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
    ]);
    setNextId(nextId + 3);
    setSelectedItem(null);
  };

  const PropertySelect = ({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="block text-xs text-hub-muted mb-1 font-mono">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1.5 text-sm text-white"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm font-medium text-hub-muted mb-4">{t.preview}</label>
        <div
          className="min-h-64 bg-hub-darker rounded-lg p-4 transition-all"
          style={{
            display: 'flex',
            flexDirection: flexDirection as 'row' | 'column' | 'row-reverse' | 'column-reverse',
            justifyContent,
            alignItems,
            flexWrap: flexWrap as 'nowrap' | 'wrap' | 'wrap-reverse',
            alignContent,
            gap: `${gap}px`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-all ${selectedItem === item.id ? 'ring-2 ring-white ring-offset-2 ring-offset-hub-darker' : ''}`}
              style={{
                backgroundColor: COLORS[index % COLORS.length],
                minWidth: '60px',
                minHeight: '60px',
                padding: '20px',
                borderRadius: '8px',
                flexGrow: item.flexGrow,
                flexShrink: item.flexShrink,
                flexBasis: item.flexBasis,
                alignSelf: item.alignSelf as 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
                order: item.order,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Item Count */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-hub-muted">{t.itemCount}: {items.length}</span>
        <button
          onClick={addItem}
          disabled={items.length >= 10}
          className="px-3 py-1 text-sm bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors disabled:opacity-50"
        >
          {t.addItem}
        </button>
        <button
          onClick={removeItem}
          disabled={items.length <= 1}
          className="px-3 py-1 text-sm bg-hub-card border border-hub-border text-white rounded hover:border-hub-accent/50 transition-colors disabled:opacity-50"
        >
          {t.removeItem}
        </button>
      </div>

      {/* Container Properties */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4">{t.container}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <PropertySelect
            label={t.flexDirection}
            value={flexDirection}
            onChange={setFlexDirection}
            options={[
              { value: 'row', label: t.flexDirectionRow },
              { value: 'row-reverse', label: t.flexDirectionRowReverse },
              { value: 'column', label: t.flexDirectionColumn },
              { value: 'column-reverse', label: t.flexDirectionColumnReverse },
            ]}
          />
          <PropertySelect
            label={t.justifyContent}
            value={justifyContent}
            onChange={setJustifyContent}
            options={[
              { value: 'flex-start', label: t.justifyFlexStart },
              { value: 'flex-end', label: t.justifyFlexEnd },
              { value: 'center', label: t.justifyCenter },
              { value: 'space-between', label: t.justifySpaceBetween },
              { value: 'space-around', label: t.justifySpaceAround },
              { value: 'space-evenly', label: t.justifySpaceEvenly },
            ]}
          />
          <PropertySelect
            label={t.alignItems}
            value={alignItems}
            onChange={setAlignItems}
            options={[
              { value: 'flex-start', label: t.alignFlexStart },
              { value: 'flex-end', label: t.alignFlexEnd },
              { value: 'center', label: t.alignCenter },
              { value: 'stretch', label: t.alignStretch },
              { value: 'baseline', label: t.alignBaseline },
            ]}
          />
          <PropertySelect
            label={t.flexWrap}
            value={flexWrap}
            onChange={setFlexWrap}
            options={[
              { value: 'nowrap', label: t.flexWrapNowrap },
              { value: 'wrap', label: t.flexWrapWrap },
              { value: 'wrap-reverse', label: t.flexWrapWrapReverse },
            ]}
          />
          {flexWrap !== 'nowrap' && (
            <PropertySelect
              label={t.alignContent}
              value={alignContent}
              onChange={setAlignContent}
              options={[
                { value: 'flex-start', label: t.alignFlexStart },
                { value: 'flex-end', label: t.alignFlexEnd },
                { value: 'center', label: t.alignCenter },
                { value: 'stretch', label: t.alignStretch },
                { value: 'space-between', label: t.justifySpaceBetween },
                { value: 'space-around', label: t.justifySpaceAround },
              ]}
            />
          )}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-hub-muted font-mono">{t.gap}</label>
              <span className="text-xs text-hub-accent font-mono">{gap}{t.px}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
          </div>
        </div>
      </div>

      {/* Item Properties */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4">{t.itemSettings}</h3>
        {selectedItem && selectedItemData ? (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted font-mono">{t.flexGrow}</label>
                <span className="text-xs text-hub-accent font-mono">{selectedItemData.flexGrow}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={selectedItemData.flexGrow}
                onChange={(e) => updateItem(selectedItem, 'flexGrow', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted font-mono">{t.flexShrink}</label>
                <span className="text-xs text-hub-accent font-mono">{selectedItemData.flexShrink}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={selectedItemData.flexShrink}
                onChange={(e) => updateItem(selectedItem, 'flexShrink', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-hub-muted mb-1 font-mono">{t.flexBasis}</label>
              <input
                type="text"
                value={selectedItemData.flexBasis}
                onChange={(e) => updateItem(selectedItem, 'flexBasis', e.target.value)}
                placeholder="auto, 100px, 50%"
                className="w-full bg-hub-darker border border-hub-border rounded px-2 py-1.5 text-sm text-white font-mono"
              />
            </div>
            <PropertySelect
              label={t.alignSelf}
              value={selectedItemData.alignSelf}
              onChange={(v) => updateItem(selectedItem, 'alignSelf', v)}
              options={[
                { value: 'auto', label: t.auto },
                { value: 'flex-start', label: t.alignFlexStart },
                { value: 'flex-end', label: t.alignFlexEnd },
                { value: 'center', label: t.alignCenter },
                { value: 'stretch', label: t.alignStretch },
                { value: 'baseline', label: t.alignBaseline },
              ]}
            />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-hub-muted font-mono">{t.order}</label>
                <span className="text-xs text-hub-accent font-mono">{selectedItemData.order}</span>
              </div>
              <input
                type="range"
                min={-5}
                max={5}
                value={selectedItemData.order}
                onChange={(e) => updateItem(selectedItem, 'order', parseInt(e.target.value))}
                className="w-full accent-hub-accent"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-hub-muted">{t.selectItem}</p>
        )}
      </div>

      {/* Actions */}
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-hub-card border border-hub-border text-white rounded-lg hover:border-hub-accent/50 transition-colors"
      >
        {t.reset}
      </button>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
          <button
            onClick={handleCopy}
            className="text-sm text-hub-accent hover:underline"
          >
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 whitespace-pre-wrap max-h-64 overflow-auto">
          {fullCss}
        </div>
      </div>

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
