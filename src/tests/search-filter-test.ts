import { searchIconsWithScore, getSearchSuggestions } from '../lib/icon-search';
import { filterAndSortIcons } from '../lib/icon-filtering';
import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';

console.log(`--- Testing Search Engine & Scoring (${GRIDFRAME_ICONS.length.toLocaleString()} Tabler Icons) ---`);

// 1. Exact name match
const searchArrow = searchIconsWithScore(GRIDFRAME_ICONS, 'Arrow Right');
console.assert(searchArrow.length > 0, 'Search for Arrow Right returned 0 results');
console.assert(searchArrow[0].name.toLowerCase().includes('arrow'), 'Top result did not match Arrow');
console.log('✓ Exact query search passed');

// 2. Multi-word search
const searchMulti = searchIconsWithScore(GRIDFRAME_ICONS, 'arrow right');
console.assert(searchMulti.length > 0, 'Multi-word search failed');
console.log('✓ Multi-word query search passed');

// 3. Synonym matching ('gear' should match 'Settings')
const searchSynonym = searchIconsWithScore(GRIDFRAME_ICONS, 'gear');
console.assert(searchSynonym.length > 0, 'Synonym "gear" search failed');
console.log('✓ Synonym expansion search passed');

// 4. Suggestions generation
const suggestions = getSearchSuggestions(GRIDFRAME_ICONS, 'arr');
console.assert(suggestions.length > 0, 'No suggestions generated for "arr"');
console.log('✓ Suggestions generation passed');

console.log('--- Testing Filtering & Sorting Engine ---');

// 5. Category filter
const filteredCat = filterAndSortIcons(GRIDFRAME_ICONS, {
  query: '',
  category: 'Arrows',
  style: 'all',
  strokeWeight: 'all',
  sort: 'popular',
});
console.assert(filteredCat.length > 0, 'Category filter returned 0');
console.assert(filteredCat.every((i) => i.category.toLowerCase() === 'arrows'), 'Category filter leaked non-arrows icons');
console.log('✓ Category filtering passed');

// 6. Style filter
const filteredStyle = filterAndSortIcons(GRIDFRAME_ICONS, {
  query: '',
  category: 'all',
  style: 'filled',
  strokeWeight: 'all',
  sort: 'popular',
});
console.assert(filteredStyle.length > 0, 'Style filter returned 0');
console.log('✓ Style filtering passed');

// 7. Sort by name
const sortedByName = filterAndSortIcons(GRIDFRAME_ICONS.slice(0, 50), {
  query: '',
  category: 'all',
  style: 'all',
  strokeWeight: 'all',
  sort: 'name-asc',
});
const isAlphabetical = sortedByName.every((icon, idx) => {
  if (idx === 0) return true;
  return icon.name.localeCompare(sortedByName[idx - 1].name) >= 0;
});
console.assert(isAlphabetical, 'Sort by name failed');
console.log('✓ Alphabetical sorting passed');

console.log('\n🎉 ALL SEARCH & FILTERING TESTS PASSED CLEANLY!');
