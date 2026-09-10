import React from "react";
import type { GridDensity } from "@/types/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Grid3X3, Grid2X2, LayoutGrid } from "lucide-react";
import { ResultSummary } from "./ResultSummary";

export interface IconGridToolbarProps {
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  totalCount: number;
  filteredCount: number;
  activeCategory?: string;
  activeStyle?: string;
  searchQuery?: string;
  onClearFilters?: () => void;
  className?: string;
}

export const IconGridToolbar: React.FC<IconGridToolbarProps> = ({
  density,
  onDensityChange,
  totalCount,
  filteredCount,
  activeCategory,
  activeStyle,
  searchQuery,
  onClearFilters,
  className,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-3 ${className}`}>
      {/* Result Count and active filters */}
      <ResultSummary
        totalCount={totalCount}
        filteredCount={filteredCount}
        activeCategory={activeCategory}
        activeStyle={activeStyle}
        searchQuery={searchQuery}
        onClearFilters={onClearFilters}
      />

      {/* Grid Controls */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-[11px] text-text-muted hidden sm:inline">Density:</span>
        <div
          role="group"
          aria-label="Grid density selector"
          className="flex items-center bg-bg-surface border border-border-default rounded-md p-0.5"
        >
          <IconButton
            aria-label="Compact grid density"
            tooltip="Compact (80px)"
            variant={density === "compact" ? "active" : "ghost"}
            size="sm"
            className="w-7 h-7 p-1"
            onClick={() => onDensityChange("compact")}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton
            aria-label="Comfortable grid density"
            tooltip="Comfortable (110px)"
            variant={density === "comfortable" ? "active" : "ghost"}
            size="sm"
            className="w-7 h-7 p-1"
            onClick={() => onDensityChange("comfortable")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton
            aria-label="Spacious grid density"
            tooltip="Spacious (140px)"
            variant={density === "spacious" ? "active" : "ghost"}
            size="sm"
            className="w-7 h-7 p-1"
            onClick={() => onDensityChange("spacious")}
          >
            <Grid2X2 className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
