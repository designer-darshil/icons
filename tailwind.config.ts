import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss,css}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--color-background-primary)",
          secondary: "var(--color-background-secondary)",
          elevated: "var(--color-background-elevated)",
          overlay: "var(--color-background-overlay)",
          header: "var(--color-header-bg)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          inverse: "var(--color-text-inverse)",
          disabled: "var(--color-text-disabled)",
        },
        border: {
          default: "var(--color-border-default)",
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
        },
        action: {
          primary: "var(--color-action-primary)",
          "primary-hover": "var(--color-action-primary-hover)",
          "primary-active": "var(--color-action-primary-active)",
          secondary: "var(--color-action-secondary)",
          "secondary-hover": "var(--color-action-secondary-hover)",
          destructive: "var(--color-action-destructive)",
          "destructive-hover": "var(--color-action-destructive-hover)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          subtle: "var(--color-accent-subtle)",
          secondary: "var(--color-accent-secondary)",
          "secondary-subtle": "var(--color-accent-secondary-subtle)",
        },
        brand: {
          accent: "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          "accent-active": "var(--color-accent-active)",
          "accent-subtle": "var(--color-accent-subtle)",
          secondary: "var(--color-accent-secondary)",
          "secondary-subtle": "var(--color-accent-secondary-subtle)",
        },
        status: {
          success: "var(--color-status-success)",
          "success-bg": "var(--color-status-success-bg)",
          "success-border": "var(--color-status-success-border)",
          "success-text": "var(--color-status-success-text)",
          warning: "var(--color-status-warning)",
          "warning-bg": "var(--color-status-warning-bg)",
          "warning-border": "var(--color-status-warning-border)",
          "warning-text": "var(--color-status-warning-text)",
          error: "var(--color-status-error)",
          "error-bg": "var(--color-status-error-bg)",
          "error-border": "var(--color-status-error-border)",
          "error-text": "var(--color-status-error-text)",
          info: "var(--color-status-info)",
          "info-bg": "var(--color-status-info-bg)",
          "info-border": "var(--color-status-info-border)",
          "info-text": "var(--color-status-info-text)",
        },
        focus: {
          DEFAULT: "var(--color-focus-default)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        modal: "var(--shadow-modal)",
        dropdown: "var(--shadow-dropdown)",
      },
      spacing: {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
      },
    },
  },
  plugins: [],
};

export default config;
