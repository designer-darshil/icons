import type { Icon } from "@/types/icon";
import type { FilterState } from "@/types/filters";
import { searchIconsWithScore } from "./icon-search";

export function filterAndSortIcons(icons: Icon[], filters: FilterState): Icon[] {
  let result = [...icons];

  // 1. Search Query
  if (filters.query && filters.query.trim()) {
    result = searchIconsWithScore(result, filters.query);
  }

  // 2. Category Filter
  if (filters.category && filters.category !== "all" && filters.category !== "All Categories") {
    const filterCatSlug = filters.category.toLowerCase().replace(/\s+/g, '-');
    result = result.filter((icon) => {
      const iconPrimarySlug = (icon.primaryCategory || icon.category || '').toLowerCase().replace(/\s+/g, '-');
      const iconSecondaries = (icon.secondaryCategories || []).map((s) => s.toLowerCase().replace(/\s+/g, '-'));
      return (
        iconPrimarySlug === filterCatSlug ||
        iconSecondaries.includes(filterCatSlug) ||
        icon.category.toLowerCase() === filters.category.toLowerCase()
      );
    });
  }

  // 3. Style Filter
  if (filters.style && filters.style !== "all" && filters.style !== "All Styles") {
    result = result.filter((icon) =>
      icon.variants.some((v) => v.style.toLowerCase() === filters.style.toLowerCase())
    );
  }

  // 4. Tag Filter
  if (filters.tag) {
    const tagLower = filters.tag.toLowerCase();
    result = result.filter((icon) =>
      icon.tags.some((t) => t.toLowerCase() === tagLower)
    );
  }

  // 5. Stroke Weight Filter
  if (filters.strokeWeight && filters.strokeWeight !== "all") {
    if (filters.strokeWeight === "bold") {
      result = result.filter((icon) =>
        icon.variants.some((v) => (v.defaultStrokeWidth ?? 2) >= 2.5)
      );
    } else if (filters.strokeWeight === "regular") {
      result = result.filter((icon) =>
        icon.variants.some((v) => (v.defaultStrokeWidth ?? 2) < 2.5)
      );
    } else if (filters.strokeWeight === "stroke-only") {
      result = result.filter((icon) =>
        icon.variants.some((v) => v.supportsStroke)
      );
    }
  }

  // 6. Sorting (if not overridden by search score)
  if (!filters.query) {
    if (filters.sort === "popular") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (filters.sort === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
    }
  }

  return result;
}
