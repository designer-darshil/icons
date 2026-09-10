import React, { createContext, useContext, useCallback } from "react";
import { SearchDialog } from "./SearchDialog";
import { useIconSearch } from "./useIconSearch";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import type { Icon } from "@/types/icon";

interface SearchContextType {
  openSearch: () => void;
  closeSearch: () => void;
  isOpen: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const {
    isOpen,
    query,
    setQuery,
    results,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    openSearch,
    closeSearch,
    handleKeyDown,
  } = useIconSearch();

  // Listen for Cmd+K and '/' globally
  useKeyboardShortcut(
    { key: "k", metaKey: true, preventDefault: true },
    () => {
      openSearch();
    }
  );

  useKeyboardShortcut(
    "/",
    (e) => {
      e.preventDefault();
      openSearch();
    }
  );

  const handleSelectIcon = useCallback(
    (icon: Icon) => {
      navigate(`/icons/${icon.slug}`);
      closeSearch();
    },
    [navigate, closeSearch]
  );

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch, isOpen }}>
      {children}
      <SearchDialog
        isOpen={isOpen}
        onClose={closeSearch}
        query={query}
        onQueryChange={setQuery}
        results={results}
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        onHoverIndex={setSelectedIndex}
        onSelectIcon={handleSelectIcon}
        onKeyDown={(e) => handleKeyDown(e, handleSelectIcon)}
      />
    </SearchContext.Provider>
  );
};

export function useSearchModal() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchModal must be used within SearchProvider");
  }
  return context;
}
