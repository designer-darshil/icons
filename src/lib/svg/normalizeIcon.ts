/**
 * GRIDFRAME Icon Normalization Pipeline
 * 
 * Pipeline stages:
 * SOURCE SVG
 *   ↓
 * SANITIZE
 *   ↓
 * GEOMETRY NORMALIZATION (24×24 Canvas & Affine Matrix)
 *   ↓
 * KEYSHAPE CHECK
 *   ↓
 * OPTICAL BOUNDS
 *   ↓
 * STROKE CHECK (1px, 1.5px, 2px, 2.5px)
 *   ↓
 * CAP/JOIN CHECK (round/round canonical)
 *   ↓
 * VALIDATE
 *   ↓
 * GRIDFRAME CATALOG RECORD
 */

import { sanitizeSvgMarkup } from './sanitizeSvg';
import { normalizeSvgGeometry } from './geometryNormalizer';
import { validateSvg, type SvgValidationResult } from './validateSvg';
import { analyzeIconOpticalSystem, type OpticalAnalysisResult } from './opticalBounds';
import type { Icon, IconVariant, IconMetadata, SvgCapability, IconStyle, IconSource } from '@/types/icon';

export interface NormalizedIconOutput {
  isValid: boolean;
  validation: SvgValidationResult;
  opticalAnalysis: OpticalAnalysisResult;
  metadata: IconMetadata;
  variants: IconVariant[];
  iconRecord: Partial<Icon>;
}

export interface NormalizeIconOptions {
  slug: string;
  name: string;
  category: string;
  tags?: string[];
  keywords?: string[];
  rawOutlineSvg?: string;
  rawFilledSvg?: string;
  sourceMetadata?: IconSource;
  defaultStrokeWidth?: number;
}

/**
 * Standard stroke weight scale for Gridframe linear icons
 */
export const STROKE_WEIGHT_SCALE = {
  light: 1.0,
  regular: 1.5,
  medium: 2.0,
  bold: 2.5,
} as const;

/**
 * Normalizes an icon concept and its variants through the official Gridframe normalization pipeline.
 */
export function normalizeGridframeIcon(options: NormalizeIconOptions): NormalizedIconOutput {
  const {
    slug,
    name,
    category,
    tags = [],
    keywords = [],
    rawOutlineSvg,
    rawFilledSvg,
    sourceMetadata,
    defaultStrokeWidth = 2.0,
  } = options;

  const variants: IconVariant[] = [];
  let primaryInnerSvg = '';
  const primaryViewBox = '0 0 24 24';

  // 1. Process Outline Variant if present
  if (rawOutlineSvg) {
    const sanitized = sanitizeSvgMarkup(rawOutlineSvg);
    const { normalizedInnerSvg } = normalizeSvgGeometry(sanitized);

    primaryInnerSvg = normalizedInnerSvg;

    const outlineCapabilities: SvgCapability = {
      color: true,
      size: true,
      strokeWidth: true,
      lineCap: true,
      lineJoin: true,
      background: true,
      rotation: true,
      flip: true,
    };

    variants.push({
      id: `${slug}:outline`,
      style: 'outline',
      label: 'Outline',
      svg: normalizedInnerSvg,
      viewBox: '0 0 24 24',
      capabilities: outlineCapabilities,
      supportsStroke: true,
      supportsColor: true,
      defaultStrokeWidth,
    });
  }

  // 2. Process Filled Variant if present
  if (rawFilledSvg) {
    const sanitized = sanitizeSvgMarkup(rawFilledSvg);
    const { normalizedInnerSvg } = normalizeSvgGeometry(sanitized);

    if (!primaryInnerSvg) {
      primaryInnerSvg = normalizedInnerSvg;
    }

    const filledCapabilities: SvgCapability = {
      color: true,
      size: true,
      strokeWidth: false,
      lineCap: false,
      lineJoin: false,
      background: true,
      rotation: true,
      flip: true,
    };

    variants.push({
      id: `${slug}:filled`,
      style: 'filled',
      label: 'Filled',
      svg: normalizedInnerSvg,
      viewBox: '0 0 24 24',
      capabilities: filledCapabilities,
      supportsStroke: false,
      supportsColor: true,
    });
  }

  // Fallback variant if none provided
  if (variants.length === 0 && rawOutlineSvg) {
    const sanitized = sanitizeSvgMarkup(rawOutlineSvg);
    const { normalizedInnerSvg } = normalizeSvgGeometry(sanitized);
    primaryInnerSvg = normalizedInnerSvg;
  }

  // Optical analysis
  const opticalAnalysis = analyzeIconOpticalSystem(primaryInnerSvg, defaultStrokeWidth);

  // SVG validation
  const validation = validateSvg(`<svg viewBox="0 0 24 24">${primaryInnerSvg}</svg>`);

  // Canonical Metadata Construction
  const metadata: IconMetadata = {
    viewBox: primaryViewBox,
    opticalBounds: opticalAnalysis.bounds,
    baseline: opticalAnalysis.baseline,
    centerX: opticalAnalysis.centerX,
    keyshape: opticalAnalysis.keyshape,
    strokeWidth: defaultStrokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    overlapSafeZone: 1.5,
    author: sourceMetadata?.name || 'Gridframe System',
    license: sourceMetadata?.license || 'MIT',
    source: sourceMetadata?.sourcePath || 'gridframe',
    version: sourceMetadata?.version || '1.0.0',
    updatedAt: new Date().toISOString(),
  };

  const primaryVariant = variants[0];
  const style: IconStyle = primaryVariant ? primaryVariant.style : 'outline';

  const iconRecord: Partial<Icon> = {
    id: slug.startsWith('tabler:') ? slug : `gridframe:${slug}`,
    name,
    slug,
    familyId: slug,
    category,
    tags,
    keywords,
    style,
    variants,
    svg: primaryInnerSvg,
    viewBox: primaryViewBox,
    capabilities: primaryVariant?.capabilities,
    popularity: 50,
    metadata,
  };

  return {
    isValid: validation.isValid,
    validation,
    opticalAnalysis,
    metadata,
    variants,
    iconRecord,
  };
}
