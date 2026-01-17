'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getCorsGeneratorTranslations } from '@/lib/i18n-cors-generator';
import toast from 'react-hot-toast';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
const COMMON_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Api-Key'];

export function CorsGenerator() {
  const { locale } = useI18n();
  const t = getCorsGeneratorTranslations(locale);

  const [origins, setOrigins] = useState<string[]>([]);
  const [allowAllOrigins, setAllowAllOrigins] = useState(false);
  const [methods, setMethods] = useState<string[]>(['GET', 'POST', 'PUT', 'DELETE']);
  const [allowedHeaders, setAllowedHeaders] = useState<string[]>(['Content-Type', 'Authorization']);
  const [exposeHeaders, setExposeHeaders] = useState<string[]>([]);
  const [allowCredentials, setAllowCredentials] = useState(false);
  const [maxAge, setMaxAge] = useState(86400);

  const [newOrigin, setNewOrigin] = useState('');
  const [newHeader, setNewHeader] = useState('');
  const [newExposeHeader, setNewExposeHeader] = useState('');

  const addOrigin = () => {
    if (newOrigin && !origins.includes(newOrigin)) {
      setOrigins([...origins, newOrigin]);
      setNewOrigin('');
    }
  };

  const removeOrigin = (origin: string) => {
    setOrigins(origins.filter(o => o !== origin));
  };

  const toggleMethod = (method: string) => {
    if (methods.includes(method)) {
      setMethods(methods.filter(m => m !== method));
    } else {
      setMethods([...methods, method]);
    }
  };

  const addHeader = () => {
    if (newHeader && !allowedHeaders.includes(newHeader)) {
      setAllowedHeaders([...allowedHeaders, newHeader]);
      setNewHeader('');
    }
  };

  const removeHeader = (header: string) => {
    setAllowedHeaders(allowedHeaders.filter(h => h !== header));
  };

  const addExposeHeader = () => {
    if (newExposeHeader && !exposeHeaders.includes(newExposeHeader)) {
      setExposeHeaders([...exposeHeaders, newExposeHeader]);
      setNewExposeHeader('');
    }
  };

  const removeExposeHeader = (header: string) => {
    setExposeHeaders(exposeHeaders.filter(h => h !== header));
  };

  const applyPreset = (preset: 'public' | 'restrictive' | 'development') => {
    switch (preset) {
      case 'public':
        setAllowAllOrigins(true);
        setOrigins([]);
        setMethods(['GET', 'POST', 'OPTIONS']);
        setAllowedHeaders(['Content-Type']);
        setAllowCredentials(false);
        setMaxAge(86400);
        break;
      case 'restrictive':
        setAllowAllOrigins(false);
        setOrigins(['https://example.com']);
        setMethods(['GET', 'POST']);
        setAllowedHeaders(['Content-Type', 'Authorization']);
        setAllowCredentials(true);
        setMaxAge(3600);
        break;
      case 'development':
        setAllowAllOrigins(false);
        setOrigins(['http://localhost:3000', 'http://localhost:5173']);
        setMethods(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
        setAllowedHeaders(['Content-Type', 'Authorization', 'X-Requested-With']);
        setAllowCredentials(true);
        setMaxAge(0);
        break;
    }
  };

  const generateHeaders = () => {
    const headers: Record<string, string> = {};

    if (allowAllOrigins && !allowCredentials) {
      headers['Access-Control-Allow-Origin'] = '*';
    } else if (origins.length > 0) {
      headers['Access-Control-Allow-Origin'] = origins[0];
    }

    if (methods.length > 0) {
      headers['Access-Control-Allow-Methods'] = methods.join(', ');
    }

    if (allowedHeaders.length > 0) {
      headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
    }

    if (exposeHeaders.length > 0) {
      headers['Access-Control-Expose-Headers'] = exposeHeaders.join(', ');
    }

    if (allowCredentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    if (maxAge > 0) {
      headers['Access-Control-Max-Age'] = maxAge.toString();
    }

    return headers;
  };

  const headers = generateHeaders();

  const generateExpressCode = () => {
    const origin = allowAllOrigins ? "'*'" : (origins.length > 1
      ? `[${origins.map(o => `'${o}'`).join(', ')}]`
      : `'${origins[0] || '*'}'`);

    return `app.use(cors({
  origin: ${origin},
  methods: [${methods.map(m => `'${m}'`).join(', ')}],
  allowedHeaders: [${allowedHeaders.map(h => `'${h}'`).join(', ')}],${exposeHeaders.length > 0 ? `\n  exposedHeaders: [${exposeHeaders.map(h => `'${h}'`).join(', ')}],` : ''}
  credentials: ${allowCredentials},
  maxAge: ${maxAge}
}));`;
  };

  const generateNginxConfig = () => {
    const origin = allowAllOrigins ? '*' : (origins[0] || '$http_origin');
    return `add_header 'Access-Control-Allow-Origin' '${origin}';
add_header 'Access-Control-Allow-Methods' '${methods.join(', ')}';
add_header 'Access-Control-Allow-Headers' '${allowedHeaders.join(', ')}';${exposeHeaders.length > 0 ? `\nadd_header 'Access-Control-Expose-Headers' '${exposeHeaders.join(', ')}';` : ''}${allowCredentials ? `\nadd_header 'Access-Control-Allow-Credentials' 'true';` : ''}
add_header 'Access-Control-Max-Age' '${maxAge}';`;
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    const headerText = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    await navigator.clipboard.writeText(headerText);
    toast.success(t.copied);
  };

  const hasCredentialsWarning = allowCredentials && allowAllOrigins;

  return (
    <div className="space-y-6">
      {/* Security Note */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-500">⚠️ {t.securityNote}</p>
      </div>

      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm text-hub-muted mb-2">{t.presets}</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => applyPreset('public')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors">{t.presetPublicApi}</button>
          <button onClick={() => applyPreset('restrictive')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors">{t.presetRestrictive}</button>
          <button onClick={() => applyPreset('development')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors">{t.presetDevelopment}</button>
        </div>
      </div>

      {/* Origins */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">{t.originsTitle}</h3>

        <label className="flex items-center gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAllOrigins}
            onChange={(e) => setAllowAllOrigins(e.target.checked)}
            disabled={allowCredentials}
            className="rounded border-hub-border bg-hub-darker accent-hub-accent"
          />
          <span className="text-sm text-white">{t.allowAllOrigins}</span>
        </label>
        {allowAllOrigins && (
          <p className="text-xs text-yellow-500 mb-3">{t.allowAllOriginsDesc}</p>
        )}

        {!allowAllOrigins && (
          <>
            {origins.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {origins.map((origin) => (
                  <span key={origin} className="inline-flex items-center gap-1 px-2 py-1 bg-hub-darker rounded text-xs font-mono text-white">
                    {origin}
                    <button onClick={() => removeOrigin(origin)} className="text-hub-muted hover:text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newOrigin}
                onChange={(e) => setNewOrigin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addOrigin()}
                placeholder={t.originPlaceholder}
                className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-1 text-sm font-mono text-white focus:outline-none focus:border-hub-accent"
              />
              <button onClick={addOrigin} className="px-3 py-1 text-sm bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors">{t.addOrigin}</button>
            </div>
          </>
        )}
      </div>

      {/* Methods */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">{t.methodsTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((method) => (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={`px-3 py-1 text-sm rounded border transition-colors ${
                methods.includes(method)
                  ? 'bg-hub-accent text-hub-darker border-hub-accent'
                  : 'bg-hub-darker border-hub-border text-white hover:border-hub-accent/50'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Allowed Headers */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">{t.headersTitle}</h3>

        {allowedHeaders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {allowedHeaders.map((header) => (
              <span key={header} className="inline-flex items-center gap-1 px-2 py-1 bg-hub-darker rounded text-xs font-mono text-white">
                {header}
                <button onClick={() => removeHeader(header)} className="text-hub-muted hover:text-red-500 ml-1">×</button>
              </span>
            ))}
          </div>
        )}

        <div className="mb-3">
          <span className="text-xs text-hub-muted">{t.commonHeaders}:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {COMMON_HEADERS.filter(h => !allowedHeaders.includes(h)).map((header) => (
              <button
                key={header}
                onClick={() => setAllowedHeaders([...allowedHeaders, header])}
                className="px-2 py-1 text-xs bg-hub-darker border border-hub-border rounded hover:border-hub-accent/50 transition-colors"
              >
                {header}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newHeader}
            onChange={(e) => setNewHeader(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHeader()}
            placeholder={t.headerPlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded px-3 py-1 text-sm font-mono text-white focus:outline-none focus:border-hub-accent"
          />
          <button onClick={addHeader} className="px-3 py-1 text-sm bg-hub-accent text-hub-darker rounded hover:bg-hub-accent-dim transition-colors">{t.addHeader}</button>
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allowCredentials}
            onChange={(e) => {
              setAllowCredentials(e.target.checked);
              if (e.target.checked && allowAllOrigins) {
                setAllowAllOrigins(false);
              }
            }}
            className="mt-1 rounded border-hub-border bg-hub-darker accent-hub-accent"
          />
          <div>
            <span className="text-sm text-white">{t.credentialsTitle}</span>
            <p className="text-xs text-hub-muted">{t.credentialsDesc}</p>
            {hasCredentialsWarning && (
              <p className="text-xs text-red-500 mt-1">{t.credentialsWarning}</p>
            )}
          </div>
        </label>
      </div>

      {/* Max Age */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.maxAgeTitle}</label>
          <span className="text-hub-accent font-mono">{maxAge}s</span>
        </div>
        <input
          type="range"
          min={0}
          max={86400}
          step={3600}
          value={maxAge}
          onChange={(e) => setMaxAge(parseInt(e.target.value))}
          className="w-full accent-hub-accent"
        />
        <p className="text-xs text-hub-muted mt-1">{t.maxAgeDesc}</p>
      </div>

      {/* Output Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.outputLabel}</label>
          <button onClick={handleCopyAll} className="text-sm text-hub-accent hover:underline">{t.copyAll}</button>
        </div>
        <div className="bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-xs space-y-1">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start gap-4">
              <span className="text-cyan-400">{key}:</span>
              <span className="text-green-400 text-right break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">{t.codeExamples}</h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-hub-muted">{t.expressExample}</span>
              <button onClick={() => handleCopy(generateExpressCode())} className="text-xs text-hub-accent hover:underline">{t.copyButton}</button>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded p-3 font-mono text-xs text-yellow-400 overflow-x-auto">{generateExpressCode()}</pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-hub-muted">{t.nginxExample}</span>
              <button onClick={() => handleCopy(generateNginxConfig())} className="text-xs text-hub-accent hover:underline">{t.copyButton}</button>
            </div>
            <pre className="bg-hub-darker border border-hub-border rounded p-3 font-mono text-xs text-purple-400 overflow-x-auto">{generateNginxConfig()}</pre>
          </div>
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
