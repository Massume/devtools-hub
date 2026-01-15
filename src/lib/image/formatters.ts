export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + '%';
}

export function getFileExtension(format: string): string {
  return format === 'jpeg' ? 'jpg' : format;
}

export function removeExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}
