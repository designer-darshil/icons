import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load icon workspace',
  description = 'There was an issue processing the requested vector icon data.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xs border border-dashed border-border-default bg-bg-secondary/40 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 my-8 font-mono',
        className
      )}
    >
      <div className="w-10 h-10 rounded-xs bg-bg-elevated text-accent flex items-center justify-center mx-auto border border-border-default">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="space-y-1.5 font-sans">
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs gap-1.5 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Action</span>
          </Button>
        </div>
      )}
    </div>
  );
};

