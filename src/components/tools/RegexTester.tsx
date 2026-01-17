'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getRegexTesterTranslations } from '@/lib/i18n-regex-tester';
import toast from 'react-hot-toast';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

const COMMON_PATTERNS = [
  { key: 'email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { key: 'url', pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+' },
  { key: 'phone', pattern: '\\+?[1-9]\\d{1,14}' },
  { key: 'ip', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { key: 'date', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { key: 'hex', pattern: '#[0-9A-Fa-f]{6}\\b' },
];

const QUICK_REF = [
  { pattern: '.', desc: 'Any character' },
  { pattern: '\\d', desc: 'Digit [0-9]' },
  { pattern: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
  { pattern: '\\s', desc: 'Whitespace' },
  { pattern: '^', desc: 'Start of string' },
  { pattern: '$', desc: 'End of string' },
  { pattern: '*', desc: '0 or more' },
  { pattern: '+', desc: '1 or more' },
  { pattern: '?', desc: '0 or 1' },
  { pattern: '{n}', desc: 'Exactly n times' },
  { pattern: '{n,m}', desc: 'Between n and m' },
  { pattern: '()', desc: 'Capture group' },
  { pattern: '(?:)', desc: 'Non-capture group' },
  { pattern: '|', desc: 'OR' },
  { pattern: '[]', desc: 'Character class' },
  { pattern: '[^]', desc: 'Negated class' },
];

export function RegexTester() {
  const { locale } = useI18n();
  const t = getRegexTesterTranslations(locale);

  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [replacement, setReplacement] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags({ ...flags, [flag]: !flags[flag] });
  };

  const flagString = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');

  const { regex, error, matches } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [] };
    }

    try {
      const re = new RegExp(pattern, flagString);
      const foundMatches: RegexMatch[] = [];

      if (flags.g) {
        let match;
        while ((match = re.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });
          if (!flags.g) break;
        }
      } else {
        const match = re.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });
        }
      }

      return { regex: re, error: null, matches: foundMatches };
    } catch (e) {
      return { regex: null, error: (e as Error).message, matches: [] };
    }
  }, [pattern, testString, flagString, flags.g]);

  const highlightedText = useMemo(() => {
    if (!regex || !testString || matches.length === 0) {
      return testString;
    }

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
      }
      parts.push({ text: match.match, isMatch: true });
      lastIndex = match.index + match.match.length;
    });

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }

    return parts;
  }, [regex, testString, matches]);

  const replaceResult = useMemo(() => {
    if (!regex || !testString) return '';
    try {
      return testString.replace(regex, replacement);
    } catch {
      return '';
    }
  }, [regex, testString, replacement]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const applyPattern = (pat: string) => {
    setPattern(pat);
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.patternLabel}</label>
        <div className="flex items-center gap-2">
          <span className="text-hub-muted font-mono">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t.patternPlaceholder}
            className={`flex-1 bg-hub-darker border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none ${
              error ? 'border-red-500' : 'border-hub-border focus:border-hub-accent'
            }`}
          />
          <span className="text-hub-muted font-mono">/{flagString}</span>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{t.errorInvalidRegex}: {error}</p>}
      </div>

      {/* Flags */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.flagsLabel}</label>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'g', label: t.flagG },
            { key: 'i', label: t.flagI },
            { key: 'm', label: t.flagM },
            { key: 's', label: t.flagS },
            { key: 'u', label: t.flagU },
          ].map(flag => (
            <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[flag.key as keyof typeof flags]}
                onChange={() => toggleFlag(flag.key as keyof typeof flags)}
                className="rounded border-hub-border bg-hub-darker accent-hub-accent"
              />
              <span className="text-sm text-hub-muted">{flag.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Common Patterns */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.commonPatterns}</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_PATTERNS.map(p => (
            <button
              key={p.key}
              onClick={() => applyPattern(p.pattern)}
              className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
            >
              {t[`pattern${p.key.charAt(0).toUpperCase() + p.key.slice(1)}` as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.testStringLabel}</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t.testStringPlaceholder}
          rows={5}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      </div>

      {/* Highlighted Text */}
      {testString && pattern && !error && (
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
          <div className="font-mono text-sm whitespace-pre-wrap">
            {Array.isArray(highlightedText) ? (
              highlightedText.map((part, i) => (
                <span
                  key={i}
                  className={part.isMatch ? 'bg-yellow-500/30 text-yellow-200 rounded px-0.5' : 'text-white'}
                >
                  {part.text}
                </span>
              ))
            ) : (
              <span className="text-white">{highlightedText}</span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">{t.resultsLabel}</h3>
          <span className="text-sm text-hub-accent">
            {matches.length} {t.matchesFound}
          </span>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-auto">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-hub-darker rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-hub-muted">{t.matchIndex} {idx + 1}</span>
                  <span className="text-hub-muted text-xs">{t.position}: {match.index}</span>
                </div>
                <div className="mb-2">
                  <span className="text-hub-muted text-xs">{t.fullMatch}: </span>
                  <code className="text-green-400 font-mono">{match.match}</code>
                </div>
                {match.groups.length > 0 && (
                  <div>
                    <span className="text-hub-muted text-xs">{t.groups}: </span>
                    {match.groups.map((g, i) => (
                      <code key={i} className="text-cyan-400 font-mono mr-2">[{i + 1}]: {g || '(empty)'}</code>
                    ))}
                  </div>
                )}
                {match.namedGroups && Object.keys(match.namedGroups).length > 0 && (
                  <div>
                    <span className="text-hub-muted text-xs">{t.namedGroups}: </span>
                    {Object.entries(match.namedGroups).map(([name, val]) => (
                      <code key={name} className="text-purple-400 font-mono mr-2">{name}: {val}</code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-hub-muted">{pattern ? t.noMatches : ''}</p>
        )}
      </div>

      {/* Replace */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.replaceLabel}</label>
        <input
          type="text"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder={t.replacePlaceholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      </div>

      {replacement && replaceResult && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.replaceResult}</label>
            <button
              onClick={() => handleCopy(replaceResult)}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
            {replaceResult}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">{t.quickReference}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_REF.map((ref, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <code className="text-hub-accent font-mono bg-hub-darker px-1 rounded">{ref.pattern}</code>
              <span className="text-hub-muted">{ref.desc}</span>
            </div>
          ))}
        </div>
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
