import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50 select-none relative group",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary:
          "bg-bg-subtle text-text-primary border border-border-default hover:bg-bg-surface-elevated hover:border-border-strong",
        outline:
          "border border-border-default bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle hover:border-border-strong",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-subtle",
        active:
          "bg-primary-subtle text-primary border border-primary/30",
      },
      size: {
        sm: "w-control-sm h-control-sm p-1.5 text-xs",
        md: "w-control-md h-control-md p-2 text-sm",
        lg: "w-control-lg h-control-lg p-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string; // Enforce accessible name for screen readers
  tooltip?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, tooltip, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {tooltip && (
          <span
            role="tooltip"
            className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-surface-elevated border border-border-default text-text-primary text-xs rounded-sm shadow-md pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity z-50 whitespace-nowrap"
          >
            {tooltip}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
