import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile, OptimizedResult, SrcsetVariant } from '@/types/image';
import { getFileExtension, removeExtension } from './formatters';
import { generateSrcsetHTML } from './srcsetGenerator';

export async function downloadSingle(
  fileName: string,
  result: OptimizedResult
): Promise<void> {
  const extension = getFileExtension(result.format);
  const name = removeExtension(fileName) + '.' + extension;
  saveAs(result.blob, name);
}

export async function downloadAll(
  files: Map<string, { file: ImageFile; result: OptimizedResult }>
): Promise<void> {
  const zip = new JSZip();

  for (const [, { file, result }] of files) {
    const extension = getFileExtension(result.format);
    const name = removeExtension(file.name) + '.' + extension;
    zip.file(name, result.blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'optimized-images.zip');
}

export async function downloadWithSrcset(
  file: ImageFile,
  result: OptimizedResult,
  variants: SrcsetVariant[]
): Promise<void> {
  const zip = new JSZip();
  const baseName = removeExtension(file.name);
  const extension = getFileExtension(result.format);

  zip.file(`${baseName}.${extension}`, result.blob);

  for (const variant of variants) {
    zip.file(`${baseName}-${variant.width}w.${extension}`, variant.blob);
  }

  const html = generateSrcsetHTML(baseName, variants, result.format);
  zip.file('usage.html', html);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${baseName}-srcset.zip`);
}
