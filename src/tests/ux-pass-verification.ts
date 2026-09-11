import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { ICON_CATEGORIES, getCategoryCounts } from '../data/categories';
import { searchIconsWithScore } from '../lib/icon-search';

console.log(`\n======================================================`);
console.log(`🧪 RUNNING UX PASS & DATA INTEGRITY VERIFICATION SUITE`);
console.log(`======================================================\n`);

// TEST 1: Category Count Consistency
console.log('--- TEST 1: Category Data Integrity & Dynamic Counts ---');
const counts = getCategoryCounts(GRIDFRAME_ICONS);
let totalCategoryIcons = 0;

for (const cat of ICON_CATEGORIES) {
  const directFilterCount = GRIDFRAME_ICONS.filter(
    (i) => i.category.toLowerCase() === cat.id.toLowerCase()
  ).length;

  if (cat.count !== directFilterCount) {
    throw new Error(`Category mismatch for ${cat.name}: expected ${directFilterCount}, got ${cat.count}`);
  }
  if (counts[cat.id] !== directFilterCount) {
    throw new Error(`Counts helper mismatch for ${cat.name}: expected ${directFilterCount}, got ${counts[cat.id]}`);
  }
  totalCategoryIcons += cat.count;
  console.log(`  ✓ Category [${cat.name}]: ${cat.count} concepts verified`);
}

if (totalCategoryIcons !== GRIDFRAME_ICONS.length) {
  throw new Error(`Total category count (${totalCategoryIcons}) does not match catalog length (${GRIDFRAME_ICONS.length})`);
}
console.log(`✓ All ${ICON_CATEGORIES.length} categories perfectly match the ${GRIDFRAME_ICONS.length} catalog items.\n`);

// TEST 2: Filter & Search Intersection
console.log('--- TEST 2: Filter and Search Interaction ---');
// 2.1 Search "arrow" + Category "Arrows"
const arrowSearch = searchIconsWithScore(GRIDFRAME_ICONS, 'arrow');
const arrowCategory = arrowSearch.filter((i) => i.category.toLowerCase() === 'arrows');
console.log(`  ✓ Search "arrow" returned ${arrowSearch.length} results, ${arrowCategory.length} in Arrows category`);
if (arrowCategory.length === 0) {
  throw new Error('Expected at least 1 arrow icon matching search "arrow" in Arrows category');
}

// 2.2 Style filter "filled"
const filledIcons = GRIDFRAME_ICONS.filter((i) => i.variants.some((v) => v.style === 'filled'));
console.log(`  ✓ Style "filled" matches ${filledIcons.length} of ${GRIDFRAME_ICONS.length} icons`);
if (filledIcons.length !== GRIDFRAME_ICONS.length) {
  throw new Error(`Expected all golden icons to have 'filled' variant, found ${filledIcons.length}`);
}

// 2.3 Style filter "light"
const lightIcons = GRIDFRAME_ICONS.filter((i) => i.variants.some((v) => v.style === 'light'));
console.log(`  ✓ Style "light" matches ${lightIcons.length} of ${GRIDFRAME_ICONS.length} icons`);

// 2.4 Style filter "duotone"
const duotoneIcons = GRIDFRAME_ICONS.filter((i) => i.variants.some((v) => v.style === 'duotone'));
console.log(`  ✓ Style "duotone" matches ${duotoneIcons.length} of ${GRIDFRAME_ICONS.length} icons`);

// 2.5 Style filter "duotone-line"
const duotoneLineIcons = GRIDFRAME_ICONS.filter((i) => i.variants.some((v) => v.style === 'duotone-line'));
console.log(`  ✓ Style "duotone-line" matches ${duotoneLineIcons.length} of ${GRIDFRAME_ICONS.length} icons\n`);

// TEST 3: All 50 Icons Variant Quality & Slugs
console.log('--- TEST 3: Icon Data Model Integrity ---');
const requiredStyles = ['light', 'regular', 'filled', 'duotone', 'duotone-line'];
for (const icon of GRIDFRAME_ICONS) {
  if (!icon.slug || !icon.name || !icon.category) {
    throw new Error(`Icon missing required metadata: ${JSON.stringify(icon)}`);
  }
  for (const st of requiredStyles) {
    const hasVariant = icon.variants.some((v) => v.style === st);
    if (!hasVariant) {
      throw new Error(`Icon ${icon.slug} missing variant style: ${st}`);
    }
  }
}
console.log(`✓ All ${GRIDFRAME_ICONS.length} icons contain all 5 canonical variant styles (light, regular, filled, duotone, duotone-line).\n`);

console.log(`======================================================`);
console.log(`🏆 ALL UX & DATA INTEGRITY VERIFICATION CHECKS PASSED!`);
console.log(`======================================================\n`);
