'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRsaKeygenTranslations } from '@/lib/i18n-rsa-keygen';
import toast from 'react-hot-toast';

type KeySize = 2048 | 4096;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function formatPem(base64: string, type: 'PUBLIC' | 'PRIVATE'): string {
  const header = type === 'PUBLIC' ? '-----BEGIN PUBLIC KEY-----' : '-----BEGIN PRIVATE KEY-----';
  const footer = type === 'PUBLIC' ? '-----END PUBLIC KEY-----' : '-----END PRIVATE KEY-----';

  // Split into 64-character lines
  const lines = base64.match(/.{1,64}/g) || [];

  return `${header}\n${lines.join('\n')}\n${footer}`;
}

export function RsaKeygen() {
  const { locale } = useI18n();
  const t = getRsaKeygenTranslations(locale);

  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPublicKey('');
    setPrivateKey('');

    try {
      // Generate RSA key pair
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: 'SHA-256',
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      // Export public key (SPKI format)
      const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);
      const publicKeyPem = formatPem(publicKeyBase64, 'PUBLIC');

      // Export private key (PKCS#8 format)
      const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const privateKeyBase64 = arrayBufferToBase64(privateKeyBuffer);
      const privateKeyPem = formatPem(privateKeyBase64, 'PRIVATE');

      setPublicKey(publicKeyPem);
      setPrivateKey(privateKeyPem);
    } catch (error) {
      toast.error('Key generation failed');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔐 {t.securityNote}</p>
      </div>

      {/* Key Size Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.keySizeLabel}</label>
        <div className="flex gap-2">
          {([2048, 4096] as KeySize[]).map((size) => (
            <button
              key={size}
              onClick={() => setKeySize(size)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                keySize === size
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {size} {t.bits}
            </button>
          ))}
        </div>
        {keySize === 4096 && (
          <p className="text-xs text-yellow-500 mt-2">⚠️ {t.warningSize}</p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? t.generating : t.generateButton}
      </button>

      {/* Key Info */}
      {publicKey && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.keyInfo}</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-hub-muted">{t.algorithm}: </span>
              <span className="text-white font-mono">RSA-OAEP</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.keySize}: </span>
              <span className="text-white font-mono">{keySize} {t.bits}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.publicExponent}: </span>
              <span className="text-white font-mono">65537 (0x10001)</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.format}: </span>
              <span className="text-white font-mono">PEM</span>
            </div>
          </div>
        </div>
      )}

      {/* Public Key */}
      {publicKey && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.publicKeyLabel}</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(publicKey, 'public_key.pem')}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.downloadButton}
              </button>
              <button
                onClick={() => handleCopy(publicKey)}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
          <textarea
            value={publicKey}
            readOnly
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-green-400 resize-none focus:outline-none"
          />
        </div>
      )}

      {/* Private Key */}
      {privateKey && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.privateKeyLabel}</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(privateKey, 'private_key.pem')}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.downloadButton}
              </button>
              <button
                onClick={() => handleCopy(privateKey)}
                className="text-xs text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
          </div>
          <textarea
            value={privateKey}
            readOnly
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-red-400 resize-none focus:outline-none"
          />
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
