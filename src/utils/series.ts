// D-23: series slug → display name (Title Case, known acronyms uppercased)
const KNOWN_ACRONYMS = new Set([
  'LLM', 'ML', 'CS', 'API', 'HTTP', 'DNS', 'TLS', 'TCP', 'IP', 'CPU',
]);

export function seriesDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((word) => {
      const upper = word.toUpperCase();
      return KNOWN_ACRONYMS.has(upper)
        ? upper
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
