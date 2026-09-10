import React from "react";
import type { Icon } from "@/types/icon";
import { SafeSvg } from "@/components/icons/SafeSvg";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export interface RelatedIconsProps {
  relatedIcons: Icon[];
  onSelectIcon: (icon: Icon) => void;
  className?: string;
}

export const RelatedIcons: React.FC<RelatedIconsProps> = ({
  relatedIcons,
  onSelectIcon,
  className,
}) => {
  if (!relatedIcons || relatedIcons.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center gap-1.5 text-xs">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold uppercase tracking-wider text-text-muted text-[10px]">
          Related Icons
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {relatedIcons.map((icon) => (
          <button
            key={icon.id}
            type="button"
            onClick={() => onSelectIcon(icon)}
            title={icon.name}
            className="p-2 rounded-lg border border-border-default bg-bg-surface hover:border-border-strong hover:bg-bg-surface-elevated flex flex-col items-center justify-center gap-1 group transition-all cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center text-text-primary group-hover:text-primary transition-colors">
              <SafeSvg svgContent={icon.svg} viewBox={icon.viewBox} size={18} />
            </div>
            <span className="text-[10px] text-text-muted truncate w-full text-center block group-hover:text-text-primary">
              {icon.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
