import React from "react";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";

export interface ResultSummaryProps {
  totalCount: number;
  filteredCount: number;
  activeCategory?: string;
  activeStyle?: string;
  searchQuery?: string;
  onClearFilters?: () => void;
  className?: string;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  totalCount,
  filteredCount,
  activeCategory,
  activeStyle,
  searchQuery,
  onClearFilters,
  className,
}) => {
  const hasActiveFilters = Boolean(
    (activeCategory && activeCategory !== "all" && activeCategory !== "All Categories") ||
    (activeStyle && activeStyle !== "linear") ||
    searchQuery
  );

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 text-xs ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-text-primary">
          {filteredCount} {filteredCount === 1 ? "icon" : "icons"}
        </span>
        {hasActiveFilters && (
          <span className="text-text-muted">
            (filtered from {totalCount} total)
          </span>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {searchQuery && (
            <Badge variant="primary" size="sm">
              query: "{searchQuery}"
            </Badge>
          )}
          {activeCategory && activeCategory !== "all" && (
            <Badge variant="default" size="sm">
              {activeCategory}
            </Badge>
          )}
          {activeStyle && activeStyle !== "linear" && (
            <Badge variant="default" size="sm">
              style: {activeStyle}
            </Badge>
          )}
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[11px] text-text-muted hover:text-text-primary underline flex items-center gap-0.5 ml-1"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
