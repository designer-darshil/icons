import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface AppLoaderProps {
  label?: string;
  sublabel?: string;
  fullscreen?: boolean;
  className?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  label = 'INITIALIZING ARCHIVE',
  sublabel = 'Preparing vector catalog & optical geometry...',
  fullscreen = false,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const containerClasses = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary select-none'
    : 'flex flex-col items-center justify-center p-12 sm:p-16 text-center select-none w-full';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${label}. ${sublabel}`}
      className={cn(containerClasses, className)}
    >
      <div className="flex flex-col items-center space-y-6 max-w-xs">
        {/* Monogram Geometric Core */}
        <div className="relative w-12 h-12 rounded-xs border border-border-default bg-bg-secondary flex items-center justify-center p-2.5 shadow-dropdown">
          {/* Corner optical points */}
          <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-border-strong" />
          <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-border-strong" />
          <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-border-strong" />
          <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-border-strong" />

          {/* Animated Accent Diamond */}
          <motion.div
            className="w-full h-full bg-accent rounded-3xs"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    scale: [0.85, 1, 0.85],
                    rotate: [0, 90, 180],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Wordmark & Status Line */}
        <div className="space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-text-primary uppercase">
              GRIDFRAME
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
              № 02
            </span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-accent uppercase font-semibold">
            {label}
          </p>
          {sublabel && (
            <p className="text-[11px] text-text-tertiary font-sans leading-tight">
              {sublabel}
            </p>
          )}
        </div>

        {/* Subtle Horizontal Progress Line */}
        <div className="w-36 h-[2px] bg-bg-secondary rounded-full overflow-hidden border border-border-subtle/40">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            style={{ width: '40%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
