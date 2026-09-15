import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export type LoaderState = 'initializing' | 'loading' | 'ready' | 'error';
export type LoaderVariant = 'fullscreen' | 'route' | 'inline';

export interface GridframeLoaderProps {
  state?: LoaderState;
  variant?: LoaderVariant;
  fullscreen?: boolean; // Backwards compatibility for AppLoader
  label?: string;
  sublabel?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
  minDurationMs?: number; // Minimum display time to prevent flickering on fast connections
}

export const GridframeLoader: React.FC<GridframeLoaderProps> = ({
  state = 'initializing',
  variant,
  fullscreen,
  label,
  sublabel,
  errorMessage,
  onRetry,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [internalState, setInternalState] = useState<LoaderState>(state);
  const [elapsedSlow, setElapsedSlow] = useState(false);

  // Determine effective variant
  const effectiveVariant: LoaderVariant = variant || (fullscreen ? 'fullscreen' : 'inline');

  // Sync state prop
  useEffect(() => {
    setInternalState(state);
  }, [state]);

  // Track if loading takes longer than 800ms for subtle technical status update
  useEffect(() => {
    const timer = setTimeout(() => {
      setElapsedSlow(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute displayed technical labels
  const getStatusText = () => {
    if (label) return label;
    if (internalState === 'error') return 'INITIALIZATION ERROR';
    if (internalState === 'ready') return 'SYSTEM READY';
    if (internalState === 'loading' || elapsedSlow) return 'LOADING CATALOG';
    return 'INITIALIZING WORKSTATION';
  };

  const getSublabel = () => {
    if (sublabel) return sublabel;
    if (internalState === 'error') return errorMessage || 'Unable to initialize vector subsystem. Check connection and retry.';
    if (internalState === 'ready') return 'Calibrated 2,200 vector concepts.';
    if (internalState === 'loading' || elapsedSlow) return 'Synchronizing 24×24 vector catalog & optical metrics...';
    return 'Calibrating optical grid & typography engine...';
  };

  const isError = internalState === 'error';

  // Container layout based on variant
  const containerClasses = {
    fullscreen: 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary select-none p-4 sm:p-6',
    route: 'min-h-[360px] sm:min-h-[440px] w-full flex flex-col items-center justify-center p-6 sm:p-12 select-none',
    inline: 'w-full flex flex-col items-center justify-center p-6 sm:p-8 select-none',
  }[effectiveVariant];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Gridframe: ${getStatusText()}. ${getSublabel()}`}
      className={cn(containerClasses, className)}
    >
      <div className="flex flex-col items-center max-w-[300px] sm:max-w-[340px] text-center">
        {/* =========================================================================
            1. TECHNICAL PRECISION CALIBRATION FRAME (24×24 Vector Grid Reference)
            ========================================================================= */}
        <div
          className={cn(
            'relative w-20 h-20 sm:w-24 sm:h-24 rounded-xs flex items-center justify-center transition-colors duration-300',
            isError
              ? 'border border-status-error/60 bg-status-error/5'
              : 'border border-border-default/80 bg-bg-secondary/60'
          )}
        >
          {/* L-Corner Precision Optical Brackets */}
          <span className={cn('absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2', isError ? 'border-status-error' : 'border-border-strong')} />
          <span className={cn('absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2', isError ? 'border-status-error' : 'border-border-strong')} />
          <span className={cn('absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2', isError ? 'border-status-error' : 'border-border-strong')} />
          <span className={cn('absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2', isError ? 'border-status-error' : 'border-border-strong')} />

          {/* Precision 24×24 Coordinate SVG System */}
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 sm:w-14 sm:h-14 overflow-visible"
            aria-hidden="true"
          >
            {/* Grid Subdivision Guides */}
            <line x1="6" y1="2" x2="6" y2="22" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/50" />
            <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/70" strokeDasharray="1 2" />
            <line x1="18" y1="2" x2="18" y2="22" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/50" />
            <line x1="2" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/50" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/70" strokeDasharray="1 2" />
            <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle/50" />

            {/* 24×24 DP Boundary Frame */}
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className={isError ? 'text-status-error/40' : 'text-border-default'}
            />

            {/* Optical Midpoint Crosshair Ticks */}
            <line x1="12" y1="0.5" x2="12" y2="2" stroke="currentColor" strokeWidth="1" className={isError ? 'text-status-error' : 'text-border-strong'} />
            <line x1="12" y1="22" x2="12" y2="23.5" stroke="currentColor" strokeWidth="1" className={isError ? 'text-status-error' : 'text-border-strong'} />
            <line x1="0.5" y1="12" x2="2" y2="12" stroke="currentColor" strokeWidth="1" className={isError ? 'text-status-error' : 'text-border-strong'} />
            <line x1="22" y1="12" x2="23.5" y2="12" stroke="currentColor" strokeWidth="1" className={isError ? 'text-status-error' : 'text-border-strong'} />

            {/* Central Precision Brand Mark or Error Glyph */}
            {isError ? (
              <g className="text-status-error">
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                {/* Outer Diamond Geometry */}
                <motion.rect
                  x="7"
                  y="7"
                  width="10"
                  height="10"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-accent"
                  style={{ transformOrigin: '12px 12px' }}
                  initial={prefersReducedMotion ? { rotate: 45, scale: 1 } : { rotate: 0, scale: 0.7, opacity: 0 }}
                  animate={
                    prefersReducedMotion
                      ? { rotate: 45, scale: 1, opacity: 1 }
                      : {
                          rotate: [0, 45, 45],
                          scale: [0.7, 1, 1],
                          opacity: [0, 1, 1],
                        }
                  }
                  transition={{
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />

                {/* Inner Solid Calibration Core */}
                <motion.circle
                  cx="12"
                  cy="12"
                  r="2"
                  fill="currentColor"
                  className="text-accent"
                  initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                />

                {/* Subtle Ongoing Scan Indicator (Only for long loads & when reduced motion is off) */}
                {!prefersReducedMotion && (
                  <motion.line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    className="text-accent/30"
                    animate={{
                      y1: [3, 21, 3],
                      y2: [3, 21, 3],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </g>
            )}
          </svg>

          {/* Coordinate Meta Label */}
          <div className="absolute -bottom-2.5 bg-bg-primary px-1.5 py-0.2 border border-border-subtle/80 rounded-3xs shadow-2xs">
            <span className={cn('text-[8px] font-mono tracking-wider font-semibold leading-none', isError ? 'text-status-error' : 'text-text-tertiary')}>
              {isError ? 'CAL_ERR' : '24×24 DP'}
            </span>
          </div>
        </div>

        {/* =========================================================================
            2. WORDMARK & EDITORIAL STATUS
            ========================================================================= */}
        <div className="mt-6 space-y-1.5 w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-text-primary uppercase">
              GRIDFRAME
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary leading-none">
              № 02
            </span>
          </div>

          <p
            className={cn(
              'text-[10px] font-mono tracking-widest uppercase font-semibold transition-colors duration-200',
              isError ? 'text-status-error' : 'text-accent'
            )}
          >
            {getStatusText()}
          </p>

          <p className="text-[11px] text-text-tertiary font-sans leading-snug px-2">
            {getSublabel()}
          </p>
        </div>

        {/* =========================================================================
            3. ACTION / PROGRESS STATE
            ========================================================================= */}
        <div className="mt-5 w-full flex items-center justify-center">
          {isError ? (
            <button
              type="button"
              onClick={onRetry || (() => window.location.reload())}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-accent text-accent-fg hover:bg-accent-hover active:scale-98 transition-all text-xs font-mono font-semibold uppercase tracking-wider cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary"
            >
              Retry Calibration
            </button>
          ) : (
            /* Subtle Technical Micro-Track */
            <div className="w-32 sm:w-40 h-[2px] bg-bg-secondary rounded-full overflow-hidden border border-border-subtle/40">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={prefersReducedMotion ? { width: '100%', x: 0 } : { x: '-100%', width: '35%' }}
                animate={
                  prefersReducedMotion
                    ? { width: '100%', x: 0 }
                    : {
                        x: ['-100%', '300%'],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridframeLoader;
