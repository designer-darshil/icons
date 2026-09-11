/**
 * Comprehensive GRIDFRAME Icon System Validator & Linter
 * Evaluates icons against the Official GRIDFRAME Icon Design Language specification.
 */

import type { Icon } from '@/types/icon';
import { validateSvg } from './validateSvg';
import { analyzeIconOpticalSystem } from './opticalBounds';

export interface IconLintIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface IconLintResult {
  iconId: string;
  slug: string;
  isValid: boolean;
  score: number; // 0 to 100 overall system compliance score
  errors: IconLintIssue[];
  warnings: IconLintIssue[];
}

const FORBIDDEN_NAMING_SUFFIXES = [
  '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9',
  '-final', '-new', '-alt', '-copy', '-v2', '-test'
];

const ALLOWED_ELEMENTS = new Set([
  'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g', 'svg', 'defs', 'clippath', 'mask'
]);

/**
 * Lints a single Icon entity according to GRIDFRAME system rules.
 */
export function lintIconRecord(icon: Icon): IconLintResult {
  const errors: IconLintIssue[] = [];
  const warnings: IconLintIssue[] = [];

  // =========================================================================
  // 1. NAMING CONVENTIONS
  // =========================================================================
  if (!icon.slug || typeof icon.slug !== 'string') {
    errors.push({
      severity: 'error',
      code: 'NAME_INVALID',
      field: 'slug',
      message: 'Icon slug is missing or not a string.',
    });
  } else {
    // Check lowercase kebab-case
    if (icon.slug !== icon.slug.toLowerCase() || /[^a-z0-9-]/.test(icon.slug)) {
      errors.push({
        severity: 'error',
        code: 'NAME_NOT_KEBAB_CASE',
        field: 'slug',
        message: `Slug "${icon.slug}" must be strictly lowercase alphanumeric with hyphens (kebab-case).`,
      });
    }

    // Check forbidden arbitrary numeric suffixes
    for (const suffix of FORBIDDEN_NAMING_SUFFIXES) {
      if (icon.slug.endsWith(suffix)) {
        warnings.push({
          severity: 'warning',
          code: 'NAME_GENERIC_SUFFIX',
          field: 'slug',
          message: `Slug "${icon.slug}" ends with generic suffix "${suffix}". Use descriptive modifiers instead (e.g. "arrow-turn-down").`,
        });
        break;
      }
    }
  }

  // =========================================================================
  // 2. CANVAS & VIEWBOX
  // =========================================================================
  if (icon.viewBox !== '0 0 24 24') {
    errors.push({
      severity: 'error',
      code: 'CANVAS_NON_STANDARD_VIEWBOX',
      field: 'viewBox',
      message: `Canvas viewBox must be canonical "0 0 24 24", received "${icon.viewBox}".`,
    });
  }

  // =========================================================================
  // 3. VARIANTS & STROKE INTEGRITY
  // =========================================================================
  if (!Array.isArray(icon.variants) || icon.variants.length === 0) {
    errors.push({
      severity: 'error',
      code: 'VARIANTS_MISSING',
      field: 'variants',
      message: 'Icon must have at least one variant.',
    });
  } else {
    // Check for regular/outline baseline variant
    const hasRegular = icon.variants.some((v) => v.style === 'regular' || v.style === 'outline');
    if (!hasRegular) {
      errors.push({
        severity: 'error',
        code: 'REGULAR_VARIANT_MISSING',
        field: 'variants',
        message: 'Icon is missing the primary reference "regular" variant.',
      });
    }

    for (const variant of icon.variants) {
      // SVG markup validation
      const svgRes = validateSvg(`<svg viewBox="0 0 24 24">${variant.svg}</svg>`);
      if (!svgRes.isValid) {
        for (const err of svgRes.errors) {
          errors.push({
            severity: 'error',
            code: 'SVG_INVALID',
            field: `variant:${variant.style}`,
            message: `Variant "${variant.style}" failed SVG validation: ${err}`,
          });
        }
      }

      // Check for hardcoded colors in outline style
      if (variant.style === 'outline' || variant.style === 'linear') {
        if (/stroke=["']#(?!currentColor)/i.test(variant.svg) || /stroke=["']rgb/i.test(variant.svg)) {
          errors.push({
            severity: 'error',
            code: 'STROKE_HARDCODED_COLOR',
            field: `variant:${variant.style}`,
            message: `Variant "${variant.style}" has hardcoded stroke color. Use "currentColor".`,
          });
        }
      }

      // Check for disallowed SVG element tags
      const tagMatches = variant.svg.match(/<([a-z0-9-]+)/gi) || [];
      for (const t of tagMatches) {
        const tagName = t.slice(1).toLowerCase();
        if (!ALLOWED_ELEMENTS.has(tagName)) {
          warnings.push({
            severity: 'warning',
            code: 'SVG_ELEMENT_DISALLOWED',
            field: `variant:${variant.style}`,
            message: `Variant "${variant.style}" contains non-standard SVG element <${tagName}>.`,
          });
        }
      }

      // Check for transform attributes
      if (/\stransform\s*=/i.test(variant.svg)) {
        warnings.push({
          severity: 'warning',
          code: 'SVG_TRANSFORM_PRESENT',
          field: `variant:${variant.style}`,
          message: `Variant "${variant.style}" contains raw transform attribute; coordinates should be normalized.`,
        });
      }
    }
  }

  // =========================================================================
  // 4. OPTICAL ANALYSIS & SAFE ZONE
  // =========================================================================
  const optical = icon.opticalMetrics || analyzeIconOpticalSystem(icon.svg || '');
  if (!optical.safeZoneCompliant) {
    warnings.push({
      severity: 'warning',
      code: 'OPTICAL_SAFE_ZONE_VIOLATION',
      field: 'geometry',
      message: `Artwork extends outside 1px safe zone [1, 23] (bounds: x=${optical.bounds.x}, y=${optical.bounds.y}, w=${optical.bounds.width}, h=${optical.bounds.height}).`,
      details: optical.bounds,
    });
  }

  if (optical.centerScore < 60) {
    warnings.push({
      severity: 'warning',
      code: 'OPTICAL_UNBALANCED_CENTER',
      field: 'geometry',
      message: `Visual center offset is significant (centerScore: ${optical.centerScore}/100, offset: dx=${optical.centerOffset.x}, dy=${optical.centerOffset.y}).`,
      details: optical.centerOffset,
    });
  }

  // =========================================================================
  // 5. METADATA & USE CASES
  // =========================================================================
  if (!icon.category) {
    errors.push({
      severity: 'error',
      code: 'METADATA_CATEGORY_MISSING',
      field: 'category',
      message: 'Category is required for taxonomy categorization.',
    });
  }

  if (!icon.tags || icon.tags.length === 0) {
    warnings.push({
      severity: 'warning',
      code: 'METADATA_TAGS_EMPTY',
      field: 'tags',
      message: 'Icon has no search tags defined.',
    });
  }

  if (icon.useCases && icon.useCases.length > 0) {
    for (const uc of icon.useCases) {
      if (/[.!?]$/.test(uc.trim())) {
        warnings.push({
          severity: 'warning',
          code: 'USE_CASE_PUNCTUATION',
          field: 'useCases',
          message: `Use case "${uc}" should not end with punctuation.`,
        });
      }
    }
  }

  // Calculate overall compliance score (100 base, -20 per error, -5 per warning)
  const deductions = errors.length * 20 + warnings.length * 5;
  const score = Math.max(0, 100 - deductions);

  return {
    iconId: icon.id || icon.slug,
    slug: icon.slug,
    isValid: errors.length === 0,
    score,
    errors,
    warnings,
  };
}
