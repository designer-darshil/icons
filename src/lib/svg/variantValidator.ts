/**
 * GRIDFRAME V2 — Canonical Variant Quality & Integrity Validator
 * 
 * Audits authentic vector variants:
 * Validates XML structure, viewBox compliance, non-empty geometry,
 * and topology integrity.
 */

import { analyzePathTopology } from './pathTopology';
import { analyzeIconOpticalSystem } from './opticalBounds';
import { isValidSvgMarkup } from '../icon-sanitizer';
import type {
  CanonicalIconVariant,
  IconVariant,
  VariantQualityReport,
  VariantQualityStatus,
} from '@/types/icon';

export interface IconValidationResult {
  conceptSlug: string;
  overallScore: number;
  overallStatus: VariantQualityStatus;
  variantReports: Partial<Record<CanonicalIconVariant, VariantQualityReport>>;
  allValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Evaluates a single canonical icon variant against standard vector specifications.
 */
export function validateVariantAgainstRegular(
  variant: IconVariant,
  regularVariant: IconVariant,
  _conceptSlug?: string
): VariantQualityReport {
  const variantStyle = (variant.style as CanonicalIconVariant) || 'regular';
  const issues: string[] = [];
  let status: VariantQualityStatus = 'validated';
  let score = 100;

  // 1. Structure & Markup Validation
  if (!variant.svg || variant.svg.trim().length === 0) {
    status = 'invalid';
    issues.push('Variant has empty SVG markup.');
    return {
      variantStyle,
      status,
      score: 0,
      isTopologySafe: false,
      issues,
    };
  }

  if (!isValidSvgMarkup(variant.svg)) {
    status = 'invalid';
    issues.push('Variant contains invalid SVG XML syntax.');
    score -= 50;
  }

  // 2. ViewBox Check
  if (variant.viewBox !== '0 0 24 24') {
    issues.push(`Non-standard viewBox: "${variant.viewBox}" (expected "0 0 24 24").`);
    score -= 10;
    if (status === 'validated') status = 'warning';
  }

  // 3. Path Topology Analysis
  const topology = analyzePathTopology(variant.svg);
  for (const issue of topology.issues) {
    issues.push(issue);
    score -= 10;
  }

  // 4. Optical Analysis
  const regularOptical = analyzeIconOpticalSystem(regularVariant.svg, 2.0);
  const variantStrokeWidth = variant.defaultStrokeWidth ?? (variantStyle === 'light' ? 1.5 : 2.0);
  const variantOptical = analyzeIconOpticalSystem(variant.svg, variantStrokeWidth);

  const dx = Math.round((variantOptical.bounds.x + variantOptical.bounds.width / 2 - (regularOptical.bounds.x + regularOptical.bounds.width / 2)) * 100) / 100;
  const dy = Math.round((variantOptical.bounds.y + variantOptical.bounds.height / 2 - (regularOptical.bounds.y + regularOptical.bounds.height / 2)) * 100) / 100;
  const dw = Math.round((variantOptical.bounds.width - regularOptical.bounds.width) * 100) / 100;
  const dh = Math.round((variantOptical.bounds.height - regularOptical.bounds.height) * 100) / 100;

  const regArea = Math.max(0.1, regularOptical.occupiedAreaPercentage);
  const varArea = variantOptical.occupiedAreaPercentage;
  const areaDeltaPct = Math.round(((varArea - regArea) / regArea) * 100);

  // Safe Zone Compliance Check
  if (!variantOptical.safeZoneCompliant) {
    issues.push('Artwork extends outside the 1px safe zone boundary [1, 23].');
    score -= 10;
    if (status === 'validated') status = 'warning';
  }

  if (score < 50) {
    status = 'invalid';
  } else if (score < 80 && status === 'validated') {
    status = 'warning';
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    variantStyle,
    status,
    score: finalScore,
    isTopologySafe: topology.issues.length === 0,
    issues,
    opticalDelta: {
      centerDelta: { dx, dy },
      occupiedAreaDeltaPct: areaDeltaPct,
      boundingDelta: { dw, dh },
    },
  };
}

/**
 * Validates only the authentic variants present on an icon concept.
 */
export function validateIconConceptVariants(
  conceptSlug: string,
  variants: IconVariant[]
): IconValidationResult {
  const regular = variants.find((v) => v.style === 'regular') || variants[0];
  const variantReports: Partial<Record<CanonicalIconVariant, VariantQualityReport>> = {};
  let totalScore = 0;
  let hasErrors = false;
  let hasWarnings = false;
  let hasManualReview = false;

  for (const variant of variants) {
    const style = variant.style as CanonicalIconVariant;
    const report = validateVariantAgainstRegular(variant, regular, conceptSlug);
    variantReports[style] = report;
    totalScore += report.score;

    if (report.status === 'invalid') hasErrors = true;
    if (report.status === 'warning') hasWarnings = true;
    if (report.status === 'manual-review') hasManualReview = true;
  }

  const overallScore = variants.length > 0 ? Math.round(totalScore / variants.length) : 100;
  let overallStatus: VariantQualityStatus = 'validated';
  if (hasErrors) overallStatus = 'invalid';
  else if (hasManualReview) overallStatus = 'manual-review';
  else if (hasWarnings) overallStatus = 'warning';

  return {
    conceptSlug,
    overallScore,
    overallStatus,
    variantReports,
    allValid: overallStatus === 'validated',
    hasErrors,
    hasWarnings,
  };
}
