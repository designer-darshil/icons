import React from "react";
import type { SearchSuggestion } from "@/types/filters";
import { Sparkles, Tag } from "lucide-react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

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
              <CategoryIcon
                categorySlug={s.category || s.text}
                size={14}
                className="w-3.5 h-3.5 text-accent shrink-0"
              />
            ) : (
              <Tag className="w-3 h-3 text-text-tertiary shrink-0" />
            )}
            <span className="capitalize">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

