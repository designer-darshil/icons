/**
 * Skiper UI Theme Toggle Component
 * Reference: https://skiper-ui.com/
 * Adapted for Gridframe V2 - Consumes Gridframe Design Tokens & Theme Engine
 * Strictly Dark / Light (No System/Auto)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SkiperThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const SkiperThemeToggle: React.FC<SkiperThemeToggleProps> = ({
  className,
  size = 'sm',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'relative flex items-center justify-center rounded-sm border border-border-default bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-bg-elevated transition-colors cursor-pointer select-none overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus',
        size === 'sm' ? 'w-7.5 h-7.5' : 'w-8.5 h-8.5',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: isDark ? 8 : -8, opacity: 0, rotate: isDark ? -45 : 45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: isDark ? -8 : 8, opacity: 0, rotate: isDark ? 45 : -45 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-text-primary stroke-[2]" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-text-primary stroke-[2]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

SkiperThemeToggle.displayName = 'SkiperThemeToggle';
