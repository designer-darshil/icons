import React from "react";
import type { Icon } from "@/types/icon";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Heart, FolderPlus, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IconDetailHeaderProps {
  icon: Icon;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToCollection?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
}

export const IconDetailHeader: React.FC<IconDetailHeaderProps> = ({
  icon,
  isFavorite = false,
  onToggleFavorite,
  onAddToCollection,
  onClose,
  isModal = true,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between gap-3 pb-3 border-b border-border-subtle", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {!isModal && onClose && (
          <IconButton aria-label="Back to explorer" variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </IconButton>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-primary truncate">{icon.name}</h2>
            <Badge variant="primary" size="sm" className="capitalize shrink-0">
              {icon.category}
            </Badge>
          </div>
          <span className="text-[11px] text-text-muted font-mono block truncate">
            {icon.slug}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleFavorite && (
          <IconButton
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            tooltip={isFavorite ? "Favorited" : "Favorite"}
            variant={isFavorite ? "active" : "secondary"}
            size="sm"
            onClick={onToggleFavorite}
          >
            <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current text-destructive")} />
          </IconButton>
        )}

        {onAddToCollection && (
          <IconButton
            aria-label="Add to collection"
            tooltip="Add to Collection"
            variant="secondary"
            size="sm"
            onClick={onAddToCollection}
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </IconButton>
        )}

        {isModal && onClose && (
          <IconButton aria-label="Close inspector" variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        )}
      </div>
    </div>
  );
};
