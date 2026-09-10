import React from "react";
import type { IconVariant } from "@/types/icon";
import { cn } from "@/lib/cn";

export interface VariantSwitcherProps {
  variants: IconVariant[];
  selectedIndex: number;
  onSelectVariant: (index: number) => void;
  className?: string;
}

export const VariantSwitcher: React.FC<VariantSwitcherProps> = ({
  variants,
  selectedIndex,
  onSelectVariant,
  className,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-text-muted text-[10px]">
          Style Variants ({variants.length})
        </span>
        <span className="text-[11px] text-primary font-medium capitalize">
          {variants[selectedIndex]?.label || "Linear"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {variants.map((variant, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(idx)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center truncate select-none",
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default hover:bg-bg-surface-elevated"
              )}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
