import React from "react";
import { Sliders } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StrokeControlProps {
  strokeWidth: number;
  onChange: (width: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StrokeControl: React.FC<StrokeControlProps> = ({
  strokeWidth,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("space-y-2.5", className, disabled && "opacity-40")}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary">
          <Sliders className="w-3.5 h-3.5 text-primary" />
          <span>Stroke Width</span>
        </div>
        <span className="text-[11px] font-mono font-medium text-primary bg-primary-subtle px-1.5 py-0.2 rounded border border-primary/20">
          {disabled ? "N/A (Filled)" : `${strokeWidth.toFixed(2)}px`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.25}
          value={strokeWidth}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary cursor-pointer h-1.5 bg-bg-surface-subtle rounded-lg border border-border-default disabled:cursor-not-allowed"
        />
        <div className="flex items-center gap-1">
          {[1, 1.5, 2, 2.5, 3].map((w) => (
            <button
              key={w}
              type="button"
              disabled={disabled}
              onClick={() => onChange(w)}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors",
                strokeWidth === w
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated border border-border-subtle"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
