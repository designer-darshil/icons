import React from "react";
import { cn } from "@/lib/cn";
import type { GridDensity } from "@/types/icon";

export interface IconSkeletonProps {
  density?: GridDensity;
  count?: number;
  className?: string;
}

export const IconSkeleton: React.FC<IconSkeletonProps> = ({
  density = "comfortable",
  count = 18,
  className,
}) => {
  return (
    <div className={cn("icon-grid", `density-${density}`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="icon-card animate-pulse border border-border-subtle bg-bg-surface/50 p-3 flex flex-col items-center justify-between"
        >
          <div className="w-8 h-8 rounded bg-bg-subtle/80 my-auto" />
          <div className="w-12 h-2.5 rounded bg-bg-subtle/80 mt-2" />
        </div>
      ))}
    </div>
  );
};
