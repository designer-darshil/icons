import React from "react";
import type { SearchSuggestion } from "@/types/filters";
import { Sparkles, Tag, Layers } from "lucide-react";

export interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (text: string) => void;
  className?: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  className,
}) => {
  return (
    <div className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-medium">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Suggested searches & categories</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, idx) => (
          <button
            key={`${s.text}-${idx}`}
            type="button"
            onClick={() => onSelectSuggestion(s.text)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-bg-secondary hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong transition-colors cursor-pointer"
          >
            {s.type === "category" ? (
              <Layers className="w-3 h-3 text-accent" />
            ) : (
              <Tag className="w-3 h-3 text-text-tertiary" />
            )}
            <span className="capitalize">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
