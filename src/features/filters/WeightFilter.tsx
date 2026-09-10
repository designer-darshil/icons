import React from "react";
import type { StrokeWeightFilter } from "@/types/filters";
import { cn } from "@/lib/cn";

export interface WeightFilterProps {
  activeWeight: StrokeWeightFilter;
  onSelectWeight: (weight: StrokeWeightFilter) => void;
  className?: string;
}

export const WeightFilter: React.FC<WeightFilterProps> = ({
  activeWeight,
  onSelectWeight,
  className,
}) => {
  const options: { id: StrokeWeightFilter; label: string }[] = [
    { id: "all", label: "All Weights" },
    { id: "regular", label: "Regular (<2.5px)" },
    { id: "bold", label: "Heavy (≥2.5px)" },
    { id: "stroke-only", label: "Stroke Vectors" },
  ];

  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-2 block">
        Stroke Weight
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectWeight(opt.id)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors select-none",
              activeWeight === opt.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
