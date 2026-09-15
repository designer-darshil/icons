import React, { useEffect } from "react";
import { cn } from "@/lib/cn";
import { X, Sparkles, Sliders } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { motion, AnimatePresence } from "framer-motion";

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  onClose,
  children,
  title = "Icon Studio Inspector",
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile/tablet when open via unified scroll lock
  const isMobileOrTablet = typeof window !== "undefined" && window.innerWidth < 1280;
  useScrollLock(isOpen && isMobileOrTablet);


  if (!isOpen) return null;

  return (
    <>
      {/* Mobile / Tablet (<1280px) Full-Screen / Modal Sheet */}
      <div className="xl:hidden">
        <AnimatePresence>
          {isOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 bg-black/60"
              onClick={onClose}
            >
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
                className="w-full sm:max-w-xl h-[92vh] sm:h-[88vh] rounded-t-3xl sm:rounded-2xl bg-surface border border-border flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Drawer Header */}
                <div className="p-4 border-b border-border/80 flex items-center justify-between bg-surface sticky top-0 z-20">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-foreground">{title}</h2>
                  </div>
                  <IconButton
                    aria-label="Close inspector"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </IconButton>
                </div>

                {/* Mobile Drawer Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-safe overscroll-contain scrollbar-thin">
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop (≥1280px) Docked Side Panel */}
      <aside
        aria-label="Icon Details & Customizer"
        className={cn(
          "hidden xl:flex flex-col w-[390px] 2xl:w-[430px] border-l border-border/70 bg-surface shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
          className
        )}
      >
        {/* Detail Panel Header */}
        <div className="p-4 border-b border-border/70 flex items-center justify-between sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          </div>
          <IconButton
            aria-label="Close detail inspector"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 space-y-4">
          {children ? (
            children
          ) : (
            <div className="p-4 rounded-lg bg-surface-muted/50 border border-border text-xs text-foreground-muted space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Inspector Workspace</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                When an icon is selected from the grid, live preview canvas, variant switcher, stroke controls, and export code tabs will mount here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
