import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare, MAX_COMPARE_ITEMS } from './useCompare';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Columns, ArrowRight, X, Trash2 } from 'lucide-react';

export const CompareBar: React.FC = () => {
  const { compareIcons, count, removeFromCompare, clearCompare } = useCompare();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Do not show floating bar if on /compare route or no icons selected
  if (count === 0 || location.pathname.startsWith('/compare')) {
    return null;
  }

  const compareUrl = `/compare?icons=${compareIcons.map((i) => i.slug).join(',')}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.15 }}
        className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] sm:max-w-2xl w-full px-2 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl border border-border-default bg-bg-elevated/95 backdrop-blur-md shadow-modal text-text-primary">
          {/* Left: Icon thumbnails */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto native-scroll min-w-0 pr-1">
            <div className="hidden sm:flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-text-tertiary shrink-0">
              <Columns className="w-3.5 h-3.5 text-accent" />
              <span>Compare</span>
            </div>

            {compareIcons.map((icon) => (
              <div
                key={icon.id}
                className="group relative flex items-center gap-1.5 px-2 py-1 rounded-md bg-bg-secondary border border-border-subtle hover:border-border-strong transition-colors shrink-0"
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0 text-text-primary">
                  <IconPreviewSvg
                    icon={icon}
                    variant={icon.variants[0]}
                    size={16}
                    className="w-4 h-4"
                  />
                </div>
                <span className="text-[11px] font-medium text-text-primary max-w-[80px] sm:max-w-[100px] truncate">
                  {icon.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(icon.id)}
                  aria-label={`Remove ${icon.name} from comparison`}
                  className="text-text-tertiary hover:text-text-primary p-0.5 rounded-xs transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {count < MAX_COMPARE_ITEMS && (
              <div className="hidden md:flex items-center text-[10px] font-mono text-text-tertiary px-1 shrink-0">
                <span>+{MAX_COMPARE_ITEMS - count} more</span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear compare list"
              title="Clear all"
              className="p-1.5 text-text-tertiary hover:text-action-destructive rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <Link
              to={compareUrl}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-accent text-white hover:bg-accent-hover active:scale-98 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>Compare ({count})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
