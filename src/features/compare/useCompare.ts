import { useState, useEffect, useCallback, useMemo } from 'react';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import type { Icon } from '@/types/icon';

const COMPARE_STORAGE_KEY = 'gridframe_compare_ids_v1';
export const COMPARE_UPDATE_EVENT = 'gridframe:compare_updated';
export const MAX_COMPARE_ITEMS = 4;

function getStoredCompareIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === 'string').slice(0, MAX_COMPARE_ITEMS);
    }
    return [];
  } catch {
    return [];
  }
}

function saveStoredCompareIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const capped = ids.slice(0, MAX_COMPARE_ITEMS);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(capped));
    window.dispatchEvent(new CustomEvent(COMPARE_UPDATE_EVENT));
  } catch (e) {
    console.error('Failed to save compare items:', e);
  }
}

export interface UseCompareReturn {
  compareIds: string[];
  compareIcons: Icon[];
  count: number;
  isComparing: (iconId: string) => boolean;
  addToCompare: (iconId: string) => boolean;
  removeFromCompare: (iconId: string) => void;
  toggleCompare: (iconId: string) => boolean;
  clearCompare: () => void;
  swapCompare: (fromIndex: number, toIndex: number) => void;
  setCompareIds: (ids: string[]) => void;
  canAddMore: boolean;
}

export function useCompare(): UseCompareReturn {
  const [compareIds, setCompareIdsState] = useState<string[]>(() => getStoredCompareIds());

  useEffect(() => {
    const handleUpdate = () => {
      setCompareIdsState(getStoredCompareIds());
    };

    window.addEventListener(COMPARE_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(COMPARE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isComparing = useCallback(
    (iconId: string) => compareIds.includes(iconId),
    [compareIds]
  );

  const addToCompare = useCallback(
    (iconId: string): boolean => {
      if (compareIds.includes(iconId)) return true;
      if (compareIds.length >= MAX_COMPARE_ITEMS) return false;
      const next = [...compareIds, iconId];
      saveStoredCompareIds(next);
      setCompareIdsState(next);
      return true;
    },
    [compareIds]
  );

  const removeFromCompare = useCallback(
    (iconId: string) => {
      const next = compareIds.filter((id) => id !== iconId);
      saveStoredCompareIds(next);
      setCompareIdsState(next);
    },
    [compareIds]
  );

  const toggleCompare = useCallback(
    (iconId: string): boolean => {
      if (compareIds.includes(iconId)) {
        const next = compareIds.filter((id) => id !== iconId);
        saveStoredCompareIds(next);
        setCompareIdsState(next);
        return false;
      } else {
        if (compareIds.length >= MAX_COMPARE_ITEMS) return false;
        const next = [...compareIds, iconId];
        saveStoredCompareIds(next);
        setCompareIdsState(next);
        return true;
      }
    },
    [compareIds]
  );

  const clearCompare = useCallback(() => {
    saveStoredCompareIds([]);
    setCompareIdsState([]);
  }, []);

  const swapCompare = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        fromIndex >= compareIds.length ||
        toIndex < 0 ||
        toIndex >= compareIds.length
      ) {
        return;
      }
      const next = [...compareIds];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      saveStoredCompareIds(next);
      setCompareIdsState(next);
    },
    [compareIds]
  );

  const setCompareIds = useCallback((ids: string[]) => {
    const valid = ids.filter((id) => typeof id === 'string').slice(0, MAX_COMPARE_ITEMS);
    saveStoredCompareIds(valid);
    setCompareIdsState(valid);
  }, []);

  // Hydrate full icon objects from canonical catalog
  const compareIcons = useMemo(() => {
    const map = new Map(GRIDFRAME_ICONS.map((i) => [i.id, i]));
    return compareIds
      .map((id) => {
        // Find by id or slug
        return map.get(id) || GRIDFRAME_ICONS.find((i) => i.slug === id) || null;
      })
      .filter((icon): icon is Icon => Boolean(icon));
  }, [compareIds]);

  return {
    compareIds,
    compareIcons,
    count: compareIds.length,
    isComparing,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    swapCompare,
    setCompareIds,
    canAddMore: compareIds.length < MAX_COMPARE_ITEMS,
  };
}
