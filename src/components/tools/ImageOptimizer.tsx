'use client';

import { useState } from 'react';
import { ImageFile, OptimizationSettings, OptimizedResult } from '@/types/image';
import { useImageOptimizer } from '@/hooks/useImageOptimizer';
import { translations, Locale } from '@/lib/i18n-image';
import { useI18n } from '@/lib/i18n-context';
import { DropZone } from './image/DropZone';
import { FileList } from './image/FileList';
import { SettingsPanel } from './image/SettingsPanel';
import { PreviewComparison } from './image/PreviewComparison';
import { ResultsTable } from './image/ResultsTable';
import { ProcessingStatus } from './image/ProcessingStatus';

export function ImageOptimizer() {
  const { locale } = useI18n();
  const imgLocale = locale as Locale;
  const t = translations[imgLocale];

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [settings, setSettings] = useState<OptimizationSettings>({
    format: 'webp',
    quality: 85,
    resize: null,
    stripMetadata: true,
    generateSrcset: false,
    srcsetSizes: [640, 1024, 1920],
  });

  const { optimizeBatch, isProcessing, progress } = useImageOptimizer();

  const handleFilesAdded = (newFiles: ImageFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  };

  const handleOptimizeAll = async () => {
    if (files.length === 0) return;

    // Update all files to processing status
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'processing' as const, error: undefined }))
    );

    await optimizeBatch(
      files,
      settings,
      (file: ImageFile, result: OptimizedResult) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: 'complete' as const, result }
              : f
          )
        );
      }
    );
  };

  const handleClear = () => {
    // Revoke object URLs to prevent memory leaks
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
      if (file.result) {
        URL.revokeObjectURL(URL.createObjectURL(file.result.blob));
      }
    });
    setFiles([]);
    setSelectedFileId(null);
  };

  const selectedFile = files.find((f) => f.id === selectedFileId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex px-4 py-1.5 bg-hub-accent/10 border border-hub-accent/20 rounded-full">
          <span className="text-hub-accent text-sm font-medium">{t.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">
          {t.title}
        </h1>

        <p className="text-lg text-hub-muted max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Drop Zone */}
      <DropZone
        onFilesAdded={handleFilesAdded}
        translations={{
          dropZone: t.dropZone,
          dropActive: t.dropActive,
          formats: t.supportedFormats,
          or: t.or,
          browse: t.browse,
        }}
      />

      {/* File List */}
      {files.length > 0 && (
        <FileList
          files={files}
          onRemove={handleRemoveFile}
          onSelect={setSelectedFileId}
          selectedId={selectedFileId}
          translations={{
            pending: t.pending,
            processing: t.processing,
            complete: t.complete,
            error: t.error,
            remove: t.remove,
          }}
        />
      )}

      {/* Settings */}
      {files.length > 0 && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          translations={{
            settings: t.settings,
            format: t.format,
            quality: t.quality,
            resize: t.resize,
            enableResize: t.enableResize,
            resizeMode: t.resizeMode,
            width: t.width,
            height: t.height,
            srcset: t.srcset,
            enableSrcset: t.enableSrcset,
            srcsetSizes: t.srcsetSizes,
            formats: t.formats,
            resizeModes: t.resizeModes,
          }}
        />
      )}

      {/* Action Buttons */}
      {files.length > 0 && !isProcessing && (
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleOptimizeAll}
            disabled={files.every((f) => f.status === 'complete')}
            className="
              px-6 py-3 rounded-lg font-semibold
              bg-hub-accent hover:bg-hub-accent-dim
              text-hub-dark
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            "
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {t.optimizeAll}
          </button>

          <button
            onClick={handleClear}
            className="
              px-6 py-3 rounded-lg font-semibold
              bg-hub-card hover:bg-hub-border
              text-white border-2 border-hub-border
              transition-all duration-200
            "
          >
            {t.clear}
          </button>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <ProcessingStatus
          progress={progress}
          translations={{
            processing: t.processing,
            of: t.of,
          }}
        />
      )}

      {/* Preview Comparison */}
      {selectedFile && selectedFile.status === 'complete' && selectedFile.result && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-4">{t.preview}</h3>
          <PreviewComparison
            original={selectedFile}
            optimized={selectedFile.result}
            translations={{
              original: t.original,
              optimized: t.optimized,
              dimensions: t.dimensions,
              size: t.size,
              savings: t.savings,
            }}
          />
        </div>
      )}

      {/* Results Table */}
      <ResultsTable
        files={files}
        translations={{
          results: t.results,
          filename: t.filename,
          original: t.original,
          optimized: t.optimized,
          savings: t.savings,
          actions: t.actions,
          download: t.download,
          downloadAll: t.downloadAll,
          total: t.total,
          noResults: t.noResults,
        }}
      />

      {/* Info Section - Show when no files */}
      {files.length === 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">{t.howToUse}</h2>

          <div className="p-6 bg-hub-card border border-hub-border rounded-xl">
            <ol className="space-y-3 text-hub-muted">
              <li className="flex gap-3">
                <span className="text-hub-accent font-bold">1.</span>
                <span>{t.step1}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hub-accent font-bold">2.</span>
                <span>{t.step2}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hub-accent font-bold">3.</span>
                <span>{t.step3}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hub-accent font-bold">4.</span>
                <span>{t.step4}</span>
              </li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(t.features).map(([key, feature]) => (
              <div
                key={key}
                className="p-6 bg-hub-card border border-hub-border rounded-lg hover:border-hub-accent/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-hub-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
