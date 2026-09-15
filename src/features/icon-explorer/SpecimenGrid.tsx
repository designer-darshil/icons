import React, { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Icon, IconStyle } from '@/types/icon';
import { SpecimenCard } from './SpecimenCard';
import { Button } from '@/components/ui/Button';
import { SearchX, RotateCcw, Loader2 } from 'lucide-react';

const BATCH_SIZE = 64;

export interface SpecimenGridProps {
  icons: Icon[];
  selectedIconId?: string | null;
  favoriteIds?: Set<string>;
  activeStyle?: IconStyle | 'all';
  forceRegular?: boolean;
  onSelectIcon: (icon: Icon) => void;
  onToggleFavorite?: (icon: Icon) => void;
  onResetFilters?: () => void;
  columns?: string;
}

export const SpecimenGrid: React.FC<SpecimenGridProps> = memo(({
  icons,
  selectedIconId,
  favoriteIds = new Set(),
  activeStyle,
  forceRegular = false,
  onSelectIcon,
  onToggleFavorite,
  onResetFilters,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
}) => {
  const [renderedCount, setRenderedCount] = useState(BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset rendered count when source dataset changes
  useEffect(() => {
    setRenderedCount(BATCH_SIZE);
  }, [icons]);

  const visibleIcons = useMemo(() => {
    return icons.slice(0, renderedCount);
  }, [icons, renderedCount]);

  const hasMore = renderedCount < icons.length;

  const loadMore = useCallback(() => {
    setRenderedCount((prev) => Math.min(prev + BATCH_SIZE, icons.length));
  }, [icons.length]);

  // IntersectionObserver for reliable auto-loading next batch on scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '600px' }
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    // Viewport auto-fill: if content doesn't fill viewport on high-res monitors, load next batch
    const checkFill = setTimeout(() => {
      if (typeof window !== 'undefined' && document.documentElement.scrollHeight <= window.innerHeight + 200 && hasMore) {
        loadMore();
      }
    }, 150);

    return () => {
      clearTimeout(checkFill);
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, loadMore, renderedCount]);

  if (icons.length === 0) {
    return (
      <div className="rounded-xs border border-dashed border-border-default bg-bg-secondary p-12 text-center my-8 space-y-4 max-w-md mx-auto font-mono">
        <div className="w-10 h-10 rounded-xs bg-bg-elevated text-text-tertiary flex items-center justify-center mx-auto border border-border-default">
          <SearchX className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            No icons found
          </h3>
          <p className="text-xs text-text-tertiary">
            Try another search or clear your filters.
          </p>
        </div>
        {onResetFilters && (
          <Button variant="secondary" size="xs" onClick={onResetFilters}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="specimen-grid">
      <div className={`grid ${columns} gap-4 sm:gap-5 lg:gap-6`}>
        {visibleIcons.map((icon) => (
          <SpecimenCard
            key={icon.id || icon.slug}
            icon={icon}
            isSelected={selectedIconId === icon.id || selectedIconId === icon.slug}
            isFavorite={favoriteIds.has(icon.id) || favoriteIds.has(icon.slug)}
            activeStyle={activeStyle}
            forceRegular={forceRegular}
            onSelect={onSelectIcon}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger Sentinel */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="py-8 flex flex-col items-center justify-center gap-2 min-h-[60px]"
          data-testid="infinite-scroll-sentinel"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-text-secondary" />
            <span>Rendering specimens ({visibleIcons.length} of {icons.length.toLocaleString()})...</span>
          </div>
        </div>
      )}
    </div>
  );
});

SpecimenGrid.displayName = 'SpecimenGrid';
