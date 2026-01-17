'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getArgon2ToolTranslations } from '@/lib/i18n-argon2-tool';
import toast from 'react-hot-toast';
import { argon2id, argon2i, argon2d, argon2Verify } from 'hash-wasm';

type Tab = 'generate' | 'verify';
type Variant = 'argon2d' | 'argon2i' | 'argon2id';

export function Argon2Tool() {
  const { locale } = useI18n();
  const t = getArgon2ToolTranslations(locale);
  const tabs = JSON.parse(t.tabs);
  const verifyResultText = JSON.parse(t.verifyResult);

  const [activeTab, setActiveTab] = useState<Tab>('generate');

  // Generate state
  const [password, setPassword] = useState('');
  const [variant, setVariant] = useState<Variant>('argon2id');
  const [memory, setMemory] = useState(65536); // 64 MB
  const [iterations, setIterations] = useState(3);
  const [parallelism, setParallelism] = useState(4);
  const [hashLength, setHashLength] = useState(32);
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
      const salt = crypto.getRandomValues(new Uint8Array(16));

      const hashFn = variant === 'argon2d' ? argon2d :
                     variant === 'argon2i' ? argon2i : argon2id;

      const result = await hashFn({
        password: password,
        salt: salt,
        parallelism: parallelism,
        iterations: iterations,
        memorySize: memory,
        hashLength: hashLength,
        outputType: 'encoded',
      });

      setGeneratedHash(result);
    } catch (error) {
      toast.error('Error generating hash');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    if (!hashToVerify || !passwordToVerify) return;

    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const result = await argon2Verify({
        password: passwordToVerify,
        hash: hashToVerify,
      });
      setVerifyResult(result);
    } catch (error) {
      toast.error('Invalid Argon2 hash format');
      setVerifyResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const parseHash = (hash: string) => {
    const match = hash.match(/^\$(argon2(?:d|i|id))\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$/);
    if (!match) return null;
    return {
      variant: match[1],
      version: match[2],
      memory: parseInt(match[3]),
      iterations: parseInt(match[4]),
      parallelism: parseInt(match[5]),
    };
  };

  const parsedHash = generatedHash ? parseHash(generatedHash) : null;
  const parsedVerifyHash = hashToVerify ? parseHash(hashToVerify) : null;

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🏆 {t.securityNote}</p>
      </div>

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
            {tabs[tab]}
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

          {/* Variant Selection */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <label className="block text-sm text-hub-muted mb-2">{t.variantLabel}</label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'argon2d', label: t.variantArgon2d },
                { value: 'argon2i', label: t.variantArgon2i },
                { value: 'argon2id', label: t.variantArgon2id },
              ] as { value: Variant; label: string }[]).map((v) => (
                <button
                  key={v.value}
                  onClick={() => setVariant(v.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    variant === v.value
                      ? 'bg-hub-accent text-hub-darker border-hub-accent'
                      : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Cost */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.memoryLabel}</label>
              <span className="text-hub-accent font-mono">{(memory / 1024).toFixed(0)} MB</span>
            </div>
            <input
              type="range"
              min={1024}
              max={262144}
              step={1024}
              value={memory}
              onChange={(e) => setMemory(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
            <div className="flex justify-between text-xs text-hub-muted mt-1">
              <span>1 MB</span>
              <span>256 MB</span>
            </div>
          </div>

          {/* Iterations */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.iterationsLabel}</label>
              <span className="text-hub-accent font-mono">{iterations}</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
          </div>

          {/* Parallelism */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.parallelismLabel}</label>
              <span className="text-hub-accent font-mono">{parallelism}</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={parallelism}
              onChange={(e) => setParallelism(parseInt(e.target.value))}
              className="w-full accent-hub-accent"
            />
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
                      <span className="text-hub-muted">{t.variant}: </span>
                      <span className="text-white font-mono">{parsedHash.variant}</span>
                    </div>
                    <div>
                      <span className="text-hub-muted">{t.memory}: </span>
                      <span className="text-white font-mono">{(parsedHash.memory / 1024).toFixed(0)} MB</span>
                    </div>
                    <div>
                      <span className="text-hub-muted">{t.iterations}: </span>
                      <span className="text-white font-mono">{parsedHash.iterations}</span>
                    </div>
                    <div>
                      <span className="text-hub-muted">{t.parallelism}: </span>
                      <span className="text-white font-mono">{parsedHash.parallelism}</span>
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
                  <span className="text-hub-muted">{t.variant}: </span>
                  <span className="text-white font-mono">{parsedVerifyHash.variant}</span>
                </div>
                <div>
                  <span className="text-hub-muted">{t.memory}: </span>
                  <span className="text-white font-mono">{(parsedVerifyHash.memory / 1024).toFixed(0)} MB</span>
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
                {verifyResult ? verifyResultText.match : verifyResultText.noMatch}
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
