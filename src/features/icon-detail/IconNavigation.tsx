import React from "react";
import type { Icon } from "@/types/icon";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IconNavigationProps {
  prevIcon: Icon | null;
  nextIcon: Icon | null;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const IconNavigation: React.FC<IconNavigationProps> = ({
  prevIcon,
  nextIcon,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between gap-2 text-xs py-1", className)}>
      <IconButton
        aria-label={prevIcon ? `Previous icon: ${prevIcon.name}` : "Previous icon"}
        tooltip={prevIcon ? `Previous: ${prevIcon.name} ( [ )` : undefined}
        variant="secondary"
        size="sm"
        disabled={!prevIcon}
        onClick={onPrev}
      >
        <ChevronLeft className="w-4 h-4" />
      </IconButton>

      {currentIndex >= 0 && totalCount > 0 && (
        <span className="text-[11px] font-mono text-text-muted select-none">
          {currentIndex + 1} of {totalCount}
        </span>
      )}

      <IconButton
        aria-label={nextIcon ? `Next icon: ${nextIcon.name}` : "Next icon"}
        tooltip={nextIcon ? `Next: ${nextIcon.name} ( ] )` : undefined}
        variant="secondary"
        size="sm"
        disabled={!nextIcon}
        onClick={onNext}
      >
        <ChevronRight className="w-4 h-4" />
      </IconButton>
    </div>
  );
};
