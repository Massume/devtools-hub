'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBase64Translations } from '@/lib/i18n-base64';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

export function Base64Converter() {
  const { locale } = useI18n();
  const t = getBase64Translations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast.success(t.encodedSuccess);
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
      const decoded = atob(input.trim());
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidBase64);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t.fileTooBig);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const base64 = result.split(',')[1]; // Remove data URL prefix
        setOutput(base64);
        setFileName(file.name);
        toast.success(t.fileEncoded);
      }
    };
    reader.readAsDataURL(file);
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

  const handleDownload = () => {
    if (!output) return;

    if (mode === 'encode') {
      // Download as .txt file with base64 content
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'encoded.txt';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Try to download decoded content
      try {
        const decoded = atob(output);
        const blob = new Blob([decoded], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'decoded.txt';
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(t.invalidBase64);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.inputLabel}</h3>
            {mode === 'encode' && (
              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <span className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium">
                  📁 {t.uploadFile}
                </span>
              </label>
            )}
          </div>

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
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
                >
                  📋 {t.copyButton}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
                >
                  ⬇️ {t.downloadButton}
                </button>
              </div>
            )}
          </div>

          <div className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto break-all">
            {output || <span className="text-hub-muted">...</span>}
          </div>

          {fileName && (
            <div className="text-sm text-hub-muted">
              File: <span className="text-white">{fileName}</span>
            </div>
          )}
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

      {/* About Base64 */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
