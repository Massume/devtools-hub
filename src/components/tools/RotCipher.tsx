'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRotCipherTranslations } from '@/lib/i18n-rot-cipher';
import toast from 'react-hot-toast';

type CipherType = 'rot13' | 'rot47';

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function rot47(text: string): string {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      // Only process printable ASCII (33-126)
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return char;
    })
    .join('');
}

export function RotCipher() {
  const { locale } = useI18n();
  const t = getRotCipherTranslations(locale);

  const [cipherType, setCipherType] = useState<CipherType>('rot13');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    if (!input) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = cipherType === 'rot13' ? rot13(input) : rot47(input);
      setOutput(result);
      toast.success(t.processedSuccess);
    } catch (error) {
      toast.error('Processing error: ' + (error as Error).message);
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
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Cipher Type Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setCipherType('rot13'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            cipherType === 'rot13'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.rot13}
        </button>
        <button
          onClick={() => { setCipherType('rot47'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            cipherType === 'rot47'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.rot47}
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
            placeholder={t.inputPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {t.processButton}
            </button>
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
              <div className="flex gap-2">
                <button
                  onClick={handleSwap}
                  className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
                >
                  {t.swapButton}
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
                >
                  {t.copyButton}
                </button>
              </div>
            )}
          </div>

          <div className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto break-all">
            {output || <span className="text-hub-muted">...</span>}
          </div>
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
      <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-hub-accent mb-1">ROT13</h4>
            <p className="text-gray-300 leading-relaxed">{t.aboutRot13}</p>
          </div>
          <div>
            <h4 className="font-semibold text-hub-accent mb-1">ROT47</h4>
            <p className="text-gray-300 leading-relaxed">{t.aboutRot47}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
