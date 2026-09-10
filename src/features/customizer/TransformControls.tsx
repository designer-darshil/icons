import React from "react";
import { RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

export interface TransformControlsProps {
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  onRotate: () => void;
  onToggleFlipX: () => void;
  onToggleFlipY: () => void;
  className?: string;
}

export const TransformControls: React.FC<TransformControlsProps> = ({
  rotation,
  flipX,
  flipY,
  onRotate,
  onToggleFlipX,
  onToggleFlipY,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs font-medium text-text-primary">
        <span>Transform & Orientation</span>
        <span className="text-[11px] font-mono text-text-muted">{rotation}°</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRotate}
          className="flex-1 py-1.5 px-3 rounded-md border border-border-default bg-bg-surface hover:bg-bg-surface-elevated flex items-center justify-center gap-2 text-xs font-medium text-text-primary transition-colors cursor-pointer select-none"
        >
          <RotateCw className="w-3.5 h-3.5 text-primary" />
          <span>Rotate 90°</span>
        </button>

        <IconButton
          aria-label="Flip Horizontally"
          tooltip="Flip Horizontal"
          variant={flipX ? "active" : "secondary"}
          size="md"
          onClick={onToggleFlipX}
        >
          <FlipHorizontal className="w-4 h-4" />
        </IconButton>

        <IconButton
          aria-label="Flip Vertically"
          tooltip="Flip Vertical"
          variant={flipY ? "active" : "secondary"}
          size="md"
          onClick={onToggleFlipY}
        >
          <FlipVertical className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};
