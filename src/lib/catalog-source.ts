import type { Icon } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';

const CATALOG_OVERRIDE_KEY = 'gridframe_admin_catalog_overrides_v1';
const CUSTOM_ICONS_KEY = 'gridframe_admin_custom_icons_v1';

/**
 * Returns the unified public catalog of icons.
 * Merges canonical GRIDFRAME_ICONS with custom uploaded icons and admin overrides,
 * excluding any icons marked as 'draft' or 'archived'.
 */
export function getPublicCatalogIcons(): Icon[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return GRIDFRAME_ICONS;
  }

  try {
    const overridesRaw = localStorage.getItem(CATALOG_OVERRIDE_KEY);
    const overrides: Record<string, Partial<Icon & { status?: string }>> = overridesRaw
      ? JSON.parse(overridesRaw)
      : {};

    const customIconsRaw = localStorage.getItem(CUSTOM_ICONS_KEY);
    const customIcons: (Icon & { status?: string })[] = customIconsRaw
      ? JSON.parse(customIconsRaw)
      : [];

    const publicCustom = customIcons.filter((i) => !i.status || i.status === 'published');

    const mergedBaseList: Icon[] = [];
    for (const baseIcon of GRIDFRAME_ICONS) {
      const override = overrides[baseIcon.slug] || overrides[baseIcon.id];
      if (override) {
        if (override.status === 'draft' || override.status === 'archived') {
          continue; // Skip unpublished icons
        }
        mergedBaseList.push({
          ...baseIcon,
          ...override,
        } as Icon);
      } else {
        mergedBaseList.push(baseIcon);
      }
    }

    return [...publicCustom, ...mergedBaseList];
  } catch {
    return GRIDFRAME_ICONS;
  }
}
