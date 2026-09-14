import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft, AlertTriangle, Compass, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { copyToClipboard } from '@/lib/export-svg';
import { cn } from '@/lib/cn';

export type ErrorType = '404' | '500' | 'generic';

export interface GridframeErrorStateProps {
  type?: ErrorType;
  code?: string | number;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  homePath?: string;
  homeLabel?: string;
  error?: Error | unknown;
  compact?: boolean;
  className?: string;
}

export const GridframeErrorState: React.FC<GridframeErrorStateProps> = ({
  type = '500',
  code,
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  homePath = '/icons',
  homeLabel,
  error,
  compact = false,
  className,
}) => {
  const [showDevDetails, setShowDevDetails] = useState(false);
  const [copiedDiagnostics, setCopiedDiagnostics] = useState(false);

  // Resolved defaults based on error type
  const is404 = type === '404' || code === 404 || code === '404';
  const resolvedCode = code ?? (is404 ? '404' : type === '500' ? '500' : 'ERROR');
  const resolvedTitle = title ?? (is404 ? 'Page not found.' : 'Something went wrong.');
  const resolvedDescription =
    description ??
    (is404
      ? "This Gridframe view doesn't exist."
      : "We couldn't load this view correctly.");
  const resolvedHomeLabel = homeLabel ?? (is404 ? 'Browse icons' : 'Back to icons');

  // Extract error string for development mode diagnostics
  const isDev = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.DEV);
  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : error ? JSON.stringify(error) : null;
  const errorStack = error instanceof Error ? error.stack : null;

  const handleCopyDiagnostics = () => {
    const diagnosticText = `Gridframe Error [${resolvedCode}]: ${errorMessage}\n\nStack:\n${errorStack || 'No stack trace available'}`;
    copyToClipboard(diagnosticText);
    setCopiedDiagnostics(true);
    setTimeout(() => setCopiedDiagnostics(false), 2000);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'min-h-[70vh] flex flex-col justify-between w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center select-none',
        compact ? 'min-h-[400px] py-6' : '',
        className
      )}
    >
      {/* 1. Minimal Lightweight Header (Logo + Theme Switcher) */}
      {!compact && (
        <header className="w-full flex items-center justify-between pb-6 sm:pb-8 border-b border-border-subtle/80">
          <Link
            to="/icons"
            className="flex items-center gap-2 group select-none cursor-pointer"
            aria-label="Gridframe Icon Archive"
          >
            <div className="w-6 h-6 border border-border-strong rounded-xs flex items-center justify-center p-1 bg-bg-secondary group-hover:border-accent transition-colors">
              <div className="w-full h-full bg-accent rounded-3xs group-hover:scale-90 transition-transform" />
            </div>
            <span className="text-xs font-extrabold font-mono tracking-widest text-text-primary uppercase leading-none">
              GRIDFRAME
            </span>
          </Link>

          <div className="flex items-center">
            <ThemeToggle compact />
          </div>
        </header>
      )}

      {/* 2. Main Error Core: Broken Grid Frame & Editorial Copy */}
      <main className="flex-1 flex flex-col items-center justify-center my-6 sm:my-10 space-y-6 sm:space-y-8">
        {/* Optical 24x24 Broken Vector Frame Specimen */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xs bg-bg-secondary/40 border border-border-default flex items-center justify-center shadow-xs">
          {/* Optical Corner Tick Marks */}
          <span className="absolute top-1 left-1 text-[8px] font-mono text-text-tertiary/60 leading-none select-none">
            +0,0
          </span>
          <span className="absolute top-1 right-1 text-[8px] font-mono text-text-tertiary/60 leading-none select-none">
            +24,0
          </span>
          <span className="absolute bottom-1 left-1 text-[8px] font-mono text-text-tertiary/60 leading-none select-none">
            +0,24
          </span>
          <span className="absolute bottom-1 right-1 text-[8px] font-mono text-text-tertiary/60 leading-none select-none">
            +24,24
          </span>

          {/* Interrupted Grid Crosshairs */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/50 pointer-events-none" />
          <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/50 pointer-events-none" />

          {/* Center Diagnostic Glyph */}
          <div className="relative z-10 flex flex-col items-center justify-center text-accent">
            {is404 ? (
              <Compass className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
            ) : (
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
            )}
          </div>
        </div>

        {/* Technical Label & Editorial Headings */}
        <div className="space-y-3 max-w-md mx-auto px-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-3xs bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] uppercase font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>{`ERROR / ${resolvedCode}`}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {resolvedTitle}
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary font-normal leading-relaxed text-pretty">
            {resolvedDescription}
          </p>
        </div>

        {/* Action Controls (Touch-friendly 44px+ minimum height) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-xs hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{retryLabel}</span>
            </button>
          )}

          <Link
            to={homePath}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-mono font-medium uppercase tracking-wider bg-bg-secondary border border-border-default hover:border-border-strong text-text-primary rounded-xs hover:bg-bg-elevated active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{resolvedHomeLabel}</span>
          </Link>
        </div>

        {/* 3. Development Mode Only: Diagnostic Drawer (Strictly excluded from production) */}
        {isDev && errorMessage && (
          <div className="w-full max-w-xl mx-auto pt-6 text-left select-text">
            <button
              type="button"
              onClick={() => setShowDevDetails((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 rounded-xs bg-bg-secondary/60 border border-border-default text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 font-semibold text-accent">
                <span>[DEV] Diagnostic Inspection</span>
              </span>
              {showDevDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDevDetails && (
              <div className="mt-2 p-4 rounded-xs bg-bg-elevated border border-border-strong text-xs font-mono space-y-3 shadow-md overflow-hidden">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-[10px] uppercase text-text-tertiary tracking-wider font-bold">
                    Exception Summary
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDiagnostics}
                    className="inline-flex items-center gap-1 text-[10px] text-text-secondary hover:text-accent transition-colors cursor-pointer"
                  >
                    {copiedDiagnostics ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDiagnostics ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-text-primary text-[11px] leading-relaxed break-words font-medium">
                  {errorMessage}
                </div>

                {errorStack && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">
                      Stack Trace
                    </span>
                    <pre className="p-2.5 rounded-3xs bg-bg-primary text-[10px] text-text-secondary overflow-x-auto max-h-48 border border-border-subtle font-mono leading-relaxed whitespace-pre-wrap break-all">
                      {errorStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. Minimal Technical Footer */}
      {!compact && (
        <footer className="w-full pt-6 border-t border-border-subtle/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-text-tertiary">
          <span>GRIDFRAME V2 RECOVERY SYSTEM</span>
          <span>MIT OPEN SPECIMEN MONOGRAPH</span>
        </footer>
      )}
    </div>
  );
};

export default GridframeErrorState;
