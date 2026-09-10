import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-text-inverse hover:bg-action-primary-hover active:bg-action-primary-active border border-transparent shadow-xs font-semibold",
        secondary:
          "bg-action-secondary text-text-primary border border-border-default hover:bg-action-secondary-hover active:bg-bg-elevated",
        outline:
          "border border-border-default bg-transparent text-text-primary hover:bg-bg-secondary hover:border-border-strong",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-secondary bg-transparent",
        destructive:
          "bg-action-destructive text-text-primary hover:bg-action-destructive-hover border border-transparent",
      },
      size: {
        xs: "h-7 px-2 text-[11px] gap-1",
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-9 px-4 text-xs gap-2",
        lg: "h-10 px-5 text-sm gap-2",
        icon: "h-8 w-8 p-0 flex items-center justify-center",
        "icon-sm": "h-7 w-7 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
