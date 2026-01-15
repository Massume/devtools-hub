'use client';

import { ImageFile } from '@/types/image';
import { formatBytes } from '@/lib/image/formatters';
import { downloadSingle, downloadAll } from '@/lib/image/downloadUtils';

interface ResultsTableProps {
  files: ImageFile[];
  translations: {
    results: string;
    filename: string;
    original: string;
    optimized: string;
    savings: string;
    actions: string;
    download: string;
    downloadAll: string;
    total: string;
    noResults: string;
  };
}

export function ResultsTable({ files, translations }: ResultsTableProps) {
  const completedFiles = files.filter((f) => f.status === 'complete' && f.result);

  if (completedFiles.length === 0) {
    return null;
  }

  // Calculate totals
  const totalOriginal = completedFiles.reduce((sum, f) => sum + f.originalSize, 0);
  const totalOptimized = completedFiles.reduce((sum, f) => sum + (f.result?.size || 0), 0);
  const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100;
  const totalSavingsBytes = totalOriginal - totalOptimized;

  const handleDownloadAll = async () => {
    const filesMap = new Map(
      completedFiles.map((file) => [
        file.id,
        { file, result: file.result! },
      ])
    );
    await downloadAll(filesMap);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{translations.results}</h3>
        <button
          onClick={handleDownloadAll}
          className="
            px-4 py-2 rounded-lg
            bg-hub-accent hover:bg-hub-accent-dim
            text-hub-dark font-semibold text-sm
            transition-all duration-200
            flex items-center gap-2
          "
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
          </svg>
          {translations.downloadAll}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-hub-border">
        <table className="w-full">
          <thead>
            <tr className="bg-hub-card border-b border-hub-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-hub-muted uppercase tracking-wider">
                {translations.filename}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-hub-muted uppercase tracking-wider">
                {translations.original}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-hub-muted uppercase tracking-wider">
                {translations.optimized}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-hub-muted uppercase tracking-wider">
                {translations.savings}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-hub-muted uppercase tracking-wider">
                {translations.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-hub-card divide-y divide-hub-border">
            {completedFiles.map((file) => (
              <tr
                key={file.id}
                className="hover:bg-hub-border/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-white truncate max-w-xs" title={file.name}>
                  {file.name}
                </td>
                <td className="px-4 py-3 text-sm text-hub-muted text-right font-mono">
                  {formatBytes(file.originalSize)}
                </td>
                <td className="px-4 py-3 text-sm text-hub-accent text-right font-mono">
                  {formatBytes(file.result?.size || 0)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-hub-accent font-semibold">
                      -{file.result?.savings.toFixed(1)}%
                    </span>
                    <span className="text-xs text-hub-muted">
                      ({formatBytes(file.result?.savingsBytes || 0)})
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => downloadSingle(file.name, file.result!)}
                    className="
                      px-3 py-1.5 rounded-lg
                      bg-hub-accent/20 hover:bg-hub-accent/30
                      text-hub-accent text-xs font-medium
                      transition-all duration-200
                      inline-flex items-center gap-1.5
                    "
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                    {translations.download}
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals Row */}
            <tr className="bg-hub-accent/5 border-t-2 border-hub-accent">
              <td className="px-4 py-3 text-sm font-bold text-white">
                {translations.total}
              </td>
              <td className="px-4 py-3 text-sm text-hub-muted text-right font-mono font-semibold">
                {formatBytes(totalOriginal)}
              </td>
              <td className="px-4 py-3 text-sm text-hub-accent text-right font-mono font-semibold">
                {formatBytes(totalOptimized)}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <span className="inline-flex items-center gap-1">
                  <span className="text-hub-accent font-bold text-base">
                    -{totalSavings.toFixed(1)}%
                  </span>
                  <span className="text-xs text-hub-muted">
                    ({formatBytes(totalSavingsBytes)})
                  </span>
                </span>
              </td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
