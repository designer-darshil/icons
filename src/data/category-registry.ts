/**
 * OFFICIAL GRIDFRAME CATEGORY REGISTRY
 *
 * Canonical category structure strictly conforming to the 44-category taxonomy.
 * Preserves exact canonical ordering, deterministic lowercase kebab-case slugs,
 * and semantic definitions.
 */

export interface CanonicalCategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export const OFFICIAL_CATEGORIES: CanonicalCategoryDefinition[] = [
  {
    id: 'cloud',
    name: 'Cloud',
    slug: 'cloud',
    description: 'Cloud infrastructure, cloud storage, hosting, sync, remote services',
    order: 1,
  },
  {
    id: 'communication',
    name: 'Communication',
    slug: 'communication',
    description: 'Messages, chat, email, calls, conversations, communication actions',
    order: 2,
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Clothing, footwear, accessories, apparel',
    order: 3,
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Business operations, companies, offices, management, professional workflows',
    order: 4,
  },
  {
    id: 'buildings',
    name: 'Buildings',
    slug: 'buildings',
    description: 'Homes, offices, schools, hospitals, public buildings, structures',
    order: 5,
  },
  {
    id: 'audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Speakers, microphones, volume, sound controls, audio hardware',
    order: 6,
  },
  {
    id: 'animations',
    name: 'Animations',
    slug: 'animations',
    description: 'Motion, transitions, playback animation concepts, animation controls',
    order: 7,
  },
  {
    id: 'animals',
    name: 'Animals',
    slug: 'animals',
    description: 'Animal species, animal-related concepts, pets, wildlife',
    order: 8,
  },
  {
    id: 'activities',
    name: 'Activities',
    slug: 'activities',
    description: 'Sports, leisure, events, hobbies, physical activities',
    order: 9,
  },
  {
    id: 'actions',
    name: 'Actions',
    slug: 'actions',
    description: 'Generic UI actions such as add, edit, delete, save, undo, redo',
    order: 10,
  },
  {
    id: 'connectivity',
    name: 'Connectivity',
    slug: 'connectivity',
    description: 'Wifi, bluetooth, signal, network, connection, pairing',
    order: 11,
  },
  {
    id: 'database',
    name: 'Database',
    slug: 'database',
    description: 'Databases, tables, storage systems, schemas, records',
    order: 12,
  },
  {
    id: 'design-tools',
    name: 'Design Tools',
    slug: 'design-tools',
    description: 'Design software concepts, canvas tools, pen tools, layers, components, design systems',
    order: 13,
  },
  {
    id: 'development',
    name: 'Development',
    slug: 'development',
    description: 'Code, programming, APIs, terminals, syntax, frameworks, development workflows',
    order: 14,
  },
  {
    id: 'devices',
    name: 'Devices',
    slug: 'devices',
    description: 'Phones, laptops, tablets, monitors, hardware and electronics',
    order: 15,
  },
  {
    id: 'docs',
    name: 'Docs',
    slug: 'docs',
    description: 'Documents, files, notes, pages, text documents, documentation',
    order: 16,
  },
  {
    id: 'emojis',
    name: 'Emojis',
    slug: 'emojis',
    description: 'Emoji-style symbols, expressive faces, reactions',
    order: 17,
  },
  {
    id: 'finance',
    name: 'Finance',
    slug: 'finance',
    description: 'Money, payments, banking, cards, transactions, currency, accounting',
    order: 18,
  },
  {
    id: 'food',
    name: 'Food',
    slug: 'food',
    description: 'Food, beverages, cooking, restaurants, ingredients, meals',
    order: 19,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Games, controllers, consoles, achievements, game mechanics',
    order: 20,
  },
  {
    id: 'gestures',
    name: 'Gestures',
    slug: 'gestures',
    description: 'Hand gestures, touch gestures, pointing, swiping, interaction gestures',
    order: 21,
  },
  {
    id: 'git',
    name: 'Git',
    slug: 'git',
    description: 'Git branches, commits, repositories, pull requests, merge, version control',
    order: 22,
  },
  {
    id: 'health',
    name: 'Health',
    slug: 'health',
    description: 'Medical, wellness, healthcare, fitness-health context, diagnostics',
    order: 23,
  },
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    description: 'Household, rooms, furniture, appliances, home controls',
    order: 24,
  },
  {
    id: 'identity',
    name: 'Identity',
    slug: 'identity',
    description: 'Identity, profiles, authentication identity, verification, credentials',
    order: 25,
  },
  {
    id: 'layout',
    name: 'Layout',
    slug: 'layout',
    description: 'Alignment, grids, columns, panels, spacing, layout structures',
    order: 26,
  },
  {
    id: 'maps',
    name: 'Maps',
    slug: 'maps',
    description: 'Maps, locations, coordinates, navigation maps, geographic markers',
    order: 27,
  },
  {
    id: 'music',
    name: 'Music',
    slug: 'music',
    description: 'Music, instruments, tracks, playlists, albums, musical controls',
    order: 28,
  },
  {
    id: 'nature',
    name: 'Nature',
    slug: 'nature',
    description: 'Plants, trees, flowers, landscapes, natural environments',
    order: 29,
  },
  {
    id: 'navigation',
    name: 'Navigation',
    slug: 'navigation',
    description: 'Wayfinding, directional navigation, menus, arrows, breadcrumbs, location movement within interfaces',
    order: 30,
  },
  {
    id: 'organization',
    name: 'Organization',
    slug: 'organization',
    description: 'Folders, collections, groups, sorting, structure, organization concepts',
    order: 31,
  },
  {
    id: 'other',
    name: 'Other',
    slug: 'other',
    description: 'Icons that genuinely do not fit another category',
    order: 32,
  },
  {
    id: 'photos-and-videos',
    name: 'Photos and Videos',
    slug: 'photos-and-videos',
    description: 'Photos, galleries, video, cameras/media content, playback media',
    order: 33,
  },
  {
    id: 'science',
    name: 'Science',
    slug: 'science',
    description: 'Science, chemistry, physics, biology, laboratory, measurement',
    order: 34,
  },
  {
    id: 'security',
    name: 'Security',
    slug: 'security',
    description: 'Security, privacy, locks, permissions, encryption, protection',
    order: 35,
  },
  {
    id: 'shapes',
    name: 'Shapes',
    slug: 'shapes',
    description: 'Basic geometric shapes, circles, squares, triangles, polygons, symbols',
    order: 36,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    slug: 'shopping',
    description: 'Shopping, cart, products, stores, checkout, orders',
    order: 37,
  },
  {
    id: 'social',
    name: 'Social',
    slug: 'social',
    description: 'Social networks, sharing, reactions, followers, communities',
    order: 38,
  },
  {
    id: 'system',
    name: 'System',
    slug: 'system',
    description: 'System controls, settings, configuration, status, OS/system concepts',
    order: 39,
  },
  {
    id: 'tools',
    name: 'Tools',
    slug: 'tools',
    description: 'Tools, utilities, repair, construction, maintenance',
    order: 40,
  },
  {
    id: 'transport',
    name: 'Transport',
    slug: 'transport',
    description: 'Cars, buses, trains, bicycles, airplanes, ships, transportation',
    order: 41,
  },
  {
    id: 'typography',
    name: 'Typography',
    slug: 'typography',
    description: 'Text formatting, fonts, alignment, headings, text controls, typography',
    order: 42,
  },
  {
    id: 'users',
    name: 'Users',
    slug: 'users',
    description: 'People, accounts, teams, profiles, user management',
    order: 43,
  },
  {
    id: 'weather',
    name: 'Weather',
    slug: 'weather',
    description: 'Weather conditions, forecasts, climate, temperature, precipitation',
    order: 44,
  },
];

export const TOTAL_OFFICIAL_CATEGORY_COUNT = OFFICIAL_CATEGORIES.length;

// Precomputed lookup maps for O(1) resolution
export const CATEGORY_BY_SLUG = new Map<string, CanonicalCategoryDefinition>(
  OFFICIAL_CATEGORIES.map((c) => [c.slug, c])
);

export const CATEGORY_BY_ID = new Map<string, CanonicalCategoryDefinition>(
  OFFICIAL_CATEGORIES.map((c) => [c.id, c])
);

export const CATEGORY_BY_NAME_LOWER = new Map<string, CanonicalCategoryDefinition>(
  OFFICIAL_CATEGORIES.map((c) => [c.name.toLowerCase(), c])
);

/**
 * Normalizes any category string (name, slug, id) to its canonical slug.
 */
export function normalizeCategorySlug(input: string): string {
  if (!input) return 'other';
  const clean = input.trim().toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
  if (CATEGORY_BY_SLUG.has(clean)) return clean;
  
  const fromName = CATEGORY_BY_NAME_LOWER.get(input.trim().toLowerCase());
  if (fromName) return fromName.slug;

  // Semantic alias mappings for old category names
  const legacyAliases: Record<string, string> = {
    interface: 'actions',
    arrows: 'navigation',
    files: 'docs',
    media: 'photos-and-videos',
    time: 'system',
    people: 'users',
    design: 'design-tools',
    commerce: 'shopping',
    editor: 'typography',
    text: 'typography',
    transportation: 'transport',
    accessibility: 'system',
  };

  if (legacyAliases[clean]) return legacyAliases[clean];

  return 'other';
}

/**
 * Resolves a category string to its canonical definition.
 */
export function getCanonicalCategory(input: string): CanonicalCategoryDefinition {
  const slug = normalizeCategorySlug(input);
  return CATEGORY_BY_SLUG.get(slug) || CATEGORY_BY_SLUG.get('other')!;
}
