import React from "react";
import { Copy, Heart, Check, Sliders, FolderPlus } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

export interface IconCardActionsProps {
  onCopySvg?: (e: React.MouseEvent) => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onAddToCollection?: (e: React.MouseEvent) => void;
  onOpenStudio?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
  isCopied?: boolean;
  className?: string;
}

export const IconCardActions: React.FC<IconCardActionsProps> = ({
  onCopySvg,
  onToggleFavorite,
  onAddToCollection,
  onOpenStudio,
  isFavorite = false,
  isCopied = false,
  className,
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Icon Actions"
      className={cn(
        "absolute top-1.5 right-1.5 flex items-center gap-1 transition-opacity z-10 bg-surface/90 backdrop-blur-xs p-0.5 rounded-md border border-border/80 shadow-xs",
        isFavorite
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-0 max-sm:group-active:opacity-100",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {onCopySvg && (
        <IconButton
          aria-label={isCopied ? "SVG Copied" : "Quick Copy SVG"}
          tooltip={isCopied ? "Copied!" : "Copy SVG"}
          variant={isCopied ? "active" : "ghost"}
          size="sm"
          className="w-6 h-6 p-1"
          onClick={onCopySvg}
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3 h-3" />}
        </IconButton>
      )}

      {onToggleFavorite && (
        <IconButton
          aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          tooltip={isFavorite ? "Favorited" : "Favorite"}
          variant={isFavorite ? "active" : "ghost"}
          size="sm"
          className={cn("w-6 h-6 p-1", isFavorite && "text-rose-500")}
          onClick={onToggleFavorite}
        >
          <Heart className={cn("w-3 h-3", isFavorite && "fill-rose-500 text-rose-500")} />
        </IconButton>
      )}

      {onAddToCollection && (
        <IconButton
          aria-label="Add to Collection"
          tooltip="Collection"
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-1 text-foreground-muted hover:text-foreground"
          onClick={onAddToCollection}
        >
          <FolderPlus className="w-3 h-3" />
        </IconButton>
      )}

      {onOpenStudio && (
        <IconButton
          aria-label="Inspect and Customize"
          tooltip="Customize"
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-1"
          onClick={onOpenStudio}
        >
          <Sliders className="w-3 h-3" />
        </IconButton>
      )}
    </div>
  );
};
