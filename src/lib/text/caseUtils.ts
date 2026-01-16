// Case conversion utilities

/**
 * Split string into words, handling camelCase, PascalCase, snake_case, kebab-case, etc.
 */
export function toWords(str: string): string[] {
  return str
    // Insert space before uppercase letters in camelCase/PascalCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores, hyphens, dots with spaces
    .replace(/[_\-./]+/g, ' ')
    // Split by spaces and filter empty
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.toLowerCase());
}

export function toCamelCase(str: string): string {
  const words = toWords(str);
  return words
    .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toPascalCase(str: string): string {
  return toWords(str)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toSnakeCase(str: string): string {
  return toWords(str).join('_');
}

export function toConstantCase(str: string): string {
  return toWords(str).join('_').toUpperCase();
}

export function toKebabCase(str: string): string {
  return toWords(str).join('-');
}

export function toDotCase(str: string): string {
  return toWords(str).join('.');
}

export function toPathCase(str: string): string {
  return toWords(str).join('/');
}

export function toTitleCase(str: string): string {
  return toWords(str)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toSentenceCase(str: string): string {
  const words = toWords(str);
  if (words.length === 0) return '';
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) +
    (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

export function toAlternatingCase(str: string): string {
  return str
    .split('')
    .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
    .join('');
}

export function toReverseText(str: string): string {
  return str.split('').reverse().join('');
}

export type CaseType =
  | 'lowercase'
  | 'uppercase'
  | 'camelCase'
  | 'pascalCase'
  | 'snake_case'
  | 'CONSTANT_CASE'
  | 'kebab-case'
  | 'dot.case'
  | 'path/case'
  | 'Title Case'
  | 'Sentence case'
  | 'aLtErNaTiNg'
  | 'reversed';

export function convertCase(str: string, caseType: CaseType): string {
  switch (caseType) {
    case 'lowercase': return toLowerCase(str);
    case 'uppercase': return toUpperCase(str);
    case 'camelCase': return toCamelCase(str);
    case 'pascalCase': return toPascalCase(str);
    case 'snake_case': return toSnakeCase(str);
    case 'CONSTANT_CASE': return toConstantCase(str);
    case 'kebab-case': return toKebabCase(str);
    case 'dot.case': return toDotCase(str);
    case 'path/case': return toPathCase(str);
    case 'Title Case': return toTitleCase(str);
    case 'Sentence case': return toSentenceCase(str);
    case 'aLtErNaTiNg': return toAlternatingCase(str);
    case 'reversed': return toReverseText(str);
    default: return str;
  }
}

export const CASE_TYPES: CaseType[] = [
  'lowercase',
  'uppercase',
  'camelCase',
  'pascalCase',
  'snake_case',
  'CONSTANT_CASE',
  'kebab-case',
  'dot.case',
  'path/case',
  'Title Case',
  'Sentence case',
  'aLtErNaTiNg',
  'reversed',
];
