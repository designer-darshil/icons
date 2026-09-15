import type { Icon } from '@/types/icon';
import type { SetBuilderPreset, ProductPresetType } from '@/types/intelligence';

interface PresetBlueprint {
  id: string;
  productType: ProductPresetType;
  description: string;
  groups: {
    groupName: string;
    conceptQueries: string[];
  }[];
}

const PRESET_BLUEPRINTS: PresetBlueprint[] = [
  {
    id: 'saas',
    productType: 'SaaS',
    description: 'Modern B2B SaaS web application suite with workspace navigation, account controls, and collaboration tools.',
    groups: [
      { groupName: 'Core Navigation', conceptQueries: ['home', 'dashboard', 'folder', 'calendar', 'analytics', 'compass'] },
      { groupName: 'Actions & Workflow', conceptQueries: ['plus', 'edit-pencil', 'trash', 'share', 'upload', 'download', 'filter'] },
      { groupName: 'Account & Security', conceptQueries: ['user', 'user-plus', 'lock', 'shield', 'key', 'bell'] },
      { groupName: 'System & Status', conceptQueries: ['settings', 'check-circle', 'xmark-circle', 'warning-triangle', 'help-circle'] },
    ],
  },
  {
    id: 'e-commerce',
    productType: 'E-commerce',
    description: 'Online store and shopping marketplace with cart, checkout, payment, wishlist, and shipping trackers.',
    groups: [
      { groupName: 'Shopping & Cart', conceptQueries: ['cart', 'shop', 'bag', 'heart', 'tag', 'gift'] },
      { groupName: 'Payment & Checkout', conceptQueries: ['credit-card', 'wallet', 'dollar', 'invoice', 'receipt'] },
      { groupName: 'Logistics & Order Status', conceptQueries: ['delivery-truck', 'box', 'map-pin', 'clock', 'check'] },
      { groupName: 'Customer Support', conceptQueries: ['chat-bubble', 'phone', 'mail', 'help-circle', 'star'] },
    ],
  },
  {
    id: 'finance',
    productType: 'Finance',
    description: 'Fintech and banking dashboard with transactions, accounts, cards, investments, and fraud security.',
    groups: [
      { groupName: 'Accounts & Cards', conceptQueries: ['bank', 'credit-card', 'wallet', 'dollar', 'coin'] },
      { groupName: 'Transactions & Reports', conceptQueries: ['arrow-up-right', 'arrow-down-left', 'stats-report', 'chart-pie', 'invoice'] },
      { groupName: 'Security & Verification', conceptQueries: ['shield-check', 'lock', 'fingerprint-scan', 'key', 'verified-badge'] },
      { groupName: 'Controls', conceptQueries: ['filter', 'download', 'refresh', 'settings', 'bell'] },
    ],
  },
  {
    id: 'dashboard',
    productType: 'Dashboard',
    description: 'Analytical data reporting and metrics monitor with charts, filters, tables, and export tools.',
    groups: [
      { groupName: 'Analytics & Metrics', conceptQueries: ['stats-report', 'chart-pie', 'activity', 'trend-up', 'database'] },
      { groupName: 'View & Layout Controls', conceptQueries: ['view-columns-2', 'grid', 'table', 'filter', 'search'] },
      { groupName: 'Export & Share', conceptQueries: ['download', 'share', 'printer', 'mail', 'link'] },
      { groupName: 'Status & Notifications', conceptQueries: ['bell', 'check-circle', 'warning-triangle', 'refresh'] },
    ],
  },
  {
    id: 'developer-tool',
    productType: 'Developer Tool',
    description: 'Engineering workbench with code editors, git workflows, terminals, APIs, and cloud infrastructure.',
    groups: [
      { groupName: 'Code & Terminal', conceptQueries: ['code', 'terminal', 'bug', 'cpu', 'database'] },
      { groupName: 'Git & Versioning', conceptQueries: ['git-branch', 'git-commit', 'git-pull-request', 'git-merge', 'git-fork'] },
      { groupName: 'Cloud & Infrastructure', conceptQueries: ['cloud', 'server', 'wifi', 'lock', 'shield'] },
      { groupName: 'Dev Utilities', conceptQueries: ['wrench', 'settings', 'copy', 'trash', 'play'] },
    ],
  },
  {
    id: 'mobile-app',
    productType: 'Mobile App',
    description: 'Compact mobile app UI suite with bottom navigation bar, camera, profile, and gestures.',
    groups: [
      { groupName: 'Tab Bar Navigation', conceptQueries: ['home', 'search', 'plus-circle', 'bell', 'user'] },
      { groupName: 'Media & Capture', conceptQueries: ['camera', 'media-image', 'microphone', 'video', 'music-note'] },
      { groupName: 'Interactions', conceptQueries: ['heart', 'chat-bubble', 'share-android', 'bookmark', 'more-horiz'] },
      { groupName: 'System Controls', conceptQueries: ['arrow-left', 'xmark', 'settings', 'wifi', 'battery'] },
    ],
  },
];

/**
 * Builds a curated preset icon set for a given product type, matching against real catalog icons.
 */
export function buildPresetIconSet(
  productType: ProductPresetType,
  allIcons: Icon[]
): SetBuilderPreset {
  const blueprint = PRESET_BLUEPRINTS.find((b) => b.productType === productType) || PRESET_BLUEPRINTS[0];

  const groups = blueprint.groups.map((grp) => {
    const recommendedIcons: Icon[] = [];
    const addedIds = new Set<string>();

    for (const query of grp.conceptQueries) {
      // Find exact or closest match in catalog
      const match = allIcons.find(
        (i) => !addedIds.has(i.id) && (i.slug === query || i.slug.startsWith(`${query}-`) || i.slug.includes(query))
      );
      if (match) {
        recommendedIcons.push(match);
        addedIds.add(match.id);
      }
    }

    return {
      groupName: grp.groupName,
      requiredConcepts: grp.conceptQueries,
      recommendedIcons,
    };
  });

  return {
    id: blueprint.id,
    productType: blueprint.productType,
    description: blueprint.description,
    groups,
  };
}

export function getAllPresetTypes(): ProductPresetType[] {
  return PRESET_BLUEPRINTS.map((b) => b.productType);
}
