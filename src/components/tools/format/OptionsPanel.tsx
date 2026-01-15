'use client';

import { useState } from 'react';
import { DataFormat, ConversionOptions } from '@/types/format';
import { getFormatTranslations } from '@/lib/i18n-format';
import { useI18n } from '@/lib/i18n-context';

interface OptionsPanelProps {
  inputFormat: DataFormat;
  outputFormat: DataFormat;
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

export function OptionsPanel({
  inputFormat,
  outputFormat,
  options,
  onChange,
}: OptionsPanelProps) {
  const { locale } = useI18n();
  const t = getFormatTranslations(locale);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const updateOption = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  // Determine which options to show based on formats
  const showJsonOptions = inputFormat === 'json' || outputFormat === 'json';
  const showYamlOptions = outputFormat === 'yaml';
  const showXmlOptions = outputFormat === 'xml';
  const showCsvOptions = inputFormat === 'csv' || outputFormat === 'csv';

  const hasOptions = showJsonOptions || showYamlOptions || showXmlOptions || showCsvOptions;

  if (!hasOptions) {
    return null;
  }

  return (
    <div className="bg-hub-card border border-hub-border rounded-lg overflow-hidden transition-all duration-200">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-6 py-4 flex items-center justify-between
                   hover:bg-hub-border/30 transition-colors duration-200
                   group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <h3 className="text-lg font-semibold text-white">
            {t.optionsTitle}
          </h3>
        </div>

        <svg
          className={`w-5 h-5 text-hub-muted transition-transform duration-200 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
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
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-6 pb-6 space-y-6 animate-[slideUp_0.3s_ease-out]">
          {/* JSON Options */}
          {showJsonOptions && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
                JSON {t.optionsTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* JSON Indentation */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.jsonIndent}
                  </label>
                  <select
                    value={options.jsonIndent}
                    onChange={(e) => updateOption('jsonIndent', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-hub-dark border border-hub-border rounded-lg
                               text-white text-sm
                               focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                               transition-all duration-200"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </div>

                {/* JSON Sort Keys */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={options.jsonSortKeys}
                        onChange={(e) => updateOption('jsonSortKeys', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-hub-dark border border-hub-border rounded-full
                                      peer-checked:bg-hub-accent peer-checked:border-hub-accent
                                      transition-all duration-200
                                      peer-focus:ring-2 peer-focus:ring-hub-accent/20"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-hub-muted rounded-full
                                      peer-checked:translate-x-5 peer-checked:bg-hub-dark
                                      transition-transform duration-200"></div>
                    </div>
                    <span className="text-sm text-hub-muted group-hover:text-white transition-colors">
                      {t.jsonSortKeys}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* YAML Options */}
          {showYamlOptions && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
                YAML {t.optionsTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* YAML Indentation */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.yamlIndent}
                  </label>
                  <select
                    value={options.yamlIndent}
                    onChange={(e) => updateOption('yamlIndent', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-hub-dark border border-hub-border rounded-lg
                               text-white text-sm
                               focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                               transition-all duration-200"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </div>

                {/* YAML Line Width */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.yamlLineWidth}: {options.yamlLineWidth}
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={120}
                    step={10}
                    value={options.yamlLineWidth}
                    onChange={(e) => updateOption('yamlLineWidth', Number(e.target.value))}
                    className="w-full h-2 bg-hub-dark border border-hub-border rounded-lg
                               appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-4
                               [&::-webkit-slider-thumb]:h-4
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-hub-accent
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-webkit-slider-thumb]:transition-transform"
                  />
                </div>
              </div>
            </div>
          )}

          {/* XML Options */}
          {showXmlOptions && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
                XML {t.optionsTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* XML Indentation */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.xmlIndent}
                  </label>
                  <input
                    type="text"
                    value={options.xmlIndent}
                    onChange={(e) => updateOption('xmlIndent', e.target.value)}
                    className="w-full px-4 py-2 bg-hub-dark border border-hub-border rounded-lg
                               text-white text-sm font-mono
                               focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                               transition-all duration-200"
                    placeholder="  "
                  />
                </div>

                {/* XML Root Name */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.xmlRootName}
                  </label>
                  <input
                    type="text"
                    value={options.xmlRootName}
                    onChange={(e) => updateOption('xmlRootName', e.target.value)}
                    className="w-full px-4 py-2 bg-hub-dark border border-hub-border rounded-lg
                               text-white text-sm font-mono
                               focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                               transition-all duration-200"
                    placeholder="root"
                  />
                </div>

                {/* XML Declaration */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={options.xmlDeclaration}
                        onChange={(e) => updateOption('xmlDeclaration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-hub-dark border border-hub-border rounded-full
                                      peer-checked:bg-hub-accent peer-checked:border-hub-accent
                                      transition-all duration-200
                                      peer-focus:ring-2 peer-focus:ring-hub-accent/20"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-hub-muted rounded-full
                                      peer-checked:translate-x-5 peer-checked:bg-hub-dark
                                      transition-transform duration-200"></div>
                    </div>
                    <span className="text-sm text-hub-muted group-hover:text-white transition-colors">
                      {t.xmlDeclaration}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* CSV Options */}
          {showCsvOptions && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
                CSV {t.optionsTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CSV Delimiter */}
                <div>
                  <label className="block text-sm text-hub-muted mb-2">
                    {t.csvDelimiter}
                  </label>
                  <select
                    value={options.csvDelimiter}
                    onChange={(e) => updateOption('csvDelimiter', e.target.value)}
                    className="w-full px-4 py-2 bg-hub-dark border border-hub-border rounded-lg
                               text-white text-sm
                               focus:outline-none focus:border-hub-accent focus:ring-2 focus:ring-hub-accent/20
                               transition-all duration-200"
                  >
                    <option value=",">{t.delimiterComma}</option>
                    <option value=";">{t.delimiterSemicolon}</option>
                    <option value="\t">{t.delimiterTab}</option>
                    <option value="|">{t.delimiterPipe}</option>
                  </select>
                </div>

                {/* CSV Header */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={options.csvHeader}
                        onChange={(e) => updateOption('csvHeader', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-hub-dark border border-hub-border rounded-full
                                      peer-checked:bg-hub-accent peer-checked:border-hub-accent
                                      transition-all duration-200
                                      peer-focus:ring-2 peer-focus:ring-hub-accent/20"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-hub-muted rounded-full
                                      peer-checked:translate-x-5 peer-checked:bg-hub-dark
                                      transition-transform duration-200"></div>
                    </div>
                    <span className="text-sm text-hub-muted group-hover:text-white transition-colors">
                      {t.csvHeader}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
