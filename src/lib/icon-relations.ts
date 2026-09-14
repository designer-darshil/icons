import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import type { Icon } from '@/types/icon';

/**
 * Finds sibling icons for previous/next navigation within a given subset or the full catalog.
 */
export function getSiblingIcons(
  currentId: string,
  icons: Icon[] = GRIDFRAME_ICONS
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
 * Resolves conceptually related icons based on:
 * 1. Explicit relatedIconIds (if present)
 * 2. Shared family prefix (e.g. "shield-*", "user-*", "arrow-*")
 * 3. Shared tags & keywords intersection
 * 4. Primary/Secondary Category overlap
 *
 * Guarantees: Always returns unique conceptual icons, excluding self.
 */
export function getRelatedIcons(
  icon: Icon,
  allIcons: Icon[] = GRIDFRAME_ICONS,
  limit: number = 6
): Icon[] {
  if (!icon) return [];

  const results: Icon[] = [];
  const addedIds = new Set<string>([icon.id]);

  // 1. Explicit relatedIconIds
  if (icon.relatedIconIds && icon.relatedIconIds.length > 0) {
    for (const relId of icon.relatedIconIds) {
      const match = allIcons.find((i) => (i.id === relId || i.slug === relId) && !addedIds.has(i.id));
      if (match) {
        results.push(match);
        addedIds.add(match.id);
        if (results.length >= limit) return results;
      }
    }
  }

  // 2. Family prefix matching (e.g. "shield" in "shield-check" matches "shield-alert", "shield-xmark")
  const iconPrefix = icon.slug.split('-')[0];
  if (iconPrefix && iconPrefix.length >= 3) {
    const familyMatches = allIcons.filter(
      (i) =>
        !addedIds.has(i.id) &&
        (i.slug.startsWith(`${iconPrefix}-`) || i.family === icon.family || i.slug === iconPrefix)
    );
    for (const m of familyMatches) {
      results.push(m);
      addedIds.add(m.id);
      if (results.length >= limit) return results;
    }
  }

  // 3. Shared tags & keywords scoring
  const iconTags = new Set(icon.tags.map((t) => t.toLowerCase()));
  const iconKeywords = new Set(icon.keywords.map((k) => k.toLowerCase()));
  const iconCat = icon.category.toLowerCase();

  const candidates: { icon: Icon; score: number }[] = [];

  for (const candidate of allIcons) {
    if (addedIds.has(candidate.id)) continue;

    let score = 0;

    // Category match
    if (candidate.category.toLowerCase() === iconCat) {
      score += 20;
    }

    // Tag overlap
    for (const t of candidate.tags) {
      if (iconTags.has(t.toLowerCase())) {
        score += 15;
      }
    }

    // Keyword overlap
    for (const k of candidate.keywords) {
      if (iconKeywords.has(k.toLowerCase())) {
        score += 10;
      }
    }

    if (score > 0) {
      candidates.push({ icon: candidate, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  for (const c of candidates) {
    results.push(c.icon);
    addedIds.add(c.icon.id);
    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}
