import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-subtle bg-bg-surface p-4 transition-colors",
          elevated && "bg-bg-surface-elevated shadow-sm border-border-default",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
