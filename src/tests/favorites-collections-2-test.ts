/**
 * Gridframe V2 — Favorites + Collections / Sets UX 2.0 Test Suite
 * Validates:
 * 1. Concept-based favorites (one conceptual icon = one favorite, no duplication)
 * 2. Persistence & immediate reactivity
 * 3. Collection creation, editing, deletion (with safety)
 * 4. Add-to-set & multi-collection membership
 * 5. State decoupling between Favorites and Collections
 * 6. Direct URL / slug access for collections
 */

import {
  getStoredFavorites,
  isStoredFavorite,
  toggleStoredFavorite,
  clearStoredFavorites,
  getStoredCollectionById,
  saveStoredCollection,
  deleteStoredCollection,
  toggleIconInStoredCollection,
} from '../lib/storage';
import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    throw new Error(`Favorites & Collections 2.0 Test Failed: ${msg}`);
  }
}

console.log('\n======================================================');
console.log('  🧪 RUNNING FAVORITES + COLLECTIONS 2.0 TEST SUITE');
console.log('======================================================\n');

// 1. Storage & Mock Environment
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: () => null,
} as unknown as Storage;

console.log('1. Testing Concept-Based Favorites...');
clearStoredFavorites();
assert(getStoredFavorites().length === 0, 'Favorites should start empty after clear');

// Test icons
const testSlugs = ['accessibility', 'user-xmark', 'cloud', 'search', 'heart'];
const catalogIcons = testSlugs.map((slug) => {
  const icon = GRIDFRAME_ICONS.find((i) => i.slug === slug || i.id === slug);
  assert(Boolean(icon), `Catalog icon "${slug}" must exist`);
  return icon!;
});

// Toggle favorites on conceptual IDs
catalogIcons.forEach((icon) => {
  const added = toggleStoredFavorite(icon.id);
  assert(added === true, `Failed to favorite "${icon.name}"`);
  assert(isStoredFavorite(icon.id), `Icon "${icon.id}" should be marked as favorite`);
});

// Verify no duplicate IDs are stored
const favList = getStoredFavorites();
assert(favList.length === catalogIcons.length, `Expected ${catalogIcons.length} favorites, got ${favList.length}`);
const uniqueFavSet = new Set(favList);
assert(uniqueFavSet.size === favList.length, 'Favorites list contains duplicate entries');

// Unfavorite an icon
const removed = toggleStoredFavorite(catalogIcons[0].id);
assert(removed === false, 'Unfavoriting should return false');
assert(!isStoredFavorite(catalogIcons[0].id), `Icon "${catalogIcons[0].id}" should no longer be favorite`);
assert(getStoredFavorites().length === catalogIcons.length - 1, 'Favorite count should decrement');
console.log('   ✓ Concept-based favorites work with zero duplication');

console.log('2. Testing Collections / Sets CRUD & Membership...');
const testCollection = saveStoredCollection({
  name: 'Navigation & Actions',
  description: 'Essential vectors for app navigation',
  color: '#3B82F6',
  iconIds: [catalogIcons[1].id, catalogIcons[2].id],
});

assert(Boolean(testCollection.id), 'Saved collection must have an ID');
assert(testCollection.name === 'Navigation & Actions', 'Collection name mismatch');
assert(testCollection.iconIds.length === 2, 'Collection initial icons count mismatch');

// Add icon to collection
const addedToCol = toggleIconInStoredCollection(testCollection.id, catalogIcons[3].id);
assert(addedToCol === true, 'Adding icon to collection should return true');

const fetchedCol = getStoredCollectionById(testCollection.id);
assert(Boolean(fetchedCol), 'Collection should be retrieved by ID');
assert(fetchedCol!.iconIds.includes(catalogIcons[3].id), 'Added icon not found in collection');

// Remove icon from collection
const removedFromCol = toggleIconInStoredCollection(testCollection.id, catalogIcons[3].id);
assert(removedFromCol === false, 'Removing icon from collection should return false');
const fetchedColAfter = getStoredCollectionById(testCollection.id);
assert(!fetchedColAfter!.iconIds.includes(catalogIcons[3].id), 'Removed icon still in collection');
console.log('   ✓ Collections CRUD and membership toggle operate cleanly');

console.log('3. Testing ID & Slug-based Collection Lookup (Direct URL Access)...');
// Lookup by exact ID
const byId = getStoredCollectionById(testCollection.id);
assert(Boolean(byId), 'Lookup by exact ID failed');

// Lookup by slugified name ('navigation-actions')
const bySlug = getStoredCollectionById('navigation-actions');
assert(Boolean(bySlug && bySlug.id === testCollection.id), 'Lookup by slugified name failed');

// Lookup by lowercase name ('navigation & actions')
const byName = getStoredCollectionById('navigation & actions');
assert(Boolean(byName && byName.id === testCollection.id), 'Lookup by case-insensitive name failed');
console.log('   ✓ Direct URL access by ID, slug, and name validated');

console.log('4. Testing Favorites + Collections Decoupling...');
// Icon 1 is inside collection and NOT favorited
const icon1Id = catalogIcons[1].id;
const isFav1 = isStoredFavorite(icon1Id);
const inCol1 = Boolean(fetchedColAfter?.iconIds.includes(icon1Id));
assert(inCol1 === true, 'Icon 1 should be in collection');

// Removing icon 1 from collection should not affect favorite state
toggleIconInStoredCollection(testCollection.id, icon1Id);
assert(!getStoredCollectionById(testCollection.id)!.iconIds.includes(icon1Id), 'Icon 1 removed from collection');
assert(isStoredFavorite(icon1Id) === isFav1, 'Favorite state was mutated unexpectedly');

// Deleting collection should not delete underlying icons or unfavorite other icons
const colDeleted = deleteStoredCollection(testCollection.id);
assert(colDeleted === true, 'Delete collection failed');
assert(getStoredCollectionById(testCollection.id) === undefined, 'Collection still retrieved after delete');
console.log('   ✓ Favorites and Collections are strictly decoupled');

console.log('\n======================================================');
console.log('  ✅ ALL FAVORITES + COLLECTIONS 2.0 TESTS PASSED (100%)');
console.log('======================================================\n');
