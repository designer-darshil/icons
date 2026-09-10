# Glyphroom — UX & Interaction Architecture

## 1. Three-Layer Workspace Architecture
Glyphroom organizes user workflows into three coordinated layers:

1. **Discovery Layer (Global Controls & Filters)**
   - Top navigation bar: Brand identity, Global Command Search (`Cmd+K` / `Ctrl+K`), quick navigation (`Icons`, `Categories`, `Styles`, `Favorites`, `Collections`), density toggle, theme switcher.
   - Filter Rail / Toolbar: Category list, style pill selectors (Linear, Outline, Bold, Filled, Duotone, Two-Tone, Broken, Mono), weight filters, active filter chips with one-click clear, and sorting controls (Popularity, Alphabetical, Date Updated).

2. **Exploration Layer (Interactive Icon Grid)**
   - Responsive, fluid icon grid with CSS `minmax()` containment.
   - Micro-actions on hover/focus: Quick Copy SVG, Quick Favorite toggle, Add to Collection.
   - Direct click opens selection without triggering full page reload.
   - Keyboard roving tabindex allowing arrow-key exploration across the grid.

3. **Inspection Layer (Contextual Detail & Customizer Panel)**
   - Desktop (≥1280px): Persistent right-hand inspector panel (360px–460px width) allowing real-time grid browsing alongside customization.
   - Tablet (768px–1279px): Wide sliding drawer/overlay with backdrop blur.
   - Mobile (320px–767px): Full-screen sheet/view with sticky bottom export bar and tabbed customizer controls.

## 2. Interaction Principles & Context Preservation
- **Non-Destructive Navigation:** Changing variant styles, adjusting stroke width, or applying filters does not reset the user's scroll position or browsing state.
- **Deep Linking:** Detail views map cleanly to `/icons/:slug` via route-aware modals/panels, enabling direct links to specific icons without losing explorer state on direct visits.
- **Progressive Disclosure:** Essential controls (Color, Size, Stroke Width, Quick Copy) are immediately visible; secondary parameters (Linecap, Linejoin, Matrix transforms, Transform Flip, Metadata, Raw SVG markup) reside in collapsible accordion sections.
- **Immediate Vector Feedback:** Customizer adjustments reflect instantly on the preview canvas with zero rendering lag.
