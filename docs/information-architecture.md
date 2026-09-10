# Glyphroom — Information Architecture

## 1. Top-Level Taxonomy & Hierarchy
```text
Glyphroom Root
├── Icons (All Icons Explorer)
│   ├── Filter by Category (e.g., Interface, Editor, Arrows, Media, Communication, Commerce, Shapes, Hardware)
│   ├── Filter by Style (Linear, Outline, Bold, Filled, Duotone, Two-tone, Broken, Mono)
│   ├── Filter by Weight / Stroke Support
│   └── Sort (Popular, Name A-Z, Name Z-A, Newest)
├── Categories
│   └── Category Explorer View (/categories/:category)
├── Styles
│   └── Style Explorer View (/styles/:style)
├── Favorites (/favorites)
│   └── Locally saved favorite icons with bulk actions (Export All SVG, Download ZIP)
├── Collections (/collections)
│   ├── Collection List & Creation Modal
│   └── Collection Detail View (/collections/:collectionId) with batch export
└── Icon Detail & Studio Inspector (/icons/:slug)
    ├── Primary Preview Canvas (Grid/Dark/Light/Transparent backdrop)
    ├── Variant Switcher (Style variants for active icon)
    ├── Live Vector Customizer (Color, Stroke, Cap/Join, Transforms, Dimensions)
    ├── Export Center (SVG, React TSX/JSX, Vanilla HTML, Download SVG/PNG)
    ├── Metadata Inspector (Tags, Category, Author, License, Slug, Dimensions)
    └── Related Icons (Contextual cross-links)
```

## 2. Navigation Architecture
- **Global Header:** Brand Logo, Search Bar Trigger (`⌘K`), Explorer Links (`Icons`, `Categories`, `Styles`, `Favorites`, `Collections`), GitHub / Documentation Links, Theme Toggle (Dark, Light, System).
- **Explorer Toolbar:** Active Query Indicator, Results Count, Category Quick-Scroll Chips, Style Switcher Tabs, Sort Dropdown, Grid Density Controls (`Compact`, `Comfortable`, `Spacious`), Reset All Filters.
- **Icon Card Anatomy:** Vector Preview (centered in responsive viewport), Icon Name (truncated with tooltip), Style Badge, Quick Action Overlay (Copy SVG, Toggle Favorite, Quick Customize).
