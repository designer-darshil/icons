import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-mono font-medium transition-colors select-none tracking-tight",
  {
    variants: {
      variant: {
        default:
          "bg-bg-secondary text-text-secondary border border-border-default",
        outline:
          "border border-border-default text-text-tertiary bg-transparent",
        primary:
          "bg-bg-elevated text-text-primary border border-border-strong",
        success:
          "bg-status-success-bg text-status-success-text border border-status-success-border",
        warning:
          "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
        error:
          "bg-status-error-bg text-status-error-text border border-status-error-border",
      },
      size: {
        xs: "text-[10px] px-1 py-0",
        sm: "text-[11px] px-1.5 py-0.5",
        md: "text-xs px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, size, ...props }) => {
  return <div className={cn(badgeVariants({ variant, size, className }))} {...props} />;
};
