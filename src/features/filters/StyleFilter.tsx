import React from "react";
import { ICON_STYLES } from "@/data/styles";
import { cn } from "@/lib/cn";

export interface StyleFilterProps {
  activeStyle: string;
  onSelectStyle: (style: string) => void;
  className?: string;
  compact?: boolean;
}

export const StyleFilter: React.FC<StyleFilterProps> = ({
  activeStyle,
  onSelectStyle,
  className,
  compact = false,
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {!compact && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-2 block">
          Styles
        </span>
      )}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => onSelectStyle("all")}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-colors select-none",
            activeStyle === "all"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default"
          )}
        >
          All Styles
        </button>
        {ICON_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectStyle(s.id)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors select-none capitalize",
              activeStyle.toLowerCase() === s.id.toLowerCase()
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default"
            )}
          >
            {s.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
