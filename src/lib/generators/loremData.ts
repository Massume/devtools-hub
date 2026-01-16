// Lorem Ipsum word lists

export const LOREM_CLASSIC = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'nihil', 'corporis', 'suscipit',
  'laboriosam', 'aliquid', 'commodi', 'consequatur', 'autem', 'vel', 'eum',
  'iure', 'quam', 'eius', 'modi', 'tempora', 'quod', 'maxime', 'placeat', 'facere',
  'possimus', 'assumenda', 'repellendus', 'temporibus', 'quibusdam', 'officiis',
  'debitis', 'necessitatibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae',
  'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur', 'sapiente',
];

export const LOREM_HIPSTER = [
  'artisan', 'craft', 'authentic', 'sustainable', 'organic', 'vintage', 'retro',
  'bespoke', 'curated', 'handcrafted', 'locally-sourced', 'farm-to-table',
  'cold-pressed', 'single-origin', 'small-batch', 'ethical', 'vegan', 'gluten-free',
  'kale', 'quinoa', 'avocado', 'sriracha', 'kombucha', 'matcha', 'acai',
  'brooklyn', 'portland', 'austin', 'williamsburg', 'shoreditch', 'melbourne',
  'fixie', 'typewriter', 'vinyl', 'polaroid', 'letterpress', 'tattooed', 'bearded',
  'flannel', 'denim', 'leather', 'selvage', 'raw', 'distressed', 'minimalist',
  'aesthetic', 'instagram', 'pinterest', 'tumblr', 'etsy', 'kickstarter',
  'startup', 'disruption', 'innovation', 'synergy', 'paradigm', 'agile', 'lean',
  'coffeeshop', 'coworking', 'coliving', 'nomad', 'remote', 'freelance',
  'podcast', 'blog', 'vlog', 'influencer', 'content', 'storytelling', 'narrative',
  'mindfulness', 'wellness', 'self-care', 'meditation', 'yoga', 'breathwork',
  'microdosing', 'biohacking', 'nootropics', 'bulletproof', 'intermittent',
  'crossfit', 'peloton', 'soulcycle', 'barre', 'pilates', 'hiit', 'recovery',
  'sourdough', 'fermented', 'pickled', 'cured', 'smoked', 'charred', 'dehydrated',
];

export const LOREM_OFFICE = [
  'synergy', 'leverage', 'paradigm', 'bandwidth', 'scalable', 'proactive',
  'robust', 'streamline', 'optimize', 'holistic', 'innovative', 'cutting-edge',
  'best-practices', 'value-added', 'mission-critical', 'core-competency',
  'stakeholder', 'deliverable', 'milestone', 'roadmap', 'pipeline', 'runway',
  'action-item', 'takeaway', 'deep-dive', 'drill-down', 'level-set', 'touch-base',
  'circle-back', 'loop-in', 'ping', 'reach-out', 'follow-up', 'sync', 'align',
  'empower', 'incentivize', 'monetize', 'productize', 'operationalize',
  'actualize', 'catalyze', 'facilitate', 'implement', 'execute', 'deploy',
  'roi', 'kpi', 'okr', 'mvp', 'poc', 'saas', 'paas', 'iaas', 'b2b', 'b2c',
  'enterprise', 'ecosystem', 'vertical', 'horizontal', 'agile', 'waterfall',
  'sprint', 'scrum', 'kanban', 'retrospective', 'standup', 'backlog', 'velocity',
  'low-hanging-fruit', 'move-the-needle', 'think-outside-the-box', 'win-win',
  'game-changer', 'disruptor', 'thought-leader', 'evangelist', 'champion',
  'bandwidth', 'capacity', 'resources', 'headcount', 'burn-rate', 'runway',
  'pivot', 'iterate', 'validate', 'scale', 'growth-hack', 'viral', 'organic',
];

export type LoremStyle = 'classic' | 'hipster' | 'office';

export function getWordList(style: LoremStyle): string[] {
  switch (style) {
    case 'hipster': return LOREM_HIPSTER;
    case 'office': return LOREM_OFFICE;
    default: return LOREM_CLASSIC;
  }
}

function getRandomWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateWords(count: number, style: LoremStyle = 'classic', startWithLorem: boolean = false): string {
  const words = getWordList(style);
  const result: string[] = [];

  if (startWithLorem && style === 'classic') {
    result.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    count -= 5;
  }

  for (let i = 0; i < count; i++) {
    result.push(getRandomWord(words));
  }

  return result.join(' ');
}

export function generateSentence(style: LoremStyle = 'classic', minWords: number = 5, maxWords: number = 15): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = generateWords(wordCount, style).split(' ');
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

export function generateSentences(count: number, style: LoremStyle = 'classic', startWithLorem: boolean = false): string {
  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem && style === 'classic') {
      sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    } else {
      sentences.push(generateSentence(style));
    }
  }

  return sentences.join(' ');
}

export function generateParagraph(style: LoremStyle = 'classic', minSentences: number = 3, maxSentences: number = 7): string {
  const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  return generateSentences(sentenceCount, style);
}

export function generateParagraphs(count: number, style: LoremStyle = 'classic', startWithLorem: boolean = false): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem && style === 'classic') {
      paragraphs.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + generateParagraph(style));
    } else {
      paragraphs.push(generateParagraph(style));
    }
  }

  return paragraphs.join('\n\n');
}
