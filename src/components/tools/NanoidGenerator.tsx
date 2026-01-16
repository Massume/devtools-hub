'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getNanoidGeneratorTranslations } from '@/lib/i18n-nanoid-generator';
import { nanoid, customAlphabet } from 'nanoid';
import toast from 'react-hot-toast';

export function NanoidGenerator() {
  const { locale } = useI18n();
  const t = getNanoidGeneratorTranslations(locale);

  const [length, setLength] = useState(21);
  const [quantity, setQuantity] = useState(10);
  const [alphabetType, setAlphabetType] = useState<'default' | 'custom'>('default');
  const [customAlphabetStr, setCustomAlphabetStr] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  const [ids, setIds] = useState<string[]>([]);

  const handleGenerate = () => {
    const newIds: string[] = [];

    if (alphabetType === 'custom' && customAlphabetStr.length > 0) {
      const generator = customAlphabet(customAlphabetStr, length);
      for (let i = 0; i < quantity; i++) {
        newIds.push(generator());
      }
    } else {
      for (let i = 0; i < quantity; i++) {
        newIds.push(nanoid(length));
      }
    }

    setIds(newIds);
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(ids.join('\n'));
    toast.success(t.copiedAll);
  };

  // Calculate collision probability info
  const alphabetSize = alphabetType === 'custom' ? customAlphabetStr.length : 64;
  const bitsPerChar = Math.log2(alphabetSize);
  const totalBits = bitsPerChar * length;
  // For 1% collision probability with birthday paradox: n = sqrt(2 * 0.01 * 2^bits)
  const idsFor1PercentCollision = Math.sqrt(2 * 0.01 * Math.pow(2, totalBits));

  const formatNumber = (num: number) => {
    if (num >= 1e18) return `${(num / 1e18).toFixed(1)}e18`;
    if (num >= 1e15) return `${(num / 1e15).toFixed(1)} quadrillion`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)} trillion`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)} billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)} thousand`;
    return Math.round(num).toString();
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.length}: {length}</label>
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              min={1}
              max={64}
              className="w-full accent-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.quantity}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.alphabet}</label>
            <select
              value={alphabetType}
              onChange={(e) => setAlphabetType(e.target.value as 'default' | 'custom')}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="default">{t.alphabetDefault}</option>
              <option value="custom">{t.alphabetCustom}</option>
            </select>
          </div>
        </div>

        {alphabetType === 'custom' && (
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.customAlphabet}</label>
            <input
              type="text"
              value={customAlphabetStr}
              onChange={(e) => setCustomAlphabetStr(e.target.value)}
              placeholder={t.customAlphabetPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-hub-accent"
            />
          </div>
        )}

        {/* Collision Info */}
        <div className="text-sm text-hub-muted">
          {t.toHave1Collision} <span className="text-hub-accent font-medium">{formatNumber(idsFor1PercentCollision)}</span> {t.ids}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.generateButton}
        </button>
        <button
          onClick={handleCopyAll}
          disabled={ids.length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyAll}
        </button>
      </div>

      {/* Generated IDs */}
      {ids.length > 0 && (
        <div className="space-y-2">
          {ids.map((id, index) => (
            <div
              key={index}
              onClick={() => handleCopy(id)}
              className="flex items-center justify-between bg-hub-darker border border-hub-border rounded-lg p-3 cursor-pointer hover:border-hub-accent/50 transition-colors group"
            >
              <code className="font-mono text-white break-all">{id}</code>
              <span className="text-xs text-hub-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                {t.copyButton}
              </span>
            </div>
          ))}
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
