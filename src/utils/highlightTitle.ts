export type HighlightSegment = { text: string; highlight: boolean };

const minorHeadingWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'with']);
const brandHeadingWords: Record<string, string> = { easypm: 'EasyPM', k9: 'K9', pa: 'PA', zip: 'ZIP', faq: 'FAQ', aprehend: 'Aprehend' };

export function titleCaseHeading(value?: string): string {
  if (!value) return '';
  const token = /[A-Za-z][A-Za-z0-9]*(?:['’][A-Za-z]+)?/g;
  const words = value.match(token) ?? [];
  let position = 0;
  return value.replace(token, (word) => {
    const current = position++;
    const [base, suffix] = word.split(/(?=['’])/);
    const lower = base.toLowerCase();
    const normalized = brandHeadingWords[lower] ?? (current > 0 && current < words.length - 1 && minorHeadingWords.has(lower)
      ? lower
      : lower[0].toUpperCase() + lower.slice(1));
    return normalized + (suffix ? suffix.toLowerCase() : '');
  });
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function splitHighlight(text?: string, highlight?: string): HighlightSegment[] {
  if (!text) return [];
  if (!highlight) return [{ text, highlight: false }];

  const trimmed = highlight.trim();
  if (!trimmed) return [{ text, highlight: false }];

  const pattern = new RegExp(`(${escapeRegex(trimmed)})`, 'gi');
  const segments = text.split(pattern).filter(Boolean);

  return segments.map((segment) => ({
    text: segment,
    highlight: segment.toLowerCase() === trimmed.toLowerCase()
  }));
}
