'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getTwitterCardGeneratorTranslations } from '@/lib/i18n-twitter-card-generator';
import toast from 'react-hot-toast';

interface TwitterData {
  cardType: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  site: string;
  creator: string;
  // Player specific
  playerUrl: string;
  playerWidth: string;
  playerHeight: string;
  playerStream: string;
  // App specific
  appNameIphone: string;
  appIdIphone: string;
  appUrlIphone: string;
  appNameIpad: string;
  appIdIpad: string;
  appUrlIpad: string;
  appNameGoogle: string;
  appIdGoogle: string;
  appUrlGoogle: string;
}

const DEFAULT_TWITTER: TwitterData = {
  cardType: 'summary_large_image',
  title: '',
  description: '',
  image: '',
  imageAlt: '',
  site: '',
  creator: '',
  playerUrl: '',
  playerWidth: '480',
  playerHeight: '480',
  playerStream: '',
  appNameIphone: '',
  appIdIphone: '',
  appUrlIphone: '',
  appNameIpad: '',
  appIdIpad: '',
  appUrlIpad: '',
  appNameGoogle: '',
  appIdGoogle: '',
  appUrlGoogle: '',
};

export function TwitterCardGenerator() {
  const { locale } = useI18n();
  const t = getTwitterCardGeneratorTranslations(locale);

  const [twitter, setTwitter] = useState<TwitterData>(DEFAULT_TWITTER);

  const updateTwitter = <K extends keyof TwitterData>(key: K, value: TwitterData[K]) => {
    setTwitter(prev => ({ ...prev, [key]: value }));
  };

  const generatedTags = useMemo(() => {
    const tags: string[] = [];

    tags.push(`<meta name="twitter:card" content="${twitter.cardType}">`);
    if (twitter.title) tags.push(`<meta name="twitter:title" content="${twitter.title}">`);
    if (twitter.description) tags.push(`<meta name="twitter:description" content="${twitter.description}">`);
    if (twitter.image) {
      tags.push(`<meta name="twitter:image" content="${twitter.image}">`);
      if (twitter.imageAlt) tags.push(`<meta name="twitter:image:alt" content="${twitter.imageAlt}">`);
    }
    if (twitter.site) tags.push(`<meta name="twitter:site" content="${twitter.site}">`);
    if (twitter.creator) tags.push(`<meta name="twitter:creator" content="${twitter.creator}">`);

    // Player card
    if (twitter.cardType === 'player') {
      if (twitter.playerUrl) tags.push(`<meta name="twitter:player" content="${twitter.playerUrl}">`);
      if (twitter.playerWidth) tags.push(`<meta name="twitter:player:width" content="${twitter.playerWidth}">`);
      if (twitter.playerHeight) tags.push(`<meta name="twitter:player:height" content="${twitter.playerHeight}">`);
      if (twitter.playerStream) tags.push(`<meta name="twitter:player:stream" content="${twitter.playerStream}">`);
    }

    // App card
    if (twitter.cardType === 'app') {
      if (twitter.appNameIphone) tags.push(`<meta name="twitter:app:name:iphone" content="${twitter.appNameIphone}">`);
      if (twitter.appIdIphone) tags.push(`<meta name="twitter:app:id:iphone" content="${twitter.appIdIphone}">`);
      if (twitter.appUrlIphone) tags.push(`<meta name="twitter:app:url:iphone" content="${twitter.appUrlIphone}">`);
      if (twitter.appNameIpad) tags.push(`<meta name="twitter:app:name:ipad" content="${twitter.appNameIpad}">`);
      if (twitter.appIdIpad) tags.push(`<meta name="twitter:app:id:ipad" content="${twitter.appIdIpad}">`);
      if (twitter.appUrlIpad) tags.push(`<meta name="twitter:app:url:ipad" content="${twitter.appUrlIpad}">`);
      if (twitter.appNameGoogle) tags.push(`<meta name="twitter:app:name:googleplay" content="${twitter.appNameGoogle}">`);
      if (twitter.appIdGoogle) tags.push(`<meta name="twitter:app:id:googleplay" content="${twitter.appIdGoogle}">`);
      if (twitter.appUrlGoogle) tags.push(`<meta name="twitter:app:url:googleplay" content="${twitter.appUrlGoogle}">`);
    }

    return tags.join('\n');
  }, [twitter]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTags);
    toast.success(t.copied);
  };

  const clearAll = () => {
    setTwitter(DEFAULT_TWITTER);
  };

  const getCharCountColor = (current: number, max: number) => {
    if (current === 0) return 'text-hub-muted';
    if (current > max) return 'text-red-400';
    if (current > max * 0.9) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearAll}
        </button>
      </div>

      {/* Card Type */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm font-medium text-hub-muted mb-3">{t.cardType}</label>
        <div className="grid sm:grid-cols-4 gap-2">
          {[
            { value: 'summary', label: t.typeSummary },
            { value: 'summary_large_image', label: t.typeSummaryLarge },
            { value: 'app', label: t.typeApp },
            { value: 'player', label: t.typePlayer },
          ].map(type => (
            <button
              key={type.value}
              onClick={() => updateTwitter('cardType', type.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                twitter.cardType === type.value
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.basicInfo}</h3>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.twitterTitle}</label>
            <span className={`text-xs ${getCharCountColor(twitter.title.length, 70)}`}>
              {twitter.title.length}/70
            </span>
          </div>
          <input
            type="text"
            value={twitter.title}
            onChange={(e) => updateTwitter('title', e.target.value)}
            placeholder={t.twitterTitlePlaceholder}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
          />
          <p className="text-xs text-hub-muted mt-1">{t.twitterTitleHelp}</p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.twitterDescription}</label>
            <span className={`text-xs ${getCharCountColor(twitter.description.length, 200)}`}>
              {twitter.description.length}/200
            </span>
          </div>
          <textarea
            value={twitter.description}
            onChange={(e) => updateTwitter('description', e.target.value)}
            placeholder={t.twitterDescriptionPlaceholder}
            rows={3}
            className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
          />
          <p className="text-xs text-hub-muted mt-1">{t.twitterDescriptionHelp}</p>
        </div>

        {/* Image */}
        {twitter.cardType !== 'app' && (
          <>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.twitterImage}</label>
              <input
                type="url"
                value={twitter.image}
                onChange={(e) => updateTwitter('image', e.target.value)}
                placeholder={t.twitterImagePlaceholder}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
              <p className="text-xs text-hub-muted mt-1">{t.twitterImageHelp}</p>
            </div>
            {twitter.image && (
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.twitterImageAlt}</label>
                <input
                  type="text"
                  value={twitter.imageAlt}
                  onChange={(e) => updateTwitter('imageAlt', e.target.value)}
                  placeholder={t.twitterImageAltPlaceholder}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Site Info */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-hub-muted">{t.siteInfo}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.twitterSite}</label>
            <input
              type="text"
              value={twitter.site}
              onChange={(e) => updateTwitter('site', e.target.value)}
              placeholder={t.twitterSitePlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.twitterCreator}</label>
            <input
              type="text"
              value={twitter.creator}
              onChange={(e) => updateTwitter('creator', e.target.value)}
              placeholder={t.twitterCreatorPlaceholder}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>
      </div>

      {/* Player Info */}
      {twitter.cardType === 'player' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.playerInfo}</h3>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.playerUrl}</label>
            <input
              type="url"
              value={twitter.playerUrl}
              onChange={(e) => updateTwitter('playerUrl', e.target.value)}
              placeholder="https://example.com/player"
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.playerWidth}</label>
              <input
                type="number"
                value={twitter.playerWidth}
                onChange={(e) => updateTwitter('playerWidth', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.playerHeight}</label>
              <input
                type="number"
                value={twitter.playerHeight}
                onChange={(e) => updateTwitter('playerHeight', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-muted mb-2">{t.playerStream}</label>
            <input
              type="url"
              value={twitter.playerStream}
              onChange={(e) => updateTwitter('playerStream', e.target.value)}
              placeholder="https://example.com/stream.mp4"
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>
      )}

      {/* App Info */}
      {twitter.cardType === 'app' && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-hub-muted">{t.appInfo}</h3>

          {/* iPhone */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appNameIphone}</label>
              <input
                type="text"
                value={twitter.appNameIphone}
                onChange={(e) => updateTwitter('appNameIphone', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appIdIphone}</label>
              <input
                type="text"
                value={twitter.appIdIphone}
                onChange={(e) => updateTwitter('appIdIphone', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appUrlIphone}</label>
              <input
                type="url"
                value={twitter.appUrlIphone}
                onChange={(e) => updateTwitter('appUrlIphone', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>

          {/* Google Play */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appNameGoogle}</label>
              <input
                type="text"
                value={twitter.appNameGoogle}
                onChange={(e) => updateTwitter('appNameGoogle', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appIdGoogle}</label>
              <input
                type="text"
                value={twitter.appIdGoogle}
                onChange={(e) => updateTwitter('appIdGoogle', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-muted mb-2">{t.appUrlGoogle}</label>
              <input
                type="url"
                value={twitter.appUrlGoogle}
                onChange={(e) => updateTwitter('appUrlGoogle', e.target.value)}
                className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {(twitter.title || twitter.description) && (
        <div className="bg-hub-card border border-hub-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-hub-muted mb-3">{t.preview}</h3>
          <div className="bg-[#15202b] rounded-2xl overflow-hidden max-w-md border border-[#38444d]">
            {twitter.image && twitter.cardType.includes('image') && (
              <div className="aspect-[2/1] bg-[#192734] flex items-center justify-center text-gray-500">
                <span className="text-sm">Image Preview</span>
              </div>
            )}
            <div className="p-3">
              <div className="text-white font-normal text-sm">{twitter.title || 'Card Title'}</div>
              <div className="text-[#8899a6] text-sm mt-1 line-clamp-2">{twitter.description || 'Description'}</div>
              <div className="text-[#8899a6] text-sm mt-2 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"/><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"/></svg>
                {twitter.site || 'example.com'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Code */}
      {generatedTags && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-hub-accent hover:underline"
            >
              {t.copyButton}
            </button>
          </div>
          <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">
              {generatedTags}
            </code>
          </pre>
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
