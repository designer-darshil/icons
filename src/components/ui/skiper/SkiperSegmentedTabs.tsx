/**
 * Skiper UI Segmented Tabs Component
 * Reference: https://skiper-ui.com/
 * Adapted for Gridframe V2 - Animated sliding indicator using Framer Motion layoutId
 * Consumes Gridframe Design Tokens
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface SkiperTabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface SkiperSegmentedTabsProps<T extends string = string> {
  tabs: SkiperTabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  layoutId?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export function SkiperSegmentedTabs<T extends string = string>({
  tabs,
  activeId,
  onChange,
  layoutId = 'skiper-segmented-pill',
  className,
  size = 'sm',
}: SkiperSegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'relative inline-flex items-center p-0.5 rounded-sm bg-bg-secondary border border-border-default select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 font-mono font-medium transition-colors cursor-pointer rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus',
              size === 'xs' && 'h-6 px-2 text-[10px]',
              size === 'sm' && 'h-7 px-2.5 text-xs',
              size === 'md' && 'h-8 px-3 text-xs',
              isActive
                ? 'text-text-primary font-semibold'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            {/* Sliding Active Background Pill */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
                className="absolute inset-0 z-[-1] rounded-xs bg-bg-elevated border border-border-strong shadow-xs"
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1 py-0.2 rounded-2xs text-[9px] font-mono leading-none',
                  isActive
                    ? 'bg-bg-primary text-text-primary'
                    : 'bg-bg-elevated text-text-muted'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

SkiperSegmentedTabs.displayName = 'SkiperSegmentedTabs';
