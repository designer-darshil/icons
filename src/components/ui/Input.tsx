import * as React from "react";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onClear?: () => void;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", prefixIcon, suffixIcon, onClear, value, error, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="relative flex items-center w-full">
        {prefixIcon && (
          <div className="absolute left-2.5 text-text-tertiary flex items-center pointer-events-none select-none">
            {prefixIcon}
          </div>
        )}
        <input
          type={type}
          value={value}
          className={cn(
            "flex h-9 w-full rounded-md border bg-bg-secondary px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-1 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-40",
            prefixIcon ? "pl-8" : "pl-3",
            suffixIcon || (onClear && hasValue) ? "pr-8" : "pr-3",
            error ? "border-status-error-border text-status-error-text" : "border-border-default hover:border-border-strong",
            className
          )}
          ref={ref}
          {...props}
        />
        {onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            className="absolute right-2 p-1 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-elevated focus-visible:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {suffixIcon && (!onClear || !hasValue) && (
          <div className="absolute right-2.5 text-text-tertiary flex items-center pointer-events-none select-none">
            {suffixIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
