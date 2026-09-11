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
          "w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70 transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-focus",
          className
        )}
      >
        {theme === "dark" ? <Sun className="w-[18px] h-[18px] stroke-[1.75]" /> : <Moon className="w-[18px] h-[18px] stroke-[1.75]" />}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={cn(
        "flex items-center bg-bg-secondary/50 border border-border-subtle rounded-full p-0.5 select-none",
        className
      )}
    >
      <button
        type="button"
        aria-label="Set Light Theme"
        onClick={() => setTheme("light")}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-mono transition-colors duration-150 cursor-pointer flex items-center gap-1.5",
          theme === "light"
            ? "bg-bg-elevated text-text-primary font-bold shadow-2xs border border-border-strong"
            : "text-text-tertiary hover:text-text-primary"
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button
        type="button"
        aria-label="Set Dark Theme"
        onClick={() => setTheme("dark")}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-mono transition-colors duration-150 cursor-pointer flex items-center gap-1.5",
          theme === "dark"
            ? "bg-bg-elevated text-text-primary font-bold shadow-2xs border border-border-strong"
            : "text-text-tertiary hover:text-text-primary"
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
};
