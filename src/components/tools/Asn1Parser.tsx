'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getAsn1ParserTranslations } from '@/lib/i18n-asn1-parser';
import toast from 'react-hot-toast';

interface Asn1Node {
  tag: number;
  tagClass: number;
  constructed: boolean;
  tagName: string;
  offset: number;
  headerLength: number;
  length: number;
  value: Uint8Array;
  children?: Asn1Node[];
  displayValue?: string;
}

type InputFormat = 'auto' | 'pem' | 'base64' | 'hex';

const TAG_NAMES: Record<number, string> = {
  0x01: 'tagBoolean',
  0x02: 'tagInteger',
  0x03: 'tagBitString',
  0x04: 'tagOctetString',
  0x05: 'tagNull',
  0x06: 'tagOid',
  0x0c: 'tagUtf8String',
  0x13: 'tagPrintableString',
  0x16: 'tagIA5String',
  0x17: 'tagUtcTime',
  0x18: 'tagGeneralizedTime',
  0x30: 'tagSequence',
  0x31: 'tagSet',
};

const OID_NAMES: Record<string, string> = {
  '2.5.4.3': 'commonName',
  '2.5.4.6': 'countryName',
  '2.5.4.7': 'localityName',
  '2.5.4.8': 'stateOrProvinceName',
  '2.5.4.10': 'organizationName',
  '2.5.4.11': 'organizationalUnitName',
  '1.2.840.113549.1.1.1': 'rsaEncryption',
  '1.2.840.113549.1.1.5': 'sha1WithRSAEncryption',
  '1.2.840.113549.1.1.11': 'sha256WithRSAEncryption',
  '1.2.840.10045.2.1': 'ecPublicKey',
  '2.5.29.14': 'subjectKeyIdentifier',
  '2.5.29.15': 'keyUsage',
  '2.5.29.17': 'subjectAltName',
  '2.5.29.19': 'basicConstraints',
  '2.5.29.35': 'authorityKeyIdentifier',
  '2.5.29.37': 'extKeyUsage',
};

function detectFormat(input: string): InputFormat {
  const trimmed = input.trim();
  if (trimmed.startsWith('-----BEGIN')) return 'pem';
  if (/^[0-9a-fA-F\s:]+$/.test(trimmed)) return 'hex';
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) return 'base64';
  return 'auto';
}

function parseInput(input: string, format: InputFormat): Uint8Array {
  const trimmed = input.trim();

  if (format === 'auto') {
    format = detectFormat(trimmed);
  }

  if (format === 'pem') {
    const pemRegex = /-----BEGIN[^-]+-----\r?\n?([\s\S]*?)\r?\n?-----END[^-]+-----/;
    const match = trimmed.match(pemRegex);
    const base64 = match ? match[1].replace(/\s/g, '') : '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  if (format === 'hex') {
    const hex = trimmed.replace(/[\s:]/g, '');
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  // base64
  const binary = atob(trimmed.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function parseOID(bytes: Uint8Array): string {
  const parts: number[] = [];
  parts.push(Math.floor(bytes[0] / 40));
  parts.push(bytes[0] % 40);

  let value = 0;
  for (let i = 1; i < bytes.length; i++) {
    value = (value << 7) | (bytes[i] & 0x7f);
    if (!(bytes[i] & 0x80)) {
      parts.push(value);
      value = 0;
    }
  }

  const oid = parts.join('.');
  const name = OID_NAMES[oid];
  return name ? `${oid} (${name})` : oid;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}

function parseAsn1(data: Uint8Array, offset: number = 0, t: Record<string, string>): Asn1Node {
  const tag = data[offset];
  const tagClass = (tag >> 6) & 0x03;
  const constructed = (tag & 0x20) !== 0;
  const tagNumber = tag & 0x1f;

  let length = data[offset + 1];
  let headerLength = 2;

  if (length & 0x80) {
    const numBytes = length & 0x7f;
    length = 0;
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | data[offset + 2 + i];
    }
    headerLength = 2 + numBytes;
  }

  const value = data.slice(offset + headerLength, offset + headerLength + length);

  let tagName: string;
  if (tagClass === 2) {
    tagName = `${t.tagContextSpecific} [${tagNumber}]`;
  } else {
    const nameKey = TAG_NAMES[tag];
    tagName = nameKey ? t[nameKey] : `${t.tagUnknown} (0x${tag.toString(16)})`;
  }

  const node: Asn1Node = {
    tag,
    tagClass,
    constructed,
    tagName,
    offset,
    headerLength,
    length,
    value,
  };

  // Parse children for constructed types
  if (constructed) {
    node.children = [];
    let childOffset = 0;
    while (childOffset < value.length) {
      const child = parseAsn1(value, childOffset, t);
      child.offset = offset + headerLength + childOffset;
      node.children.push(child);
      childOffset += child.headerLength + child.length;
    }
  } else {
    // Parse primitive values for display
    switch (tag) {
      case 0x01: // BOOLEAN
        node.displayValue = value[0] !== 0 ? 'TRUE' : 'FALSE';
        break;
      case 0x02: // INTEGER
        node.displayValue = bytesToHex(value);
        break;
      case 0x03: // BIT STRING
        node.displayValue = `(${value[0]} unused bits) ${bytesToHex(value.slice(1))}`;
        break;
      case 0x04: // OCTET STRING
        node.displayValue = bytesToHex(value);
        break;
      case 0x05: // NULL
        node.displayValue = '';
        break;
      case 0x06: // OID
        node.displayValue = parseOID(value);
        break;
      case 0x0c: // UTF8String
      case 0x13: // PrintableString
      case 0x16: // IA5String
        node.displayValue = new TextDecoder().decode(value);
        break;
      case 0x17: // UTCTime
      case 0x18: // GeneralizedTime
        node.displayValue = new TextDecoder().decode(value);
        break;
      default:
        if (value.length <= 32) {
          node.displayValue = bytesToHex(value);
        } else {
          node.displayValue = `${bytesToHex(value.slice(0, 16))} ... (${value.length} bytes)`;
        }
    }
  }

  return node;
}

function Asn1TreeNode({ node, depth = 0, expanded, onToggle }: {
  node: Asn1Node;
  depth?: number;
  expanded: Set<number>;
  onToggle: (offset: number) => void;
}) {
  const isExpanded = expanded.has(node.offset);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="font-mono text-sm">
      <div
        className={`flex items-start gap-2 py-1 px-2 hover:bg-hub-darker/50 rounded ${hasChildren ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.offset)}
      >
        {hasChildren ? (
          <span className="text-hub-muted w-4">{isExpanded ? '▼' : '▶'}</span>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-cyan-400">{node.tagName}</span>
        <span className="text-hub-muted">({node.length} bytes @ {node.offset})</span>
        {node.displayValue && (
          <span className="text-green-400 truncate max-w-md">{node.displayValue}</span>
        )}
      </div>
      {hasChildren && isExpanded && node.children!.map((child, i) => (
        <Asn1TreeNode
          key={`${child.offset}-${i}`}
          node={child}
          depth={depth + 1}
          expanded={expanded}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

const SAMPLE_DATA = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7o96BpON1Jvxn4S8gkXA9Mk7x
T9HTwiRX0Y2bGqGfZpXvKHVGqNPyuJlYWMPQGCyEzqoNBWfGMin9x+Rk8/HjAgMB
AAE=`;

export function Asn1Parser() {
  const { locale } = useI18n();
  const t = getAsn1ParserTranslations(locale) as Record<string, string>;

  const [input, setInput] = useState('');
  const [format, setFormat] = useState<InputFormat>('auto');
  const [parsedData, setParsedData] = useState<Asn1Node | null>(null);
  const [rawBytes, setRawBytes] = useState<Uint8Array | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [activeView, setActiveView] = useState<'tree' | 'hex'>('tree');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = () => {
    if (!input.trim()) return;

    setIsParsing(true);
    try {
      const bytes = parseInput(input, format);
      setRawBytes(bytes);
      const parsed = parseAsn1(bytes, 0, t);
      setParsedData(parsed);
      setExpanded(new Set([0]));
    } catch (error) {
      toast.error(t.errorParseFailed);
      console.error(error);
      setParsedData(null);
      setRawBytes(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_DATA);
    setParsedData(null);
    setRawBytes(null);
  };

  const toggleNode = (offset: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(offset)) {
      newExpanded.delete(offset);
    } else {
      newExpanded.add(offset);
    }
    setExpanded(newExpanded);
  };

  const expandAll = () => {
    if (!parsedData) return;
    const allOffsets = new Set<number>();
    const collectOffsets = (node: Asn1Node) => {
      allOffsets.add(node.offset);
      node.children?.forEach(collectOffsets);
    };
    collectOffsets(parsedData);
    setExpanded(allOffsets);
  };

  const collapseAll = () => {
    setExpanded(new Set([0]));
  };

  const formatHexDump = (bytes: Uint8Array): string => {
    const lines: string[] = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const hex = Array.from(chunk)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
      const ascii = Array.from(chunk)
        .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
        .join('');
      lines.push(`${i.toString(16).padStart(8, '0')}  ${hex.padEnd(48)}  |${ascii}|`);
    }
    return lines.join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">{t.securityNote}</p>
      </div>

      {/* Input Format */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.inputFormat}</label>
        <div className="flex flex-wrap gap-2">
          {([
            { value: 'auto', label: t.formatAuto },
            { value: 'pem', label: t.formatPem },
            { value: 'base64', label: t.formatBase64 },
            { value: 'hex', label: t.formatHex },
          ] as { value: InputFormat; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                format === opt.value
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
          rows={6}
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
      {parsedData && rawBytes && (
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('tree')}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  activeView === 'tree'
                    ? 'bg-hub-accent text-hub-darker border-hub-accent'
                    : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                }`}
              >
                {t.treeView}
              </button>
              <button
                onClick={() => setActiveView('hex')}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  activeView === 'hex'
                    ? 'bg-hub-accent text-hub-darker border-hub-accent'
                    : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                }`}
              >
                {t.hexView}
              </button>
            </div>
            {activeView === 'tree' && (
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.expandAll}
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.collapseAll}
                </button>
              </div>
            )}
          </div>

          {/* Tree View */}
          {activeView === 'tree' && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4 max-h-96 overflow-auto">
              <Asn1TreeNode
                node={parsedData}
                expanded={expanded}
                onToggle={toggleNode}
              />
            </div>
          )}

          {/* Hex View */}
          {activeView === 'hex' && (
            <div className="bg-hub-card border border-hub-border rounded-lg p-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleCopy(formatHexDump(rawBytes))}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <div className="overflow-x-auto">
                <pre className="font-mono text-xs text-green-400 whitespace-pre">
                  {formatHexDump(rawBytes)}
                </pre>
              </div>
            </div>
          )}
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
