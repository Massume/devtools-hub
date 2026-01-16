// Text statistics utilities

export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  avgWordLength: number;
  longestWord: string;
  shortestWord: string;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

export function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function countSentences(text: string): number {
  // Split by sentence-ending punctuation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length;
}

export function countParagraphs(text: string): number {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return Math.max(paragraphs.length, text.trim() ? 1 : 0);
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split('\n').length;
}

export function getWords(text: string): string[] {
  return text.toLowerCase().match(/[a-zA-Zа-яА-ЯёЁ]+/g) || [];
}

export function calculateAvgWordLength(text: string): number {
  const words = getWords(text);
  if (words.length === 0) return 0;
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

export function getLongestWord(text: string): string {
  const words = getWords(text);
  if (words.length === 0) return '';
  return words.reduce((longest, word) => word.length > longest.length ? word : longest, '');
}

export function getShortestWord(text: string): string {
  const words = getWords(text);
  if (words.length === 0) return '';
  return words.reduce((shortest, word) => word.length < shortest.length ? word : shortest, words[0]);
}

// Average reading speed: 200-250 WPM
export function calculateReadingTime(wordCount: number, wpm: number = 200): number {
  return wordCount / wpm;
}

// Average speaking speed: 125-150 WPM
export function calculateSpeakingTime(wordCount: number, wpm: number = 150): number {
  return wordCount / wpm;
}

export function getWordFrequency(text: string, limit: number = 20): Map<string, number> {
  const words = getWords(text);
  const frequency = new Map<string, number>();

  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  // Sort by frequency and limit
  const sorted = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return new Map(sorted);
}

export function getCharFrequency(text: string, limit: number = 20): Map<string, number> {
  const chars = text.toLowerCase().replace(/\s/g, '').split('');
  const frequency = new Map<string, number>();

  for (const char of chars) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  const sorted = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return new Map(sorted);
}

export function calculateStatistics(text: string): TextStatistics {
  const wordCount = countWords(text);

  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    words: wordCount,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    avgWordLength: calculateAvgWordLength(text),
    longestWord: getLongestWord(text),
    shortestWord: getShortestWord(text),
    readingTimeMinutes: calculateReadingTime(wordCount),
    speakingTimeMinutes: calculateSpeakingTime(wordCount),
  };
}
