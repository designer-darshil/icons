import type { FilterState, StrokeWeightFilter } from "@/types/filters";
import { CategoryFilter } from "./CategoryFilter";
import { StyleFilter } from "./StyleFilter";
import { WeightFilter } from "./WeightFilter";
import { TagFilter } from "./TagFilter";
import { ActiveFilters } from "./ActiveFilters";
import { Separator } from "@/components/ui/Separator";

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K] | undefined) => void;
  onResetFilters: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  className,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category List */}
      <CategoryFilter
        activeCategory={filters.category}
        onSelectCategory={(cat) => onFilterChange("category", cat)}
      />

      <Separator />

      {/* Style Selector */}
      <StyleFilter
        activeStyle={filters.style}
        onSelectStyle={(st) => onFilterChange("style", st)}
      />

      <Separator />

      {/* Stroke Weight */}
      <WeightFilter
        activeWeight={filters.strokeWeight}
        onSelectWeight={(w: StrokeWeightFilter) => onFilterChange("strokeWeight", w)}
      />

      <Separator />

      {/* Popular Tags */}
      <TagFilter
        activeTag={filters.tag}
        onSelectTag={(t) => onFilterChange("tag", t)}
      />

      {/* Active Filter Chips */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={(k) => onFilterChange(k, undefined)}
        onClearAll={onResetFilters}
      />
    </div>
  );
};
