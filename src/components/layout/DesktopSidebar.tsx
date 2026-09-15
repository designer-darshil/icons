import React from "react";
import { cn } from "@/lib/cn";
import { Layers, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

export interface DesktopSidebarProps {
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  children,
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  return (
    <aside
      aria-label="Sidebar Filters"
      className={cn(
        "hidden lg:flex flex-col border-r border-border-subtle bg-bg-surface transition-[width] duration-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
        isCollapsed ? "w-14" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-border-subtle flex items-center justify-between min-h-[49px]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Filters & Sets
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <IconButton
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </IconButton>
        )}
      </div>

      {/* Content Slot / Placeholder */}
      <div className="flex-1 p-3 space-y-4">
        {children ? (
          children
        ) : (
          <div className="text-xs text-text-muted space-y-2 p-2 rounded bg-bg-subtle/50 border border-border-subtle">
            <div className="flex items-center gap-2 text-text-secondary font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Filter Rail</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Categories, styles, and stroke weight controls will populate this region in Phase 3.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
