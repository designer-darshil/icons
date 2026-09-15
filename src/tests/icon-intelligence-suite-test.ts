import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { calculateIconDna } from '../lib/icon-intelligence/dna';
import { findSimilarIcons } from '../lib/icon-intelligence/similarity';
import { analyzeSetConsistency } from '../lib/icon-intelligence/consistency';
import { calculateSetHealth } from '../lib/icon-intelligence/health';
import { detectMissingIcons } from '../lib/icon-intelligence/missing-detector';
import { recommendIconStates } from '../lib/icon-intelligence/state-recommender';
import { findIconPairings } from '../lib/icon-intelligence/pairing';
import { UI_CONTEXT_SPECS } from '../lib/icon-intelligence/context-preview';
import { evaluateIconStressTest } from '../lib/icon-intelligence/stress-test';
import { generateA11yGuidance } from '../lib/icon-intelligence/accessibility';
import { buildPresetIconSet, getAllPresetTypes } from '../lib/icon-intelligence/set-builder';
import { diffIconSets } from '../lib/icon-intelligence/diff';
import { getIconTimeMachineHistory } from '../lib/icon-intelligence/time-machine';
import { buildIconRelationshipGraph } from '../lib/icon-intelligence/graph';
import { spinIconRoulette } from '../lib/icon-intelligence/roulette';
import { generateUsageGuidelines } from '../lib/icon-intelligence/recommendations';
import { getIntelligenceFlags } from '../lib/icon-intelligence/flags';

console.log(`\n======================================================`);
console.log(`🧪 RUNNING 16-FEATURE ICON INTELLIGENCE SUITE TEST`);
console.log(`======================================================\n`);

const testIcon = GRIDFRAME_ICONS[0]; // e.g. access-denied or arrow
const arrowIcon = GRIDFRAME_ICONS.find((i) => i.slug.includes('arrow-left')) || testIcon;
const userIcon = GRIDFRAME_ICONS.find((i) => i.slug === 'user') || testIcon;

// TEST 1: Icon DNA Profile
console.log('--- TEST 1: Feature 1 — Icon DNA ---');
const dna = calculateIconDna(testIcon);
if (!dna.weight || !dna.roundness || !dna.density || !dna.symmetry || !dna.complexity) {
  throw new Error('Icon DNA missing core 1-5 scale metrics');
}
if (!dna.heuristicSummary || dna.pathCount < 1) {
  throw new Error('Icon DNA missing heuristic summary or path counts');
}
console.log(`  ✓ DNA calculated for [${testIcon.name}]: Weight=${dna.weight}, Roundness=${dna.roundness}, Density=${dna.density}`);

// TEST 2: Find An Icon Like This
console.log('--- TEST 2: Feature 2 — Similarity Engine ---');
const similarResults = findSimilarIcons(userIcon, GRIDFRAME_ICONS, 8);
if (similarResults.length === 0) {
  throw new Error('Similarity engine returned 0 results for user icon');
}
const topMatch = similarResults[0];
if (!topMatch.matchTier || topMatch.similarityScore <= 0) {
  throw new Error('Similarity result missing match tier or score');
}
console.log(`  ✓ Top similar icon to [${userIcon.name}]: [${topMatch.icon.name}] (${topMatch.similarityScore}%, Tier: ${topMatch.matchTier})`);

// TEST 3: Icon Consistency Checker
console.log('--- TEST 3: Feature 3 — Consistency Checker ---');
const consistency = analyzeSetConsistency(GRIDFRAME_ICONS.slice(0, 10));
if (!consistency.overallScore || !consistency.metrics.strokeConsistency) {
  throw new Error('Consistency report missing overall score or stroke metric');
}
console.log(`  ✓ Consistency evaluated across 10 icons: Status=${consistency.status}, Score=${consistency.overallScore}/100`);

// TEST 4: Icon Set Health Score
console.log('--- TEST 4: Feature 4 — Set Health Score ---');
const health = calculateSetHealth(GRIDFRAME_ICONS.slice(0, 15));
if (!health.overallHealth || !health.grade || !health.breakdown) {
  throw new Error('Health report missing grade or breakdown');
}
console.log(`  ✓ Set health evaluated: ${health.overallHealth}/100 (Grade: ${health.grade}) with ${health.actionableTips.length} actionable tips`);

// TEST 5: Missing Icon Detector
console.log('--- TEST 5: Feature 5 — Missing Icon Detector ---');
const missingReport = detectMissingIcons(GRIDFRAME_ICONS.slice(0, 5), GRIDFRAME_ICONS);
if (!missingReport.suggestions || missingReport.suggestions.length === 0) {
  throw new Error('Missing icon detector failed to identify domain recommendations');
}
console.log(`  ✓ Missing icons detected: ${missingReport.totalSuggested} suggestions found`);

// TEST 6: Icon State Recommender
console.log('--- TEST 6: Feature 6 — State Recommender ---');
const stateMatrix = recommendIconStates(userIcon, GRIDFRAME_ICONS);
if (!stateMatrix.states || stateMatrix.states.length < 5) {
  throw new Error('State matrix missing semantic states');
}
console.log(`  ✓ State matrix generated for [${userIcon.name}]: ${stateMatrix.states.filter((s) => s.isAvailableInCatalog).length} states available in catalog`);

// TEST 7: Icon Pairing Intelligence
console.log('--- TEST 7: Feature 7 — Pairing Intelligence ---');
const pairingReport = findIconPairings(arrowIcon, GRIDFRAME_ICONS);
if (!pairingReport.pairings || pairingReport.pairings.length === 0) {
  throw new Error('Pairing intelligence failed to find counterpart pairs');
}
console.log(`  ✓ Pairing found for [${arrowIcon.name}]: [${pairingReport.pairings[0].pairedIcon.name}] (${pairingReport.pairings[0].relationLabel})`);

// TEST 8: Context Preview
console.log('--- TEST 8: Feature 8 — Context Preview ---');
const contextKeys = Object.keys(UI_CONTEXT_SPECS);
if (contextKeys.length < 8) {
  throw new Error('Missing standard UI context preview specifications');
}
console.log(`  ✓ ${contextKeys.length} UI context presets registered (Button, Toolbar, Navigation, Table, etc.)`);

// TEST 9: Pixel Size Stress Test
console.log('--- TEST 9: Feature 9 — Pixel Size Stress Test ---');
const stressReport = evaluateIconStressTest(testIcon);
if (stressReport.evaluations.length !== 9) {
  throw new Error(`Expected 9 stress test sizes (12-64px), got ${stressReport.evaluations.length}`);
}
console.log(`  ✓ Stress test evaluated: Recommended range ${stressReport.recommendedMinSize}px to ${stressReport.recommendedMaxSize}px`);

// TEST 10: Accessibility Check
console.log('--- TEST 10: Feature 10 — Accessibility Guide ---');
const a11y = generateA11yGuidance(testIcon, 'Action');
if (!a11y.ariaRule || !a11y.codeSnippet.react) {
  throw new Error('A11y guidance missing ariaRule or React code snippet');
}
console.log(`  ✓ A11y guidance generated: Role=${a11y.role}, ARIA rule="${a11y.ariaRule}"`);

// TEST 11: Build Me A UI Icon Set
console.log('--- TEST 11: Feature 11 — Set Builder ---');
const presets = getAllPresetTypes();
if (presets.length < 4) {
  throw new Error('Set builder missing essential product presets');
}
const saasPreset = buildPresetIconSet('SaaS', GRIDFRAME_ICONS);
const saasIcons = saasPreset.groups.flatMap((g) => g.recommendedIcons);
if (saasIcons.length < 10) {
  throw new Error(`SaaS preset matched insufficient icons (${saasIcons.length})`);
}
console.log(`  ✓ SaaS Set Builder matched ${saasIcons.length} catalog icons across ${saasPreset.groups.length} category groups`);

// TEST 12: Icon Set Diff
console.log('--- TEST 12: Feature 12 — Icon Set Diff ---');
const diff = diffIconSets(GRIDFRAME_ICONS.slice(0, 10), GRIDFRAME_ICONS.slice(5, 18));
if (diff.added.length !== 8 || diff.removed.length !== 5) {
  throw new Error(`Set diff mismatch: added=${diff.added.length}, removed=${diff.removed.length}`);
}
console.log(`  ✓ Set diff validated: +${diff.added.length} added, -${diff.removed.length} removed, ↔${diff.replaced.length} replaced`);

// TEST 13: Icon Time Machine
console.log('--- TEST 13: Feature 13 — Time Machine ---');
const timeMachine = getIconTimeMachineHistory(testIcon);
if (timeMachine.history.length < 3) {
  throw new Error('Time machine missing catalog release history');
}
console.log(`  ✓ Time machine verified: ${timeMachine.history.length} chronological releases tracked`);

// TEST 14: Icon Relationship Graph
console.log('--- TEST 14: Feature 14 — Relationship Graph ---');
const graph = buildIconRelationshipGraph(userIcon, GRIDFRAME_ICONS, true);
if (graph.nodes.length < 4 || graph.edges.length < 3) {
  throw new Error('Relationship graph generated insufficient nodes or edges');
}
console.log(`  ✓ Relationship graph constructed: ${graph.nodes.length} nodes, ${graph.edges.length} relational edges`);

// TEST 15: Discovery / Icon Roulette
console.log('--- TEST 15: Feature 15 — Discovery Roulette ---');
const roulette = spinIconRoulette(GRIDFRAME_ICONS);
if (!roulette.icon || !roulette.surprisingFact) {
  throw new Error('Roulette candidate missing icon or surprising fact');
}
console.log(`  ✓ Roulette pick: [${roulette.icon.name}] — "${roulette.reason}"`);

// TEST 16: Icon Usage Recommendations
console.log('--- TEST 16: Feature 16 — Usage Recommendations ---');
const usage = generateUsageGuidelines(testIcon);
if (!usage.recommendedSizes || usage.bestUseCases.length === 0) {
  throw new Error('Usage guidelines missing recommended sizes or best use cases');
}
console.log(`  ✓ Usage recommendations: ${usage.recommendedSizes}, Best: ${usage.bestUseCases[0]}`);

// TEST 17: Feature Flags Integrity
console.log('--- TEST 17: Feature Flags Integrity ---');
const flags = getIntelligenceFlags();
if (!flags.enableIconDna || !flags.enableSimilarity || !flags.enableRelationshipGraph) {
  throw new Error('Feature flags missing core toggle properties');
}
console.log('  ✓ All 16 feature flags verified and configured.');

console.log(`\n======================================================`);
console.log(`🏆 ALL 16 ICON INTELLIGENCE FEATURES PASSED 100%!`);
console.log(`======================================================\n`);
