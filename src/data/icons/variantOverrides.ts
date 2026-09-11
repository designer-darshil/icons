/**
 * GRIDFRAME V2 — Handcrafted Variant Overrides Registry
 * 
 * Provides explicit, artisan-crafted SVG geometry overrides for icons where
 * algorithmic conversion cannot safely generate a faithful filled, duotone,
 * or duotone-line variant.
 */

import type { CanonicalIconVariant } from '@/types/icon';

export interface IconVariantOverride {
  svg?: string;
  viewBox?: string;
  supportsStroke?: boolean;
  defaultStrokeWidth?: number;
  notes?: string;
}

export type VariantOverrideMap = Partial<Record<CanonicalIconVariant, IconVariantOverride>>;

export const VARIANT_OVERRIDES: Record<string, VariantOverrideMap> = {
  // Bluetooth family manual overrides
  'bluetooth': {
    'filled': {
      svg: `<path d="M7 8l10 8-5 4V4l5 4-10 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2.5,
      notes: 'Bluetooth is an inherently line-based symbol; filled variant uses optical 2.5px heavy line treatment.',
    },
    'duotone': {
      svg: `<path d="M12 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
<path d="M12 4l5 4-5 4 5 4-5 4" opacity="0.25" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 8l10 8-5 4V4l5 4-10 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      notes: 'Duotone uses secondary diamond accent geometry.',
    },
  },
  'bluetooth-connected': {
    'filled': {
      svg: `<path d="M7 8l10 8-5 4V4l5 4-10 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
<line x1="4" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
<line x1="19" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2.5,
    },
  },
  'bluetooth-off': {
    'filled': {
      svg: `<path d="M3 3l18 18M12 4v4m0 4v8l5-4-2.5-2M14.5 6L17 8l-5 4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 2.5,
    },
  },
  // Brackets and Code open-stroke symbols
  'brackets-curly': {
    'filled': {
      svg: `<path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 2-2 2 1 0 2 .5 2 2v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 2 2 2-1 0-2 .5-2 2v2c0 2-1 3-3 3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 3,
      notes: 'Curly brackets are pure line symbols; filled variant uses 3.0px heavy optical stroke.',
    },
  },
  'code': {
    'filled': {
      svg: `<path d="M8 6L2 12l6 6M16 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
      defaultStrokeWidth: 3,
      notes: 'Code chevrons use 3.0px heavy optical stroke.',
    },
    'duotone': {
      svg: `<path d="M8 6L2 12l6 6M16 6l6 6-6 6" opacity="0.25" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
<path d="M8 6L2 12l6 6M16 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
      supportsStroke: true,
    },
  },
  'battery': {
    'filled': {
      svg: `<rect x="2" y="7" width="16" height="10" rx="2" fill="currentColor" stroke="none" />
<path d="M22 11v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
      supportsStroke: false,
    },
    'duotone': {
      svg: `<rect x="2" y="7" width="16" height="10" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="2" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
<path d="M22 11v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
      supportsStroke: true,
    },
  },
  'battery-charging': {
    'filled': {
      svg: `<path d="M2 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" fill="currentColor" stroke="none" />
<path d="M11 7l-2 5h4l-2 5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M22 11v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
      supportsStroke: false,
      notes: 'Filled battery charging preserves bolt knockout.',
    },
    'duotone': {
      svg: `<rect x="2" y="7" width="16" height="10" rx="2" opacity="0.2" fill="currentColor" stroke="none" />
<rect x="2" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
<path d="M11 7l-2 5h4l-2 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M22 11v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`,
      supportsStroke: true,
    },
  },
};

/**
 * Retrieves a manual variant override for a given icon slug and variant style, if defined.
 */
export function getVariantOverride(
  slug: string,
  variant: CanonicalIconVariant
): IconVariantOverride | undefined {
  const iconOverrides = VARIANT_OVERRIDES[slug];
  if (!iconOverrides) return undefined;
  return iconOverrides[variant];
}
