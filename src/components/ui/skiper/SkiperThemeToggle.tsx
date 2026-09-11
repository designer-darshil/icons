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
        'relative flex items-center justify-center rounded-full bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70 transition-colors duration-150 cursor-pointer select-none overflow-hidden focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-focus',
        size === 'sm' ? 'w-10 h-10 min-w-[40px] min-h-[40px]' : 'w-10 h-10 min-w-[40px] min-h-[40px]',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: isDark ? 6 : -6, opacity: 0, rotate: isDark ? -30 : 30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: isDark ? -6 : 6, opacity: 0, rotate: isDark ? 30 : -30 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="flex items-center justify-center pointer-events-none"
        >
          {isDark ? (
            <Sun className="w-[18px] h-[18px] text-text-primary stroke-[1.75]" />
          ) : (
            <Moon className="w-[18px] h-[18px] text-text-primary stroke-[1.75]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

SkiperThemeToggle.displayName = 'SkiperThemeToggle';
