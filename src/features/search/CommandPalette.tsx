import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { searchIconsWithScore, getSearchSuggestions } from '@/lib/icon-search';
import type { Icon } from '@/types/icon';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, commandPaletteVariants } from '@/lib/motion';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

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

  // Lock body scroll and pause Lenis while command palette is active
  useScrollLock(isOpen);

  // Focus input when opened & clear query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search results (max 30 conceptual icons)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchIconsWithScore(GRIDFRAME_ICONS, query).slice(0, 30);
  }, [query]);

  // Suggestions when query is empty
  const suggestions = useMemo(() => {
    return getSearchSuggestions(GRIDFRAME_ICONS, query);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length || suggestions.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, (results.length || suggestions.length) - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          onSelectIcon(results[selectedIndex]);
          onClose();
        } else if (!query && suggestions[selectedIndex]) {
          const sug = suggestions[selectedIndex];
          if (sug.type === 'category' && sug.category && onSelectCategory) {
            onSelectCategory(sug.category);
            onClose();
          } else {
            setQuery(sug.text);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, suggestions, selectedIndex, query, onClose, onSelectIcon, onSelectCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-hidden">
          {/* Overlay Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : commandPaletteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-bg-primary border border-border-default rounded-lg shadow-modal overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-3.5 py-3 border-b border-border-default bg-bg-secondary">
              <Search className="w-4 h-4 text-text-tertiary mr-2.5 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search vector icons, categories, tags..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none font-mono"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-text-tertiary hover:text-text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="text-[10px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 border border-border-default rounded-xs">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results / Suggestions List */}
            <div
              ref={listRef}
              data-lenis-prevent="true"
              className="max-h-[60vh] overflow-y-auto native-scroll p-2 space-y-1 overscroll-contain"
            >
              {query.trim() ? (
                results.length === 0 ? (
                  <div className="py-8 text-center text-xs text-text-tertiary">
                    No icon concepts found for "{query}"
                  </div>
                ) : (
                  results.map((icon, idx) => {
                    const isSelected = selectedIndex === idx;
                    const variant = icon.variants[0];
                    return (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() => {
                          onSelectIcon(icon);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          'w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer border',
                          isSelected
                            ? 'bg-bg-secondary border-border-strong text-text-primary'
                            : 'border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-bg-elevated border border-border-default flex items-center justify-center shrink-0">
                            <IconPreviewSvg
                              variant={variant}
                              icon={icon}
                              size={18}
                              className="w-4.5 h-4.5"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-text-primary block">
                              {icon.name}
                            </span>
                            <span className="text-[10px] font-mono text-text-tertiary">
                              {icon.category} • {icon.variants.length} styles
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-text-tertiary">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    );
                  })
                )
              ) : (
                <div className="p-2 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted px-1 block">
                    Suggested Searches & Categories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {suggestions.map((sug, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={`${sug.type}-${sug.text}`}
                          type="button"
                          onClick={() => {
                            if (sug.type === 'category' && sug.category && onSelectCategory) {
                              onSelectCategory(sug.category);
                              onClose();
                            } else {
                              setQuery(sug.text);
                            }
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'flex items-center justify-between p-2 rounded-md border text-left transition-colors cursor-pointer',
                            isSelected
                              ? 'bg-bg-secondary border-border-strong text-text-primary'
                              : 'bg-bg-secondary/40 border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Tag className="w-3 h-3 text-text-tertiary shrink-0" />
                            <span className="text-xs font-medium truncate">{sug.text}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-text-disabled shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border-default bg-bg-secondary text-[10px] font-mono text-text-tertiary">
              <div className="hidden sm:flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="sm:hidden">Tap to Select</span>
              <span>{GRIDFRAME_ICONS.length.toLocaleString()} Total Icons</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
