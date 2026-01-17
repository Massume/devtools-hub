'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUrlParserTranslations } from '@/lib/i18n-url-parser';
import toast from 'react-hot-toast';

const SAMPLE_URL = 'https://user:pass@example.com:8080/path/to/page?name=John&age=30&tags=a&tags=b#section';

export function UrlParser() {
  const { locale } = useI18n();
  const t = getUrlParserTranslations(locale);

  const [input, setInput] = useState('');

  const { parsedUrl, error, queryParams } = useMemo(() => {
    if (!input.trim()) {
      return { parsedUrl: null, error: null, queryParams: [] };
    }

    try {
      const url = new URL(input);
      const params: { name: string; value: string }[] = [];

      url.searchParams.forEach((value, name) => {
        params.push({ name, value });
      });

      return { parsedUrl: url, error: null, queryParams: params };
    } catch {
      return { parsedUrl: null, error: t.invalidUrl, queryParams: [] };
    }
  }, [input, t.invalidUrl]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const loadSample = () => {
    setInput(SAMPLE_URL);
  };

  const components = parsedUrl ? [
    { key: 'protocol', label: t.protocol, value: parsedUrl.protocol },
    { key: 'hostname', label: t.hostname, value: parsedUrl.hostname },
    { key: 'port', label: t.port, value: parsedUrl.port || '(default)' },
    { key: 'pathname', label: t.pathname, value: parsedUrl.pathname },
    { key: 'search', label: t.search, value: parsedUrl.search || '(none)' },
    { key: 'hash', label: t.hash, value: parsedUrl.hash || '(none)' },
    { key: 'origin', label: t.origin, value: parsedUrl.origin },
    { key: 'host', label: t.host, value: parsedUrl.host },
    { key: 'username', label: t.username, value: parsedUrl.username || '(none)' },
    { key: 'password', label: t.password, value: parsedUrl.password || '(none)' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.inputLabel}</label>
          <button
            onClick={loadSample}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.loadSample}
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className={`w-full bg-hub-darker border rounded-lg px-4 py-3 font-mono text-sm text-white focus:outline-none ${
            error ? 'border-red-500' : 'border-hub-border focus:border-hub-accent'
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Parsed Components */}
      {parsedUrl && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-4">{t.resultLabel}</h3>
          <div className="space-y-3">
            {components.map(comp => (
              <div
                key={comp.key}
                className="flex items-center justify-between bg-hub-darker rounded-lg p-3"
              >
                <div className="flex-1">
                  <div className="text-xs text-hub-muted mb-1">{comp.label}</div>
                  <div className="font-mono text-sm text-white break-all">
                    {comp.value}
                  </div>
                </div>
                {comp.value && comp.value !== '(none)' && comp.value !== '(default)' && (
                  <button
                    onClick={() => handleCopy(comp.value)}
                    className="ml-3 text-xs text-hub-accent hover:underline flex-shrink-0"
                  >
                    {t.copyButton}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Parameters */}
      {parsedUrl && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-4">{t.queryParams}</h3>
          {queryParams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hub-border">
                    <th className="text-left py-2 px-3 text-hub-muted font-medium">{t.paramName}</th>
                    <th className="text-left py-2 px-3 text-hub-muted font-medium">{t.paramValue}</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {queryParams.map((param, index) => (
                    <tr key={index} className="border-b border-hub-border/50">
                      <td className="py-2 px-3 font-mono text-hub-accent">{param.name}</td>
                      <td className="py-2 px-3 font-mono text-white break-all">{param.value}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleCopy(`${param.name}=${param.value}`)}
                          className="text-xs text-hub-accent hover:underline"
                        >
                          {t.copyButton}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-hub-muted">{t.noParams}</p>
          )}
        </div>
      )}

      {/* Visual Breakdown */}
      {parsedUrl && (
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
          <div className="font-mono text-sm break-all">
            <span className="text-blue-400">{parsedUrl.protocol}//</span>
            {parsedUrl.username && (
              <>
                <span className="text-purple-400">{parsedUrl.username}</span>
                {parsedUrl.password && (
                  <>
                    <span className="text-hub-muted">:</span>
                    <span className="text-purple-400">{parsedUrl.password}</span>
                  </>
                )}
                <span className="text-hub-muted">@</span>
              </>
            )}
            <span className="text-green-400">{parsedUrl.hostname}</span>
            {parsedUrl.port && (
              <>
                <span className="text-hub-muted">:</span>
                <span className="text-yellow-400">{parsedUrl.port}</span>
              </>
            )}
            <span className="text-cyan-400">{parsedUrl.pathname}</span>
            {parsedUrl.search && (
              <span className="text-orange-400">{parsedUrl.search}</span>
            )}
            {parsedUrl.hash && (
              <span className="text-pink-400">{parsedUrl.hash}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded">protocol</span>
            <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded">auth</span>
            <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded">hostname</span>
            <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded">port</span>
            <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 rounded">pathname</span>
            <span className="px-2 py-1 bg-orange-400/20 text-orange-400 rounded">search</span>
            <span className="px-2 py-1 bg-pink-400/20 text-pink-400 rounded">hash</span>
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
