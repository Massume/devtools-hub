'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMultiHashTranslations } from '@/lib/i18n-multi-hash';
import toast from 'react-hot-toast';
import md5 from 'js-md5';
import { sha3_256, sha3_384, sha3_512, keccak256 } from 'js-sha3';
import { blake2bHex, blake2sHex } from 'blakejs';
import { ripemd160 } from 'ripemd160';
import * as CRC32 from 'crc-32';
import * as ADLER32 from 'adler-32';

type Algorithm =
  | 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'
  | 'sha3_256' | 'sha3_384' | 'sha3_512' | 'keccak256'
  | 'blake2b' | 'blake2s' | 'ripemd160' | 'crc32' | 'adler32';

type HashResults = Partial<Record<Algorithm, string>>;

const ALGORITHM_CATEGORIES: Record<string, Algorithm[]> = {
  legacy: ['md5', 'sha1'],
  sha2: ['sha256', 'sha384', 'sha512'],
  sha3: ['sha3_256', 'sha3_384', 'sha3_512', 'keccak256'],
  blake: ['blake2b', 'blake2s'],
  other: ['ripemd160'],
  checksum: ['crc32', 'adler32'],
};

const ALL_ALGORITHMS: Algorithm[] = Object.values(ALGORITHM_CATEGORIES).flat();

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function hexToBase64(hex: string): string {
  const bytes = hex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || [];
  return btoa(String.fromCharCode(...bytes));
}

async function computeWebCryptoHash(algorithm: string, data: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest(algorithm, data.buffer as ArrayBuffer);
}

export function MultiHash() {
  const { locale } = useI18n();
  const t = getMultiHashTranslations(locale);

  const [input, setInput] = useState('');
  const [results, setResults] = useState<HashResults>({});
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<Set<Algorithm>>(
    new Set(['md5', 'sha1', 'sha256', 'sha512'])
  );
  const [encoding, setEncoding] = useState<'hex' | 'base64'>('hex');
  const [uppercase, setUppercase] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [expectedHash, setExpectedHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  const computeHashes = useCallback(async () => {
    if (!input) return;

    setIsHashing(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const newResults: HashResults = {};

    try {
      for (const algo of selectedAlgorithms) {
        let hash: string = '';

        switch (algo) {
          case 'md5':
            hash = md5(input);
            break;
          case 'sha1': {
            const buffer = await computeWebCryptoHash('SHA-1', data);
            hash = encoding === 'hex' ? arrayBufferToHex(buffer) : arrayBufferToBase64(buffer);
            break;
          }
          case 'sha256': {
            const buffer = await computeWebCryptoHash('SHA-256', data);
            hash = encoding === 'hex' ? arrayBufferToHex(buffer) : arrayBufferToBase64(buffer);
            break;
          }
          case 'sha384': {
            const buffer = await computeWebCryptoHash('SHA-384', data);
            hash = encoding === 'hex' ? arrayBufferToHex(buffer) : arrayBufferToBase64(buffer);
            break;
          }
          case 'sha512': {
            const buffer = await computeWebCryptoHash('SHA-512', data);
            hash = encoding === 'hex' ? arrayBufferToHex(buffer) : arrayBufferToBase64(buffer);
            break;
          }
          case 'sha3_256':
            hash = encoding === 'hex' ? sha3_256(input) : hexToBase64(sha3_256(input));
            break;
          case 'sha3_384':
            hash = encoding === 'hex' ? sha3_384(input) : hexToBase64(sha3_384(input));
            break;
          case 'sha3_512':
            hash = encoding === 'hex' ? sha3_512(input) : hexToBase64(sha3_512(input));
            break;
          case 'keccak256':
            hash = encoding === 'hex' ? keccak256(input) : hexToBase64(keccak256(input));
            break;
          case 'blake2b':
            hash = encoding === 'hex' ? blake2bHex(input) : hexToBase64(blake2bHex(input));
            break;
          case 'blake2s':
            hash = encoding === 'hex' ? blake2sHex(input) : hexToBase64(blake2sHex(input));
            break;
          case 'ripemd160': {
            const hashBuffer = ripemd160(Buffer.from(input));
            hash = encoding === 'hex'
              ? hashBuffer.toString('hex')
              : hashBuffer.toString('base64');
            break;
          }
          case 'crc32': {
            const crc = CRC32.str(input) >>> 0;
            hash = encoding === 'hex' ? crc.toString(16).padStart(8, '0') : btoa(String.fromCharCode((crc >> 24) & 0xff, (crc >> 16) & 0xff, (crc >> 8) & 0xff, crc & 0xff));
            break;
          }
          case 'adler32': {
            const adler = ADLER32.str(input) >>> 0;
            hash = encoding === 'hex' ? adler.toString(16).padStart(8, '0') : btoa(String.fromCharCode((adler >> 24) & 0xff, (adler >> 16) & 0xff, (adler >> 8) & 0xff, adler & 0xff));
            break;
          }
        }

        if (uppercase && encoding === 'hex') {
          hash = hash.toUpperCase();
        }

        newResults[algo] = hash;
      }

      setResults(newResults);
    } catch (error) {
      console.error('Hashing error:', error);
      toast.error('Error computing hashes');
    } finally {
      setIsHashing(false);
    }
  }, [input, selectedAlgorithms, encoding, uppercase]);

  const handleCopy = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    const allHashes = Object.entries(results)
      .map(([algo, hash]) => `${t.algorithms[algo as Algorithm]}: ${hash}`)
      .join('\n');
    await navigator.clipboard.writeText(allHashes);
    toast.success(t.allCopied);
  };

  const toggleAlgorithm = (algo: Algorithm) => {
    const newSet = new Set(selectedAlgorithms);
    if (newSet.has(algo)) {
      newSet.delete(algo);
    } else {
      newSet.add(algo);
    }
    setSelectedAlgorithms(newSet);
  };

  const selectAll = () => setSelectedAlgorithms(new Set(ALL_ALGORITHMS));
  const deselectAll = () => setSelectedAlgorithms(new Set());

  const getCompareResult = (hash: string) => {
    if (!compareMode || !expectedHash) return null;
    const normalizedExpected = expectedHash.toLowerCase().trim();
    const normalizedHash = hash.toLowerCase();
    return normalizedExpected === normalizedHash;
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Algorithm Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.selectAlgorithms}</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.selectAll}
            </button>
            <span className="text-hub-muted">|</span>
            <button
              onClick={deselectAll}
              className="text-xs text-hub-accent hover:underline"
            >
              {t.deselectAll}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(ALGORITHM_CATEGORIES).map(([category, algos]) => (
            <div key={category}>
              <div className="text-xs text-hub-muted mb-2">
                {t.categories[category as keyof typeof t.categories]}
                {category === 'legacy' && (
                  <span className="ml-2 text-yellow-500">⚠️</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {algos.map((algo) => (
                  <button
                    key={algo}
                    onClick={() => toggleAlgorithm(algo)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      selectedAlgorithms.has(algo)
                        ? 'bg-hub-accent text-hub-darker border-hub-accent'
                        : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                    }`}
                  >
                    {t.algorithms[algo]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.encoding}</label>
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value as 'hex' | 'base64')}
              className="bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="hex">{t.encodingHex}</option>
              <option value="base64">{t.encodingBase64}</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer self-end pb-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              disabled={encoding !== 'hex'}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.encodingUppercase}
          </label>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer self-end pb-2">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.compareMode}
          </label>
        </div>

        {compareMode && (
          <div className="mt-4">
            <label className="block text-sm text-hub-muted mb-1">{t.compareLabel}</label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder={t.comparePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={computeHashes}
          disabled={!input || selectedAlgorithms.size === 0 || isHashing}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHashing ? '...' : t.hashButton}
        </button>
        <button
          onClick={handleCopyAll}
          disabled={Object.keys(results).length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyAllButton}
        </button>
        <button
          onClick={() => {
            setInput('');
            setResults({});
            setExpectedHash('');
          }}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
          <div className="space-y-2">
            {Object.entries(results).map(([algo, hash]) => {
              const compareResult = getCompareResult(hash);
              return (
                <div
                  key={algo}
                  className={`bg-hub-darker border rounded-lg p-3 flex items-center justify-between gap-4 ${
                    compareResult === true
                      ? 'border-green-500'
                      : compareResult === false
                      ? 'border-red-500'
                      : 'border-hub-border'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-hub-muted mb-1">{t.algorithms[algo as Algorithm]}</div>
                    <div className="font-mono text-sm text-white break-all">{hash}</div>
                    {compareMode && compareResult !== null && (
                      <div className={`text-xs mt-1 ${compareResult ? 'text-green-500' : 'text-red-500'}`}>
                        {compareResult ? t.compareMatch : t.compareMismatch}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(hash)}
                    className="px-3 py-1 text-sm bg-hub-card border border-hub-border text-white rounded hover:border-hub-accent/50 transition-colors flex-shrink-0"
                  >
                    {t.copyButton}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning for legacy algorithms */}
      {(selectedAlgorithms.has('md5') || selectedAlgorithms.has('sha1')) && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-500">⚠️ {t.warningLegacy}</p>
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
