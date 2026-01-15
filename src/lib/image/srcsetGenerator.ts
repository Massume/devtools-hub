import type { SrcsetVariant } from '@/types/image';
import { getFileExtension, removeExtension } from './formatters';

export function generateSrcsetHTML(
  baseName: string,
  variants: SrcsetVariant[],
  format: string
): string {
  const extension = getFileExtension(format);
  const name = removeExtension(baseName);

  const srcset = variants
    .map((v) => `${name}-${v.width}w.${extension} ${v.width}w`)
    .join(',\n    ');

  const sizes = `(max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw`;

  return `<img
  src="${name}-${variants[variants.length - 1].width}w.${extension}"
  srcset="${srcset}"
  sizes="${sizes}"
  alt=""
  loading="lazy"
  decoding="async"
/>`;
}

export function generatePictureHTML(
  baseName: string,
  webpVariants: SrcsetVariant[],
  fallbackVariants: SrcsetVariant[]
): string {
  const name = removeExtension(baseName);

  const webpSrcset = webpVariants
    .map((v) => `${name}-${v.width}w.webp ${v.width}w`)
    .join(', ');

  const jpgSrcset = fallbackVariants
    .map((v) => `${name}-${v.width}w.jpg ${v.width}w`)
    .join(', ');

  return `<picture>
  <source
    type="image/webp"
    srcset="${webpSrcset}"
    sizes="(max-width: 640px) 100vw, 50vw"
  />
  <img
    src="${name}-${fallbackVariants[fallbackVariants.length - 1].width}w.jpg"
    srcset="${jpgSrcset}"
    sizes="(max-width: 640px) 100vw, 50vw"
    alt=""
    loading="lazy"
  />
</picture>`;
}
