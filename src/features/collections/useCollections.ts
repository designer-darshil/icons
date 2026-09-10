import { useState, useEffect, useCallback, useMemo } from 'react';
import { Collection, CollectionWithIcons } from '@/types/collection';
import { Icon } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import {
  getStoredCollections,
  getStoredCollectionById,
  saveStoredCollection,
  deleteStoredCollection,
  toggleIconInStoredCollection,
  STORAGE_UPDATE_EVENT,
} from '@/lib/storage';

export interface UseCollectionsReturn {
  collections: Collection[];
  collectionsWithIcons: CollectionWithIcons[];
  count: number;
  getCollection: (id: string) => Collection | undefined;
  getCollectionIcons: (collectionId: string) => Icon[];
  createCollection: (data: { name: string; description?: string; color?: string; iconIds?: string[] }) => Collection;
  updateCollection: (id: string, data: Partial<Omit<Collection, 'id' | 'createdAt'>>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  toggleIconInCollection: (collectionId: string, iconId: string) => boolean;
  isIconInCollection: (collectionId: string, iconId: string) => boolean;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>(() => {
    return getStoredCollections();
  });

  // Sync state on local storage updates across windows and components
  useEffect(() => {
    const handleStorageUpdate = () => {
      setCollections(getStoredCollections());
    };

    window.addEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(STORAGE_UPDATE_EVENT, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const getCollection = useCallback((id: string): Collection | undefined => {
    return getStoredCollectionById(id);
  }, []);

  const getCollectionIcons = useCallback((collectionId: string): Icon[] => {
    const col = getStoredCollectionById(collectionId);
    if (!col) return [];
    const iconMap = new Map(GRIDFRAME_ICONS.map((i) => [i.id, i]));
    return col.iconIds
      .map((id) => iconMap.get(id))
      .filter((icon): icon is Icon => Boolean(icon));
  }, []);

  const createCollection = useCallback(
    (data: { name: string; description?: string; color?: string; iconIds?: string[] }): Collection => {
      const created = saveStoredCollection({
        name: data.name.trim() || 'Untitled Collection',
        description: data.description?.trim(),
        color: data.color || '#3B82F6',
        iconIds: data.iconIds || [],
      });
      setCollections(getStoredCollections());
      return created;
    },
    []
  );

  const updateCollection = useCallback(
    (id: string, data: Partial<Omit<Collection, 'id' | 'createdAt'>>): Collection | null => {
      const existing = getStoredCollectionById(id);
      if (!existing) return null;

      const updated = saveStoredCollection({
        ...existing,
        ...data,
        id,
      });
      setCollections(getStoredCollections());
      return updated;
    },
    []
  );

  const deleteCollection = useCallback((id: string): boolean => {
    const ok = deleteStoredCollection(id);
    if (ok) {
      setCollections(getStoredCollections());
    }
    return ok;
  }, []);

  const toggleIconInCollection = useCallback(
    (collectionId: string, iconId: string): boolean => {
      const res = toggleIconInStoredCollection(collectionId, iconId);
      setCollections(getStoredCollections());
      return res;
    },
    []
  );

  const isIconInCollection = useCallback(
    (collectionId: string, iconId: string): boolean => {
      const col = collections.find((c) => c.id === collectionId);
      return Boolean(col && col.iconIds.includes(iconId));
    },
    [collections]
  );

  const collectionsWithIcons = useMemo((): CollectionWithIcons[] => {
    const iconMap = new Map(GRIDFRAME_ICONS.map((i: Icon) => [i.id, i]));
    return collections.map((col) => ({
      ...col,
      icons: col.iconIds
        .map((id) => iconMap.get(id))
        .filter((icon): icon is Icon => Boolean(icon)),
    }));
  }, [collections]);

  return {
    collections,
    collectionsWithIcons,
    count: collections.length,
    getCollection,
    getCollectionIcons,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleIconInCollection,
    isIconInCollection,
  };
}
