'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRegexGeneratorTranslations } from '@/lib/i18n-regex-generator';
import toast from 'react-hot-toast';

type PatternType = 'email' | 'url' | 'phone' | 'date' | 'ipv4' | 'creditCard' | 'password' | 'username' | 'hex' | 'slug';

interface PasswordOptions {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
}

interface Flags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
}

const PATTERNS: Record<PatternType, { regex: string; explanation: string }> = {
  email: {
    regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    explanation: 'Matches standard email addresses with alphanumeric local part, @ symbol, domain, and TLD',
  },
  url: {
    regex: '^https?:\\/\\/[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(\\/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=]*)?$',
    explanation: 'Matches HTTP/HTTPS URLs with domain and optional path',
  },
  phone: {
    regex: '^\\+?[1-9]\\d{1,14}$',
    explanation: 'Matches international phone numbers (E.164 format)',
  },
  date: {
    regex: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    explanation: 'Matches dates in YYYY-MM-DD format',
  },
  ipv4: {
    regex: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    explanation: 'Matches IPv4 addresses (0.0.0.0 to 255.255.255.255)',
  },
  creditCard: {
    regex: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
    explanation: 'Matches Visa, MasterCard, Amex, and Discover card numbers',
  },
  password: {
    regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    explanation: 'Matches passwords with at least 8 chars, uppercase, lowercase, number, and special char',
  },
  username: {
    regex: '^[a-zA-Z][a-zA-Z0-9_]{2,15}$',
    explanation: 'Matches usernames starting with letter, 3-16 chars, letters/numbers/underscore',
  },
  hex: {
    regex: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
    explanation: 'Matches HEX color codes with optional # prefix',
  },
  slug: {
    regex: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    explanation: 'Matches URL-friendly slugs (lowercase, numbers, hyphens)',
  },
};

export function RegexGenerator() {
  const { locale } = useI18n();
  const t = getRegexGeneratorTranslations(locale);

  const [patternType, setPatternType] = useState<PatternType>('email');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<Flags>({ global: true, caseInsensitive: false, multiline: false });
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    minLength: 8,
    maxLength: 32,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
  });

  const currentPattern = useMemo(() => {
    if (patternType === 'password') {
      const parts: string[] = [];
      if (passwordOptions.requireLowercase) parts.push('(?=.*[a-z])');
      if (passwordOptions.requireUppercase) parts.push('(?=.*[A-Z])');
      if (passwordOptions.requireNumbers) parts.push('(?=.*\\d)');
      if (passwordOptions.requireSpecial) parts.push('(?=.*[@$!%*?&])');

      let charClass = '';
      if (passwordOptions.requireLowercase || passwordOptions.requireUppercase) charClass += 'A-Za-z';
      if (passwordOptions.requireNumbers) charClass += '\\d';
      if (passwordOptions.requireSpecial) charClass += '@$!%*?&';

      return `^${parts.join('')}[${charClass}]{${passwordOptions.minLength},${passwordOptions.maxLength}}$`;
    }
    return PATTERNS[patternType].regex;
  }, [patternType, passwordOptions]);

  const flagsString = useMemo(() => {
    let f = '';
    if (flags.global) f += 'g';
    if (flags.caseInsensitive) f += 'i';
    if (flags.multiline) f += 'm';
    return f;
  }, [flags]);

  const matches = useMemo(() => {
    if (!testString) return [];
    try {
      const regex = new RegExp(currentPattern, flagsString);
      const results: { match: string; index: number }[] = [];
      let match;
      while ((match = regex.exec(testString)) !== null) {
        results.push({ match: match[0], index: match.index });
        if (!flags.global) break;
      }
      return results;
    } catch {
      return [];
    }
  }, [testString, currentPattern, flagsString, flags.global]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`/${currentPattern}/${flagsString}`);
    toast.success(t.copied);
  };

  const patternLabels: Record<PatternType, string> = {
    email: t.typeEmail,
    url: t.typeUrl,
    phone: t.typePhone,
    date: t.typeDate,
    ipv4: t.typeIpv4,
    creditCard: t.typeCreditCard,
    password: t.typePassword,
    username: t.typeUsername,
    hex: t.typeHex,
    slug: t.typeSlug,
  };

  return (
    <div className="space-y-6">
      {/* Pattern Type */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.patternType}</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PATTERNS) as PatternType[]).map(type => (
            <button
              key={type}
              onClick={() => setPatternType(type)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                patternType === type
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {patternLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Password Options */}
      {patternType === 'password' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.passwordOptions}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.passwordMinLength}</label>
              <input
                type="number"
                min="1"
                max="100"
                value={passwordOptions.minLength}
                onChange={(e) => setPasswordOptions({ ...passwordOptions, minLength: parseInt(e.target.value) || 1 })}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-hub-muted mb-1">{t.passwordMaxLength}</label>
              <input
                type="number"
                min="1"
                max="100"
                value={passwordOptions.maxLength}
                onChange={(e) => setPasswordOptions({ ...passwordOptions, maxLength: parseInt(e.target.value) || 100 })}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={passwordOptions.requireUppercase} onChange={(e) => setPasswordOptions({ ...passwordOptions, requireUppercase: e.target.checked })} className="rounded accent-hub-accent" />
              <span className="text-sm text-hub-muted">{t.passwordUppercase}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={passwordOptions.requireLowercase} onChange={(e) => setPasswordOptions({ ...passwordOptions, requireLowercase: e.target.checked })} className="rounded accent-hub-accent" />
              <span className="text-sm text-hub-muted">{t.passwordLowercase}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={passwordOptions.requireNumbers} onChange={(e) => setPasswordOptions({ ...passwordOptions, requireNumbers: e.target.checked })} className="rounded accent-hub-accent" />
              <span className="text-sm text-hub-muted">{t.passwordNumbers}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={passwordOptions.requireSpecial} onChange={(e) => setPasswordOptions({ ...passwordOptions, requireSpecial: e.target.checked })} className="rounded accent-hub-accent" />
              <span className="text-sm text-hub-muted">{t.passwordSpecial}</span>
            </label>
          </div>
        </div>
      )}

      {/* Flags */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.flags}</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={flags.global} onChange={(e) => setFlags({ ...flags, global: e.target.checked })} className="rounded accent-hub-accent" />
            <span className="text-sm text-hub-muted">{t.flagGlobal}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={flags.caseInsensitive} onChange={(e) => setFlags({ ...flags, caseInsensitive: e.target.checked })} className="rounded accent-hub-accent" />
            <span className="text-sm text-hub-muted">{t.flagCaseInsensitive}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={flags.multiline} onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })} className="rounded accent-hub-accent" />
            <span className="text-sm text-hub-muted">{t.flagMultiline}</span>
          </label>
        </div>
      </div>

      {/* Generated Regex */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.generatedRegex}</label>
          <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
            {t.copyButton}
          </button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
          <code className="text-sm text-green-400 font-mono break-all">
            /{currentPattern}/{flagsString}
          </code>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-2">{t.explanation}</h3>
        <p className="text-sm text-hub-muted">{PATTERNS[patternType].explanation}</p>
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.testString}</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t.testPlaceholder}
          rows={4}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Matches */}
      {testString && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.matches}</h3>
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((m, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="text-hub-muted">#{i + 1}</span>
                  <span className="text-green-400 font-mono">"{m.match}"</span>
                  <span className="text-hub-muted">at index {m.index}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-hub-muted">{t.noMatches}</p>
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
