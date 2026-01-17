'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUrlBuilderTranslations } from '@/lib/i18n-url-builder';
import toast from 'react-hot-toast';

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

interface UrlComponents {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  path: string;
  fragment: string;
}

const DEFAULT_COMPONENTS: UrlComponents = {
  protocol: 'https',
  username: '',
  password: '',
  hostname: '',
  port: '',
  path: '',
  fragment: '',
};

export function UrlBuilder() {
  const { locale } = useI18n();
  const t = getUrlBuilderTranslations(locale);

  const [components, setComponents] = useState<UrlComponents>(DEFAULT_COMPONENTS);
  const [params, setParams] = useState<QueryParam[]>([]);
  const [encodeParams, setEncodeParams] = useState(true);
  const [parseInput, setParseInput] = useState('');

  const updateComponent = (key: keyof UrlComponents, value: string) => {
    setComponents(prev => ({ ...prev, [key]: value }));
  };

  const addParam = () => {
    setParams([...params, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const removeParam = (id: string) => {
    setParams(params.filter(p => p.id !== id));
  };

  const updateParam = (id: string, field: 'key' | 'value', value: string) => {
    setParams(params.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const generatedUrl = useMemo(() => {
    if (!components.hostname) return '';

    let url = `${components.protocol}://`;

    // Auth
    if (components.username) {
      url += encodeURIComponent(components.username);
      if (components.password) {
        url += ':' + encodeURIComponent(components.password);
      }
      url += '@';
    }

    // Host
    url += components.hostname;

    // Port
    if (components.port) {
      url += ':' + components.port;
    }

    // Path
    if (components.path) {
      const path = components.path.startsWith('/') ? components.path : '/' + components.path;
      url += path;
    }

    // Query params
    const validParams = params.filter(p => p.key);
    if (validParams.length > 0) {
      const queryString = validParams.map(p => {
        const key = encodeParams ? encodeURIComponent(p.key) : p.key;
        const value = encodeParams ? encodeURIComponent(p.value) : p.value;
        return `${key}=${value}`;
      }).join('&');
      url += '?' + queryString;
    }

    // Fragment
    if (components.fragment) {
      url += '#' + (encodeParams ? encodeURIComponent(components.fragment) : components.fragment);
    }

    return url;
  }, [components, params, encodeParams]);

  const isValidUrl = useMemo(() => {
    if (!generatedUrl) return false;
    try {
      new URL(generatedUrl);
      return true;
    } catch {
      return false;
    }
  }, [generatedUrl]);

  const parseUrl = () => {
    try {
      const url = new URL(parseInput);
      setComponents({
        protocol: url.protocol.replace(':', ''),
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        fragment: url.hash.replace('#', ''),
      });

      const newParams: QueryParam[] = [];
      url.searchParams.forEach((value, key) => {
        newParams.push({ id: Date.now().toString() + Math.random(), key, value });
      });
      setParams(newParams);
      setParseInput('');
      toast.success('URL parsed!');
    } catch {
      toast.error('Invalid URL');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    toast.success(t.copied);
  };

  const clearAll = () => {
    setComponents(DEFAULT_COMPONENTS);
    setParams([]);
  };

  const applyTemplate = (template: 'api' | 'webhook' | 'oauth') => {
    switch (template) {
      case 'api':
        setComponents({
          ...DEFAULT_COMPONENTS,
          hostname: 'api.example.com',
          path: '/v1/users',
        });
        setParams([
          { id: '1', key: 'page', value: '1' },
          { id: '2', key: 'limit', value: '20' },
        ]);
        break;
      case 'webhook':
        setComponents({
          ...DEFAULT_COMPONENTS,
          hostname: 'hooks.example.com',
          path: '/webhook',
        });
        setParams([
          { id: '1', key: 'token', value: 'abc123' },
        ]);
        break;
      case 'oauth':
        setComponents({
          ...DEFAULT_COMPONENTS,
          hostname: 'auth.example.com',
          path: '/oauth/callback',
        });
        setParams([
          { id: '1', key: 'code', value: '' },
          { id: '2', key: 'state', value: '' },
        ]);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Parse URL */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.parseUrl}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={parseInput}
            onChange={(e) => setParseInput(e.target.value)}
            placeholder={t.parseUrlPlaceholder}
            className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <button
            onClick={parseUrl}
            className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80"
          >
            {t.parseButton}
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.templates}</h3>
          <button onClick={clearAll} className="text-xs text-hub-accent hover:underline">{t.clearAll}</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => applyTemplate('api')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.templateApi}
          </button>
          <button onClick={() => applyTemplate('webhook')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.templateWebhook}
          </button>
          <button onClick={() => applyTemplate('oauth')} className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50">
            {t.templateOAuth}
          </button>
        </div>
      </div>

      {/* URL Components */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.components}</h3>

        {/* Protocol & Host */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.protocol}</label>
            <select
              value={components.protocol}
              onChange={(e) => updateComponent('protocol', e.target.value)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="https">{t.protocolHttps}</option>
              <option value="http">{t.protocolHttp}</option>
              <option value="ftp">{t.protocolFtp}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-hub-muted mb-1">{t.hostname}</label>
            <input
              type="text"
              value={components.hostname}
              onChange={(e) => updateComponent('hostname', e.target.value)}
              placeholder={t.hostnamePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.port}</label>
            <input
              type="text"
              value={components.port}
              onChange={(e) => updateComponent('port', e.target.value)}
              placeholder={t.portPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>

        {/* Auth */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.username}</label>
            <input
              type="text"
              value={components.username}
              onChange={(e) => updateComponent('username', e.target.value)}
              placeholder={t.usernamePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.password}</label>
            <input
              type="password"
              value={components.password}
              onChange={(e) => updateComponent('password', e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>

        {/* Path */}
        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.path}</label>
          <input
            type="text"
            value={components.path}
            onChange={(e) => updateComponent('path', e.target.value)}
            placeholder={t.pathPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
          />
        </div>

        {/* Fragment */}
        <div>
          <label className="block text-sm text-hub-muted mb-1">{t.fragment}</label>
          <input
            type="text"
            value={components.fragment}
            onChange={(e) => updateComponent('fragment', e.target.value)}
            placeholder={t.fragmentPlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
        </div>
      </div>

      {/* Query Parameters */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-hub-muted">{t.queryParams}</h3>

        {params.map(param => (
          <div key={param.id} className="flex gap-2">
            <input
              type="text"
              value={param.key}
              onChange={(e) => updateParam(param.id, 'key', e.target.value)}
              placeholder={t.paramKey}
              className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
            />
            <input
              type="text"
              value={param.value}
              onChange={(e) => updateParam(param.id, 'value', e.target.value)}
              placeholder={t.paramValue}
              className="flex-1 bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-hub-accent"
            />
            <button onClick={() => removeParam(param.id)} className="px-3 py-2 text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        ))}

        <button onClick={addParam} className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80">
          {t.addParam}
        </button>
      </div>

      {/* Encoding Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-3">{t.encoding}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={encodeParams}
            onChange={(e) => setEncodeParams(e.target.checked)}
            className="rounded border-hub-border bg-hub-darker accent-hub-accent"
          />
          <span className="text-sm text-hub-muted">{t.encodeParams}</span>
        </label>
      </div>

      {/* Generated URL */}
      {generatedUrl && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-hub-muted">{t.generatedUrl}</label>
              <span className={`text-xs px-2 py-0.5 rounded ${isValidUrl ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isValidUrl ? t.validUrl : t.invalidUrl}
              </span>
            </div>
            <button onClick={handleCopy} className="text-sm text-hub-accent hover:underline">
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <code className="text-sm text-green-400 font-mono break-all">{generatedUrl}</code>
          </div>
          <p className="text-xs text-hub-muted mt-2">
            {t.urlLength}: {generatedUrl.length} {t.characters}
            {generatedUrl.length > 2048 && <span className="text-yellow-400 ml-2">{t.warning}</span>}
          </p>
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
