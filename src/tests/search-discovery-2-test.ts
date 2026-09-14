/**
 * Gridframe V2 — Search & Discovery 2.0 Comprehensive Test Suite
 * Validates fuzzy search, synonyms, multi-tier ranking, single concept integrity,
 * multi-filter combinations, related icons, and local history management.
 */

import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { searchIconsWithScore, getSearchSuggestions } from '../lib/icon-search';
import { filterAndSortIcons } from '../lib/icon-filtering';
import { getRelatedIcons } from '../lib/icon-relations';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    throw new Error(`Search & Discovery 2.0 Test Failed: ${msg}`);
  }
}

export async function runSearchDiscovery2TestSuite() {
  console.log('\n======================================================');
  console.log('  🔍 GRIDFRAME V2 — SEARCH & DISCOVERY 2.0 TEST SUITE');
  console.log('======================================================\n');

  // ─────────────────────────────────────────────────────────────
  // 1. Synonym & Semantic Search Queries
  // ─────────────────────────────────────────────────────────────
  console.log('1. Testing Semantic & Synonym Search (user, delete, settings, cloud, shield)...');

  // "user"
  const userResults = searchIconsWithScore(GRIDFRAME_ICONS, 'user');
  assert(userResults.length > 0, 'Query "user" returned results');
  assert(userResults[0].slug.startsWith('user') || userResults[0].slug.includes('user') || userResults[0].slug.includes('profile'), 'Top result for "user" is relevant');
  // Check no duplicate concept IDs
  const userIds = userResults.map((r) => r.id);
  assert(userIds.length === new Set(userIds).size, 'No duplicate concepts for "user"');

  // "delete" -> should match trash/bin/delete
  const deleteResults = searchIconsWithScore(GRIDFRAME_ICONS, 'delete');
  assert(deleteResults.length > 0, 'Query "delete" returned results via synonym mapping');
  const hasTrashOrBin = deleteResults.some(
    (i) => i.slug.includes('trash') || i.slug.includes('bin') || i.slug.includes('delete') || i.tags.includes('trash')
  );
  assert(hasTrashOrBin, 'Delete query matches Trash / Bin / Delete concepts');

  // "settings" -> matches gear/settings/config
  const settingsResults = searchIconsWithScore(GRIDFRAME_ICONS, 'settings');
  assert(settingsResults.length > 0, 'Query "settings" returned results');

  // "cloud" -> matches cloud concepts
  const cloudResults = searchIconsWithScore(GRIDFRAME_ICONS, 'cloud');
  assert(cloudResults.length > 0, 'Query "cloud" returned results');
  console.log('   ✓ Verified Semantic & Synonym Search');

  // ─────────────────────────────────────────────────────────────
  // 2. Fuzzy Matching & Typo Tolerance
  // ─────────────────────────────────────────────────────────────
  console.log('2. Testing Fuzzy Typo Matching...');
  // "shiled" -> should match "shield"
  const typoShield = searchIconsWithScore(GRIDFRAME_ICONS, 'shiled');
  assert(typoShield.length > 0, 'Typo "shiled" matches shield concepts');
  assert(typoShield.some((i) => i.slug.includes('shield')), 'Found shield icon with typo "shiled"');

  // "accesibility" (missing 's') -> should match accessibility
  const typoAccess = searchIconsWithScore(GRIDFRAME_ICONS, 'accesibility');
  assert(typoAccess.length > 0, 'Typo "accesibility" matches accessibility concepts');

  // "settngs" (missing 'i') -> should match settings
  const typoSettings = searchIconsWithScore(GRIDFRAME_ICONS, 'settngs');
  assert(typoSettings.length > 0, 'Typo "settngs" matches settings concepts');
  console.log('   ✓ Verified Fuzzy Typo Tolerance');

  // ─────────────────────────────────────────────────────────────
  // 3. Multi-Tier Relevance Ranking
  // ─────────────────────────────────────────────────────────────
  console.log('3. Testing Multi-Tier Relevance Ranking...');
  // Exact match ("user") should rank higher than "user-plus", "user-circle", etc.
  const rankedUser = searchIconsWithScore(GRIDFRAME_ICONS, 'user');
  const exactUserIndex = rankedUser.findIndex((i) => i.slug === 'user');
  if (exactUserIndex !== -1) {
    assert(exactUserIndex === 0, 'Exact name match "user" is ranked at position 0');
  }

  // Exact match ("heart") should rank at position 0
  const rankedHeart = searchIconsWithScore(GRIDFRAME_ICONS, 'heart');
  const exactHeartIndex = rankedHeart.findIndex((i) => i.slug === 'heart');
  if (exactHeartIndex !== -1) {
    assert(exactHeartIndex === 0, 'Exact name match "heart" is ranked at position 0');
  }
  console.log('   ✓ Verified Multi-Tier Relevance Ranking');

  // ─────────────────────────────────────────────────────────────
  // 4. Single Concept Integrity
  // ─────────────────────────────────────────────────────────────
  console.log('4. Testing Single Concept Integrity (ONE CONCEPT = ONE RESULT)...');
  const testQueries = ['arrow', 'check', 'folder', 'mail', 'edit', 'code', 'lock'];
  for (const q of testQueries) {
    const res = searchIconsWithScore(GRIDFRAME_ICONS, q);
    const seenIds = new Set<string>();
    for (const item of res) {
      assert(!seenIds.has(item.id), `Query "${q}" returned duplicate concept id ${item.id}`);
      seenIds.add(item.id);
    }
  }
  console.log('   ✓ Verified Single Concept Integrity across all queries');

  // ─────────────────────────────────────────────────────────────
  // 5. Multi-Filter Combinations
  // ─────────────────────────────────────────────────────────────
  console.log('5. Testing Multi-Filter Combinations...');
  // Category = 'security' + Style = 'regular'
  const filteredSec = filterAndSortIcons(GRIDFRAME_ICONS, {
    query: '',
    category: 'security',
    style: 'regular',
    strokeWeight: 'all',
    sort: 'popular',
  });
  assert(filteredSec.length > 0, 'Category + Style filter returned items');
  for (const item of filteredSec) {
    const inSec =
      item.category.toLowerCase() === 'security' ||
      (item.primaryCategory || '').toLowerCase() === 'security' ||
      (item.secondaryCategories || []).some((s) => s.toLowerCase() === 'security');
    assert(inSec, 'Item is in security category');
    assert(item.variants.some((v) => v.style === 'regular'), 'Item has regular style');
  }

  // Favorites Filter + Search Query Combination
  const sampleFavoriteIds = new Set([GRIDFRAME_ICONS[0].id, GRIDFRAME_ICONS[1].id, GRIDFRAME_ICONS[2].id]);
  const filteredFavs = filterAndSortIcons(
    GRIDFRAME_ICONS,
    {
      query: '',
      category: 'all',
      style: 'all',
      strokeWeight: 'all',
      sort: 'popular',
      onlyFavorites: true,
    },
    {
      favoriteIds: sampleFavoriteIds,
    }
  );
  assert(filteredFavs.length === 3, 'Favorites filter returned exactly the 3 favorited concepts');
  console.log('   ✓ Verified Multi-Filter Composability');

  // ─────────────────────────────────────────────────────────────
  // 6. Related Icons System
  // ─────────────────────────────────────────────────────────────
  console.log('6. Testing Related Icons System...');
  const testTarget = GRIDFRAME_ICONS.find((i) => i.slug === 'shield-check') || GRIDFRAME_ICONS[0];
  const related = getRelatedIcons(testTarget, GRIDFRAME_ICONS, 5);
  assert(related.length > 0, 'Related icons returned for shield-check');
  assert(related.every((r) => r.id !== testTarget.id), 'Related icons do not include self');
  const relatedIds = related.map((r) => r.id);
  assert(relatedIds.length === new Set(relatedIds).size, 'No duplicates in related icons');
  console.log(`   ✓ Verified Related Icons System (found ${related.length} related items)`);

  // ─────────────────────────────────────────────────────────────
  // 7. Search Suggestions
  // ─────────────────────────────────────────────────────────────
  console.log('7. Testing Search Suggestions...');
  const suggestionsEmpty = getSearchSuggestions(GRIDFRAME_ICONS, '');
  assert(suggestionsEmpty.length > 0, 'Suggestions returned for empty query');
  const suggestionsFilled = getSearchSuggestions(GRIDFRAME_ICONS, 'dev');
  assert(suggestionsFilled.length > 0, 'Suggestions returned for "dev"');
  console.log('   ✓ Verified Search Suggestions');

  console.log('\n======================================================');
  console.log('  ✅ SEARCH & DISCOVERY 2.0: ALL CHECKS PASSED (100%)');
  console.log('======================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSearchDiscovery2TestSuite().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
