import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Tag,
  X,
  ArrowRight,
  CornerDownLeft,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { searchIconsWithScore, getSearchSuggestions } from '@/lib/icon-search';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, commandPaletteVariants } from '@/lib/motion';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';
import type { Icon } from '@/types/icon';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: Icon) => void;
  onSelectCategory?: (category: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useRecentSearches();
  const { recentIcons, addRecentlyViewed } = useRecentlyViewed();

  // Lock body scroll while active
  useScrollLock(isOpen);

  // Focus input when opened & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search results (max 30 conceptual icons, single concept per result)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchIconsWithScore(GRIDFRAME_ICONS, query).slice(0, 30);
  }, [query]);

  // Suggestions for empty query or empty results
  const suggestions = useMemo(() => {
    return getSearchSuggestions(GRIDFRAME_ICONS, query);
  }, [query]);

  const handleSelectIconAndCommit = useCallback(
    (icon: Icon) => {
      if (query.trim()) {
        addRecentSearch(query.trim());
      }
      addRecentlyViewed(icon.id);
      onSelectIcon(icon);
      onClose();
    },
    [query, addRecentSearch, addRecentlyViewed, onSelectIcon, onClose]
  );

  const handleSelectCategoryAndCommit = useCallback(
    (catSlug: string) => {
      if (onSelectCategory) {
        onSelectCategory(catSlug);
        onClose();
      }
    },
    [onSelectCategory, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, results.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelectIconAndCommit(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleSelectIconAndCommit]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-3 sm:p-4 overflow-hidden">
          {/* Overlay Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay backdrop-blur-sm cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : commandPaletteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-bg-elevated border border-border-default rounded-xl shadow-modal overflow-hidden z-10 text-text-primary"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-border-subtle bg-bg-secondary/40">
              <Search className="w-4 h-4 text-text-tertiary mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search icons, categories, aliases (e.g. user, trash, cloud)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-mono"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search input"
                  className="p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer rounded-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="text-[10px] font-mono text-text-tertiary bg-bg-secondary px-1.5 py-0.5 border border-border-subtle rounded-3xs select-none">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results / Discovery Content Area */}
            <div
              ref={listRef}
              data-lenis-prevent="true"
              className="max-h-[62vh] overflow-y-auto native-scroll p-2.5 space-y-3 overscroll-contain"
            >
              {query.trim() ? (
                /* ─── ACTIVE QUERY RESULTS ─── */
                results.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="py-8 px-4 text-center space-y-4">
                    <div className="w-10 h-10 mx-auto rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center text-text-tertiary">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-text-primary">
                        No icons found for &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-[11px] text-text-tertiary font-mono">
                        Try searching with synonyms (e.g. &ldquo;profile&rdquo; for user, &ldquo;bin&rdquo; for trash).
                      </p>
                    </div>

                    {/* Quick suggestions & recovery actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="px-3 py-1.5 text-xs font-mono rounded-md border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary bg-bg-secondary transition-colors cursor-pointer"
                      >
                        Clear search
                      </button>
                      {onSelectCategory && (
                        <button
                          type="button"
                          onClick={() => handleSelectCategoryAndCommit('interface')}
                          className="px-3 py-1.5 text-xs font-mono rounded-md border border-border-default hover:border-border-strong text-accent bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
                        >
                          Browse Interface Icons
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* MATCHES LIST */
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                      <span>{results.length} Conceptual Match{results.length === 1 ? '' : 'es'}</span>
                      <span>Single Concept = Single Result</span>
                    </div>
                    {results.map((icon, idx) => {
                      const isSelected = selectedIndex === idx;
                      const variant = icon.variants[0];
                      return (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => handleSelectIconAndCommit(icon)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left cursor-pointer border',
                            isSelected
                              ? 'bg-bg-secondary border-border-strong text-text-primary'
                              : 'border-transparent text-text-secondary hover:bg-bg-secondary/70 hover:text-text-primary'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-bg-secondary border border-border-subtle flex items-center justify-center shrink-0">
                              <IconPreviewSvg
                                variant={variant}
                                icon={icon}
                                size={18}
                                className="w-4.5 h-4.5"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-text-primary block truncate">
                                {icon.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-tertiary">
                                <span className="uppercase">{icon.category}</span>
                                <span>•</span>
                                <span>{icon.variants.length} style{icon.variants.length === 1 ? '' : 's'}</span>
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-accent shrink-0 pl-2">
                              <span>Inspect</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                /* ─── EMPTY QUERY: RECENT SEARCHES + RECENTLY VIEWED + DISCOVERY ─── */
                <div className="space-y-4 p-1">
                  {/* 1. Recent Searches (if any) */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-text-tertiary" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-[10px] font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((item) => (
                          <div
                            key={item}
                            className="group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md bg-bg-secondary border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => setQuery(item)}
                              className="cursor-pointer text-left"
                            >
                              {item}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(item);
                              }}
                              aria-label={`Remove recent search ${item}`}
                              className="p-0.5 text-text-tertiary hover:text-text-primary rounded-xs transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Recently Viewed Icons (if any) */}
                  {recentIcons.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary px-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>Recently Viewed</span>
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {recentIcons.map((recIcon) => (
                          <button
                            key={recIcon.id}
                            type="button"
                            onClick={() => handleSelectIconAndCommit(recIcon)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-bg-secondary/60 hover:bg-bg-secondary border border-border-subtle hover:border-border-strong transition-all cursor-pointer text-left group"
                          >
                            <div className="w-6 h-6 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                              <IconPreviewSvg
                                variant={recIcon.variants[0]}
                                icon={recIcon}
                                size={14}
                                className="w-3.5 h-3.5"
                              />
                            </div>
                            <span className="text-[11px] font-medium text-text-primary truncate">
                              {recIcon.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Suggested Discoveries & Domains */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary px-1 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-text-tertiary" />
                      <span>Suggested Discoveries</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {suggestions.map((sug) => (
                        <button
                          key={`${sug.type}-${sug.text}`}
                          type="button"
                          onClick={() => {
                            if (sug.type === 'category' && sug.category && onSelectCategory) {
                              handleSelectCategoryAndCommit(sug.category);
                            } else {
                              setQuery(sug.text);
                            }
                          }}
                          className="flex items-center justify-between p-2 rounded-lg border border-border-subtle bg-bg-secondary/40 hover:bg-bg-secondary hover:border-border-strong text-left transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Tag className="w-3 h-3 text-text-tertiary shrink-0" />
                            <span className="text-xs font-medium text-text-primary truncate">
                              {sug.text}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-text-tertiary shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-border-subtle bg-bg-secondary/60 text-[10px] font-mono text-text-tertiary">
              <div className="hidden sm:flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="sm:hidden">Tap icon to inspect</span>
              <span>{GRIDFRAME_ICONS.length.toLocaleString()} Conceptual Icons</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
