/**
 * GRIDFRAME V2 — Variant System & Path Safety Unit Tests
 */

import { isPathClosed, analyzePathTopology } from '../lib/svg/pathTopology';
import { generateFiveVariants } from '../lib/svg/variantGenerators';
import { validateIconConceptVariants } from '../lib/svg/variantValidator';

console.log('--- Testing Path Topology & Safety Analyzer ---');

// 1. Closed Path Detection
const closedPathD = 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0';
const closedWithZD = 'M4 4h16v16H4z';
const openPathD = 'M5 12h14';
const openChevronD = 'M9 18l6-6-6-6';

if (!isPathClosed(closedPathD)) throw new Error('Failed to identify closed circle path without z');
if (!isPathClosed(closedWithZD)) throw new Error('Failed to identify closed rect path with z');
if (isPathClosed(openPathD)) throw new Error('Incorrectly identified open line as closed');
if (isPathClosed(openChevronD)) throw new Error('Incorrectly identified open chevron as closed');

console.log('✓ Closed & open path detection passed');

// 2. SVG Topology Classification
const circleSvg = '<circle cx="12" cy="12" r="9" />';
const circleAnalysis = analyzePathTopology(circleSvg);
if (circleAnalysis.topology !== 'closed-shapes' || !circleAnalysis.isFillSafe) {
  throw new Error('Circle topology classification failed');
}

const bracketsSvg = '<path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 2-2 2 1 0 2 .5 2 2v2c0 2 1 3 3 3" />';
const bracketsAnalysis = analyzePathTopology(bracketsSvg);
if (bracketsAnalysis.topology !== 'pure-stroke' || bracketsAnalysis.isFillSafe) {
  throw new Error('Brackets open-stroke classification failed');
}

const mixedSvg = '<rect x="3" y="3" width="18" height="18" rx="2" />\n<path d="M9 12l2 2 4-4" />';
const mixedAnalysis = analyzePathTopology(mixedSvg);
if (mixedAnalysis.topology !== 'mixed' || mixedAnalysis.closedElements !== 1 || mixedAnalysis.openElements !== 1) {
  throw new Error('Mixed container + checkmark topology classification failed');
}

console.log('✓ Topology classification passed (pure-stroke, closed-shapes, mixed)');

// 3. Variant Generation
console.log('--- Testing Five-Variant Generation Engine ---');

const fiveVariantsCircle = generateFiveVariants('circle', 'Circle', circleSvg);
if (!fiveVariantsCircle.light || !fiveVariantsCircle.regular || !fiveVariantsCircle.filled || !fiveVariantsCircle.duotone || !fiveVariantsCircle.duotoneLine) {
  throw new Error('Failed to generate all 5 canonical variants for circle');
}
if (!fiveVariantsCircle.duotone.svg.includes('opacity="0.2"')) {
  throw new Error('Duotone missing 20% opacity subordinate fill layer');
}

// Test open stroke preservation
const fiveVariantsBrackets = generateFiveVariants('brackets-curly', 'Brackets Curly', bracketsSvg);
if (!fiveVariantsBrackets.filled.supportsStroke) {
  throw new Error('Open stroke filled variant should preserve stroke representation rather than corrupting into 0-width fill');
}

// Test manual override for Bluetooth
const fiveVariantsBt = generateFiveVariants('bluetooth', 'Bluetooth', '<path d="M7 8l10 8-5 4V4l5 4-10 8" />');
if (fiveVariantsBt.filled.defaultStrokeWidth !== 2.5) {
  throw new Error('Bluetooth manual override was not correctly applied');
}

console.log('✓ Variant generation & manual overrides passed');

// 4. Variant Quality Scoring & Validation
console.log('--- Testing Variant Quality Scoring & Diagnostics ---');

const circleValidation = validateIconConceptVariants('circle', fiveVariantsCircle.all);
if (circleValidation.overallScore < 80) {
  throw new Error(`Circle score unexpectedly low: ${circleValidation.overallScore}`);
}
if (!circleValidation.variantReports.regular || !circleValidation.variantReports.filled) {
  throw new Error('Missing variant reports in validation result');
}

console.log('✓ Variant validation scoring & reports passed');

console.log('\n🎉 ALL VARIANT SYSTEM & PATH SAFETY TESTS PASSED CLEANLY!\n');
