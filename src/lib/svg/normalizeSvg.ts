/**
 * SVG Normalizer for Gridframe Catalog
 * Normalizes all geometry to canonical 24×24 coordinates (viewBox="0 0 24 24").
 */
import { sanitizeSvgMarkup } from './sanitizeSvg';
import { normalizeSvgGeometry, type BoundingBox } from './geometryNormalizer';
import type { SvgCapability, IconStyle } from '@/types/icon';

export interface NormalizedSvgResult {
  innerSvg: string;
  viewBox: string;
  style: IconStyle;
  capabilities: SvgCapability;
  strokeWidth: number;
  strokeLinecap: string;
  strokeLinejoin: string;
  bounds: BoundingBox;
}

export function normalizeSvg(rawSvg: string, defaultStyle: IconStyle = 'outline'): NormalizedSvgResult {
  const sanitized = sanitizeSvgMarkup(rawSvg);
  const { normalizedInnerSvg, viewBox, bounds } = normalizeSvgGeometry(sanitized);

  // Detect style
  let style: IconStyle = defaultStyle;
  const isFilled =
    defaultStyle === 'filled' ||
    sanitized.includes('icons-tabler-filled') ||
    sanitized.includes('fill="currentColor"') ||
    (!sanitized.includes('stroke="currentColor"') && sanitized.includes('fill='));

  if (isFilled) {
    style = 'filled';
  }

  // Detect capabilities
  const supportsStroke = style !== 'filled' && !sanitized.includes('stroke="none"');
  const supportsColor = true;

  const capabilities: SvgCapability = {
    color: supportsColor,
    size: true,
    strokeWidth: supportsStroke,
    lineCap: supportsStroke,
    lineJoin: supportsStroke,
    background: true,
    rotation: true,
    flip: true,
  };

  return {
    innerSvg: normalizedInnerSvg,
    viewBox,
    style,
    capabilities,
    strokeWidth: supportsStroke ? 2 : 0,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    bounds,
  };
}
