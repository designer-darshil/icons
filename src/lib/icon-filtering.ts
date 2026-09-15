import type { Icon } from '@/types/icon';
import type { FilterState } from '@/types/filters';
import { searchIconsWithScore } from './icon-search';
import { normalizeCategorySlug, LEGACY_CATEGORY_ALIASES } from '@/data/category-registry';

export interface FilterOptions {
  favoriteIds?: Set<string> | string[];
  collectionIconIds?: Set<string> | string[];
  includeDrafts?: boolean;
}

/**
 * Filter and sort conceptual icons with full multi-dimensional support.
 * Guarantees: ONE conceptual icon per result.
 */
export function filterAndSortIcons(
  icons: Icon[],
  filters: Partial<FilterState>,
  options?: FilterOptions
): Icon[] {
  let result = [...icons];

  // 0. Status Filter (Exclude drafts & archived icons by default for public views)
  if (!options?.includeDrafts) {
    result = result.filter((icon) => {
      const status = (icon as { status?: string }).status;
      return !status || status === 'published';
    });
  }

  // 1. Search Query (Multi-tier relevance + fuzzy matching)
  if (filters.query && filters.query.trim()) {
    result = searchIconsWithScore(result, filters.query);
  }

  // 2. Category Filter (with canonical normalization & alias support)
  if (filters.category && filters.category !== 'all' && filters.category !== 'All Categories' && filters.category !== 'ALL') {
    const rawCategory = filters.category.trim().toLowerCase();
    const normalizedFilterSlug = normalizeCategorySlug(rawCategory);
    const filterCatSlug = rawCategory.replace(/\s+/g, '-').replace(/_/g, '-');

    result = result.filter((icon) => {
      const iconPrimarySlug = (icon.primaryCategory || icon.category || '').toLowerCase().replace(/\s+/g, '-');
      const iconSecondaries = (icon.secondaryCategories || []).map((s) => s.toLowerCase().replace(/\s+/g, '-'));
      const iconNormalizedPrimary = normalizeCategorySlug(icon.primaryCategory || icon.category || '');
      const iconNormalizedSecondaries = (icon.secondaryCategories || []).map((s) => normalizeCategorySlug(s));
      const iconCategoryNameLower = (icon.category || '').toLowerCase();

      // Check direct slug match, normalized canonical match, secondary matches, or legacy alias matches
      return (
        iconPrimarySlug === filterCatSlug ||
        iconNormalizedPrimary === normalizedFilterSlug ||
        iconSecondaries.includes(filterCatSlug) ||
        iconNormalizedSecondaries.includes(normalizedFilterSlug) ||
        iconCategoryNameLower === rawCategory ||
        LEGACY_CATEGORY_ALIASES[filterCatSlug] === iconNormalizedPrimary ||
        LEGACY_CATEGORY_ALIASES[iconPrimarySlug] === normalizedFilterSlug
      );
    });
  }

  // 3. Style / Variant Filter (Must contain the specified style)
  if (filters.style && filters.style !== 'all' && filters.style !== 'All Styles') {
    const styleLower = filters.style.toLowerCase();
    result = result.filter((icon) =>
      icon.variants.some((v) => v.style.toLowerCase() === styleLower)
    );
  }

  // 4. Favorites Filter
  if (filters.onlyFavorites) {
    const favSet = options?.favoriteIds instanceof Set
      ? options.favoriteIds
      : new Set(options?.favoriteIds || []);
    result = result.filter((icon) => favSet.has(icon.id) || favSet.has(icon.slug));
  }

  // 5. Collection Filter
  if (filters.collectionId && options?.collectionIconIds) {
    const colSet = options.collectionIconIds instanceof Set
      ? options.collectionIconIds
      : new Set(options.collectionIconIds);
    result = result.filter((icon) => colSet.has(icon.id) || colSet.has(icon.slug));
  }

  // 6. Tag Filter
  if (filters.tag) {
    const tagLower = filters.tag.toLowerCase();
    result = result.filter((icon) =>
      icon.tags.some((t) => t.toLowerCase() === tagLower)
    );
  }

  // 7. Stroke Weight Filter
  if (filters.strokeWeight && filters.strokeWeight !== 'all') {
    if (filters.strokeWeight === 'bold') {
      result = result.filter((icon) =>
        icon.variants.some((v) => (v.defaultStrokeWidth ?? 2) >= 2.5)
      );
    } else if (filters.strokeWeight === 'regular') {
      result = result.filter((icon) =>
        icon.variants.some((v) => (v.defaultStrokeWidth ?? 2) < 2.5)
      );
    } else if (filters.strokeWeight === 'stroke-only') {
      result = result.filter((icon) =>
        icon.variants.some((v) => v.supportsStroke)
      );
    }
  }

  // 8. Sorting (Applied when query is empty, preserving relevance when searching)
  if (!filters.query || !filters.query.trim()) {
    if (filters.sort === 'popular') {
      const getScore = (icon: Icon) => {
        if (typeof icon.popularity === 'number') return icon.popularity;
        return 100;
      };
      // When scores tie, break ties alphabetically by name for seamless catalog discovery
      result.sort((a, b) => (getScore(b) - getScore(a)) || a.name.localeCompare(b.name));
    } else if (filters.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sort === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
    }
  }

  return result;
}
