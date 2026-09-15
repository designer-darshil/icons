import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ThemeContext, type Theme } from "@/hooks/useTheme";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { ToastProvider } from "@/components/ui/Toast";

const THEME_STORAGE_KEY = "gridframe_theme_v2";

interface ThemeProviderProps {
  children?: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    } catch {
      // Fallback
    }
    return defaultTheme;
  });

  const transitionTimeoutRef = React.useRef<number | null>(null);

  // Apply data-theme to HTML root on initial load without animation
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (typeof document === "undefined") {
      setThemeState(newTheme);
      return;
    }

    const root = document.documentElement;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Apply smooth color transition class if user has not requested reduced motion
    if (!isReducedMotion) {
      root.classList.add("theme-transition");
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        root.classList.remove("theme-transition");
      }, 240);
    }

    setThemeState(newTheme);
    root.setAttribute("data-theme", newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Failed to persist theme to localStorage", e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);


  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LenisProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </LenisProvider>
    </ThemeProvider>
  );
};
