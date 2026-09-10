import { MOCK_ICONS } from "@/data/icons/mock-icons";
import type { Icon } from "@/types/icon";

/**
 * Finds sibling icons for previous/next navigation within a given subset or the full catalog.
 */
export function getSiblingIcons(
  currentId: string,
  icons: Icon[] = MOCK_ICONS
): { prev: Icon | null; next: Icon | null; index: number; total: number } {
  const index = icons.findIndex((i) => i.id === currentId || i.slug === currentId);
  if (index === -1) {
    return { prev: null, next: null, index: -1, total: icons.length };
  }

  const prev = index > 0 ? icons[index - 1] : icons[icons.length - 1];
  const next = index < icons.length - 1 ? icons[index + 1] : icons[0];

  return { prev, next, index, total: icons.length };
}

/**
 * Resolves related icons by explicit relatedIconIds or fallback matching same category.
 */
export function getRelatedIcons(
  icon: Icon,
  allIcons: Icon[] = MOCK_ICONS,
  limit: number = 6
): Icon[] {
  if (icon.relatedIconIds && icon.relatedIconIds.length > 0) {
    const relatedSet = new Set(icon.relatedIconIds);
    const matches = allIcons.filter((i) => relatedSet.has(i.id) && i.id !== icon.id);
    if (matches.length >= limit) return matches.slice(0, limit);
  }

  // Fallback: match same category and shared tags
  const sameCategory = allIcons.filter(
    (i) => i.id !== icon.id && i.category === icon.category
  );

  return sameCategory.slice(0, limit);
}
