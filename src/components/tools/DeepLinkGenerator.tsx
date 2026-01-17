'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getDeepLinkGeneratorTranslations } from '@/lib/i18n-deep-link-generator';
import toast from 'react-hot-toast';

type Platform = 'ios' | 'android' | 'both';

interface AppConfig {
  // iOS
  iosBundleId: string;
  iosAppStoreId: string;
  iosTeamId: string;
  // Android
  androidPackage: string;
  androidSha256: string;
  // Common
  domain: string;
  paths: string[];
  fallbackUrl: string;
}

const DEFAULT_CONFIG: AppConfig = {
  iosBundleId: '',
  iosAppStoreId: '',
  iosTeamId: '',
  androidPackage: '',
  androidSha256: '',
  domain: '',
  paths: ['/'],
  fallbackUrl: '',
};

export function DeepLinkGenerator() {
  const { locale } = useI18n();
  const t = getDeepLinkGeneratorTranslations(locale);

  const [platform, setPlatform] = useState<Platform>('both');
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  const updateConfig = (key: keyof AppConfig, value: string | string[]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addPath = () => {
    updateConfig('paths', [...config.paths, '']);
  };

  const removePath = (index: number) => {
    if (config.paths.length > 1) {
      updateConfig('paths', config.paths.filter((_, i) => i !== index));
    }
  };

  const updatePath = (index: number, value: string) => {
    const newPaths = [...config.paths];
    newPaths[index] = value;
    updateConfig('paths', newPaths);
  };

  const appleAppSiteAssociation = useMemo(() => {
    if (!config.iosBundleId || !config.iosTeamId) return '';

    const obj = {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${config.iosTeamId}.${config.iosBundleId}`,
            paths: config.paths.filter(Boolean),
          },
        ],
      },
    };

    return JSON.stringify(obj, null, 2);
  }, [config]);

  const assetLinks = useMemo(() => {
    if (!config.androidPackage) return '';

    const fingerprints = config.androidSha256
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const obj = [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: config.androidPackage,
          sha256_cert_fingerprints: fingerprints.length > 0 ? fingerprints : ['YOUR_SHA256_FINGERPRINT'],
        },
      },
    ];

    return JSON.stringify(obj, null, 2);
  }, [config]);

  const htmlMetaTags = useMemo(() => {
    let html = '<!-- Deep Link Meta Tags -->\n';

    if (platform === 'ios' || platform === 'both') {
      if (config.iosAppStoreId) {
        html += `<meta name="apple-itunes-app" content="app-id=${config.iosAppStoreId}">\n`;
      }
    }

    if (platform === 'android' || platform === 'both') {
      if (config.androidPackage) {
        html += `<link rel="android-manifest" href="/manifest.json">\n`;
      }
    }

    if (config.fallbackUrl) {
      html += `\n<!-- Fallback for users without the app -->\n`;
      html += `<meta http-equiv="refresh" content="0;url=${config.fallbackUrl}">\n`;
    }

    return html;
  }, [platform, config]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.platform}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'ios' as const, label: t.platformIos },
            { value: 'android' as const, label: t.platformAndroid },
            { value: 'both' as const, label: t.platformBoth },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                platform === p.value
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* iOS Configuration */}
      {(platform === 'ios' || platform === 'both') && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.appInfo} - iOS</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.iosBundleId}</label>
              <input
                type="text"
                value={config.iosBundleId}
                onChange={(e) => updateConfig('iosBundleId', e.target.value)}
                placeholder={t.iosBundleIdPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.iosAppStoreId}</label>
              <input
                type="text"
                value={config.iosAppStoreId}
                onChange={(e) => updateConfig('iosAppStoreId', e.target.value)}
                placeholder={t.iosAppStoreIdPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.iosTeamId}</label>
              <input
                type="text"
                value={config.iosTeamId}
                onChange={(e) => updateConfig('iosTeamId', e.target.value)}
                placeholder={t.iosTeamIdPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Android Configuration */}
      {(platform === 'android' || platform === 'both') && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.appInfo} - Android</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.androidPackage}</label>
              <input
                type="text"
                value={config.androidPackage}
                onChange={(e) => updateConfig('androidPackage', e.target.value)}
                placeholder={t.androidPackagePlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.androidSha256}</label>
              <input
                type="text"
                value={config.androidSha256}
                onChange={(e) => updateConfig('androidSha256', e.target.value)}
                placeholder={t.androidSha256Placeholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Link Configuration */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.linkConfig}</h3>

        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.domain}</label>
          <input
            type="text"
            value={config.domain}
            onChange={(e) => updateConfig('domain', e.target.value)}
            placeholder={t.domainPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.path}</label>
          {config.paths.map((path, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={path}
                onChange={(e) => updatePath(index, e.target.value)}
                placeholder={t.pathPlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
              />
              {config.paths.length > 1 && (
                <button onClick={() => removePath(index)} className="px-3 py-2 text-red-400 hover:text-red-300">
                  ×
                </button>
              )}
            </div>
          ))}
          <button onClick={addPath} className="text-sm text-hub-accent hover:underline">
            {t.addPath}
          </button>
          <p className="text-xs text-hub-muted mt-1">{t.pathHelp}</p>
        </div>

        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.fallbackUrl}</label>
          <input
            type="url"
            value={config.fallbackUrl}
            onChange={(e) => updateConfig('fallbackUrl', e.target.value)}
            placeholder={t.fallbackUrlPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.fallbackUrlHelp}</p>
        </div>
      </div>

      {/* Generated Files */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.generatedFiles}</h3>

        {/* Apple App Site Association */}
        {(platform === 'ios' || platform === 'both') && appleAppSiteAssociation && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-hub-muted">{t.appleAppSiteAssociation}</label>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(appleAppSiteAssociation)} className="text-xs text-hub-accent hover:underline">
                  {t.copyButton}
                </button>
                <button onClick={() => downloadFile('apple-app-site-association', appleAppSiteAssociation)} className="text-xs text-hub-accent hover:underline">
                  {t.downloadFile}
                </button>
              </div>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-40 overflow-auto">
              <code className="text-xs text-green-400 font-mono">{appleAppSiteAssociation}</code>
            </pre>
          </div>
        )}

        {/* Asset Links */}
        {(platform === 'android' || platform === 'both') && assetLinks && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-hub-muted">{t.assetLinks}</label>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(assetLinks)} className="text-xs text-hub-accent hover:underline">
                  {t.copyButton}
                </button>
                <button onClick={() => downloadFile('assetlinks.json', assetLinks)} className="text-xs text-hub-accent hover:underline">
                  {t.downloadFile}
                </button>
              </div>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-40 overflow-auto">
              <code className="text-xs text-cyan-400 font-mono">{assetLinks}</code>
            </pre>
          </div>
        )}

        {/* HTML Meta Tags */}
        {htmlMetaTags && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-hub-muted">{t.htmlMetaTags}</label>
              <button onClick={() => handleCopy(htmlMetaTags)} className="text-xs text-hub-accent hover:underline">
                {t.copyButton}
              </button>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded-lg p-3 max-h-40 overflow-auto">
              <code className="text-xs text-yellow-400 font-mono">{htmlMetaTags}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.instructions}</h3>
        <ul className="space-y-2 text-sm text-hub-muted">
          {(platform === 'ios' || platform === 'both') && (
            <li className="flex items-start gap-2">
              <span className="text-hub-accent">1.</span>
              {t.instructionIos}
            </li>
          )}
          {(platform === 'android' || platform === 'both') && (
            <li className="flex items-start gap-2">
              <span className="text-hub-accent">2.</span>
              {t.instructionAndroid}
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-hub-accent">3.</span>
            {t.instructionVerify}
          </li>
        </ul>
      </div>

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
