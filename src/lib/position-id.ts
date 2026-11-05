// Position ids double as Firestore document ids and as the first URL segment
// (`/[position]`), so they must be lowercase, URL-safe slugs.

// Top-level routes that a position slug would be shadowed by.
const RESERVED_IDS = new Set(["admin", "api"]);

const MAX_ID_LENGTH = 100;

/** "  Web Developer! " -> "web-developer". Keeps letters, digits and hyphens. */
export function normalizePositionId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // anything else -> hyphen
    .replace(/^-+|-+$/g, "") // no leading/trailing hyphens
    .slice(0, MAX_ID_LENGTH)
    .replace(/-+$/g, "");
}

/** Auto-generated id from a position name (kebab-case). */
export function generatePositionId(name: string): string {
  return normalizePositionId(name);
}

/**
 * The id that will be saved: the custom id (normalized) when provided,
 * otherwise one generated from the name.
 */
export function resolvePositionId(customId: string, name: string): string {
  return normalizePositionId(customId) || generatePositionId(name);
}

/** Returns an error message, or null when the id can be used. */
export function validatePositionId(id: string): string | null {
  if (!id) return "Enter a name or an ID to generate a valid position ID.";
  if (RESERVED_IDS.has(id)) return `"${id}" is reserved and can't be used.`;
  return null;
}
