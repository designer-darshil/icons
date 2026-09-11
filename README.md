# GRIDFRAME — Precision Vector Icon Workstation (V2)

> A precision icon workstation engineered for interface designers and frontend architects: search, inspect, customize, curate, and export production-ready 24×24 vector icons with instant multi-format code generation.

---

## ⚡ Key Workflows & V2 Architecture

- **DISCOVERY WORKSPACE**: Replaces fragmented sidebar/dashboard patterns with a unified, high-density discovery canvas.
- **NO PERSISTENT RIGHT INSPECTOR**: Selecting an icon opens a **Centered Two-Column Detail Modal** on desktop (and full-screen sheet on mobile), keeping the specimen grid as the primary workspace.
- **1,500+ NORMALIZED 24×24 ICONS**: Coherent conceptual families (`Linear`, `Bold`, `Filled`, `Duotone`, `Two-Tone`, `Broken`, `Mono`) conforming to canonical `0 0 24 24` viewBox, `1.5px` default stroke, round caps, and round joins.
- **INSTANT INVERTED SEARCH**: Sub-millisecond scoring, multi-word matching, synonym expansion, and global <kbd>Cmd</kbd> + <kbd>K</kbd> command palette without duplicate variant results.
- **LIVE VECTOR CUSTOMIZATION**: Real-time adjustment of stroke weight (0.5px – 4.0px), custom colors, sizing (16px – 64px), transforms (rotation, horizontal/vertical flips), and canvas dot matrix frame.
- **1-CLICK EXPORT & CODE MODAL**:
  - **Copy SVG** & **Download SVG** primary actions
  - Focused secondary **Code View Modal** with selectable text, native scroll, and zero Lenis interference (React TSX, Clean Raw SVG, HTML Snippet, Data URI, CSS Mask).
- **LOCAL-FIRST COLLECTIONS & FAVORITES**: Schema-versioned `localStorage` persistence with defensive recovery and batch SVG asset downloads.
- **TWO THEMES ONLY**: Strict **Dark (default)** and **Light** themes utilizing the exact Gridframe color variables (no arbitrary colors, no gradients, no glows).

---

## 🎨 Exact Gridframe Design Tokens

### Dark Theme (Default)
```css
--color-background-primary: #11110F;
--color-background-secondary: #1A1916;
--color-background-elevated: #24221E;
--color-background-overlay: rgba(0, 0, 0, 0.75);

--color-text-primary: #F7F3EA;
--color-text-secondary: #C6C0B5;
--color-text-tertiary: #969087;
--color-text-inverse: #11110F;
--color-text-disabled: #615E57;

--color-border-default: #35322D;
--color-border-subtle: #292722;
--color-border-strong: #4A463D;

--color-action-primary: #F7F3EA;
--color-action-primary-hover: #E6E1D5;
--color-action-primary-active: #D6D0C3;
--color-action-secondary: #1A1916;
--color-action-secondary-hover: #24221E;
--color-action-destructive: #D64545;

--color-accent: #FF5A36;
--color-accent-secondary: #F4C95D;
--color-focus-default: #FF5A36;
```

### Light Theme
```css
--color-background-primary: #F4F1EA;
--color-background-secondary: #E9E4D9;
--color-background-elevated: #FFFDF8;
--color-background-overlay: rgba(22, 22, 22, 0.6);

--color-text-primary: #161616;
--color-text-secondary: #51504A;
--color-text-tertiary: #76736C;
--color-text-inverse: #F7F3EA;
--color-text-disabled: #A5A096;

--color-border-default: #D0CBC1;
--color-border-subtle: #DED9CF;
--color-border-strong: #AAA49A;

--color-action-primary: #161616;
--color-action-primary-hover: #2A2A28;
--color-action-primary-active: #383734;
--color-action-secondary: #E9E4D9;
--color-action-secondary-hover: #DED9CF;
--color-action-destructive: #D64545;

--color-accent: #FF5A36;
--color-accent-secondary: #F4C95D;
--color-focus-default: #FF5A36;
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/designer-darshil/gridframe.git
cd gridframe

# Switch to the V2 branch
git checkout gridframe-v2

# Install dependencies
npm install

# Start local workstation server
npm run dev
```

The application will start at `http://localhost:3000`.

---

## 🧪 Testing & Verification

```bash
# Run the master automated test runner
npx tsx src/tests/all-tests.ts

# Run production build and TypeScript verification
npm run build
```

---

## 🗺️ Routes & Deep-Linking

| Route | Purpose | UX Model |
|---|---|---|
| `/icons` | Primary Specimen Explorer | Specimen grid, quick category scroller, style pills, sort selector |
| `/icons/:slug` | Deep-linkable Icon Detail | Preserves explorer in background with centered two-column modal |
| `/categories` | Semantic Category Directory | 20 categorized domains with icon counts |
| `/categories/:category` | Category-Filtered Catalog | Explorer filtered to selected category |
| `/styles` | Vector Style Directory | Linear, Bold, Filled, Duotone, Two-Tone, Broken, Mono |
| `/styles/:style` | Style-Filtered Catalog | Explorer filtered to selected style |
| `/favorites` | Saved Icons Manager | Search within favorites, batch export SVGs, detail modal |
| `/collections` | Collections Studio | Create and manage custom vector sets |
| `/collections/:id` | Collection Detail View | Manage icons in set, batch download collection SVGs |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Cmd / Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette / Search |
| <kbd>/</kbd> | Quick focus command palette |
| <kbd>Escape</kbd> | Close Detail Modal / Dialogs / Palette |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate search results and suggestions |
| <kbd>Enter</kbd> | Open selected icon |

---

## 📄 License

MIT License © 2026 GRIDFRAME.
# icons
