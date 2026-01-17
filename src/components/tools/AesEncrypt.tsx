'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getAesEncryptTranslations } from '@/lib/i18n-aes-encrypt';
import toast from 'react-hot-toast';

type Tab = 'encrypt' | 'decrypt';
type Algorithm = 'AES-GCM' | 'AES-CBC';
type OutputFormat = 'base64' | 'hex';

// Derive key from password using PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const bytes = hex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || [];
  return new Uint8Array(bytes);
}

export function AesEncrypt() {
  const { locale } = useI18n();
  const t = getAesEncryptTranslations(locale);

  const [activeTab, setActiveTab] = useState<Tab>('encrypt');
  const [algorithm] = useState<Algorithm>('AES-GCM');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('base64');

  // Encrypt state
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encrypted, setEncrypted] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Decrypt state
  const [ciphertext, setCiphertext] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [showDecryptPassword, setShowDecryptPassword] = useState(false);
  const [decrypted, setDecrypted] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState('');

  const handleEncrypt = async () => {
    if (!plaintext || !password) return;

    setIsEncrypting(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);

      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Derive key
      const key = await deriveKey(password, salt);

      // Encrypt
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Format output
      const output = outputFormat === 'base64'
        ? arrayBufferToBase64(combined.buffer)
        : arrayBufferToHex(combined.buffer);

      setEncrypted(output);
    } catch (error) {
      toast.error('Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !decryptPassword) return;

    setIsDecrypting(true);
    setDecryptError('');
    setDecrypted('');

    try {
      // Parse input based on format (auto-detect)
      let combined: Uint8Array;
      try {
        // Try base64 first
        combined = base64ToArrayBuffer(ciphertext);
      } catch {
        // Try hex
        combined = hexToArrayBuffer(ciphertext);
      }

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encryptedData = combined.slice(28);

      // Derive key
      const key = await deriveKey(decryptPassword, salt);

      // Decrypt
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      setDecrypted(decoder.decode(decryptedData));
    } catch (error) {
      setDecryptError(t.error.decryptFailed);
    } finally {
      setIsDecrypting(false);
    }
  };

  const generateRandomKey = () => {
    const array = crypto.getRandomValues(new Uint8Array(32));
    const key = arrayBufferToBase64(array.buffer);
    if (activeTab === 'encrypt') {
      setPassword(key);
    } else {
      setDecryptPassword(key);
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
        <p className="text-sm text-green-500">🔒 {t.securityNote}</p>
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
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'encrypt' && (
        <>
          {/* Plaintext Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.plaintextLabel}</label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder={t.plaintextPlaceholder}
              className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.passwordLabel}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent pr-20"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hub-muted hover:text-white"
                >
                  {showPassword ? t.hidePassword : t.showPassword}
                </button>
              </div>
              <button
                onClick={generateRandomKey}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors whitespace-nowrap"
              >
                {t.generateKeyButton}
              </button>
            </div>
          </div>

          {/* Output Format */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <label className="block text-sm text-hub-muted mb-2">{t.outputFormatLabel}</label>
            <div className="flex gap-2">
              {(['base64', 'hex'] as OutputFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setOutputFormat(format)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    outputFormat === format
                      ? 'bg-hub-accent text-hub-darker border-hub-accent'
                      : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                  }`}
                >
                  {format === 'base64' ? t.formatBase64 : t.formatHex}
                </button>
              ))}
            </div>
          </div>

          {/* Encrypt Button */}
          <button
            onClick={handleEncrypt}
            disabled={!plaintext || !password || isEncrypting}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEncrypting ? t.encrypting : t.encryptButton}
          </button>

          {/* Encrypted Output */}
          {encrypted && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
                <button
                  onClick={() => handleCopy(encrypted)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <textarea
                value={encrypted}
                readOnly
                className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 resize-none focus:outline-none"
              />
            </div>
          )}
        </>
      )}

      {activeTab === 'decrypt' && (
        <>
          {/* Ciphertext Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.ciphertextLabel}</label>
            <textarea
              value={ciphertext}
              onChange={(e) => {
                setCiphertext(e.target.value);
                setDecryptError('');
              }}
              placeholder={t.ciphertextPlaceholder}
              className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.passwordLabel}</label>
            <div className="relative">
              <input
                type={showDecryptPassword ? 'text' : 'password'}
                value={decryptPassword}
                onChange={(e) => {
                  setDecryptPassword(e.target.value);
                  setDecryptError('');
                }}
                placeholder={t.passwordPlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent pr-20"
              />
              <button
                onClick={() => setShowDecryptPassword(!showDecryptPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hub-muted hover:text-white"
              >
                {showDecryptPassword ? t.hidePassword : t.showPassword}
              </button>
            </div>
          </div>

          {/* Decrypt Button */}
          <button
            onClick={handleDecrypt}
            disabled={!ciphertext || !decryptPassword || isDecrypting}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDecrypting ? t.decrypting : t.decryptButton}
          </button>

          {/* Error */}
          {decryptError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-500">✗ {decryptError}</p>
            </div>
          )}

          {/* Decrypted Output */}
          {decrypted && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.decryptedLabel}</label>
                <button
                  onClick={() => handleCopy(decrypted)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <textarea
                value={decrypted}
                readOnly
                className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
              />
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
