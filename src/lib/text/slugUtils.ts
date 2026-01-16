// Slug generation utilities

// Common transliteration map for Cyrillic and other characters
const TRANSLITERATION_MAP: Record<string, string> = {
  // Russian Cyrillic
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  // Ukrainian additions
  'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g',
  // German
  'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
  // French
  'à': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'î': 'i', 'ï': 'i', 'ô': 'o', 'ù': 'u', 'û': 'u', 'ç': 'c',
  // Spanish
  'ñ': 'n', 'á': 'a', 'í': 'i', 'ó': 'o', 'ú': 'u',
  // Polish
  'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ś': 's', 'ź': 'z', 'ż': 'z',
  // Czech
  'ř': 'r', 'ů': 'u', 'ď': 'd', 'ť': 't', 'ň': 'n',
};

// Common stop words to optionally remove
export const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'it', 'its',
  // Russian
  'и', 'в', 'на', 'с', 'по', 'для', 'из', 'за', 'к', 'от', 'о', 'об',
  'при', 'до', 'после', 'над', 'под', 'между', 'через', 'без',
  'а', 'но', 'или', 'что', 'как', 'это', 'все', 'так', 'уже',
]);

export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  maxLength?: number;
  removeStopWords?: boolean;
  transliterate?: boolean;
  trim?: boolean;
}

export function transliterate(text: string): string {
  let result = '';
  for (const char of text.toLowerCase()) {
    result += TRANSLITERATION_MAP[char] || char;
  }
  return result;
}

export function slugify(text: string, options: SlugOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    maxLength = 0,
    removeStopWords = false,
    transliterate: shouldTransliterate = true,
    trim = true,
  } = options;

  let result = text;

  // Transliterate non-ASCII characters
  if (shouldTransliterate) {
    result = transliterate(result);
  }

  // Convert to lowercase
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Remove stop words
  if (removeStopWords) {
    const words = result.split(/\s+/);
    result = words.filter(word => !STOP_WORDS.has(word.toLowerCase())).join(' ');
  }

  // Replace non-alphanumeric characters with separator
  result = result
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, separator)
    .replace(new RegExp(`${separator}+`, 'g'), separator);

  // Trim separator from start and end
  if (trim) {
    result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
  }

  // Apply max length
  if (maxLength > 0 && result.length > maxLength) {
    result = result.substring(0, maxLength);
    // Don't cut in the middle of a word
    const lastSep = result.lastIndexOf(separator);
    if (lastSep > maxLength * 0.5) {
      result = result.substring(0, lastSep);
    }
  }

  return result;
}

export function generateSlugVariants(text: string): Record<string, string> {
  return {
    'kebab-case': slugify(text, { separator: '-' }),
    'snake_case': slugify(text, { separator: '_' }),
    'dot.case': slugify(text, { separator: '.' }),
    'no-separator': slugify(text, { separator: '' }),
    'with-stop-words-removed': slugify(text, { removeStopWords: true }),
  };
}
