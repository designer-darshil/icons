import type { Icon } from '@/types/icon';
import type { MissingIconsReport, MissingIconSuggestion } from '@/types/intelligence';

// Core UI Domain Concept Clusters
interface ConceptCluster {
  domain: string;
  triggerConcepts: string[];
  essentialConcepts: { concept: string; tier: 'Recommended' | 'Possible' | 'Optional'; query: string; reason: string }[];
}

const UI_CONCEPT_CLUSTERS: ConceptCluster[] = [
  {
    domain: 'Navigation & Shell',
    triggerConcepts: ['home', 'compass', 'menu', 'search', 'navigation'],
    essentialConcepts: [
      { concept: 'Back / Arrow Left', tier: 'Recommended', query: 'arrow-left', reason: 'Essential for hierarchical screen navigation' },
      { concept: 'Close / Dismiss', tier: 'Recommended', query: 'xmark', reason: 'Critical for modal, banner, and drawer closure' },
      { concept: 'More Actions', tier: 'Recommended', query: 'more-horiz', reason: 'Overflow dropdown and context menu trigger' },
      { concept: 'Menu / Hamburger', tier: 'Possible', query: 'menu', reason: 'Mobile navigation drawer trigger' },
      { concept: 'Filter / Refine', tier: 'Possible', query: 'filter', reason: 'Data filtering and faceted search' },
      { concept: 'Refresh / Reload', tier: 'Optional', query: 'refresh', reason: 'Data synchronization & reload indicator' },
    ],
  },
  {
    domain: 'Account & Identity',
    triggerConcepts: ['user', 'profile', 'avatar', 'identity', 'auth'],
    essentialConcepts: [
      { concept: 'Settings / Preferences', tier: 'Recommended', query: 'settings', reason: 'User configuration and system preferences' },
      { concept: 'Lock / Security', tier: 'Recommended', query: 'lock', reason: 'Authentication and access control' },
      { concept: 'Notifications / Bell', tier: 'Recommended', query: 'bell', reason: 'User alerts, activity, and message badges' },
      { concept: 'Logout / Exit', tier: 'Possible', query: 'log-out', reason: 'Session termination' },
      { concept: 'User Add / Invite', tier: 'Optional', query: 'user-plus', reason: 'Member onboarding and team sharing' },
    ],
  },
  {
    domain: 'E-commerce & Shopping',
    triggerConcepts: ['cart', 'bag', 'shop', 'wallet', 'checkout', 'price'],
    essentialConcepts: [
      { concept: 'Shopping Bag / Cart', tier: 'Recommended', query: 'cart', reason: 'Order basket and checkout status' },
      { concept: 'Credit Card / Payment', tier: 'Recommended', query: 'credit-card', reason: 'Payment method checkout flow' },
      { concept: 'Heart / Wishlist', tier: 'Recommended', query: 'heart', reason: 'Item favoriting and bookmarking' },
      { concept: 'Tag / Discount', tier: 'Possible', query: 'tag', reason: 'Promotions, coupon codes, and pricing tiers' },
      { concept: 'Truck / Delivery', tier: 'Possible', query: 'delivery-truck', reason: 'Shipping tracking and logistics' },
    ],
  },
  {
    domain: 'Media & Audio/Video',
    triggerConcepts: ['play', 'video', 'music', 'sound', 'camera'],
    essentialConcepts: [
      { concept: 'Play / Pause', tier: 'Recommended', query: 'play', reason: 'Playback control state' },
      { concept: 'Volume High / Low', tier: 'Recommended', query: 'volume-high', reason: 'Audio level adjustment' },
      { concept: 'Volume Mute', tier: 'Recommended', query: 'volume-mute', reason: 'Mute/unmute state toggle' },
      { concept: 'Fullscreen', tier: 'Possible', query: 'expand', reason: 'Media display expander' },
    ],
  },
  {
    domain: 'Documents & File Operations',
    triggerConcepts: ['file', 'folder', 'doc', 'page', 'archive'],
    essentialConcepts: [
      { concept: 'Folder', tier: 'Recommended', query: 'folder', reason: 'Directory categorization' },
      { concept: 'Upload', tier: 'Recommended', query: 'upload', reason: 'File transfer import' },
      { concept: 'Download', tier: 'Recommended', query: 'download', reason: 'File export & asset fetching' },
      { concept: 'Trash / Delete', tier: 'Recommended', query: 'trash', reason: 'Asset removal and purging' },
      { concept: 'Edit / Pencil', tier: 'Possible', query: 'edit-pencil', reason: 'Document metadata inline modification' },
      { concept: 'Share / Export', tier: 'Possible', query: 'share', reason: 'File sharing and link distribution' },
    ],
  },
];

/**
 * Identifies missing recommended concepts based on the semantics of current set icons.
 */
export function detectMissingIcons(
  currentIcons: Icon[],
  catalogIcons: Icon[]
): MissingIconsReport {
  if (!currentIcons || currentIcons.length === 0) {
    return {
      detectedCategoryPatterns: [],
      totalSuggested: 0,
      suggestions: [],
    };
  }

  const currentSlugs = new Set(currentIcons.map((i) => i.slug.toLowerCase()));
  const currentTags = new Set(currentIcons.flatMap((i) => i.tags.map((t) => t.toLowerCase())));

  const matchedDomains = new Set<string>();
  const suggestions: MissingIconSuggestion[] = [];
  const addedConcepts = new Set<string>();

  for (const cluster of UI_CONCEPT_CLUSTERS) {
    // Check if cluster triggers apply to current set
    const isTriggered = cluster.triggerConcepts.some(
      (tc) =>
        currentSlugs.has(tc) ||
        Array.from(currentSlugs).some((s) => s.includes(tc)) ||
        currentTags.has(tc)
    );

    if (isTriggered || currentIcons.length >= 3) {
      matchedDomains.add(cluster.domain);

      for (const essential of cluster.essentialConcepts) {
        // Check if concept is already in current set
        const alreadyPresent = Array.from(currentSlugs).some(
          (s) => s.includes(essential.query) || s === essential.query
        );

        if (!alreadyPresent && !addedConcepts.has(essential.concept)) {
          addedConcepts.add(essential.concept);

          // Find candidate icons from catalog
          const matches = catalogIcons
            .filter((i) => i.slug.includes(essential.query) || i.tags.includes(essential.query))
            .slice(0, 3);

          if (matches.length > 0) {
            suggestions.push({
              concept: essential.concept,
              tier: essential.tier,
              reason: essential.reason,
              matchingCatalogIcons: matches,
            });
          }
        }
      }
    }
  }

  return {
    detectedCategoryPatterns: Array.from(matchedDomains),
    totalSuggested: suggestions.length,
    suggestions: suggestions.slice(0, 8),
  };
}
