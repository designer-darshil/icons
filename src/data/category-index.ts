/**
 * CATEGORY INDEX ENGINE
 *
 * Precomputes bidirectional indices between icons and the 44 official categories.
 * Ensures zero-cost lookups during runtime and dynamic derived counts.
 */

import type { Icon } from '@/types/icon';
import {
  OFFICIAL_CATEGORIES,
  normalizeCategorySlug,
  type CanonicalCategoryDefinition,
} from './category-registry';

export interface CategoryMembership {
  primaryCategory: string; // canonical slug
  secondaryCategories: string[]; // canonical slugs
  allCategories: string[]; // unique union of primary + secondary slugs
}

export interface CategoryWithCount extends CanonicalCategoryDefinition {
  iconCount: number;
}

export interface CategoryAuditStats {
  totalCategories: number;
  totalIcons: number;
  assignedIcons: number;
  uncategorizedCount: number;
  otherCount: number;
  manualReviewRequiredCount: number;
  duplicateAssignmentCount: number;
  missingVariantCount: number;
  categoryBreakdown: {
    category: CanonicalCategoryDefinition;
    count: number;
    validatedCount: number;
    reviewCount: number;
  }[];
}

export class CategoryIndex {
  private icons: Icon[] = [];
  private iconMap: Map<string, Icon> = new Map();
  private categoryToIconIds: Map<string, Set<string>> = new Map();
  private iconToCategories: Map<string, CategoryMembership> = new Map();
  private categoryCounts: Map<string, number> = new Map();

  constructor(icons: Icon[] = []) {
    this.reindex(icons);
  }

  public reindex(icons: Icon[]) {
    this.icons = icons;
    this.iconMap.clear();
    this.categoryToIconIds.clear();
    this.iconToCategories.clear();
    this.categoryCounts.clear();

    // Initialize all official categories with empty sets
    for (const cat of OFFICIAL_CATEGORIES) {
      this.categoryToIconIds.set(cat.slug, new Set<string>());
      this.categoryCounts.set(cat.slug, 0);
    }

    // Index each icon
    for (const icon of icons) {
      this.iconMap.set(icon.id, icon);

      // Resolve primary category
      const primarySlug = normalizeCategorySlug(
        icon.primaryCategory || icon.category || 'other'
      );

      // Resolve secondary categories
      const secondarySlugs = (icon.secondaryCategories || [])
        .map((s) => normalizeCategorySlug(s))
        .filter((s) => s !== primarySlug);

      const allSlugs = Array.from(new Set([primarySlug, ...secondarySlugs]));

      this.iconToCategories.set(icon.id, {
        primaryCategory: primarySlug,
        secondaryCategories: secondarySlugs,
        allCategories: allSlugs,
      });

      // Add to category buckets
      for (const slug of allSlugs) {
        if (!this.categoryToIconIds.has(slug)) {
          this.categoryToIconIds.set(slug, new Set<string>());
        }
        this.categoryToIconIds.get(slug)!.add(icon.id);
      }
    }

    // Compute derived counts
    for (const cat of OFFICIAL_CATEGORIES) {
      const set = this.categoryToIconIds.get(cat.slug);
      this.categoryCounts.set(cat.slug, set ? set.size : 0);
    }
  }

  /**
   * Get all official categories with their dynamically derived counts in canonical order.
   */
  public getCategoriesWithCounts(): CategoryWithCount[] {
    return OFFICIAL_CATEGORIES.map((cat) => ({
      ...cat,
      iconCount: this.categoryCounts.get(cat.slug) || 0,
    }));
  }

  /**
   * Get dynamic count for a specific category by slug or name.
   */
  public getCount(categorySlugOrName: string): number {
    const slug = normalizeCategorySlug(categorySlugOrName);
    return this.categoryCounts.get(slug) || 0;
  }

  /**
   * Get all icons belonging to a category (both primary and secondary).
   */
  public getIconsByCategory(categorySlugOrName: string): Icon[] {
    const slug = normalizeCategorySlug(categorySlugOrName);
    const iconIds = this.categoryToIconIds.get(slug);
    if (!iconIds) return [];

    const result: Icon[] = [];
    for (const id of iconIds) {
      const icon = this.iconMap.get(id);
      if (icon) result.push(icon);
    }
    return result;
  }

  /**
   * Get membership details for a specific icon.
   */
  public getIconMembership(iconId: string): CategoryMembership | undefined {
    return this.iconToCategories.get(iconId);
  }

  /**
   * Generates a comprehensive QA Audit & Coverage report.
   */
  public generateAuditReport(): CategoryAuditStats {
    let uncategorized = 0;
    let otherCount = 0;
    let manualReview = 0;
    let duplicateAssignments = 0;
    let missingVariants = 0;

    for (const icon of this.icons) {
      const membership = this.iconToCategories.get(icon.id);
      if (!membership || membership.allCategories.length === 0) {
        uncategorized++;
      } else {
        if (membership.primaryCategory === 'other' || icon.otherReviewRequired) {
          otherCount++;
          manualReview++;
        }
      }

      // Check variant completeness (must have canonical regular variant with valid SVG)
      const variants = icon.variants || [];
      const hasRegular = variants.some((v) => v.style === 'regular' && Boolean(v.svg));
      if (!hasRegular) {
        missingVariants++;
      }
    }

    const categoryBreakdown = OFFICIAL_CATEGORIES.map((cat) => {
      const iconsInCat = this.getIconsByCategory(cat.slug);
      let validated = 0;
      let review = 0;

      for (const icon of iconsInCat) {
        const variants = icon.variants || [];
        const hasRegular = variants.some((v) => v.style === 'regular' && Boolean(v.svg));
        if (hasRegular && !icon.otherReviewRequired) {
          validated++;
        } else {
          review++;
        }
      }

      return {
        category: cat,
        count: iconsInCat.length,
        validatedCount: validated,
        reviewCount: review,
      };
    });

    return {
      totalCategories: OFFICIAL_CATEGORIES.length,
      totalIcons: this.icons.length,
      assignedIcons: this.icons.length - uncategorized,
      uncategorizedCount: uncategorized,
      otherCount,
      manualReviewRequiredCount: manualReview,
      duplicateAssignmentCount: duplicateAssignments,
      missingVariantCount: missingVariants,
      categoryBreakdown,
    };
  }
}
