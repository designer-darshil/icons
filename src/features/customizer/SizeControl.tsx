import React from "react";
import { SIZE_PRESETS } from "@/types/customization";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SizeControlProps {
  size: number;
  onChange: (size: number) => void;
  className?: string;
}

export const SizeControl: React.FC<SizeControlProps> = ({ size, onChange, className }) => {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary">
          <Maximize2 className="w-3.5 h-3.5 text-primary" />
          <span>Size & Canvas Scale</span>
        </div>
        <span className="text-[11px] font-mono font-medium text-primary bg-primary-subtle px-1.5 py-0.2 rounded border border-primary/20">
          {size}px
        </span>
      </div>

      {/* Slider & Numeric Input */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={16}
          max={96}
          step={2}
          value={size}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary cursor-pointer h-1.5 bg-bg-surface-subtle rounded-lg border border-border-default"
        />
        <input
          type="number"
          min={12}
          max={128}
          value={size}
          onChange={(e) => onChange(Math.max(12, Math.min(128, Number(e.target.value) || 24)))}
          className="w-14 h-control-sm px-2 text-xs font-mono text-center bg-bg-surface border border-border-default rounded-md text-text-primary focus-visible:ring-1 focus-visible:ring-border-focus"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {SIZE_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              "px-2.5 py-1 sm:py-0.5 rounded text-[11px] font-mono transition-colors touch-manipulation",
              size === preset
                ? "bg-brand-500 text-white font-semibold shadow-xs"
                : "bg-surface-muted text-foreground-muted hover:text-foreground hover:bg-surface border border-border/60"
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
