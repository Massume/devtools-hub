'use client';

import { useState, useCallback, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDataUriGeneratorTranslations } from '@/lib/i18n-data-uri-generator';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface FileData {
  name: string;
  type: string;
  size: number;
  dataUri: string;
  base64: string;
}

export function DataUriGenerator() {
  const { locale } = useI18n();
  const t = getDataUriGeneratorTranslations(locale);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeMediaType, setIncludeMediaType] = useState(true);

  const processFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t.fileTooLarge);
      return;
    }

    setIsGenerating(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1] || '';

        setFileData({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUri: result,
          base64,
        });
        setIsGenerating(false);
      };
      reader.onerror = () => {
        setIsGenerating(false);
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch {
      setIsGenerating(false);
    }
  }, [t.fileTooLarge]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const clearFile = () => {
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isImage = fileData?.type.startsWith('image/');

  const getCssBackground = () => {
    if (!fileData) return '';
    return `background-image: url('${fileData.dataUri}');`;
  };

  const getImgTag = () => {
    if (!fileData) return '';
    return `<img src="${fileData.dataUri}" alt="${fileData.name}" />`;
  };

  const getOutput = () => {
    if (!fileData) return '';
    if (!includeMediaType) return fileData.base64;
    return fileData.dataUri;
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-hub-accent bg-hub-accent/10'
            : 'border-hub-border hover:border-hub-accent/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="text-4xl mb-4">
          {isGenerating ? '...' : '📁'}
        </div>
        <p className="text-lg text-white mb-2">
          {isDragActive ? t.dropZoneActive : isGenerating ? t.generating : t.dropZone}
        </p>
        <p className="text-sm text-hub-muted">{t.supportedFormats}</p>
        <p className="text-xs text-hub-muted mt-1">{t.maxFileSize}</p>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.options}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeMediaType}
            onChange={(e) => setIncludeMediaType(e.target.checked)}
            className="rounded border-hub-border bg-hub-darker accent-hub-accent"
          />
          <span className="text-sm text-hub-muted">{t.includeMediaType}</span>
        </label>
      </div>

      {/* File Info */}
      {fileData && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-hub-muted">{t.fileInfo}</h3>
            <button
              onClick={clearFile}
              className="text-xs text-red-400 hover:underline"
            >
              {t.clearFile}
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-hub-muted">{t.fileName}: </span>
              <span className="text-white font-mono">{fileData.name}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.fileType}: </span>
              <span className="text-hub-accent font-mono">{fileData.type}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.fileSize}: </span>
              <span className="text-white font-mono">{formatSize(fileData.size)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Preview (for images) */}
      {fileData && isImage && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="flex justify-center bg-hub-darker rounded-lg p-4">
            <img
              src={fileData.dataUri}
              alt={fileData.name}
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        </div>
      )}

      {/* Data URI Output */}
      {fileData && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">
              {includeMediaType ? t.dataUri : t.base64Only}
            </label>
            <button
              onClick={() => handleCopy(getOutput())}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 max-h-32 overflow-auto">
            <code className="text-sm text-green-400 font-mono break-all">
              {getOutput()}
            </code>
          </div>
          <p className="text-xs text-hub-muted mt-2">
            {formatSize(getOutput().length)} ({getOutput().length} chars)
          </p>
        </div>
      )}

      {/* Code Snippets */}
      {fileData && isImage && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* CSS Background */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.cssBackground}</label>
              <button
                onClick={() => handleCopy(getCssBackground())}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-24 overflow-auto">
              <code className="text-xs text-cyan-400 font-mono break-all">
                {getCssBackground()}
              </code>
            </div>
          </div>

          {/* HTML img Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.imgTag}</label>
              <button
                onClick={() => handleCopy(getImgTag())}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-24 overflow-auto">
              <code className="text-xs text-orange-400 font-mono break-all">
                {getImgTag()}
              </code>
            </div>
          </div>
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
