// Text extraction utilities with regex patterns

export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
export const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
export const IP_V4_REGEX = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
export const IP_V6_REGEX = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}:|\b(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\b/g;
export const PHONE_REGEX = /[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}/g;
export const NUMBER_REGEX = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
export const HASHTAG_REGEX = /#[a-zA-Z0-9_]+/g;
export const MENTION_REGEX = /@[a-zA-Z0-9_]+/g;
export const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;

export type ExtractType = 'emails' | 'urls' | 'ips' | 'phones' | 'numbers' | 'hashtags' | 'mentions' | 'colors';

export function extractEmails(text: string): string[] {
  return [...new Set(text.match(EMAIL_REGEX) || [])];
}

export function extractUrls(text: string): string[] {
  return [...new Set(text.match(URL_REGEX) || [])];
}

export function extractIps(text: string): string[] {
  const ipv4 = text.match(IP_V4_REGEX) || [];
  const ipv6 = text.match(IP_V6_REGEX) || [];
  return [...new Set([...ipv4, ...ipv6])];
}

export function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_REGEX) || [];
  // Filter out short matches that are likely not phone numbers
  return [...new Set(matches.filter(p => p.replace(/\D/g, '').length >= 7))];
}

export function extractNumbers(text: string): string[] {
  return [...new Set(text.match(NUMBER_REGEX) || [])];
}

export function extractHashtags(text: string): string[] {
  return [...new Set(text.match(HASHTAG_REGEX) || [])];
}

export function extractMentions(text: string): string[] {
  return [...new Set(text.match(MENTION_REGEX) || [])];
}

export function extractColors(text: string): string[] {
  return [...new Set(text.match(HEX_COLOR_REGEX) || [])];
}

export function extractByType(text: string, type: ExtractType): string[] {
  switch (type) {
    case 'emails': return extractEmails(text);
    case 'urls': return extractUrls(text);
    case 'ips': return extractIps(text);
    case 'phones': return extractPhones(text);
    case 'numbers': return extractNumbers(text);
    case 'hashtags': return extractHashtags(text);
    case 'mentions': return extractMentions(text);
    case 'colors': return extractColors(text);
    default: return [];
  }
}

export function extractByRegex(text: string, pattern: string, flags: string = 'g'): string[] {
  try {
    const regex = new RegExp(pattern, flags);
    return [...new Set(text.match(regex) || [])];
  } catch {
    return [];
  }
}
