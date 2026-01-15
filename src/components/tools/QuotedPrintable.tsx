'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getQuotedPrintableTranslations } from '@/lib/i18n-quoted-printable';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

function encodeQuotedPrintable(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let result = '';
  let lineLength = 0;

  for (const byte of bytes) {
    let encoded: string;

    // Printable ASCII (33-126) except = (61)
    if ((byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126)) {
      encoded = String.fromCharCode(byte);
    } else if (byte === 32 || byte === 9) {
      // Space and tab - encode at end of line
      encoded = String.fromCharCode(byte);
    } else {
      // Encode as =XX
      encoded = '=' + byte.toString(16).toUpperCase().padStart(2, '0');
    }

    // Soft line break at 76 characters
    if (lineLength + encoded.length > 75) {
      result += '=\r\n';
      lineLength = 0;
    }

    result += encoded;
    lineLength += encoded.length;

    // Handle newlines
    if (byte === 10) {
      lineLength = 0;
    }
  }

  return result;
}

function decodeQuotedPrintable(text: string): string {
  // Remove soft line breaks
  let decoded = text.replace(/=\r?\n/g, '');

  // Decode =XX sequences
  decoded = decoded.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

export function QuotedPrintable() {
  const { locale } = useI18n();
  const t = getQuotedPrintableTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    if (!input) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = encodeQuotedPrintable(input);
      setOutput(encoded);
      toast.success(t.encodedSuccess);
    } catch (error) {
      toast.error('Encoding error: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const decoded = decodeQuotedPrintable(input);
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidQP);
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
          onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.encode}
        </button>
        <button
          onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
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
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'encode' ? t.encodeButton : t.decodeButton}
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
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                {t.copyButton}
              </button>
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
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
