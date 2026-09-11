/**
 * GRIDFRAME Native Icon Design System — 50-Family Golden Reference Library
 * 
 * 100% Original, Precision-Engineered Geometric SVG Artwork on canonical 24×24 canvas.
 * Every family defines 5 coordinated variants: Light, Regular, Filled, Duotone, and Duotone Line.
 */

import type { CanonicalIconVariant, IconCategory } from '@/types/icon';

export interface NativeVariantDef {
  style: CanonicalIconVariant;
  svg: string;
  supportsStroke: boolean;
  defaultStrokeWidth: number;
}

export interface NativeIconConceptDef {
  id: string;
  name: string;
  slug: string;
  family: string;
  baseIcon?: string;
  modifier?: string;
  category: IconCategory;
  tags: string[];
  keywords: string[];
  aliases: string[];
  useCases: string[];
  popularity: number;
  variants: Record<CanonicalIconVariant, NativeVariantDef>;
}

export const GOLDEN_LIBRARY_CONCEPTS: NativeIconConceptDef[] = [
  // =========================================================================
  // 1. ARROWS FAMILY (Coordinated 24x24 Geometry, 60° arrowheads, 2px stroke)
  // =========================================================================
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    slug: 'arrow-up',
    family: 'arrow',
    modifier: 'up',
    category: 'Arrows',
    tags: ['arrow', 'up', 'north', 'direction', 'ascending', 'scroll'],
    keywords: ['arrow', 'upward', 'top', 'pointer'],
    aliases: ['up-arrow', 'arrow-north'],
    useCases: ['Indicating upward direction', 'Scrolling to top', 'Sorting ascending'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M11 19a1 1 0 0 0 2 0V9.414l3.293 3.293a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L11 9.414V19z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M5 12l7-7 7 7H5z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M12 19V5M5 12l7-7 7 7" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'arrow-down',
    name: 'Arrow Down',
    slug: 'arrow-down',
    family: 'arrow',
    modifier: 'down',
    category: 'Arrows',
    tags: ['arrow', 'down', 'south', 'direction', 'descending', 'bottom'],
    keywords: ['arrow', 'downward', 'bottom', 'pointer'],
    aliases: ['down-arrow', 'arrow-south'],
    useCases: ['Indicating downward direction', 'Scrolling to bottom', 'Sorting descending'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M11 5a1 1 0 0 1 2 0v9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 14.586V5z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M19 12l-7 7-7-7h14z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M12 5v14M19 12l-7 7-7-7" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'arrow-left',
    name: 'Arrow Left',
    slug: 'arrow-left',
    family: 'arrow',
    modifier: 'left',
    category: 'Arrows',
    tags: ['arrow', 'left', 'west', 'back', 'previous', 'return'],
    keywords: ['arrow', 'backward', 'back', 'pointer'],
    aliases: ['back-arrow', 'arrow-west'],
    useCases: ['Navigating back', 'Previous pagination step', 'Returning to parent screen'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M19 11a1 1 0 0 1 0 2H9.414l3.293 3.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 1.414L9.414 11H19z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M12 19l-7-7 7-7v14z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M19 12H5M12 19l-7-7 7-7" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    slug: 'arrow-right',
    family: 'arrow',
    modifier: 'right',
    category: 'Arrows',
    tags: ['arrow', 'right', 'east', 'forward', 'next', 'continue'],
    keywords: ['arrow', 'forward', 'next', 'pointer'],
    aliases: ['forward-arrow', 'arrow-east'],
    useCases: ['Navigating forward', 'Next pagination step', 'Proceeding to checkout/action'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M5 11a1 1 0 0 0 0 2h9.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5a1 1 0 0 0-1.414 1.414L14.586 11H5z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M12 5l7 7-7 7V5z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M5 12h14M12 5l7 7-7 7" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // Chevrons
  {
    id: 'chevron-up',
    name: 'Chevron Up',
    slug: 'chevron-up',
    family: 'chevron',
    modifier: 'up',
    category: 'Arrows',
    tags: ['chevron', 'up', 'collapse', 'accordion', 'top'],
    keywords: ['caret', 'fold', 'close', 'arrow'],
    aliases: ['caret-up', 'arrow-head-up'],
    useCases: ['Collapsing accordion panels', 'Dropdown close state', 'Upward indicator'],
    popularity: 94,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 3.2,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M6 15l6-6 6 6" opacity="0.25" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M6 15l6-6 6 6" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'chevron-down',
    name: 'Chevron Down',
    slug: 'chevron-down',
    family: 'chevron',
    modifier: 'down',
    category: 'Arrows',
    tags: ['chevron', 'down', 'expand', 'accordion', 'dropdown'],
    keywords: ['caret', 'unfold', 'open', 'arrow'],
    aliases: ['caret-down', 'dropdown-icon'],
    useCases: ['Expanding dropdown menus', 'Accordion open trigger', 'Select menus'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 3.2,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M6 9l6 6 6-6" opacity="0.25" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M6 9l6 6 6-6" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'chevron-left',
    name: 'Chevron Left',
    slug: 'chevron-left',
    family: 'chevron',
    modifier: 'left',
    category: 'Arrows',
    tags: ['chevron', 'left', 'previous', 'back', 'pager'],
    keywords: ['caret', 'backward', 'prev', 'arrow'],
    aliases: ['caret-left', 'prev-chevron'],
    useCases: ['Previous slide in carousel', 'Back navigation in mobile header', 'Calendar previous month'],
    popularity: 93,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 3.2,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M15 18l-6-6 6-6" opacity="0.25" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M15 18l-6-6 6-6" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'chevron-right',
    name: 'Chevron Right',
    slug: 'chevron-right',
    family: 'chevron',
    modifier: 'right',
    category: 'Arrows',
    tags: ['chevron', 'right', 'next', 'forward', 'breadcrumb'],
    keywords: ['caret', 'forward', 'breadcrumb-separator', 'arrow'],
    aliases: ['caret-right', 'next-chevron'],
    useCases: ['Breadcrumb item separator', 'List disclosure indicator', 'Next slide button'],
    popularity: 95,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 3.2,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M9 18l6-6-6-6" opacity="0.25" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M9 18l6-6-6-6" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 2. INTERFACE & CONTROLS (Plus, Minus, X, Check, Search, Menu, Filter, Grid, List, Settings)
  // =========================================================================
  {
    id: 'plus',
    name: 'Plus',
    slug: 'plus',
    family: 'plus',
    category: 'Interface',
    tags: ['plus', 'add', 'create', 'new', 'insert', 'positive'],
    keywords: ['create', 'addition', 'math', 'button'],
    aliases: ['add', 'create-new'],
    useCases: ['Creating new entity', 'Adding item to cart/list', 'Zoom in action'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="4" y="4" width="16" height="16" rx="4" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M12 5v14M5 12h14" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'minus',
    name: 'Minus',
    slug: 'minus',
    family: 'minus',
    category: 'Interface',
    tags: ['minus', 'remove', 'subtract', 'delete', 'negative', 'decrease'],
    keywords: ['remove', 'decrement', 'math', 'dash'],
    aliases: ['remove', 'subtract'],
    useCases: ['Decreasing quantity in stepper', 'Removing item from list', 'Zoom out action'],
    popularity: 91,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M5 12h14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M5 11a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2H5z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="4" y="4" width="16" height="16" rx="4" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M7 12h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M5 12h14" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 12h14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'x',
    name: 'X',
    slug: 'x',
    family: 'x',
    category: 'Interface',
    tags: ['x', 'close', 'cancel', 'dismiss', 'clear', 'delete'],
    keywords: ['cross', 'remove', 'exit', 'stop'],
    aliases: ['close', 'cross', 'cancel'],
    useCases: ['Closing modal/dialog', 'Dismissing banner notification', 'Clearing input field'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.707 12.293a1 1 0 0 1-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L10.586 12 8.293 9.707a1 1 0 0 1 1.414-1.414L12 10.586l2.293-2.293a1 1 0 0 1 1.414 1.414L13.414 12l2.293 2.293z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M18 6L6 18M6 6l12 12" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'check',
    name: 'Check',
    slug: 'check',
    family: 'check',
    category: 'Interface',
    tags: ['check', 'success', 'done', 'approved', 'complete', 'tick', 'ok'],
    keywords: ['verified', 'correct', 'confirm', 'task'],
    aliases: ['tick', 'checkmark', 'success'],
    useCases: ['Indicating completed action', 'Selection indicator in table', 'Form field validation pass'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.707l-5.5 5.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 1 1 1.414-1.414L10.5 13.086l4.793-4.793a1 1 0 1 1 1.414 1.414z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M16 8.5L10.5 14l-2.5-2.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M20 6L9 17l-5-5" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'search',
    name: 'Search',
    slug: 'search',
    family: 'search',
    category: 'Interface',
    tags: ['search', 'find', 'lookup', 'query', 'magnify', 'discover', 'filter'],
    keywords: ['magnifying-glass', 'explore', 'scan', 'inspect'],
    aliases: ['find', 'lookup', 'magnifier'],
    useCases: ['Global search input', 'Filtering list items', 'Catalog exploratory lookup'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M11 2a9 9 0 0 1 6.32 15.394l4.386 4.386a1 1 0 0 1-1.414 1.414l-4.386-4.386A9 9 0 1 1 11 2zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="11" cy="11" r="7" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="11" cy="11" r="7" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<path d="M21 21l-4.35-4.35" opacity="0.25" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'menu',
    name: 'Menu',
    slug: 'menu',
    family: 'menu',
    category: 'Interface',
    tags: ['menu', 'hamburger', 'navigation', 'drawer', 'options', 'lines'],
    keywords: ['bars', 'sidebar', 'toggle', 'header'],
    aliases: ['hamburger', 'nav-bars'],
    useCases: ['Triggering mobile navigation drawer', 'Sidebar toggle', 'General menu dropdown'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="currentColor" stroke="none" />
<rect x="3" y="10.75" width="18" height="2.5" rx="1.25" fill="currentColor" stroke="none" />
<rect x="3" y="16.5" width="18" height="2.5" rx="1.25" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="10.5" width="18" height="3" rx="1.5" opacity="0.25" fill="currentColor" stroke="none" />
<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M4 6h16M4 12h16M4 18h16" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'filter',
    name: 'Filter',
    slug: 'filter',
    family: 'filter',
    category: 'Interface',
    tags: ['filter', 'funnel', 'sort', 'refine', 'query', 'options'],
    keywords: ['funnel', 'sift', 'adjust', 'criteria'],
    aliases: ['funnel', 'refine'],
    useCases: ['Opening filter facet drawer', 'Refining dataset criteria', 'Applying search constraints'],
    popularity: 92,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .78 1.625l-6.78 8.136V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 8 21v-7.239L1.22 4.625A1 1 0 0 1 3 4z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    slug: 'grid',
    family: 'grid',
    category: 'Interface',
    tags: ['grid', 'layout', 'cards', 'view', 'tiles', 'collection'],
    keywords: ['mosaic', 'dashboard', 'gallery', 'blocks'],
    aliases: ['tile-view', 'cards-view'],
    useCases: ['Switching to card/grid layout', 'App switcher matrix', 'Gallery presentation'],
    popularity: 90,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" stroke="none" />
<rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" stroke="none" />
<rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" stroke="none" />
<rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="3" width="7" height="7" rx="1.5" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="3" y="3" width="7" height="7" rx="1.5" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'list',
    name: 'List',
    slug: 'list',
    family: 'list',
    category: 'Interface',
    tags: ['list', 'rows', 'lines', 'view', 'table', 'menu', 'index'],
    keywords: ['checklist', 'items', 'bullet-points', 'rows'],
    aliases: ['rows-view', 'table-view'],
    useCases: ['Switching to detailed list view', 'Table row indicator', 'Checklist container'],
    popularity: 91,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
<circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
<circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
<rect x="8" y="5" width="13" height="2" rx="1" fill="currentColor" stroke="none" />
<rect x="8" y="11" width="13" height="2" rx="1" fill="currentColor" stroke="none" />
<rect x="8" y="17" width="13" height="2" rx="1" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="3" cy="6" r="2" opacity="0.25" fill="currentColor" stroke="none" />
<circle cx="3" cy="12" r="2" opacity="0.25" fill="currentColor" stroke="none" />
<circle cx="3" cy="18" r="2" opacity="0.25" fill="currentColor" stroke="none" />
<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'settings',
    name: 'Settings',
    slug: 'settings',
    family: 'settings',
    category: 'System',
    tags: ['settings', 'gear', 'cog', 'preferences', 'configuration', 'tools', 'controls'],
    keywords: ['options', 'setup', 'admin', 'engine'],
    aliases: ['gear', 'cog', 'preferences'],
    useCases: ['Opening preferences modal', 'System admin panel', 'Customizer controls'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="3" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="12" cy="12" r="3" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 3. IDENTITY & SOCIAL (Home, User, Users, Heart)
  // =========================================================================
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    family: 'home',
    category: 'Navigation',
    tags: ['home', 'house', 'dashboard', 'main', 'start', 'index', 'root'],
    keywords: ['residence', 'homepage', 'base', 'property'],
    aliases: ['house', 'dashboard', 'main'],
    useCases: ['Main dashboard navigation item', 'Breadcrumb root link', 'Return to home action'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a1 1 0 0 1 .625.22l9 7A1 1 0 0 1 21 11v9a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-7h-4v7a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-9a1 1 0 0 1 .375-.78l9-7A1 1 0 0 1 12 2z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'user',
    name: 'User',
    slug: 'user',
    family: 'user',
    category: 'People',
    tags: ['user', 'person', 'profile', 'account', 'avatar', 'member', 'human'],
    keywords: ['profile', 'identity', 'individual', 'author'],
    aliases: ['profile', 'account', 'avatar'],
    useCases: ['Account profile header button', 'Author avatar badge', 'Customer management identity'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<circle cx="12" cy="7" r="4" fill="currentColor" stroke="none" />
<path d="M12 13c-4.418 0-8 2.239-8 5v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.761-3.582-5-8-5z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="7" r="4" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<circle cx="12" cy="7" r="4" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'users',
    name: 'Users',
    slug: 'users',
    family: 'user',
    modifier: 'group',
    category: 'People',
    tags: ['users', 'people', 'team', 'group', 'community', 'members', 'organization'],
    keywords: ['crowd', 'collaborators', 'audience', 'network'],
    aliases: ['team', 'group', 'members'],
    useCases: ['Team management navigation', 'Community members count', 'Multi-user sharing permissions'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<circle cx="6" cy="7" r="3.5" fill="currentColor" stroke="none" />
<path d="M6 12.5c-3.314 0-6 1.791-6 4V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2.5c0-2.209-2.686-4-6-4z" fill="currentColor" stroke="none" />
<circle cx="16" cy="7" r="3" opacity="0.8" fill="currentColor" stroke="none" />
<path d="M16 12c1.933 0 4 1.119 4 2.5V17a1 1 0 0 1-1 1h-4.5v-1.5c0-1.84-1.258-3.414-3.056-3.878C12.378 12.235 14.07 12 16 12z" opacity="0.8" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="5" cy="7" r="4" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'heart',
    name: 'Heart',
    slug: 'heart',
    family: 'heart',
    category: 'Social',
    tags: ['heart', 'like', 'favorite', 'love', 'save', 'wishlist'],
    keywords: ['rating', 'health', 'appreciation', 'bookmark'],
    aliases: ['like', 'favorite', 'love'],
    useCases: ['Favoriting an item', 'Product wishlist trigger', 'Liking user content'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 4. CONTENT & ACTIONS (Star, Bookmark, Copy, Trash, Edit, Save, Share, Refresh)
  // =========================================================================
  {
    id: 'star',
    name: 'Star',
    slug: 'star',
    family: 'star',
    category: 'Social',
    tags: ['star', 'favorite', 'rating', 'review', 'feature', 'award', 'badge'],
    keywords: ['rating', 'score', 'gold', 'reputation'],
    aliases: ['rating', 'badge-star'],
    useCases: ['Product review rating score', 'Featuring special items', 'Bookmark priority tier'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" opacity="0.2" fill="currentColor" stroke="none" />
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'bookmark',
    name: 'Bookmark',
    slug: 'bookmark',
    family: 'bookmark',
    category: 'Files',
    tags: ['bookmark', 'save', 'ribbon', 'collection', 'read-later', 'tag'],
    keywords: ['pin', 'marker', 'reading-list', 'saved'],
    aliases: ['save-later', 'ribbon'],
    useCases: ['Saving article to collection', 'Adding document bookmark', 'Preserving filter state'],
    popularity: 93,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'copy',
    name: 'Copy',
    slug: 'copy',
    family: 'copy',
    category: 'Interface',
    tags: ['copy', 'duplicate', 'clone', 'clipboard', 'paste', 'replicate'],
    keywords: ['duplicate', 'clipboard', 'clone', 'snippet'],
    aliases: ['duplicate', 'clipboard-copy'],
    useCases: ['Copying SVG snippet to clipboard', 'Duplicating project template', 'Cloning database row'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M4 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3v-2H4V4h9v3h2V4a2 2 0 0 0-2-2H4z" fill="currentColor" stroke="none" />
<rect x="9" y="9" width="13" height="13" rx="2" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="9" y="9" width="13" height="13" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="9" y="9" width="13" height="13" rx="2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'trash',
    name: 'Trash',
    slug: 'trash',
    family: 'trash',
    category: 'Interface',
    tags: ['trash', 'delete', 'remove', 'bin', 'discard', 'recycle', 'garbage'],
    keywords: ['dustbin', 'can', 'destroy', 'clear'],
    aliases: ['delete', 'remove', 'bin'],
    useCases: ['Deleting collection/item', 'Discarding unsaved draft', 'Emptying trash can'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M8 2a2 2 0 0 0-2 2v2H3a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h1a1 1 0 1 0 0-2h-3V4a2 2 0 0 0-2-2H8zm2 4V4h4v2h-4zm0 5a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0v-6zm4 0a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0v-6z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M5 6h14v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'edit',
    name: 'Edit',
    slug: 'edit',
    family: 'edit',
    category: 'Interface',
    tags: ['edit', 'pencil', 'modify', 'write', 'draw', 'rename', 'compose'],
    keywords: ['pen', 'update', 'draft', 'author'],
    aliases: ['pencil', 'modify', 'write'],
    useCases: ['Editing card titles/parameters', 'Renaming collection', 'Opening code editor'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 19a1 1 0 0 1 0 2h9a1 1 0 1 1 0-2h-9zM16.5 2.5a3.121 3.121 0 0 1 4.414 4.414L7.828 20H3v-4.828L16.5 2.5z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'save',
    name: 'Save',
    slug: 'save',
    family: 'save',
    category: 'Files',
    tags: ['save', 'floppy', 'disk', 'store', 'commit', 'keep', 'record'],
    keywords: ['diskette', 'download', 'storage', 'persist'],
    aliases: ['floppy-disk', 'store-data'],
    useCases: ['Saving form edits', 'Persisting user customizations', 'Committing changes'],
    popularity: 92,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5H5zm10 2v3H7V5h8zm2 14H7v-6h10v6z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'share',
    name: 'Share',
    slug: 'share',
    family: 'share',
    category: 'Communication',
    tags: ['share', 'network', 'send', 'social', 'distribute', 'nodes'],
    keywords: ['link', 'publish', 'broadcast', 'connect'],
    aliases: ['social-share', 'nodes'],
    useCases: ['Sharing icon specimen link', 'Social broadcasting', 'Exporting collection link'],
    popularity: 94,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<circle cx="18" cy="5" r="3" fill="currentColor" stroke="none" />
<circle cx="6" cy="12" r="3" fill="currentColor" stroke="none" />
<circle cx="18" cy="19" r="3" fill="currentColor" stroke="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2.5,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="18" cy="5" r="3" opacity="0.25" fill="currentColor" stroke="none" />
<circle cx="6" cy="12" r="3" opacity="0.25" fill="currentColor" stroke="none" />
<circle cx="18" cy="19" r="3" opacity="0.25" fill="currentColor" stroke="none" />
<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="18" cy="5" r="3" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<circle cx="6" cy="12" r="3" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<circle cx="18" cy="19" r="3" opacity="0.25" stroke="currentColor" stroke-width="3" fill="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" opacity="0.25" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'refresh',
    name: 'Refresh',
    slug: 'refresh',
    family: 'refresh',
    category: 'Interface',
    tags: ['refresh', 'reload', 'sync', 'rotate', 'repeat', 'update', 'loop'],
    keywords: ['sync', 'restart', 'reboot', 'spin'],
    aliases: ['reload', 'sync', 'rotate'],
    useCases: ['Syncing catalog updates', 'Reloading API request', 'Resetting customizer state'],
    popularity: 95,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2.5,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M23 4v6h-6M1 20v-6h6" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M23 4v6h-6M1 20v-6h6" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 5. TIME & NOTIFICATIONS (Calendar, Clock, Bell)
  // =========================================================================
  {
    id: 'calendar',
    name: 'Calendar',
    slug: 'calendar',
    family: 'calendar',
    category: 'Time',
    tags: ['calendar', 'date', 'schedule', 'event', 'planner', 'month', 'year'],
    keywords: ['appointment', 'timetable', 'agenda', 'day'],
    aliases: ['schedule', 'date-picker', 'agenda'],
    useCases: ['Selecting appointment dates', 'Displaying event timestamp', 'Calendar view trigger'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="10" width="18" height="12" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="3" y="4" width="18" height="18" rx="2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'clock',
    name: 'Clock',
    slug: 'clock',
    family: 'clock',
    category: 'Time',
    tags: ['clock', 'time', 'hour', 'minute', 'history', 'timer', 'watch', 'duration'],
    keywords: ['chronometer', 'countdown', 'schedule', 'past'],
    aliases: ['time', 'timer', 'history'],
    useCases: ['Timestamp indicator in feed', 'Duration counter', 'Activity history log'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
<polyline points="12 7 12 12 15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" />
<polyline points="12 7 12 12 15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 10.414l2.293 2.293a1 1 0 0 1-1.414 1.414L11.586 13.83A1 1 0 0 1 11 13V7a1 1 0 1 1 2 0v5.414z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" />
<polyline points="12 7 12 12 15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
<polyline points="12 7 12 12 15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'bell',
    name: 'Bell',
    slug: 'bell',
    family: 'bell',
    category: 'Communication',
    tags: ['bell', 'notification', 'alert', 'alarm', 'reminder', 'notice', 'ring'],
    keywords: ['ringer', 'ping', 'updates', 'push'],
    aliases: ['notifications', 'alert', 'alarm'],
    useCases: ['Notification center trigger', 'Alert subscription toggle', 'Reminder indicator'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a6 6 0 0 0-6 6c0 6-2.5 8-2.5 8h17S18 14 18 8a6 6 0 0 0-6-6zm-1.73 19a2 2 0 0 0 3.46 0h-3.46z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 6. COMMUNICATION & MEDIA (Mail, Message, Phone, Camera, Image)
  // =========================================================================
  {
    id: 'mail',
    name: 'Mail',
    slug: 'mail',
    family: 'mail',
    category: 'Communication',
    tags: ['mail', 'email', 'message', 'inbox', 'letter', 'send', 'envelope'],
    keywords: ['correspondence', 'post', 'newsletter', 'contact'],
    aliases: ['email', 'envelope', 'inbox'],
    useCases: ['Contact email button', 'Unread inbox badge', 'Newsletter subscription input'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 3.236l-8 5.334-8-5.334V6l8 5.333L20 6v1.236z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'message',
    name: 'Message',
    slug: 'message',
    family: 'message',
    category: 'Communication',
    tags: ['message', 'chat', 'comment', 'discussion', 'bubble', 'talk', 'feedback'],
    keywords: ['conversation', 'dialog', 'sms', 'forum'],
    aliases: ['chat', 'comment', 'bubble'],
    useCases: ['Comments section indicator', 'Live support chat widget', 'Direct messaging channel'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'phone',
    name: 'Phone',
    slug: 'phone',
    family: 'phone',
    category: 'Communication',
    tags: ['phone', 'call', 'telephone', 'mobile', 'contact', 'hotline', 'dial'],
    keywords: ['cellular', 'ring', 'voice', 'support'],
    aliases: ['call', 'telephone', 'contact-phone'],
    useCases: ['Click-to-call support link', 'Mobile device verification', 'Contact details section'],
    popularity: 91,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'camera',
    name: 'Camera',
    slug: 'camera',
    family: 'camera',
    category: 'Media',
    tags: ['camera', 'photo', 'picture', 'capture', 'snapshot', 'lens', 'video'],
    keywords: ['photography', 'shoot', 'shutter', 'optics'],
    aliases: ['photo-camera', 'snapshot'],
    useCases: ['Profile picture upload trigger', 'Barcode/QR scanner trigger', 'Photo gallery snapshot'],
    popularity: 93,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M9 3l-2 3H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-2-3H9zm3 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'image',
    name: 'Image',
    slug: 'image',
    family: 'image',
    category: 'Media',
    tags: ['image', 'photo', 'picture', 'gallery', 'graphic', 'media', 'wallpaper'],
    keywords: ['scenery', 'canvas', 'thumbnail', 'artwork'],
    aliases: ['photo', 'picture', 'scenery'],
    useCases: ['Media upload preview container', 'Image asset picker', 'Artwork thumbnail frame'],
    popularity: 95,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zm3.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm10.5 12H5l6-6 4 4 4-4 2 2v4z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="3" width="18" height="18" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2" fill="none" />
<polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="3" y="3" width="18" height="18" rx="2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" fill="none" />
<polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 7. FILES & DATA (Folder, File, Download, Upload)
  // =========================================================================
  {
    id: 'folder',
    name: 'Folder',
    slug: 'folder',
    family: 'folder',
    category: 'Files',
    tags: ['folder', 'directory', 'archive', 'storage', 'collection', 'files', 'binder'],
    keywords: ['directory', 'grouping', 'organizer', 'binder'],
    aliases: ['directory', 'binder'],
    useCases: ['Directory hierarchy navigation', 'Organizing saved collections', 'File storage tree view'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'file',
    name: 'File',
    slug: 'file',
    family: 'file',
    category: 'Files',
    tags: ['file', 'document', 'page', 'paper', 'sheet', 'report', 'note'],
    keywords: ['document', 'text', 'asset', 'blank'],
    aliases: ['document', 'page'],
    useCases: ['Document asset representation', 'Single file upload thumbnail', 'Report download target'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'download',
    name: 'Download',
    slug: 'download',
    family: 'download',
    category: 'Interface',
    tags: ['download', 'save', 'export', 'fetch', 'get', 'receive', 'arrow-down'],
    keywords: ['export', 'pull', 'offline', 'storage'],
    aliases: ['save-file', 'get-asset'],
    useCases: ['Downloading SVG/React export', 'Offline asset caching', 'Fetching file bundle'],
    popularity: 99,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M11 3a1 1 0 0 1 2 0v8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 11.586V3zM4 16a1 1 0 0 1 1 1v2h14v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4H3z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'upload',
    name: 'Upload',
    slug: 'upload',
    family: 'upload',
    category: 'Interface',
    tags: ['upload', 'publish', 'import', 'send', 'cloud', 'push', 'arrow-up'],
    keywords: ['deploy', 'cloud-upload', 'transmit', 'share'],
    aliases: ['import-file', 'push-asset'],
    useCases: ['Uploading custom SVG', 'Deploying collection to server', 'Importing icon manifest'],
    popularity: 95,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L13 5.414V14a1 1 0 1 1-2 0V5.414L8.707 7.707a1 1 0 0 1-1.414-1.414l4-4A1 1 0 0 1 12 2zM4 16a1 1 0 0 1 1 1v2h14v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4H3z" opacity="0.2" fill="currentColor" stroke="none" />
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },

  // =========================================================================
  // 8. NAVIGATION & SECURITY (Link, Lock, Unlock, Eye, Eye-Off, Map-Pin, Location, Globe)
  // =========================================================================
  {
    id: 'link',
    name: 'Link',
    slug: 'link',
    family: 'link',
    category: 'Communication',
    tags: ['link', 'chain', 'hyperlink', 'url', 'connect', 'attachment', 'web'],
    keywords: ['anchor', 'connection', 'internet', 'permalink'],
    aliases: ['chain', 'hyperlink', 'url'],
    useCases: ['Copying permalink URL', 'External reference citation', 'Attachment connection'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2.75" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2.75" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2.75,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" opacity="0.3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'lock',
    name: 'Lock',
    slug: 'lock',
    family: 'lock',
    category: 'Security',
    tags: ['lock', 'security', 'password', 'padlock', 'private', 'protect', 'auth', 'safe'],
    keywords: ['encrypted', 'closed', 'secure', 'guard'],
    aliases: ['padlock', 'security-lock', 'password'],
    useCases: ['Protected password input', 'Encrypted file status badge', 'Security settings section'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a5 5 0 0 0-5 5v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm3 9V7a3 3 0 0 0-6 0v4h6z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'unlock',
    name: 'Unlock',
    slug: 'unlock',
    family: 'lock',
    modifier: 'open',
    category: 'Security',
    tags: ['unlock', 'open', 'access', 'security', 'permission', 'unprotected', 'public'],
    keywords: ['unlocked', 'accessible', 'free', 'allow'],
    aliases: ['open-lock', 'access-granted'],
    useCases: ['Unlocked permission status', 'Public access indicator', 'Deactivating protection mode'],
    popularity: 93,
    variants: {
      light: {
        style: 'light',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a5 5 0 0 0-5 5v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2V7a3 3 0 0 1 5.9-1h2.05A5 5 0 0 0 12 2zm3 9H9V7a3 3 0 0 1 6 0v4z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<rect x="3" y="11" width="18" height="11" rx="2" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'eye',
    name: 'Eye',
    slug: 'eye',
    family: 'eye',
    category: 'Security',
    tags: ['eye', 'view', 'show', 'visible', 'preview', 'look', 'watch', 'vision'],
    keywords: ['password-visible', 'reveal', 'sight', 'inspect'],
    aliases: ['visible', 'view', 'preview'],
    useCases: ['Revealing masked password text', 'Live preview modal toggle', 'Public visibility state'],
    popularity: 98,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 11.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="3" opacity="0.25" fill="currentColor" stroke="none" />
<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'eye-off',
    name: 'Eye Off',
    slug: 'eye-off',
    family: 'eye',
    modifier: 'off',
    category: 'Security',
    tags: ['eye-off', 'hide', 'hidden', 'invisible', 'mask', 'secret', 'private', 'password'],
    keywords: ['obscured', 'conceal', 'stealth', 'blind'],
    aliases: ['hidden', 'hide', 'mask-password'],
    useCases: ['Masking sensitive password characters', 'Hiding private information', 'Stealth view mode'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2.5,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="3" opacity="0.25" fill="currentColor" stroke="none" />
<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M1 1l22 22" opacity="0.3" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'map-pin',
    name: 'Map Pin',
    slug: 'map-pin',
    family: 'location',
    modifier: 'pin',
    category: 'Maps',
    tags: ['map-pin', 'location', 'marker', 'gps', 'place', 'destination', 'point'],
    keywords: ['pin', 'address', 'coordinates', 'spot'],
    aliases: ['marker', 'pin', 'gps-point'],
    useCases: ['Selecting delivery address', 'Map marker pin icon', 'Geographic point of interest'],
    popularity: 97,
    variants: {
      light: {
        style: 'light',
        svg: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'location',
    name: 'Location',
    slug: 'location',
    family: 'location',
    modifier: 'radar',
    category: 'Maps',
    tags: ['location', 'crosshairs', 'navigate', 'locate', 'target', 'gps', 'position'],
    keywords: ['tracking', 'geolocate', 'current-position', 'find-me'],
    aliases: ['locate-me', 'crosshairs', 'gps'],
    useCases: ['Current device geolocation trigger', 'Target map centering', 'Live positioning radar'],
    popularity: 94,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
<path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" fill="currentColor" stroke="none" fill-rule="evenodd" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="8" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
<line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="12" cy="12" r="8" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
<line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
<line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
  {
    id: 'globe',
    name: 'Globe',
    slug: 'globe',
    family: 'globe',
    category: 'Maps',
    tags: ['globe', 'earth', 'world', 'planet', 'international', 'language', 'web', 'network'],
    keywords: ['worldwide', 'global', 'locale', 'territory'],
    aliases: ['world', 'earth', 'language-picker'],
    useCases: ['Language & locale selector', 'Internationalization switch', 'Global CDN presence indicator'],
    popularity: 96,
    variants: {
      light: {
        style: 'light',
        svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5" />
<path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 1.5,
      },
      regular: {
        style: 'regular',
        svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" />
<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" />
<path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      filled: {
        style: 'filled',
        svg: `<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 17.93c3.05-.46 5.56-2.52 6.54-5.43H13v5.43zm0-7.43h6.92a8.04 8.04 0 0 0 0-1H13v1zm0-3h6.54c-.98-2.91-3.49-4.97-6.54-5.43V9.5zM11 4.07C7.95 4.53 5.44 6.59 4.46 9.5H11V4.07zm0 7.43H4.08c0 .33.03.66.08 1H11v-1zm0 3H4.46c.98 2.91 3.49 4.97 6.54 5.43v-5.43z" fill="currentColor" stroke="none" />`,
        supportsStroke: false,
        defaultStrokeWidth: 0,
      },
      duotone: {
        style: 'duotone',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.2" fill="currentColor" stroke="none" />
<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" />
<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" />
<path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" stroke-width="2" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
      'duotone-line': {
        style: 'duotone-line',
        svg: `<circle cx="12" cy="12" r="9" opacity="0.25" stroke="currentColor" stroke-width="3.5" fill="none" />
<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5" />
<path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" stroke-width="1.5" fill="none" />`,
        supportsStroke: true,
        defaultStrokeWidth: 2,
      },
    },
  },
];
