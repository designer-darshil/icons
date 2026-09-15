import type { Icon } from '@/types/icon';
import type { IconStressTestReport, SizeEvaluation, StressTestSize } from '@/types/intelligence';
import { calculateIconDna } from './dna';

const STRESS_SIZES: StressTestSize[] = [12, 14, 16, 18, 20, 24, 32, 48, 64];

/**
 * Evaluates an icon across the full pixel stress-test scale (12px to 64px).
 * Uses DNA complexity and density heuristics to determine legibility boundaries.
 */
export function evaluateIconStressTest(icon: Icon): IconStressTestReport {
  const dna = calculateIconDna(icon);
  const evaluations: SizeEvaluation[] = [];

  for (const size of STRESS_SIZES) {
    let status: SizeEvaluation['status'] = 'Good';
    let legibilityScore = 100;
    let apparentDensity: SizeEvaluation['apparentDensity'] = 'Optimal';
    let notes = 'Crisp geometric clarity on standard and high-DPI displays.';

    if (size <= 14) {
      if (dna.complexity >= 4 || dna.density >= 4) {
        status = 'Weak';
        legibilityScore = 45;
        apparentDensity = 'Crowded';
        notes = 'High path density risks optical clumping and blurring at sub-16px viewports.';
      } else if (dna.complexity === 3) {
        status = 'Caution';
        legibilityScore = 70;
        apparentDensity = 'Crowded';
        notes = 'Legible on 2x+ displays; test carefully on low-DPI 1x rendering.';
      } else {
        status = 'Good';
        legibilityScore = 90;
        apparentDensity = 'Crisp';
        notes = 'Minimal geometry retains excellent silhouette clarity at micro dimensions.';
      }
    } else if (size <= 20) {
      if (dna.complexity === 5) {
        status = 'Caution';
        legibilityScore = 75;
        apparentDensity = 'Crowded';
        notes = 'Fine path details may lose separation without high contrast.';
      } else {
        status = 'Good';
        legibilityScore = 95;
        apparentDensity = 'Optimal';
        notes = 'Balanced optical weight for navigation items and form inputs.';
      }
    } else if (size === 24) {
      // Native Gridframe canvas
      status = 'Good';
      legibilityScore = 100;
      apparentDensity = 'Optimal';
      notes = 'Native 1:1 design canvas with exact 24×24 pixel grid alignment.';
    } else if (size >= 48) {
      if (dna.complexity <= 1 && dna.density <= 1) {
        status = 'Caution';
        legibilityScore = 80;
        apparentDensity = 'Sparse';
        notes = 'Minimal geometry may feel sparse at large hero/display scale.';
      } else {
        status = 'Good';
        legibilityScore = 98;
        apparentDensity = 'Crisp';
        notes = 'Excellent fidelity and clean curve resolution for modal headers or marketing cards.';
      }
    }

    evaluations.push({
      size,
      status,
      legibilityScore,
      apparentDensity,
      notes,
    });
  }

  // Recommended Range
  const minGood = evaluations.find((e) => e.status === 'Good')?.size || 16;
  const maxGood = evaluations.filter((e) => e.status === 'Good').pop()?.size || 48;

  return {
    icon,
    evaluations,
    recommendedMinSize: minGood,
    recommendedMaxSize: maxGood,
  };
}
