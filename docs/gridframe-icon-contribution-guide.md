# GRIDFRAME Icon Contribution & Authoring Guide

This guide outlines the step-by-step procedure for authoring and contributing new icon concepts to the native GRIDFRAME Icon Library.

---

## 1. Icon Creation Workflow

```
1. Concept Definition & Duplicate Check
   ↓
2. Family Grouping & Sibling Alignment
   ↓
3. Draft Regular Variant on 24×24 Grid
   ↓
4. Optical Weight & Safe Zone Calibration
   ↓
5. Author Coordinated 5-Variants (Light, Regular, Filled, Duotone, Duotone Line)
   ↓
6. Add Metadata (Tags, Aliases, Use Cases, Category)
   ↓
7. Run Automated Validation (`npm run icons:validate`)
   ↓
8. Visual QA Inspection (`npm run icons:qa`)
```

---

## 2. Authoring All 5 Variants

When adding an icon family to `src/data/native-icons/golden-library.ts`, provide all 5 variants explicitly:

```typescript
{
  id: 'example-icon',
  name: 'Example Icon',
  slug: 'example-icon',
  family: 'example',
  category: 'Interface',
  tags: ['example', 'demo', 'sample'],
  keywords: ['concept', 'symbol'],
  aliases: ['sample-icon'],
  useCases: ['Demonstrating feature functionality'],
  popularity: 80,
  variants: {
    light: {
      style: 'light',
      svg: `<path d="..." stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 1.5,
    },
    regular: {
      style: 'regular',
      svg: `<path d="..." stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2,
    },
    filled: {
      style: 'filled',
      svg: `<path d="..." fill="currentColor" stroke="none" fill-rule="evenodd" />`,
      supportsStroke: false,
      defaultStrokeWidth: 0,
    },
    duotone: {
      style: 'duotone',
      svg: `<path d="..." opacity="0.2" fill="currentColor" stroke="none" />
<path d="..." stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2,
    },
    'duotone-line': {
      style: 'duotone-line',
      svg: `<path d="..." opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="..." stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2,
    },
  },
}
```

---

## 3. Automated Validation Commands

Before submitting code, run the complete suite of verification commands:

```bash
# 1. Compile the native catalog
npm run icons:build

# 2. Run automated geometry, SVG validity, and metadata audit
npm run icons:validate

# 3. View library status report
npm run icons:report

# 4. Run master test suite
npm test
```

---

## 4. Quality Checklist

- [ ] Canvas is exactly `24 × 24` with `viewBox="0 0 24 24"`.
- [ ] Visual bounds stay within the `[1, 23]` safe zone.
- [ ] Regular variant uses `2.0px` stroke with round caps and joins.
- [ ] Light variant uses `1.5px` stroke.
- [ ] Filled variant preserves all internal cutouts and negative space counters.
- [ ] Duotone uses secondary `opacity="0.2"` fill on closed masses.
- [ ] Naming uses lowercase-kebab-case (`[family]-[modifier]`).
- [ ] At least 3 descriptive tags and 1 realistic UI use case are defined.
- [ ] `npm run icons:validate` passes with 0 hard errors and 0 warnings.
