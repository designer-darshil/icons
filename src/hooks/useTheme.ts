import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for standalone error boundaries and isolated renderers
    const fallbackTheme: Theme =
      typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";

    return {
      theme: fallbackTheme,
      setTheme: (newTheme: Theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", newTheme);
        }
      },
      toggleTheme: () => {
        if (typeof document !== "undefined") {
          const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
          const next = current === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
        }
      },
    };
  }
  return context;
}
