import React from "react";
import type { Icon, GridDensity } from "@/types/icon";
import { IconCard } from "./IconCard";
import { IconSkeleton } from "./IconSkeleton";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import "@/styles/icon-grid.scss";

export interface IconGridProps {
  icons: Icon[];
  selectedIconId?: string;
  onSelectIcon?: (icon: Icon) => void;
  onToggleFavorite?: (icon: Icon) => void;
  onAddToCollection?: (icon: Icon) => void;
  favoriteIds?: Set<string>;
  density?: GridDensity;
  isLoading?: boolean;
  onResetFilters?: () => void;
  className?: string;
}

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  selectedIconId,
  onSelectIcon,
  onToggleFavorite,
  onAddToCollection,
  favoriteIds = new Set(),
  density = "comfortable",
  isLoading = false,
  onResetFilters,
  className,
}) => {
  if (isLoading) {
    return <IconSkeleton density={density} count={18} className={className} />;
  }

  if (icons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-default bg-bg-surface/40 p-12 text-center space-y-4 my-6">
        <div className="w-12 h-12 rounded-xl bg-bg-subtle text-text-muted flex items-center justify-center mx-auto">
          <SearchX className="w-6 h-6" />
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">No Icons Found</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            No icons match your active search query or filters. Try adjusting keywords or category filters.
          </p>
        </div>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="grid"
      aria-label="Vector Icon Library"
      className={cn("icon-grid", `density-${density}`, className)}
    >
      {icons.map((icon) => (
        <IconCard
          key={icon.id}
          icon={icon}
          isSelected={selectedIconId === icon.id || selectedIconId === icon.slug}
          onSelect={onSelectIcon}
          onFavoriteToggle={onToggleFavorite}
          onAddToCollection={onAddToCollection}
          isFavorite={favoriteIds.has(icon.id)}
        />
      ))}
    </div>
  );
};
