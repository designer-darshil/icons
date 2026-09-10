import React, { useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkiperSegmentedTabs } from '@/components/ui/skiper';
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
}

const CATEGORIES = ['All', ...ICON_CATEGORIES.map((c) => c.name)];

const STYLES: { id: IconStyle | 'all'; label: string }[] = [
  { id: 'all', label: 'All Styles' },
  { id: 'outline', label: 'Outline' },
  { id: 'filled', label: 'Filled' },
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
}) => {
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (offset: number) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Bar: Title, Count, Search, and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-base font-bold font-mono tracking-tight text-text-primary uppercase">
            {selectedCategory === 'all' || selectedCategory === 'All' ? 'All Icons' : selectedCategory}
          </h1>
          <span className="text-xs font-mono text-text-tertiary">
            {filteredCount === totalCount ? `${totalCount.toLocaleString()}` : `${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()}`}
          </span>
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 md:w-80">
            <Input
              type="text"
              placeholder="Search icons, categories, tags..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onClear={() => onQueryChange('')}
              prefixIcon={<Search className="w-3.5 h-3.5" />}
              suffixIcon={
                <kbd className="text-[10px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 border border-border-default rounded-xs">
                  ⌘K
                </kbd>
              }
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort icons"
              className="h-9 px-2.5 bg-bg-secondary text-text-secondary border border-border-default rounded-md text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus cursor-pointer hover:border-border-strong transition-colors"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="relative flex items-center group">
        <button
          type="button"
          onClick={() => scrollCategories(-180)}
          aria-label="Scroll categories left"
          className="hidden md:flex items-center justify-center w-6 h-7 bg-bg-primary/90 border border-border-default rounded-l-xs text-text-tertiary hover:text-text-primary z-10"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={categoryScrollRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full"
        >
          {CATEGORIES.map((cat) => {
            const isActive =
              (cat === 'All' && (selectedCategory === 'all' || selectedCategory === 'All')) ||
              cat.toLowerCase() === selectedCategory.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat === 'All' ? 'all' : cat)}
                className={cn(
                  'h-7 px-3 rounded-md text-xs font-medium whitespace-nowrap transition-colors select-none cursor-pointer shrink-0 border',
                  isActive
                    ? 'bg-action-primary text-text-inverse border-action-primary font-semibold'
                    : 'bg-bg-secondary text-text-secondary border-border-default hover:text-text-primary hover:border-border-strong'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollCategories(180)}
          aria-label="Scroll categories right"
          className="hidden md:flex items-center justify-center w-6 h-7 bg-bg-primary/90 border border-border-default rounded-r-xs text-text-tertiary hover:text-text-primary z-10"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Style Filters Row using SkiperSegmentedTabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
          Style:
        </span>
        <SkiperSegmentedTabs
          tabs={STYLES}
          activeId={selectedStyle}
          onChange={(id) => onStyleChange(id as IconStyle | 'all')}
          layoutId="explorer-style-tab-pill"
          size="xs"
        />
      </div>
    </div>
  );
};

