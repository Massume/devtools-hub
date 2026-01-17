'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHashIdentifierTranslations } from '@/lib/i18n-hash-identifier';

type HashType = keyof typeof HASH_PATTERNS;

interface HashMatch {
  type: HashType;
  confidence: 'high' | 'medium' | 'low';
}

const HASH_PATTERNS: Record<string, { regex: RegExp; bits: number; priority: number }> = {
  // 8 characters (32 bits)
  crc32: { regex: /^[a-fA-F0-9]{8}$/, bits: 32, priority: 2 },
  adler32: { regex: /^[a-fA-F0-9]{8}$/, bits: 32, priority: 1 },

  // 32 characters (128 bits)
  md5: { regex: /^[a-fA-F0-9]{32}$/, bits: 128, priority: 3 },
  md4: { regex: /^[a-fA-F0-9]{32}$/, bits: 128, priority: 1 },
  md2: { regex: /^[a-fA-F0-9]{32}$/, bits: 128, priority: 1 },
  ntlm: { regex: /^[a-fA-F0-9]{32}$/, bits: 128, priority: 2 },

  // 40 characters (160 bits)
  sha1: { regex: /^[a-fA-F0-9]{40}$/, bits: 160, priority: 3 },
  ripemd160: { regex: /^[a-fA-F0-9]{40}$/, bits: 160, priority: 2 },
  tiger: { regex: /^[a-fA-F0-9]{40}$/, bits: 160, priority: 1 },

  // 41 characters (MySQL)
  mysql5: { regex: /^\*[a-fA-F0-9]{40}$/, bits: 160, priority: 3 },

  // 56 characters (224 bits)
  sha224: { regex: /^[a-fA-F0-9]{56}$/, bits: 224, priority: 2 },

  // 64 characters (256 bits)
  sha256: { regex: /^[a-fA-F0-9]{64}$/, bits: 256, priority: 3 },
  sha3_256: { regex: /^[a-fA-F0-9]{64}$/, bits: 256, priority: 2 },
  keccak256: { regex: /^[a-fA-F0-9]{64}$/, bits: 256, priority: 2 },
  blake2s: { regex: /^[a-fA-F0-9]{64}$/, bits: 256, priority: 2 },

  // 96 characters (384 bits)
  sha384: { regex: /^[a-fA-F0-9]{96}$/, bits: 384, priority: 3 },

  // 128 characters (512 bits)
  sha512: { regex: /^[a-fA-F0-9]{128}$/, bits: 512, priority: 3 },
  sha3_512: { regex: /^[a-fA-F0-9]{128}$/, bits: 512, priority: 2 },
  keccak512: { regex: /^[a-fA-F0-9]{128}$/, bits: 512, priority: 2 },
  blake2b: { regex: /^[a-fA-F0-9]{128}$/, bits: 512, priority: 2 },
  whirlpool: { regex: /^[a-fA-F0-9]{128}$/, bits: 512, priority: 1 },

  // bcrypt
  bcrypt: { regex: /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/, bits: 184, priority: 5 },

  // Argon2
  argon2: { regex: /^\$argon2(i|d|id)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/, bits: 256, priority: 5 },

  // scrypt
  scrypt: { regex: /^\$scrypt\$/, bits: 256, priority: 5 },

  // MySQL old
  mysql: { regex: /^[a-fA-F0-9]{16}$/, bits: 64, priority: 2 },
};

const EXAMPLE_HASHES: Record<string, string> = {
  md5: '5d41402abc4b2a76b9719d911017c592',
  sha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
  sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  sha512: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
  bcrypt: '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW',
  crc32: '3610a686',
};

function identifyHash(hash: string): HashMatch[] {
  const trimmed = hash.trim();
  const matches: HashMatch[] = [];

  for (const [type, pattern] of Object.entries(HASH_PATTERNS)) {
    if (pattern.regex.test(trimmed)) {
      let confidence: 'high' | 'medium' | 'low';
      if (pattern.priority >= 4) {
        confidence = 'high';
      } else if (pattern.priority >= 2) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }
      matches.push({ type: type as HashType, confidence });
    }
  }

  // Sort by priority
  matches.sort((a, b) => {
    const priorityA = HASH_PATTERNS[a.type].priority;
    const priorityB = HASH_PATTERNS[b.type].priority;
    return priorityB - priorityA;
  });

  return matches;
}

function getHashInfo(hash: string): { length: number; isHex: boolean; isBase64: boolean } {
  const trimmed = hash.trim();
  return {
    length: trimmed.length,
    isHex: /^[a-fA-F0-9]+$/.test(trimmed),
    isBase64: /^[A-Za-z0-9+/]+=*$/.test(trimmed),
  };
}

export function HashIdentifier() {
  const { locale } = useI18n();
  const t = getHashIdentifierTranslations(locale);

  const [input, setInput] = useState('');

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return identifyHash(input);
  }, [input]);

  const hashInfo = useMemo(() => {
    if (!input.trim()) return null;
    return getHashInfo(input);
  }, [input]);

  const confidenceColors = {
    high: 'text-green-500 bg-green-500/10 border-green-500/30',
    medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    low: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full h-24 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-white resize-none focus:outline-none focus:border-hub-accent"
        />
      </div>

      {/* Hash Info */}
      {hashInfo && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-hub-muted">{t.hashInfo.length}: </span>
              <span className="text-white font-mono">{hashInfo.length}</span>
            </div>
            <div>
              <span className="text-hub-muted">{t.hashInfo.characters}: </span>
              <span className="text-white font-mono">
                {hashInfo.isHex ? 'Hex (0-9, a-f)' : hashInfo.isBase64 ? 'Base64' : 'Mixed'}
              </span>
            </div>
            {hashInfo.isHex && (
              <div>
                <span className="text-hub-muted">≈ </span>
                <span className="text-white font-mono">{hashInfo.length * 4} {t.hashInfo.bits}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {input.trim() && (
        <div>
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.resultsTitle}</h3>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((match, index) => (
                <div
                  key={index}
                  className="bg-hub-card border border-hub-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-semibold">
                          {t.algorithms[match.type as keyof typeof t.algorithms] || match.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${confidenceColors[match.confidence]}`}>
                          {t.confidence[match.confidence]}
                        </span>
                        <span className="text-xs text-hub-muted">
                          {HASH_PATTERNS[match.type].bits} {t.hashInfo.bits}
                        </span>
                      </div>
                      <p className="text-sm text-hub-muted">
                        {t.descriptions[match.type as keyof typeof t.descriptions] || ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-hub-card border border-hub-border rounded-lg p-6 text-center">
              <p className="text-hub-muted">{t.noResults}</p>
            </div>
          )}
        </div>
      )}

      {/* Example Hashes */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.examples}</h3>
        <div className="space-y-2">
          {Object.entries(EXAMPLE_HASHES).map(([type, hash]) => (
            <div key={type} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex-1 min-w-0">
                <span className="text-hub-accent">{type.toUpperCase()}: </span>
                <span className="text-hub-muted font-mono text-xs truncate">{hash}</span>
              </div>
              <button
                onClick={() => setInput(hash)}
                className="px-3 py-1 text-xs bg-hub-darker border border-hub-border text-white rounded hover:border-hub-accent/50 transition-colors flex-shrink-0"
              >
                {t.tryExample}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setInput('')}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
      </div>

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
