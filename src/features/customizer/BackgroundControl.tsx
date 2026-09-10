import React from "react";
import type { CanvasBackgroundOption } from "@/types/customization";
import { Grid, Moon, Sun, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BackgroundControlProps {
  value: CanvasBackgroundOption;
  onChange: (bg: CanvasBackgroundOption) => void;
  className?: string;
}

export const BackgroundControl: React.FC<BackgroundControlProps> = ({
  value,
  onChange,
  className,
}) => {
  const options: { id: CanvasBackgroundOption; label: string; icon: React.ReactNode }[] = [
    { id: "dots", label: "Dots Grid", icon: <Grid className="w-3.5 h-3.5" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
    { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { id: "checkerboard", label: "Checker", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "primary-subtle", label: "Tinted", icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-[11px] font-medium text-text-secondary block">
        Preview Canvas Backdrop
      </span>
      <div className="grid grid-cols-5 gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.id)}
            className={cn(
              "py-1.5 px-1 rounded-md text-[11px] flex flex-col items-center justify-center gap-1 transition-colors select-none",
              value === opt.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated border border-border-subtle"
            )}
          >
            {opt.icon}
            <span className="text-[9px] truncate w-full text-center">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
