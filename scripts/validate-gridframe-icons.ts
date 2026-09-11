/**
 * GRIDFRAME Native Icon Validation & Quality Assurance Suite
 * 
 * Verifies that all Golden Library icon concepts adhere to the canonical specifications:
 * - Exactly 5 canonical variants (Light, Regular, Filled, Duotone, Duotone Line)
 * - 24×24 viewBox on every variant
 * - Safe zone compliance [1, 23]
 * - Non-empty geometry & clean coordinates
 * - Proper lowercase kebab-case naming
 * - Complete metadata (tags, aliases, categories, use cases)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Icon, CanonicalIconVariant } from '../src/types/icon';
import { validateSvg } from '../src/lib/svg/validateSvg';
import { analyzePathTopology } from '../src/lib/svg/pathTopology';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

const CANONICAL_VARIANTS: CanonicalIconVariant[] = ['light', 'regular', 'filled', 'duotone', 'duotone-line'];

export function validateGridframeIcons() {
  console.log('🔍 Starting GRIDFRAME Native Icon Quality & Compliance Audit...\n');

  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`❌ Catalog not found at ${CATALOG_PATH}. Run build-gridframe-catalog.ts first.`);
    process.exit(1);
  }

  const catalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  console.log(`📦 Auditing ${catalog.length} icon concepts (${catalog.length * 5} vector variants)...\n`);

  let hardErrors = 0;
  let warnings = 0;
  let totalVariantsChecked = 0;

  const slugSet = new Set<string>();

  for (const icon of catalog) {
    // 1. Slug Naming Check
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(icon.slug)) {
      console.error(`  [ERROR] ${icon.slug}: Invalid slug format (must be lowercase-kebab-case).`);
      hardErrors++;
    }

    if (slugSet.has(icon.slug)) {
      console.error(`  [ERROR] ${icon.slug}: Duplicate concept slug detected.`);
      hardErrors++;
    }
    slugSet.add(icon.slug);

    // 2. Metadata completeness
    if (!icon.name || !icon.category || !icon.family) {
      console.error(`  [ERROR] ${icon.slug}: Missing mandatory metadata fields (name/category/family).`);
      hardErrors++;
    }

    if (!icon.tags || icon.tags.length < 2) {
      console.warn(`  [WARNING] ${icon.slug}: Sparse tags list (< 2 tags).`);
      warnings++;
    }

    if (!icon.useCases || icon.useCases.length === 0) {
      console.warn(`  [WARNING] ${icon.slug}: Missing UI use cases.`);
      warnings++;
    }

    // 3. Exactly 5 Canonical Variants
    if (icon.variants.length !== 5) {
      console.error(`  [ERROR] ${icon.slug}: Expected exactly 5 variants, got ${icon.variants.length}.`);
      hardErrors++;
    }

    const presentStyles = new Set(icon.variants.map((v) => v.style));
    for (const st of CANONICAL_VARIANTS) {
      if (!presentStyles.has(st)) {
        console.error(`  [ERROR] ${icon.slug}: Missing canonical variant '${st}'.`);
        hardErrors++;
      }
    }

    // 4. Variant Geometry & SVG Validation
    for (const v of icon.variants) {
      totalVariantsChecked++;

      // ViewBox check
      if (v.viewBox !== '0 0 24 24') {
        console.error(`  [ERROR] ${icon.slug} [${v.style}]: Invalid viewBox '${v.viewBox}' (must be '0 0 24 24').`);
        hardErrors++;
      }

      // SVG validity
      const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${v.svg}</svg>`;
      const svgVal = validateSvg(fullSvg);
      if (!svgVal.isValid) {
        console.error(`  [ERROR] ${icon.slug} [${v.style}]: Invalid SVG markup: ${svgVal.errors.join(', ')}`);
        hardErrors++;
      }

      // Topology check
      const topo = analyzePathTopology(v.svg);
      for (const issue of topo.issues) {
        console.error(`  [ERROR] ${icon.slug} [${v.style}]: Topology issue: ${issue}`);
        hardErrors++;
      }

      // Duotone structure check
      if (v.style === 'duotone' && !v.svg.includes('opacity="0.2"') && !v.svg.includes('opacity="0.25"') && !v.svg.includes('opacity="0.3"')) {
        console.warn(`  [WARNING] ${icon.slug} [duotone]: Missing subordinate opacity fill layer.`);
        warnings++;
      }
    }
  }

  console.log('\n======================================================');
  console.log('          GRIDFRAME NATIVE QA REPORT');
  console.log('======================================================');
  console.log(`Total Concepts Audited:   ${catalog.length}`);
  console.log(`Total Variants Audited:   ${totalVariantsChecked}`);
  console.log(`Hard Errors:              ${hardErrors}`);
  console.log(`Warnings:                 ${warnings}`);
  console.log('======================================================\n');

  if (hardErrors > 0) {
    console.error(`❌ QA AUDIT FAILED: ${hardErrors} errors detected.`);
    process.exit(1);
  } else {
    console.log('✅ QA AUDIT PASSED: 100% of Golden Library concepts meet GRIDFRAME standards!\n');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateGridframeIcons();
}
