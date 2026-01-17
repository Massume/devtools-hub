'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDataUriDecoderTranslations } from '@/lib/i18n-data-uri-decoder';
import toast from 'react-hot-toast';

const SAMPLE_DATA_URI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzhiNWNmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiPkRhdGEgVVJJPC90ZXh0Pjwvc3ZnPg==';

interface DecodedData {
  mimeType: string;
  encoding: string;
  data: string;
  decodedContent: string;
  originalSize: number;
}

export function DataUriDecoder() {
  const { locale } = useI18n();
  const t = getDataUriDecoderTranslations(locale);

  const [input, setInput] = useState('');

  const decoded = useMemo((): DecodedData | null => {
    if (!input.trim()) return null;

    try {
      // Parse data URI format: data:[<mediatype>][;base64],<data>
      const match = input.match(/^data:([^;,]+)?(;base64)?,(.*)$/);
      if (!match) return null;

      const mimeType = match[1] || 'text/plain';
      const isBase64 = !!match[2];
      const rawData = match[3] || '';

      let decodedContent = '';
      let originalSize = 0;

      if (isBase64) {
        try {
          decodedContent = atob(rawData);
          originalSize = decodedContent.length;
        } catch {
          decodedContent = '[Unable to decode base64]';
        }
      } else {
        decodedContent = decodeURIComponent(rawData);
        originalSize = decodedContent.length;
      }

      return {
        mimeType,
        encoding: isBase64 ? 'base64' : 'url-encoded',
        data: rawData,
        decodedContent,
        originalSize,
      };
    } catch {
      return null;
    }
  }, [input]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_DATA_URI);
  };

  const clearInput = () => {
    setInput('');
  };

  const downloadFile = () => {
    if (!decoded) return;

    try {
      // Convert decoded content to blob
      const byteCharacters = decoded.decodedContent;
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: decoded.mimeType });

      // Get file extension from mime type
      const extMap: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'image/webp': 'webp',
        'text/plain': 'txt',
        'text/html': 'html',
        'text/css': 'css',
        'text/javascript': 'js',
        'application/json': 'json',
        'application/pdf': 'pdf',
      };
      const ext = extMap[decoded.mimeType] || 'bin';

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decoded-file.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download file');
    }
  };

  const isImage = decoded?.mimeType.startsWith('image/');
  const isText = decoded?.mimeType.startsWith('text/') || decoded?.mimeType === 'application/json';

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} ${t.bytes}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const encodingLabel = decoded?.encoding === 'base64' ? t.base64 : decoded?.encoding === 'url-encoded' ? t.urlEncoded : t.plain;

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadSample}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.loadSample}
        </button>
        <button
          onClick={clearInput}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={6}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
        {input && !decoded && (
          <p className="text-xs text-red-400 mt-1">{t.invalidDataUri}</p>
        )}
      </div>

      {/* Decoded Info */}
      {decoded && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.decodedInfo}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-hub-muted">{t.mimeType}: </span>
              <span className="text-hub-accent font-mono">{decoded.mimeType}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.encoding}: </span>
              <span className="text-cyan-400 font-mono">{encodingLabel}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.dataSize}: </span>
              <span className="text-white font-mono">{formatSize(decoded.data.length)}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.originalSize}: </span>
              <span className="text-green-400 font-mono">{formatSize(decoded.originalSize)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {decoded && isImage && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="flex justify-center bg-hub-darker rounded-lg p-4">
            <img
              src={input}
              alt="Decoded preview"
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        </div>
      )}

      {/* Text Content */}
      {decoded && isText && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.decodedContent}</label>
            <button
              onClick={() => handleCopy(decoded.decodedContent)}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyContent}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-64 overflow-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {decoded.decodedContent}
            </code>
          </pre>
        </div>
      )}

      {/* Non-text/non-image content */}
      {decoded && !isImage && !isText && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <p className="text-hub-muted text-sm">{t.noPreview}</p>
        </div>
      )}

      {/* Download Button */}
      {decoded && (
        <button
          onClick={downloadFile}
          className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors"
        >
          {t.downloadFile}
        </button>
      )}

      {/* Supported Types */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.supportedTypes}</h3>
        <ul className="space-y-2 text-sm text-hub-muted">
          <li className="flex items-center gap-2">
            <span className="text-hub-accent">•</span>
            {t.typeImages}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-hub-accent">•</span>
            {t.typeText}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-hub-accent">•</span>
            {t.typeFonts}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-hub-accent">•</span>
            {t.typeOther}
          </li>
        </ul>
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
