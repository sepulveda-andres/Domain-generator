/**
 * Validates if a domain name is valid
 */
export function isValidDomain(domain: string): boolean {
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

/**
 * Sanitizes a string to make it domain-safe
 */
export function sanitizeDomainName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 63); // Max domain label length
}

/**
 * Formats a domain for display
 */
export function formatDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

/**
 * Extracts TLD from domain
 */
export function extractTLD(domain: string): string {
  const parts = domain.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}

/**
 * Gets domain without TLD
 */
export function getDomainWithoutTLD(domain: string): string {
  const parts = domain.split('.');
  return parts.slice(0, -1).join('.');
}
