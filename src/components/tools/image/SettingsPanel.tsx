'use client';

import { OptimizationSettings, OutputFormat } from '@/types/image';

interface SettingsPanelProps {
  settings: OptimizationSettings;
  onChange: (settings: OptimizationSettings) => void;
  translations: {
    settings: string;
    format: string;
    quality: string;
    resize: string;
    enableResize: string;
    resizeMode: string;
    width: string;
    height: string;
    srcset: string;
    enableSrcset: string;
    srcsetSizes: string;
    formats: {
      webp: string;
      avif: string;
      jpeg: string;
      png: string;
      original: string;
    };
    resizeModes: {
      width: string;
      height: string;
      contain: string;
      cover: string;
    };
  };
}

export function SettingsPanel({ settings, onChange, translations }: SettingsPanelProps) {
  const formats: OutputFormat[] = ['webp', 'avif', 'jpeg', 'png', 'original'];

  const updateSettings = (partial: Partial<OptimizationSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div className="space-y-6 p-6 bg-hub-card border border-hub-border rounded-xl">
      <h3 className="text-lg font-bold text-white">{translations.settings}</h3>

      {/* Format Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-hub-muted">
          {translations.format}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {formats.map((format) => (
            <button
              key={format}
              onClick={() => updateSettings({ format })}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${settings.format === format
                  ? 'bg-hub-accent text-hub-dark border-2 border-hub-accent'
                  : 'bg-hub-darker text-hub-muted border-2 border-hub-border hover:border-hub-accent/50'
                }
              `}
            >
              {translations.formats[format]}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-hub-muted">
            {translations.quality}
          </label>
          <span className="text-hub-accent font-mono font-semibold">
            {settings.quality}%
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.quality}
          onChange={(e) => updateSettings({ quality: parseInt(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--hub-accent) 0%, var(--hub-accent) ${settings.quality}%, var(--hub-border) ${settings.quality}%, var(--hub-border) 100%)`,
          }}
        />
      </div>

      {/* Resize Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enable-resize"
            checked={settings.resize !== null}
            onChange={(e) => {
              if (e.target.checked) {
                updateSettings({
                  resize: {
                    mode: 'width',
                    width: 1920,
                    maintainAspectRatio: true,
                  },
                });
              } else {
                updateSettings({ resize: null });
              }
            }}
            className="w-4 h-4 accent-hub-accent"
          />
          <label htmlFor="enable-resize" className="text-sm font-medium text-white cursor-pointer">
            {translations.enableResize}
          </label>
        </div>

        {settings.resize && (
          <div className="pl-7 space-y-3 animate-fade-in">
            {/* Resize Mode */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-hub-muted">
                {translations.resizeMode}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['width', 'height', 'contain', 'cover'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() =>
                      updateSettings({
                        resize: { ...settings.resize!, mode },
                      })
                    }
                    className={`
                      px-3 py-1.5 rounded text-xs font-medium
                      transition-all duration-200
                      ${settings.resize?.mode === mode
                        ? 'bg-hub-accent/20 text-hub-accent border border-hub-accent'
                        : 'bg-hub-darker text-hub-muted border border-hub-border hover:border-hub-accent/50'
                      }
                    `}
                  >
                    {translations.resizeModes[mode]}
                  </button>
                ))}
              </div>
            </div>

            {/* Width/Height Inputs */}
            <div className="grid grid-cols-2 gap-3">
              {(settings.resize.mode === 'width' || settings.resize.mode === 'contain' || settings.resize.mode === 'cover') && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-hub-muted">
                    {translations.width}
                  </label>
                  <input
                    type="number"
                    value={settings.resize.width || ''}
                    onChange={(e) =>
                      updateSettings({
                        resize: {
                          ...settings.resize!,
                          width: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-hub-darker border border-hub-border rounded-lg text-white text-sm focus:outline-none focus:border-hub-accent"
                    placeholder="1920"
                  />
                </div>
              )}

              {(settings.resize.mode === 'height' || settings.resize.mode === 'contain' || settings.resize.mode === 'cover') && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-hub-muted">
                    {translations.height}
                  </label>
                  <input
                    type="number"
                    value={settings.resize.height || ''}
                    onChange={(e) =>
                      updateSettings({
                        resize: {
                          ...settings.resize!,
                          height: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-hub-darker border border-hub-border rounded-lg text-white text-sm focus:outline-none focus:border-hub-accent"
                    placeholder="1080"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Srcset Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enable-srcset"
            checked={settings.generateSrcset}
            onChange={(e) =>
              updateSettings({ generateSrcset: e.target.checked })
            }
            className="w-4 h-4 accent-hub-accent"
          />
          <label htmlFor="enable-srcset" className="text-sm font-medium text-white cursor-pointer">
            {translations.enableSrcset}
          </label>
        </div>

        {settings.generateSrcset && (
          <div className="pl-7 space-y-2 animate-fade-in">
            <label className="text-xs font-medium text-hub-muted">
              {translations.srcsetSizes}
            </label>
            <div className="flex flex-wrap gap-2">
              {[320, 640, 768, 1024, 1280, 1920].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const sizes = settings.srcsetSizes.includes(size)
                      ? settings.srcsetSizes.filter((s) => s !== size)
                      : [...settings.srcsetSizes, size].sort((a, b) => a - b);
                    updateSettings({ srcsetSizes: sizes });
                  }}
                  className={`
                    px-3 py-1.5 rounded text-xs font-medium font-mono
                    transition-all duration-200
                    ${settings.srcsetSizes.includes(size)
                      ? 'bg-hub-accent/20 text-hub-accent border border-hub-accent'
                      : 'bg-hub-darker text-hub-muted border border-hub-border hover:border-hub-accent/50'
                    }
                  `}
                >
                  {size}w
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
