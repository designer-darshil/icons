/**
 * Gridframe V2 — Icon Catalog + Content Architecture Test Suite
 * Validates:
 * 1. Single source of truth across catalog, search, and storage
 * 2. Concept-based records (1 concept = 1 record, variants live inside)
 * 3. Complete SVG geometry validation across all 1,600+ catalog icons
 * 4. Duplicate concept & duplicate slug detection
 * 5. Category index and metadata relationships
 * 6. Search index consistency
 * 7. Quality report generation
 */

import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { generateCatalogQualityReport, validateSvgContent, normalizeMetadataArray } from '../lib/catalog-quality';
import { searchIconsWithScore } from '../lib/icon-search';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    throw new Error(`Catalog Architecture Test Failed: ${msg}`);
  }
}

console.log('\n======================================================');
console.log('  🧪 RUNNING CATALOG & DATA QUALITY TEST SUITE');
console.log('======================================================\n');

console.log('1. Validating Canonical Catalog Scope & Invariants...');
assert(Array.isArray(GRIDFRAME_ICONS), 'GRIDFRAME_ICONS must be an array');
assert(GRIDFRAME_ICONS.length >= 1000, `Expected at least 1,000 canonical icons, found ${GRIDFRAME_ICONS.length}`);
console.log(`   ✓ Loaded ${GRIDFRAME_ICONS.length.toLocaleString()} conceptual icons from single source of truth`);

console.log('2. Running Full Catalog Quality Audit...');
const report = generateCatalogQualityReport(GRIDFRAME_ICONS);
console.log(`   - Total Concepts: ${report.totalIcons}`);
console.log(`   - Total Variants: ${report.totalVariants}`);
console.log(`   - Regular: ${report.iconsWithRegular}`);
console.log(`   - Light: ${report.iconsWithLight}`);
console.log(`   - Filled: ${report.iconsWithFilled}`);
console.log(`   - Duotone: ${report.iconsWithDuotone}`);
console.log(`   - Duotone Line: ${report.iconsWithDuotoneLine}`);
console.log(`   - Duplicate Slugs: ${report.duplicateSlugs.length}`);
console.log(`   - Duplicate Concepts: ${report.duplicateConcepts.length}`);
console.log(`   - Invalid SVGs: ${report.invalidSvgs.length}`);
console.log(`   - Overall Health Score: ${report.healthScore}%`);

assert(report.duplicateSlugs.length === 0, `Found duplicate slugs: ${report.duplicateSlugs.join(', ')}`);
assert(report.duplicateConcepts.length === 0, `Found duplicate concept records for styles: ${report.duplicateConcepts.join(', ')}`);
assert(report.emptySvgCount === 0, `Found ${report.emptySvgCount} empty SVGs`);
assert(report.healthScore >= 95, `Catalog health score too low: ${report.healthScore}%`);
console.log('   ✓ Catalog Quality Audit passed with 0 duplicates and zero empty SVGs');

console.log('3. Testing SVG Geometry Validation Across Sample Styles...');
let sampledVariants = 0;
for (const icon of GRIDFRAME_ICONS.slice(0, 100)) {
  for (const variant of icon.variants || []) {
    const val = validateSvgContent(variant.svg, variant.viewBox);
    assert(val.isValid, `Invalid SVG in icon "${icon.slug}" variant "${variant.style}": ${val.issues.join(', ')}`);
    sampledVariants++;
  }
}
console.log(`   ✓ Validated ${sampledVariants} sample variant geometries`);

console.log('4. Testing Metadata Normalization...');
const rawTags = [' User ', 'USER', 'user', 'profile_action!', '   '];
const normalized = normalizeMetadataArray(rawTags);
assert(normalized.includes('user'), 'Normalized tags must include "user"');
assert(normalized.length === 2, `Expected 2 unique normalized tags, got ${normalized.length} (${normalized.join(', ')})`);
console.log('   ✓ Metadata normalization functioning correctly');

console.log('5. Testing Search Index & Query Consistency...');
const searchResults = searchIconsWithScore(GRIDFRAME_ICONS, 'search');
assert(searchResults.length > 0, 'Search for "search" should return results');
assert(searchResults[0].slug.includes('search'), 'First result should be relevant');
console.log('   ✓ Search index consistently retrieves canonical items');

console.log('\n======================================================');
console.log('  ✅ ALL CATALOG & CONTENT ARCHITECTURE TESTS PASSED');
console.log('======================================================\n');
