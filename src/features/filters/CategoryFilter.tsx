import React from "react";
import { ICON_CATEGORIES } from "@/data/categories";
import { GRIDFRAME_ICONS } from "@/data/icons/gridframe-catalog";
import { cn } from "@/lib/cn";

export interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
  horizontal?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  className,
  horizontal = false,
}) => {
  if (horizontal) {
    return (
      <div className={cn("flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar", className)}>
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors select-none",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default"
          )}
        >
          All ({GRIDFRAME_ICONS.length})
        </button>
        {ICON_CATEGORIES.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase() || activeCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors select-none",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default"
              )}
            >
              {cat.name} {cat.count > 0 && <span className="opacity-70 text-[10px]">({cat.count})</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-2 block mb-1">
        Categories
      </span>
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={cn(
          "w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between select-none",
          activeCategory === "all"
            ? "bg-primary-subtle text-primary font-semibold border border-primary/20"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
        )}
      >
        <span>All Categories</span>
        <span className="text-[10px] text-text-muted font-mono">{GRIDFRAME_ICONS.length}</span>
      </button>
      {ICON_CATEGORIES.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase() || activeCategory.toLowerCase() === cat.name.toLowerCase();
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={cn(
              "w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between select-none",
              isActive
                ? "bg-primary-subtle text-primary font-semibold border border-primary/20"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
            )}
          >
            <span>{cat.name}</span>
            <span className="text-[10px] text-text-muted font-mono">{cat.count}</span>
          </button>
        );
      })}
    </div>
  );
};
