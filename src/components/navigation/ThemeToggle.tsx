import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, compact = false }) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        aria-label={`Toggle theme (current: ${theme})`}
        onClick={toggleTheme}
        className={cn(
          "w-8 h-8 rounded-sm flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-border-default transition-colors",
          className
        )}
      >
        {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={cn(
        "flex items-center bg-bg-secondary border border-border-default rounded-sm p-0.5",
        className
      )}
    >
      <button
        type="button"
        aria-label="Set Light Theme"
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 rounded-xs text-xs font-mono transition-colors",
          theme === "light"
            ? "bg-action-primary text-text-inverse"
            : "text-text-tertiary hover:text-text-primary"
        )}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        aria-label="Set Dark Theme"
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 rounded-xs text-xs font-mono transition-colors",
          theme === "dark"
            ? "bg-action-primary text-text-inverse"
            : "text-text-tertiary hover:text-text-primary"
        )}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
