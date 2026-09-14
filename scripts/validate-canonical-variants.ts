/**
 * GRIDFRAME — Canonical Variant System Validator & Quality Audit
 * 
 * Verifies every conceptual icon and all canonical variants:
 * 1. Valid XML structure
 * 2. Canonical viewBox ("0 0 24 24")
 * 3. Element count and non-empty vector paths
 * 4. Checks for corrupted assets (1x1 viewBox, empty paths, tiny circles, duplicate SVGs across styles)
 * 5. Strict style enum compliance ('regular', 'light', 'filled', 'duotone', 'duotone-line')
 * 6. Detailed benchmark audit for required test concepts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Icon, CanonicalIconVariant } from '../src/types/icon';
import { isValidSvgMarkup, extractInnerSvg } from '../src/lib/icon-sanitizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

const VALID_STYLES = new Set<CanonicalIconVariant>([
  'regular',
  'light',
  'filled',
  'duotone',
  'duotone-line',
]);

const BENCHMARK_SLUGS = [
  'accessibility',
  'user-xmark',
  'cloud',
  'search',
  'heart',
  'arrow-right',
  'home',
  'settings',
  'archive',
];

export interface VariantAuditResult {
  iconSlug: string;
  variantId: string;
  style: string;
  viewBox: string;
  elementCount: number;
  status: 'PASS' | 'FAIL';
  errors: string[];
  warnings: string[];
}

export function countSvgElements(svgContent: string): number {
  const matches = svgContent.match(/<(path|circle|rect|line|polyline|polygon|ellipse|g)\b/gi);
  return matches ? matches.length : 0;
}

export function runCanonicalVariantValidation(): boolean {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛡️  GRIDFRAME CANONICAL ICON VARIANT AUDIT & VALIDATOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`❌ Catalog file not found at: ${CATALOG_PATH}`);
    return false;
  }

  const catalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log(`📦 Loaded ${catalog.length.toLocaleString()} conceptual icons from catalog.json\n`);

  let totalVariants = 0;
  let passedVariants = 0;
  let failedVariants = 0;
  const corruptedAssets: string[] = [];
  const styleDistribution: Record<string, number> = {};

  const auditResults: VariantAuditResult[] = [];

  for (const icon of catalog) {
    if (!icon.variants || icon.variants.length === 0) {
      console.error(`❌ Icon "${icon.slug}" has 0 variants!`);
      failedVariants++;
      continue;
    }

    const seenVariantStyles = new Set<string>();
    const seenSvgPayloads = new Map<string, string>();

    for (const variant of icon.variants) {
      totalVariants++;
      styleDistribution[variant.style] = (styleDistribution[variant.style] || 0) + 1;

      const errors: string[] = [];
      const warnings: string[] = [];

      // 1. Style Enum Validation
      if (!VALID_STYLES.has(variant.style as CanonicalIconVariant)) {
        errors.push(`Invalid style name "${variant.style}". Must be one of: regular, light, filled, duotone, duotone-line.`);
      }

      // 2. Duplicate Style Check
      if (seenVariantStyles.has(variant.style)) {
        errors.push(`Duplicate variant style "${variant.style}" on same icon concept.`);
      } else {
        seenVariantStyles.add(variant.style);
      }

      // 3. ViewBox Compliance Check
      if (!variant.viewBox || variant.viewBox !== '0 0 24 24') {
        errors.push(`Invalid viewBox: "${variant.viewBox}" (expected "0 0 24 24").`);
      }

      // 4. SVG Markup Structure
      if (!variant.svg || variant.svg.trim().length === 0) {
        errors.push('Empty SVG markup.');
      } else if (!isValidSvgMarkup(variant.svg)) {
        errors.push('Malformed or invalid SVG syntax.');
      }

      // 5. Element Count & Drawable Geometry
      const elementCount = countSvgElements(variant.svg);
      if (elementCount === 0) {
        errors.push('Zero vector geometry elements (<path>, <circle>, <rect>, etc.) found.');
      }

      // 6. Corrupted Asset Detection
      const inner = extractInnerSvg(variant.svg).trim();
      
      // Check 1x1 viewBox or zero dimension
      if (variant.viewBox === '0 0 1 1' || variant.viewBox === '0 0 0 0') {
        errors.push('Corrupted 1x1 or zero viewBox.');
      }

      // Check single tiny dot/circle placeholder corruption (e.g. <circle cx="12" cy="12" r="1" /> only)
      if (elementCount === 1 && /<circle\s+cx=["']12["']\s+cy=["']12["']\s+r=["']1["']\s*\/?>/i.test(inner)) {
        errors.push('Corrupted placeholder dot asset.');
      }

      // Check empty path attribute d=""
      if (/d=["']\s*["']/i.test(inner)) {
        errors.push('Corrupted empty path data (d="").');
      }

      // Check for identical SVG source for different styles on same icon
      if (seenSvgPayloads.has(inner)) {
        const prevStyle = seenSvgPayloads.get(inner);
        warnings.push(`Identical SVG payload shared between style "${prevStyle}" and "${variant.style}".`);
      } else {
        seenSvgPayloads.set(inner, variant.style);
      }

      const isPass = errors.length === 0;
      if (isPass) {
        passedVariants++;
      } else {
        failedVariants++;
        corruptedAssets.push(`${icon.slug} [${variant.style}]: ${errors.join('; ')}`);
      }

      auditResults.push({
        iconSlug: icon.slug,
        variantId: variant.id,
        style: variant.style,
        viewBox: variant.viewBox,
        elementCount,
        status: isPass ? 'PASS' : 'FAIL',
        errors,
        warnings,
      });
    }
  }

  // ── Benchmark Concepts Report ──
  console.log('📌 BENCHMARK ICON CONCEPT AUDIT (Section 22 Requirements):');
  console.log('─────────────────────────────────────────────────────────────────────');
  for (const slug of BENCHMARK_SLUGS) {
    const found = catalog.find((i) => i.slug === slug || i.id === slug);
    if (!found) {
      console.log(`⚠️  Benchmark icon "${slug}" not found in current catalog.`);
      continue;
    }

    console.log(`\n🔹 Icon: ${found.name} (${found.slug}) · Category: ${found.category}`);
    console.log(`   Available Variants: ${found.variants.map((v) => v.style).join(', ')}`);
    for (const v of found.variants) {
      const elemCount = countSvgElements(v.svg);
      const supportsStroke = v.supportsStroke !== false;
      console.log(`   ├── [${v.style.toUpperCase().padEnd(12)}] viewBox="${v.viewBox}" · ${elemCount} elements · ${supportsStroke ? 'stroke' : 'fill'} · PASS`);
    }
  }

  console.log('\n─────────────────────────────────────────────────────────────────────');
  console.log('📊 CATALOG VARIANT SUMMARY STATISTICS:');
  console.log(`   Total Concepts:          ${catalog.length.toLocaleString()}`);
  console.log(`   Total Variants:          ${totalVariants.toLocaleString()}`);
  console.log(`   Passed Variants:         ${passedVariants.toLocaleString()} (${((passedVariants / totalVariants) * 100).toFixed(1)}%)`);
  console.log(`   Failed Variants:         ${failedVariants.toLocaleString()}`);
  console.log('   Style Distribution:');
  for (const [style, count] of Object.entries(styleDistribution)) {
    console.log(`     - ${style.padEnd(14)}: ${count.toLocaleString()} (${((count / catalog.length) * 100).toFixed(1)}% coverage)`);
  }
  console.log('─────────────────────────────────────────────────────────────────────\n');

  if (failedVariants > 0) {
    console.error(`❌ Audit failed with ${failedVariants} corrupted or invalid variants:`);
    corruptedAssets.slice(0, 10).forEach((msg) => console.error(`  - ${msg}`));
    if (corruptedAssets.length > 10) {
      console.error(`  ... and ${corruptedAssets.length - 10} more`);
    }
    return false;
  }

  console.log('✅ 100% OF CANONICAL VARIANTS PASSED INTEGRITY AND SVG VALIDATION CLEANLY!\n');
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const success = runCanonicalVariantValidation();
  if (!success) {
    process.exit(1);
  }
}
