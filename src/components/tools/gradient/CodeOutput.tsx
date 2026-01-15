'use client';

import { useState } from 'react';
import { Gradient, OutputFormat } from '@/types/gradient';
import { gradientToCSS } from '@/lib/gradient/gradientToCSS';
import { gradientToSCSS } from '@/lib/gradient/gradientToSCSS';
import { gradientToTailwind } from '@/lib/gradient/gradientToTailwind';
import { gradientToCSSVar } from '@/lib/gradient/gradientToCSSVar';

interface CodeOutputProps {
  gradient: Gradient;
  outputFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  translations: {
    code: string;
    formatCss: string;
    formatScss: string;
    formatTailwind: string;
    formatCssVar: string;
    copyCode: string;
    downloadCode: string;
    copied: string;
  };
}

export function CodeOutput({
  gradient,
  outputFormat,
  onFormatChange,
  translations,
}: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (outputFormat) {
      case 'css':
        return gradientToCSS(gradient);
      case 'scss':
        return gradientToSCSS(gradient);
      case 'tailwind':
        return gradientToTailwind(gradient);
      case 'cssvar':
        return gradientToCSSVar(gradient);
    }
  };

  const getFileExtension = () => {
    switch (outputFormat) {
      case 'css':
        return '.css';
      case 'scss':
        return '.scss';
      case 'tailwind':
        return '.txt';
      case 'cssvar':
        return '.css';
    }
  };

  const code = getCode();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient${getFileExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formats: { id: OutputFormat; label: string }[] = [
    { id: 'css', label: translations.formatCss },
    { id: 'scss', label: translations.formatScss },
    { id: 'tailwind', label: translations.formatTailwind },
    { id: 'cssvar', label: translations.formatCssVar },
  ];

  return (
    <div className="bg-hub-card border border-hub-border rounded-xl overflow-hidden">
      {/* Header with Format Tabs and Actions */}
      <div className="p-4 border-b border-hub-border space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-white">{translations.code}</h3>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="
                px-4 py-2 rounded-lg font-medium text-sm
                bg-hub-accent hover:bg-hub-accent-dim text-hub-dark
                transition-all duration-200
                flex items-center gap-2
              "
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {translations.copied}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {translations.copyCode}
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="
                px-4 py-2 rounded-lg font-medium text-sm
                bg-hub-dark text-white border border-hub-border
                hover:bg-hub-darker hover:border-hub-accent/30
                transition-all duration-200
                flex items-center gap-2
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {translations.downloadCode}
            </button>
          </div>
        </div>

        {/* Format Tabs */}
        <div className="flex gap-2 flex-wrap">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  outputFormat === format.id
                    ? 'bg-hub-accent text-hub-dark'
                    : 'bg-hub-dark text-hub-muted hover:text-white hover:bg-hub-darker border border-hub-border'
                }
              `}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="p-6 bg-hub-darker overflow-x-auto">
        <pre className="text-sm text-white font-mono leading-relaxed whitespace-pre-wrap break-words">
          {code}
        </pre>
      </div>
    </div>
  );
}
