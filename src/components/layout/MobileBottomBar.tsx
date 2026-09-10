import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { Grid, Heart, FolderHeart, SlidersHorizontal } from "lucide-react";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useCollections } from "@/features/collections/useCollections";

export interface MobileBottomBarProps {
  onFilterClick?: () => void;
  className?: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onFilterClick,
  className,
}) => {
  const { count: favoriteCount } = useFavorites();
  const { count: collectionCount } = useCollections();

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-30 min-h-[56px] pb-safe bg-surface/90 backdrop-blur-lg border-t border-border/70 flex items-center justify-around px-2 shadow-lg",
        className
      )}
    >
      <NavLink
        to="/icons"
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center justify-center gap-1 text-[11px] font-medium py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors",
            isActive
              ? "text-brand-500 font-semibold"
              : "text-foreground-muted hover:text-foreground"
          )
        }
      >
        <Grid className="w-4 h-4" />
        <span>Icons</span>
      </NavLink>

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium py-1 px-3 min-w-[56px] min-h-[44px] text-foreground-muted hover:text-foreground transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      )}

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          cn(
            "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors",
            isActive
              ? "text-brand-500 font-semibold"
              : "text-foreground-muted hover:text-foreground"
          )
        }
      >
        <div className="relative">
          <Heart className="w-4 h-4" />
          {favoriteCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
              {favoriteCount}
            </span>
          )}
        </div>
        <span>Favorites</span>
      </NavLink>

      <NavLink
        to="/collections"
        className={({ isActive }) =>
          cn(
            "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors",
            isActive
              ? "text-brand-500 font-semibold"
              : "text-foreground-muted hover:text-foreground"
          )
        }
      >
        <div className="relative">
          <FolderHeart className="w-4 h-4" />
          {collectionCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold">
              {collectionCount}
            </span>
          )}
        </div>
        <span>Sets</span>
      </NavLink>
    </nav>
  );
};
