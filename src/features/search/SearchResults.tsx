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
        <SearchX className="w-8 h-8 text-text-tertiary mx-auto" />
        <h4 className="text-sm font-semibold text-text-primary">No results for "{query}"</h4>
        <p className="text-xs text-text-tertiary">
          Try searching for broader keywords like "arrow", "interface", "settings", or "code".
        </p>
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Search Results"
      className="max-h-80 overflow-y-auto native-scroll p-2 space-y-1"
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
                ? "bg-accent/10 text-text-primary border border-accent/30 font-medium"
                : "hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent"
            )}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-md bg-bg-secondary border border-border-default flex items-center justify-center p-1 text-text-primary shrink-0">
                <SafeSvg svgContent={icon.svg} viewBox={icon.viewBox} size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-text-primary block truncate">{icon.name}</span>
                <span className="text-[11px] text-text-tertiary font-mono block truncate">{icon.slug}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="default" size="sm" className="capitalize">
                {icon.category}
              </Badge>
              {isSelected && <ArrowRight className="w-4 h-4 text-accent" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
