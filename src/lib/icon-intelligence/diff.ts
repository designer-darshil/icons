import type { Icon } from '@/types/icon';
import type { IconSetDiffResult } from '@/types/intelligence';
import { calculateSimilarityScore } from './similarity';
import { calculateIconDna } from './dna';

/**
 * Computes a structural and visual difference report between two icon collections.
 */
export function diffIconSets(
  originalSet: Icon[],
  targetSet: Icon[]
): IconSetDiffResult {
  const originalIds = new Set(originalSet.map((i) => i.id));
  const targetIds = new Set(targetSet.map((i) => i.id));

  const added: Icon[] = [];
  const removed: Icon[] = [];
  const replaced: IconSetDiffResult['replaced'] = [];
  const visualDifferences: IconSetDiffResult['visualDifferences'] = [];

  // Identify added and retained icons in targetSet
  for (const icon of targetSet) {
    if (!originalIds.has(icon.id)) {
      added.push(icon);
    }
  }

  // Identify removed icons in originalSet
  for (const icon of originalSet) {
    if (!targetIds.has(icon.id)) {
      removed.push(icon);
    }
  }

  // Detect replacements (e.g. user replaced arrow-left with chevron-left or home with dashboard)
  const matchedAddedIds = new Set<string>();
  for (const orig of removed) {
    for (const add of added) {
      if (!matchedAddedIds.has(add.id)) {
        const { score } = calculateSimilarityScore(orig, add);
        if (score >= 60 || orig.primaryCategory === add.primaryCategory) {
          replaced.push({
            original: orig,
            replacement: add,
            similarityScore: score,
          });
          matchedAddedIds.add(add.id);
          break;
        }
      }
    }
  }

  // Detect visual differences across retained icons
  for (const orig of originalSet) {
    const matchingTarget = targetSet.find((t) => t.id === orig.id);
    if (matchingTarget) {
      if (orig.style !== matchingTarget.style) {
        visualDifferences.push({
          icon: matchingTarget,
          issue: `Style changed from ${orig.style} to ${matchingTarget.style}`,
        });
      }
      const origDna = calculateIconDna(orig);
      const targetDna = calculateIconDna(matchingTarget);
      if (Math.abs(origDna.weight - targetDna.weight) >= 2) {
        visualDifferences.push({
          icon: matchingTarget,
          issue: `Visual weight discrepancy detected`,
        });
      }
    }
  }

  return {
    added,
    removed,
    replaced,
    visualDifferences,
    summary: {
      addedCount: added.length,
      removedCount: removed.length,
      replacedCount: replaced.length,
      outlierCount: visualDifferences.length,
    },
  };
}
