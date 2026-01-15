export type OutputFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'original';

export interface OptimizationSettings {
  format: OutputFormat;
  quality: number;
  resize: ResizeSettings | null;
  stripMetadata: boolean;
  generateSrcset: boolean;
  srcsetSizes: number[];
}

export interface ResizeSettings {
  mode: 'width' | 'height' | 'contain' | 'cover';
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  width: number;
  height: number;
  type: string;
  preview: string;
  status: ProcessingStatus;
  result?: OptimizedResult;
  error?: string;
}

export type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'error';

export interface OptimizedResult {
  blob: Blob;
  size: number;
  width: number;
  height: number;
  format: string;
  savings: number;
  savingsBytes: number;
  srcsetVariants?: SrcsetVariant[];
}

export interface SrcsetVariant {
  width: number;
  blob: Blob;
  size: number;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  currentFile: string;
}
