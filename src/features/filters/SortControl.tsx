import React from "react";
import type { SortOption } from "@/types/filters";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SortControlProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export const SortControl: React.FC<SortControlProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <ArrowUpDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
      <select
        aria-label="Sort icons by"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-control-sm px-2 bg-bg-surface border border-border-default rounded-md text-text-primary text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus cursor-pointer"
      >
        <option value="popular">Most Popular</option>
        <option value="name-asc">Name (A → Z)</option>
        <option value="name-desc">Name (Z → A)</option>
        <option value="newest">Recently Updated</option>
      </select>
    </div>
  );
};
