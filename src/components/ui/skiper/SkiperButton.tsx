/**
 * Skiper UI Interactive Button Component
 * Reference: https://skiper-ui.com/
 * Adapted for Gridframe V2 - Subtle micro-interaction tap scale and accessible states
 * Consumes Gridframe Design Tokens
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface SkiperButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const SkiperButton = React.forwardRef<HTMLButtonElement, SkiperButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'sm',
      children,
      icon,
      loading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-medium rounded-xs transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus disabled:opacity-50 disabled:cursor-not-allowed border';

    const variantStyles = {
      primary:
        'bg-action-primary text-text-inverse border-action-primary hover:bg-action-primary-hover active:bg-action-primary-active',
      secondary:
        'bg-bg-secondary text-text-primary border-border-default hover:bg-bg-elevated hover:border-border-strong active:bg-bg-primary',
      outline:
        'bg-transparent text-text-primary border-border-default hover:bg-bg-secondary hover:border-border-strong active:bg-bg-elevated',
      ghost:
        'bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-secondary active:bg-bg-elevated',
      destructive:
        'bg-status-error-bg text-action-destructive border-status-error-border hover:bg-status-error-border/30 active:bg-status-error-border/50',
    };

    const sizeStyles = {
      xs: 'h-6 px-2 text-[10px] gap-1',
      sm: 'h-7.5 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-xs gap-2',
      lg: 'h-10 px-5 text-sm gap-2',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.08 }}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

SkiperButton.displayName = 'SkiperButton';
