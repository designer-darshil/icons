import React, { useState, useCallback } from 'react';
import type { Icon } from '@/types/icon';
import { SafeSvg } from '@/components/icons/SafeSvg';
import { IconCardActions } from './IconCardActions';
import { buildCustomSvgString } from '@/lib/icon-renderer';
import { copyToClipboard } from '@/lib/export-svg';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface IconCardProps {
  icon: Icon;
  isSelected?: boolean;
  onSelect?: (icon: Icon) => void;
  onFavoriteToggle?: (icon: Icon) => void;
  onAddToCollection?: (icon: Icon) => void;
  isFavorite?: boolean;
  className?: string;
}

export const IconCard: React.FC<IconCardProps> = React.memo(
  ({
    icon,
    isSelected = false,
    onSelect,
    onFavoriteToggle,
    onAddToCollection,
    isFavorite = false,
    className,
  }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopySvg = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        const svgString = buildCustomSvgString(icon.svg, icon.viewBox);
        const ok = await copyToClipboard(svgString);
        if (ok) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1400);
        }
      },
      [icon]
    );

    const handleFavorite = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavoriteToggle?.(icon);
      },
      [icon, onFavoriteToggle]
    );

    const handleClick = useCallback(() => {
      onSelect?.(icon);
    }, [icon, onSelect]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(icon);
        }
      },
      [icon, onSelect]
    );

    const variantCount = icon.variants?.length || 1;

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${icon.name} vector specimen`}
        aria-selected={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex flex-col justify-between aspect-[4/4.8] sm:aspect-[4/4.6] p-4 sm:p-5 rounded-sm select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden',
          'bg-bg-secondary/20 hover:bg-bg-secondary/60 border border-border-subtle/40 hover:border-border-strong/80 hover:-translate-y-1 hover:shadow-dropdown',
          isSelected && 'border-accent bg-bg-secondary/90 ring-1 ring-accent shadow-dropdown',
          className
        )}
      >
        {/* Top Floating Strip: Category Tag */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary select-none">
          <span className="truncate max-w-[70%] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
            {icon.category}
          </span>
          {variantCount > 1 && (
            <span className="type-icon-count text-text-tertiary px-1.5 py-0.5 rounded-full bg-bg-elevated/60 border border-border-subtle/60">
              {variantCount} styles
            </span>
          )}
        </div>

        {/* Vector Preview Stage */}
        <div className="relative flex-1 flex items-center justify-center my-2 select-none">
          <div className="relative z-10 flex items-center justify-center text-text-primary transform group-hover:-translate-y-1.5 group-hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <SafeSvg
              icon={icon}
              size={44}
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
            />
          </div>
        </div>

        {/* Floating Quick Action Overlay */}
        <IconCardActions
          onCopySvg={handleCopySvg}
          onToggleFavorite={onFavoriteToggle ? handleFavorite : undefined}
          onAddToCollection={onAddToCollection ? (e) => { e.stopPropagation(); onAddToCollection(icon); } : undefined}
          onOpenStudio={handleClick}
          isFavorite={isFavorite}
          isCopied={isCopied}
        />

        {/* Bottom Editorial Footnote: Icon Name & Hover Arrow */}
        <div className="w-full pt-3 border-t border-border-subtle/30 flex items-center justify-between gap-2">
          <span className="text-sm font-medium tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
            {icon.name}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
        </div>
      </div>
    );
  }
);

IconCard.displayName = 'IconCard';

