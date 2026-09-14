import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, SlidersHorizontal, Heart } from 'lucide-react';
import { ICON_CATEGORIES } from '@/data/categories';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { IconStyle } from '@/types/icon';
import type { SortOption } from '@/types/filters';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStyle: string;
  onStyleChange: (style: IconStyle | 'all') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  onlyFavorites?: boolean;
  onToggleOnlyFavorites?: () => void;
  favoritesCount?: number;
  onResetAll?: () => void;
}

const CATEGORY_ITEMS = [
  { id: 'all', slug: 'all', name: 'ALL' },
  ...ICON_CATEGORIES.map((c) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name.toUpperCase(),
  })),
];

const STYLES: { id: IconStyle | 'all'; label: string; sublabel: string }[] = [
  { id: 'all', label: 'All Styles', sublabel: 'Every stroke & fill weight' },
  { id: 'regular', label: 'Regular', sublabel: '2.0px canonical stroke reference' },
  { id: 'light', label: 'Light', sublabel: '1.5px delicate stroke outline' },
  { id: 'filled', label: 'Filled', sublabel: 'Solid geometric silhouette' },
  { id: 'duotone', label: 'Duotone', sublabel: 'Two-tone layer depth & hierarchy' },
  { id: 'duotone-line', label: 'Duotone Line', sublabel: 'Dual-layer outline detail' },
];

const SORTS: { id: SortOption; label: string }[] = [
  { id: 'popular', label: 'Popular First' },
  { id: 'newest', label: 'Recently Added' },
  { id: 'name-asc', label: 'Alphabetical (A–Z)' },
  { id: 'name-desc', label: 'Alphabetical (Z–A)' },
];

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedStyle,
  onStyleChange,
  sort,
  onSortChange,
  totalCount,
  filteredCount,
  onlyFavorites = false,
  onToggleOnlyFavorites,
  favoritesCount = 0,
  onResetAll,
}) => {
  const prefersReducedMotion = useReducedMotion();
  useScrollLock(isOpen);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentCatUpper = selectedCategory.toUpperCase();
  const isFiltered =
    (selectedCategory !== 'all' && selectedCategory !== 'ALL') ||
    selectedStyle !== 'all' ||
    onlyFavorites;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter & Sort Specimen Catalog"
        >
          {/* Backdrop Blur */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay cursor-pointer"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-h-[85vh] bg-bg-primary border-t border-border-default rounded-t-2xl shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Sheet Drag Handle & Header */}
            <div className="pt-3 pb-4 px-6 border-b border-border-subtle/50 flex flex-col items-center shrink-0">
              <div className="w-12 h-1 rounded-full bg-border-strong mb-3" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold font-mono tracking-wider text-text-primary uppercase">
                    Catalog Filters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={onResetAll}
                      className="text-xs font-mono text-accent hover:underline cursor-pointer flex items-center gap-1 min-h-[44px] px-2 touch-manipulation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close filters"
                    className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer touch-manipulation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sheet Scrollable Body */}
            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain native-scroll"
            >
              {/* 0. Saved Icons Filter Toggle */}
              {onToggleOnlyFavorites && (
                <div className="space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary block">
                    Saved Filter
                  </span>
                  <button
                    type="button"
                    onClick={onToggleOnlyFavorites}
                    className={cn(
                      'w-full flex items-center justify-between p-3.5 min-h-[52px] rounded-xl border text-xs font-mono transition-all cursor-pointer select-none touch-manipulation',
                      onlyFavorites
                        ? 'bg-accent/10 border-accent text-accent font-bold shadow-xs'
                        : 'bg-bg-secondary/40 border-border-subtle text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className={cn('w-4 h-4', onlyFavorites && 'fill-current text-accent')} />
                      <span>Show Saved Icons Only</span>
                    </div>
                    {favoritesCount > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                        {favoritesCount} saved
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* 1. Vector Style Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                    Vector Style
                  </span>
                  <span className="text-[11px] font-mono text-accent uppercase font-medium">
                    {selectedStyle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onStyleChange(st.id)}
                      className={cn(
                        'flex flex-col items-start p-3.5 min-h-[56px] rounded-xl border text-left transition-all cursor-pointer select-none touch-manipulation',
                        selectedStyle === st.id
                          ? 'bg-accent/10 border-accent text-accent shadow-xs'
                          : 'bg-bg-secondary/40 border-border-subtle text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono font-bold uppercase">{st.label}</span>
                        {selectedStyle === st.id && <Check className="w-3.5 h-3.5 text-accent" />}
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary mt-0.5">{st.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sort Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                    Sort Order
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSortChange(s.id)}
                      className={cn(
                        'flex items-center justify-between p-3.5 min-h-[48px] rounded-xl border text-xs font-mono transition-all cursor-pointer select-none touch-manipulation',
                        sort === s.id
                          ? 'bg-bg-elevated border-border-strong text-text-primary font-bold shadow-xs'
                          : 'bg-bg-secondary/40 border-border-subtle text-text-tertiary hover:text-text-primary'
                      )}
                    >
                      <span>{s.label}</span>
                      {sort === s.id && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Category Domain Quick Selector */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary block">
                  Domain Categories ({CATEGORY_ITEMS.length - 1})
                </span>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1.5 border border-border-subtle/60 rounded-xl bg-bg-secondary/20 native-scroll">
                  {CATEGORY_ITEMS.map((cat) => {
                    const isSelected =
                      (cat.id === 'all' && (currentCatUpper === 'ALL' || !selectedCategory || selectedCategory === 'all')) ||
                      cat.slug.toLowerCase() === selectedCategory.toLowerCase() ||
                      cat.name === currentCatUpper;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onCategoryChange(cat.id)}
                        className={cn(
                          'px-3.5 py-2 min-h-[40px] rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer select-none touch-manipulation',
                          isSelected
                            ? 'bg-accent text-white font-bold shadow-xs'
                            : 'bg-bg-secondary/60 text-text-secondary hover:text-text-primary border border-border-subtle'
                        )}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer with safe area padding */}
            <div className="p-4 sm:p-6 border-t border-border-subtle/50 bg-bg-secondary/40 flex items-center justify-between gap-3 pb-safe shrink-0">
              <span className="text-xs font-mono text-text-secondary">
                {filteredCount.toLocaleString()} / {totalCount.toLocaleString()} items
              </span>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-6 min-h-[48px] bg-accent text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all shadow-sm cursor-pointer text-center touch-manipulation"
              >
                Apply Filters ({filteredCount.toLocaleString()})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
