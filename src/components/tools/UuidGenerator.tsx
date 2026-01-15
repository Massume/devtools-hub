'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUuidTranslations } from '@/lib/i18n-uuid';
import {
  generateUUIDv1,
  generateUUIDv4,
  generateUUIDv5,
  formatUUID,
  NAMESPACE_DNS,
} from '@/lib/uuid-generator';
import toast from 'react-hot-toast';

type Version = 'v1' | 'v4' | 'v5';

export function UuidGenerator() {
  const { locale } = useI18n();
  const t = getUuidTranslations(locale);

  const [version, setVersion] = useState<Version>('v4');
  const [quantity, setQuantity] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [namespace, setNamespace] = useState(NAMESPACE_DNS);
  const [name, setName] = useState('');
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (quantity < 1 || quantity > 1000) {
      toast.error(t.invalidQuantity);
      return;
    }

    if (version === 'v5') {
      if (!namespace) {
        toast.error(t.invalidNamespace);
        return;
      }
      if (!name.trim()) {
        toast.error(t.missingName);
        return;
      }
    }

    try {
      const generated: string[] = [];

      for (let i = 0; i < quantity; i++) {
        let uuid: string;

        if (version === 'v1') {
          uuid = generateUUIDv1();
        } else if (version === 'v4') {
          uuid = generateUUIDv4();
        } else {
          // v5 - use name + index for bulk generation
          const uniqueName = quantity > 1 ? `${name}-${i}` : name;
          uuid = await generateUUIDv5(namespace, uniqueName);
        }

        uuid = formatUUID(uuid, { uppercase, hyphens });
        generated.push(uuid);
      }

      setUuids(generated);
      toast.success(t.generated.replace('{{count}}', quantity.toString()));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleCopy = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      toast.success(t.copied);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      toast.success(t.copiedAll);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="space-y-6">
      {/* Version Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        {(['v1', 'v4', 'v5'] as Version[]).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              version === v
                ? 'bg-hub-accent text-hub-darker'
                : 'text-hub-muted hover:text-white'
            }`}
          >
            {v === 'v1' ? t.version1 : v === 'v4' ? t.version4 : t.version5}
          </button>
        ))}
      </div>

      {/* Version Info */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <p className="text-sm text-gray-300">
          {version === 'v1' && t.v1Description}
          {version === 'v4' && t.v4Description}
          {version === 'v5' && t.v5Description}
        </p>
      </div>

      {/* Settings */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.quantityLabel}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full max-w-xs bg-hub-darker border border-hub-border rounded-lg px-4 py-2 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />
        </div>

        {/* Format Options */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent focus:ring-2"
            />
            <span className="text-sm text-gray-300">{t.formatUppercase}</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="w-4 h-4 rounded border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent focus:ring-2"
            />
            <span className="text-sm text-gray-300">{t.formatHyphens}</span>
          </label>
        </div>

        {/* v5 Specific Options */}
        {version === 'v5' && (
          <div className="space-y-4 pt-4 border-t border-hub-border">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.namespaceLabel}
              </label>
              <input
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder={t.namespacePlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full px-6 py-3 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.generateButton}
        </button>
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Generated {uuids.length} UUID{uuids.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                📋 {t.copyAllButton}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white rounded-lg hover:border-hub-accent transition-colors text-sm font-medium"
              >
                {t.clearButton}
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-hub-darker border border-hub-border rounded-lg p-3 hover:border-hub-accent/50 transition-colors group"
              >
                <code className="flex-1 font-mono text-sm">{uuid}</code>
                <button
                  onClick={() => handleCopy(uuid)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded hover:bg-hub-accent/20 transition-all text-sm"
                >
                  {t.copyButton}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
