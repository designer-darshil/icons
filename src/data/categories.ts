import { GRIDFRAME_ICONS } from './icons/gridframe-catalog';
import type { Icon } from '@/types/icon';
import {
  OFFICIAL_CATEGORIES,
  CATEGORY_BY_SLUG,
  normalizeCategorySlug,
  getCanonicalCategory,
} from './category-registry';
import { CategoryIndex } from './category-index';

export interface CategoryMetadata {
  id: string; // canonical slug
  name: string;
  slug: string;
  description: string;
  count: number;
  order: number;
  iconId: string;
}

// Global canonical category index initialized with the main catalog
export const canonicalCategoryIndex = new CategoryIndex(GRIDFRAME_ICONS);

/**
 * Returns the official list of 44 categories with dynamically computed icon counts
 * in EXACT canonical prompt order (no alphabetical sorting, no count sorting).
 */
export function getOfficialCategories(icons: Icon[] = GRIDFRAME_ICONS): CategoryMetadata[] {
  const index = icons === GRIDFRAME_ICONS ? canonicalCategoryIndex : new CategoryIndex(icons);
  return index.getCategoriesWithCounts().map((c) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    description: c.description,
    count: c.iconCount,
    order: c.order,
    iconId: c.iconId,
  }));
}

export const ICON_CATEGORIES: CategoryMetadata[] = getOfficialCategories(GRIDFRAME_ICONS);

/**
 * Returns dynamic category counts mapped by slug and lowercase name.
 */
export function getCategoryCounts(icons: Icon[] = GRIDFRAME_ICONS): Record<string, number> {
  const categories = getOfficialCategories(icons);
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat.slug] = cat.count;
    counts[cat.name.toLowerCase()] = cat.count;
  }
  return counts;
}

/**
 * Retrieves metadata for a category by its slug or name.
 */
export function getCategoryMetadata(categoryIdOrName: string, icons: Icon[] = GRIDFRAME_ICONS): CategoryMetadata | undefined {
  if (!categoryIdOrName) return undefined;
  const slug = normalizeCategorySlug(categoryIdOrName);
  const canonical = CATEGORY_BY_SLUG.get(slug);
  if (!canonical) return undefined;

  const count = icons === GRIDFRAME_ICONS
    ? canonicalCategoryIndex.getCount(slug)
    : new CategoryIndex(icons).getCount(slug);

  return {
    id: canonical.slug,
    slug: canonical.slug,
    name: canonical.name,
    description: canonical.description,
    count,
    order: canonical.order,
    iconId: canonical.iconId,
  };
}

export {
  OFFICIAL_CATEGORIES,
  CATEGORY_BY_SLUG,
  normalizeCategorySlug,
  getCanonicalCategory,
  CategoryIndex,
};

