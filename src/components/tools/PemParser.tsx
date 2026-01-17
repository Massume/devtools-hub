'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPemParserTranslations } from '@/lib/i18n-pem-parser';
import toast from 'react-hot-toast';

interface PemBlock {
  type: string;
  headers: Record<string, string>;
  base64: string;
  raw: Uint8Array;
}

const PEM_TYPES: Record<string, string> = {
  'CERTIFICATE': 'typeCertificate',
  'X509 CERTIFICATE': 'typeCertificate',
  'TRUSTED CERTIFICATE': 'typeCertificate',
  'PRIVATE KEY': 'typePrivateKey',
  'PUBLIC KEY': 'typePublicKey',
  'RSA PRIVATE KEY': 'typeRsaPrivate',
  'RSA PUBLIC KEY': 'typeRsaPublic',
  'EC PRIVATE KEY': 'typeEcPrivate',
  'CERTIFICATE REQUEST': 'typeCsr',
  'NEW CERTIFICATE REQUEST': 'typeCsr',
  'ENCRYPTED PRIVATE KEY': 'typeEncryptedKey',
  'DH PARAMETERS': 'typeDhParams',
};

function parsePem(pemData: string): PemBlock[] {
  const blocks: PemBlock[] = [];
  const pemRegex = /-----BEGIN ([^-]+)-----\r?\n([\s\S]*?)-----END \1-----/g;

  let match;
  while ((match = pemRegex.exec(pemData)) !== null) {
    const type = match[1];
    const content = match[2];

    // Parse headers (like Proc-Type, DEK-Info)
    const lines = content.split(/\r?\n/);
    const headers: Record<string, string> = {};
    let base64Start = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        base64Start = i + 1;
        break;
      }
      const headerMatch = line.match(/^([^:]+):\s*(.*)$/);
      if (headerMatch) {
        headers[headerMatch[1]] = headerMatch[2];
        base64Start = i + 1;
      } else if (line.match(/^[A-Za-z0-9+/=]+$/)) {
        // This is base64 content, not a header
        break;
      }
    }

    const base64Content = lines.slice(base64Start).join('').replace(/\s/g, '');

    // Decode base64
    let raw: Uint8Array;
    try {
      const binary = atob(base64Content);
      raw = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        raw[i] = binary.charCodeAt(i);
      }
    } catch {
      raw = new Uint8Array(0);
    }

    blocks.push({
      type,
      headers,
      base64: base64Content,
      raw,
    });
  }

  return blocks;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}

function formatHexDump(bytes: Uint8Array, maxBytes: number = 256): string {
  const limited = bytes.slice(0, maxBytes);
  const lines: string[] = [];

  for (let i = 0; i < limited.length; i += 16) {
    const chunk = limited.slice(i, i + 16);
    const hex = Array.from(chunk)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    const ascii = Array.from(chunk)
      .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
      .join('');
    lines.push(`${i.toString(16).padStart(8, '0')}  ${hex.padEnd(48)}  |${ascii}|`);
  }

  return lines.join('\n');
}

const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAKHBfpegPjMCMA0GCSqGSIb3DQEBCwUAMBExDzANBgNVBAMMBnNh
bXBsZTAeFw0yNDAxMDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMBExDzANBgNVBAMM
BnNhbXBsZTBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQC7o96BpON1Jvxn4S8gkXA9
Mk7xT9HTwiRX0Y2bGqGfZpXvKHVGqNPyuJlYWMPQGCyEzqoNBWfGMin9x+Rk8/Hj
AgMBAAGjUDBOMB0GA1UdDgQWBBSBGXJXqZPYdnrLwqO0YKj4g1C1ljAfBgNVHSME
GDAWgBSBGXJXqZPYdnrLwqO0YKj4g1C1ljAMBgNVHRMEBTADAQH/MA0GCSqGSIb3
DQEBCwUAA0EAJ6MF0+Y1SIvL4RT+kKbYVFVL8qA8K2ueP9F4W5CpMD8wFQl1VgKA
4FXTqJCBh6xFwuv/AEMSbhvKNDWs0k2hRA==
-----END CERTIFICATE-----`;

export function PemParser() {
  const { locale } = useI18n();
  const t = getPemParserTranslations(locale) as Record<string, string>;

  const [input, setInput] = useState('');
  const [blocks, setBlocks] = useState<PemBlock[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = () => {
    if (!input.trim()) return;

    setIsParsing(true);
    try {
      const parsed = parsePem(input);
      if (parsed.length === 0) {
        toast.error(t.errorInvalidPem);
        setBlocks([]);
      } else {
        setBlocks(parsed);
      }
    } catch (error) {
      toast.error(t.errorParseFailed);
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_PEM);
    setBlocks([]);
  };

  const getTypeName = (type: string): string => {
    const key = PEM_TYPES[type];
    return key ? t[key] : t.typeUnknown;
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">{t.securityNote}</p>
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.inputLabel}</label>
          <button
            onClick={loadSample}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.sampleButton}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={10}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Parse Button */}
      <button
        onClick={handleParse}
        disabled={!input.trim() || isParsing}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isParsing ? t.parsing : t.parseButton}
      </button>

      {/* Results */}
      {blocks.length > 0 && (
        <div className="space-y-6">
          {blocks.length > 1 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-500">{t.multipleBlocks}: {blocks.length}</p>
            </div>
          )}

          {blocks.map((block, index) => (
            <div key={index} className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
              {blocks.length > 1 && (
                <h3 className="text-lg font-semibold text-white">{t.block} {index + 1}</h3>
              )}

              {/* PEM Info */}
              <div>
                <h4 className="text-sm font-medium text-hub-muted mb-3">{t.pemInfo}</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-hub-muted">{t.pemType}: </span>
                    <span className="text-hub-accent font-mono">{block.type}</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.detectedTypes}: </span>
                    <span className="text-white">{getTypeName(block.type)}</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.pemSize}: </span>
                    <span className="text-white font-mono">{block.raw.length} {t.bytes}</span>
                  </div>
                  <div>
                    <span className="text-hub-muted">{t.base64Lines}: </span>
                    <span className="text-white font-mono">{Math.ceil(block.base64.length / 64)}</span>
                  </div>
                </div>
              </div>

              {/* Headers */}
              {Object.keys(block.headers).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-hub-muted mb-2">{t.pemHeaders}</h4>
                  <div className="bg-hub-darker rounded-lg p-3">
                    {Object.entries(block.headers).map(([key, value]) => (
                      <div key={key} className="text-sm font-mono">
                        <span className="text-cyan-400">{key}:</span>{' '}
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hex Dump */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-hub-muted">{t.hexDump}</h4>
                  <button
                    onClick={() => handleCopy(bytesToHex(block.raw))}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <div className="bg-hub-darker rounded-lg p-3 overflow-x-auto">
                  <pre className="font-mono text-xs text-green-400 whitespace-pre">
                    {formatHexDump(block.raw)}
                  </pre>
                </div>
              </div>

              {/* Raw Base64 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-hub-muted">{t.rawBase64}</h4>
                  <button
                    onClick={() => handleCopy(block.base64)}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <div className="bg-hub-darker rounded-lg p-3 max-h-32 overflow-y-auto">
                  <code className="font-mono text-xs text-white break-all">
                    {block.base64}
                  </code>
                </div>
              </div>
            </div>
          ))}
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
