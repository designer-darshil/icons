import React from "react";
import type { Icon } from "@/types/icon";
import { SafeSvg } from "@/components/icons/SafeSvg";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, SearchX } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchResultsProps {
  results: Icon[];
  selectedIndex: number;
  onSelectIcon: (icon: Icon) => void;
  onHoverIndex: (index: number) => void;
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedIndex,
  onSelectIcon,
  onHoverIndex,
  query,
}) => {
  if (results.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <SearchX className="w-8 h-8 text-text-muted mx-auto" />
        <h4 className="text-sm font-semibold text-text-primary">No results for "{query}"</h4>
        <p className="text-xs text-text-muted">
          Try searching for broader keywords like "arrow", "interface", "settings", or "code".
        </p>
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Search Results"
      className="max-h-80 overflow-y-auto p-2 space-y-1"
    >
      {results.map((icon, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <div
            key={icon.id}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelectIcon(icon)}
            onMouseEnter={() => onHoverIndex(idx)}
            className={cn(
              "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors select-none",
              isSelected
                ? "bg-primary-subtle text-primary border border-primary/30"
                : "hover:bg-bg-surface-elevated text-text-secondary hover:text-text-primary"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-bg-surface-subtle border border-border-default flex items-center justify-center p-1 text-text-primary">
                <SafeSvg svgContent={icon.svg} viewBox={icon.viewBox} size={20} />
              </div>
              <div>
                <span className="text-sm font-semibold text-text-primary block">{icon.name}</span>
                <span className="text-[11px] text-text-muted font-mono">{icon.slug}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm" className="capitalize">
                {icon.category}
              </Badge>
              {isSelected && <ArrowRight className="w-4 h-4 text-primary animate-fade-in" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
