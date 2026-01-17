'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getGridGeneratorTranslations } from '@/lib/i18n-grid-generator';
import toast from 'react-hot-toast';

interface GridItem {
  id: number;
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
  color: string;
}

interface GridSettings {
  columns: number;
  rows: number;
  columnGap: number;
  rowGap: number;
  columnTemplate: string;
  rowTemplate: string;
  justifyItems: string;
  alignItems: string;
  justifyContent: string;
  alignContent: string;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

const DEFAULT_SETTINGS: GridSettings = {
  columns: 3,
  rows: 3,
  columnGap: 10,
  rowGap: 10,
  columnTemplate: '',
  rowTemplate: '',
  justifyItems: 'stretch',
  alignItems: 'stretch',
  justifyContent: 'start',
  alignContent: 'start',
};

export function GridGenerator() {
  const { locale } = useI18n();
  const t = getGridGeneratorTranslations(locale);

  const [settings, setSettings] = useState<GridSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<GridItem[]>([
    { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[0] },
    { id: 2, colStart: 2, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[1] },
    { id: 3, colStart: 3, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[2] },
    { id: 4, colStart: 1, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[3] },
    { id: 5, colStart: 2, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[4] },
    { id: 6, colStart: 3, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[5] },
  ]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const updateSetting = (key: keyof GridSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateItem = (id: number, key: keyof GridItem, value: number | string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [key]: value } : item
    ));
  };

  const addItem = () => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    setItems([...items, {
      id: newId,
      colStart: 1,
      rowStart: 1,
      colSpan: 1,
      rowSpan: 1,
      color: COLORS[newId % COLORS.length],
    }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'basic':
        setSettings({
          ...DEFAULT_SETTINGS,
          columns: 3,
          rows: 3,
        });
        setItems([
          { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[0] },
          { id: 2, colStart: 2, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[1] },
          { id: 3, colStart: 3, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[2] },
          { id: 4, colStart: 1, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[3] },
          { id: 5, colStart: 2, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[4] },
          { id: 6, colStart: 3, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[5] },
          { id: 7, colStart: 1, rowStart: 3, colSpan: 1, rowSpan: 1, color: COLORS[6] },
          { id: 8, colStart: 2, rowStart: 3, colSpan: 1, rowSpan: 1, color: COLORS[7] },
          { id: 9, colStart: 3, rowStart: 3, colSpan: 1, rowSpan: 1, color: COLORS[8] },
        ]);
        break;
      case 'holyGrail':
        setSettings({
          ...DEFAULT_SETTINGS,
          columns: 3,
          rows: 3,
          columnTemplate: '200px 1fr 200px',
          rowTemplate: 'auto 1fr auto',
        });
        setItems([
          { id: 1, colStart: 1, rowStart: 1, colSpan: 3, rowSpan: 1, color: COLORS[0] },
          { id: 2, colStart: 1, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[1] },
          { id: 3, colStart: 2, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[2] },
          { id: 4, colStart: 3, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[3] },
          { id: 5, colStart: 1, rowStart: 3, colSpan: 3, rowSpan: 1, color: COLORS[4] },
        ]);
        break;
      case 'cards':
        setSettings({
          ...DEFAULT_SETTINGS,
          columns: 3,
          rows: 2,
          columnGap: 20,
          rowGap: 20,
          columnTemplate: 'repeat(3, 1fr)',
        });
        setItems([
          { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[0] },
          { id: 2, colStart: 2, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[1] },
          { id: 3, colStart: 3, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[2] },
          { id: 4, colStart: 1, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[3] },
          { id: 5, colStart: 2, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[4] },
          { id: 6, colStart: 3, rowStart: 2, colSpan: 1, rowSpan: 1, color: COLORS[5] },
        ]);
        break;
      case 'sidebar':
        setSettings({
          ...DEFAULT_SETTINGS,
          columns: 2,
          rows: 1,
          columnTemplate: '250px 1fr',
        });
        setItems([
          { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[0] },
          { id: 2, colStart: 2, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[1] },
        ]);
        break;
      case 'masonry':
        setSettings({
          ...DEFAULT_SETTINGS,
          columns: 3,
          rows: 4,
          columnGap: 15,
          rowGap: 15,
        });
        setItems([
          { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 2, color: COLORS[0] },
          { id: 2, colStart: 2, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[1] },
          { id: 3, colStart: 3, rowStart: 1, colSpan: 1, rowSpan: 3, color: COLORS[2] },
          { id: 4, colStart: 2, rowStart: 2, colSpan: 1, rowSpan: 2, color: COLORS[3] },
          { id: 5, colStart: 1, rowStart: 3, colSpan: 1, rowSpan: 2, color: COLORS[4] },
          { id: 6, colStart: 2, rowStart: 4, colSpan: 2, rowSpan: 1, color: COLORS[5] },
        ]);
        break;
    }
    setSelectedItem(null);
  };

  const cssCode = useMemo(() => {
    const containerLines = ['display: grid;'];

    const colTemplate = settings.columnTemplate || `repeat(${settings.columns}, 1fr)`;
    const rowTemplate = settings.rowTemplate || `repeat(${settings.rows}, 1fr)`;

    containerLines.push(`grid-template-columns: ${colTemplate};`);
    containerLines.push(`grid-template-rows: ${rowTemplate};`);
    containerLines.push(`gap: ${settings.rowGap}px ${settings.columnGap}px;`);

    if (settings.justifyItems !== 'stretch') {
      containerLines.push(`justify-items: ${settings.justifyItems};`);
    }
    if (settings.alignItems !== 'stretch') {
      containerLines.push(`align-items: ${settings.alignItems};`);
    }
    if (settings.justifyContent !== 'start') {
      containerLines.push(`justify-content: ${settings.justifyContent};`);
    }
    if (settings.alignContent !== 'start') {
      containerLines.push(`align-content: ${settings.alignContent};`);
    }

    let code = `.container {\n  ${containerLines.join('\n  ')}\n}`;

    items.forEach((item, idx) => {
      const itemLines: string[] = [];
      if (item.colStart !== 1 || item.colSpan !== 1) {
        itemLines.push(`grid-column: ${item.colStart} / span ${item.colSpan};`);
      }
      if (item.rowStart !== 1 || item.rowSpan !== 1) {
        itemLines.push(`grid-row: ${item.rowStart} / span ${item.rowSpan};`);
      }
      if (itemLines.length > 0) {
        code += `\n\n.item-${idx + 1} {\n  ${itemLines.join('\n  ')}\n}`;
      }
    });

    return code;
  }, [settings, items]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    toast.success(t.copied);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setItems([
      { id: 1, colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1, color: COLORS[0] },
    ]);
    setSelectedItem(null);
  };

  const alignOptions = ['start', 'end', 'center', 'stretch'];
  const contentOptions = ['start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.presets}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'basic', label: t.presetBasic },
            { key: 'holyGrail', label: t.presetHolyGrail },
            { key: 'cards', label: t.presetCards },
            { key: 'sidebar', label: t.presetSidebar },
            { key: 'masonry', label: t.presetMasonry },
          ].map(preset => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset.key)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.previewLabel}</h3>
        <div
          className="bg-hub-darker rounded-lg p-4 min-h-[300px]"
          style={{
            display: 'grid',
            gridTemplateColumns: settings.columnTemplate || `repeat(${settings.columns}, 1fr)`,
            gridTemplateRows: settings.rowTemplate || `repeat(${settings.rows}, 1fr)`,
            gap: `${settings.rowGap}px ${settings.columnGap}px`,
            justifyItems: settings.justifyItems as React.CSSProperties['justifyItems'],
            alignItems: settings.alignItems as React.CSSProperties['alignItems'],
            justifyContent: settings.justifyContent as React.CSSProperties['justifyContent'],
            alignContent: settings.alignContent as React.CSSProperties['alignContent'],
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`rounded-lg flex items-center justify-center font-bold text-white cursor-pointer transition-all ${
                selectedItem === item.id ? 'ring-2 ring-white ring-offset-2 ring-offset-hub-darker' : ''
              }`}
              style={{
                backgroundColor: item.color,
                gridColumn: `${item.colStart} / span ${item.colSpan}`,
                gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                minHeight: '60px',
              }}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Container Settings */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.containerLabel}</h3>
          <button
            onClick={handleReset}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.resetButton}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.columns}</label>
            <input
              type="number"
              min={1}
              max={12}
              value={settings.columns}
              onChange={(e) => updateSetting('columns', parseInt(e.target.value) || 1)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.rows}</label>
            <input
              type="number"
              min={1}
              max={12}
              value={settings.rows}
              onChange={(e) => updateSetting('rows', parseInt(e.target.value) || 1)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.columnGap}</label>
            <input
              type="number"
              min={0}
              max={50}
              value={settings.columnGap}
              onChange={(e) => updateSetting('columnGap', parseInt(e.target.value) || 0)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.rowGap}</label>
            <input
              type="number"
              min={0}
              max={50}
              value={settings.rowGap}
              onChange={(e) => updateSetting('rowGap', parseInt(e.target.value) || 0)}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.columnTemplate}</label>
            <input
              type="text"
              value={settings.columnTemplate}
              onChange={(e) => updateSetting('columnTemplate', e.target.value)}
              placeholder={t.templatePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-hub-muted">{t.rowTemplate}</label>
            <input
              type="text"
              value={settings.rowTemplate}
              onChange={(e) => updateSetting('rowTemplate', e.target.value)}
              placeholder={t.templatePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            { key: 'justifyItems', label: t.justifyItems, options: alignOptions },
            { key: 'alignItems', label: t.alignItems, options: alignOptions },
            { key: 'justifyContent', label: t.justifyContent, options: contentOptions },
            { key: 'alignContent', label: t.alignContent, options: contentOptions },
          ].map(prop => (
            <div key={prop.key} className="space-y-2">
              <label className="text-sm text-hub-muted">{prop.label}</label>
              <select
                value={settings[prop.key as keyof GridSettings] as string}
                onChange={(e) => updateSetting(prop.key as keyof GridSettings, e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded px-3 py-2 text-sm"
              >
                {prop.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.itemsLabel}</h3>
          <button
            onClick={addItem}
            className="text-sm px-3 py-1 bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors"
          >
            {t.addItem}
          </button>
        </div>

        {selectedItem && (
          <div className="bg-hub-darker rounded-lg p-4 mb-4">
            {(() => {
              const item = items.find(i => i.id === selectedItem);
              if (!item) return null;
              return (
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-hub-muted">{t.itemColumn}</label>
                    <input
                      type="number"
                      min={1}
                      max={settings.columns}
                      value={item.colStart}
                      onChange={(e) => updateItem(item.id, 'colStart', parseInt(e.target.value) || 1)}
                      className="w-full bg-hub-dark border border-hub-border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-hub-muted">{t.itemRow}</label>
                    <input
                      type="number"
                      min={1}
                      max={settings.rows}
                      value={item.rowStart}
                      onChange={(e) => updateItem(item.id, 'rowStart', parseInt(e.target.value) || 1)}
                      className="w-full bg-hub-dark border border-hub-border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-hub-muted">{t.itemColSpan}</label>
                    <input
                      type="number"
                      min={1}
                      max={settings.columns - item.colStart + 1}
                      value={item.colSpan}
                      onChange={(e) => updateItem(item.id, 'colSpan', parseInt(e.target.value) || 1)}
                      className="w-full bg-hub-dark border border-hub-border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-hub-muted">{t.itemRowSpan}</label>
                    <input
                      type="number"
                      min={1}
                      max={settings.rows - item.rowStart + 1}
                      value={item.rowSpan}
                      onChange={(e) => updateItem(item.id, 'rowSpan', parseInt(e.target.value) || 1)}
                      className="w-full bg-hub-dark border border-hub-border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      {t.removeItem}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <p className="text-xs text-hub-muted">
          {locale === 'ru' ? 'Нажмите на элемент в предпросмотре, чтобы редактировать' : 'Click on an item in preview to edit'}
        </p>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.cssOutput}</label>
          <button
            onClick={handleCopy}
            className="text-sm text-hub-accent hover:underline"
          >
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-64 overflow-auto">
          <code className="text-sm text-green-400 font-mono whitespace-pre">{cssCode}</code>
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
