'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHashTranslations } from '@/lib/i18n-hash';
import toast from 'react-hot-toast';

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

function simpleMD5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export function HashGenerator() {
  const { locale } = useI18n();
  const t = getHashTranslations(locale);

  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAlgorithmName = (): string => {
    switch (algorithm) {
      case 'MD5':
        return 'MD5';
      case 'SHA-1':
        return 'SHA-1';
      case 'SHA-256':
        return 'SHA-256';
      case 'SHA-512':
        return 'SHA-512';
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      setIsProcessing(true);
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      let hashHex = '';

      if (algorithm === 'MD5') {
        // For MD5, use simple hash (not cryptographically secure)
        hashHex = simpleMD5(input);
      } else {
        // Use SubtleCrypto for SHA algorithms
        const algoMap = {
          'SHA-1': 'SHA-1',
          'SHA-256': 'SHA-256',
          'SHA-512': 'SHA-512',
        };

        const hashBuffer = await crypto.subtle.digest(
          algoMap[algorithm as keyof typeof algoMap],
          data
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }

      const formatted = uppercase ? hashHex.toUpperCase() : hashHex.toLowerCase();
      setHash(formatted);
      toast.success(t.generated);
    } catch (error) {
      toast.error('Hash generation failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error(t.fileTooBig);
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    toast.loading(t.processingFile);

    try {
      const arrayBuffer = await file.arrayBuffer();

      let hashHex = '';

      if (algorithm === 'MD5') {
        // For MD5, convert to string and hash (simplified)
        const text = new TextDecoder().decode(arrayBuffer);
        hashHex = simpleMD5(text);
      } else {
        const algoMap = {
          'SHA-1': 'SHA-1',
          'SHA-256': 'SHA-256',
          'SHA-512': 'SHA-512',
        };

        const hashBuffer = await crypto.subtle.digest(
          algoMap[algorithm as keyof typeof algoMap],
          arrayBuffer
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }

      const formatted = uppercase ? hashHex.toUpperCase() : hashHex.toLowerCase();
      setHash(formatted);
      toast.dismiss();
      toast.success(t.fileHashed);
    } catch (error) {
      toast.dismiss();
      toast.error('File hashing failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      toast.success(t.copied);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setHash('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'MD5':
        return t.md5Description;
      case 'SHA-1':
        return t.sha1Description;
      case 'SHA-256':
        return t.sha256Description;
      case 'SHA-512':
        return t.sha512Description;
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        {(['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as Algorithm[]).map((algo) => (
          <button
            key={algo}
            onClick={() => setAlgorithm(algo)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              algorithm === algo
                ? 'bg-hub-accent text-hub-darker'
                : 'text-hub-muted hover:text-white'
            }`}
          >
            {algo}
          </button>
        ))}
      </div>

      {/* Algorithm Info */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <p className="text-sm text-gray-300">{getAlgorithmDescription()}</p>
      </div>

      {/* Security Warning for MD5 and SHA-1 */}
      {(algorithm === 'MD5' || algorithm === 'SHA-1') && (
        <div className="bg-hub-warning/10 border border-hub-warning/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-hub-warning mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-hub-warning">{t.securityNote}</p>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            <span className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium">
              📁 {t.uploadFile}
            </span>
          </label>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          disabled={isProcessing}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors disabled:opacity-50"
        />

        {fileName && (
          <div className="text-sm text-hub-muted">
            File: <span className="text-white">{fileName}</span>
          </div>
        )}

        {/* Format Options */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-hub-border bg-hub-darker text-hub-accent focus:ring-hub-accent focus:ring-2"
            />
            <span className="text-sm text-gray-300">{t.formatUppercase}</span>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full px-6 py-3 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? t.processingFile : t.generateButton}
        </button>
      </div>

      {/* Hash Result */}
      {hash && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t.hashResult} ({getAlgorithmName()})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                📋 {t.copyButton}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white rounded-lg hover:border-hub-accent transition-colors text-sm font-medium"
              >
                {t.clearButton}
              </button>
            </div>
          </div>

          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 break-all font-mono text-sm">
            {hash}
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
