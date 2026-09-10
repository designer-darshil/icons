import React from 'react';
import { cn } from '@/lib/cn';

export interface CanvasGridProps {
  children: React.ReactNode;
  showGrid?: boolean;
  background?: string;
  className?: string;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({
  children,
  showGrid = true,
  background,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full h-full min-h-[260px] sm:min-h-[320px] rounded-md border border-border-default overflow-hidden transition-colors',
        showGrid ? 'gridframe-dot-matrix bg-bg-secondary' : 'bg-bg-secondary',
        className
      )}
      style={background ? { backgroundColor: background } : undefined}
    >
      {/* Precision 24px Center Frame Guide */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-24 h-24 border border-border-subtle/80 rounded-xs" />
        <div className="absolute w-full h-[1px] bg-border-subtle/40" />
        <div className="absolute h-full w-[1px] bg-border-subtle/40" />
      </div>

      {/* Optical Specimen Container */}
      <div className="relative z-10 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
};
