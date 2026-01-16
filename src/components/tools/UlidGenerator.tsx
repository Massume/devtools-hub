'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUlidGeneratorTranslations } from '@/lib/i18n-ulid-generator';
import { ulid, decodeTime } from 'ulid';
import toast from 'react-hot-toast';

interface UlidEntry {
  id: string;
  timestamp: Date;
}

export function UlidGenerator() {
  const { locale } = useI18n();
  const t = getUlidGeneratorTranslations(locale);

  const [quantity, setQuantity] = useState(10);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [ulids, setUlids] = useState<UlidEntry[]>([]);
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedTime, setDecodedTime] = useState<Date | null>(null);
  const [decodeError, setDecodeError] = useState(false);

  const handleGenerate = () => {
    const newUlids: UlidEntry[] = [];
    for (let i = 0; i < quantity; i++) {
      const id = ulid();
      newUlids.push({
        id,
        timestamp: new Date(decodeTime(id)),
      });
    }
    setUlids(newUlids);
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(ulids.map(u => u.id).join('\n'));
    toast.success(t.copiedAll);
  };

  const handleDecode = () => {
    try {
      const time = decodeTime(decodeInput.trim());
      setDecodedTime(new Date(time));
      setDecodeError(false);
    } catch {
      setDecodeError(true);
      setDecodedTime(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.quantity}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-24 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={(e) => setShowTimestamp(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.showTimestamp}
          </label>
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
          disabled={ulids.length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyAll}
        </button>
      </div>

      {/* Generated ULIDs */}
      {ulids.length > 0 && (
        <div className="space-y-2">
          {ulids.map((entry, index) => (
            <div
              key={index}
              onClick={() => handleCopy(entry.id)}
              className="flex items-center justify-between bg-hub-darker border border-hub-border rounded-lg p-3 cursor-pointer hover:border-hub-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <code className="font-mono text-white">{entry.id}</code>
                {showTimestamp && (
                  <span className="text-xs text-hub-muted">
                    {entry.timestamp.toISOString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-hub-muted opacity-0 group-hover:opacity-100 transition-opacity">
                {t.copyButton}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Decode Section */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">{t.decode}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={decodeInput}
            onChange={(e) => { setDecodeInput(e.target.value); setDecodeError(false); }}
            placeholder={t.decodePlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-hub-accent"
          />
          <button
            onClick={handleDecode}
            disabled={!decodeInput.trim()}
            className="px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.decodeButton}
          </button>
        </div>
        {decodeError && (
          <p className="text-red-400 text-sm mt-2">{t.invalidUlid}</p>
        )}
        {decodedTime && (
          <div className="mt-3 p-3 bg-hub-darker rounded-lg">
            <span className="text-hub-muted">{t.timestamp}: </span>
            <span className="text-hub-accent font-mono">{decodedTime.toISOString()}</span>
          </div>
        )}
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
