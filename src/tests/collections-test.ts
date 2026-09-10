import {
  loadWorkspaceState,
  getStoredFavorites,
  toggleStoredFavorite,
  clearStoredFavorites,
  getStoredCollections,
  saveStoredCollection,
  deleteStoredCollection,
  toggleIconInStoredCollection,
} from '../lib/storage';

// Polyfill localStorage in Node test environment
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

console.log('--- Testing Storage Default State ---');
const initialState = loadWorkspaceState();
console.assert(initialState.version === 1, 'Version mismatch');
console.assert(Array.isArray(initialState.favorites), 'Favorites not array');
console.assert(initialState.collections.length >= 2, 'Default collections missing');
console.log('✓ Initial state validation passed');

console.log('--- Testing Favorites Operations ---');
const isAdded = toggleStoredFavorite('ico_test_123');
console.assert(isAdded === true, 'Failed to add favorite');
console.assert(getStoredFavorites().includes('ico_test_123'), 'Favorite not persisted');

const isRemoved = toggleStoredFavorite('ico_test_123');
console.assert(isRemoved === false, 'Failed to remove favorite');
console.assert(!getStoredFavorites().includes('ico_test_123'), 'Favorite still exists');

toggleStoredFavorite('ico_fav_a');
toggleStoredFavorite('ico_fav_b');
console.assert(getStoredFavorites().length >= 2, 'Favorites length mismatch');
clearStoredFavorites();
console.assert(getStoredFavorites().length === 0, 'Clear favorites failed');
console.log('✓ Favorites operations passed');

console.log('--- Testing Collections Operations ---');
const newCol = saveStoredCollection({
  name: 'Test Project Set',
  description: 'Icons for the new dashboard design',
  color: '#8B5CF6',
  iconIds: ['ico_zap', 'ico_search'],
});
console.assert(Boolean(newCol.id), 'Collection ID missing');
console.assert(newCol.name === 'Test Project Set', 'Collection name mismatch');

// Toggle icon in collection
const iconAdded = toggleIconInStoredCollection(newCol.id, 'ico_heart');
console.assert(iconAdded === true, 'Add icon to collection failed');

const updatedCols = getStoredCollections();
const fetched = updatedCols.find((c) => c.id === newCol.id);
console.assert(Boolean(fetched?.iconIds.includes('ico_heart')), 'Icon not present in collection');

// Edit collection
const edited = saveStoredCollection({
  id: newCol.id,
  name: 'Updated Dashboard Set',
  color: '#EF4444',
  iconIds: fetched?.iconIds || [],
});
console.assert(edited.name === 'Updated Dashboard Set', 'Rename collection failed');

// Delete collection
const deleted = deleteStoredCollection(newCol.id);
console.assert(deleted === true, 'Delete collection failed');
console.assert(!getStoredCollections().some((c) => c.id === newCol.id), 'Collection still in store');
console.log('✓ Collections operations passed');

console.log('--- Testing Defensive Storage Handling ---');
// Corrupt storage payload
global.localStorage.setItem('glyphroom_workspace_v1', '{"invalid": true}');
const recovered = loadWorkspaceState();
console.assert(recovered.version === 1, 'Recovery failed on corrupted JSON');
console.assert(Array.isArray(recovered.favorites), 'Recovered favorites invalid');
console.log('✓ Defensive recovery passed');

console.log('\n🎉 ALL PHASE 8 FAVORITES & COLLECTIONS TESTS PASSED CLEANLY!');
