import type { Icon } from '@/types/icon';
import type { IconUsageGuideline } from '@/types/intelligence';
import { calculateIconDna } from './dna';
import { evaluateIconStressTest } from './stress-test';

/**
 * Generates contextual usage, sizing, and optical placement recommendations for an icon.
 */
export function generateUsageGuidelines(icon: Icon): IconUsageGuideline {
  const dna = calculateIconDna(icon);
  const stress = evaluateIconStressTest(icon);

  const bestUseCases: string[] = [];
  const avoidUseCases: string[] = [];

  // Determine best use cases from DNA & Category
  if (stress.recommendedMinSize <= 16) {
    bestUseCases.push('Dense toolbars & compact buttons (16px)');
  }
  bestUseCases.push('Primary sidebar navigation & tab bars (18–24px)');
  bestUseCases.push('Form input leading/trailing indicators');

  if (dna.complexity >= 4) {
    bestUseCases.push('Dashboard overview cards (24–32px)');
    avoidUseCases.push('Sub-14px micro badges without retina scaling');
  } else {
    bestUseCases.push('Status pill tags & micro-chips (12–14px)');
  }

  avoidUseCases.push('Large standalone hero illustrations (use dedicated graphic illustrations instead)');
  avoidUseCases.push('Distorted non-uniform aspect ratio scaling');

  const opticalPlacementNotes = `Align along the standard 24×24 center axis. Maintain minimum 4px optical clearance from adjacent text baselines.`;
  const dnaNotes = `Heuristic DNA reveals a ${dna.roundness >= 4 ? 'curved' : 'rectilinear'} structure with a balanced density score of ${dna.density}/5.`;

  return {
    icon,
    recommendedSizes: `${stress.recommendedMinSize}px – ${stress.recommendedMaxSize}px (Native canvas: 24×24px)`,
    optimalStrokeWidth: 2,
    bestUseCases,
    avoidUseCases,
    opticalPlacementNotes,
    dnaNotes,
  };
}
