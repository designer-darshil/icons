import React, { useState, useCallback } from "react";
import type { Icon } from "@/types/icon";
import { SafeSvg } from "@/components/icons/SafeSvg";
import { IconCardActions } from "./IconCardActions";
import { buildCustomSvgString } from "@/lib/icon-renderer";
import { copyToClipboard } from "@/lib/export-svg";
import { cn } from "@/lib/cn";

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
          setTimeout(() => setIsCopied(false), 1800);
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
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(icon);
        }
      },
      [icon, onSelect]
    );

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${icon.name} icon, category ${icon.category}`}
        aria-selected={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "icon-card group relative p-3 rounded-lg border flex flex-col items-center justify-between text-center select-none transition-all",
          isSelected
            ? "is-selected border-primary bg-primary-subtle ring-1 ring-primary/30"
            : "border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-surface-elevated",
          className
        )}
      >
        {/* Quick Action Overlay */}
        <IconCardActions
          onCopySvg={handleCopySvg}
          onToggleFavorite={onFavoriteToggle ? handleFavorite : undefined}
          onAddToCollection={onAddToCollection ? (e) => { e.stopPropagation(); onAddToCollection(icon); } : undefined}
          onOpenStudio={handleClick}
          isFavorite={isFavorite}
          isCopied={isCopied}
        />

        {/* Vector Preview Slot */}
        <div className="icon-preview-slot my-auto flex items-center justify-center p-2 text-text-primary group-hover:scale-105 transition-transform duration-150">
          <SafeSvg
            svgContent={icon.svg}
            viewBox={icon.viewBox}
            size="100%"
            className="w-full h-full"
          />
        </div>

        {/* Icon Name Label */}
        <div className="w-full mt-2 pt-1 border-t border-border-subtle/50">
          <span className="icon-card-name block truncate text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {icon.name}
          </span>
        </div>
      </div>
    );
  }
);

IconCard.displayName = "IconCard";
