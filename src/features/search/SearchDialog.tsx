import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchInput } from "./SearchInput";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchResults } from "./SearchResults";
import type { Icon } from "@/types/icon";
import type { SearchSuggestion } from "@/types/filters";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: Icon[];
  suggestions: SearchSuggestion[];
  selectedIndex: number;
  onHoverIndex: (index: number) => void;
  onSelectIcon: (icon: Icon) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  suggestions,
  selectedIndex,
  onHoverIndex,
  onSelectIcon,
  onKeyDown,
}) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => window.removeEventListener("keydown", handleKeyDownGlobal);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-6 sm:pt-20"
          role="dialog"
          aria-modal="true"
          aria-label="Command Search Palette"
          onKeyDown={onKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            className="relative w-full max-w-2xl bg-bg-surface border border-border-default rounded-xl shadow-dialog z-10 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          >
            {/* Search Input Box */}
            <SearchInput
              value={query}
              onChange={onQueryChange}
              onClear={() => onQueryChange("")}
            />

            {/* Content Area: Suggestions or Results */}
            {!query.trim() ? (
              <SearchSuggestions
                suggestions={suggestions}
                onSelectSuggestion={(text) => onQueryChange(text)}
              />
            ) : (
              <SearchResults
                results={results}
                selectedIndex={selectedIndex}
                onSelectIcon={onSelectIcon}
                onHoverIndex={onHoverIndex}
                query={query}
              />
            )}

            {/* Footer keyboard navigation helper */}
            <div className="p-3 border-t border-border-subtle bg-bg-surface-subtle flex items-center justify-between text-[11px] text-text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle font-mono text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle font-mono text-[10px]">
                    ↓
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle font-mono text-[10px]">
                    ↵
                  </kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle font-mono text-[10px]">
                  ESC
                </kbd>
                Close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
