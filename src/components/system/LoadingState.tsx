import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading icons...',
  size = 'md',
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3',
        className
      )}
    >
      <Loader2
        className={cn(
          'text-brand-500 animate-spin',
          size === 'sm' && 'w-5 h-5',
          size === 'md' && 'w-7 h-7',
          size === 'lg' && 'w-10 h-10'
        )}
      />
      {label && <p className="text-xs text-foreground-muted font-medium">{label}</p>}
    </div>
  );
};
