'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUtmBuilderTranslations } from '@/lib/i18n-utm-builder';
import toast from 'react-hot-toast';

interface UtmParams {
  baseUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  utmId: string;
}

const DEFAULT_PARAMS: UtmParams = {
  baseUrl: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  utmId: '',
};

const PRESETS: Record<string, Partial<UtmParams>> = {
  google: { utmSource: 'google', utmMedium: 'cpc' },
  facebook: { utmSource: 'facebook', utmMedium: 'social' },
  email: { utmSource: 'newsletter', utmMedium: 'email' },
  twitter: { utmSource: 'twitter', utmMedium: 'social' },
};

export function UtmBuilder() {
  const { locale } = useI18n();
  const t = getUtmBuilderTranslations(locale);

  const [params, setParams] = useState<UtmParams>(DEFAULT_PARAMS);

  const updateParam = (key: keyof UtmParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const { generatedUrl, isValid, urlError } = useMemo(() => {
    if (!params.baseUrl.trim()) {
      return { generatedUrl: '', isValid: false, urlError: null };
    }

    try {
      const url = new URL(params.baseUrl);

      if (params.utmSource) url.searchParams.set('utm_source', params.utmSource);
      if (params.utmMedium) url.searchParams.set('utm_medium', params.utmMedium);
      if (params.utmCampaign) url.searchParams.set('utm_campaign', params.utmCampaign);
      if (params.utmTerm) url.searchParams.set('utm_term', params.utmTerm);
      if (params.utmContent) url.searchParams.set('utm_content', params.utmContent);
      if (params.utmId) url.searchParams.set('utm_id', params.utmId);

      return { generatedUrl: url.toString(), isValid: true, urlError: null };
    } catch {
      return { generatedUrl: '', isValid: false, urlError: 'Invalid URL' };
    }
  }, [params]);

  const handleCopy = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success(t.copied);
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setParams(prev => ({ ...prev, ...preset }));
    }
  };

  const clearAll = () => {
    setParams(DEFAULT_PARAMS);
  };

  const fields: {
    key: keyof UtmParams;
    label: string;
    placeholder: string;
    help: string;
    required: boolean;
  }[] = [
    { key: 'baseUrl', label: t.baseUrl, placeholder: t.baseUrlPlaceholder, help: '', required: true },
    { key: 'utmSource', label: t.utmSource, placeholder: t.utmSourcePlaceholder, help: t.utmSourceHelp, required: true },
    { key: 'utmMedium', label: t.utmMedium, placeholder: t.utmMediumPlaceholder, help: t.utmMediumHelp, required: true },
    { key: 'utmCampaign', label: t.utmCampaign, placeholder: t.utmCampaignPlaceholder, help: t.utmCampaignHelp, required: true },
    { key: 'utmTerm', label: t.utmTerm, placeholder: t.utmTermPlaceholder, help: t.utmTermHelp, required: false },
    { key: 'utmContent', label: t.utmContent, placeholder: t.utmContentPlaceholder, help: t.utmContentHelp, required: false },
    { key: 'utmId', label: t.utmId, placeholder: t.utmIdPlaceholder, help: t.utmIdHelp, required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-hub-muted">{t.presets}</h3>
          <button
            onClick={clearAll}
            className="text-xs text-hub-accent hover:underline"
          >
            {t.clearAll}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('google')}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
          >
            {t.presetGoogle}
          </button>
          <button
            onClick={() => applyPreset('facebook')}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
          >
            {t.presetFacebook}
          </button>
          <button
            onClick={() => applyPreset('email')}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
          >
            {t.presetEmail}
          </button>
          <button
            onClick={() => applyPreset('twitter')}
            className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
          >
            {t.presetTwitter}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-hub-muted">{field.label}</label>
              <span className={`text-xs px-2 py-0.5 rounded ${
                field.required ? 'bg-red-500/20 text-red-400' : 'bg-hub-darker text-hub-muted'
              }`}>
                {field.required ? t.required : t.optional}
              </span>
            </div>
            <input
              type="text"
              value={params[field.key]}
              onChange={(e) => updateParam(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full bg-hub-darker border rounded-lg px-4 py-2 text-sm text-white focus:outline-none ${
                field.key === 'baseUrl' && urlError
                  ? 'border-red-500'
                  : 'border-hub-border focus:border-hub-accent'
              }`}
            />
            {field.help && (
              <p className="text-xs text-hub-muted mt-1">{field.help}</p>
            )}
          </div>
        ))}
      </div>

      {/* Generated URL */}
      {generatedUrl && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.resultLabel}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <div className="bg-hub-darker border border-hub-border rounded-lg p-4">
            <code className="text-sm text-green-400 font-mono break-all">{generatedUrl}</code>
          </div>
          <p className="text-xs text-hub-muted mt-2">{t.shortenUrl}</p>
        </div>
      )}

      {/* URL Breakdown */}
      {generatedUrl && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <div className="space-y-2 text-sm">
            {params.utmSource && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_source:</span>
                <span className="text-hub-accent font-mono">{params.utmSource}</span>
              </div>
            )}
            {params.utmMedium && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_medium:</span>
                <span className="text-cyan-400 font-mono">{params.utmMedium}</span>
              </div>
            )}
            {params.utmCampaign && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_campaign:</span>
                <span className="text-yellow-400 font-mono">{params.utmCampaign}</span>
              </div>
            )}
            {params.utmTerm && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_term:</span>
                <span className="text-purple-400 font-mono">{params.utmTerm}</span>
              </div>
            )}
            {params.utmContent && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_content:</span>
                <span className="text-pink-400 font-mono">{params.utmContent}</span>
              </div>
            )}
            {params.utmId && (
              <div className="flex gap-2">
                <span className="text-hub-muted w-32">utm_id:</span>
                <span className="text-orange-400 font-mono">{params.utmId}</span>
              </div>
            )}
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
