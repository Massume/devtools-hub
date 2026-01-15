'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DataFormat, ConversionOptions, DEFAULT_OPTIONS, FORMAT_EXTENSIONS } from '@/types/format';
import { convert } from '@/lib/format';
import { getFormatTranslations } from '@/lib/i18n-format';
import { useI18n } from '@/lib/i18n-context';
import { FormatSelector } from './format/FormatSelector';
import { EditorPanel } from './format/EditorPanel';
import { OptionsPanel } from './format/OptionsPanel';

export function FormatConverter() {
  const { locale } = useI18n();
  const t = getFormatTranslations(locale);

  // State management
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [inputFormat, setInputFormat] = useState<DataFormat>('json');
  const [outputFormat, setOutputFormat] = useState<DataFormat>('yaml');
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Handle conversion
  const handleConvert = () => {
    if (!input.trim()) {
      setError(t.emptyInput);
      return;
    }

    setIsConverting(true);
    setError(null);

    // Small delay to show loading state
    setTimeout(() => {
      const result = convert(input, inputFormat, outputFormat, options);

      if (result.success && result.output) {
        setOutput(result.output);
        setError(null);
        toast.success(t.conversionSuccess, {
          duration: 2000,
          position: 'bottom-center',
          style: {
            background: 'var(--hub-card)',
            color: '#fff',
            border: '1px solid var(--hub-accent)',
            padding: '12px 20px',
            borderRadius: '8px',
          },
          iconTheme: {
            primary: 'var(--hub-accent)',
            secondary: '#fff',
          },
        });
      } else {
        setError(result.error || t.invalidFormat);
        setOutput('');
      }

      setIsConverting(false);
    }, 100);
  };

  // Handle clear
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  // Handle swap formats
  const handleSwap = () => {
    const tempFormat = inputFormat;
    setInputFormat(outputFormat);
    setOutputFormat(tempFormat);

    const tempContent = input;
    setInput(output);
    setOutput(tempContent);

    setError(null);
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setError(null);
      toast.success(t.copied.replace('!', 'd!'), {
        duration: 1500,
        position: 'bottom-center',
        style: {
          background: 'var(--hub-card)',
          color: '#fff',
          border: '1px solid var(--hub-border)',
          padding: '12px 20px',
          borderRadius: '8px',
        },
      });
    } catch (err) {
      toast.error('Failed to paste from clipboard', {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied, {
        duration: 1500,
        position: 'bottom-center',
        style: {
          background: 'var(--hub-card)',
          color: '#fff',
          border: '1px solid var(--hub-accent)',
          padding: '12px 20px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: 'var(--hub-accent)',
          secondary: '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard', {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted${FORMAT_EXTENSIONS[outputFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('File downloaded!', {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: 'var(--hub-card)',
        color: '#fff',
        border: '1px solid var(--hub-accent)',
        padding: '12px 20px',
        borderRadius: '8px',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex px-4 py-1.5 bg-hub-accent/10 border border-hub-accent/20 rounded-full">
          <span className="text-hub-accent text-sm font-medium">Format Converter</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          <span className="gradient-text">Convert</span>{' '}
          <span className="text-white">Your Data</span>
        </h1>

        <p className="text-lg text-hub-muted max-w-2xl mx-auto">
          Transform between JSON, YAML, XML, CSV, and TOML formats with real-time preview and customizable options
        </p>
      </div>

      {/* Format Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <FormatSelector
          value={inputFormat}
          onChange={setInputFormat}
          label={t.inputLabel + ' ' + t.formatJson.replace('JSON', 'Format')}
        />

        <FormatSelector
          value={outputFormat}
          onChange={setOutputFormat}
          label={t.outputLabel + ' ' + t.formatJson.replace('JSON', 'Format')}
        />
      </div>

      {/* Editors Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        {/* Input Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
              {t.inputLabel}
            </h3>
            <button
              onClick={handlePaste}
              className="px-3 py-1.5 text-xs font-medium text-hub-muted hover:text-white
                         border border-hub-border hover:border-hub-accent/50
                         rounded-md transition-all duration-200
                         flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t.pasteButton}
            </button>
          </div>
          <div className="flex-1">
            <EditorPanel
              value={input}
              onChange={setInput}
              format={inputFormat}
              placeholder={t.inputPlaceholder}
            />
          </div>
        </div>

        {/* Output Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-hub-accent uppercase tracking-wider">
              {t.outputLabel}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="px-3 py-1.5 text-xs font-medium text-hub-muted hover:text-white
                           border border-hub-border hover:border-hub-accent/50
                           rounded-md transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {t.copyButton}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="px-3 py-1.5 text-xs font-medium text-hub-muted hover:text-white
                           border border-hub-border hover:border-hub-accent/50
                           rounded-md transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.downloadButton}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <EditorPanel
              value={output}
              format={outputFormat}
              readOnly
              placeholder={t.outputPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleConvert}
          disabled={!input || isConverting}
          className="px-8 py-3 bg-hub-accent hover:bg-hub-accent-dim text-hub-dark
                     font-semibold rounded-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     hover:scale-105 active:scale-95
                     shadow-lg hover:shadow-hub-accent/30"
        >
          {isConverting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {t.convertButton}
            </span>
          )}
        </button>

        <button
          onClick={handleSwap}
          disabled={!input && !output}
          className="px-6 py-3 bg-hub-card hover:bg-hub-border text-white
                     font-semibold rounded-lg border border-hub-border hover:border-hub-accent/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {t.swapButton}
        </button>

        <button
          onClick={handleClear}
          disabled={!input && !output}
          className="px-6 py-3 bg-hub-card hover:bg-hub-border text-white
                     font-semibold rounded-lg border border-hub-border hover:border-hub-error/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t.clearButton}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto animate-[slideUp_0.3s_ease-out]">
          <div className="p-4 bg-hub-error/10 border border-hub-error/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{t.conversionError}</h3>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-hub-muted hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Options Panel */}
      <div className="max-w-4xl mx-auto">
        <OptionsPanel
          inputFormat={inputFormat}
          outputFormat={outputFormat}
          options={options}
          onChange={setOptions}
        />
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto pt-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-hub-card border border-hub-border rounded-lg
                         hover:border-hub-accent/50 transition-all duration-200
                         group"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-hub-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-hub-muted group-hover:text-white transition-colors">
                  {feature}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
