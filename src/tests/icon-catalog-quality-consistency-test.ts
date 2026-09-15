/**
 * Test Suite: Icon Catalog Quality & SVG Source Consistency
 * Verifies that Database, Development, System, and User icons strictly conform
 * to the canonical Gridframe / Iconoir design language and 24×24 canvas rules.
 */

import catalogData from '../data/icons/catalog.json';
import type { Icon } from '../types/icon';
import { validateSvgContent } from '../lib/catalog-quality';
import { lintIconRecord } from '../lib/svg/validateIconSystem';

const catalog = catalogData as Icon[];

function runTests() {
  console.log('🧪 Running Icon Catalog Quality & SVG Consistency Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const targetIds = ['database', 'development', 'system', 'user'];

  for (const id of targetIds) {
    console.log(`\n--- Validating Icon: [${id}] ---`);
    const icon = catalog.find((i) => i.id === id);

    assert(Boolean(icon), `Icon "${id}" exists in catalog`);
    if (!icon) continue;

    assert(icon.viewBox === '0 0 24 24', `Icon "${id}" has canonical 24×24 viewBox`);
    assert(Array.isArray(icon.variants) && icon.variants.length >= 2, `Icon "${id}" has full multi-variant suite (found ${icon.variants?.length})`);

    // Verify Regular Variant
    const regular = icon.variants.find((v) => v.style === 'regular');
    assert(Boolean(regular), `Icon "${id}" has a dedicated "regular" variant`);

    if (regular) {
      assert(regular.viewBox === '0 0 24 24', `Regular variant of "${id}" has 24×24 viewBox`);
      assert(regular.defaultStrokeWidth === 1.5, `Regular variant of "${id}" has 1.5px stroke standard`);
      
      const validation = validateSvgContent(regular.svg, regular.viewBox);
      assert(validation.isValid, `Regular variant SVG of "${id}" passes structural validation`);

      // Verify explicit round line caps & joins
      const hasRoundCaps = regular.svg.includes('stroke-linecap="round"');
      const hasRoundJoins = regular.svg.includes('stroke-linejoin="round"');
      assert(hasRoundCaps && hasRoundJoins, `Regular variant of "${id}" adheres to canonical round caps and joins`);
    }

    // Verify System Lint
    const lintResult = lintIconRecord(icon);
    assert(lintResult.isValid, `Icon "${id}" passes comprehensive system linter (score: ${lintResult.score}/100)`);
    if (lintResult.errors.length > 0) {
      console.error(`    Linter errors:`, lintResult.errors);
    }
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
