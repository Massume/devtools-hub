'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getBsonTranslations } from '@/lib/i18n-bson';
import toast from 'react-hot-toast';
import { BSON, EJSON, ObjectId } from 'bson';

type Mode = 'encode' | 'decode';
type OutputFormat = 'base64' | 'hex';
type EJSONMode = 'relaxed' | 'canonical';

interface SizeInfo {
  jsonSize: number;
  bsonSize: number;
}

const EXAMPLES = {
  simple: {
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
  },
  objectId: {
    _id: { $oid: '507f1f77bcf86cd799439011' },
    name: 'Document with ObjectId',
  },
  date: {
    createdAt: { $date: '2024-01-15T10:30:00.000Z' },
    title: 'Document with Date',
  },
  mixed: {
    _id: { $oid: '507f1f77bcf86cd799439011' },
    name: 'Mixed types document',
    count: { $numberInt: '42' },
    price: { $numberDouble: '19.99' },
    createdAt: { $date: '2024-01-15T10:30:00.000Z' },
    tags: ['mongodb', 'bson', 'database'],
    active: true,
  },
};

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function BsonJson() {
  const { locale } = useI18n();
  const t = getBsonTranslations(locale);

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('base64');
  const [ejsonMode, setEjsonMode] = useState<EJSONMode>('relaxed');
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null);

  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      // Parse as Extended JSON to support BSON types
      const data = EJSON.parse(input);
      const encoded = BSON.serialize(data);

      const result =
        outputFormat === 'base64'
          ? arrayBufferToBase64(encoded)
          : arrayBufferToHex(encoded);

      setOutput(result);

      // Calculate size comparison
      const jsonSize = new TextEncoder().encode(input).length;
      const bsonSize = encoded.length;

      setSizeInfo({ jsonSize, bsonSize });
      toast.success(t.encodedSuccess);
    } catch (e) {
      console.error(e);
      toast.error(t.invalidJson);
    }
  }, [input, outputFormat, t]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      let bytes: Uint8Array;

      // Auto-detect format
      const cleanInput = input.trim().replace(/\s/g, '');
      if (/^[0-9a-fA-F]+$/.test(cleanInput) && cleanInput.length % 2 === 0) {
        bytes = hexToArrayBuffer(cleanInput);
      } else {
        bytes = base64ToArrayBuffer(cleanInput);
      }

      const decoded = BSON.deserialize(bytes);
      const result = EJSON.stringify(decoded, undefined, 2, {
        relaxed: ejsonMode === 'relaxed',
      });

      setOutput(result);
      setSizeInfo(null);
      toast.success(t.decodedSuccess);
    } catch (e) {
      console.error(e);
      toast.error(t.invalidBson);
    }
  }, [input, ejsonMode, t]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setSizeInfo(null);
  };

  const handleFormatJson = () => {
    try {
      const data = EJSON.parse(input);
      setInput(EJSON.stringify(data, undefined, 2, { relaxed: true }));
    } catch {
      toast.error(t.invalidJson);
    }
  };

  const handleGenerateObjectId = () => {
    const oid = new ObjectId();
    const currentInput = input.trim();

    if (!currentInput) {
      setInput(JSON.stringify({ _id: { $oid: oid.toHexString() } }, null, 2));
    } else {
      try {
        const data = EJSON.parse(currentInput);
        data._id = oid;
        setInput(EJSON.stringify(data, undefined, 2, { relaxed: false }));
      } catch {
        setInput(JSON.stringify({ _id: { $oid: oid.toHexString() } }, null, 2));
      }
    }
    toast.success(t.objectIdGenerated);
  };

  const loadExample = (key: keyof typeof EXAMPLES) => {
    setInput(JSON.stringify(EXAMPLES[key], null, 2));
    setMode('encode');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('encode');
              setOutput('');
              setSizeInfo(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'encode'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.jsonToBson}
          </button>
          <button
            onClick={() => {
              setMode('decode');
              setOutput('');
              setSizeInfo(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              mode === 'decode'
                ? 'bg-hub-accent text-hub-darker'
                : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
            }`}
          >
            {t.bsonToJson}
          </button>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.inputLabel}</h3>
            <div className="flex gap-2">
              {mode === 'encode' && (
                <>
                  <button
                    onClick={handleGenerateObjectId}
                    className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
                  >
                    {t.generateObjectId}
                  </button>
                  <button
                    onClick={handleFormatJson}
                    className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors"
                  >
                    {t.formatJsonButton}
                  </button>
                </>
              )}
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t.jsonPlaceholder : t.bsonPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex flex-wrap items-center gap-4">
            {mode === 'encode' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-hub-muted">{t.outputFormat}:</span>
                <div className="flex gap-2">
                  {(['base64', 'hex'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        outputFormat === fmt
                          ? 'bg-hub-accent text-hub-darker'
                          : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
                      }`}
                    >
                      {t[fmt]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'decode' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-hub-muted">{t.extendedJson}:</span>
                <div className="flex gap-2">
                  {(['relaxed', 'canonical'] as EJSONMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setEjsonMode(m)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        ejsonMode === m
                          ? 'bg-hub-accent text-hub-darker'
                          : 'bg-hub-darker border border-hub-border hover:border-hub-accent'
                      }`}
                    >
                      {t[m]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={mode === 'encode' ? handleEncode : handleDecode}
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

        {/* Output */}
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

          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="..."
          />

          {/* Size Comparison */}
          {sizeInfo && (
            <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-hub-muted mb-3">{t.sizeComparison}</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{sizeInfo.jsonSize}</div>
                  <div className="text-xs text-hub-muted">{t.jsonSize} ({t.bytes})</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-hub-accent">{sizeInfo.bsonSize}</div>
                  <div className="text-xs text-hub-muted">{t.bsonSize} ({t.bytes})</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BSON Special Types */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.specialTypes}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { type: t.objectId, example: '{ "$oid": "507f1f77bcf86cd799439011" }' },
            { type: t.date, example: '{ "$date": "2024-01-15T10:30:00Z" }' },
            { type: t.int64, example: '{ "$numberLong": "9223372036854775807" }' },
            { type: t.decimal128, example: '{ "$numberDecimal": "123.456" }' },
            { type: t.binary, example: '{ "$binary": { "base64": "...", "subType": "00" } }' },
            { type: t.timestamp, example: '{ "$timestamp": { "t": 1234567890, "i": 1 } }' },
          ].map(({ type, example }) => (
            <div key={type} className="bg-hub-darker border border-hub-border rounded-lg p-3">
              <div className="font-medium text-hub-accent text-sm">{type}</div>
              <code className="text-xs text-gray-400 break-all">{example}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'simple', label: t.exampleSimple },
            { key: 'objectId', label: t.exampleObjectId },
            { key: 'date', label: t.exampleDate },
            { key: 'mixed', label: t.exampleMixed },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => loadExample(key as keyof typeof EXAMPLES)}
              className="px-4 py-2 bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent transition-colors text-sm"
            >
              {label}
            </button>
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
