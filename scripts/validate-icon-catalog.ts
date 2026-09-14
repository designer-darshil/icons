/**
 * Gridframe V2 Iconoir Catalog Comprehensive Validator
 * Validates integrity, security, viewBox compliance, deduplication, taxonomy, capabilities, and relations.
 */

import fs from 'fs';
import path from 'path';
import { validateSvg } from '../src/lib/svg/validateSvg';
import type { Icon } from '../src/types/icon';

const CATALOG_PATH = path.resolve('src/data/icons/catalog.json');

export function validateIconCatalog(): boolean {
  console.log('🔍 Starting Comprehensive Gridframe Catalog Validation...');

  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌ Catalog file not found at:', CATALOG_PATH);
    return false;
  }

  const rawData = fs.readFileSync(CATALOG_PATH, 'utf8');
  let icons: Icon[] = [];

  try {
    icons = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Failed to parse catalog.json:', err);
    return false;
  }

  console.log(`📊 Validating ${icons.length.toLocaleString()} icon concepts in catalog...`);

  let errorCount = 0;
  let warningCount = 0;

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const allSlugs = new Set(icons.map((i) => i.slug));

  for (let idx = 0; idx < icons.length; idx++) {
    const icon = icons[idx];
    const prefix = `[#${idx + 1} ${icon.slug || icon.id || 'unknown'}]`;

    // 1. ID & Slug validation & deduplication
    if (!icon.id) {
      console.error(`❌ ${prefix} Missing icon.id`);
      errorCount++;
    } else if (seenIds.has(icon.id)) {
      console.error(`❌ ${prefix} Duplicate icon.id detected: ${icon.id}`);
      errorCount++;
    } else {
      seenIds.add(icon.id);
    }

    if (!icon.slug) {
      console.error(`❌ ${prefix} Missing icon.slug`);
      errorCount++;
    } else if (seenSlugs.has(icon.slug)) {
      console.error(`❌ ${prefix} Duplicate icon.slug detected: ${icon.slug}`);
      errorCount++;
    } else {
      seenSlugs.add(icon.slug);
    }

    // 2. Name validation
    if (!icon.name || icon.name.trim().length === 0) {
      console.error(`❌ ${prefix} Missing or empty icon.name`);
      errorCount++;
    }

    // 3. Category & Family validation
    if (!icon.category || icon.category.trim().length === 0) {
      console.error(`❌ ${prefix} Missing icon.category`);
      errorCount++;
    }
    if (!icon.familyId && !icon.family) {
      console.error(`❌ ${prefix} Missing icon.familyId`);
      errorCount++;
    }

    // 4. ViewBox validation (must be 0 0 24 24)
    if (icon.viewBox !== '0 0 24 24') {
      console.error(`❌ ${prefix} Invalid root viewBox: "${icon.viewBox}" (expected "0 0 24 24")`);
      errorCount++;
    }

    // 5. SVG validation & Security
    if (!icon.svg || icon.svg.trim().length === 0) {
      console.error(`❌ ${prefix} Missing or empty icon.svg`);
      errorCount++;
    } else {
      const fullSvg = `<svg viewBox="${icon.viewBox}">${icon.svg}</svg>`;
      const val = validateSvg(fullSvg);
      if (!val.isValid) {
        console.error(`❌ ${prefix} SVG validation errors:`, val.errors);
        errorCount += val.errors.length;
      }
      if (val.warnings.length > 0) {
        console.warn(`⚠️ ${prefix} SVG warnings:`, val.warnings);
        warningCount += val.warnings.length;
      }
    }

    // 6. Variants validation
    if (!icon.variants || icon.variants.length === 0) {
      console.error(`❌ ${prefix} Icon has no variants defined`);
      errorCount++;
    } else {
      for (const variant of icon.variants) {
        if (!variant.id) {
          console.error(`❌ ${prefix} Variant missing id`);
          errorCount++;
        }
        if (!variant.style) {
          console.error(`❌ ${prefix} Variant ${variant.id} missing style`);
          errorCount++;
        }
        if (variant.viewBox !== '0 0 24 24') {
          console.error(`❌ ${prefix} Variant ${variant.id} has invalid viewBox: "${variant.viewBox}"`);
          errorCount++;
        }
        if (!variant.capabilities) {
          console.error(`❌ ${prefix} Variant ${variant.id} missing capabilities metadata`);
          errorCount++;
        }
        if (!variant.svg || variant.svg.trim().length === 0) {
          console.error(`❌ ${prefix} Variant ${variant.id} has empty svg`);
          errorCount++;
        }
      }
    }

    // 7. Capabilities validation
    if (!icon.capabilities) {
      console.error(`❌ ${prefix} Missing root capabilities metadata`);
      errorCount++;
    }

    // 8. Tags & Keywords validation
    if (!Array.isArray(icon.tags) || icon.tags.length === 0) {
      console.warn(`⚠️ ${prefix} Icon has empty or invalid tags array`);
      warningCount++;
    }
    if (!Array.isArray(icon.keywords) || icon.keywords.length === 0) {
      console.warn(`⚠️ ${prefix} Icon has empty or invalid keywords array`);
      warningCount++;
    }

    // 9. Source metadata validation
    if (!icon.source || !icon.source.id) {
      console.error(`❌ ${prefix} Invalid or missing source metadata`);
      errorCount++;
    }

    // 10. Related icons reference validation
    if (Array.isArray(icon.relatedIconIds)) {
      for (const relId of icon.relatedIconIds) {
        if (!allSlugs.has(relId)) {
          console.warn(`⚠️ ${prefix} Broken related icon ID reference: "${relId}"`);
          warningCount++;
        }
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (errorCount === 0) {
    console.log(`✅ ALL ${icons.length.toLocaleString()} ICONS PASSED VALIDATION PERFECTLY!`);
    console.log(`✔ 0 critical errors`);
    console.log(`✔ ${warningCount} minor warnings`);
    console.log(`✔ 100% 24×24 viewBox compliance`);
    console.log(`✔ 100% unique IDs and slugs`);
    console.log(`✔ 100% sanitized and safe SVG`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return true;
  } else {
    console.error(`❌ VALIDATION FAILED with ${errorCount} errors and ${warningCount} warnings.`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return false;
  }
}

// Auto-run if executed directly
const success = validateIconCatalog();
if (!success) {
  process.exit(1);
}
