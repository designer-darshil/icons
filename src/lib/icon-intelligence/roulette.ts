import type { Icon } from '@/types/icon';
import type { RouletteCandidate } from '@/types/intelligence';
import { calculateIconDna } from './dna';

/**
 * Selects a serendipitous, high-utility icon candidate with contextual trivia for Discovery Roulette.
 */
export function spinIconRoulette(
  allIcons: Icon[],
  excludeIds: string[] = []
): RouletteCandidate {
  const eligible = allIcons.filter((i) => !excludeIds.includes(i.id));
  const pool = eligible.length > 0 ? eligible : allIcons;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const icon = pool[randomIndex];

  const dna = calculateIconDna(icon);

  let reason = 'Curated discovery pick from the Gridframe 24×24 vector catalog.';
  let surprisingFact = `Features ${dna.roundness >= 4 ? 'predominantly curved' : 'crisp rectilinear'} geometry with ${dna.pathCount} distinct SVG path segment${dna.pathCount > 1 ? 's' : ''}.`;

  if (icon.primaryCategory === 'development') {
    reason = 'Essential symbol for developer toolchains and code architectures.';
  } else if (icon.primaryCategory === 'security') {
    reason = 'Key visual anchor for authentication and privacy interfaces.';
  } else if (icon.primaryCategory === 'finance') {
    reason = 'Crucial asset for transactions, billing, and checkout flows.';
  }

  return {
    icon,
    reason,
    surprisingFact,
  };
}
