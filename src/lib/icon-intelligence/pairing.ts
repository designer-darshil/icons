import type { Icon } from '@/types/icon';
import type { IconPairingReport, IconPairing } from '@/types/intelligence';

interface DirectPairRule {
  targetMatch: (slug: string) => boolean;
  pairQuery: string;
  type: IconPairing['type'];
  relationLabel: string;
}

const DIRECT_PAIR_RULES: DirectPairRule[] = [
  // Directional pairs
  { targetMatch: (s) => s.includes('arrow-left'), pairQuery: 'arrow-right', type: 'Direct pair', relationLabel: 'Forward / Right Navigation' },
  { targetMatch: (s) => s.includes('arrow-right'), pairQuery: 'arrow-left', type: 'Direct pair', relationLabel: 'Back / Left Navigation' },
  { targetMatch: (s) => s.includes('arrow-up'), pairQuery: 'arrow-down', type: 'Direct pair', relationLabel: 'Down Navigation / Scroll' },
  { targetMatch: (s) => s.includes('arrow-down'), pairQuery: 'arrow-up', type: 'Direct pair', relationLabel: 'Up Navigation / Top' },
  { targetMatch: (s) => s.includes('chevron-left'), pairQuery: 'chevron-right', type: 'Direct pair', relationLabel: 'Next Item' },
  { targetMatch: (s) => s.includes('chevron-right'), pairQuery: 'chevron-left', type: 'Direct pair', relationLabel: 'Previous Item' },
  // Boolean & State toggles
  { targetMatch: (s) => s.includes('check'), pairQuery: 'xmark', type: 'Direct pair', relationLabel: 'Dismiss / Reject' },
  { targetMatch: (s) => s.includes('xmark'), pairQuery: 'check', type: 'Direct pair', relationLabel: 'Accept / Confirm' },
  { targetMatch: (s) => s === 'lock' || s.endsWith('-lock'), pairQuery: 'lock-open', type: 'Direct pair', relationLabel: 'Unlocked / Accessible' },
  { targetMatch: (s) => s === 'lock-open' || s.endsWith('-lock-open'), pairQuery: 'lock', type: 'Direct pair', relationLabel: 'Locked / Restricted' },
  { targetMatch: (s) => s === 'eye' || s.endsWith('-eye'), pairQuery: 'eye-off', type: 'Direct pair', relationLabel: 'Hide / Conceal' },
  { targetMatch: (s) => s.includes('eye-off') || s.includes('eye-slash'), pairQuery: 'eye', type: 'Direct pair', relationLabel: 'Show / Reveal' },
  { targetMatch: (s) => s.includes('plus'), pairQuery: 'minus', type: 'Direct pair', relationLabel: 'Subtract / Decrease' },
  { targetMatch: (s) => s.includes('minus'), pairQuery: 'plus', type: 'Direct pair', relationLabel: 'Add / Increase' },
  { targetMatch: (s) => s.includes('sun'), pairQuery: 'moon', type: 'Direct pair', relationLabel: 'Dark Theme / Night' },
  { targetMatch: (s) => s.includes('moon'), pairQuery: 'sun-light', type: 'Direct pair', relationLabel: 'Light Theme / Day' },
  { targetMatch: (s) => s.includes('play'), pairQuery: 'pause', type: 'Direct pair', relationLabel: 'Pause Playback' },
  { targetMatch: (s) => s.includes('pause'), pairQuery: 'play', type: 'Direct pair', relationLabel: 'Resume Playback' },
  { targetMatch: (s) => s.includes('upload'), pairQuery: 'download', type: 'Direct pair', relationLabel: 'Fetch / Download' },
  { targetMatch: (s) => s.includes('download'), pairQuery: 'upload', type: 'Direct pair', relationLabel: 'Import / Upload' },
  { targetMatch: (s) => s.includes('expand'), pairQuery: 'collapse', type: 'Direct pair', relationLabel: 'Collapse View' },
  { targetMatch: (s) => s.includes('collapse'), pairQuery: 'expand', type: 'Direct pair', relationLabel: 'Expand View' },
];

/**
 * Discovers direct opposites, semantic companions, and alternative icons for a given icon.
 */
export function findIconPairings(
  icon: Icon,
  allIcons: Icon[]
): IconPairingReport {
  const pairings: IconPairing[] = [];
  const addedIds = new Set<string>([icon.id]);

  // 1. Check Direct Pair Rules
  for (const rule of DIRECT_PAIR_RULES) {
    if (rule.targetMatch(icon.slug)) {
      const match = allIcons.find((i) => !addedIds.has(i.id) && (i.slug === rule.pairQuery || i.slug.includes(rule.pairQuery)));
      if (match) {
        pairings.push({
          type: rule.type,
          relationLabel: rule.relationLabel,
          pairedIcon: match,
          confidence: 0.95,
        });
        addedIds.add(match.id);
        break;
      }
    }
  }

  // 2. Family companions
  const rootBase = icon.slug.split('-')[0];
  const familyMatches = allIcons.filter(
    (i) => !addedIds.has(i.id) && i.slug.startsWith(`${rootBase}-`) && i.slug !== icon.slug
  );
  for (const fm of familyMatches.slice(0, 3)) {
    pairings.push({
      type: 'Semantic companion',
      relationLabel: `Sibling in ${rootBase} concept family`,
      pairedIcon: fm,
      confidence: 0.85,
    });
    addedIds.add(fm.id);
  }

  // 3. Alternatives in same category
  const categoryAlternatives = allIcons.filter(
    (i) => !addedIds.has(i.id) && i.primaryCategory === icon.primaryCategory
  );
  for (const ca of categoryAlternatives.slice(0, 2)) {
    pairings.push({
      type: 'Alternative',
      relationLabel: `Alternative in ${icon.category}`,
      pairedIcon: ca,
      confidence: 0.7,
    });
    addedIds.add(ca.id);
  }

  return {
    icon,
    pairings: pairings.slice(0, 6),
  };
}
