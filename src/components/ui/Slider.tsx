import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {(label || valueDisplay !== undefined) && (
          <div className="flex items-center justify-between text-[11px] font-mono">
            {label && <span className="text-text-secondary">{label}</span>}
            {valueDisplay !== undefined && (
              <span className="text-text-primary font-semibold">{valueDisplay}</span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className={cn(
              'w-full h-1.5 bg-border-default rounded-sm appearance-none cursor-pointer accent-text-primary',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
