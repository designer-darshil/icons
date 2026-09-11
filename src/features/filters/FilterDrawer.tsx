import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FilterState, StrokeWeightFilter } from "@/types/filters";
import { CategoryFilter } from "./CategoryFilter";
import { StyleFilter } from "./StyleFilter";
import { WeightFilter } from "./WeightFilter";
import { TagFilter } from "./TagFilter";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K] | undefined) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Filters">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          {/* Sheet / Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-bg-surface border border-border-default rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-dialog z-10 overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between sticky top-0 bg-bg-surface z-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold">Filter Icons</h2>
              </div>
              <IconButton aria-label="Close filters" variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Scrollable Filters */}
            <div className="p-5 overflow-y-auto space-y-6">
              <CategoryFilter
                activeCategory={filters.category}
                onSelectCategory={(cat) => onFilterChange("category", cat)}
              />

              <StyleFilter
                activeStyle={filters.style}
                onSelectStyle={(st) => onFilterChange("style", st)}
              />

              <WeightFilter
                activeWeight={filters.strokeWeight}
                onSelectWeight={(w: StrokeWeightFilter) => onFilterChange("strokeWeight", w)}
              />

              <TagFilter
                activeTag={filters.tag}
                onSelectTag={(t) => onFilterChange("tag", t)}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle bg-bg-surface-subtle flex items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={onResetFilters}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <Button variant="primary" size="md" onClick={onClose} className="flex-1 justify-center">
                <span>Show {totalResults} Icons</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
