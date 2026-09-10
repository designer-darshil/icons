import React from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export interface TagFilterProps {
  activeTag?: string;
  onSelectTag: (tag: string | undefined) => void;
  tags?: string[];
  className?: string;
}

const POPULAR_TAGS = [
  "lightning",
  "navigation",
  "direction",
  "developer",
  "protection",
  "audio",
  "video",
  "computer",
  "storage",
  "favorite",
];

export const TagFilter: React.FC<TagFilterProps> = ({
  activeTag,
  onSelectTag,
  tags = POPULAR_TAGS,
  className,
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-2 block">
        Popular Tags
      </span>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => {
          const isActive = activeTag?.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(isActive ? undefined : tag)}
              className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus rounded-sm"
            >
              <Badge
                variant={isActive ? "primary" : "default"}
                size="sm"
                className="cursor-pointer hover:border-border-strong transition-colors"
              >
                #{tag}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
};
