/**
 * SVG Normalizer for Tabler Icons & Gridframe Catalog
 */
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from './sanitizeSvg';
import type { SvgCapability, IconStyle } from '@/types/icon';

export interface NormalizedSvgResult {
  innerSvg: string;
  viewBox: string;
  style: IconStyle;
  capabilities: SvgCapability;
  strokeWidth: number;
  strokeLinecap: string;
  strokeLinejoin: string;
}

export function normalizeSvg(rawSvg: string, defaultStyle: IconStyle = 'outline'): NormalizedSvgResult {
  const sanitized = sanitizeSvgMarkup(rawSvg);
  const viewBox = extractViewBox(sanitized) || '0 0 24 24';

  // Detect style
  let style: IconStyle = defaultStyle;
  const isFilled = defaultStyle === 'filled' || sanitized.includes('icons-tabler-filled') || sanitized.includes('fill="currentColor"');
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

  // Clean inner SVG
  let innerSvg = extractInnerSvg(sanitized);

  // Remove the invisible 0 0h24v24H0z bounding box path if redundant, or leave cleanly
  // Tabler includes <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  // We can strip it or keep it clean; removing it saves ~40 bytes per icon across 6,000 icons (~240KB bundle savings!)
  innerSvg = innerSvg.replace(/<path\s+stroke="none"\s+d="M0\s+0h24v24H0z"\s+fill="none"\s*\/>/gi, '').trim();

  return {
    innerSvg,
    viewBox,
    style,
    capabilities,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}
