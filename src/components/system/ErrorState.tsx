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
        'rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 my-8',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-foreground-muted leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs gap-1.5 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Action</span>
          </Button>
        </div>
      )}
    </div>
  );
};
