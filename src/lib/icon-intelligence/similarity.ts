import type { Icon } from '@/types/icon';
import type { SimilarIconResult } from '@/types/intelligence';
import { calculateIconDna } from './dna';

/**
 * Calculates a multi-factor similarity score between a target icon and a candidate icon.
 * Evaluates DNA geometry profile, tag/keyword semantics, and category proximity.
 */
export function calculateSimilarityScore(
  target: Icon,
  candidate: Icon
): { score: number; matchedFactors: string[] } {
  if (target.id === candidate.id) {
    return { score: 100, matchedFactors: ['Exact match'] };
  }

  const factors: string[] = [];
  let score = 0;

  // 1. DNA Geometric Similarity (40% max)
  const targetDna = calculateIconDna(target);
  const candDna = calculateIconDna(candidate);

  const dnaDelta =
    Math.abs(targetDna.weight - candDna.weight) +
    Math.abs(targetDna.roundness - candDna.roundness) +
    Math.abs(targetDna.density - candDna.density) +
    Math.abs(targetDna.symmetry - candDna.symmetry) +
    Math.abs(targetDna.complexity - candDna.complexity);

  // Maximum possible DNA delta is 20 (5 metrics * max diff of 4)
  const dnaScore = Math.max(0, 40 - dnaDelta * 2.5);
  score += dnaScore;

  if (targetDna.roundness === candDna.roundness && targetDna.roundness >= 4) {
    factors.push('Shared curvilinear geometry');
  } else if (targetDna.roundness === candDna.roundness && targetDna.roundness <= 2) {
    factors.push('Shared rectilinear geometry');
  }

  if (targetDna.density === candDna.density) {
    factors.push('Matching visual density');
  }

  // 2. Category Proximity (25% max)
  if (target.primaryCategory && candidate.primaryCategory && target.primaryCategory === candidate.primaryCategory) {
    score += 25;
    factors.push(`Same category (${target.category})`);
  } else if (target.category.toLowerCase() === candidate.category.toLowerCase()) {
    score += 20;
    factors.push(`Category overlap`);
  }

  // 3. Family / Slug prefix matching (20% max)
  const targetPrefix = target.slug.split('-')[0];
  const candPrefix = candidate.slug.split('-')[0];
  if (targetPrefix && targetPrefix.length >= 3 && targetPrefix === candPrefix) {
    score += 20;
    factors.push(`Concept family prefix (${targetPrefix})`);
  } else if (target.family && candidate.family && target.family === candidate.family) {
    score += 15;
    factors.push(`Shared family`);
  }

  // 4. Tag and Keyword Overlap (15% max)
  const targetTags = new Set(target.tags.map((t) => t.toLowerCase()));
  let sharedTags = 0;
  for (const t of candidate.tags) {
    if (targetTags.has(t.toLowerCase())) {
      sharedTags++;
    }
  }
  const tagScore = Math.min(15, sharedTags * 5);
  score += tagScore;
  if (sharedTags > 0) {
    factors.push(`${sharedTags} shared search semantic tag${sharedTags > 1 ? 's' : ''}`);
  }

  return {
    score: Math.min(99, Math.round(score)),
    matchedFactors: factors.length > 0 ? factors : ['Optical balance alignment'],
  };
}

/**
 * Finds the top most similar icons across a candidate pool or catalog.
 */
export function findSimilarIcons(
  target: Icon,
  allIcons: Icon[],
  limit: number = 12
): SimilarIconResult[] {
  const results: SimilarIconResult[] = [];

  for (const candidate of allIcons) {
    if (candidate.id === target.id) continue;

    const { score, matchedFactors } = calculateSimilarityScore(target, candidate);
    if (score >= 40) {
      let matchTier: SimilarIconResult['matchTier'] = 'Loosely similar';
      if (score >= 75) matchTier = 'Most similar';
      else if (score >= 60) matchTier = 'Related';

      results.push({
        icon: candidate,
        similarityScore: score,
        matchTier,
        matchedFactors,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return results.slice(0, limit);
}
