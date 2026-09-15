import type { Icon } from '@/types/icon';
import type { SetConsistencyReport } from '@/types/intelligence';
import { calculateIconDna } from './dna';

/**
 * Analyzes visual and structural consistency across a set of selected icons.
 */
export function analyzeSetConsistency(icons: Icon[]): SetConsistencyReport {
  if (!icons || icons.length === 0) {
    return {
      overallScore: 100,
      status: 'Consistent',
      metrics: {
        strokeConsistency: { name: 'Stroke Consistency', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
        visualWeight: { name: 'Visual Weight', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
        cornerTreatment: { name: 'Corner Treatment', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
        opticalSize: { name: 'Optical Size', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
        densityDistribution: { name: 'Density Distribution', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
        variantMixing: { name: 'Variant Mixing', status: 'consistent', score: 100, detail: 'Empty icon set', outlierIconIds: [] },
      },
      summary: 'No icons provided to evaluate.',
      outlierIcons: [],
    };
  }

  const dnas = icons.map((icon) => ({ icon, dna: calculateIconDna(icon) }));
  const outlierMap = new Map<string, string[]>();

  const recordOutlier = (iconId: string, reason: string) => {
    const list = outlierMap.get(iconId) || [];
    list.push(reason);
    outlierMap.set(iconId, list);
  };

  // 1. Stroke Consistency
  const filledCount = icons.filter((i) => i.style === 'filled').length;
  const regularCount = icons.length - filledCount;
  const isMixedStyle = filledCount > 0 && regularCount > 0;
  const strokeOutliers: string[] = [];
  let strokeScore = 100;
  let strokeDetail = 'Uniform regular stroke geometry';

  if (isMixedStyle) {
    const minorityStyle = filledCount < regularCount ? 'filled' : 'regular';
    const outliers = icons.filter((i) => i.style === minorityStyle);
    outliers.forEach((o) => {
      strokeOutliers.push(o.id);
      recordOutlier(o.id, `Mixed ${minorityStyle} style in predominantly ${minorityStyle === 'filled' ? 'regular' : 'filled'} set`);
    });
    strokeScore = Math.max(40, 100 - (strokeOutliers.length / icons.length) * 60);
    strokeDetail = `${strokeOutliers.length} icon(s) mix filled and outline styles.`;
  }

  // 2. Visual Weight
  const avgWeight = dnas.reduce((acc, curr) => acc + curr.dna.weight, 0) / dnas.length;
  const weightOutliers: string[] = [];
  dnas.forEach(({ icon, dna }) => {
    if (Math.abs(dna.weight - avgWeight) >= 1.8) {
      weightOutliers.push(icon.id);
      recordOutlier(icon.id, `Visual weight deviates from set average (${dna.weight}/5 vs avg ${avgWeight.toFixed(1)}/5)`);
    }
  });
  const weightScore = Math.max(30, 100 - weightOutliers.length * 20);
  const weightDetail = weightOutliers.length === 0 ? 'Harmonious visual weight distribution' : `${weightOutliers.length} visual weight outlier(s)`;

  // 3. Corner Treatment
  const cornerCounts = { sharp: 0, rounded: 0, mixed: 0 };
  dnas.forEach(({ dna }) => cornerCounts[dna.cornerTreatment]++);
  const dominantCorner = Object.entries(cornerCounts).sort((a, b) => b[1] - a[1])[0][0];
  const cornerOutliers: string[] = [];
  dnas.forEach(({ icon, dna }) => {
    if (dna.cornerTreatment !== dominantCorner && dominantCorner !== 'mixed' && cornerCounts[dominantCorner as keyof typeof cornerCounts] >= icons.length * 0.7) {
      cornerOutliers.push(icon.id);
      recordOutlier(icon.id, `Corner treatment (${dna.cornerTreatment}) differs from dominant (${dominantCorner})`);
    }
  });
  const cornerScore = Math.max(40, 100 - cornerOutliers.length * 15);
  const cornerDetail = cornerOutliers.length === 0 ? `Consistent ${dominantCorner} corner geometry` : `${cornerOutliers.length} non-conforming corner profile(s)`;

  // 4. Optical Size
  const sizeCounts = { compact: 0, standard: 0, spacious: 0 };
  dnas.forEach(({ dna }) => sizeCounts[dna.apparentOpticalSize]++);
  const opticalOutliers: string[] = [];
  if (sizeCounts.compact > 0 && sizeCounts.spacious > 0) {
    dnas.filter((d) => d.dna.apparentOpticalSize === 'compact' || d.dna.apparentOpticalSize === 'spacious').forEach((d) => {
      opticalOutliers.push(d.icon.id);
      recordOutlier(d.icon.id, `Extreme optical size variance (${d.dna.apparentOpticalSize})`);
    });
  }
  const opticalScore = Math.max(50, 100 - opticalOutliers.length * 10);
  const opticalDetail = opticalOutliers.length === 0 ? 'Balanced apparent optical sizes on 24×24 grid' : `${opticalOutliers.length} icons exhibit optical size extremes`;

  // 5. Density Distribution
  const avgDensity = dnas.reduce((acc, curr) => acc + curr.dna.density, 0) / dnas.length;
  const densityOutliers: string[] = [];
  dnas.forEach(({ icon, dna }) => {
    if (Math.abs(dna.density - avgDensity) >= 2.0) {
      densityOutliers.push(icon.id);
      recordOutlier(icon.id, `Density outlier (${dna.density}/5 vs avg ${avgDensity.toFixed(1)}/5)`);
    }
  });
  const densityScore = Math.max(40, 100 - densityOutliers.length * 15);
  const densityDetail = densityOutliers.length === 0 ? 'Smooth, even density across set' : `${densityOutliers.length} high density variance icon(s)`;

  // 6. Variant Mixing
  const variantOutliers = strokeOutliers;
  const variantScore = strokeScore;
  const variantDetail = strokeDetail;

  const toMetricStatus = (score: number): 'consistent' | 'warning' | 'outlier' => {
    if (score >= 85) return 'consistent';
    if (score >= 65) return 'warning';
    return 'outlier';
  };

  const metrics: SetConsistencyReport['metrics'] = {
    strokeConsistency: {
      name: 'Stroke Consistency',
      status: toMetricStatus(strokeScore),
      score: Math.round(strokeScore),
      detail: strokeDetail,
      outlierIconIds: strokeOutliers,
    },
    visualWeight: {
      name: 'Visual Weight',
      status: toMetricStatus(weightScore),
      score: Math.round(weightScore),
      detail: weightDetail,
      outlierIconIds: weightOutliers,
    },
    cornerTreatment: {
      name: 'Corner Treatment',
      status: toMetricStatus(cornerScore),
      score: Math.round(cornerScore),
      detail: cornerDetail,
      outlierIconIds: cornerOutliers,
    },
    opticalSize: {
      name: 'Optical Size',
      status: toMetricStatus(opticalScore),
      score: Math.round(opticalScore),
      detail: opticalDetail,
      outlierIconIds: opticalOutliers,
    },
    densityDistribution: {
      name: 'Density Distribution',
      status: toMetricStatus(densityScore),
      score: Math.round(densityScore),
      detail: densityDetail,
      outlierIconIds: densityOutliers,
    },
    variantMixing: {
      name: 'Variant Mixing',
      status: toMetricStatus(variantScore),
      score: Math.round(variantScore),
      detail: variantDetail,
      outlierIconIds: variantOutliers,
    },
  };

  const overallScore = Math.round(
    (strokeScore * 0.25 + weightScore * 0.2 + cornerScore * 0.15 + opticalScore * 0.15 + densityScore * 0.15 + variantScore * 0.1)
  );

  let status: SetConsistencyReport['status'] = 'Consistent';
  if (overallScore < 70) status = 'Outlier';
  else if (overallScore < 88) status = 'Warning';

  const outlierIcons = Array.from(outlierMap.entries()).map(([iconId, reasons]) => ({
    iconId,
    reasons,
  }));

  const summary =
    status === 'Consistent'
      ? `High visual harmony across all ${icons.length} icons. Stroke weights and geometry profiles match seamlessly.`
      : status === 'Warning'
      ? `Moderate visual consistency with ${outlierIcons.length} mild outlier(s) detected.`
      : `Significant visual variance detected across ${outlierIcons.length} icon(s). Consider aligning styles.`;

  return {
    overallScore,
    status,
    metrics,
    summary,
    outlierIcons,
  };
}
