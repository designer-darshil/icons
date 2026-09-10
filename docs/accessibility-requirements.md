# Glyphroom — Accessibility Requirements (a11y)

## 1. Compliance Standards
Glyphroom targets WCAG 2.1 Level AA compliance across all components and viewports.

## 2. Key A11y Standards
- **Keyboard Navigation & Roving Tabindex:**
  - Global Search accessible anytime via `Cmd+K` or `/`.
  - Icon grid navigable with Arrow keys (`Left`, `Right`, `Up`, `Down`), `Enter` to inspect, `Space` to quick-favorite.
  - Modals and drawers trap focus and return focus upon close (`Escape` to dismiss).
- **ARIA Semantics & Labels:**
  - `aria-label` or `aria-labelledby` on all icon-only buttons (Copy, Favorite, Theme Switcher, Close).
  - `aria-selected="true"` on active style pills, density toggles, and selected icon cards.
  - `aria-live="polite"` feedback regions for copy-to-clipboard notifications and search result counts.
- **Visual Contrast & Focus Ring:**
  - Color contrast ratio of ≥ 4.5:1 for standard text and ≥ 3:1 for interactive borders and graphical UI elements in both light and dark themes.
  - Prominent 2px focus ring (`outline: 2px solid var(--color-focus-ring)`) on all active keyboard interactive elements.
- **Motion Accessibility:**
  - Full support for `prefers-reduced-motion: reduce`, disabling decorative transitions and non-essential layout shifts.
- **Touch Target Sizes:**
  - Minimum touch target dimension of 44×44px on mobile devices for buttons, chips, and icon cards.
