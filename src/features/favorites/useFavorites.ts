import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getStoredFavorites,
  toggleStoredFavorite,
  clearStoredFavorites,
  STORAGE_UPDATE_EVENT,
} from '@/lib/storage';
import { getPublicCatalogIcons, CATALOG_UPDATE_EVENT } from '@/lib/catalog-source';
import type { Icon } from '@/types/icon';

export interface UseFavoritesReturn {
  favoriteIds: string[];
  favoriteIcons: Icon[];
  count: number;
  isFavorite: (iconIdOrSlug: string) => boolean;
  toggleFavorite: (iconIdOrSlug: string) => boolean;
  clearFavorites: () => void;
}

export function useFavorites(): UseFavoritesReturn {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    return getStoredFavorites();
  });
  const [catalogVersion, setCatalogVersion] = useState(0);

  // Sync state whenever storage or catalog changes (across windows or within the app)
  useEffect(() => {
    const handleStorageUpdate = () => {
      setFavoriteIds(getStoredFavorites());
    };

    const handleCatalogUpdate = () => {
      setCatalogVersion((v) => v + 1);
    };

    window.addEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener(CATALOG_UPDATE_EVENT, handleCatalogUpdate);

    return () => {
      window.removeEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener(CATALOG_UPDATE_EVENT, handleCatalogUpdate);
    };
  }, []);

  // Hydrate full icon objects from authoritative public catalog
  const { favoriteIcons, favoriteSet } = useMemo(() => {
    const publicIcons = getPublicCatalogIcons();
    const map = new Map<string, Icon>();

    for (const icon of publicIcons) {
      map.set(icon.id, icon);
      map.set(icon.slug, icon);
      map.set(icon.name.toLowerCase(), icon);
    }

    const icons: Icon[] = [];
    const validIds = new Set<string>();

    for (const id of favoriteIds) {
      const found = map.get(id) || map.get(id.toLowerCase());
      if (found && !validIds.has(found.id)) {
        icons.push(found);
        validIds.add(found.id);
        validIds.add(found.slug);
      }
    }

    return { favoriteIcons: icons, favoriteSet: validIds };
  }, [favoriteIds, catalogVersion]);

  const isFavorite = useCallback(
    (iconIdOrSlug: string): boolean => {
      if (!iconIdOrSlug) return false;
      return favoriteSet.has(iconIdOrSlug) || favoriteIds.includes(iconIdOrSlug);
    },
    [favoriteSet, favoriteIds]
  );

  const toggleFavorite = useCallback(
    (iconIdOrSlug: string): boolean => {
      const isNowFav = toggleStoredFavorite(iconIdOrSlug);
      setFavoriteIds(getStoredFavorites());
      return isNowFav;
    },
    []
  );

  const clearFavorites = useCallback(() => {
    clearStoredFavorites();
    setFavoriteIds([]);
  }, []);

  return {
    favoriteIds,
    favoriteIcons,
    count: favoriteIcons.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
