# Project Roadmap & Technical Documentation

> **Maintenance Rule**: This document describes the current implementation. It must be updated whenever project architecture, framework usage, icon structure, rendering strategy, export behavior, or major UI architecture changes.
>
> - **Last Audited**: September 11, 2026
> - **Project Version**: `0.1.0` (Gridframe V2 Architecture)
> - **Active Frameworks**: React 18.3.1, Vite 6.2.0, TypeScript 5.7.3, Tailwind CSS 3.4.17, SCSS, Framer Motion 12.4.7, Lenis 1.3.26

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Architecture](#2-current-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [File Inventory](#5-file-inventory)
6. [Application Entry Flow](#6-application-entry-flow)
7. [Routes & Pages](#7-routes--pages)
8. [Component Architecture](#8-component-architecture)
9. [UI Components](#9-ui-components)
10. [Icon Architecture](#10-icon-architecture)
11. [Icon File Structure](#11-icon-file-structure)
12. [SVG Icon Design Guidelines](#12-svg-icon-design-guidelines)
13. [Five Icon Variants](#13-five-icon-variants)
14. [How to Create a New Icon](#14-how-to-create-a-new-icon)
15. [Icon Metadata](#15-icon-metadata)
16. [Icon Registry](#16-icon-registry)
17. [Icon Renderer](#17-icon-renderer)
18. [Icon Customization](#18-icon-customization)
19. [Icon Transform System](#19-icon-transform-system)
20. [Preview System](#20-preview-system)
21. [Background System](#21-background-system)
22. [Export System](#22-export-system)
23. [Search System](#23-search-system)
24. [Filtering System](#24-filtering-system)
25. [Load More System](#25-load-more-system)
26. [Icon Card](#26-icon-card)
27. [Animation System](#27-animation-system)
28. [Scrolling System](#28-scrolling-system)
29. [Styling Architecture](#29-styling-architecture)
30. [Design Tokens](#30-design-tokens)
31. [Typography](#31-typography)
32. [Responsive Architecture](#32-responsive-architecture)
33. [State Management](#33-state-management)
34. [Hooks](#34-hooks)
35. [Utilities](#35-utilities)
36. [Performance Architecture](#36-performance-architecture)
37. [Accessibility](#37-accessibility)
38. [Routing](#38-routing)
39. [Development Conventions](#39-development-conventions)
40. [Adding a New Component](#40-adding-a-new-component)
41. [Adding a New Page](#41-adding-a-new-page)
42. [Adding a New Icon](#42-adding-a-new-icon)
43. [Adding a New Category](#43-adding-a-new-category)
44. [Bulk Icon Workflow](#44-bulk-icon-workflow)
45. [Testing & QA](#45-testing--qa)
46. [Development Commands](#46-development-commands)
47. [Environment Variables](#47-environment-variables)
48. [Dependency Inventory](#48-dependency-inventory)
49. [Generated Files](#49-generated-files)
50. [Architecture Diagrams](#50-architecture-diagrams)
51. [Architectural Decisions](#51-architectural-decisions)
52. [Known Limitations](#52-known-limitations)
53. [Future Roadmap](#53-future-roadmap)
54. [Maintenance Rules](#54-maintenance-rules)

---

## 1. Project Overview

**Gridframe** (package `glyphroom`) is an editorial, high-precision vector specimen workstation and SVG engineering platform built for UI/UX designers, design system engineers, and frontend developers.

### Core Value Proposition
- **Authentic Canonical Geometry**: Zero approximation, procedural distortion, or destructive normalization. Vector paths from Iconoir are preserved 1:1 on a canonical 24×24 grid.
- **Deterministic 5-Variant Architecture**: First-class support for `light`, `regular`, `filled`, `duotone`, and `duotone-line` visual executions.
- **Real-Time Optical Customizer**: Live client-side adjustments for stroke width, optical scaling, dimensions, colors, rotations (-90°/0°/+90°), and horizontal/vertical flips.
- **Universal Multi-Format Export Engine**: 1-click lossless generation of raw sanitized SVG, modern React TSX components, inline HTML wrappers, CSS mask declarations, and Data URIs.
- **Local-First Curation**: Zero login requirement; persistent favorites and custom collections stored in schema-versioned `localStorage`.
- **High-Performance Architecture**: Sub-millisecond fuzzy search across 1,420+ icons, lightweight infinite-scroll batching with `IntersectionObserver`, and GPU-accelerated smooth scrolling via Lenis.

---

## 2. Current Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        GRIDFRAME CLIENT APPLICATION                    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  ROOT PROVIDERS (src/app/providers.tsx)                 │
│  ├─ ThemeProvider (Dark / Light class synchronization)                 │
│  ├─ LenisProvider (Smooth scrolling with prevent boundary)              │
│  └─ ToastProvider (Global transient notification bus)                  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  ROUTER SHELL (src/app/router.tsx)                      │
│  └─ AppShell (Global keyboard shortcuts, Skip links, Layout boundary)  │
│      └─ WorkspaceShell (Header + Mobile Navigation + Bottom Nav)       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ /icons        │           │ /categories   │           │ /styles       │
│ Specimen Grid │           │ Taxonomy Hub  │           │ Variant Hub   │
└───────────────┘           └───────────────┘           └───────────────┘
        │                           │                           │
        ├───────────────────────────┼───────────────────────────┤
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ /favorites    │           │ /collections  │           │ /qa & /dev    │
│ Pinned Icons  │           │ Custom Sets   │           │ Regression QA │
└───────────────┘           └───────────────┘           └───────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               FEATURE ENGINES & COMPONENT INFRASTRUCTURE                │
│  ├─ Search & Filter: searchIconsWithScore, getSearchSuggestions        │
│  ├─ Specimen Grid: IntersectionObserver auto-batching (BATCH_SIZE = 64)│
│  ├─ Icon Modal: Two-column desktop / single vertical flow mobile       │
│  ├─ Transformer: transformSvgMarkup (non-destructive attribute wrapper)│
│  └─ Exporters: Raw SVG, React TSX, CSS Mask, Data URI, HTML Snippet    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Technology | Version | Purpose | Where Used | Status | Why Used |
|---|---|---|---|---|---|
| **React** | `18.3.1` | Declarative UI Framework | `src/**/*.tsx` | Active | Component lifecycle, hooks, state isolation |
| **Vite** | `6.2.0` | Dev server & Rollup bundler | Root build | Active | Sub-second HMR and optimized asset chunking |
| **TypeScript** | `5.7.3` | Static type safety | Root codebase | Active | Eliminates runtime bugs across 1,420+ icon schemas |
| **Tailwind CSS** | `3.4.17` | Utility-first styling | `src/**/*.tsx` | Active | Rapid design token mapping via custom theme extension |
| **Sass / SCSS** | `1.85.1` | Design tokens & grid layout | `src/styles/*.scss` | Active | Structured variables, fluid clamp typography, utilities |
| **Framer Motion** | `12.4.7` | UI transitions & modals | Modals, drawers | Active | Spring physics for dialogs, drawers, and toasts |
| **Lenis** | `1.3.26` | Smooth inertia scrolling | `LenisProvider.tsx` | Active | Premium editorial smooth document scrolling |
| **Lucide React** | `1.16.0` | Interface utility icons | UI components | Active | Crisp UI controls (search, heart, download, menu) |
| **Iconoir** | `7.12.1` | Canonical vector catalog | `src/data/icons` | Active | 1,420+ open-source 24×24 vector specimens |
| **clsx & tailwind-merge** | `2.1.1` / `3.0.2` | Dynamic class merging | `src/lib/cn.ts` | Active | Safe conditional Tailwind class overrides |
| **Three.js / R3F** | N/A | 3D Canvas rendering | **Removed** | **Unused** | Replaced with SVG dotted matrix for 100% vector fidelity |

---

## 4. Repository Structure

```text
/Users/jarvis/Documents/icons/
├── .github/                 # CI/CD workflows and Git configurations
├── public/                  # Static assets served at root (favicon.svg, robots.txt)
├── scripts/                 # Build, import, and catalog validation tooling
│   ├── build-catalog.ts             # Compiles catalog from raw sources
│   ├── import-iconoir.ts            # Canonical Iconoir importer & tagger
│   ├── validate-icon-catalog.ts     # Automated integrity & geometry validator
│   └── report-gridframe-icons.ts    # QA health report generator
├── src/
│   ├── app/                 # Application entry, router, and provider trees
│   │   ├── App.tsx                  # Root layout wrapper
│   │   ├── providers.tsx            # Theme, Lenis, Toast provider hierarchy
│   │   └── router.tsx               # React Router v6 browser routes configuration
│   ├── components/          # Reusable shared UI primitives and layouts
│   │   ├── dev/                     # Development QA tools (IconSystemQA)
│   │   ├── export/                  # Multi-format CodeModal dialog
│   │   ├── icons/                   # Core SVG renderers (IconPreviewSvg, SafeSvg)
│   │   ├── layout/                  # Shell, Header, MobileNav, LenisProvider
│   │   ├── navigation/              # PrimaryNavigation, MobileNavigation, ThemeToggle
│   │   ├── preview/                 # CanvasGrid dotted matrix component
│   │   ├── system/                  # ErrorBoundary, AppLoader, LoadingState
│   │   └── ui/                      # Button, Input, Modal, Slider, Toast, Skiper
│   ├── data/                # Static catalogs, category taxonomy, and style definitions
│   │   ├── categories.ts            # Canonical 44-category taxonomy and metadata
│   │   ├── styles.ts                # 5-variant definitions and stroke weights
│   │   ├── icon-repository.ts       # In-memory query abstraction
│   │   └── icons/                   # gridframe-catalog.ts (1,420+ conceptual icons)
│   ├── features/            # Domain-driven feature modules
│   │   ├── collections/             # Custom icon set creation & management
│   │   ├── customizer/              # Color, size, stroke, and transform controls
│   │   ├── export/                  # Export panels, buttons, and formatters
│   │   ├── favorites/               # Pinned favorite vectors with localStorage sync
│   │   ├── filters/                 # Category, style, and sort toolbars & drawers
│   │   ├── icon-detail/             # Dedicated icon page panels and metadata
│   │   ├── icon-explorer/           # SpecimenGrid, SpecimenCard, ExplorerToolbar
│   │   ├── icon-modal/              # Approved centered / full-screen detail modal
│   │   └── search/                  # CommandPalette (⌘K), search indexing & dialogs
│   ├── hooks/               # Custom React utility hooks
│   │   ├── useDebouncedValue.ts     # Debounce input for sub-ms search
│   │   ├── useDocumentTitle.ts      # Dynamic page titles and meta descriptions
│   │   ├── useKeyboardShortcut.ts   # Global keybinding listener (⌘K, Esc)
│   │   ├── useLenis.ts              # Lenis smooth-scroll instance accessor
│   │   ├── useLocalStorage.ts       # Type-safe persistent browser storage
│   │   ├── useReducedMotion.ts      # Prefers-reduced-motion media query hook
│   │   ├── useScrollLock.ts         # Dual Lenis/body scroll lock for dialogs
│   │   ├── useSelectedIcon.ts       # Selected icon URL/state sync
│   │   └── useTheme.ts              # Dark / Light theme toggle hook
│   ├── lib/                 # Core domain logic, formatters, sanitizers, and SVG tools
│   │   ├── cn.ts                    # ClassNames merge helper
│   │   ├── export-formatters.ts     # TSX, SVG, HTML, CSS Mask, Data URI generators
│   │   ├── export-svg.ts            # Clipboard copy & browser download triggers
│   │   ├── filename-utils.ts        # Kebab/Pascal case sanitization
│   │   ├── icon-filtering.ts        # Category, style, and sort predicates
│   │   ├── icon-renderer.ts         # Fallback path resolvers
│   │   ├── icon-sanitizer.ts        # HTML/SVG injection sanitizer
│   │   ├── icon-search.ts           # Fuzzy scoring search engine
│   │   ├── icon-transformer.ts      # Dynamic SVG attribute & transform wrapper
│   │   ├── motion.ts                # Framer Motion spring and fade variants
│   │   ├── storage.ts               # Storage recovery and defensive fallbacks
│   │   └── svg/                     # Topology, bounds, normalization & validator
│   ├── routes/              # Page route components mapped to URL paths
│   │   ├── IconsRoute.tsx           # Primary archive & specimen explorer (/icons)
│   │   ├── IconDetailRoute.tsx      # Deep link icon detail route (/icons/:slug)
│   │   ├── CategoriesRoute.tsx      # Domain taxonomy hub (/categories)
│   │   ├── StylesRoute.tsx          # Vector styles hub (/styles)
│   │   ├── FavoritesRoute.tsx       # Pinned icons collection (/favorites)
│   │   ├── CollectionsRoute.tsx     # Custom icon suites (/collections)
│   │   ├── DesignSystemRoute.tsx    # Design tokens & typography showcase
│   │   ├── DevQARoute.tsx           # Multi-resolution rendering QA
│   │   ├── IconRenderingQARoute.tsx # Geometry consistency test bench
│   │   ├── IconoirQARoute.tsx       # Iconoir catalog inspection
│   │   └── NotFoundRoute.tsx        # Custom 404 page
│   ├── styles/              # Global SCSS, CSS, and Design Token definitions
│   │   ├── globals.css              # Tailwind base, components, and utilities
│   │   ├── globals.scss             # Typography, scrollbar, and resets
│   │   ├── icon-grid.scss           # Specimen card layouts and grid ratios
│   │   ├── motion.scss              # Keyframe animations (float, pulse)
│   │   ├── tokens.css               # CSS custom properties (:root & [data-theme])
│   │   ├── tokens.scss              # SCSS variables mirror
│   │   └── utilities.scss           # Typography mixins and layout helpers
│   ├── tests/               # Test suites and regression verifiers
│   │   ├── all-tests.ts             # Master runner executing all 9 test suites
│   │   ├── category-taxonomy-validation.ts # Verifies 44 canonical categories
│   │   ├── collections-test.ts      # Validates set CRUD and defensive storage
│   │   ├── export-verification.ts   # Tests TSX, SVG, CSS Mask, and Data URI export
│   │   ├── geometry-consistency-test.ts # Tests 100% path preservation
│   │   ├── sanitizer-test.ts        # Security XSS and attribute sanitizer test
│   │   ├── search-filter-test.ts    # Tests fuzzy scoring and style filters
│   │   ├── ux-pass-verification.ts  # Verifies catalog counts and interaction
│   │   └── variant-system-test.ts   # Tests topology safety & variant generation
│   └── types/               # TypeScript interfaces and domain models
│       ├── collection.ts            # Icon set and collection models
│       ├── customization.ts         # Stroke, size, color, transform models
│       ├── export.ts                # Export format and result models
│       ├── filters.ts               # Filter state and sort options
│       └── icon.ts                  # Icon, IconVariant, OpticalMetrics definitions
├── index.html               # SPA HTML entry point
├── package.json             # NPM dependencies, metadata, and scripts
├── tailwind.config.ts       # Tailwind CSS theme extension
├── tsconfig.json            # TypeScript compiler configuration
├── vercel.json              # Vercel SPA rewrite & caching headers
└── vite.config.ts           # Vite bundler configuration & manual chunks
```

---

## 5. File Inventory

### Exact Repository File Counts
- **Total Source Files in `src/`**: `188`
- **TypeScript Source Files (`.ts`)**: `80` (src: 65, scripts: 13, configs: 2)
- **TypeScript React Files (`.tsx`)**: `107`
- **SCSS Stylesheets (`.scss`)**: `5` (`globals.scss`, `icon-grid.scss`, `motion.scss`, `tokens.scss`, `utilities.scss`)
- **CSS Stylesheets (`.css`)**: `2` (`globals.css`, `tokens.css`)
- **JSON Configuration & Data Files (`.json`)**: `11`
- **Route / Page Modules**: `12` in `src/routes/`
- **Component Modules**: `100` (`39` in `src/components/` + `61` in `src/features/`)
- **Custom Hooks**: `15` (`9` in `src/hooks/` + `6` in feature modules)
- **Utility / Library Modules**: `22` in `src/lib/` (including 10 in `src/lib/svg/`)
- **Data & Catalog Modules**: `19` in `src/data/`
- **Test Modules**: `9` in `src/tests/`
- **Build / Maintenance Scripts**: `13` in `scripts/`

---

## 6. Application Entry Flow

```text
index.html
  │ (Loads Google Fonts: General Sans, JetBrains Mono, Inter)
  ▼
src/main.tsx
  │ (Mounts React DOM with React.StrictMode, imports globals.css & globals.scss)
  ▼
src/app/App.tsx
  │ (Renders Providers tree & RouterProvider)
  ▼
src/app/providers.tsx
  │ ├─ ThemeProvider: Reads/writes localStorage 'gridframe-theme', toggles documentElement class
  │ ├─ LenisProvider: Instantiates smooth scroll RAF loop with custom scroll tracking
  │ └─ ToastProvider: Provides global success/error toast dispatching
  ▼
src/app/router.tsx
  │ └─ AppShell (Skip to content, ErrorBoundary, global ⌘K keyboard listener)
  ▼
src/components/layout/WorkspaceShell.tsx
  │ ├─ Header (Dedicated 56px mobile header on < md; 80-96px desktop header on >= md)
  │ ├─ Main Container (max-w-[1600px] responsive grid stage)
  │ ├─ MobileNav (Sticky mobile bottom navigation on < md)
  │ └─ Fallback CommandPalette (Triggered by mobile header search button)
  ▼
Active Route Component (e.g. src/routes/IconsRoute.tsx)
```

---

## 7. Routes & Pages

| Route | File Location | Purpose | Main Components | Responsive Behavior |
|---|---|---|---|---|
| `/` | `src/app/router.tsx` | Index redirect | `<Navigate to="/icons" replace />` | Immediate redirect |
| `/icons` | `src/routes/IconsRoute.tsx` | Primary vector archive & discovery hub | `ExplorerToolbar`, `SpecimenGrid`, `IconDetailModal`, `CommandPalette` | 2-col grid on mobile, 3-col on tablet, 4-6 col on desktop |
| `/icons/:slug` | `src/routes/IconDetailRoute.tsx` | Deep link route for individual icon | `WorkspaceShell`, `IconDetailModal`, `SpecimenGrid` | Full-screen vertical modal on mobile; 2-col dialog on desktop |
| `/categories` | `src/routes/CategoriesRoute.tsx` | 44-Domain taxonomy directory | `CategoryDirectory`, `SpecimenGrid`, `IconDetailModal` | 1-col on mobile (min-h: 145px), 2-col tablet, 4-col desktop |
| `/categories/:category` | `src/routes/CategoriesRoute.tsx` | Single category specimen view | Category search bar, style filter, `SpecimenGrid` | Responsive grid with adjacent category links |
| `/styles` | `src/routes/StylesRoute.tsx` | 5-Variant style taxonomy directory | Style cards, stroke tier badges, `SpecimenGrid` | 1-col mobile, 2-col tablet, 3-col desktop |
| `/styles/:style` | `src/routes/StylesRoute.tsx` | Single style specimen view | Style metadata header, `SpecimenGrid` | Filtered specimen view with style preservation |
| `/favorites` | `src/routes/FavoritesRoute.tsx` | Pinned favorite icons workstation | `FavoritesPage`, `SpecimenGrid`, `IconDetailModal` | Empty state with quick browse link; responsive grid |
| `/collections` | `src/routes/CollectionsRoute.tsx` | Custom icon set manager & export | `CollectionList`, `CollectionModal`, `CollectionCard` | Responsive grid of custom suites with vector counts |
| `/collections/:id` | `src/routes/CollectionsRoute.tsx` | Single collection detail & zip export | `CollectionDetailPage`, `SpecimenGrid` | Batch export panel with icon removal triggers |
| `/design-system` | `src/routes/DesignSystemRoute.tsx` | Design tokens & typography showroom | Token swatch grid, typography scale, UI buttons | Responsive typography and color swatch grid |
| `/qa` & `/dev/qa` | `src/routes/DevQARoute.tsx` | Multi-resolution rendering QA workbench | Optical bounds inspector, keyshape tester | Side-by-side comparison across 16, 20, 24, 32, 48, 64px |
| `/icon-rendering` | `src/routes/IconRenderingQARoute.tsx` | Geometry consistency & regression suite | Vector silhouette comparison canvas | Visual diffing against canonical Iconoir artwork |
| `*` | `src/routes/NotFoundRoute.tsx` | 404 error page | Editorial not found message, Return to Archive button | Centered card with return button |

---

## 8. Component Architecture

```text
AppShell (src/components/layout/AppShell.tsx)
└── WorkspaceShell (src/components/layout/WorkspaceShell.tsx)
    ├── Header (src/components/layout/Header.tsx)
    │   ├── Mobile Header (< md: 56px)
    │   │   ├── Brand Logo (Compact mark)
    │   │   ├── Context Badge (Archive / Domains / Styles / Saved / Sets)
    │   │   ├── Search Trigger Button -> opens CommandPalette
    │   │   ├── SkiperThemeToggle (Dark / Light toggle)
    │   │   └── Menu Drawer Trigger Button -> opens MobileNavigation
    │   ├── Desktop Header (>= md: 80–96px)
    │   │   ├── Studio Wordmark Logo
    │   │   ├── PrimaryNavigation (01 Archive, 02 Domains, 03 Styles)
    │   │   ├── Saved Items Counter Link
    │   │   ├── Sets Counter Link
    │   │   └── SkiperThemeToggle
    │   └── MobileNavigation (src/components/navigation/MobileNavigation.tsx)
    │       ├── Header & Close Button
    │       ├── Primary Archive Index Links
    │       ├── Curation & Storage Cards (Saved / Sets)
    │       └── Theme & Version Footer (with pb-safe)
    ├── Main Route Content
    │   ├── ExplorerToolbar (src/features/icon-explorer/ExplorerToolbar.tsx)
    │   │   ├── Primary Hero Search Input (with ⌘K indicator)
    │   │   ├── Category Domain Scroll Strip (Native horizontal scroll)
    │   │   ├── Segmented Style Switcher (All, Light, Regular, Filled, Duotone)
    │   │   └── Sort Select Dropdown (Popular, Newest, Name A-Z, Name Z-A)
    │   └── SpecimenGrid (src/features/icon-explorer/SpecimenGrid.tsx)
    │       ├── SpecimenCard (src/features/icon-explorer/SpecimenCard.tsx)
    │       │   ├── Corner Optical Crop Marks
    │       │   ├── Top Domain Tag + Favorite Button (44px hit target)
    │       │   ├── IconPreviewSvg (Canonical 24×24 artwork)
    │       │   ├── Floating Hover Action Pill (1-click Copy SVG / Download)
    │       │   └── Footnote: Name + Variant Count Badge
    │       └── Infinite Scroll Sentinel (IntersectionObserver auto-batch)
    ├── IconDetailModal (src/features/icon-modal/IconDetailModal.tsx)
    │   ├── Left Column: Preview Canvas
    │   │   ├── Dotted Matrix Grid (CanvasGrid)
    │   │   ├── Centered Scaled Vector with Padding & Animation
    │   │   ├── View Code Snippet Button -> opens CodeModal
    │   │   └── Dimension Footnote (24×24 PX)
    │   └── Right Column: Controls & Actions
    │       ├── Category, Name, Context Info Popover, Favorite Toggle
    │       ├── Tag List
    │       ├── Authentic Variant Selector Chips
    │       ├── Color Presets (Current, Ivory, Obsidian, Orange, Slate, Gold + Custom Picker)
    │       ├── Size Presets (16, 24, 32, 48, 64px)
    │       ├── Padding Presets (0px, 8px, 16px) & Animation Select (Spin, Pulse, Bounce, Float)
    │       ├── Flip (H/V) & Rotation (-90°, 0°, +90°) Controls
    │       ├── Primary Actions (Copy SVG Code, Download SVG)
    │       └── Subordinate Actions (Add to Collection, Reset)
    └── MobileNav (src/components/layout/MobileNav.tsx)
        └── Bottom Tab Bar (Archive, Domains, Styles, Saved, Sets with pb-safe)
```

---

## 9. UI Components

All reusable UI components live in `src/components/ui/` and `src/components/ui/skiper/`:

### 1. `Button` (`src/components/ui/Button.tsx`)
- **Variants**: `primary` (accent orange fill), `secondary` (subtle border/bg), `ghost` (transparent hover), `destructive` (red).
- **Sizes**: `xs` (28px), `sm` (34px), `md` (40px), `lg` (48px).
- **Features**: Accessible focus ring, touch-manipulation, loading spinner state.

### 2. `Modal` (`src/components/ui/Modal.tsx`)
- **Structure**: Framer Motion animated backdrop with `backdrop-blur-sm`, dialog container with `shadow-modal`, close button, dual scroll locking via `useScrollLock`.

### 3. `SkiperThemeToggle` (`src/components/ui/skiper/SkiperThemeToggle.tsx`)
- **Behavior**: Smooth rotational SVG animation transitioning between Sun and Moon glyphs. Persists theme preference to `localStorage` and toggles `dark` class on `document.documentElement`.

### 4. `SkiperTooltip` (`src/components/ui/skiper/SkiperTooltip.tsx`)
- **Behavior**: Micro-interaction tooltip with customizable sides (`top`, `bottom`, `left`, `right`) and smooth opacity spring.

### 5. `SkiperSegmentedTabs` (`src/components/ui/skiper/SkiperSegmentedTabs.tsx`)
- **Behavior**: iOS/macOS style pill segmented controller with sliding active indicator.

---

## 10. Icon Architecture

```text
Canonical Source (Iconoir 7.12.1 SVG Files)
                    │
                    ▼
Import & Validation Pipeline (scripts/import-iconoir.ts)
  ├─ Path Topology Analysis (Closed vs Open paths)
  ├─ Optical Bounds Verification (24×24 coordinate matrix)
  └─ Semantic Tagging & Category Assignment (44 Canonical Domains)
                    │
                    ▼
In-Memory Catalog Registry (src/data/icons/gridframe-catalog.ts)
  └─ 1,420+ Concept Entries, 1,708+ Validated Variants
                    │
                    ▼
Deterministic Variant Resolution
  ├─ Homepage Cards: Always resolve to canonical 'regular' variant
  ├─ Style Hub: Resolves requested style ('filled', 'light', etc.)
  └─ Icon Detail Modal: Exposes all authentic variants
                    │
                    ▼
Live Transformation Pipeline (src/lib/icon-transformer.ts)
  ├─ Non-destructive SVG wrapper
  ├─ Stroke Width, Linecap, Linejoin injection
  ├─ Optical Color & Dimension scaling
  └─ Geometric Matrix Transforms (rotate, flipX, flipY)
                    │
                    ▼
Multi-Format Exporters (src/lib/export-formatters.ts)
  ├─ Clean Sanitized SVG (.svg)
  ├─ Modern React TSX Component (.tsx)
  ├─ Inline HTML Wrapper (.html)
  ├─ CSS Mask Definition (.css)
  └─ Data URI String (.txt)
```

---

## 11. Icon File Structure

The active icon library stores normalized vector artwork directly in TypeScript catalog definitions:

```text
src/data/
├── icons/
│   ├── gridframe-catalog.ts   # Master catalog exporting GRIDFRAME_ICONS (1,420+ items)
│   ├── catalog.json           # JSON serialization for tooling
│   ├── categories.json        # 44 domain taxonomy definitions
│   └── variantOverrides.ts    # Manual path topology overrides for duotone layers
└── categories.ts              # Category metadata, order indices, descriptions
```

Every icon record adheres to the following interface:

```typescript
export interface Icon {
  id: string;               // Unique ID: e.g. "accessibility"
  name: string;             // Display Name: e.g. "Accessibility"
  slug: string;             // URL-friendly slug: e.g. "accessibility"
  category: string;         // Primary domain: e.g. "Actions"
  tags: string[];           // Search keywords: ["wheelchair", "disabled", "a11y"]
  keywords: string[];       // Expanded index tokens
  style: IconStyle;         // Default style: "regular"
  variants: IconVariant[];  // Authentic variant list (Light, Regular, Filled, Duotone)
  svg: string;              // Canonical SVG inner markup
  viewBox: string;          // "0 0 24 24"
  relatedIconIds: string[]; // Slugs of adjacent concepts in taxonomy
}
```

---

## 12. SVG Icon Design Guidelines

All vector icons in Gridframe strictly adhere to the following geometric standards:

1. **ViewBox**: Exactly `0 0 24 24`. No arbitrary dimensions or fractional viewBox coordinates.
2. **Coordinate Grid**: 24×24 unit square with 1px live coordinate resolution.
3. **Safe Area & Padding**: 2px outer margin for stroke bounds (live drawing area: 20×20 px, coordinates 2.0 to 22.0).
4. **Stroke Weights**:
   - `Light`: `1.0px` stroke weight.
   - `Regular` (Default): `1.5px` stroke weight.
   - `Bold`: `2.0px` stroke weight.
5. **Stroke Caps & Joins**: `stroke-linecap="round"` and `stroke-linejoin="round"` standard across all open path geometry.
6. **Color Independence**: Paths must use `stroke="currentColor"` or `fill="currentColor"`. No hardcoded hex codes in path attributes.
7. **No Layout Shift**: Outer `<svg>` maintains aspect-ratio 1:1.

---

## 13. Five Icon Variants

Gridframe supports five distinct visual styles:

| Variant | Visual Execution | Default Stroke | Fill Behavior | Path Topology Requirement |
|---|---|---|---|---|
| **1. Light** | Refined thin hairline | `1.0px` | `fill="none"` | Open or closed stroked paths |
| **2. Regular** | Standard baseline outline | `1.5px` | `fill="none"` | Open or closed stroked paths (Primary Source) |
| **3. Filled** | Solid silhouette | `0px` | `fill="currentColor"` | Closed path geometry only (Zero stroked outlines) |
| **4. Duotone** | High-contrast two-tone | `1.5px` | 20% opacity fill | Outline geometry + secondary tinted underlay |
| **5. Duotone Line** | Dual-weight line accent | `1.5px` + `0.75px` | `fill="none"` | Primary stroke + secondary decorative stroke |

---

## 14. How to Create a New Icon

1. **Draw Vector Artwork**: Create a 24×24 SVG in Illustrator, Figma, or Penpot.
2. **Align to Grid**: Align path vertices to integer/half-integer coordinates.
3. **Export Clean Regular SVG**: Set stroke to 1.5px, cap/join to round, remove unnecessary `<g>` wrappers.
4. **Create Variants**: Create corresponding Filled and Light variants if applicable.
5. **Register in Catalog**: Add entry to `src/data/icons/gridframe-catalog.ts`.
6. **Validate**: Run `npm run icons:validate` to verify geometry and category assignment.
7. **QA**: Test rendering at 16, 24, 32, 48, 64px on `/dev/qa`.

---

## 15. Icon Metadata

Each icon metadata entry provides rich context for search and rendering:

```typescript
export interface IconMetadata {
  viewBox?: string;             // "0 0 24 24"
  opticalBounds?: OpticalBounds;// Computed bounding box: { x, y, width, height }
  baseline?: number;            // Optical baseline (y = 20)
  centerX?: number;             // Optical center axis (x = 12)
  strokeWidth?: number;         // 1.5
  keyshape?: 'circle' | 'square' | 'vertical' | 'horizontal';
  unicode?: string;             // Unicode glyph representation if mapped
}
```

---

## 16. Icon Registry

The in-memory registry (`src/data/icon-repository.ts`) provides high-speed queries without network latency:
- `getAllIcons()`: Returns all 1,420+ icons.
- `getIconBySlug(slug)`: Returns single concept by exact slug match.
- `getIconsByCategory(category)`: Returns icons assigned to a specific domain.
- `getIconsByStyle(style)`: Returns icons supporting a specific style.

---

## 17. Icon Renderer

The core renderer (`src/components/icons/IconPreviewSvg.tsx`) renders the vector SVG safely:

```typescript
export const IconPreviewSvg: React.FC<IconPreviewSvgProps> = ({
  variant,
  icon,
  size = 24,
  color = 'currentColor',
  strokeWidth,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  rotation = 0,
  flipX = false,
  flipY = false,
  className,
}) => {
  // Renders inner SVG paths with applied live transform matrix and dimensions
};
```

---

## 18. Icon Customization

State managed in `IconDetailModal.tsx` via `IconCustomization` interface:

```typescript
export interface IconCustomization {
  color: string;            // 'currentColor', '#FF5024', or custom HEX
  size: number;             // 16, 24, 32, 48, 64
  strokeWidth?: number;     // 1.0 to 2.5
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  rotation: number;         // 0, 90, 180, 270 degrees
  flipX: boolean;           // Horizontal mirror
  flipY: boolean;           // Vertical mirror
}
```

---

## 19. Icon Transform System

Transforms are applied non-destructively around the center coordinate `(12, 12)`:

```typescript
const transforms: string[] = [];
if (customization.rotation) {
  transforms.push(`rotate(${customization.rotation} 12 12)`);
}
if (customization.flipX) {
  transforms.push(`scale(-1, 1) translate(-24, 0)`);
}
if (customization.flipY) {
  transforms.push(`scale(1, -1) translate(0, -24)`);
}
```

This ensures transforms remain optically centered and cleanly export to raw SVG and React JSX.

---

## 20. Preview System

The detail modal features a large preview canvas (`src/components/preview/CanvasGrid.tsx` / `IconDetailModal.tsx`):
- **Aspect Ratio**: Fluid responsive canvas (`min-h-[220px]` on mobile, `min-h-[360px]` on desktop).
- **Dotted Matrix Grid**: 24×24 radial dot pattern rendered with zero image overhead via CSS gradients:
  `radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px)`
- **Dynamic Animation Stage**: Optional testing animations: `spin`, `pulse`, `bounce`, and `float`.

---

## 21. Background System

Gridframe uses semantic theme background tokens:
- `--color-background-primary`: `#0D0C0A` (Dark) / `#FBF9F5` (Light)
- `--color-background-secondary`: `#171512` (Dark) / `#F2EEE6` (Light)
- `--color-background-elevated`: `#1F1D19` (Dark) / `#E8E2D5` (Light)
- `--color-background-overlay`: `rgba(0, 0, 0, 0.75)` (Dark) / `rgba(20, 19, 17, 0.40)` (Light)

---

## 22. Export System

Export formatters (`src/lib/export-formatters.ts`) generate clean, production-ready code:

### 1. Raw SVG
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="#FF5024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 2. React TSX Component
```tsx
import * as React from 'react';

export interface IconArrowRightRegularProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function IconArrowRightRegular({
  size = 24,
  color = '#FF5024',
  className,
  ...props
}: IconArrowRightRegularProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default IconArrowRightRegular;
```

### 3. CSS Mask Definition
```css
.icon-arrow-right {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #FF5024;
  -webkit-mask-image: url("data:image/svg+xml;utf8,...");
  mask-image: url("data:image/svg+xml;utf8,...");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
```

---

## 23. Search System

Fuzzy scoring search engine implemented in `src/lib/icon-search.ts`:
- **Scoring Weights**:
  - Exact slug / name match: **100 points**
  - Prefix name match: **80 points**
  - Word boundary match: **60 points**
  - Tag match: **40 points**
  - Keyword / category match: **20 points**
- **Performance**: Executed in `< 2ms` over 1,420+ items using pre-indexed token arrays.

---

## 24. Filtering System

Filters compose deterministically via `src/lib/icon-filtering.ts`:

```text
All Icons (1,420+)
  │
  ▼
Search Query Filter (Fuzzy score > 0)
  │
  ▼
Category Domain Filter (slug match)
  │
  ▼
Style Variant Filter (has variant matching style)
  │
  ▼
Sort Comparator (Popularity, Newest, Alphabetical A-Z, Z-A)
  │
  ▼
Visible Slice (0 to renderedCount)
  │
  ▼
SpecimenGrid Renderer
```

---

## 25. Load More System

The specimen explorer uses an auto-batching infinite scroll architecture (`src/features/icon-explorer/SpecimenGrid.tsx`):
- **Batch Size**: `BATCH_SIZE = 64` icons per slice.
- **Initial Load**: 64 cards rendered on initial page load for instantaneous FCP and TTI.
- **Sentinel**: Lightweight `IntersectionObserver` observing a sentinel element with `rootMargin: '400px'`.
- **Reset Behavior**: Reset to 64 whenever search query, category, style, or sorting changes.

---

## 26. Icon Card

`SpecimenCard` (`src/features/icon-explorer/SpecimenCard.tsx`):
- **Aspect Ratio**: `aspect-[4/4.8]` (mobile) / `aspect-[4/4.6]` (desktop).
- **Plate Corner Marks**: Subtle editorial corner crop marks on hover.
- **Top Row**: Domain label + Favorite bookmark button (44px hit target).
- **Hero Icon Stage**: Canonical 24×24 regular artwork with smooth optical floating on hover.
- **Hover Pill**: 1-click Copy SVG and Download SVG buttons with zero layout shift.
- **Bottom Footnote**: Icon name + variant count badge.

---

## 27. Animation System

- **CSS Keyframes**: `gridframe-float`, `pulse`, `spin` in `src/styles/motion.scss`.
- **Framer Motion**: Modals, drawers, and command palettes with spring physics (`damping: 30, stiffness: 300`).
- **Lenis**: Smooth scrolling on main document.
- **Reduced Motion**: All animations disabled automatically when `prefers-reduced-motion: reduce` is detected via `useReducedMotion()`.

---

## 28. Scrolling System

- **Main Document**: Smooth inertia scrolling powered by Lenis (`src/components/layout/LenisProvider.tsx`).
- **Modals & Drawers**: Native scrolling enabled via `data-lenis-prevent="true"` attribute and `useScrollLock(isOpen)` coordinating body overflow.
- **Horizontal Strips**: Native touch/wheel horizontal scrolling with `overflow-x-auto`, `overscroll-x-contain`, and `touch-pan-x`. Zero scroll hijacking.

---

## 29. Styling Architecture

- **Tokens Layer**: `src/styles/tokens.css` (CSS Custom Properties) and `tokens.scss` (SCSS variables).
- **Utility Layer**: Tailwind CSS configured in `tailwind.config.ts` mapping directly to token variables.
- **Component Layer**: Tailwind utility classes for layout + dedicated SCSS mixins for high-contrast editorial typography (`.type-hero`, `.type-h1`, `.type-section-label`).

---

## 30. Design Tokens

### Colors
- `accent`: `#FF5024` (Editorial Orange)
- `accent-hover`: `#FF6A44`
- `background-primary`: `#0D0C0A` (Dark) / `#FBF9F5` (Light)
- `background-secondary`: `#171512` (Dark) / `#F2EEE6` (Light)
- `background-elevated`: `#1F1D19` (Dark) / `#E8E2D5` (Light)
- `text-primary`: `#F6F3EC` (Dark) / `#141311` (Light)
- `text-secondary`: `#B3AEA4` (Dark) / `#59554E` (Light)
- `text-tertiary`: `#726D63` (Dark) / `#8C867A` (Light)
- `border-default`: `rgba(255, 255, 255, 0.12)` (Dark) / `rgba(0, 0, 0, 0.10)` (Light)
- `border-subtle`: `rgba(255, 255, 255, 0.06)` (Dark) / `rgba(0, 0, 0, 0.05)` (Light)

---

## 31. Typography

| Font Family | Usage | Weights | Fallback |
|---|---|---|---|
| **General Sans** | Headings, display, body, button labels | `400`, `500`, `600`, `700` | `-apple-system, BlinkMacSystemFont, sans-serif` |
| **JetBrains Mono** | Code, counts, metadata, technical labels | `400`, `500`, `700` | `Menlo, Monaco, Consolas, monospace` |

---

## 32. Responsive Architecture

Breakpoints configured in Tailwind CSS:
- `< 640px` (**Mobile**): 1-column category directory, 2-column icon grid, 56px compact header with context pill, single vertical flow detail modal.
- `640px – 1023px` (**Tablet**): 2-column category directory, 3-column icon grid.
- `>= 1024px` (**Desktop**): 4-column category directory, 4–6 column icon grid, 80–96px desktop header, centered 2-column modal.

---

## 33. State Management

- **Local UI State**: `useState` for search queries, active modal, active variant, and customizations.
- **Global Contexts**:
  - `ThemeContext`: Dark / Light persistence.
  - `ToastContext`: Transient alerts.
  - `SearchContext`: Command palette active state.
- **Persistent Storage**: Schema-versioned `localStorage` wrappers for `gridframe_favorites_v2` and `gridframe_collections_v2`.

---

## 34. Hooks

- `useFavorites()`: Add, remove, and query pinned icons with reactive counts.
- `useCollections()`: Create, edit, and delete icon suites.
- `useScrollLock(isLocked)`: Pauses Lenis and locks body overflow while dialogs are open.
- `useReducedMotion()`: Detects user OS accessibility motion preference.
- `useKeyboardShortcut(key, callback)`: Binds global key combinations (e.g. ⌘K, Esc).
- `useDebouncedValue(value, delay)`: Throttles input updates to prevent re-renders.

---

## 35. Utilities

- `transformSvgMarkup(variant, customization)`: Non-destructively wraps SVG geometry with customized stroke, dimensions, and transform attributes.
- `formatSvg`, `formatReact`, `formatHtml`, `formatDataUri`, `formatCss`: Serializes icons into target languages.
- `searchIconsWithScore(catalog, query)`: High-speed fuzzy search engine.
- `sanitizeSvgMarkup(rawSvg)`: Strips `<script>`, `onload`, and dangerous XML tags.

---

## 36. Performance Architecture

- **Manual Chunk Splitting**: Configured in `vite.config.ts`:
  - `vendor-react` (`react`, `react-dom`)
  - `vendor-motion` (`framer-motion`)
  - `vendor-icons` (`lucide-react`)
  - `vendor-lenis` (`lenis`)
- **Incremental DOM Loading**: SpecimenGrid renders 64 items initially, appending batches on scroll.
- **Non-blocking Search**: Pre-tokenized lookup arrays executed synchronously in `< 2ms`.
- **Zero Heavy WebGL**: Dotted grid rendered via pure CSS radial gradients.

---

## 37. Accessibility

- **Keyboard Navigation**: Full tab navigation, ⌘K command palette access, Escape key closing for all modals.
- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`, `aria-label`, `aria-expanded` across interactive surfaces.
- **Touch Target Sizing**: Minimum practical hit target $\ge 44\text{px}$ on all mobile buttons.
- **High Contrast**: WCAG AAA compliant text contrast ratios in both Dark and Light themes.

---

## 38. Routing

Configured with React Router v6 (`src/app/router.tsx`):
- Clean SPA URL structure (`/icons`, `/categories`, `/styles`, `/favorites`, `/collections`).
- Production SPA refresh rewrite handled via `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

---

## 39. Development Conventions

- **Component Naming**: PascalCase (e.g. `SpecimenGrid.tsx`).
- **Hook Naming**: `use` prefix in camelCase (e.g. `useScrollLock.ts`).
- **Types**: Dedicated interfaces in `src/types/`.
- **CSS Classes**: Prefer semantic Tailwind utilities over ad-hoc arbitrary values.

---

## 40. Adding a New Component

1. Check `src/components/ui/` to verify if an existing primitive can be reused.
2. Create component file in `src/components/<domain>/` or `src/features/<domain>/`.
3. Define strict TypeScript props interface.
4. Implement accessible keyboard and touch controls ($\ge 44\text{px}$).
5. Apply semantic design tokens.

---

## 41. Adding a New Page

1. Create route component in `src/routes/<Name>Route.tsx`.
2. Wrap content with `<WorkspaceShell>` for consistent layout and mobile navigation.
3. Add route definition to `src/app/router.tsx`.
4. Update navigation links in `Header.tsx`, `MobileNavigation.tsx`, and `MobileNav.tsx`.

---

## 42. Adding a New Icon

1. Ensure icon artwork is designed on a 24×24 grid with 1.5px stroke weight.
2. Append icon record to `src/data/icons/gridframe-catalog.ts`.
3. Assign appropriate category from the 44 canonical domains.
4. Run `npm run icons:validate` to confirm geometry passes all regression tests.

---

## 43. Adding a New Category

1. Add category definition to `ICON_CATEGORIES` in `src/data/categories.ts`.
2. Assign order index and descriptive summary.
3. Assign icons in `gridframe-catalog.ts` to the new category name.

---

## 44. Bulk Icon Workflow

1. Place source SVG files in `sources/iconoir/`.
2. Run `npm run icons:import` (`scripts/import-iconoir.ts`) to parse, sanitize, and extract paths.
3. Run `npm run icons:validate` to run topology analyzers and verify 0 duplicates.
4. Run master test runner `npx tsx src/tests/all-tests.ts`.

---

## 45. Testing & QA

Run the unified test suite:

```bash
npx tsx src/tests/all-tests.ts
```

### Verified Test Suites:
1. `category-taxonomy-validation.ts`: Verifies all 44 canonical domains.
2. `geometry-consistency-test.ts`: Confirms 100% path preservation against authentic Iconoir sources.
3. `export-verification.ts`: Tests raw SVG, React TSX, CSS Mask, and Data URI generators.
4. `sanitizer-test.ts`: Verifies XSS prevention and script tag elimination.
5. `search-filter-test.ts`: Tests sub-ms fuzzy scoring and style filter predicates.
6. `collections-test.ts`: Validates CRUD operations and storage recovery.
7. `variant-system-test.ts`: Tests topology safety and optical centering delta.
8. `ux-pass-verification.ts`: Tests responsive layout constraints and item counts.

---

## 46. Development Commands

```bash
# Start local development server (port 5173 / host)
npm run dev

# Compile TypeScript and build production bundle
npm run build

# Preview production build locally
npm run preview

# Import and process canonical vector catalog
npm run icons:import

# Run catalog validation and path integrity checks
npm run icons:validate

# Generate comprehensive icon catalog report
npm run icons:report

# Run master test suite
npx tsx src/tests/all-tests.ts
```

---

## 47. Environment Variables

Gridframe is a client-side, local-first application and does not require external backend API keys or secrets for local development or production hosting.

---

## 48. Dependency Inventory

### Production Dependencies (`dependencies` in `package.json`)
- `react` (`^18.3.1`): Core UI library.
- `react-dom` (`^18.3.1`): DOM rendering engine.
- `react-router-dom` (`^6.30.6`): Client-side routing.
- `framer-motion` (`^12.4.7`): Animation and dialog physics.
- `lenis` (`^1.3.26`): Inertia smooth scrolling.
- `lucide-react` (`^1.16.0`): Interface icons.
- `clsx` (`^2.1.1`) & `tailwind-merge` (`^3.0.2`): Class name merging.
- `class-variance-authority` (`^0.7.1`): Type-safe component variants.

### Development Dependencies (`devDependencies` in `package.json`)
- `vite` (`^6.2.0`): Build tool & dev server.
- `typescript` (`^5.7.3`): TypeScript compiler.
- `tailwindcss` (`^3.4.17`): Tailwind CSS compiler.
- `sass` (`^1.85.1`): SCSS preprocessor.
- `postcss` (`^8.5.3`) & `autoprefixer` (`^10.4.20`): CSS post-processing.
- `iconoir` (`^7.12.1`): Upstream canonical icon library source.

---

## 49. Generated Files

The following directories/files are automatically built and should **not** be manually modified:
- `dist/`: Static production build directory generated by `npm run build`.
- `node_modules/`: Package dependencies installed by `npm install`.
- `package-lock.json`: NPM dependency lockfile.

---

## 50. Architecture Diagrams

### End-to-End User Interaction Flow

```text
User Actions
  │
  ├─ Search Input / ⌘K -> triggers Fuzzy Search (src/lib/icon-search.ts)
  ├─ Select Domain -> updates Category Filter (src/lib/icon-filtering.ts)
  ├─ Select Style -> switches Specimen View Variant (src/data/styles.ts)
  └─ Click Specimen Card -> opens IconDetailModal (src/features/icon-modal/)
                                  │
                                  ▼
                    Live Optical Customizer
                      ├─ Color / Size / Padding / Animation
                      └─ Rotation (-90°/0°/+90°) & Flip (H/V)
                                  │
                                  ▼
                    Non-Destructive Transform
                    (src/lib/icon-transformer.ts)
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
  Copy SVG Code            Download SVG            Copy React Component
  (Clean Raw SVG)          (Icon File .svg)        (TypeScript TSX)
```

---

## 51. Architectural Decisions

1. **Elimination of 3D Canvas in Favor of Pure SVG**:
   - *Decision*: Removed Three.js/R3F in favor of a 24×24 dotted matrix grid.
   - *Reason*: Eliminates 400KB+ bundle weight, prevents WebGL context crashes on mobile, and guarantees 100% vector fidelity.
2. **Deterministic Regular Variant for Specimen Cards**:
   - *Decision*: All homepage cards render the canonical Regular variant regardless of modal state.
   - *Reason*: Prevents confusing layout shifts and maintains consistent visual rhythm across the directory.
3. **Dedicated Mobile Header (56px)**:
   - *Decision*: Compact mobile header with Left Logo, Center Context Pill, and Right Search/Theme/Menu buttons.
   - *Reason*: Maximizes vertical viewport on phones while keeping primary navigation accessible.
4. **Local-First Storage Architecture**:
   - *Decision*: Favorites and collections synced to schema-versioned `localStorage`.
   - *Reason*: Zero user friction; instant offline-capable curation without mandatory user accounts.

---

## 52. Known Limitations

1. **Large Catalog Bundle Size**: The in-memory catalog is ~3.8MB uncompressed. Future work will explore dynamic chunking for secondary variants.
2. **Client-Side Only Collections**: Collections are stored in the local browser; cross-device sync requires manual JSON export/import.

---

## 53. Future Roadmap

### Phase 1: Near Term (Now)
- [x] Dedicated compact mobile header and mobile-first navigation drawer.
- [x] Full-screen touch-friendly icon detail modal.
- [x] Unified regression testing suite (`all-tests.ts`).
- [ ] Export custom collections as downloadable ZIP archives containing SVGs and React components.

### Phase 2: Medium Term (Next)
- [ ] JSON Export & Import for custom collections backup.
- [ ] Animated SVG export format (CSS keyframe injection for spin/pulse/float).
- [ ] SVG optimizer integration (SVGO web assembly runner).

### Phase 3: Long Term (Later)
- [ ] Direct Figma Plugin integration via Gridframe API.
- [ ] Custom icon upload and automatic 24×24 grid optical alignment analyzer.

---

## 54. Maintenance Rules

1. **Preserve Authentic Geometry**: Never normalize, approximate, or procedurally regenerate vector paths during rendering.
2. **Maintain 100% Test Coverage**: Always run `npx tsx src/tests/all-tests.ts` and `npm run build` prior to merging code changes.
3. **Update Documentation**: Any modifications to routing, components, tokens, or export generators must be immediately documented in `/ROADMAP.md`.
