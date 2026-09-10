import React from "react";
import type { StrokeLinecap, StrokeLinejoin } from "@/types/customization";
import { cn } from "@/lib/cn";

export interface StrokeOptionsProps {
  linecap: StrokeLinecap;
  linejoin: StrokeLinejoin;
  onLinecapChange: (cap: StrokeLinecap) => void;
  onLinejoinChange: (join: StrokeLinejoin) => void;
  disabled?: boolean;
  className?: string;
}

export const StrokeOptions: React.FC<StrokeOptionsProps> = ({
  linecap,
  linejoin,
  onLinecapChange,
  onLinejoinChange,
  disabled = false,
  className,
}) => {
  const capOptions: { id: StrokeLinecap; label: string }[] = [
    { id: "round", label: "Round" },
    { id: "butt", label: "Butt" },
    { id: "square", label: "Square" },
  ];

  const joinOptions: { id: StrokeLinejoin; label: string }[] = [
    { id: "round", label: "Round" },
    { id: "miter", label: "Miter" },
    { id: "bevel", label: "Bevel" },
  ];

  return (
    <div className={cn("space-y-3", className, disabled && "opacity-40")}>
      {/* Linecap */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-text-secondary block">
          Stroke Linecap
        </span>
        <div className="grid grid-cols-3 gap-1">
          {capOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onLinecapChange(opt.id)}
              className={cn(
                "py-1 rounded text-xs font-medium transition-colors select-none",
                linecap === opt.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated border border-border-subtle"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Linejoin */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-text-secondary block">
          Stroke Linejoin
        </span>
        <div className="grid grid-cols-3 gap-1">
          {joinOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onLinejoinChange(opt.id)}
              className={cn(
                "py-1 rounded text-xs font-medium transition-colors select-none",
                linejoin === opt.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated border border-border-subtle"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
