import { useState, useEffect, useCallback, useMemo } from 'react';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import type { Icon } from '@/types/icon';

const STORAGE_KEY = 'gridframe_recently_viewed_icons';
const MAX_RECENT_ICONS = 8;

export function useRecentlyViewed() {
  const [recentIconIds, setRecentIconIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setRecentIconIds(stored ? JSON.parse(stored) : []);
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage', handleStorage);
    };
  }, []);

  const addRecentlyViewed = useCallback((iconIdOrSlug: string) => {
    if (!iconIdOrSlug) return;
    const matched = GRIDFRAME_ICONS.find(
      (i) => i.id === iconIdOrSlug || i.slug.toLowerCase() === iconIdOrSlug.toLowerCase()
    );
    if (!matched) return;

    setRecentIconIds((prev) => {
      const filtered = prev.filter((id) => id !== matched.id);
      const next = [matched.id, ...filtered].slice(0, MAX_RECENT_ICONS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('local-storage'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentIconIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('local-storage'));
    } catch {
      // ignore
    }
  }, []);

  // Hydrate icon objects
  const recentIcons: Icon[] = useMemo(() => {
    const iconMap = new Map(GRIDFRAME_ICONS.map((i) => [i.id, i]));
    return recentIconIds
      .map((id) => iconMap.get(id))
      .filter((icon): icon is Icon => Boolean(icon));
  }, [recentIconIds]);

  return {
    recentIconIds,
    recentIcons,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
