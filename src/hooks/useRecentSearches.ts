import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gridframe_recent_searches';
const MAX_RECENT_SEARCHES = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync from storage events
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setRecentSearches(stored ? JSON.parse(stored) : []);
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

  const addRecentSearch = useCallback((query: string) => {
    const clean = query.trim();
    if (!clean || clean.length < 2) return;

    setRecentSearches((prev) => {
      // Remove previous duplicate (case-insensitive)
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('local-storage'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('local-storage'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('local-storage'));
    } catch {
      // ignore
    }
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
