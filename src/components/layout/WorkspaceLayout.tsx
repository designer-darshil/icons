import React, { useState } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { DetailPanel } from "./DetailPanel";
import { MobileBottomBar } from "./MobileBottomBar";
import { cn } from "@/lib/cn";

export interface WorkspaceLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  detailContent?: React.ReactNode;
  detailTitle?: string;
  showSidebar?: boolean;
  showDetailPanel?: boolean;
  onCloseDetail?: () => void;
  onFilterClick?: () => void;
  className?: string;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  sidebarContent,
  detailContent,
  detailTitle,
  showSidebar = true,
  showDetailPanel = false,
  onCloseDetail,
  onFilterClick,
  className,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={cn("flex-1 flex flex-row min-h-0 w-full relative", className)}>
      {/* Left Sidebar (Desktop ≥1024px) */}
      {showSidebar && (
        <DesktopSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          {sidebarContent}
        </DesktopSidebar>
      )}

      {/* Main Workstation Exploration Surface */}
      <main
        id="main-content"
        className="flex-1 min-w-0 flex flex-col overflow-y-auto pb-20 md:pb-6"
      >
        {children}
      </main>

      {/* Right Detail Inspector Panel */}
      <DetailPanel
        isOpen={showDetailPanel}
        onClose={onCloseDetail || (() => {})}
        title={detailTitle}
      >
        {detailContent}
      </DetailPanel>

      {/* Mobile Sticky Bottom Bar (<768px) */}
      <MobileBottomBar onFilterClick={onFilterClick} />
    </div>
  );
};
