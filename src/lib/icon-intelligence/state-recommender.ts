import type { Icon } from '@/types/icon';
import type { IconStateMatrixReport, SemanticStateOption, SemanticStateKey } from '@/types/intelligence';

interface StatePattern {
  key: SemanticStateKey;
  label: string;
  suffixes: string[];
  fallbackQueries: string[];
}

const STATE_PATTERNS: StatePattern[] = [
  { key: 'default', label: 'Default State', suffixes: [''], fallbackQueries: [] },
  { key: 'success', label: 'Success / Completed', suffixes: ['-check', '-verified', '-success'], fallbackQueries: ['check-circle', 'check', 'verified-badge'] },
  { key: 'error', label: 'Error / Failed', suffixes: ['-xmark', '-error', '-failed', '-cross'], fallbackQueries: ['xmark-circle', 'xmark', 'warning-circle'] },
  { key: 'warning', label: 'Warning / Alert', suffixes: ['-alert', '-warning'], fallbackQueries: ['warning-triangle', 'alert-circle'] },
  { key: 'loading', label: 'Loading / In-Progress', suffixes: ['-loading', '-sync', '-refresh'], fallbackQueries: ['refresh', 'refresh-double', 'hourglass'] },
  { key: 'active', label: 'Active / Selected', suffixes: ['-fill', '-solid', '-active'], fallbackQueries: [] },
  { key: 'disabled', label: 'Disabled / Blocked', suffixes: ['-off', '-slash', '-disabled', '-lock'], fallbackQueries: ['prohibition', 'lock'] },
  { key: 'add', label: 'Create / Add', suffixes: ['-plus', '-add'], fallbackQueries: ['plus-circle', 'plus'] },
  { key: 'remove', label: 'Remove / Delete', suffixes: ['-minus', '-trash', '-delete'], fallbackQueries: ['minus-circle', 'trash'] },
  { key: 'edit', label: 'Edit / Modify', suffixes: ['-edit', '-pencil'], fallbackQueries: ['edit-pencil', 'edit'] },
];

/**
 * Builds a semantic state matrix for a given icon, finding genuine matching catalog icons.
 */
export function recommendIconStates(
  rootIcon: Icon,
  allIcons: Icon[]
): IconStateMatrixReport {
  const rootBase = rootIcon.slug.split('-')[0];
  const states: SemanticStateOption[] = [];

  for (const pattern of STATE_PATTERNS) {
    if (pattern.key === 'default') {
      states.push({
        stateKey: 'default',
        label: pattern.label,
        icon: rootIcon,
        conceptMatch: rootIcon.name,
        isAvailableInCatalog: true,
      });
      continue;
    }

    // 1. Try family suffix matching (e.g. user-plus, shield-check)
    let matchedIcon: Icon | null = null;
    for (const suffix of pattern.suffixes) {
      const targetSlug = `${rootBase}${suffix}`;
      const found = allIcons.find((i) => i.slug === targetSlug || i.slug === `${rootIcon.slug}${suffix}`);
      if (found) {
        matchedIcon = found;
        break;
      }
    }

    // 2. Try filled variant for 'active'
    if (!matchedIcon && pattern.key === 'active') {
      const filledMatch = allIcons.find((i) => (i.slug === `${rootIcon.slug}-filled` || i.slug === rootIcon.slug) && i.style === 'filled');
      if (filledMatch) matchedIcon = filledMatch;
    }

    // 3. Fallback to canonical semantic indicator icon
    if (!matchedIcon) {
      for (const fq of pattern.fallbackQueries) {
        const found = allIcons.find((i) => i.slug === fq || i.slug.includes(fq));
        if (found) {
          matchedIcon = found;
          break;
        }
      }
    }

    states.push({
      stateKey: pattern.key,
      label: pattern.label,
      icon: matchedIcon,
      conceptMatch: matchedIcon ? matchedIcon.name : 'Not available in catalog',
      isAvailableInCatalog: !!matchedIcon,
    });
  }

  return {
    rootIcon,
    conceptFamily: rootBase,
    states,
  };
}
