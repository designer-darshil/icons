/**
 * Tabler Catalog Validation Script for Gridframe V2
 * Validates 100% of icon records for integrity, security, and schema correctness.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Icon } from '../src/types/icon';
import { validateSvg } from '../src/lib/svg/validateSvg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_JSON_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

function validateCatalog() {
  console.log('🔍 Starting Tabler Catalog Validation Suite...\n');

  if (!fs.existsSync(CATALOG_JSON_PATH)) {
    console.error('❌ Error: catalog.json not found. Run scripts/import-tabler-icons.ts first.');
    process.exit(1);
  }

  const catalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_JSON_PATH, 'utf-8'));
  console.log(`Auditing ${catalog.length} icon concepts...`);

  const idSet = new Set<string>();
  const slugSet = new Set<string>();

  let totalErrors = 0;
  let totalWarnings = 0;

  for (let i = 0; i < catalog.length; i++) {
    const icon = catalog[i];
    const prefix = `[#${i + 1} ${icon.slug || icon.id}]`;

    // 1. Check ID and Slug uniqueness
    if (!icon.id || typeof icon.id !== 'string') {
      console.error(`${prefix} Invalid or missing id`);
      totalErrors++;
    } else if (idSet.has(icon.id)) {
      console.error(`${prefix} Duplicate id found: ${icon.id}`);
      totalErrors++;
    } else {
      idSet.add(icon.id);
    }

    if (!icon.slug || typeof icon.slug !== 'string') {
      console.error(`${prefix} Invalid or missing slug`);
      totalErrors++;
    } else if (slugSet.has(icon.slug)) {
      console.error(`${prefix} Duplicate slug found: ${icon.slug}`);
      totalErrors++;
    } else {
      slugSet.add(icon.slug);
    }

    // 2. Check Name & Category
    if (!icon.name) {
      console.error(`${prefix} Missing name`);
      totalErrors++;
    }
    if (!icon.category) {
      console.error(`${prefix} Missing category`);
      totalErrors++;
    }

    // 3. Check ViewBox & Design Grid
    if (icon.viewBox !== '0 0 24 24') {
      console.warn(`${prefix} Non-standard viewBox: ${icon.viewBox}`);
      totalWarnings++;
    }

    // 4. Check Variants
    if (!Array.isArray(icon.variants) || icon.variants.length === 0) {
      console.error(`${prefix} Missing or empty variants array`);
      totalErrors++;
    } else {
      for (const variant of icon.variants) {
        if (!variant.id || !variant.style || !variant.svg) {
          console.error(`${prefix} Malformed variant: ${variant.id}`);
          totalErrors++;
        }

        // SVG Validation
        const svgCheck = validateSvg(`<svg>${variant.svg}</svg>`);
        if (!svgCheck.isValid) {
          console.error(`${prefix} Variant SVG validation failed:`, svgCheck.errors);
          totalErrors++;
        }
        if (svgCheck.warnings.length > 0) {
          totalWarnings++;
        }
      }
    }

    // 5. Check Capabilities
    if (!icon.capabilities || typeof icon.capabilities.color !== 'boolean' || typeof icon.capabilities.size !== 'boolean') {
      console.error(`${prefix} Missing or malformed capabilities`);
      totalErrors++;
    }

    // 6. Check Source
    if (!icon.source || icon.source.id !== 'tabler' || !icon.source.version) {
      console.error(`${prefix} Missing or malformed source metadata`);
      totalErrors++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`           CATALOG VALIDATION RESULTS`);
  console.log(`======================================================`);
  console.log(`Total Icons Audited:  ${catalog.length}`);
  console.log(`Unique IDs Verified:  ${idSet.size}`);
  console.log(`Errors Found:         ${totalErrors}`);
  console.log(`Warnings Found:       ${totalWarnings}`);
  console.log(`======================================================`);

  if (totalErrors > 0) {
    console.error('❌ Validation failed with errors.');
    process.exit(1);
  } else {
    console.log('🎉 100% OF TABLER CATALOG RECORDS PASSED ALL INTEGRITY CHECKS!');
  }
}

validateCatalog();
