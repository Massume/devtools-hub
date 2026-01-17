'use client';

import { useState, useRef, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getFaviconGeneratorTranslations } from '@/lib/i18n-favicon-generator';
import toast from 'react-hot-toast';

interface FaviconSize {
  size: number;
  label: string;
  selected: boolean;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, label: '16x16', selected: true },
  { size: 32, label: '32x32', selected: true },
  { size: 48, label: '48x48', selected: true },
  { size: 64, label: '64x64', selected: false },
  { size: 128, label: '128x128', selected: false },
  { size: 180, label: '180x180', selected: true },
  { size: 192, label: '192x192', selected: true },
  { size: 512, label: '512x512', selected: true },
];

export function FaviconGenerator() {
  const { locale } = useI18n();
  const t = getFaviconGeneratorTranslations(locale);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [sizes, setSizes] = useState(FAVICON_SIZES);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [borderRadius, setBorderRadius] = useState(0);
  const [generatedFavicons, setGeneratedFavicons] = useState<{ size: number; dataUrl: string }[]>([]);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageUrl(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const toggleSize = (size: number) => {
    setSizes(sizes.map(s => s.size === size ? { ...s, selected: !s.selected } : s));
  };

  const selectAll = () => {
    setSizes(sizes.map(s => ({ ...s, selected: true })));
  };

  const deselectAll = () => {
    setSizes(sizes.map(s => ({ ...s, selected: false })));
  };

  const generateFavicons = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const selectedSizes = sizes.filter(s => s.selected);
    const generated: { size: number; dataUrl: string }[] = [];

    selectedSizes.forEach(({ size }) => {
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Background
      if (!transparent) {
        ctx.fillStyle = backgroundColor;
        if (borderRadius > 0) {
          const radius = (borderRadius / 100) * (size / 2);
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, radius);
          ctx.fill();
          ctx.clip();
        } else {
          ctx.fillRect(0, 0, size, size);
        }
      } else if (borderRadius > 0) {
        const radius = (borderRadius / 100) * (size / 2);
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.clip();
      }

      // Draw image
      const aspectRatio = image.width / image.height;
      let drawWidth = size;
      let drawHeight = size;
      let offsetX = 0;
      let offsetY = 0;

      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio;
        offsetY = (size - drawHeight) / 2;
      } else {
        drawWidth = size * aspectRatio;
        offsetX = (size - drawWidth) / 2;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const dataUrl = canvas.toDataURL('image/png');
      generated.push({ size, dataUrl });
    });

    setGeneratedFavicons(generated);
    toast.success('Favicons generated!');
  };

  const downloadFavicon = (size: number, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = dataUrl;
    link.click();
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl('');
    setGeneratedFavicons([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateHtmlCode = () => {
    let html = '<!-- Favicons -->\n';
    html += '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n';
    html += '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n';
    html += '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n';
    html += '<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">\n';
    html += '<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">\n';
    return html;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateHtmlCode());
    toast.success(t.copied);
  };

  const sizeLabels: Record<number, string> = {
    16: t.size16,
    32: t.size32,
    48: t.size48,
    64: t.size64,
    128: t.size128,
    180: t.size180,
    192: t.size192,
    512: t.size512,
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-hub-accent bg-hub-accent/10'
            : 'border-hub-border hover:border-hub-accent/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        {imageUrl ? (
          <div className="flex flex-col items-center">
            <img src={imageUrl} alt="Preview" className="max-w-32 max-h-32 object-contain mb-4" />
            <button
              onClick={(e) => { e.stopPropagation(); clearImage(); }}
              className="text-sm text-red-400 hover:underline"
            >
              {t.clearImage}
            </button>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">🖼️</div>
            <p className="text-lg text-white mb-2">
              {isDragActive ? t.dropZoneActive : t.dropZone}
            </p>
            <p className="text-sm text-hub-muted">{t.supportedFormats}</p>
          </>
        )}
      </div>

      {/* Size Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.sizes}</h3>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-hub-accent hover:underline">
              {t.selectAll}
            </button>
            <button onClick={deselectAll} className="text-xs text-hub-accent hover:underline">
              {t.deselectAll}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sizes.map(s => (
            <label key={s.size} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-hub-darker">
              <input
                type="checkbox"
                checked={s.selected}
                onChange={() => toggleSize(s.size)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <div>
                <span className="text-sm text-white font-mono">{s.label}</span>
                <p className="text-xs text-hub-muted">{sizeLabels[s.size]}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-2">{t.backgroundColor}</label>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparent}
                  onChange={(e) => setTransparent(e.target.checked)}
                  className="rounded border-hub-border bg-hub-darker accent-hub-accent"
                />
                <span className="text-sm text-hub-muted">{t.transparent}</span>
              </label>
              {!transparent && (
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-2">{t.borderRadius}</label>
            <select
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="0">{t.radiusNone}</option>
              <option value="10">{t.radiusSmall}</option>
              <option value="25">{t.radiusMedium}</option>
              <option value="40">{t.radiusLarge}</option>
              <option value="100">{t.radiusCircle}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      {image && (
        <button
          onClick={generateFavicons}
          className="w-full px-4 py-3 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors font-medium"
        >
          {t.generateFavicons}
        </button>
      )}

      {/* Generated Favicons */}
      {generatedFavicons.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {generatedFavicons.map(({ size, dataUrl }) => (
              <div key={size} className="flex flex-col items-center">
                <img
                  src={dataUrl}
                  alt={`${size}x${size}`}
                  className="bg-gray-100 rounded"
                  style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                />
                <span className="text-xs text-hub-muted mt-1">{size}px</span>
                <button
                  onClick={() => downloadFavicon(size, dataUrl)}
                  className="text-xs text-hub-accent hover:underline mt-1"
                >
                  {t.downloadSize}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HTML Code */}
      {generatedFavicons.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
              {t.copyButton}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">{generateHtmlCode()}</code>
          </pre>
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
