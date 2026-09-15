import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { runCatalogAudit, verifyPrePublishGate, ADMIN_SET_PRESETS } from '../features/admin/services/catalogAudit';
import type { AdminIcon } from '../features/admin/context/AdminCatalogContext';

console.log(`\n======================================================`);
console.log(`🧪 RUNNING ADMIN 2.0 / ICON OPERATIONS STUDIO SUITE`);
console.log(`======================================================\n`);

const testCatalog: AdminIcon[] = GRIDFRAME_ICONS.slice(0, 50).map((icon) => ({
  ...icon,
  primaryCategory: icon.category.toLowerCase(),
  status: 'published' as const,
  tags: icon.tags || [icon.slug, 'system'],
  keywords: [icon.name.toLowerCase(), icon.slug],
  useCases: ['Common action trigger'],
  relatedIconIds: [],
}));

// TEST 1: Full Catalog Health Audit Computation
console.log('--- TEST 1: Catalog Health Audit Engine ---');
const audit = runCatalogAudit(testCatalog);

if (!audit.healthSummary) {
  throw new Error('Audit engine failed to return healthSummary');
}

if (audit.healthSummary.totalConcepts !== testCatalog.length) {
  throw new Error(`Expected ${testCatalog.length} concepts, got ${audit.healthSummary.totalConcepts}`);
}

if (typeof audit.healthSummary.overallHealthPercent !== 'number' || audit.healthSummary.overallHealthPercent < 80) {
  throw new Error(`Unexpected overall health score: ${audit.healthSummary.overallHealthPercent}%`);
}

console.log(`✓ Catalog health computed successfully: ${audit.healthSummary.overallHealthPercent}% overall score`);
console.log(`  SVG Integrity: ${audit.healthSummary.svgIntegrityPercent}% | Metadata: ${audit.healthSummary.metadataQualityPercent}% | Consistency: ${audit.healthSummary.consistencyPercent}%`);

// TEST 2: "What Needs My Attention?" Queue
console.log('\n--- TEST 2: Attention Queue Generation ---');
if (!audit.attentionIssues || audit.attentionIssues.length === 0) {
  throw new Error('Attention queue is empty');
}

const highSeverity = audit.attentionIssues.filter((i) => i.severity === 'high');
console.log(`✓ Generated ${audit.attentionIssues.length} attention issue categories (${highSeverity.length} high priority)`);

// TEST 3: Visual Outlier Detection Engine
console.log('\n--- TEST 3: Visual Outlier Detector ---');
if (!audit.visualOutliers || audit.visualOutliers.length === 0) {
  throw new Error('Visual outlier detector returned zero specimens');
}

const firstOutlier = audit.visualOutliers[0];
if (!firstOutlier.metric || !firstOutlier.expected || !firstOutlier.actual) {
  throw new Error('Visual outlier missing diagnostic metrics');
}
console.log(`✓ Detected visual outlier: "${firstOutlier.name}" [${firstOutlier.issue}]`);

// TEST 4: Smart Duplicate Clustering
console.log('\n--- TEST 4: Smart Duplicate Detection & Similarity ---');
if (!audit.duplicateGroups || audit.duplicateGroups.length === 0) {
  throw new Error('Duplicate engine returned zero clusters');
}

const cluster = audit.duplicateGroups[0];
if (cluster.similarityScore < 80) {
  throw new Error(`Duplicate similarity score too low: ${cluster.similarityScore}%`);
}
console.log(`✓ Identified duplicate cluster: ${cluster.icons.map((i) => i.name).join(' ↔ ')} (${cluster.similarityScore}% similarity)`);

// TEST 5: Category Coverage & Gap Analyzer
console.log('\n--- TEST 5: Category Coverage Map & Gaps ---');
if (!audit.coverageMap || audit.coverageMap.length === 0) {
  throw new Error('Coverage map is empty');
}

const aiCategory = audit.coverageMap.find((c) => c.categorySlug === 'ai');
if (!aiCategory || aiCategory.missingConcepts.length === 0) {
  throw new Error('Missing domain recommendations for AI category');
}
console.log(`✓ Category coverage calculated: AI missing ${aiCategory.missingConcepts.length} domain concepts (${aiCategory.missingConcepts.join(', ')})`);

// TEST 6: Pre-Publish Quality Gate Verification
console.log('\n--- TEST 6: Pre-Publish Quality Gate ---');
const validIcon: AdminIcon = {
  id: 'cloud-check',
  name: 'Cloud Check',
  slug: 'cloud-check',
  category: 'Cloud',
  primaryCategory: 'cloud',
  status: 'draft',
  style: 'regular',
  relatedIconIds: [],
  svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><polyline points="9 13 12 16 17 11"/>',
  viewBox: '0 0 24 24',
  tags: ['cloud', 'check', 'verified'],
  keywords: ['cloud check', 'cloud sync'],
  variants: [
    {
      id: 'cloud-check-regular',
      style: 'regular',
      label: 'Regular',
      svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><polyline points="9 13 12 16 17 11"/>',
      viewBox: '0 0 24 24',
      supportsStroke: true,
      supportsColor: true,
    },
  ],
};

const gateResult = verifyPrePublishGate(validIcon);
if (!gateResult.isReadyToPublish) {
  const failed = gateResult.checklist.filter((c) => !c.passed).map((c) => c.label);
  throw new Error(`Valid icon failed pre-publish check: ${failed.join(', ')}`);
}
console.log(`✓ Valid icon passed all ${gateResult.checklist.length} pre-publish criteria`);

// Test rejection of invalid icon
const invalidIcon: AdminIcon = {
  ...validIcon,
  svg: '', // Empty SVG
};
const invalidGateResult = verifyPrePublishGate(invalidIcon);
if (invalidGateResult.isReadyToPublish) {
  throw new Error('Pre-publish gate allowed empty SVG to pass');
}
console.log('✓ Pre-publish gate successfully blocked icon with empty SVG');

// TEST 7: Curated Set Builder & Consistency Intelligence
console.log('\n--- TEST 7: Admin Set Builder Archetypes ---');
if (!ADMIN_SET_PRESETS || ADMIN_SET_PRESETS.length < 3) {
  throw new Error('Missing standard archetype set presets');
}

const saasPreset = ADMIN_SET_PRESETS.find((p) => p.productType === 'SaaS');
if (!saasPreset || saasPreset.slots.length < 3) {
  throw new Error('SaaS preset missing slots configuration');
}
console.log(`✓ Set builder initialized with ${ADMIN_SET_PRESETS.length} archetypes (${ADMIN_SET_PRESETS.map((p) => p.name).join(', ')})`);

console.log(`\n======================================================`);
console.log(`✅ ADMIN 2.0 / OPERATIONS STUDIO: ALL TESTS PASSED (100%)`);
console.log(`======================================================\n`);
