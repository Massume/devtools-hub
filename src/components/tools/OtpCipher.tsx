'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getOtpCipherTranslations } from '@/lib/i18n-otp-cipher';
import toast from 'react-hot-toast';

type Tab = 'encrypt' | 'decrypt';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array | null {
  const cleanHex = hex.replace(/\s/g, '');
  if (!/^[0-9a-fA-F]*$/.test(cleanHex) || cleanHex.length % 2 !== 0) {
    return null;
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export function OtpCipher() {
  const { locale } = useI18n();
  const t = getOtpCipherTranslations(locale);
  const tabs = JSON.parse(t.tabs);

  const [activeTab, setActiveTab] = useState<Tab>('encrypt');

  // Encrypt state
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');

  // Decrypt state
  const [ciphertextInput, setCiphertextInput] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const generateKey = () => {
    if (!message) {
      toast.error(t.keyRequired);
      return;
    }
    const messageBytes = textToBytes(message);
    const keyBytes = crypto.getRandomValues(new Uint8Array(messageBytes.length));
    setKey(bytesToHex(keyBytes));
  };

  const handleEncrypt = () => {
    if (!key) {
      toast.error(t.keyRequired);
      return;
    }

    const keyBytes = hexToBytes(key);
    if (!keyBytes) {
      toast.error(t.invalidHex);
      return;
    }

    const messageBytes = textToBytes(message);
    if (keyBytes.length < messageBytes.length) {
      toast.error(t.keyTooShort);
      return;
    }

    const keySlice = keyBytes.slice(0, messageBytes.length);
    const ciphertextBytes = xorBytes(messageBytes, keySlice);
    setCiphertext(bytesToHex(ciphertextBytes));
  };

  const handleDecrypt = () => {
    if (!decryptKey) {
      toast.error(t.keyRequired);
      return;
    }

    const keyBytes = hexToBytes(decryptKey);
    if (!keyBytes) {
      toast.error(t.invalidHex);
      return;
    }

    const ciphertextBytes = hexToBytes(ciphertextInput);
    if (!ciphertextBytes) {
      toast.error(t.invalidHex);
      return;
    }

    if (keyBytes.length < ciphertextBytes.length) {
      toast.error(t.keyTooShort);
      return;
    }

    const keySlice = keyBytes.slice(0, ciphertextBytes.length);
    const decryptedBytes = xorBytes(ciphertextBytes, keySlice);
    setDecrypted(bytesToText(decryptedBytes));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleClear = () => {
    if (activeTab === 'encrypt') {
      setMessage('');
      setKey('');
      setCiphertext('');
    } else {
      setCiphertextInput('');
      setDecryptKey('');
      setDecrypted('');
    }
  };

  const messageBytes = message ? textToBytes(message).length : 0;
  const keyBytes = key ? (hexToBytes(key)?.length || 0) : 0;

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-500">⚠️ {t.warningOtp}</p>
      </div>

      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔐 {t.securityNote}</p>
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
          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.messageLabel}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
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
                disabled={!message}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white text-sm rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {t.generateKey}
              </button>
            </div>
            <p className="text-xs text-hub-muted mt-1">{t.keyLengthInfo}</p>
          </div>

          {/* Key Info */}
          {(message || key) && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-hub-muted mb-3">{t.keyInfo}</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-hub-muted">{t.messageLength}: </span>
                  <span className={`font-mono ${messageBytes > keyBytes && keyBytes > 0 ? 'text-red-500' : 'text-white'}`}>
                    {messageBytes} {t.bytes}
                  </span>
                </div>
                <div>
                  <span className="text-hub-muted">{t.keyLength}: </span>
                  <span className={`font-mono ${keyBytes < messageBytes && keyBytes > 0 ? 'text-red-500' : 'text-green-400'}`}>
                    {keyBytes} {t.bytes}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEncrypt}
              disabled={!message || !key}
              className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.encryptButton}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {t.clearButton}
            </button>
          </div>

          {/* Ciphertext Output */}
          {ciphertext && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
                <button
                  onClick={() => handleCopy(ciphertext)}
                  className="text-sm text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 break-all">
                {ciphertext}
              </div>

              {/* Copy Key Button */}
              <div className="mt-3">
                <button
                  onClick={() => handleCopy(key)}
                  className="text-sm text-hub-accent hover:underline"
                >
                  {t.copyKey}
                </button>
              </div>
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
              value={ciphertextInput}
              onChange={(e) => setCiphertextInput(e.target.value)}
              placeholder={t.ciphertextPlaceholder}
              className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Decrypt Key Input */}
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

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDecrypt}
              disabled={!ciphertextInput || !decryptKey}
              className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.decryptButton}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {t.clearButton}
            </button>
          </div>

          {/* Decrypted Output */}
          {decrypted && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.decryptedLabel}</label>
                <button
                  onClick={() => handleCopy(decrypted)}
                  className="text-sm text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white">
                {decrypted}
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
