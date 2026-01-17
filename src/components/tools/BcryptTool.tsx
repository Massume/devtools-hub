'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBcryptToolTranslations } from '@/lib/i18n-bcrypt-tool';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';

type Tab = 'generate' | 'verify';

function parseBcryptHash(hash: string) {
  const match = hash.match(/^\$(\d[a-z])\$(\d{2})\$(.{22})(.{31})$/);
  if (!match) return null;

  return {
    version: match[1],
    cost: parseInt(match[2], 10),
    salt: match[3],
    hash: match[4],
  };
}

export function BcryptTool() {
  const { locale } = useI18n();
  const t = getBcryptToolTranslations(locale);

  const [activeTab, setActiveTab] = useState<Tab>('generate');

  // Generate state
  const [password, setPassword] = useState('');
  const [cost, setCost] = useState(10);
  const [generatedHash, setGeneratedHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Verify state
  const [hashToVerify, setHashToVerify] = useState('');
  const [passwordToVerify, setPasswordToVerify] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGenerate = async () => {
    if (!password) return;

    setIsGenerating(true);
    try {
      // bcryptjs is synchronous but can block UI, so we use setTimeout to allow render
      await new Promise(resolve => setTimeout(resolve, 10));
      const salt = bcrypt.genSaltSync(cost);
      const hash = bcrypt.hashSync(password, salt);
      setGeneratedHash(hash);
    } catch (error) {
      toast.error('Error generating hash');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    if (!hashToVerify || !passwordToVerify) return;

    setIsVerifying(true);
    setVerifyResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 10));
      const result = bcrypt.compareSync(passwordToVerify, hashToVerify);
      setVerifyResult(result);
    } catch (error) {
      toast.error('Invalid bcrypt hash format');
      setVerifyResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const parsedHash = generatedHash ? parseBcryptHash(generatedHash) : null;
  const parsedVerifyHash = hashToVerify ? parseBcryptHash(hashToVerify) : null;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-hub-border">
        {(['generate', 'verify'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setVerifyResult(null);
            }}
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

      {activeTab === 'generate' && (
        <>
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.passwordLabel}</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Cost Factor */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.costLabel}</label>
              <span className="text-hub-accent font-mono">{cost}</span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
            <p className="text-xs text-hub-muted mt-2">{t.costHelp}</p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!password || isGenerating}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? t.generating : t.generateButton}
          </button>

          {/* Generated Hash */}
          {generatedHash && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.hashLabel}</label>
                <button
                  onClick={() => handleCopy(generatedHash)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 break-all">
                {generatedHash}
              </div>

              {/* Hash Info */}
              {parsedHash && (
                <div className="mt-4 bg-hub-card border border-hub-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-hub-muted mb-3">{t.hashInfo}</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-hub-muted">{t.version}: </span>
                      <span className="text-white font-mono">${parsedHash.version}$</span>
                    </div>
                    <div>
                      <span className="text-hub-muted">{t.cost}: </span>
                      <span className="text-white font-mono">{parsedHash.cost}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-hub-muted">{t.salt}: </span>
                      <span className="text-white font-mono">{parsedHash.salt}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-hub-muted">{t.hashPart}: </span>
                      <span className="text-white font-mono">{parsedHash.hash}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'verify' && (
        <>
          {/* Hash Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.hashInputLabel}</label>
            <input
              type="text"
              value={hashToVerify}
              onChange={(e) => {
                setHashToVerify(e.target.value);
                setVerifyResult(null);
              }}
              placeholder={t.hashInputPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Hash Info for Verify */}
          {parsedVerifyHash && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-hub-muted mb-3">{t.hashInfo}</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-hub-muted">{t.version}: </span>
                  <span className="text-white font-mono">${parsedVerifyHash.version}$</span>
                </div>
                <div>
                  <span className="text-hub-muted">{t.cost}: </span>
                  <span className="text-white font-mono">{parsedVerifyHash.cost}</span>
                </div>
              </div>
            </div>
          )}

          {/* Password to Verify */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.verifyPasswordLabel}</label>
            <input
              type="text"
              value={passwordToVerify}
              onChange={(e) => {
                setPasswordToVerify(e.target.value);
                setVerifyResult(null);
              }}
              placeholder={t.verifyPasswordPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!hashToVerify || !passwordToVerify || isVerifying}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? t.verifying : t.verifyButton}
          </button>

          {/* Verify Result */}
          {verifyResult !== null && (
            <div className={`p-4 rounded-lg border ${
              verifyResult
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <p className={`text-sm font-medium ${verifyResult ? 'text-green-500' : 'text-red-500'}`}>
                {verifyResult ? '✓ ' : '✗ '}
                {verifyResult ? t.verifyResult.match : t.verifyResult.noMatch}
              </p>
            </div>
          )}
        </>
      )}

      {/* Cost Guidelines */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-2">{t.costGuidelines}</h3>
        <p className="text-sm text-hub-muted">{t.costGuidelinesText}</p>
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
