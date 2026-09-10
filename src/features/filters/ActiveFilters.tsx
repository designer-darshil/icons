import React from "react";
import type { FilterState } from "@/types/filters";
import { Badge } from "@/components/ui/Badge";
import { X, RotateCcw } from "lucide-react";

export interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: <K extends keyof FilterState>(key: K) => void;
  onClearAll: () => void;
  className?: string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}) => {
  const activeChips: { key: keyof FilterState; label: string }[] = [];

  if (filters.query) {
    activeChips.push({ key: "query", label: `"${filters.query}"` });
  }
  if (filters.category && filters.category !== "all") {
    activeChips.push({ key: "category", label: `Category: ${filters.category}` });
  }
  if (filters.style && filters.style !== "all") {
    activeChips.push({ key: "style", label: `Style: ${filters.style}` });
  }
  if (filters.strokeWeight && filters.strokeWeight !== "all") {
    activeChips.push({ key: "strokeWeight", label: `Weight: ${filters.strokeWeight}` });
  }
  if (filters.tag) {
    activeChips.push({ key: "tag", label: `#${filters.tag}` });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 pt-2 ${className}`}>
      <span className="text-[11px] text-text-muted mr-1">Active:</span>
      {activeChips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemoveFilter(chip.key)}
          className="inline-flex items-center gap-1 group"
        >
          <Badge variant="primary" size="sm" className="pr-1 gap-1 cursor-pointer">
            <span>{chip.label}</span>
            <X className="w-3 h-3 group-hover:text-destructive transition-colors" />
          </Badge>
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-[11px] text-text-muted hover:text-text-primary underline flex items-center gap-1 ml-2 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
