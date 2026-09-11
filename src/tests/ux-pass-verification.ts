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
console.log(`  ✓ Style "filled" matches ${filledIcons.length} of ${GRIDFRAME_ICONS.length} icons with true source artwork`);
if (filledIcons.length === 0) {
  throw new Error('Expected solid/filled icons in catalog');
}

// 2.3 Style filter "regular"
const regularIcons = GRIDFRAME_ICONS.filter((i) => i.variants.some((v) => v.style === 'regular'));
console.log(`  ✓ Style "regular" matches ${regularIcons.length} of ${GRIDFRAME_ICONS.length} icons\n`);

// TEST 3: Icon Data Model Integrity
console.log('--- TEST 3: Icon Data Model Integrity ---');
for (const icon of GRIDFRAME_ICONS) {
  if (!icon.slug || !icon.name || !icon.category) {
    throw new Error(`Icon missing required metadata: ${JSON.stringify(icon)}`);
  }
  if (icon.viewBox !== '0 0 24 24') {
    throw new Error(`Icon ${icon.slug} has invalid viewBox: ${icon.viewBox}`);
  }
  if (!icon.source || icon.source.id !== 'iconoir') {
    throw new Error(`Icon ${icon.slug} missing canonical source: iconoir`);
  }
  if (!icon.capabilities) {
    throw new Error(`Icon ${icon.slug} missing capabilities`);
  }
  if (!icon.variants || icon.variants.length === 0) {
    throw new Error(`Icon ${icon.slug} has no variants`);
  }
}
console.log(`✓ All ${GRIDFRAME_ICONS.length} icons strictly adhere to the canonical Iconoir 24×24 data model.\n`);

console.log(`======================================================`);
console.log(`🏆 ALL UX & DATA INTEGRITY VERIFICATION CHECKS PASSED!`);
console.log(`======================================================\n`);
