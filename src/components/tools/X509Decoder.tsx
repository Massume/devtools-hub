'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getX509DecoderTranslations } from '@/lib/i18n-x509-decoder';
import toast from 'react-hot-toast';

interface CertInfo {
  version: number;
  serialNumber: string;
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: Date;
  validTo: Date;
  publicKeyAlgorithm: string;
  publicKeySize?: number;
  signatureAlgorithm: string;
  fingerprints: {
    sha256: string;
    sha1: string;
  };
  extensions: {
    basicConstraints?: { isCA: boolean; pathLength?: number };
    keyUsage?: string[];
    extKeyUsage?: string[];
    subjectAltNames?: string[];
  };
}

// OID mappings
const OID_MAP: Record<string, string> = {
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.5': 'serialNumber',
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.113549.1.1.5': 'SHA1withRSA',
  '1.2.840.113549.1.1.11': 'SHA256withRSA',
  '1.2.840.113549.1.1.12': 'SHA384withRSA',
  '1.2.840.113549.1.1.13': 'SHA512withRSA',
  '1.2.840.10045.2.1': 'EC',
  '1.2.840.10045.4.3.2': 'SHA256withECDSA',
  '1.2.840.10045.4.3.3': 'SHA384withECDSA',
  '1.2.840.10045.4.3.4': 'SHA512withECDSA',
};

const KEY_USAGE_BITS = [
  'digitalSignature',
  'nonRepudiation',
  'keyEncipherment',
  'dataEncipherment',
  'keyAgreement',
  'keyCertSign',
  'cRLSign',
  'encipherOnly',
  'decipherOnly',
];

function parsePemToDer(pem: string): Uint8Array {
  const pemRegex = /-----BEGIN[^-]+-----\r?\n?([\s\S]*?)\r?\n?-----END[^-]+-----/;
  const match = pem.match(pemRegex);
  const base64 = match ? match[1].replace(/\s/g, '') : pem.replace(/\s/g, '');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(':');
}

async function calculateFingerprint(data: Uint8Array, algorithm: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data.buffer as ArrayBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}

// Simple ASN.1 DER parser
function parseAsn1(data: Uint8Array, offset: number = 0): { tag: number; length: number; value: Uint8Array; totalLength: number } {
  const tag = data[offset];
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
  return { tag, length, value, totalLength: headerLength + length };
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

  return parts.join('.');
}

function parseString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseInteger(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function parseTime(bytes: Uint8Array, tag: number): Date {
  const str = parseString(bytes);
  if (tag === 0x17) { // UTCTime
    const year = parseInt(str.slice(0, 2));
    const fullYear = year >= 50 ? 1900 + year : 2000 + year;
    return new Date(
      fullYear,
      parseInt(str.slice(2, 4)) - 1,
      parseInt(str.slice(4, 6)),
      parseInt(str.slice(6, 8)),
      parseInt(str.slice(8, 10)),
      parseInt(str.slice(10, 12))
    );
  } else { // GeneralizedTime
    return new Date(
      parseInt(str.slice(0, 4)),
      parseInt(str.slice(4, 6)) - 1,
      parseInt(str.slice(6, 8)),
      parseInt(str.slice(8, 10)),
      parseInt(str.slice(10, 12)),
      parseInt(str.slice(12, 14))
    );
  }
}

function parseName(data: Uint8Array): Record<string, string> {
  const result: Record<string, string> = {};
  let offset = 0;

  while (offset < data.length) {
    const set = parseAsn1(data, offset);
    if (set.tag !== 0x31) break;

    const seq = parseAsn1(set.value, 0);
    if (seq.tag === 0x30) {
      const oid = parseAsn1(seq.value, 0);
      const val = parseAsn1(seq.value, oid.totalLength);

      const oidStr = parseOID(oid.value);
      const key = OID_MAP[oidStr] || oidStr;
      result[key] = parseString(val.value);
    }

    offset += set.totalLength;
  }

  return result;
}

async function parseCertificate(der: Uint8Array): Promise<CertInfo> {
  const cert = parseAsn1(der, 0);
  const tbsCert = parseAsn1(cert.value, 0);

  let offset = 0;
  const tbsData = tbsCert.value;

  // Version (optional, context-specific tag 0)
  let version = 1;
  const first = parseAsn1(tbsData, offset);
  if (first.tag === 0xa0) {
    const versionInt = parseAsn1(first.value, 0);
    version = versionInt.value[0] + 1;
    offset += first.totalLength;
  }

  // Serial Number
  const serialNum = parseAsn1(tbsData, offset);
  const serialNumber = parseInteger(serialNum.value);
  offset += serialNum.totalLength;

  // Signature Algorithm (in TBS)
  const sigAlgInTbs = parseAsn1(tbsData, offset);
  offset += sigAlgInTbs.totalLength;

  // Issuer
  const issuerSeq = parseAsn1(tbsData, offset);
  const issuer = parseName(issuerSeq.value);
  offset += issuerSeq.totalLength;

  // Validity
  const validity = parseAsn1(tbsData, offset);
  const notBefore = parseAsn1(validity.value, 0);
  const notAfter = parseAsn1(validity.value, notBefore.totalLength);
  const validFrom = parseTime(notBefore.value, notBefore.tag);
  const validTo = parseTime(notAfter.value, notAfter.tag);
  offset += validity.totalLength;

  // Subject
  const subjectSeq = parseAsn1(tbsData, offset);
  const subject = parseName(subjectSeq.value);
  offset += subjectSeq.totalLength;

  // Subject Public Key Info
  const spki = parseAsn1(tbsData, offset);
  const algId = parseAsn1(spki.value, 0);
  const algOid = parseAsn1(algId.value, 0);
  const publicKeyAlgorithm = OID_MAP[parseOID(algOid.value)] || parseOID(algOid.value);

  const pubKey = parseAsn1(spki.value, algId.totalLength);
  let publicKeySize: number | undefined;

  if (publicKeyAlgorithm === 'RSA' && pubKey.value.length > 0) {
    // RSA key: bit string containing SEQUENCE of modulus and exponent
    const keyData = pubKey.value.slice(1); // Skip unused bits byte
    const keySeq = parseAsn1(keyData, 0);
    const modulus = parseAsn1(keySeq.value, 0);
    publicKeySize = (modulus.value.length - (modulus.value[0] === 0 ? 1 : 0)) * 8;
  }

  // Signature Algorithm (at end of certificate)
  const sigAlgSeq = parseAsn1(cert.value, tbsCert.totalLength);
  const sigAlgOid = parseAsn1(sigAlgSeq.value, 0);
  const signatureAlgorithm = OID_MAP[parseOID(sigAlgOid.value)] || parseOID(sigAlgOid.value);

  // Calculate fingerprints
  const [sha256, sha1] = await Promise.all([
    calculateFingerprint(der, 'SHA-256'),
    calculateFingerprint(der, 'SHA-1'),
  ]);

  return {
    version,
    serialNumber,
    subject,
    issuer,
    validFrom,
    validTo,
    publicKeyAlgorithm,
    publicKeySize,
    signatureAlgorithm,
    fingerprints: { sha256, sha1 },
    extensions: {},
  };
}

const SAMPLE_CERT = `-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAKHBfpegPjMCMA0GCSqGSIb3DQEBCwUAMBExDzANBgNVBAMMBnNh
bXBsZTAeFw0yNDAxMDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMBExDzANBgNVBAMM
BnNhbXBsZTBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQC7o96BpON1Jvxn4S8gkXA9
Mk7xT9HTwiRX0Y2bGqGfZpXvKHVGqNPyuJlYWMPQGCyEzqoNBWfGMin9x+Rk8/Hj
AgMBAAGjUDBOMB0GA1UdDgQWBBSBGXJXqZPYdnrLwqO0YKj4g1C1ljAfBgNVHSME
GDAWgBSBGXJXqZPYdnrLwqO0YKj4g1C1ljAMBgNVHRMEBTADAQH/MA0GCSqGSIb3
DQEBCwUAA0EAJ6MF0+Y1SIvL4RT+kKbYVFVL8qA8K2ueP9F4W5CpMD8wFQl1VgKA
4FXTqJCBh6xFwuv/AEMSbhvKNDWs0k2hRA==
-----END CERTIFICATE-----`;

export function X509Decoder() {
  const { locale } = useI18n();
  const t = getX509DecoderTranslations(locale) as Record<string, string>;

  const [input, setInput] = useState('');
  const [certInfo, setCertInfo] = useState<CertInfo | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  const handleDecode = async () => {
    if (!input.trim()) return;

    setIsDecoding(true);
    try {
      const der = parsePemToDer(input);
      const info = await parseCertificate(der);
      setCertInfo(info);
    } catch (error) {
      toast.error(t.errorDecodeFailed);
      console.error(error);
      setCertInfo(null);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_CERT);
    setCertInfo(null);
  };

  const formatName = (name: Record<string, string>): string => {
    return Object.entries(name)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
  };

  const getValidityStatus = (from: Date, to: Date): { status: string; class: string; days?: number } => {
    const now = new Date();
    if (now < from) {
      return { status: t.notYetValid, class: 'text-yellow-500' };
    }
    if (now > to) {
      return { status: t.expired, class: 'text-red-500' };
    }
    const days = Math.ceil((to.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { status: t.valid, class: 'text-green-500', days };
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
          rows={8}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Decode Button */}
      <button
        onClick={handleDecode}
        disabled={!input.trim() || isDecoding}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDecoding ? t.decoding : t.decodeButton}
      </button>

      {/* Results */}
      {certInfo && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">{t.certInfo}</h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-hub-muted">{t.version}: </span>
                <span className="text-white font-mono">v{certInfo.version}</span>
              </div>

              <div>
                <span className="text-hub-muted">{t.serialNumber}: </span>
                <span className="text-white font-mono text-xs">{certInfo.serialNumber}</span>
              </div>

              <div>
                <span className="text-hub-muted">{t.subject}: </span>
                <span className="text-white font-mono">{formatName(certInfo.subject)}</span>
              </div>

              <div>
                <span className="text-hub-muted">{t.issuer}: </span>
                <span className="text-white font-mono">{formatName(certInfo.issuer)}</span>
              </div>
            </div>
          </div>

          {/* Validity */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-hub-muted">{t.validFrom}: </span>
                <span className="text-white font-mono">{certInfo.validFrom.toISOString()}</span>
              </div>
              <div>
                <span className="text-hub-muted">{t.validTo}: </span>
                <span className="text-white font-mono">{certInfo.validTo.toISOString()}</span>
              </div>
            </div>
            {(() => {
              const validity = getValidityStatus(certInfo.validFrom, certInfo.validTo);
              return (
                <div className={`mt-3 font-medium ${validity.class}`}>
                  {validity.status}
                  {validity.days !== undefined && ` (${validity.days} ${t.daysRemaining})`}
                </div>
              );
            })()}
          </div>

          {/* Public Key */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-hub-muted mb-3">{t.publicKey}</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-hub-muted">{t.algorithm}: </span>
                <span className="text-white font-mono">{certInfo.publicKeyAlgorithm}</span>
              </div>
              {certInfo.publicKeySize && (
                <div>
                  <span className="text-hub-muted">{t.keySize}: </span>
                  <span className="text-white font-mono">{certInfo.publicKeySize} {t.bits}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-hub-muted mb-3">{t.signature}</h4>
            <div>
              <span className="text-hub-muted">{t.signatureAlgorithm}: </span>
              <span className="text-white font-mono">{certInfo.signatureAlgorithm}</span>
            </div>
          </div>

          {/* Fingerprints */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-hub-muted mb-3">{t.fingerprints}</h4>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-hub-muted text-sm">{t.sha256}:</span>
                  <button
                    onClick={() => handleCopy(certInfo.fingerprints.sha256)}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <code className="text-xs font-mono text-green-400 break-all">{certInfo.fingerprints.sha256}</code>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-hub-muted text-sm">{t.sha1}:</span>
                  <button
                    onClick={() => handleCopy(certInfo.fingerprints.sha1)}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <code className="text-xs font-mono text-yellow-400 break-all">{certInfo.fingerprints.sha1}</code>
              </div>
            </div>
          </div>
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
