# GRIDFRAME Icon Design Language Specification (v2.0)

## 1. Design Philosophy

GRIDFRAME is an original, precision-engineered geometric icon library crafted for modern technical user interfaces, developer tools, and editorial design systems.

### Core Principles
- **Clarity over Decoration**: Every anchor point, curve, and stroke is intentional. Unnecessary embellishments are removed to ensure immediate symbolic recognition at small scales.
- **Strict Geometric Discipline**: Constructed on a rigid 24×24 pixel canvas with consistent 2.0px stroke outlines, round terminal caps, and standardized corner radii.
- **Optical Balance**: Mathematical centering is always adjusted for perceived visual mass and keyshape bounding boxes.
- **One Canonical Family → 5 Visual Variants**: Every icon concept is authored with five coordinated variants sharing identical optical centers and proportions.

---

## 2. Canonical Canvas & Safe Zone

```
0                     12                    24
0 +-------------------+---------------------+
  |                   | 1px Outer Safe Zone |
1 |   +---------------+-----------------+   |
  |   |               |                 |   |
  |   |               |                 |   |
  |   |               |                 |   |
12|---|---------------+--- Center (12,12)---|
  |   |               |                 |   |
  |   |               |                 |   |
  |   |               |                 |   |
23|   +---------------+-----------------+   |
  |                   |                     |
24+-------------------+---------------------+
```

- **Canvas Size**: `width="24" height="24" viewBox="0 0 24 24"`
- **Active Safe Zone**: `22 × 22` px (bounded within `x: [1, 23]`, `y: [1, 23]`).
- **Outer Padding**: `1.0px` minimum boundary margin on all four sides to prevent subpixel edge clipping.

---

## 3. The 5-Variant System

| Variant | Stroke Weight | Fill Treatment | SVG Pattern |
| :--- | :--- | :--- | :--- |
| **Light** | 1.5px | None (`fill="none"`) | `<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />` |
| **Regular** (Reference) | 2.0px | None (`fill="none"`) | `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />` |
| **Filled** | 0px (Solid) | `fill="currentColor"` | `<path fill="currentColor" stroke="none" fill-rule="evenodd" />` (counters preserved) |
| **Duotone** | 2.0px Outline | 20% Opacity Fill | `<path ... opacity="0.2" fill="currentColor" stroke="none" /><path stroke="currentColor" stroke-width="2" fill="none" />` |
| **Duotone Line** | 2.0px Outline | 25% Opacity Accent | `<path ... opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" /><path stroke="currentColor" stroke-width="1.5" fill="none" />` |

---

## 4. Keyshape Reference Standards

To guarantee consistent perceived visual weight across different geometries, all icons are mapped against four canonical keyshapes:

1. **Circle**: `20 × 20` px (diameter = 20, center = 12, 12).
2. **Square**: `18 × 18` px (bounds `[3, 3]` to `[21, 21]`, corner radius = 2px).
3. **Horizontal Rectangle**: `20 × 16` px (bounds `[2, 4]` to `[22, 20]`).
4. **Vertical Rectangle**: `16 × 20` px (bounds `[4, 2]` to `[20, 22]`).

---

## 5. Stroke, Curve & Corner Rules

- **Stroke Caps & Joins**: Always `stroke-linecap="round"` and `stroke-linejoin="round"`.
- **Corner Radii**: Standardized at `rx="2"` or `2px` for outer containers, and `1px` or `1.5px` for compact inner cutouts.
- **Minimum Internal Spacing**: Maintain `≥ 2.0px` optical clearance between adjacent non-touching strokes to prevent visual fusion at 16px.
- **Curve Economy**: Use smooth circular arcs or minimal Bézier tangents. Avoid sharp kinks and asymmetrical inflection points.

---

## 6. Naming & Taxonomy Conventions

- **Slug Format**: Strictly lowercase kebab-case (`[group]-[modifier]`), e.g., `arrow-up`, `chevron-down`, `user-check`, `file-text`.
- **Family Structure**: Sibling concepts must share the same `family` identifier and base geometric contours.
- **Category System**:
  - `Arrows`
  - `Interface`
  - `Communication`
  - `Files`
  - `Media`
  - `Security`
  - `People`
  - `Navigation`
  - `Maps`
  - `Time`
  - `System`
  - `Social`

---

## 7. SVG Hygiene & Production Constraints

1. **No External Dependencies**: No CSS classes, embedded raster images, or font glyphs.
2. **Color Invariance**: Only use `currentColor` and clean SVG opacity attributes (`opacity="0.2"`). Zero hardcoded hex colors.
3. **No Unnecessary Transforms**: Normalize coordinates into standard canvas space (`0 0 24 24`) without matrix transforms in source data.
4. **Valid XML**: Properly closed tags, valid numeric path tokens, and clean `xmlns="http://www.w3.org/2000/svg"`.
