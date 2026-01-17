'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getChaCha20EncryptTranslations } from '@/lib/i18n-chacha20-encrypt';
import toast from 'react-hot-toast';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';

type Tab = 'encrypt' | 'decrypt';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.replace(/\s/g, '');
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function ChaCha20Encrypt() {
  const { locale } = useI18n();
  const t = getChaCha20EncryptTranslations(locale);
  const tabs = JSON.parse(t.tabs);

  const [activeTab, setActiveTab] = useState<Tab>('encrypt');

  // Encrypt state
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('');
  const [nonce, setNonce] = useState('');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Decrypt state
  const [encryptedInput, setEncryptedInput] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptNonce, setDecryptNonce] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const generateKey = () => {
    const keyBytes = crypto.getRandomValues(new Uint8Array(32));
    setKey(bytesToHex(keyBytes));
  };

  const generateNonce = () => {
    const nonceBytes = crypto.getRandomValues(new Uint8Array(12));
    setNonce(bytesToHex(nonceBytes));
  };

  const generateDecryptNonce = () => {
    const nonceBytes = crypto.getRandomValues(new Uint8Array(12));
    setDecryptNonce(bytesToHex(nonceBytes));
  };

  const handleEncrypt = async () => {
    if (!plainText || !key || !nonce) return;

    const keyBytes = hexToBytes(key);
    if (keyBytes.length !== 32) {
      toast.error(t.errorInvalidKey);
      return;
    }

    const nonceBytes = hexToBytes(nonce);
    if (nonceBytes.length !== 12) {
      toast.error(t.errorInvalidNonce);
      return;
    }

    setIsEncrypting(true);
    try {
      const encoder = new TextEncoder();
      const plainBytes = encoder.encode(plainText);

      const cipher = new ChaCha20Poly1305(keyBytes);
      const encrypted = cipher.seal(nonceBytes, plainBytes);

      // Output format: base64(nonce + ciphertext + tag)
      const combined = new Uint8Array(nonceBytes.length + encrypted.length);
      combined.set(nonceBytes, 0);
      combined.set(encrypted, nonceBytes.length);

      setEncryptedOutput(bytesToBase64(combined));
    } catch (error) {
      toast.error(t.errorEncrypt);
      console.error(error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedInput || !decryptKey) return;

    const keyBytes = hexToBytes(decryptKey);
    if (keyBytes.length !== 32) {
      toast.error(t.errorInvalidKey);
      return;
    }

    setIsDecrypting(true);
    try {
      const combined = base64ToBytes(encryptedInput);

      // Extract nonce from first 12 bytes if not provided separately
      let nonceBytes: Uint8Array;
      let ciphertext: Uint8Array;

      if (decryptNonce) {
        nonceBytes = hexToBytes(decryptNonce);
        ciphertext = combined;
      } else {
        // Nonce is embedded in the encrypted data
        nonceBytes = combined.slice(0, 12);
        ciphertext = combined.slice(12);
      }

      if (nonceBytes.length !== 12) {
        toast.error(t.errorInvalidNonce);
        return;
      }

      const cipher = new ChaCha20Poly1305(keyBytes);
      const decrypted = cipher.open(nonceBytes, ciphertext);

      if (!decrypted) {
        toast.error(t.errorDecrypt);
        return;
      }

      const decoder = new TextDecoder();
      setDecryptedOutput(decoder.decode(decrypted));
    } catch (error) {
      toast.error(t.errorDecrypt);
      console.error(error);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">{t.securityNote}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-hub-border">
        {(['encrypt', 'decrypt'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-hub-accent border-b-2 border-hub-accent'
                : 'text-hub-muted hover:text-white'
            }`}
          >
            {tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'encrypt' && (
        <>
          {/* Plain Text Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder={t.inputPlaceholder}
              rows={4}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
            />
          </div>

          {/* Key Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.keyLabel}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t.keyPlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              <button
                onClick={generateKey}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors whitespace-nowrap"
              >
                {t.generateKey}
              </button>
            </div>
          </div>

          {/* Nonce Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.nonceLabel}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder={t.noncePlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              <button
                onClick={generateNonce}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors whitespace-nowrap"
              >
                {t.generateNonce}
              </button>
            </div>
          </div>

          {/* Encrypt Button */}
          <button
            onClick={handleEncrypt}
            disabled={!plainText || !key || !nonce || isEncrypting}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEncrypting ? t.encrypting : t.encryptButton}
          </button>

          {/* Encrypted Output */}
          {encryptedOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
                <button
                  onClick={() => handleCopy(encryptedOutput)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 break-all">
                {encryptedOutput}
              </div>

              {/* Encryption Info */}
              <div className="mt-4 bg-hub-card border border-hub-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-hub-muted mb-3">{t.keyInfo}</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-hub-muted">{t.algorithm}: </span>
                    <span className="text-white font-mono">ChaCha20-Poly1305</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.keySize}: </span>
                    <span className="text-white font-mono">256 {t.bits}</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.nonceSize}: </span>
                    <span className="text-white font-mono">96 {t.bits}</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.authTag}: </span>
                    <span className="text-white font-mono">128 {t.bits}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'decrypt' && (
        <>
          {/* Encrypted Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.encryptedLabel}</label>
            <textarea
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
              placeholder={t.encryptedPlaceholder}
              rows={4}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
            />
          </div>

          {/* Decrypt Key */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.keyLabel}</label>
            <input
              type="text"
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
              placeholder={t.keyPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Decrypt Nonce (optional) */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.nonceLabel} (optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={decryptNonce}
                onChange={(e) => setDecryptNonce(e.target.value)}
                placeholder={t.noncePlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              <button
                onClick={generateDecryptNonce}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors whitespace-nowrap"
              >
                {t.generateNonce}
              </button>
            </div>
          </div>

          {/* Decrypt Button */}
          <button
            onClick={handleDecrypt}
            disabled={!encryptedInput || !decryptKey || isDecrypting}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDecrypting ? t.decrypting : t.decryptButton}
          </button>

          {/* Decrypted Output */}
          {decryptedOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.decryptedLabel}</label>
                <button
                  onClick={() => handleCopy(decryptedOutput)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
                {decryptedOutput}
              </div>
            </div>
          )}
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
