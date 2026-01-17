'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCspGeneratorTranslations } from '@/lib/i18n-csp-generator';
import toast from 'react-hot-toast';

interface DirectiveConfig {
  key: string;
  labelKey: string;
  descKey: string;
}

const DIRECTIVES: DirectiveConfig[] = [
  { key: 'default-src', labelKey: 'defaultSrc', descKey: 'defaultSrcDesc' },
  { key: 'script-src', labelKey: 'scriptSrc', descKey: 'scriptSrcDesc' },
  { key: 'style-src', labelKey: 'styleSrc', descKey: 'styleSrcDesc' },
  { key: 'img-src', labelKey: 'imgSrc', descKey: 'imgSrcDesc' },
  { key: 'font-src', labelKey: 'fontSrc', descKey: 'fontSrcDesc' },
  { key: 'connect-src', labelKey: 'connectSrc', descKey: 'connectSrcDesc' },
  { key: 'media-src', labelKey: 'mediaSrc', descKey: 'mediaSrcDesc' },
  { key: 'object-src', labelKey: 'objectSrc', descKey: 'objectSrcDesc' },
  { key: 'frame-src', labelKey: 'frameSrc', descKey: 'frameSrcDesc' },
  { key: 'frame-ancestors', labelKey: 'frameAncestors', descKey: 'frameAncestorsDesc' },
  { key: 'base-uri', labelKey: 'baseUri', descKey: 'baseUriDesc' },
  { key: 'form-action', labelKey: 'formAction', descKey: 'formActionDesc' },
];

const PRESETS = [
  { value: "'self'", labelKey: 'presetSelf' },
  { value: "'none'", labelKey: 'presetNone' },
  { value: "'unsafe-inline'", labelKey: 'presetUnsafeInline' },
  { value: "'unsafe-eval'", labelKey: 'presetUnsafeEval' },
  { value: 'data:', labelKey: 'presetData' },
  { value: 'blob:', labelKey: 'presetBlob' },
  { value: 'https:', labelKey: 'presetHttps' },
  { value: 'wss:', labelKey: 'presetWss' },
];

export function CspGenerator() {
  const { locale } = useI18n();
  const t = getCspGeneratorTranslations(locale) as Record<string, string>;

  const [directives, setDirectives] = useState<Record<string, string[]>>({
    'default-src': ["'self'"],
    'script-src': [],
    'style-src': [],
    'img-src': [],
    'font-src': [],
    'connect-src': [],
    'media-src': [],
    'object-src': ["'none'"],
    'frame-src': [],
    'frame-ancestors': [],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  });

  const [upgradeInsecure, setUpgradeInsecure] = useState(false);
  const [blockMixedContent, setBlockMixedContent] = useState(false);
  const [customValue, setCustomValue] = useState<Record<string, string>>({});

  const addValue = (directive: string, value: string) => {
    if (!value.trim()) return;
    const currentValues = directives[directive] || [];
    if (!currentValues.includes(value.trim())) {
      setDirectives({
        ...directives,
        [directive]: [...currentValues, value.trim()],
      });
    }
    setCustomValue({ ...customValue, [directive]: '' });
  };

  const removeValue = (directive: string, value: string) => {
    const currentValues = directives[directive] || [];
    setDirectives({
      ...directives,
      [directive]: currentValues.filter(v => v !== value),
    });
  };

  const generateCsp = () => {
    const parts: string[] = [];

    for (const [key, values] of Object.entries(directives)) {
      if (values.length > 0) {
        parts.push(`${key} ${values.join(' ')}`);
      }
    }

    if (upgradeInsecure) {
      parts.push('upgrade-insecure-requests');
    }

    if (blockMixedContent) {
      parts.push('block-all-mixed-content');
    }

    return parts.join('; ');
  };

  const csp = generateCsp();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleClearAll = () => {
    const cleared: Record<string, string[]> = {};
    for (const key of Object.keys(directives)) {
      cleared[key] = [];
    }
    setDirectives(cleared);
    setUpgradeInsecure(false);
    setBlockMixedContent(false);
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🛡️ {t.securityNote}</p>
      </div>

      {/* Directives */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">{t.directivesTitle}</h3>

        <div className="space-y-4">
          {DIRECTIVES.map((directive) => (
            <div key={directive.key} className="border-b border-hub-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-hub-accent text-sm">{t[directive.labelKey]}</span>
                  <p className="text-xs text-hub-muted">{t[directive.descKey]}</p>
                </div>
              </div>

              {/* Current Values */}
              {directives[directive.key]?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {directives[directive.key].map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-hub-darker rounded text-xs font-mono text-white"
                    >
                      {value}
                      <button
                        onClick={() => removeValue(directive.key, value)}
                        className="text-hub-muted hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Presets */}
              <div className="flex flex-wrap gap-1 mb-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => addValue(directive.key, preset.value)}
                    disabled={directives[directive.key]?.includes(preset.value)}
                    className="px-2 py-1 text-xs bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t[preset.labelKey]}
                  </button>
                ))}
              </div>

              {/* Custom Value Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue[directive.key] || ''}
                  onChange={(e) => setCustomValue({ ...customValue, [directive.key]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addValue(directive.key, customValue[directive.key] || '');
                    }
                  }}
                  placeholder={t.valuePlaceholder}
                  className="flex-1 bg-hub-darker border border-hub-border rounded px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-hub-accent"
                />
                <button
                  onClick={() => addValue(directive.key, customValue[directive.key] || '')}
                  className="px-2 py-1 text-xs bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors"
                >
                  {t.addValue}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">{t.optionsTitle}</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={upgradeInsecure}
              onChange={(e) => setUpgradeInsecure(e.target.checked)}
              className="mt-1 rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <div>
              <span className="font-mono text-hub-accent text-sm">{t.upgradeInsecure}</span>
              <p className="text-xs text-hub-muted">{t.upgradeInsecureDesc}</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={blockMixedContent}
              onChange={(e) => setBlockMixedContent(e.target.checked)}
              className="mt-1 rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            <div>
              <span className="font-mono text-hub-accent text-sm">{t.blockMixedContent}</span>
              <p className="text-xs text-hub-muted">{t.blockMixedContentDesc}</p>
            </div>
          </label>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors"
      >
        {t.clearAll}
      </button>

      {/* Output */}
      {csp && (
        <>
          {/* HTTP Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.headerLabel}</label>
              <button
                onClick={() => handleCopy(`Content-Security-Policy: ${csp}`)}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-green-400 break-all">
              <span className="text-cyan-400">Content-Security-Policy:</span> {csp}
            </div>
          </div>

          {/* Meta Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.metaTagLabel}</label>
              <button
                onClick={() => handleCopy(`<meta http-equiv="Content-Security-Policy" content="${csp}">`)}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-purple-400 break-all">
              &lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;{csp}&quot;&gt;
            </div>
          </div>
        </>
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
