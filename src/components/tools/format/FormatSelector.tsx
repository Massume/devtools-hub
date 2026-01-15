'use client';

import { DataFormat, FORMAT_LABELS } from '@/types/format';

interface FormatSelectorProps {
  value: DataFormat;
  onChange: (format: DataFormat) => void;
  label: string;
  disabled?: boolean;
}

const formatIcons: Record<DataFormat, string> = {
  json: '{ }',
  yaml: '📋',
  xml: '< >',
  csv: '📊',
  toml: '⚙️',
};

const formats: DataFormat[] = ['json', 'yaml', 'xml', 'csv', 'toml'];

export function FormatSelector({ value, onChange, label, disabled = false }: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-hub-muted">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as DataFormat)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-hub-card border border-hub-border rounded-lg
                     text-white font-mono text-sm
                     focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     appearance-none cursor-pointer
                     hover:border-hub-accent/50"
        >
          {formats.map((format) => (
            <option key={format} value={format}>
              {formatIcons[format]} {FORMAT_LABELS[format]}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-hub-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
