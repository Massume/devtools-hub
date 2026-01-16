'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getUsernameGeneratorTranslations } from '@/lib/i18n-username-generator';
import toast from 'react-hot-toast';

type Style = 'random' | 'gamer' | 'cool' | 'funny' | 'professional';

const WORD_LISTS = {
  adjectives: [
    'Swift', 'Dark', 'Bright', 'Silent', 'Wild', 'Frozen', 'Blazing', 'Shadow',
    'Cosmic', 'Mystic', 'Electric', 'Thunder', 'Golden', 'Silver', 'Crystal',
    'Iron', 'Steel', 'Cyber', 'Neon', 'Pixel', 'Turbo', 'Hyper', 'Ultra',
    'Mega', 'Super', 'Epic', 'Legendary', 'Ancient', 'Eternal', 'Infinite',
  ],
  nouns: [
    'Wolf', 'Dragon', 'Phoenix', 'Tiger', 'Eagle', 'Hawk', 'Raven', 'Viper',
    'Bear', 'Lion', 'Panther', 'Fox', 'Ninja', 'Samurai', 'Knight', 'Warrior',
    'Hunter', 'Rider', 'Storm', 'Blaze', 'Frost', 'Shadow', 'Ghost', 'Spirit',
    'Blade', 'Arrow', 'Star', 'Moon', 'Sun', 'Comet', 'Nova', 'Pulse',
  ],
  gamerPrefixes: [
    'xX', 'Pro', 'Elite', 'King', 'Lord', 'Master', 'Boss', 'Chief',
    'Captain', 'General', 'Agent', 'Dr', 'Mr', 'The', 'Its', 'Im',
  ],
  gamerSuffixes: [
    'Xx', 'HD', 'TV', 'YT', 'TTV', 'BTW', 'GG', 'MVP', 'Pro', 'God',
    'King', 'Lord', 'Boss', 'Man', 'Guy', 'Dude', 'Bro', 'Kid',
  ],
  funnyAdjectives: [
    'Lazy', 'Confused', 'Hungry', 'Sleepy', 'Grumpy', 'Crazy', 'Silly',
    'Wacky', 'Funky', 'Chunky', 'Fluffy', 'Squeaky', 'Wobbly', 'Bouncy',
  ],
  funnyNouns: [
    'Potato', 'Banana', 'Penguin', 'Pickle', 'Noodle', 'Waffle', 'Taco',
    'Burrito', 'Muffin', 'Cookie', 'Donut', 'Nugget', 'Pancake', 'Pretzel',
  ],
  professionalPrefixes: [
    'Dev', 'Tech', 'Code', 'Data', 'Web', 'App', 'Cloud', 'Net',
  ],
  professionalSuffixes: [
    'Dev', 'Coder', 'Engineer', 'Builder', 'Maker', 'Creator', 'Master',
  ],
};

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function pickRandom<T>(arr: T[]): T {
  return arr[getSecureRandomInt(arr.length)];
}

function generateUsername(style: Style, includeNumbers: boolean, includeSymbols: boolean, maxLength: number): string {
  let username = '';

  switch (style) {
    case 'gamer': {
      const usePrefix = getSecureRandomInt(2) === 0;
      const useSuffix = getSecureRandomInt(2) === 0;

      if (usePrefix) username += pickRandom(WORD_LISTS.gamerPrefixes);
      if (includeSymbols && usePrefix) username += '_';
      username += pickRandom(WORD_LISTS.adjectives);
      username += pickRandom(WORD_LISTS.nouns);
      if (includeSymbols && useSuffix) username += '_';
      if (useSuffix) username += pickRandom(WORD_LISTS.gamerSuffixes);
      break;
    }
    case 'cool': {
      username = pickRandom(WORD_LISTS.adjectives) + pickRandom(WORD_LISTS.nouns);
      break;
    }
    case 'funny': {
      username = pickRandom(WORD_LISTS.funnyAdjectives) + pickRandom(WORD_LISTS.funnyNouns);
      break;
    }
    case 'professional': {
      const usePrefix = getSecureRandomInt(2) === 0;
      if (usePrefix) {
        username = pickRandom(WORD_LISTS.professionalPrefixes);
        if (includeSymbols) username += '_';
        username += pickRandom(WORD_LISTS.adjectives);
      } else {
        username = pickRandom(WORD_LISTS.adjectives) + pickRandom(WORD_LISTS.professionalSuffixes);
      }
      break;
    }
    case 'random':
    default: {
      const patterns = [
        () => pickRandom(WORD_LISTS.adjectives) + pickRandom(WORD_LISTS.nouns),
        () => pickRandom(WORD_LISTS.nouns) + pickRandom(WORD_LISTS.adjectives),
        () => pickRandom(WORD_LISTS.gamerPrefixes) + pickRandom(WORD_LISTS.nouns),
        () => pickRandom(WORD_LISTS.adjectives) + pickRandom(WORD_LISTS.gamerSuffixes),
      ];
      username = pickRandom(patterns)();
      break;
    }
  }

  if (includeNumbers) {
    const numberOptions = [
      () => String(getSecureRandomInt(100)),
      () => String(getSecureRandomInt(1000)),
      () => String(1990 + getSecureRandomInt(35)),
    ];
    username += pickRandom(numberOptions)();
  }

  if (username.length > maxLength) {
    username = username.slice(0, maxLength);
  }

  return username;
}

export function UsernameGenerator() {
  const { locale } = useI18n();
  const t = getUsernameGeneratorTranslations(locale);

  const [usernames, setUsernames] = useState<string[]>([]);
  const [style, setStyle] = useState<Style>('random');
  const [count, setCount] = useState(10);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [maxLength, setMaxLength] = useState(20);

  const handleGenerate = () => {
    const generated: string[] = [];
    const seen = new Set<string>();

    while (generated.length < count && seen.size < count * 10) {
      const username = generateUsername(style, includeNumbers, includeSymbols, maxLength);
      const key = username.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        generated.push(username);
      }
    }

    setUsernames(generated);
  };

  const handleCopyOne = async (username: string) => {
    await navigator.clipboard.writeText(username);
    toast.success(t.copied);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(usernames.join('\n'));
    toast.success(t.copied);
  };

  const handleClear = () => {
    setUsernames([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-hub-muted mb-4">{t.options}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Style */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.style}</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as Style)}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            >
              <option value="random">{t.styleRandom}</option>
              <option value="gamer">{t.styleGamer}</option>
              <option value="cool">{t.styleCool}</option>
              <option value="funny">{t.styleFunny}</option>
              <option value="professional">{t.styleProfessional}</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.count}</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              min={1}
              max={50}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>

          {/* Max Length */}
          <div>
            <label className="block text-sm text-hub-muted mb-1">{t.maxLength}</label>
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(Math.max(6, Math.min(30, parseInt(e.target.value) || 20)))}
              min={6}
              max={30}
              className="w-full bg-hub-darker border border-hub-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-hub-accent"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-hub-border">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.includeNumbers}
          </label>
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded border-hub-border bg-hub-darker accent-hub-accent"
            />
            {t.includeSymbols}
          </label>
        </div>
      </div>

      {/* Output */}
      <div>
        <label className="block text-sm font-medium text-hub-muted mb-2">{t.outputLabel}</label>
        {usernames.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {usernames.map((username, index) => (
              <button
                key={index}
                onClick={() => handleCopyOne(username)}
                className="bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-white font-mono text-sm text-left hover:border-hub-accent/50 hover:bg-hub-card transition-colors"
              >
                {username}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-hub-darker border border-hub-border rounded-lg p-8 text-center text-hub-muted">
            {t.placeholder}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
        >
          {t.generateButton}
        </button>
        <button
          onClick={handleCopyAll}
          disabled={usernames.length === 0}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.copyButton}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearButton}
        </button>
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
