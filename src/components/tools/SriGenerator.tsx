'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getSriGeneratorTranslations } from '@/lib/i18n-sri-generator';
import toast from 'react-hot-toast';

type Algorithm = 'sha256' | 'sha384' | 'sha512';

async function generateHash(content: string, algorithm: Algorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const hashName = algorithm === 'sha256' ? 'SHA-256' :
                   algorithm === 'sha384' ? 'SHA-384' : 'SHA-512';

  const hashBuffer = await crypto.subtle.digest(hashName, data);
  const hashArray = new Uint8Array(hashBuffer);

  // Convert to base64
  let binary = '';
  for (let i = 0; i < hashArray.length; i++) {
    binary += String.fromCharCode(hashArray[i]);
  }
  return btoa(binary);
}

export function SriGenerator() {
  const { locale } = useI18n();
  const t = getSriGeneratorTranslations(locale);

  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(['sha384']);
  const [sriHash, setSriHash] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const toggleAlgorithm = (algo: Algorithm) => {
    if (algorithms.includes(algo)) {
      if (algorithms.length > 1) {
        setAlgorithms(algorithms.filter(a => a !== algo));
      }
    } else {
      setAlgorithms([...algorithms, algo].sort());
    }
  };

  const generateFromContent = async (contentToHash: string) => {
    if (!contentToHash) return;

    const hashes: string[] = [];
    for (const algo of algorithms) {
      const hash = await generateHash(contentToHash, algo);
      hashes.push(`${algo}-${hash}`);
    }

    setSriHash(hashes.join(' '));
    setContentLength(new TextEncoder().encode(contentToHash).length);
  };

  const handleGenerateFromContent = async () => {
    await generateFromContent(content);
  };

  const handleFetchAndGenerate = async () => {
    if (!url) {
      toast.error(t.errorInvalidUrl);
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error(t.errorInvalidUrl);
      return;
    }

    setIsFetching(true);
    setSriHash('');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Fetch failed');
      }
      const fetchedContent = await response.text();
      setContent(fetchedContent);
      await generateFromContent(fetchedContent);
    } catch (error) {
      toast.error(t.errorFetch);
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const getScriptTag = () => {
    const src = url || 'https://example.com/script.js';
    return `<script src="${src}" integrity="${sriHash}" crossorigin="anonymous"></script>`;
  };

  const getLinkTag = () => {
    const href = url || 'https://example.com/style.css';
    return `<link rel="stylesheet" href="${href}" integrity="${sriHash}" crossorigin="anonymous">`;
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🛡️ {t.securityNote}</p>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.urlLabel}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.urlPlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <button
            onClick={handleFetchAndGenerate}
            disabled={!url || isFetching}
            className="px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isFetching ? t.fetching : t.fetchAndGenerate}
          </button>
        </div>
      </div>

      {/* Content Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.contentLabel}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.contentPlaceholder}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Algorithm Selection */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.algorithmLabel}</label>
        <div className="flex gap-2">
          {(['sha256', 'sha384', 'sha512'] as Algorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => toggleAlgorithm(algo)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                algorithms.includes(algo)
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {algo.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-xs text-hub-muted mt-2">{t.multipleAlgorithms}</p>
      </div>

      {/* Generate from Content Button */}
      <button
        onClick={handleGenerateFromContent}
        disabled={!content}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t.generateButton}
      </button>

      {/* Output */}
      {sriHash && (
        <>
          {/* SRI Hash */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
              <button
                onClick={() => handleCopy(sriHash)}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyButton}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 break-all">
              {sriHash}
            </div>
          </div>

          {/* Resource Info */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-hub-muted mb-3">{t.resourceInfo}</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-hub-muted">{t.contentLength}: </span>
                <span className="text-white font-mono">{contentLength.toLocaleString()} {t.bytes}</span>
              </div>
              <div>
                <span className="text-hub-muted">{t.algorithm}: </span>
                <span className="text-white font-mono">{algorithms.map(a => a.toUpperCase()).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Script Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.scriptTagLabel}</label>
              <button
                onClick={() => handleCopy(getScriptTag())}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyTag}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-cyan-400 break-all">
              {getScriptTag()}
            </div>
          </div>

          {/* Link Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-hub-muted">{t.linkTagLabel}</label>
              <button
                onClick={() => handleCopy(getLinkTag())}
                className="text-sm text-hub-accent hover:underline"
              >
                {t.copyTag}
              </button>
            </div>
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs text-purple-400 break-all">
              {getLinkTag()}
            </div>
          </div>
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
