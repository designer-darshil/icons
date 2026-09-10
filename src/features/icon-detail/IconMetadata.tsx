import React from "react";
import type { Icon } from "@/types/icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export interface IconMetadataProps {
  icon: Icon;
  className?: string;
}

export const IconMetadata: React.FC<IconMetadataProps> = ({ icon, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="p-3.5 bg-bg-surface-subtle rounded-xl border border-border-subtle space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Slug:</span>
          <span className="font-mono text-text-primary font-medium">{icon.slug}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Category:</span>
          <Badge variant="default" size="sm" className="capitalize">
            {icon.category}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Popularity:</span>
          <span className="text-primary font-medium">{icon.popularity}/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted">License:</span>
          <span className="text-text-secondary">{icon.metadata?.license || "MIT Open Source"}</span>
        </div>
      </div>

      {/* Tags */}
      {icon.tags && icon.tags.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
            Search Tags
          </span>
          <div className="flex flex-wrap gap-1">
            {icon.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
