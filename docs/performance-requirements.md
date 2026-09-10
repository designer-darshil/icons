# Glyphroom — Performance Requirements & Engineering Strategy

## 1. Performance Goals & SLA
- **Initial Load (FCP / LCP):** < 0.8s on modern broadband; < 1.8s on 4G mobile.
- **Search Latency:** < 20ms response time against a dataset of 5,000+ icons using client-side pre-indexed inverted search or Fuse.js.
- **Frame Rate:** Consistent 60fps (120fps on ProMotion displays) during grid scroll, customizer slider adjustments, and panel animations.
- **Bundle Budget:** Core client bundle < 150kB gzipped (excluding raw icon SVG dataset which is chunked or loaded on demand).

## 2. Architectural Optimization Patterns
- **Memoized Icon Card Rendering:** `React.memo` with custom equality check prevents unnecessary re-rendering of unselected grid tiles during filter adjustments or customizer interactions.
- **CSS Content Visibility & Containment:** Apply `content-visibility: auto; contain-intrinsic-size: 100px;` or windowed virtualization (`@tanstack/react-virtual`) when the library exceeds 1,000 icons.
- **Zero Runtime SVG String Parsing:** Icons are pre-parsed into lightweight JSON ASTs or structured SVG paths at build/ingestion time.
- **Dynamic Imports:** Heavy code formatters (Prettier, Babel standalone if needed, ZIP archivers for bulk export) are loaded dynamically only when the user opens the export drawer or triggers bulk download.
- **Lenis Smooth Scroll:** Restricted strictly to the primary explorer body; disabled for code previews, customizer panels, and filter drawers.
