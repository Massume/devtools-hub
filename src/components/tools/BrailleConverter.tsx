'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBrailleTranslations } from '@/lib/i18n-braille';
import toast from 'react-hot-toast';

type Mode = 'encode' | 'decode';

// Grade 1 English Braille mapping
const TEXT_TO_BRAILLE: Record<string, string> = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
  'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
  'z': '⠵',
  '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑',
  '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚',
  ' ': '⠀',
  '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', "'": '⠄',
  '-': '⠤', ':': '⠒', ';': '⠆', '(': '⠶', ')': '⠶',
};

const BRAILLE_TO_TEXT: Record<string, string> = {
  '⠁': 'a', '⠃': 'b', '⠉': 'c', '⠙': 'd', '⠑': 'e',
  '⠋': 'f', '⠛': 'g', '⠓': 'h', '⠊': 'i', '⠚': 'j',
  '⠅': 'k', '⠇': 'l', '⠍': 'm', '⠝': 'n', '⠕': 'o',
  '⠏': 'p', '⠟': 'q', '⠗': 'r', '⠎': 's', '⠞': 't',
  '⠥': 'u', '⠧': 'v', '⠺': 'w', '⠭': 'x', '⠽': 'y',
  '⠵': 'z',
  '⠀': ' ',
  '⠲': '.', '⠂': ',', '⠦': '?', '⠖': '!', '⠄': "'",
  '⠤': '-', '⠒': ':', '⠆': ';', '⠶': '()',
  '⠼': '#', // Number indicator
};

const NUMBER_INDICATOR = '⠼';

function textToBraille(text: string): string {
  let result = '';
  let isNumber = false;

  for (const char of text.toLowerCase()) {
    if (/[0-9]/.test(char)) {
      if (!isNumber) {
        result += NUMBER_INDICATOR;
        isNumber = true;
      }
      result += TEXT_TO_BRAILLE[char] || char;
    } else {
      isNumber = false;
      result += TEXT_TO_BRAILLE[char] || char;
    }
  }

  return result;
}

function brailleToText(braille: string): string {
  let result = '';
  let isNumber = false;

  for (const char of braille) {
    if (char === NUMBER_INDICATOR) {
      isNumber = true;
      continue;
    }

    if (char === '⠀' || char === ' ') {
      isNumber = false;
      result += ' ';
      continue;
    }

    const decoded = BRAILLE_TO_TEXT[char];
    if (decoded) {
      if (isNumber && /[a-j]/.test(decoded)) {
        // Convert letter to number
        const numMap: Record<string, string> = {
          'a': '1', 'b': '2', 'c': '3', 'd': '4', 'e': '5',
          'f': '6', 'g': '7', 'h': '8', 'i': '9', 'j': '0'
        };
        result += numMap[decoded] || decoded;
      } else {
        result += decoded;
        if (!/[a-z]/.test(decoded)) {
          isNumber = false;
        }
      }
    } else {
      result += char;
    }
  }

  return result;
}

export function BrailleConverter() {
  const { locale } = useI18n();
  const t = getBrailleTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const encoded = textToBraille(input);
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
      const decoded = brailleToText(input);
      setOutput(decoded);
      toast.success(t.decodedSuccess);
    } catch (error) {
      toast.error(t.invalidBraille);
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

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const numbers = '1234567890'.split('');

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
            className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
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

          <div className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-2xl overflow-auto break-all tracking-wider">
            {output || <span className="text-hub-muted text-sm">...</span>}
          </div>
        </div>
      </div>

      {/* Braille Reference */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.referenceTitle}</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.letters}</h4>
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
              {letters.map(letter => (
                <div key={letter} className="bg-hub-darker border border-hub-border rounded p-2 text-center">
                  <div className="text-2xl">{TEXT_TO_BRAILLE[letter]}</div>
                  <div className="text-xs text-hub-accent font-bold mt-1">{letter.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-hub-muted mb-2">{t.numbers}</h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {numbers.map(num => (
                <div key={num} className="bg-hub-darker border border-hub-border rounded p-2 text-center">
                  <div className="text-2xl">{TEXT_TO_BRAILLE[num]}</div>
                  <div className="text-xs text-hub-accent font-bold mt-1">{num}</div>
                </div>
              ))}
            </div>
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
