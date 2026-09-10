import React from "react";
import { COLOR_SWATCHES } from "@/types/customization";
import { Palette, Pipette } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ColorControlProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ColorControl: React.FC<ColorControlProps> = ({
  color,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span>Color & Accent</span>
        </div>
        <span className="text-[11px] font-mono text-text-muted">{color}</span>
      </div>

      {/* Swatch Matrix */}
      <div className="flex flex-wrap gap-2 sm:gap-1.5 items-center">
        {COLOR_SWATCHES.map((swatch) => {
          const isSelected = color.toLowerCase() === swatch.value.toLowerCase();
          return (
            <button
              key={swatch.value}
              type="button"
              disabled={disabled}
              title={swatch.label}
              onClick={() => onChange(swatch.value)}
              className={cn(
                "w-7 h-7 sm:w-6 sm:h-6 rounded-full border transition-all cursor-pointer relative flex items-center justify-center touch-manipulation",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-bg-surface border-primary scale-105"
                  : "border-border-default hover:scale-110",
                disabled && "opacity-40 cursor-not-allowed"
              )}
              style={{
                backgroundColor: swatch.value === "currentColor" ? "var(--color-text-primary)" : swatch.value,
              }}
            >
              {swatch.value === "currentColor" && (
                <span className="text-[8px] font-bold text-bg-surface select-none">A</span>
              )}
            </button>
          );
        })}

        {/* Custom Color Input Picker */}
        <label
          title="Custom Color Picker"
          className="relative w-7 h-7 sm:w-6 sm:h-6 rounded-full border border-border-default hover:border-border-strong bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center cursor-pointer overflow-hidden transition-transform hover:scale-110 shadow-xs touch-manipulation"
        >
          <Pipette className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white drop-shadow-md pointer-events-none" />
          <input
            type="color"
            value={color.startsWith("#") ? color : "#3b82f6"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
};
