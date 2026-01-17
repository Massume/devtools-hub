'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getVigenereCipherTranslations } from '@/lib/i18n-vigenere-cipher';
import toast from 'react-hot-toast';

function vigenereProcess(
  text: string,
  key: string,
  encrypt: boolean,
  preserveCase: boolean,
  preserveNonAlpha: boolean
): string {
  if (!key) return text;

  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;

  let keyIndex = 0;
  let result = '';

  for (const char of text) {
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (!isUpper && !isLower) {
      result += preserveNonAlpha ? char : '';
      continue;
    }

    const charCode = char.toUpperCase().charCodeAt(0) - 65;
    const keyCode = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;

    let newCode: number;
    if (encrypt) {
      newCode = (charCode + keyCode) % 26;
    } else {
      newCode = (charCode - keyCode + 26) % 26;
    }

    let newChar = String.fromCharCode(newCode + 65);

    if (preserveCase && isLower) {
      newChar = newChar.toLowerCase();
    }

    result += newChar;
    keyIndex++;
  }

  return result;
}

function getKeyVisualization(text: string, key: string): Array<{ char: string; keyChar: string; shift: number }> {
  if (!key || !text) return [];

  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return [];

  const result: Array<{ char: string; keyChar: string; shift: number }> = [];
  let keyIndex = 0;

  for (const char of text) {
    const isLetter = (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z');
    if (isLetter) {
      const keyChar = cleanKey[keyIndex % cleanKey.length];
      result.push({
        char: char.toUpperCase(),
        keyChar,
        shift: keyChar.charCodeAt(0) - 65,
      });
      keyIndex++;
      if (result.length >= 20) break; // Limit visualization
    }
  }

  return result;
}

export function VigenereCipher() {
  const { locale } = useI18n();
  const t = getVigenereCipherTranslations(locale);

  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [preserveCase, setPreserveCase] = useState(true);
  const [preserveNonAlpha, setPreserveNonAlpha] = useState(true);

  const keyVisualization = useMemo(() => {
    return getKeyVisualization(input, key);
  }, [input, key]);

  const handleEncrypt = () => {
    if (!key.replace(/[^a-zA-Z]/g, '')) {
      toast.error(t.keyRequired);
      return;
    }
    setOutput(vigenereProcess(input, key, true, preserveCase, preserveNonAlpha));
  };

  const handleDecrypt = () => {
    if (!key.replace(/[^a-zA-Z]/g, '')) {
      toast.error(t.keyRequired);
      return;
    }
    setOutput(vigenereProcess(input, key, false, preserveCase, preserveNonAlpha));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success(t.copied);
  };

  const handleClear = () => {
    setInput('');
    setKey('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-500">⚠️ {t.warningInsecure}</p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Key */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.keyLabel}</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={t.keyPlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Key Visualization */}
      {keyVisualization.length > 0 && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-2">{t.visualTitle}</h3>
          <p className="text-xs text-hub-muted mb-3">{t.visualDesc}</p>
          <div className="flex flex-wrap gap-2">
            {keyVisualization.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-white font-mono text-sm">{item.char}</div>
                <div className="text-hub-accent text-xs">↓ {item.keyChar}</div>
                <div className="text-hub-muted text-xs">+{item.shift}</div>
              </div>
            ))}
            {input.replace(/[^a-zA-Z]/g, '').length > 20 && (
              <div className="text-hub-muted text-sm self-center">...</div>
            )}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={preserveCase}
              onChange={(e) => setPreserveCase(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.preserveCase}
          </label>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={preserveNonAlpha}
              onChange={(e) => setPreserveNonAlpha(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.preserveNonAlpha}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEncrypt}
          disabled={!input}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.encryptButton}
        </button>
        <button
          onClick={handleDecrypt}
          disabled={!input}
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

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none"
          />
        </div>
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
