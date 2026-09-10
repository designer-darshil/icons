import { useState, useMemo, useCallback, useEffect } from "react";
import { MOCK_ICONS } from "@/data/icons/mock-icons";
import { searchIconsWithScore, getSearchSuggestions } from "@/lib/icon-search";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Icon } from "@/types/icon";
import type { SearchSuggestion } from "@/types/filters";

export function useIconSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebouncedValue(query, 120);

  const results: Icon[] = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchIconsWithScore(MOCK_ICONS, debouncedQuery).slice(0, 16);
  }, [debouncedQuery]);

  const suggestions: SearchSuggestion[] = useMemo(() => {
    return getSearchSuggestions(MOCK_ICONS, query);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onSelectIcon: (icon: Icon) => void) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          onSelectIcon(selected);
          closeSearch();
        }
      }
    },
    [results, selectedIndex, closeSearch]
  );

  return {
    isOpen,
    query,
    setQuery,
    debouncedQuery,
    results,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    openSearch,
    closeSearch,
    handleKeyDown,
  };
}
