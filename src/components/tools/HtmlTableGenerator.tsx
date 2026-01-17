'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHtmlTableGeneratorTranslations } from '@/lib/i18n-html-table-generator';
import toast from 'react-hot-toast';

interface TableOptions {
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
  borderStyle: 'none' | 'solid' | 'dashed';
  borderCollapse: boolean;
  stripedRows: boolean;
  hoverEffect: boolean;
  textAlign: 'left' | 'center' | 'right';
  cellPadding: number;
  includeStyles: boolean;
  responsive: boolean;
  caption: string;
}

const DEFAULT_OPTIONS: TableOptions = {
  hasHeaderRow: true,
  hasHeaderColumn: false,
  borderStyle: 'solid',
  borderCollapse: true,
  stripedRows: false,
  hoverEffect: false,
  textAlign: 'left',
  cellPadding: 8,
  includeStyles: true,
  responsive: true,
  caption: '',
};

export function HtmlTableGenerator() {
  const { locale } = useI18n();
  const t = getHtmlTableGeneratorTranslations(locale);

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [data, setData] = useState<string[][]>(() =>
    Array(4).fill(null).map((_, r) =>
      Array(4).fill(null).map((_, c) => r === 0 ? `Header ${c + 1}` : `Cell ${r}-${c + 1}`)
    )
  );
  const [options, setOptions] = useState<TableOptions>(DEFAULT_OPTIONS);

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row] = [...newData[row]];
    newData[row][col] = value;
    setData(newData);
  };

  const addRow = () => {
    const newRow = Array(cols).fill('').map((_, c) => `Cell ${rows}-${c + 1}`);
    setData([...data, newRow]);
    setRows(rows + 1);
  };

  const addColumn = () => {
    const newData = data.map((row, r) => [...row, r === 0 ? `Header ${cols + 1}` : `Cell ${r}-${cols + 1}`]);
    setData(newData);
    setCols(cols + 1);
  };

  const removeRow = () => {
    if (rows > 1) {
      setData(data.slice(0, -1));
      setRows(rows - 1);
    }
  };

  const removeColumn = () => {
    if (cols > 1) {
      setData(data.map(row => row.slice(0, -1)));
      setCols(cols - 1);
    }
  };

  const clearTable = () => {
    setData(Array(rows).fill(null).map(() => Array(cols).fill('')));
  };

  const importCsv = () => {
    const input = prompt('Paste CSV data:');
    if (input) {
      const lines = input.trim().split('\n');
      const parsed = lines.map(line => line.split(',').map(cell => cell.trim()));
      setData(parsed);
      setRows(parsed.length);
      setCols(parsed[0]?.length || 1);
    }
  };

  const generatedHtml = useMemo(() => {
    let html = '';
    const indent = '  ';

    // Styles
    let styles = '';
    if (options.includeStyles) {
      styles = ` style="`;
      if (options.borderStyle !== 'none') {
        styles += `border: 1px ${options.borderStyle} #ccc; `;
      }
      if (options.borderCollapse) {
        styles += `border-collapse: collapse; `;
      }
      styles += `text-align: ${options.textAlign};"`;
    }

    // Wrapper for responsive
    if (options.responsive) {
      html += `<div style="overflow-x: auto;">\n`;
    }

    html += `<table${styles}>\n`;

    // Caption
    if (options.caption) {
      html += `${indent}<caption>${options.caption}</caption>\n`;
    }

    // Cell styles
    let cellStyle = '';
    if (options.includeStyles) {
      cellStyle = ` style="padding: ${options.cellPadding}px;`;
      if (options.borderStyle !== 'none') {
        cellStyle += ` border: 1px ${options.borderStyle} #ccc;`;
      }
      cellStyle += `"`;
    }

    // Header row
    if (options.hasHeaderRow) {
      html += `${indent}<thead>\n`;
      html += `${indent}${indent}<tr>\n`;
      data[0].forEach((cell, c) => {
        const tag = options.hasHeaderColumn && c === 0 ? 'th' : 'th';
        html += `${indent}${indent}${indent}<${tag}${cellStyle}>${cell}</${tag}>\n`;
      });
      html += `${indent}${indent}</tr>\n`;
      html += `${indent}</thead>\n`;
    }

    // Body
    html += `${indent}<tbody>\n`;
    const startRow = options.hasHeaderRow ? 1 : 0;
    for (let r = startRow; r < data.length; r++) {
      let rowStyle = '';
      if (options.includeStyles && options.stripedRows && (r - startRow) % 2 === 1) {
        rowStyle = ` style="background-color: #f9f9f9;"`;
      }
      html += `${indent}${indent}<tr${rowStyle}>\n`;
      data[r].forEach((cell, c) => {
        const tag = options.hasHeaderColumn && c === 0 ? 'th' : 'td';
        html += `${indent}${indent}${indent}<${tag}${cellStyle}>${cell}</${tag}>\n`;
      });
      html += `${indent}${indent}</tr>\n`;
    }
    html += `${indent}</tbody>\n`;

    html += `</table>`;

    if (options.responsive) {
      html += `\n</div>`;
    }

    return html;
  }, [data, options]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    toast.success(t.copied);
  };

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.dimensions}</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={addRow} className="px-3 py-1 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80">
            {t.addRow}
          </button>
          <button onClick={addColumn} className="px-3 py-1 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80">
            {t.addColumn}
          </button>
          <button onClick={removeRow} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.removeRow}
          </button>
          <button onClick={removeColumn} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.removeColumn}
          </button>
          <button onClick={clearTable} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.clearTable}
          </button>
          <button onClick={importCsv} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.importCsv}
          </button>
        </div>
        <div className="mt-2 text-sm text-hub-muted">
          {t.rows}: {rows} × {t.columns}: {cols}
        </div>
      </div>

      {/* Table Editor */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.tableData}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {data.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="p-1">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className={`w-full min-w-[100px] bg-hub-darker border border-hub-border rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-hub-accent ${
                          (options.hasHeaderRow && r === 0) || (options.hasHeaderColumn && c === 0)
                            ? 'font-bold'
                            : ''
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.styling}</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Checkboxes */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.hasHeaderRow}
              onChange={(e) => setOptions({ ...options, hasHeaderRow: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.headerRow}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.hasHeaderColumn}
              onChange={(e) => setOptions({ ...options, hasHeaderColumn: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.headerColumn}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.borderCollapse}
              onChange={(e) => setOptions({ ...options, borderCollapse: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.borderCollapse}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.stripedRows}
              onChange={(e) => setOptions({ ...options, stripedRows: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.stripedRows}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeStyles}
              onChange={(e) => setOptions({ ...options, includeStyles: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.includeStyles}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.responsive}
              onChange={(e) => setOptions({ ...options, responsive: e.target.checked })}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <span className="text-sm text-hub-muted">{t.responsive}</span>
          </label>
        </div>

        {/* Selects */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.borderStyle}</label>
            <select
              value={options.borderStyle}
              onChange={(e) => setOptions({ ...options, borderStyle: e.target.value as TableOptions['borderStyle'] })}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="none">{t.borderNone}</option>
              <option value="solid">{t.borderSolid}</option>
              <option value="dashed">{t.borderDashed}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.textAlign}</label>
            <select
              value={options.textAlign}
              onChange={(e) => setOptions({ ...options, textAlign: e.target.value as TableOptions['textAlign'] })}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="left">{t.alignLeft}</option>
              <option value="center">{t.alignCenter}</option>
              <option value="right">{t.alignRight}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.cellPadding}</label>
            <input
              type="number"
              min="0"
              max="32"
              value={options.cellPadding}
              onChange={(e) => setOptions({ ...options, cellPadding: parseInt(e.target.value) || 0 })}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.caption}</label>
          <input
            type="text"
            value={options.caption}
            onChange={(e) => setOptions({ ...options, caption: e.target.value })}
            placeholder={t.captionPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
        <div
          className="bg-white rounded-lg p-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: generatedHtml }}
        />
      </div>

      {/* Generated Code */}
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
