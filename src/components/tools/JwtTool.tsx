'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJwtToolTranslations } from '@/lib/i18n-jwt-tool';
import toast from 'react-hot-toast';
import * as jose from 'jose';

type Tab = 'decode' | 'encode';
type Algorithm = 'HS256' | 'HS384' | 'HS512';

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { header, payload, signature };
  } catch {
    return null;
  }
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

function getTokenStatus(payload: Record<string, unknown>): 'valid' | 'expired' | 'notYetValid' | 'malformed' {
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && typeof payload.exp === 'number' && payload.exp < now) {
    return 'expired';
  }

  if (payload.nbf && typeof payload.nbf === 'number' && payload.nbf > now) {
    return 'notYetValid';
  }

  return 'valid';
}

export function JwtTool() {
  const { locale } = useI18n();
  const t = getJwtToolTranslations(locale);

  const [activeTab, setActiveTab] = useState<Tab>('decode');

  // Decode state
  const [token, setToken] = useState('');

  // Encode state
  const [payloadInput, setPayloadInput] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": ' + Math.floor(Date.now() / 1000) + '\n}');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [encodedToken, setEncodedToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJwt(token.trim());
  }, [token]);

  const tokenStatus = useMemo(() => {
    if (!decoded) return 'malformed';
    return getTokenStatus(decoded.payload);
  }, [decoded]);

  const handleEncode = async () => {
    try {
      const payload = JSON.parse(payloadInput);
      const secretKey = new TextEncoder().encode(secret);

      const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: algorithm, typ: 'JWT' })
        .sign(secretKey);

      setEncodedToken(jwt);
    } catch (error) {
      toast.error('Invalid JSON payload');
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const statusColors = {
    valid: 'text-green-500 bg-green-500/10 border-green-500/30',
    expired: 'text-red-500 bg-red-500/10 border-red-500/30',
    notYetValid: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    malformed: 'text-red-500 bg-red-500/10 border-red-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-hub-border">
        {(['decode', 'encode'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-hub-accent border-b-2 border-hub-accent'
                : 'text-hub-muted hover:text-white'
            }`}
          >
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'decode' && (
        <>
          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-500">⚠️ {t.warningDecode}</p>
          </div>

          {/* Token Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.tokenLabel}</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t.tokenPlaceholder}
              className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Decoded Results */}
          {decoded && (
            <div className="space-y-4">
              {/* Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${statusColors[tokenStatus]}`}>
                {tokenStatus === 'valid' && '✓'}
                {tokenStatus === 'expired' && '✗'}
                {tokenStatus === 'notYetValid' && '⏳'}
                {t.tokenStatus[tokenStatus]}
              </div>

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-hub-muted">{t.headerLabel}</label>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2))}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-red-400 overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-hub-muted">{t.payloadLabel}</label>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2))}
                    className="text-xs text-hub-accent hover:underline"
                  >
                    {t.copyButton}
                  </button>
                </div>
                <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-purple-400 overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>

              {/* Token Claims Info */}
              <div className="bg-hub-card border border-hub-border rounded-lg p-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {decoded.header.alg ? (
                    <div>
                      <span className="text-hub-muted">{t.algorithm}: </span>
                      <span className="text-white font-mono">{String(decoded.header.alg)}</span>
                    </div>
                  ) : null}
                  {decoded.payload.iat && typeof decoded.payload.iat === 'number' ? (
                    <div>
                      <span className="text-hub-muted">{t.issuedAt}: </span>
                      <span className="text-white">{formatTimestamp(decoded.payload.iat)}</span>
                    </div>
                  ) : null}
                  {decoded.payload.exp && typeof decoded.payload.exp === 'number' ? (
                    <div>
                      <span className="text-hub-muted">{t.expiresAt}: </span>
                      <span className={`${tokenStatus === 'expired' ? 'text-red-500' : 'text-white'}`}>
                        {formatTimestamp(decoded.payload.exp)}
                      </span>
                    </div>
                  ) : null}
                  {decoded.payload.nbf && typeof decoded.payload.nbf === 'number' ? (
                    <div>
                      <span className="text-hub-muted">{t.notBefore}: </span>
                      <span className="text-white">{formatTimestamp(decoded.payload.nbf)}</span>
                    </div>
                  ) : null}
                  {decoded.payload.iss ? (
                    <div>
                      <span className="text-hub-muted">{t.issuer}: </span>
                      <span className="text-white">{String(decoded.payload.iss)}</span>
                    </div>
                  ) : null}
                  {decoded.payload.sub ? (
                    <div>
                      <span className="text-hub-muted">{t.subject}: </span>
                      <span className="text-white">{String(decoded.payload.sub)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Signature */}
              <div>
                <label className="text-sm font-medium text-hub-muted block mb-2">{t.signatureLabel}</label>
                <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-cyan-400 break-all">
                  {decoded.signature}
                </div>
              </div>
            </div>
          )}

          {token && !decoded && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${statusColors.malformed}`}>
              ✗ {t.tokenStatus.malformed}
            </div>
          )}
        </>
      )}

      {activeTab === 'encode' && (
        <>
          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-500">⚠️ {t.warningEncode}</p>
          </div>

          {/* Algorithm Selection */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <label className="block text-sm text-hub-muted mb-2">{t.algorithmLabel}</label>
            <div className="flex gap-2">
              {(['HS256', 'HS384', 'HS512'] as Algorithm[]).map((alg) => (
                <button
                  key={alg}
                  onClick={() => setAlgorithm(alg)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    algorithm === alg
                      ? 'bg-hub-accent text-hub-darker border-hub-accent'
                      : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
                  }`}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.secretLabel}</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={t.secretPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Payload Input */}
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.payloadInputLabel}</label>
            <textarea
              value={payloadInput}
              onChange={(e) => setPayloadInput(e.target.value)}
              placeholder={t.payloadInputPlaceholder}
              className="w-full h-48 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Encode Button */}
          <button
            onClick={handleEncode}
            disabled={!secret || !payloadInput}
            className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.encodeButton}
          </button>

          {/* Encoded Token */}
          {encodedToken && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-hub-muted">{t.encodedTokenLabel}</label>
                <button
                  onClick={() => handleCopy(encodedToken)}
                  className="text-xs text-hub-accent hover:underline"
                >
                  {t.copyButton}
                </button>
              </div>
              <textarea
                value={encodedToken}
                readOnly
                className="w-full h-32 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 resize-none focus:outline-none"
              />
            </div>
          )}
        </>
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
