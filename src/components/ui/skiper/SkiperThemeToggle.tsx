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
      <div className="relative w-[18px] h-[18px]">
        <Sun
          className={cn(
            'w-[18px] h-[18px] text-text-primary stroke-[1.75] absolute inset-0 transition-[opacity,transform] duration-200 ease-in-out',
            isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-90 pointer-events-none'
          )}
        />
        <Moon
          className={cn(
            'w-[18px] h-[18px] text-text-primary stroke-[1.75] absolute inset-0 transition-[opacity,transform] duration-200 ease-in-out',
            !isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-90 pointer-events-none'
          )}
        />
      </div>
    </button>
  );
};


SkiperThemeToggle.displayName = 'SkiperThemeToggle';
