/**
 * Gridframe V2 — Catalog Quality & SVG Validation Suite
 * Provides single-source-of-truth verification, metadata normalization,
 * SVG geometry checking, duplicate detection, and full catalog quality reporting.
 */

import type { Icon, CanonicalIconVariant } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';

export interface CatalogQualityReport {
  totalIcons: number;
  totalVariants: number;
  iconsWithRegular: number;
  iconsWithLight: number;
  iconsWithFilled: number;
  iconsWithDuotone: number;
  iconsWithDuotoneLine: number;
  duplicateSlugs: string[];
  duplicateConcepts: string[];
  invalidSvgs: { iconSlug: string; style: string; reason: string }[];
  missingSvgCount: number;
  emptySvgCount: number;
  invalidViewBoxCount: number;
  missingCategoryCount: number;
  missingTagsCount: number;
  healthScore: number; // 0 to 100
  generatedAt: string;
}

/**
 * Normalizes metadata strings (tags, keywords, aliases)
 * Trims, lowercases, eliminates duplicate punctuation while preserving alphanumeric tokens.
 */
export function normalizeMetadataToken(token: string): string {
  if (!token || typeof token !== 'string') return '';
  return token
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function normalizeMetadataArray(tokens: string[]): string[] {
  if (!Array.isArray(tokens)) return [];
  const normalized = tokens
    .map((t) => normalizeMetadataToken(t))
    .filter((t) => t.length > 0);
  return Array.from(new Set(normalized));
}

/**
 * Inspects an SVG string for geometric and markup integrity without modifying geometry.
 */
export function validateSvgContent(svgString: string, viewBox: string = '0 0 24 24'): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!svgString || typeof svgString !== 'string' || svgString.trim().length === 0) {
    issues.push('SVG string is empty or missing');
    return { isValid: false, issues };
  }

  const trimmed = svgString.trim();

  // Check for SVG markup or inner path geometry
  const hasGeometry =
    trimmed.includes('<path') ||
    trimmed.includes('<circle') ||
    trimmed.includes('<ellipse') ||
    trimmed.includes('<rect') ||
    trimmed.includes('<line') ||
    trimmed.includes('<polyline') ||
    trimmed.includes('<polygon') ||
    trimmed.includes('<g');

  if (!hasGeometry) {
    issues.push('SVG lacks vector geometry tags (<path>, <circle>, <rect>, etc.)');
  }

  // Check viewBox validity
  if (viewBox && viewBox !== '0 0 24 24') {
    issues.push(`Non-standard canonical viewBox: "${viewBox}" (expected "0 0 24 24")`);
  }

  // Check for unclosed or suspicious tags
  const openTags = (trimmed.match(/<[a-z]+/gi) || []).length;
  const closeOrSelfClosingTags = (trimmed.match(/(<\/[a-z]+>|\/>)/gi) || []).length;
  if (openTags > closeOrSelfClosingTags) {
    issues.push('Malformed XML: tag opening/closing mismatch detected');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Runs a complete audit on the given icon catalog dataset.
 */
export function generateCatalogQualityReport(icons: Icon[] = GRIDFRAME_ICONS): CatalogQualityReport {
  let totalVariants = 0;
  let iconsWithRegular = 0;
  let iconsWithLight = 0;
  let iconsWithFilled = 0;
  let iconsWithDuotone = 0;
  let iconsWithDuotoneLine = 0;

  let missingSvgCount = 0;
  let emptySvgCount = 0;
  let invalidViewBoxCount = 0;
  let missingCategoryCount = 0;
  let missingTagsCount = 0;

  const seenSlugs = new Map<string, number>();
  const duplicateSlugs: string[] = [];
  const duplicateConcepts: string[] = [];
  const invalidSvgs: { iconSlug: string; style: string; reason: string }[] = [];

  // Suffixes that might indicate variants incorrectly split into multiple concepts
  const styleSuffixes = ['-regular', '-light', '-filled', '-duotone', '-duotone-line', '-outline', '-bold'];

  for (const icon of icons) {
    // 1. Slug tracking
    const slugCount = (seenSlugs.get(icon.slug) || 0) + 1;
    seenSlugs.set(icon.slug, slugCount);
    if (slugCount === 2) {
      duplicateSlugs.push(icon.slug);
    }

    // 2. Separate style concept detection
    for (const suffix of styleSuffixes) {
      if (icon.slug.endsWith(suffix)) {
        const baseSlug = icon.slug.slice(0, -suffix.length);
        if (icons.some((other) => other.slug === baseSlug)) {
          duplicateConcepts.push(icon.slug);
        }
      }
    }

    // 3. Category & Tag metadata
    if (!icon.category || icon.category.trim() === '') {
      missingCategoryCount++;
    }
    if (!icon.tags || icon.tags.length === 0) {
      missingTagsCount++;
    }

    // 4. Variants analysis
    const variants = icon.variants || [];
    totalVariants += variants.length;

    let hasRegular = false;
    let hasLight = false;
    let hasFilled = false;
    let hasDuotone = false;
    let hasDuotoneLine = false;

    for (const variant of variants) {
      const style = variant.style as CanonicalIconVariant;
      if (style === 'regular') hasRegular = true;
      else if (style === 'light') hasLight = true;
      else if (style === 'filled') hasFilled = true;
      else if (style === 'duotone') hasDuotone = true;
      else if (style === 'duotone-line') hasDuotoneLine = true;

      // Validate SVG geometry
      if (!variant.svg || variant.svg.trim().length === 0) {
        emptySvgCount++;
        invalidSvgs.push({ iconSlug: icon.slug, style: variant.style, reason: 'Empty SVG content' });
      } else {
        const val = validateSvgContent(variant.svg, variant.viewBox);
        if (!val.isValid) {
          invalidSvgs.push({ iconSlug: icon.slug, style: variant.style, reason: val.issues.join('; ') });
        }
      }

      if (variant.viewBox && variant.viewBox !== '0 0 24 24') {
        invalidViewBoxCount++;
      }
    }

    if (hasRegular) iconsWithRegular++;
    if (hasLight) iconsWithLight++;
    if (hasFilled) iconsWithFilled++;
    if (hasDuotone) iconsWithDuotone++;
    if (hasDuotoneLine) iconsWithDuotoneLine++;
  }

  // Calculate overall health score out of 100
  let deductions = 0;
  if (duplicateSlugs.length > 0) deductions += 20;
  if (duplicateConcepts.length > 0) deductions += 15;
  if (invalidSvgs.length > 0) deductions += Math.min(25, invalidSvgs.length * 2);
  if (missingCategoryCount > 0) deductions += Math.min(10, missingCategoryCount);
  if (missingTagsCount > 0) deductions += Math.min(10, missingTagsCount);

  const healthScore = Math.max(0, 100 - deductions);

  return {
    totalIcons: icons.length,
    totalVariants,
    iconsWithRegular,
    iconsWithLight,
    iconsWithFilled,
    iconsWithDuotone,
    iconsWithDuotoneLine,
    duplicateSlugs,
    duplicateConcepts,
    invalidSvgs,
    missingSvgCount,
    emptySvgCount,
    invalidViewBoxCount,
    missingCategoryCount,
    missingTagsCount,
    healthScore,
    generatedAt: new Date().toISOString(),
  };
}
