'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getHibpCheckerTranslations } from '@/lib/i18n-hibp-checker';
import toast from 'react-hot-toast';

async function sha1Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function HibpChecker() {
  const { locale } = useI18n();
  const t = getHibpCheckerTranslations(locale);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ safe: boolean; count: number } | null>(null);

  const handleCheck = async () => {
    if (!password) return;

    setIsChecking(true);
    setResult(null);

    try {
      // Hash the password
      const hash = await sha1Hash(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      // Query HIBP API with k-anonymity
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {
          'Add-Padding': 'true', // Adds padding to prevent timing attacks
        },
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const text = await response.text();
      const lines = text.split('\n');

      // Check if our suffix is in the response
      let count = 0;
      for (const line of lines) {
        const [hashSuffix, countStr] = line.split(':');
        if (hashSuffix.trim() === suffix) {
          count = parseInt(countStr.trim(), 10);
          break;
        }
      }

      setResult({ safe: count === 0, count });
    } catch (error) {
      toast.error('Failed to check password');
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-500">🔐 {t.securityNote}</p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.passwordLabel}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setResult(null);
            }}
            placeholder={t.passwordPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-hub-accent pr-20"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hub-muted hover:text-white"
          >
            {showPassword ? t.hidePassword : t.showPassword}
          </button>
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={!password || isChecking}
        className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isChecking ? t.checking : t.checkButton}
      </button>

      {/* Result */}
      {result !== null && (
        <div className={`p-6 rounded-lg border ${
          result.safe
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`text-4xl ${result.safe ? 'text-green-500' : 'text-red-500'}`}>
              {result.safe ? '✓' : '⚠'}
            </div>
            <div className="flex-1">
              <p className={`text-lg font-semibold mb-2 ${result.safe ? 'text-green-500' : 'text-red-500'}`}>
                {result.safe ? t.resultSafe : t.resultBreached}
              </p>
              {!result.safe && (
                <p className="text-red-400 mb-4">
                  Found <span className="font-bold text-2xl">{formatCount(result.count)}</span> {t.timesFound}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-hub-border/50">
                <p className="text-sm text-hub-muted font-medium mb-1">{t.recommendation}</p>
                <p className="text-sm text-hub-muted">
                  {result.safe ? t.recommendationSafe : t.recommendationBreached}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-2">{t.howItWorks}</h3>
        <p className="text-sm text-hub-muted">{t.howItWorksText}</p>
        <p className="text-xs text-hub-accent mt-3">{t.apiCredit}</p>
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
