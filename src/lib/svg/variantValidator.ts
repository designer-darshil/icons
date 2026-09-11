/**
 * GRIDFRAME V2 — Variant Quality & Optical Consistency Validator
 * 
 * Audits all 5 coordinated visual variants against the Regular reference baseline.
 * Detects geometry breakage, topology loss, bounding box overflow, center drift,
 * and occupied area deltas. Computes rigorous 0–100 Quality Scores.
 */

import { analyzePathTopology } from './pathTopology';
import { analyzeIconOpticalSystem } from './opticalBounds';
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
  variantReports: Record<CanonicalIconVariant, VariantQualityReport>;
  allValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Evaluates a single icon variant against the canonical Regular reference baseline.
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

  // 1. Path Topology Analysis
  const topology = analyzePathTopology(variant.svg);
  for (const issue of topology.issues) {
    issues.push(issue);
    score -= 15;
  }

  // 2. Filled Variant Safety Rules
  if (variantStyle === 'filled') {
    if (topology.hasOpenStrokes && !variant.supportsStroke) {
      status = 'manual-review';
      issues.push('Filled variant contains open stroke paths without stroke support, destroying topology.');
      score -= 25;
    }
    if (topology.totalElements === 0) {
      status = 'invalid';
      issues.push('Filled variant has empty geometry.');
      score = 0;
    }
  }

  // 3. Duotone Variant Rules
  if (variantStyle === 'duotone') {
    if (!variant.svg.includes('opacity="0.2"') && !variant.svg.includes('opacity="0.25"')) {
      issues.push('Duotone variant missing subordinate opacity layer.');
      score -= 10;
    }
  }

  // 4. Optical Analysis & Deltas vs Regular Baseline
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

  // Optical Center Drift Check
  const centerDistance = Math.hypot(dx, dy);
  if (centerDistance > 1.5) {
    issues.push(`Optical center shifted by ${centerDistance.toFixed(1)}px from Regular baseline (dx: ${dx}, dy: ${dy}).`);
    score -= 15;
    if (status === 'validated') status = 'warning';
  }

  // Safe Zone Compliance
  if (!variantOptical.safeZoneCompliant) {
    issues.push('Artwork extends outside the 1px safe zone boundary [1, 23].');
    score -= 10;
    if (status === 'validated') status = 'warning';
  }

  // Occupied Area Delta Check (Filled is allowed to be heavier, but Light/Duotone should stay within bounds)
  if (variantStyle === 'light' && areaDeltaPct > 20) {
    issues.push(`Light variant occupied area is unexpectedly larger than Regular (+${areaDeltaPct}%).`);
    score -= 10;
    if (status === 'validated') status = 'warning';
  } else if (variantStyle === 'duotone' && Math.abs(areaDeltaPct) > 50) {
    issues.push(`Duotone occupied area differs by ${areaDeltaPct}% from Regular baseline.`);
    score -= 10;
    if (status === 'validated') status = 'warning';
  }

  // Hard Errors check
  if (score < 50 && status !== 'manual-review') {
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
 * Validates all 5 variants of an icon concept.
 */
export function validateIconConceptVariants(
  conceptSlug: string,
  variants: IconVariant[]
): IconValidationResult {
  const regular = variants.find((v) => v.style === 'regular') || variants[0];
  const variantStyles: CanonicalIconVariant[] = ['light', 'regular', 'filled', 'duotone', 'duotone-line'];

  const variantReports: Partial<Record<CanonicalIconVariant, VariantQualityReport>> = {};
  let totalScore = 0;
  let hasErrors = false;
  let hasWarnings = false;
  let hasManualReview = false;

  for (const style of variantStyles) {
    const variant = variants.find((v) => v.style === style) || regular;
    const report = validateVariantAgainstRegular(variant, regular, conceptSlug);
    variantReports[style] = report;
    totalScore += report.score;

    if (report.status === 'invalid') hasErrors = true;
    if (report.status === 'warning') hasWarnings = true;
    if (report.status === 'manual-review') hasManualReview = true;
  }

  const overallScore = Math.round(totalScore / variantStyles.length);
  let overallStatus: VariantQualityStatus = 'validated';
  if (hasErrors) overallStatus = 'invalid';
  else if (hasManualReview) overallStatus = 'manual-review';
  else if (hasWarnings) overallStatus = 'warning';

  return {
    conceptSlug,
    overallScore,
    overallStatus,
    variantReports: variantReports as Record<CanonicalIconVariant, VariantQualityReport>,
    allValid: overallStatus === 'validated',
    hasErrors,
    hasWarnings,
  };
}
