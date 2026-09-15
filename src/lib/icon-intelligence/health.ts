import type { Icon } from '@/types/icon';
import type { SetHealthReport } from '@/types/intelligence';
import { analyzeSetConsistency } from './consistency';

/**
 * Calculates a comprehensive, explainable Set Health Score (0-100) for an icon collection.
 */
export function calculateSetHealth(icons: Icon[]): SetHealthReport {
  if (!icons || icons.length === 0) {
    return {
      overallHealth: 100,
      grade: 'A',
      iconCount: 0,
      breakdown: {
        visualConsistencyScore: 100,
        semanticCoverageScore: 100,
        duplicateScore: 100,
        missingStateScore: 100,
        variantConsistencyScore: 100,
        namingConsistencyScore: 100,
        categoryBalanceScore: 100,
      },
      outliers: [],
      duplicates: [],
      missingCommonStates: [],
      actionableTips: ['Add icons to this collection to start evaluating health.'],
    };
  }

  // 1. Visual Consistency & Outliers
  const consistencyReport = analyzeSetConsistency(icons);
  const visualConsistencyScore = consistencyReport.overallScore;

  // 2. Duplicate Detection
  const duplicates: SetHealthReport['duplicates'] = [];
  const seenConcepts = new Map<string, Icon>();

  for (const icon of icons) {
    // Check primary concept family / root word
    const rootConcept = icon.slug.split('-')[0];
    if (seenConcepts.has(rootConcept) && seenConcepts.get(rootConcept)!.id !== icon.id) {
      const original = seenConcepts.get(rootConcept)!;
      // If names/tags are nearly identical, flag potential duplicate
      if (original.primaryCategory === icon.primaryCategory) {
        duplicates.push({
          sourceId: original.id,
          duplicateId: icon.id,
          concept: rootConcept,
        });
      }
    } else {
      seenConcepts.set(rootConcept, icon);
    }
  }
  const duplicateScore = Math.max(30, 100 - duplicates.length * 25);

  // 3. Missing Common States Check
  const missingCommonStates: SetHealthReport['missingCommonStates'] = [];
  const iconSlugs = new Set(icons.map((i) => i.slug));

  for (const icon of icons) {
    // If a toggle/action icon exists without its counterpart (e.g. eye without eye-off, lock without lock-open)
    if (icon.slug === 'eye' && !iconSlugs.has('eye-off') && !iconSlugs.has('eye-slash') && !iconSlugs.has('eye-closed')) {
      missingCommonStates.push({ iconId: icon.id, missingState: 'Hidden/Off state (eye-off or eye-closed)' });
    } else if (icon.slug === 'lock' && !iconSlugs.has('lock-open') && !iconSlugs.has('lock-unlocked')) {
      missingCommonStates.push({ iconId: icon.id, missingState: 'Unlocked state (lock-open)' });
    } else if (icon.slug === 'volume-high' && !iconSlugs.has('volume-mute') && !iconSlugs.has('volume-off')) {
      missingCommonStates.push({ iconId: icon.id, missingState: 'Mute/Off state' });
    } else if (icon.slug.includes('upload') && !icons.some((i) => i.slug.includes('download'))) {
      missingCommonStates.push({ iconId: icon.id, missingState: 'Complementary action (download)' });
    }
  }
  const missingStateScore = Math.max(40, 100 - missingCommonStates.length * 15);

  // 4. Variant Consistency
  const variantConsistencyScore = consistencyReport.metrics.variantMixing.score;

  // 5. Naming Consistency
  let namingScore = 100;
  const isAllLowercaseKebab = icons.every((i) => /^[a-z0-9-]+$/.test(i.slug));
  if (!isAllLowercaseKebab) namingScore -= 20;

  // 6. Category Balance & Semantic Coverage
  const categoryCounts = new Map<string, number>();
  icons.forEach((i) => {
    const cat = i.primaryCategory || 'other';
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  });
  const categoryDiversity = categoryCounts.size / Math.min(10, Math.max(1, icons.length));
  const categoryBalanceScore = Math.min(100, Math.round(50 + categoryDiversity * 50));
  const semanticCoverageScore = Math.min(100, Math.round(60 + (icons.length / 20) * 40));

  // Overall Health Calculation
  const overallHealth = Math.round(
    visualConsistencyScore * 0.3 +
      duplicateScore * 0.2 +
      missingStateScore * 0.15 +
      variantConsistencyScore * 0.15 +
      semanticCoverageScore * 0.1 +
      categoryBalanceScore * 0.1
  );

  let grade: SetHealthReport['grade'] = 'A';
  if (overallHealth < 60) grade = 'F';
  else if (overallHealth < 70) grade = 'D';
  else if (overallHealth < 80) grade = 'C';
  else if (overallHealth < 90) grade = 'B';

  const outliers = consistencyReport.outlierIcons.map((o) => ({
    iconId: o.iconId,
    reason: o.reasons.join('; '),
  }));

  const actionableTips: string[] = [];
  if (duplicates.length > 0) {
    actionableTips.push(`Resolve ${duplicates.length} potential duplicate concept(s) to streamline the set.`);
  }
  if (missingCommonStates.length > 0) {
    actionableTips.push(`Add ${missingCommonStates.length} missing action/toggle state counterpart(s) (e.g., hidden/open states).`);
  }
  if (outliers.length > 0) {
    actionableTips.push(`Standardize ${outliers.length} visual weight and corner outliers to regular 24×24 grid geometry.`);
  }
  if (variantConsistencyScore < 85) {
    actionableTips.push('Ensure all icons in the collection share the same variant style (avoid mixing filled with regular).');
  }
  if (actionableTips.length === 0) {
    actionableTips.push('This icon set meets high visual consistency and semantic coverage standards.');
  }

  return {
    overallHealth,
    grade,
    iconCount: icons.length,
    breakdown: {
      visualConsistencyScore,
      semanticCoverageScore,
      duplicateScore,
      missingStateScore,
      variantConsistencyScore,
      namingConsistencyScore: namingScore,
      categoryBalanceScore,
    },
    outliers,
    duplicates,
    missingCommonStates,
    actionableTips,
  };
}
