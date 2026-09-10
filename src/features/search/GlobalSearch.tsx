import React from "react";
import { useNavigate } from "react-router-dom";
import { useIconSearch } from "./useIconSearch";
import { SearchDialog } from "./SearchDialog";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import type { Icon } from "@/types/icon";

export interface GlobalSearchProps {
  onSelectIcon?: (icon: Icon) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelectIcon }) => {
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

  const handleSelect = (icon: Icon) => {
    if (onSelectIcon) {
      onSelectIcon(icon);
    } else {
      navigate(`/icons/${icon.slug}`);
    }
    closeSearch();
  };

  return (
    <SearchDialog
      isOpen={isOpen}
      onClose={closeSearch}
      query={query}
      onQueryChange={setQuery}
      results={results}
      suggestions={suggestions}
      selectedIndex={selectedIndex}
      onHoverIndex={setSelectedIndex}
      onSelectIcon={handleSelect}
      onKeyDown={(e) => handleKeyDown(e, handleSelect)}
    />
  );
};
