'use client';

import { useState } from 'react';
import { DNSResult, AnalyzeResponse } from '@/types/dns';
import { translations as dnsTranslations, Locale } from '@/lib/i18n-dns';
import { useI18n } from '@/lib/i18n-context';
import { DomainForm } from './dns/DomainForm';
import { ScoreGauge } from './dns/ScoreGauge';
import { CheckResult } from './dns/CheckResult';

export function DnsHealthCheck() {
  const { locale } = useI18n();
  const dnsLocale = locale as Locale;
  const t = dnsTranslations[dnsLocale];

  const [result, setResult] = useState<DNSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/dns-health-check/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, locale: dnsLocale }),
      });

      const data: AnalyzeResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || t.errorCheck);
      }
    } catch (err) {
      console.error('DNS check error:', err);
      setError(t.errorCheck);
    } finally {
      setIsLoading(false);
    }
  };

  // Email security checks (MX, SPF, DMARC, DKIM)
  const emailSecurityChecks = result ? [
    result.checks.mx,
    result.checks.spf,
    result.checks.dmarc,
    result.checks.dkim,
  ] : [];

  // DNS infrastructure checks (A, AAAA, NS, CAA)
  const dnsInfrastructureChecks = result ? [
    result.checks.a,
    result.checks.aaaa,
    result.checks.ns,
    result.checks.caa,
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex px-4 py-1.5 bg-hub-accent/10 border border-hub-accent/20 rounded-full">
          <span className="text-hub-accent text-sm font-medium">{t.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">
          {t.title1} <span className="text-white">{t.title2}</span>
        </h1>

        <p className="text-lg text-hub-muted max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Form Section */}
      <DomainForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto">
          <div className="p-4 bg-hub-error/10 border border-hub-error/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{t.errorOccurred}</h3>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Domain and timestamp */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              {t.resultsFor} <span className="text-hub-accent font-mono">{result.domain}</span>
            </h2>
            <p className="text-sm text-hub-muted">
              {t.checkedAt} {new Date(result.timestamp).toLocaleString(dnsLocale)}
            </p>
          </div>

          {/* Score Gauge */}
          <ScoreGauge score={result.score} maxScore={result.maxScore} />

          {/* Email Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-hub-border"></div>
              <h2 className="text-xl font-bold text-white px-4">{t.emailSecurity}</h2>
              <div className="flex-1 h-px bg-hub-border"></div>
            </div>

            <div className="grid gap-4">
              {emailSecurityChecks.map((check, index) => (
                <CheckResult key={check.name} check={check} index={index} />
              ))}
            </div>
          </div>

          {/* DNS Infrastructure Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-hub-border"></div>
              <h2 className="text-xl font-bold text-white px-4">{t.dnsInfrastructure}</h2>
              <div className="flex-1 h-px bg-hub-border"></div>
            </div>

            <div className="grid gap-4">
              {dnsInfrastructureChecks.map((check, index) => (
                <CheckResult
                  key={check.name}
                  check={check}
                  index={index + emailSecurityChecks.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* What We Check Section - Only show when no results */}
      {!result && !isLoading && (
        <div className="max-w-4xl mx-auto mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center">{t.whatWeCheck}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(t.features).map(([key, feature]) => (
              <div
                key={key}
                className="p-6 bg-hub-card border border-hub-border rounded-lg hover:border-hub-accent/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-hub-muted text-sm mb-3">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
