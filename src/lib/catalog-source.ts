import { useState, useEffect } from 'react';
import type { Icon } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';

const CATALOG_OVERRIDE_KEY = 'gridframe_admin_catalog_overrides_v1';
const CUSTOM_ICONS_KEY = 'gridframe_admin_custom_icons_v1';
export const CATALOG_UPDATE_EVENT = 'gridframe:catalog_updated';

/**
 * Dispatches a window-level event to notify all public catalog subscribers of mutations.
 */
export function notifyCatalogUpdate() {
  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATE_EVENT));
  }
}

/**
 * Returns the unified authoritative public catalog of icons.
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

/**
 * Reactive hook for public views subscribing to the authoritative catalog.
 */
export function usePublicCatalog(): Icon[] {
  const [icons, setIcons] = useState<Icon[]>(() => getPublicCatalogIcons());

  useEffect(() => {
    const handleUpdate = () => {
      setIcons(getPublicCatalogIcons());
    };

    window.addEventListener(CATALOG_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CATALOG_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return icons;
}
