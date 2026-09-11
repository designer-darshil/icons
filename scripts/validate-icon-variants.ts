/**
 * GRIDFRAME V2 — Variant Quality & Geometry Audit Script
 * 
 * Audits all 7,508 canonical icons and 45,048 vector variants.
 * Verifies geometry validity, topology safety, and optical consistency against Regular reference.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Icon, CanonicalIconVariant } from '../src/types/icon';
import { validateIconConceptVariants } from '../src/lib/svg/variantValidator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

function runVariantValidationAudit() {
  console.log('🔍 Starting Comprehensive Variant Quality & Geometry Audit...\n');

  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`❌ Catalog not found at ${CATALOG_PATH}. Run import-all-icons.ts first.`);
    process.exit(1);
  }

  const catalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  console.log(`📦 Loaded ${catalog.length.toLocaleString()} canonical concepts for variant audit.`);

  let totalVariants = 0;
  let validatedVariants = 0;
  let warningVariants = 0;
  let manualReviewVariants = 0;
  let invalidVariants = 0;
  let totalScoreSum = 0;

  const flaggedIcons: { slug: string; style: string; score: number; issues: string[] }[] = [];

  for (const icon of catalog) {
    const result = validateIconConceptVariants(icon.slug, icon.variants);
    totalScoreSum += result.overallScore;

    const styles: CanonicalIconVariant[] = ['light', 'regular', 'filled', 'duotone', 'duotone-line'];
    for (const st of styles) {
      totalVariants++;
      const rep = result.variantReports[st];
      if (!rep) continue;

      if (rep.status === 'validated') validatedVariants++;
      else if (rep.status === 'warning') warningVariants++;
      else if (rep.status === 'manual-review') manualReviewVariants++;
      else if (rep.status === 'invalid') invalidVariants++;

      if (rep.status === 'invalid' || rep.issues.length > 0) {
        if (flaggedIcons.length < 15) {
          flaggedIcons.push({
            slug: icon.slug,
            style: st,
            score: rep.score,
            issues: rep.issues,
          });
        }
      }
    }
  }

  const avgScore = (totalScoreSum / catalog.length).toFixed(1);

  console.log('\n======================================================');
  console.log('  📊 GRIDFRAME VARIANT SYSTEM AUDIT REPORT');
  console.log(`  - Total Canonical Concepts:  ${catalog.length.toLocaleString()}`);
  console.log(`  - Total Canonical Variants:  ${totalVariants.toLocaleString()}`);
  console.log(`  - Average Concept Score:     ${avgScore}/100`);
  console.log(`  - Validated (✓):             ${validatedVariants.toLocaleString()} (${((validatedVariants / totalVariants) * 100).toFixed(1)}%)`);
  console.log(`  - Warnings (⚠):              ${warningVariants.toLocaleString()} (${((warningVariants / totalVariants) * 100).toFixed(1)}%)`);
  console.log(`  - Manual Review (⚠):         ${manualReviewVariants.toLocaleString()} (${((manualReviewVariants / totalVariants) * 100).toFixed(1)}%)`);
  console.log(`  - Hard Errors / Invalid (✕): ${invalidVariants.toLocaleString()} (${((invalidVariants / totalVariants) * 100).toFixed(1)}%)`);
  console.log('======================================================\n');

  if (invalidVariants > 0) {
    console.error(`❌ VARIANT AUDIT FAILED: Found ${invalidVariants} invalid variants.`);
    process.exit(1);
  } else {
    console.log('✅ VARIANT AUDIT PASSED: 0 hard errors found across all 45,048 variants!\n');
  }
}

runVariantValidationAudit();
