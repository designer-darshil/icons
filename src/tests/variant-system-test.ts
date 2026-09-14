/**
 * GRIDFRAME V2 — Canonical Variant Integrity & Path Safety Unit Tests
 */

import { isPathClosed, analyzePathTopology } from '../lib/svg/pathTopology';
import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { isValidSvgMarkup } from '../lib/icon-sanitizer';

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

// 3. Testing Canonical Variant Catalog Independence
console.log('--- Testing Canonical Variant Catalog Independence ---');

for (const icon of GRIDFRAME_ICONS.slice(0, 50)) {
  const regVariant = icon.variants.find((v) => v.style === 'regular');
  if (!regVariant) {
    throw new Error(`Icon ${icon.slug} is missing regular variant`);
  }
  for (const v of icon.variants) {
    if (!v.svg || v.svg.trim().length === 0) {
      throw new Error(`Icon ${icon.slug} variant ${v.style} has empty SVG`);
    }
    if (!isValidSvgMarkup(v.svg)) {
      throw new Error(`Icon ${icon.slug} variant ${v.style} has invalid SVG`);
    }
    if (v.viewBox !== '0 0 24 24') {
      throw new Error(`Icon ${icon.slug} variant ${v.style} has non-standard viewBox "${v.viewBox}"`);
    }
  }
}

console.log('✓ Verified canonical variant independence for sample catalog icons');

console.log('\n🎉 ALL VARIANT SYSTEM & PATH SAFETY TESTS PASSED CLEANLY!\n');
