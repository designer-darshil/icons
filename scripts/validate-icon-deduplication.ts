import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconVariant {
  id: string;
  style: string;
  svg: string;
  viewBox: string;
  capabilities?: {
    strokeWidth: boolean;
    currentColor: boolean;
    fillRule?: string;
  };
}

interface Icon {
  id: string;
  name: string;
  slug: string;
  familyId?: string;
  category: string;
  subcategory?: string;
  tags: string[];
  keywords: string[];
  style: string;
  variants: IconVariant[];
  defaultVariantId?: string;
  relatedIconIds?: string[];
  source?: {
    library: string;
    version: string;
    license: string;
    originalName?: string;
  };
  metadata?: {
    designer?: string;
    unicode?: string;
    popularity?: number;
    versionAdded?: string;
    gridSize?: number;
  };
  svg: string;
  viewBox: string;
}

const catalogPath = path.resolve(__dirname, '../src/data/icons/catalog.json');

if (!fs.existsSync(catalogPath)) {
  console.error(`❌ Catalog file not found at ${catalogPath}. Run import-all-icons.ts first.`);
  process.exit(1);
}

const catalog: Icon[] = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`\n======================================================`);
console.log(`🔍 GRIDFRAME ICON DEDUPLICATION VALIDATION SUITE`);
console.log(`======================================================\n`);

let errorsCount = 0;
let warningsCount = 0;

// 1. Check duplicate slugs & IDs
const seenSlugs = new Map<string, number>();
const seenIds = new Map<string, number>();
const seenNames = new Map<string, number>();
const seenFamilyIds = new Map<string, number>();

const suspiciousSuffixes = [
  '-linear', '-outline', '-regular', '-bold', '-fill', '-filled', 
  '-duotone', '-thin', '-light', '-solid', '-icon', '-2', '-3'
];

let suspiciousSuffixCount = 0;
let missingFamilyIdCount = 0;
let singleVariantCount = 0;
let variantCollisionsCount = 0;
let missingDefaultVariantCount = 0;
let totalVariants = 0;

catalog.forEach((icon, idx) => {
  // Slug tracking
  seenSlugs.set(icon.slug, (seenSlugs.get(icon.slug) || 0) + 1);
  seenIds.set(icon.id, (seenIds.get(icon.id) || 0) + 1);
  seenNames.set(icon.name.toLowerCase(), (seenNames.get(icon.name.toLowerCase()) || 0) + 1);

  if (icon.familyId) {
    seenFamilyIds.set(icon.familyId, (seenFamilyIds.get(icon.familyId) || 0) + 1);
  } else {
    missingFamilyIdCount++;
  }

  // Suspicious suffix check in concept slug
  for (const suf of suspiciousSuffixes) {
    // Only flag if it's at the end of the slug and not a legitimate modifier like circle-2
    if (icon.slug.endsWith(suf) && !['tabler-2', 'square-2'].includes(icon.slug)) {
      suspiciousSuffixCount++;
      break;
    }
  }

  // Variant checks
  if (!icon.variants || icon.variants.length === 0) {
    console.error(`❌ Concept "${icon.slug}" (ID: ${icon.id}) has NO variants!`);
    errorsCount++;
  } else {
    totalVariants += icon.variants.length;
    if (icon.variants.length === 1) {
      singleVariantCount++;
    }

    const variantStyles = new Set<string>();
    const variantIds = new Set<string>();

    icon.variants.forEach(v => {
      if (variantStyles.has(v.style)) {
        // Conflicting style labels inside same concept
        warningsCount++;
      }
      variantStyles.add(v.style);

      if (variantIds.has(v.id)) {
        console.error(`❌ Duplicate variant ID "${v.id}" in concept "${icon.slug}"`);
        variantCollisionsCount++;
        errorsCount++;
      }
      variantIds.add(v.id);
    });

    if (icon.defaultVariantId && !variantIds.has(icon.defaultVariantId)) {
      missingDefaultVariantCount++;
      errorsCount++;
    }
  }
});

// Calculate duplicate slugs
const duplicateSlugs = Array.from(seenSlugs.entries()).filter(([_, count]) => count > 1);
const duplicateIds = Array.from(seenIds.entries()).filter(([_, count]) => count > 1);

console.log(`📊 Catalog Statistics:`);
console.log(`   - Unique Canonical Concepts (Icons): ${catalog.length.toLocaleString()}`);
console.log(`   - Total Vector Variants:             ${totalVariants.toLocaleString()}`);
console.log(`   - Average Variants / Concept:        ${(totalVariants / catalog.length).toFixed(2)}`);
console.log(`   - Single-Variant Concepts:           ${singleVariantCount.toLocaleString()} (${((singleVariantCount / catalog.length) * 100).toFixed(1)}%)`);
console.log(`   - Multi-Variant Concepts:            ${(catalog.length - singleVariantCount).toLocaleString()} (${(((catalog.length - singleVariantCount) / catalog.length) * 100).toFixed(1)}%)\n`);

console.log(`🔎 Validation Checks:`);

if (duplicateSlugs.length === 0) {
  console.log(`   ✅ Duplicate Slugs: 0 (PASSED)`);
} else {
  console.log(`   ❌ Duplicate Slugs: ${duplicateSlugs.length} found!`);
  duplicateSlugs.slice(0, 5).forEach(([slug, count]) => console.log(`      - "${slug}": appears ${count} times`));
  errorsCount += duplicateSlugs.length;
}

if (duplicateIds.length === 0) {
  console.log(`   ✅ Duplicate Concept IDs: 0 (PASSED)`);
} else {
  console.log(`   ❌ Duplicate Concept IDs: ${duplicateIds.length} found!`);
  errorsCount += duplicateIds.length;
}

if (variantCollisionsCount === 0) {
  console.log(`   ✅ Variant Collisions: 0 (PASSED)`);
} else {
  console.log(`   ❌ Variant Collisions: ${variantCollisionsCount} found!`);
}

if (missingFamilyIdCount === 0) {
  console.log(`   ✅ Missing Family IDs: 0 (PASSED)`);
} else {
  console.log(`   ⚠️ Missing Family IDs: ${missingFamilyIdCount}`);
  warningsCount += missingFamilyIdCount;
}

if (missingDefaultVariantCount === 0) {
  console.log(`   ✅ Default Variant Integrity: 100% Valid (PASSED)`);
} else {
  console.log(`   ❌ Invalid Default Variant IDs: ${missingDefaultVariantCount}`);
}

console.log(`   ℹ️ Suspicious Suffix Slugs (e.g. -2, -icon): ${suspiciousSuffixCount}`);

console.log(`\n======================================================`);
if (errorsCount === 0) {
  console.log(`🎉 ALL VALIDATION CHECKS PASSED WITH 0 ERRORS!`);
  console.log(`The catalog adheres 100% to the Canonical Concept Model.`);
} else {
  console.error(`🚨 VALIDATION FAILED with ${errorsCount} error(s) and ${warningsCount} warning(s).`);
  process.exit(1);
}
console.log(`======================================================\n`);
