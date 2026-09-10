import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search 1,000+ icons by name, category, or tags...",
  autoFocus = true,
}) => {
  return (
    <div className="relative flex items-center w-full border-b border-border-subtle bg-bg-surface px-4 py-3">
      <Search className="w-5 h-5 text-text-muted shrink-0 mr-3" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-base font-normal focus:outline-none border-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search query"
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
