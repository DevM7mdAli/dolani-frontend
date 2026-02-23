/**
 * Extract initials from a name, stripping common academic prefixes.
 * e.g. "Dr. Mohammed Al-Otaibi" → "MA", "أ. مامون عبدالقادر" → "مع"
 */
export function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.|أ\.|د\.)\s*/i, '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
