import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getStoredFavorites,
  toggleStoredFavorite,
  clearStoredFavorites,
  STORAGE_UPDATE_EVENT,
} from '@/lib/storage';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { Icon } from '@/types/icon';

export interface UseFavoritesReturn {
  favoriteIds: string[];
  favoriteIcons: Icon[];
  count: number;
  isFavorite: (iconId: string) => boolean;
  toggleFavorite: (iconId: string) => boolean;
  clearFavorites: () => void;
}

export function useFavorites(): UseFavoritesReturn {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    return getStoredFavorites();
  });

  // Sync state whenever storage changes (across windows or within the app)
  useEffect(() => {
    const handleStorageUpdate = () => {
      setFavoriteIds(getStoredFavorites());
    };

    window.addEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const isFavorite = useCallback(
    (iconId: string): boolean => {
      return favoriteIds.includes(iconId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (iconId: string): boolean => {
      const isNowFav = toggleStoredFavorite(iconId);
      setFavoriteIds(getStoredFavorites());
      return isNowFav;
    },
    []
  );

  const clearFavorites = useCallback(() => {
    clearStoredFavorites();
    setFavoriteIds([]);
  }, []);

  // Hydrate full icon objects from GRIDFRAME_ICONS defensively
  const favoriteIcons = useMemo(() => {
    const map = new Map(GRIDFRAME_ICONS.map((icon) => [icon.id, icon]));
    return favoriteIds
      .map((id) => map.get(id))
      .filter((icon): icon is Icon => Boolean(icon));
  }, [favoriteIds]);

  return {
    favoriteIds,
    favoriteIcons,
    count: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
