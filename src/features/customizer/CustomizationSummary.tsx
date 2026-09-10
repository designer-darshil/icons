import React from "react";
import type { IconCustomization } from "@/types/customization";
import { Badge } from "@/components/ui/Badge";
import { RotateCcw } from "lucide-react";

export interface CustomizationSummaryProps {
  customization: IconCustomization;
  defaultStrokeWidth?: number;
  hasModifications: boolean;
  onReset: () => void;
  className?: string;
}

export const CustomizationSummary: React.FC<CustomizationSummaryProps> = ({
  customization,
  defaultStrokeWidth = 2,
  hasModifications,
  onReset,
  className,
}) => {
  if (!hasModifications) return null;

  return (
    <div className={`p-2.5 rounded-lg bg-primary-subtle border border-primary/20 space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">
          Modified Parameters
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1 text-[11px]">
        {customization.color !== "currentColor" && (
          <Badge variant="primary" size="sm">
            color: {customization.color}
          </Badge>
        )}
        {customization.size !== 24 && (
          <Badge variant="primary" size="sm">
            size: {customization.size}px
          </Badge>
        )}
        {customization.strokeWidth !== defaultStrokeWidth && (
          <Badge variant="primary" size="sm">
            stroke: {customization.strokeWidth}px
          </Badge>
        )}
        {customization.rotation !== 0 && (
          <Badge variant="primary" size="sm">
            rotate: {customization.rotation}°
          </Badge>
        )}
        {(customization.flipX || customization.flipY) && (
          <Badge variant="primary" size="sm">
            flip: {customization.flipX ? "X" : ""}
            {customization.flipY ? "Y" : ""}
          </Badge>
        )}
      </div>
    </div>
  );
};
