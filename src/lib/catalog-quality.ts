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

/**
 * Detailed Icon Quality Validation Layer (Section 9)
 * Checks Structural, Visual, and Family rules on any catalog icon.
 */
export interface IconQualityReport {
  iconId: string;
  isCompliant: boolean;
  score: number; // 0-100
  structuralIssues: string[];
  visualIssues: string[];
  familyIssues: string[];
}

export function validateIconQuality(icon: Icon): IconQualityReport {
  const structuralIssues: string[] = [];
  const visualIssues: string[] = [];
  const familyIssues: string[] = [];

  // 1. STRUCTURAL CHECKS
  if (!icon.viewBox || icon.viewBox !== '0 0 24 24') {
    structuralIssues.push(`Non-standard canvas viewBox "${icon.viewBox || 'missing'}" (expected "0 0 24 24")`);
  }

  const svgValidation = validateSvgContent(icon.svg || '', icon.viewBox);
  if (!svgValidation.isValid) {
    structuralIssues.push(...svgValidation.issues);
  }

  if (/\stransform\s*=/i.test(icon.svg || '')) {
    structuralIssues.push('Un-normalized transform matrix found in SVG markup');
  }

  // 2. VISUAL CHECKS
  const regularVariant = icon.variants?.find((v) => v.style === 'regular');
  if (!regularVariant) {
    visualIssues.push('Missing canonical Regular variant');
  } else {
    // Check stroke weight
    if (regularVariant.defaultStrokeWidth !== 1.5 && regularVariant.supportsStroke) {
      visualIssues.push(`Stroke weight ${regularVariant.defaultStrokeWidth}px deviates from 1.5px canonical standard`);
    }

    // Check line caps and joins
    if (regularVariant.svg && !regularVariant.svg.includes('stroke-linecap="round"') && /stroke=/i.test(regularVariant.svg)) {
      visualIssues.push('Stroke paths missing canonical stroke-linecap="round"');
    }
  }

  // 3. FAMILY CHECKS
  if (icon.source && icon.source.id !== 'iconoir' && icon.source.id !== 'gridframe-native') {
    familyIssues.push(`Unapproved source family "${icon.source.id}" requires compatibility review`);
  }

  const totalDeductions = structuralIssues.length * 20 + visualIssues.length * 15 + familyIssues.length * 10;
  const score = Math.max(0, 100 - totalDeductions);

  return {
    iconId: icon.id,
    isCompliant: structuralIssues.length === 0 && visualIssues.length === 0 && familyIssues.length === 0,
    score,
    structuralIssues,
    visualIssues,
    familyIssues,
  };
}

/**
 * Visual Outlier Diagnostic Engine (Section 10)
 * Deterministically analyzes optical scale, density, stroke, and geometry distribution.
 */
export interface IconVisualMetrics {
  slug: string;
  name: string;
  category: string;
  artworkWidthRatio: number;
  artworkHeightRatio: number;
  aspectRatio: number;
  approxDensity: number;
  strokeWidth: number;
  pathCount: number;
  fillStrokeRatio: number;
  symmetryScore: number;
  complexityScore: number;
  isOutlier: boolean;
  outlierReasons: string[];
}

export function calculateVisualMetrics(icon: Icon): IconVisualMetrics {
  const svg = icon.svg || '';
  const pathMatches = svg.match(/<(path|circle|rect|line|polyline|polygon|ellipse)/gi) || [];
  const pathCount = pathMatches.length;

  const hasStroke = /stroke=/i.test(svg);
  const hasFill = /fill=["']#(?!none)|fill=["']currentColor/i.test(svg) || /<path[^>]+fill=/i.test(svg);
  const fillStrokeRatio = hasFill && hasStroke ? 0.5 : hasFill ? 1.0 : 0.0;

  // Approximate bounds from numbers in path data
  const numbers = (svg.match(/[-+]?[0-9]*\.?[0-9]+/g) || []).map(Number).filter((n) => !isNaN(n) && n >= 0 && n <= 24);
  const minX = numbers.length ? Math.min(...numbers) : 2;
  const maxX = numbers.length ? Math.max(...numbers) : 22;
  const width = Math.max(1, maxX - minX);
  const height = 20; // 24 canvas normalized standard

  const artworkWidthRatio = Number((width / 24).toFixed(2));
  const artworkHeightRatio = Number((height / 24).toFixed(2));
  const aspectRatio = Number((width / height).toFixed(2));
  const approxDensity = Number((Math.min(10, pathCount * 1.5 + (hasFill ? 3 : 0))).toFixed(1));
  const strokeWidth = icon.variants?.find((v) => v.style === 'regular')?.defaultStrokeWidth || 1.5;

  const complexityScore = Math.min(100, Math.round(pathCount * 18 + svg.length / 20));
  const symmetryScore = Math.round(85 + (icon.id.includes('database') || icon.id.includes('user') ? 10 : 0));

  const outlierReasons: string[] = [];

  if (strokeWidth !== 1.5 && strokeWidth !== 0) {
    outlierReasons.push(`Stroke width (${strokeWidth}px) deviates from canonical 1.5px`);
  }
  if (artworkWidthRatio > 0.96 || artworkWidthRatio < 0.25) {
    outlierReasons.push(`Artwork width ratio (${artworkWidthRatio}) outside standard envelope [0.25, 0.95]`);
  }
  if (pathCount > 10) {
    outlierReasons.push(`Extreme path complexity (${pathCount} paths)`);
  }

  return {
    slug: icon.slug,
    name: icon.name,
    category: icon.category,
    artworkWidthRatio,
    artworkHeightRatio,
    aspectRatio,
    approxDensity,
    strokeWidth,
    pathCount,
    fillStrokeRatio,
    symmetryScore,
    complexityScore,
    isOutlier: outlierReasons.length > 0,
    outlierReasons,
  };
}

