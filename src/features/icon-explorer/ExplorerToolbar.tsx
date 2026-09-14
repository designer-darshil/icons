import React, { useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, Heart } from 'lucide-react';
import { ICON_CATEGORIES } from '@/data/categories';
import { cn } from '@/lib/cn';
import type { IconStyle } from '@/types/icon';
import type { SortOption } from '@/types/filters';

export interface ExplorerToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
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
  onResetFilters?: () => void;
  onOpenFilterDrawer?: () => void;
  onOpenCommandPalette?: () => void;
}

const CATEGORY_ITEMS = [
  { id: 'all', slug: 'all', name: 'ALL' },
  ...ICON_CATEGORIES.map((c) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name.toUpperCase(),
  })),
];

const STYLES: { id: IconStyle | 'all'; label: string }[] = [
  { id: 'all', label: 'All Styles' },
  { id: 'light', label: 'Light' },
  { id: 'regular', label: 'Regular' },
  { id: 'filled', label: 'Filled' },
  { id: 'duotone', label: 'Duotone' },
  { id: 'duotone-line', label: 'Duotone Line' },
];

export const ExplorerToolbar: React.FC<ExplorerToolbarProps> = ({
  query,
  onQueryChange,
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
  onResetFilters,
  onOpenFilterDrawer,
  onOpenCommandPalette,
}) => {
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollCategories = (offset: number) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const currentCatUpper = selectedCategory.toUpperCase();
  const isFiltered =
    query.trim() !== '' ||
    (selectedCategory !== 'all' && selectedCategory !== 'ALL') ||
    selectedStyle !== 'all' ||
    onlyFavorites;

  return (
    <div className="space-y-6 mb-12">
      {/* =========================================================================
          TIER 1: PRIMARY COMMANDING SEARCH FIELD (Visual Focal Point)
          ========================================================================= */}
      <div className="relative w-full">
        <div
          onClick={() => searchInputRef.current?.focus()}
          className={cn(
            'group relative flex items-center justify-between h-16 sm:h-18 px-5 sm:px-6 rounded-sm transition-all duration-300 ease-out cursor-text shadow-xs',
            'bg-bg-secondary/30 hover:bg-bg-secondary/60 focus-within:bg-bg-secondary/90',
            'border border-border-subtle/80 hover:border-border-strong focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15'
          )}
        >
          {/* Left: Search Icon & Fluid Input */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-text-tertiary group-hover:text-accent group-focus-within:text-accent transition-colors shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search canonical vector concepts, categories, or keywords..."
              className="w-full bg-transparent type-search-hero text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>

          {/* Right: Interactive Shortcut / Live Counter / Clear Button */}
          <div className="flex items-center gap-2.5 shrink-0 pl-3 select-none">
            {query ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-mono text-accent font-semibold">
                  {filteredCount.toLocaleString()} {filteredCount === 1 ? 'result' : 'results'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQueryChange('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
                  <Sparkles className="w-3.5 h-3.5 text-accent opacity-80" />
                  <span>{totalCount.toLocaleString()} icons</span>
                </span>
                <kbd
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCommandPalette?.();
                  }}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-text-muted bg-bg-elevated border border-border-subtle rounded-full cursor-pointer hover:border-border-strong hover:text-text-primary transition-all"
                  title="Open Command Palette"
                >
                  <span>⌘K</span>
                </kbd>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: SECONDARY CATEGORY DOMAINS & VECTOR STYLES
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Domain Category Scroll Strip */}
        <div className="relative flex items-center flex-1 min-w-0">
          <button
            type="button"
            onClick={() => scrollCategories(-260)}
            aria-label="Scroll categories left"
            className="hidden md:flex items-center justify-center w-7 h-9 bg-bg-primary/95 border-r border-border-subtle/70 text-text-tertiary hover:text-text-primary z-10 shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            data-lenis-prevent="true"
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 w-full overscroll-x-contain touch-pan-x select-none"
          >
            {CATEGORY_ITEMS.map((cat) => {
              const isActive =
                (cat.id === 'all' && (currentCatUpper === 'ALL' || !selectedCategory || selectedCategory === 'all')) ||
                cat.slug.toLowerCase() === selectedCategory.toLowerCase() ||
                cat.name === currentCatUpper;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-all select-none cursor-pointer shrink-0 rounded-full border',
                    isActive
                      ? 'bg-accent text-white font-bold border-accent shadow-xs'
                      : 'bg-bg-secondary/30 hover:bg-bg-secondary text-text-secondary hover:text-text-primary border-border-subtle/70 hover:border-border-strong'
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollCategories(260)}
            aria-label="Scroll categories right"
            className="hidden md:flex items-center justify-center w-7 h-9 bg-bg-primary/95 border-l border-border-subtle/70 text-text-tertiary hover:text-text-primary z-10 shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Vector Style & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 justify-between lg:justify-end w-full lg:w-auto min-w-0">
          {/* Segmented Style Switcher */}
          <div
            data-lenis-prevent="true"
            className="flex items-center bg-bg-secondary/50 p-1 border border-border-subtle/80 rounded-full text-xs font-mono select-none overflow-x-auto no-scrollbar touch-pan-x max-w-full"
          >
            {STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onStyleChange(st.id)}
                className={cn(
                  'px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0',
                  selectedStyle === st.id
                    ? 'bg-bg-elevated text-text-primary font-bold shadow-2xs border border-border-strong'
                    : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* =========================================================================
              TIER 3: TERTIARY SORT & FILTER CONTROLS
              ========================================================================= */}
          <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
            {onToggleOnlyFavorites && (
              <button
                type="button"
                onClick={onToggleOnlyFavorites}
                aria-label={onlyFavorites ? 'Show all icons' : 'Filter by saved icons'}
                className={cn(
                  'h-9 px-3 flex items-center gap-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border select-none',
                  onlyFavorites
                    ? 'bg-accent/15 border-accent text-accent font-bold shadow-xs'
                    : 'bg-bg-secondary/60 text-text-secondary border-border-subtle/80 hover:text-text-primary hover:border-border-strong'
                )}
              >
                <Heart className={cn('w-3.5 h-3.5', onlyFavorites && 'fill-current text-accent')} />
                <span className="hidden sm:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="text-[10px] font-bold px-1 rounded-full bg-accent/20 text-accent">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort icon catalog"
              className="h-9 px-3.5 bg-bg-secondary/60 text-text-secondary border border-border-subtle/80 rounded-full text-xs font-mono focus-visible:outline-none focus-visible:border-accent cursor-pointer hover:border-border-strong transition-colors flex-1 sm:flex-initial"
            >
              <option value="popular">Popular First</option>
              <option value="newest">Recently Added</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
              <option value="name-desc">Alphabetical (Z–A)</option>
            </select>

            {onOpenFilterDrawer && (
              <button
                type="button"
                onClick={onOpenFilterDrawer}
                aria-label="Open filter drawer"
                className="lg:hidden p-2 bg-bg-secondary border border-border-default rounded-full text-text-secondary hover:text-text-primary shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Status Breadcrumb & Active Filter State */}
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40 text-[11px] font-mono text-text-tertiary">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest font-medium">
            {selectedCategory === 'all' || selectedCategory === 'ALL'
              ? 'Archive / All Icons'
              : `Archive / ${selectedCategory.toUpperCase()}`}
          </span>
          {selectedStyle !== 'all' && (
            <span className="px-1.5 py-0.2 bg-bg-elevated rounded-full border border-border-subtle text-accent uppercase font-bold text-[9px]">
              {selectedStyle}
            </span>
          )}
          {onlyFavorites && (
            <span className="px-1.5 py-0.2 bg-accent/15 rounded-full border border-accent text-accent uppercase font-bold text-[9px]">
              Saved Only
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-secondary">
            {isFiltered
              ? `${filteredCount.toLocaleString()} ${filteredCount === 1 ? 'result' : 'results'}`
              : `${totalCount.toLocaleString()} icons`}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                if (onResetFilters) {
                  onResetFilters();
                } else {
                  onQueryChange('');
                  onCategoryChange('all');
                  onStyleChange('all');
                }
              }}
              className="text-accent hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

