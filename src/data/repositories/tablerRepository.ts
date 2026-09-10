/**
 * Tabler Icon Repository Implementation
 * Fast indexed repository for the 6,000+ Tabler Icons catalog.
 */

import { GRIDFRAME_ICONS } from '../icons/gridframe-catalog';
import type { Icon, IconRepository, IconStyle } from '@/types/icon';
import { searchIconsWithScore } from '@/lib/icon-search';

export class TablerIconRepository implements IconRepository {
  private icons: Icon[] = GRIDFRAME_ICONS;
  private idMap: Map<string, Icon> = new Map();
  private slugMap: Map<string, Icon> = new Map();
  private categoryMap: Map<string, Icon[]> = new Map();
  private styleMap: Map<string, Icon[]> = new Map();

  constructor() {
    for (const icon of this.icons) {
      this.idMap.set(icon.id, icon);
      this.slugMap.set(icon.slug.toLowerCase(), icon);

      const catLower = icon.category.toLowerCase();
      if (!this.categoryMap.has(catLower)) {
        this.categoryMap.set(catLower, []);
      }
      this.categoryMap.get(catLower)!.push(icon);

      for (const variant of icon.variants) {
        const styleLower = variant.style.toLowerCase();
        if (!this.styleMap.has(styleLower)) {
          this.styleMap.set(styleLower, []);
        }
        this.styleMap.get(styleLower)!.push(icon);
      }
    }
  }

  async getAll(): Promise<Icon[]> {
    return [...this.icons];
  }

  async getById(id: string): Promise<Icon | undefined> {
    return this.idMap.get(id);
  }

  async getBySlug(slug: string): Promise<Icon | undefined> {
    return this.slugMap.get(slug.toLowerCase());
  }

  async getByIds(ids: string[]): Promise<Icon[]> {
    const results: Icon[] = [];
    for (const id of ids) {
      const icon = this.idMap.get(id);
      if (icon) results.push(icon);
    }
    return results;
  }

  async getByCategory(category: string): Promise<Icon[]> {
    if (!category || category === 'all' || category.toLowerCase() === 'all categories') {
      return [...this.icons];
    }
    return this.categoryMap.get(category.toLowerCase()) || [];
  }

  async getByStyle(style: IconStyle): Promise<Icon[]> {
    if (!style || style === 'outline' || style === 'linear') {
      return [...this.icons];
    }
    return this.styleMap.get(style.toLowerCase()) || [];
  }

  async search(
    query: string,
    options?: { category?: string; style?: IconStyle }
  ): Promise<Icon[]> {
    let dataset = this.icons;

    if (options?.category && options.category !== 'all') {
      const catLower = options.category.toLowerCase();
      dataset = this.categoryMap.get(catLower) || [];
    }

    if (options?.style && options.style !== 'outline' && options.style !== 'linear') {
      const styleLower = options.style.toLowerCase();
      dataset = dataset.filter((i) => i.variants.some((v) => v.style.toLowerCase() === styleLower));
    }

    if (!query.trim()) {
      return dataset;
    }

    return searchIconsWithScore(dataset, query);
  }

  async getRelated(iconId: string): Promise<Icon[]> {
    const icon = this.idMap.get(iconId);
    if (!icon || !icon.relatedIconIds || icon.relatedIconIds.length === 0) {
      return [];
    }
    return this.getByIds(icon.relatedIconIds);
  }

  async getCategories(): Promise<string[]> {
    return Array.from(this.categoryMap.keys()).sort();
  }

  async getStyles(): Promise<string[]> {
    return ['outline', 'filled'];
  }
}

export const tablerRepository = new TablerIconRepository();
