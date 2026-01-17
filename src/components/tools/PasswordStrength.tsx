'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getPasswordStrengthTranslations } from '@/lib/i18n-password-strength';
import zxcvbn from 'zxcvbn';

const strengthColors = [
  'bg-red-500',      // 0 - Very Weak
  'bg-orange-500',   // 1 - Weak
  'bg-yellow-500',   // 2 - Fair
  'bg-lime-500',     // 3 - Strong
  'bg-green-500',    // 4 - Very Strong
];

const strengthBgColors = [
  'bg-red-500/10 border-red-500/30',
  'bg-orange-500/10 border-orange-500/30',
  'bg-yellow-500/10 border-yellow-500/30',
  'bg-lime-500/10 border-lime-500/30',
  'bg-green-500/10 border-green-500/30',
];

const strengthTextColors = [
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
];

function analyzeCharacters(password: string) {
  return {
    length: password.length,
    lowercase: (password.match(/[a-z]/g) || []).length,
    uppercase: (password.match(/[A-Z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^a-zA-Z0-9]/g) || []).length,
  };
}

export function PasswordStrength() {
  const { locale } = useI18n();
  const t = getPasswordStrengthTranslations(locale);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const result = useMemo(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  const charAnalysis = useMemo(() => {
    return analyzeCharacters(password);
  }, [password]);

  return (
    <div className="space-y-6">
      {/* Privacy Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔒 {t.privacyNote}</p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.inputLabel}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent pr-20"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-hub-muted hover:text-white transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* Strength Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-hub-muted">{t.strengthLabel}</span>
              <span className={`text-sm font-medium ${strengthTextColors[result.score]}`}>
                {t.strength[result.score as keyof typeof t.strength]}
              </span>
            </div>
            <div className="h-3 bg-hub-darker rounded-full overflow-hidden flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    i <= result.score ? strengthColors[result.score] : 'bg-hub-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Score Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${strengthBgColors[result.score]}`}>
            <span className="text-hub-muted">{t.scoreLabel}:</span>
            <span className={`font-bold text-lg ${strengthTextColors[result.score]}`}>
              {result.score}/4
            </span>
          </div>

          {/* Crack Time */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-hub-muted mb-3">{t.crackTimeLabel}</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-hub-muted">{t.crackTimes.offlineFast}:</span>
                <span className="text-white font-mono">{result.crack_times_display.offline_fast_hashing_1e10_per_second}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hub-muted">{t.crackTimes.offlineSlow}:</span>
                <span className="text-white font-mono">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hub-muted">{t.crackTimes.onlineThrottle}:</span>
                <span className="text-white font-mono">{result.crack_times_display.online_throttling_100_per_hour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hub-muted">{t.crackTimes.onlineUnthrottle}:</span>
                <span className="text-white font-mono">{result.crack_times_display.online_no_throttling_10_per_second}</span>
              </div>
            </div>
          </div>

          {/* Character Analysis */}
          <div className="bg-hub-card border border-hub-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-hub-muted mb-3">{t.characterAnalysis}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{charAnalysis.length}</div>
                <div className="text-xs text-hub-muted">{t.length}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{charAnalysis.lowercase}</div>
                <div className="text-xs text-hub-muted">{t.lowercase}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{charAnalysis.uppercase}</div>
                <div className="text-xs text-hub-muted">{t.uppercase}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{charAnalysis.numbers}</div>
                <div className="text-xs text-hub-muted">{t.numbers}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{charAnalysis.symbols}</div>
                <div className="text-xs text-hub-muted">{t.symbols}</div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.feedback.warning || result.feedback.suggestions.length > 0 ? (
            <div className="space-y-4">
              {result.feedback.warning && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-500 mb-2">{t.warningsTitle}</h3>
                  <p className="text-sm text-yellow-400">{result.feedback.warning}</p>
                </div>
              )}

              {result.feedback.suggestions.length > 0 && (
                <div className="bg-hub-card border border-hub-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-hub-muted mb-2">{t.suggestionsTitle}</h3>
                  <ul className="space-y-1">
                    {result.feedback.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm text-hub-muted flex items-start gap-2">
                        <span className="text-hub-accent">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-green-500">✓ {t.noWarnings}</p>
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
