import { Collection, WorkspaceStorageState } from '@/types/collection';

const STORAGE_KEY = 'glyphroom_workspace_v1';
const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_UPDATE_EVENT = 'glyphroom:storage_updated';

// Default starter collections for fresh visitors
const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'col_essential_ui',
    name: 'Interface Essentials',
    description: 'Core actions and system navigation icons for web and mobile applications.',
    iconIds: ['ico_search', 'ico_settings', 'ico_user', 'ico_bell', 'ico_chevron_right'],
    color: '#3B82F6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'col_media_actions',
    name: 'Media Controls',
    description: 'Playback, volume, and playback state vectors.',
    iconIds: ['ico_play', 'ico_pause', 'ico_volume', 'ico_image'],
    color: '#10B981',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_STATE: WorkspaceStorageState = {
  version: CURRENT_SCHEMA_VERSION,
  favorites: ['ico_zap', 'ico_heart', 'ico_search', 'ico_settings'],
  collections: DEFAULT_COLLECTIONS,
};

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Dispatches a window-level custom event so all active hooks stay synchronized across views.
 */
function notifyStorageUpdate() {
  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT));
  }
}

/**
 * Loads and defensively parses workspace state from localStorage.
 */
export function loadWorkspaceState(): WorkspaceStorageState {
  if (!hasLocalStorage()) {
    return DEFAULT_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with defaults
      saveWorkspaceState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw);

    // Defensive schema validation
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.favorites) || !Array.isArray(parsed.collections)) {
      console.warn('Malformed storage state encountered. Resetting to defaults.');
      saveWorkspaceState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }

    return {
      version: parsed.version || CURRENT_SCHEMA_VERSION,
      favorites: Array.from(new Set(parsed.favorites.filter((id: unknown): id is string => typeof id === 'string'))),
      collections: parsed.collections.map((c: unknown) => {
        const item = (c && typeof c === 'object') ? c as Partial<Collection> : {};
        return {
          id: String(item.id || `col_${Date.now()}`),
          name: String(item.name || 'Untitled Collection'),
          description: item.description ? String(item.description) : undefined,
          iconIds: Array.isArray(item.iconIds) ? Array.from(new Set(item.iconIds.filter((id): id is string => typeof id === 'string'))) : [],
          color: item.color ? String(item.color) : '#3B82F6',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };
      }),
    };
  } catch (err) {
    console.error('Failed to load storage state:', err);
    return DEFAULT_STATE;
  }
}

/**
 * Saves state to localStorage and notifies listeners.
 */
export function saveWorkspaceState(state: WorkspaceStorageState): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifyStorageUpdate();
  } catch (err) {
    console.error('Failed to save storage state:', err);
  }
}

/* =========================================================================
   Favorites Methods
========================================================================= */

export function getStoredFavorites(): string[] {
  return loadWorkspaceState().favorites;
}

export function isStoredFavorite(iconId: string): boolean {
  return getStoredFavorites().includes(iconId);
}

export function toggleStoredFavorite(iconId: string): boolean {
  const state = loadWorkspaceState();
  const set = new Set(state.favorites);
  let isNowFav = false;

  if (set.has(iconId)) {
    set.delete(iconId);
    isNowFav = false;
  } else {
    set.add(iconId);
    isNowFav = true;
  }

  saveWorkspaceState({
    ...state,
    favorites: Array.from(set),
  });

  return isNowFav;
}

export function clearStoredFavorites(): void {
  const state = loadWorkspaceState();
  saveWorkspaceState({
    ...state,
    favorites: [],
  });
}

/* =========================================================================
   Collections Methods
========================================================================= */

export function getStoredCollections(): Collection[] {
  return loadWorkspaceState().collections;
}

export function getStoredCollectionById(id: string): Collection | undefined {
  return getStoredCollections().find((c) => c.id === id);
}

export function saveStoredCollection(
  collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Collection {
  const state = loadWorkspaceState();
  const now = new Date().toISOString();
  let updatedCollection: Collection;

  if (collection.id) {
    const existingIndex = state.collections.findIndex((c) => c.id === collection.id);
    if (existingIndex >= 0) {
      updatedCollection = {
        ...state.collections[existingIndex],
        ...collection,
        id: collection.id,
        updatedAt: now,
      };
      state.collections[existingIndex] = updatedCollection;
    } else {
      updatedCollection = {
        ...collection,
        id: collection.id,
        createdAt: now,
        updatedAt: now,
      };
      state.collections.push(updatedCollection);
    }
  } else {
    updatedCollection = {
      ...collection,
      id: `col_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    state.collections.push(updatedCollection);
  }

  saveWorkspaceState(state);
  return updatedCollection;
}

export function deleteStoredCollection(id: string): boolean {
  const state = loadWorkspaceState();
  const beforeCount = state.collections.length;
  state.collections = state.collections.filter((c) => c.id !== id);

  if (state.collections.length !== beforeCount) {
    saveWorkspaceState(state);
    return true;
  }
  return false;
}

export function toggleIconInStoredCollection(collectionId: string, iconId: string): boolean {
  const state = loadWorkspaceState();
  const collection = state.collections.find((c) => c.id === collectionId);
  if (!collection) return false;

  const set = new Set(collection.iconIds);
  let isAdded = false;

  if (set.has(iconId)) {
    set.delete(iconId);
    isAdded = false;
  } else {
    set.add(iconId);
    isAdded = true;
  }

  collection.iconIds = Array.from(set);
  collection.updatedAt = new Date().toISOString();

  saveWorkspaceState(state);
  return isAdded;
}
