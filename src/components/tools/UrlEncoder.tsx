'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUrlTranslations } from '@/lib/i18n-url';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

interface UrlComponents {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

export function UrlEncoder() {
  const { locale } = useI18n();
  const t = getUrlTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlComponents, setUrlComponents] = useState<UrlComponents | null>(null);

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success(t.encodedSuccess);

      // Try to parse as URL for components
      parseUrlComponents(input);
    } catch (error) {
      toast.error('Encoding error: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success(t.decodedSuccess);

      // Try to parse decoded URL for components
      parseUrlComponents(decoded);
    } catch (error) {
      toast.error('Decoding error: ' + (error as Error).message);
    }
  };

  const parseUrlComponents = (urlString: string) => {
    try {
      // Only parse if it looks like a full URL
      if (!urlString.includes('://')) {
        setUrlComponents(null);
        return;
      }

      const url = new URL(urlString);
      setUrlComponents({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      });
    } catch (error) {
      setUrlComponents(null);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setUrlComponents(null);
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setUrlComponents(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.encode}
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setUrlComponents(null); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.decode}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t.encodePlaceholder : t.decodePlaceholder}
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'encode' ? t.encodeButton : t.decodeButton}
            </button>
            {output && (
              <button
                onClick={handleSwap}
                className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
                title={t.swapButton}
              >
                ↔️
              </button>
            )}
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.clearButton}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.outputLabel}</h3>
            {output && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                📋 {t.copyButton}
              </button>
            )}
          </div>

          <div className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 overflow-auto break-all">
            {output || <span className="text-hub-muted">...</span>}
          </div>
        </div>
      </div>

      {/* URL Components */}
      {urlComponents && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">{t.urlComponents}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {urlComponents.protocol && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.protocol}</div>
                <code className="text-sm text-white">{urlComponents.protocol}</code>
              </div>
            )}
            {urlComponents.hostname && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.hostname}</div>
                <code className="text-sm text-white">{urlComponents.hostname}</code>
              </div>
            )}
            {urlComponents.port && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.port}</div>
                <code className="text-sm text-white">{urlComponents.port}</code>
              </div>
            )}
            {urlComponents.pathname && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.pathname}</div>
                <code className="text-sm text-white break-all">{urlComponents.pathname}</code>
              </div>
            )}
            {urlComponents.search && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.search}</div>
                <code className="text-sm text-white break-all">{urlComponents.search}</code>
              </div>
            )}
            {urlComponents.hash && (
              <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
                <div className="text-sm text-hub-muted mb-1">{t.hash}</div>
                <code className="text-sm text-white">{urlComponents.hash}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[t.example1, t.example2, t.example3, t.example4].map((example, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5 text-hub-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-mono text-sm">{example}</span>
            </div>
          ))}
        </div>
      </div>

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
