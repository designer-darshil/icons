/**
 * GRIDFRAME Five-Variant Generation Engine (Path-Safe & Optical Precision)
 * 
 * Generates coordinated Light, Regular, Filled, Duotone, and Duotone-Line variants
 * from a single canonical icon definition with path topology awareness,
 * negative space preservation, and manual override support.
 */

import { analyzePathTopology } from './pathTopology';
import { getVariantOverride } from '@/data/icons/variantOverrides';
import { validateVariantAgainstRegular } from './variantValidator';
import type { IconVariant } from '@/types/icon';

export interface FiveVariantsOutput {
  light: IconVariant;
  regular: IconVariant;
  filled: IconVariant;
  duotone: IconVariant;
  duotoneLine: IconVariant;
  all: IconVariant[];
}

/**
 * Creates high quality secondary duotone layer with path topology awareness.
 * Fills only closed containers/mass, preserving open line details from muddy overlaps.
 */
function createDuotoneLayer(innerSvg: string): string {
  const topology = analyzePathTopology(innerSvg);

  if (topology.closedElementsSvg.length > 0) {
    const closedMarkup = topology.closedElementsSvg.join('\n  ');
    return `<g opacity="0.2" fill="currentColor" stroke="none" fill-rule="evenodd">\n  ${closedMarkup}\n</g>\n<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>`;
  }

  // For pure open-stroke icons, generate secondary wide-stroke accent halo
  return `<g opacity="0.25" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>\n<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>`;
}

/**
 * Creates duotone line layer from base outline geometry.
 */
function createDuotoneLineLayer(innerSvg: string): string {
  return `<g opacity="0.25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>\n<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>`;
}

/**
 * Safely constructs filled geometry from base outline with negative space & counter preservation.
 */
function createSafeFilledGeometry(innerSvg: string): { svg: string; supportsStroke: boolean; defaultStrokeWidth: number } {
  const topology = analyzePathTopology(innerSvg);

  // 1. Pure closed shapes: Wrap in solid fill with evenodd rule
  if (topology.isFillSafe) {
    return {
      svg: `<g fill="currentColor" stroke="none" fill-rule="evenodd">\n  ${innerSvg}\n</g>`,
      supportsStroke: false,
      defaultStrokeWidth: 0,
    };
  }

  // 2. Mixed: Closed containers + open lines (e.g. folder with check, file with text)
  if (topology.hasClosedContainers && topology.hasOpenStrokes) {
    const closedMarkup = topology.closedElementsSvg.join('\n  ');
    const openMarkup = topology.openElementsSvg.join('\n  ');
    return {
      svg: `<g fill="currentColor" stroke="none" fill-rule="evenodd">\n  ${closedMarkup}\n</g>\n<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">\n  ${openMarkup}\n</g>`,
      supportsStroke: true,
      defaultStrokeWidth: 2,
    };
  }

  // 3. Pure open stroke icons (e.g. curly brackets, chevron, math symbols, antennas)
  // Preserve optical stroke integrity at 2.5px rather than corrupting into flat degenerates
  return {
    svg: `<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</g>`,
    supportsStroke: true,
    defaultStrokeWidth: 2.5,
  };
}

/**
 * Generates all five canonical variants for an icon concept.
 */
export function generateFiveVariants(
  conceptSlug: string,
  _conceptName: string,
  regularOutlineSvg: string,
  filledSvgOverride?: string
): FiveVariantsOutput {
  const cleanOutline = regularOutlineSvg.trim();

  // 1. REGULAR VARIANT (2.0px canonical reference outline)
  const regularOverride = getVariantOverride(conceptSlug, 'regular');
  const regular: IconVariant = {
    id: `${conceptSlug}-regular`,
    style: 'regular',
    label: 'Regular',
    svg: regularOverride?.svg || cleanOutline,
    viewBox: regularOverride?.viewBox || '0 0 24 24',
    supportsStroke: regularOverride?.supportsStroke ?? true,
    supportsColor: true,
    defaultStrokeWidth: regularOverride?.defaultStrokeWidth ?? 2.0,
  };

  // 2. LIGHT VARIANT (1.5px stroke outline)
  const lightOverride = getVariantOverride(conceptSlug, 'light');
  const light: IconVariant = {
    id: `${conceptSlug}-light`,
    style: 'light',
    label: 'Light',
    svg: lightOverride?.svg || cleanOutline,
    viewBox: lightOverride?.viewBox || '0 0 24 24',
    supportsStroke: lightOverride?.supportsStroke ?? true,
    supportsColor: true,
    defaultStrokeWidth: lightOverride?.defaultStrokeWidth ?? 1.5,
  };

  // 3. FILLED VARIANT (Solid geometry or handcrafted override)
  const filledOverride = getVariantOverride(conceptSlug, 'filled');
  let filledSvg = '';
  let filledSupportsStroke = false;
  let filledStrokeWidth = 0;

  if (filledOverride?.svg) {
    filledSvg = filledOverride.svg;
    filledSupportsStroke = filledOverride.supportsStroke ?? false;
    filledStrokeWidth = filledOverride.defaultStrokeWidth ?? 0;
  } else if (filledSvgOverride) {
    filledSvg = filledSvgOverride.trim();
    filledSupportsStroke = false;
    filledStrokeWidth = 0;
  } else {
    const safeFilled = createSafeFilledGeometry(cleanOutline);
    filledSvg = safeFilled.svg;
    filledSupportsStroke = safeFilled.supportsStroke;
    filledStrokeWidth = safeFilled.defaultStrokeWidth;
  }

  const filled: IconVariant = {
    id: `${conceptSlug}-filled`,
    style: 'filled',
    label: 'Filled',
    svg: filledSvg,
    viewBox: filledOverride?.viewBox || '0 0 24 24',
    supportsStroke: filledSupportsStroke,
    supportsColor: true,
    defaultStrokeWidth: filledStrokeWidth,
  };

  // 4. DUOTONE VARIANT (Primary 2.0px stroke + 20% opacity subordinate fill)
  const duotoneOverride = getVariantOverride(conceptSlug, 'duotone');
  const duotone: IconVariant = {
    id: `${conceptSlug}-duotone`,
    style: 'duotone',
    label: 'Duotone',
    svg: duotoneOverride?.svg || createDuotoneLayer(cleanOutline),
    viewBox: duotoneOverride?.viewBox || '0 0 24 24',
    supportsStroke: duotoneOverride?.supportsStroke ?? true,
    supportsColor: true,
    defaultStrokeWidth: duotoneOverride?.defaultStrokeWidth ?? 2.0,
  };

  // 5. DUOTONE LINE VARIANT (Primary 2.0px outline + 25% secondary line detail)
  const duotoneLineOverride = getVariantOverride(conceptSlug, 'duotone-line');
  const duotoneLine: IconVariant = {
    id: `${conceptSlug}-duotone-line`,
    style: 'duotone-line',
    label: 'Duotone Line',
    svg: duotoneLineOverride?.svg || createDuotoneLineLayer(cleanOutline),
    viewBox: duotoneLineOverride?.viewBox || '0 0 24 24',
    supportsStroke: duotoneLineOverride?.supportsStroke ?? true,
    supportsColor: true,
    defaultStrokeWidth: duotoneLineOverride?.defaultStrokeWidth ?? 2.0,
  };



  // Validate quality of each canonical variant against Regular baseline
  const lightReport = validateVariantAgainstRegular(light, regular, conceptSlug);
  light.qualityStatus = lightReport.status;
  light.qualityReport = lightReport;

  const regularReport = validateVariantAgainstRegular(regular, regular, conceptSlug);
  regular.qualityStatus = regularReport.status;
  regular.qualityReport = regularReport;

  const filledReport = validateVariantAgainstRegular(filled, regular, conceptSlug);
  filled.qualityStatus = filledReport.status;
  filled.qualityReport = filledReport;

  const duotoneReport = validateVariantAgainstRegular(duotone, regular, conceptSlug);
  duotone.qualityStatus = duotoneReport.status;
  duotone.qualityReport = duotoneReport;

  const duotoneLineReport = validateVariantAgainstRegular(duotoneLine, regular, conceptSlug);
  duotoneLine.qualityStatus = duotoneLineReport.status;
  duotoneLine.qualityReport = duotoneLineReport;

  const all = [regular, light, filled, duotone, duotoneLine];

  return {
    light,
    regular,
    filled,
    duotone,
    duotoneLine,
    all,
  };
}
