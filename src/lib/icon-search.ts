import type { Icon } from '@/types/icon';
import type { SearchSuggestion } from '@/types/filters';

export interface SearchMatch {
  icon: Icon;
  score: number;
}

/**
 * Rich domain-specific synonyms and alias mapping
 * Maps common designer and developer query terms to canonical icon keywords
 */
export const SYNONYMS: Record<string, string[]> = {
  // Actions & Utilities
  trash: ['delete', 'remove', 'bin', 'discard', 'recycle', 'rubbish', 'clear', 'destroy'],
  delete: ['trash', 'remove', 'bin', 'discard', 'recycle', 'rubbish', 'clear'],
  remove: ['trash', 'delete', 'bin', 'minus', 'dismiss', 'cancel'],
  add: ['plus', 'create', 'new', 'insert', 'append'],
  plus: ['add', 'create', 'new', 'positive', 'more'],
  minus: ['subtract', 'remove', 'less', 'decrease', 'negative'],
  edit: ['pencil', 'write', 'modify', 'update', 'compose', 'pen', 'draw'],
  pencil: ['edit', 'write', 'modify', 'draw', 'pen'],
  pen: ['edit', 'write', 'draw', 'pencil'],
  search: ['find', 'lookup', 'magnifier', 'explore', 'query', 'discover', 'inspect', 'glass'],
  find: ['search', 'lookup', 'magnifier', 'query'],
  copy: ['duplicate', 'clone', 'clipboard', 'replicate'],
  paste: ['clipboard', 'insert', 'attach'],
  save: ['disk', 'download', 'store', 'keep', 'bookmark', 'floppy'],
  download: ['save', 'export', 'fetch', 'receive', 'get', 'arrow-down'],
  upload: ['publish', 'share', 'send', 'cloud-upload', 'arrow-up'],
  share: ['forward', 'distribute', 'export', 'link', 'social', 'send'],
  refresh: ['reload', 'sync', 'update', 'rotate', 'cycle', 'repeat'],
  sync: ['refresh', 'reload', 'cloud', 'cycle', 'exchange'],

  // Identity & People
  user: ['profile', 'account', 'person', 'avatar', 'member', 'human', 'individual', 'customer'],
  profile: ['user', 'account', 'person', 'avatar', 'identity'],
  account: ['user', 'profile', 'person', 'login', 'auth'],
  group: ['users', 'team', 'community', 'people', 'collaborate', 'organization'],
  team: ['group', 'users', 'community', 'collaborators', 'members'],

  // Security & Authentication
  lock: ['secure', 'protect', 'safety', 'private', 'auth', 'password', 'key', 'encryption'],
  unlock: ['open', 'public', 'unsecure', 'access', 'grant'],
  key: ['lock', 'auth', 'token', 'security', 'password', 'login'],
  shield: ['protect', 'security', 'guard', 'defense', 'safe', 'safety', 'verify'],
  security: ['lock', 'shield', 'protect', 'key', 'auth', 'guard', 'safe'],
  check: ['done', 'success', 'complete', 'ok', 'tick', 'verify', 'confirm', 'pass'],
  close: ['cancel', 'dismiss', 'exit', 'cross', 'x', 'stop', 'remove'],

  // Communication & Media
  mail: ['email', 'message', 'envelope', 'inbox', 'letter', 'send', 'contact'],
  message: ['mail', 'chat', 'comment', 'discussion', 'speech', 'bubble', 'sms'],
  chat: ['message', 'comment', 'talk', 'speech', 'discussion', 'bubble'],
  bell: ['notification', 'alert', 'alarm', 'reminder', 'notice', 'ring'],
  heart: ['favorite', 'like', 'love', 'bookmark', 'save', 'appreciate'],
  star: ['rating', 'favorite', 'bookmark', 'featured', 'score', 'rate'],
  eye: ['view', 'show', 'visible', 'preview', 'look', 'watch', 'observe'],

  // System, Cloud & Dev
  settings: ['gear', 'cog', 'config', 'preference', 'options', 'parameters', 'adjust'],
  gear: ['settings', 'cog', 'config', 'options', 'setup'],
  cloud: ['server', 'backup', 'storage', 'sync', 'weather', 'network', 'online'],
  folder: ['directory', 'collection', 'group', 'storage', 'file', 'binder'],
  file: ['document', 'page', 'paper', 'sheet', 'note', 'article', 'record'],
  code: ['developer', 'programming', 'script', 'terminal', 'html', 'syntax', 'brackets'],
  terminal: ['console', 'command', 'cli', 'code', 'shell', 'prompt', 'bash'],
  database: ['data', 'storage', 'sql', 'server', 'table', 'backend', 'db'],
  zap: ['lightning', 'bolt', 'flash', 'energy', 'power', 'fast', 'quick', 'electric'],
  arrow: ['direction', 'navigate', 'pointer', 'move', 'cursor', 'next', 'previous'],

  // Commerce & Hardware
  cart: ['shopping', 'bag', 'store', 'checkout', 'ecommerce', 'buy', 'order', 'market'],
  shop: ['cart', 'store', 'market', 'commerce', 'bag', 'buy'],
  bag: ['shopping', 'cart', 'store', 'purchase', 'pack'],
  wallet: ['money', 'payment', 'cash', 'card', 'finance', 'currency'],
  phone: ['mobile', 'call', 'device', 'smartphone', 'telephone', 'contact'],
};

/**
 * Pre-computed search document representation for high-speed indexing
 */
interface IndexedIcon {
  icon: Icon;
  name: string;
  nameTokens: string[];
  slug: string;
  slugTokens: string[];
  family: string;
  category: string;
  primaryCategory: string;
  secondaryCategories: string[];
  allCategoryTokens: string[];
  tags: string[];
  keywords: string[];
  aliases: string[];
  useCases: string[];
  legacySlugs: string[];
  styles: string[];
  searchTokens: Set<string>;
}

let cachedIndex: { iconsRef: Icon[]; indexed: IndexedIcon[] } | null = null;

function getOrCreateIndex(icons: Icon[]): IndexedIcon[] {
  if (cachedIndex && cachedIndex.iconsRef === icons) {
    return cachedIndex.indexed;
  }

  const indexed: IndexedIcon[] = icons.map((icon) => {
    const nameLower = icon.name.toLowerCase();
    const nameTokens = nameLower.split(/[\s-_]+/).filter(Boolean);
    const slugLower = icon.slug.toLowerCase();
    const slugTokens = slugLower.split(/[\s-_]+/).filter(Boolean);
    const familyLower = (icon.family || '').toLowerCase();
    const categoryLower = icon.category.toLowerCase();
    const primaryCategory = (icon.primaryCategory || icon.category || '').toLowerCase();
    const secondaryCategories = (icon.secondaryCategories || []).map((s) => s.toLowerCase());
    const allCategoryTokens = [categoryLower, primaryCategory, ...secondaryCategories];

    const tagsLower = icon.tags.map((t) => t.toLowerCase());
    const keywordsLower = icon.keywords.map((k) => k.toLowerCase());
    const aliasesLower = (icon.aliases || []).map((a) => a.toLowerCase());
    const useCasesLower = (icon.useCases || []).map((u) => u.toLowerCase());
    const legacyLower = (icon.legacySlugs || []).map((l) => l.toLowerCase());
    const stylesLower = icon.variants.map((v) => v.style.toLowerCase());

    // Gather unique tokens for fast lookup
    const searchTokens = new Set<string>([
      nameLower,
      slugLower,
      familyLower,
      ...nameTokens,
      ...slugTokens,
      ...allCategoryTokens,
      ...tagsLower,
      ...keywordsLower,
      ...aliasesLower,
      ...useCasesLower,
      ...legacyLower,
    ]);

    // Expand with synonyms
    for (const t of Array.from(searchTokens)) {
      if (SYNONYMS[t]) {
        for (const syn of SYNONYMS[t]) {
          searchTokens.add(syn);
        }
      }
    }

    return {
      icon,
      name: nameLower,
      nameTokens,
      slug: slugLower,
      slugTokens,
      family: familyLower,
      category: categoryLower,
      primaryCategory,
      secondaryCategories,
      allCategoryTokens,
      tags: tagsLower,
      keywords: keywordsLower,
      aliases: aliasesLower,
      useCases: useCasesLower,
      legacySlugs: legacyLower,
      styles: stylesLower,
      searchTokens,
    };
  });

  cachedIndex = { iconsRef: icons, indexed };
  return indexed;
}

/**
 * Fast Levenshtein distance for fuzzy matching (typo tolerance)
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Tests if target string matches query term fuzzily
 */
function isFuzzyMatch(term: string, target: string): boolean {
  if (term.length < 3 || target.length < 3) return false;
  // If lengths differ significantly, skip
  if (Math.abs(term.length - target.length) > 2) return false;

  const maxAllowedDistance = term.length <= 4 ? 1 : 2;
  const dist = levenshteinDistance(term, target);
  return dist <= maxAllowedDistance;
}

/**
 * High performance client-side search with multi-tier relevance ranking:
 * 1. Exact Name/Slug Match (+1000)
 * 2. Exact Alias Match (+800)
 * 3. Prefix Name/Slug Match (+600)
 * 4. Word Prefix / Token Match (+450)
 * 5. Substring Name / Slug (+300)
 * 6. Exact Category / Family Match (+250)
 * 7. Tag / Keyword / UseCase (+200)
 * 8. Synonym Expansion Match (+180)
 * 9. Fuzzy Typo Match (+80)
 *
 * Guaranteed: ONE conceptual icon per result.
 */
export function searchIconsWithScore(icons: Icon[], query: string): Icon[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return icons;

  const terms = cleanQuery.split(/[\s-_]+/).filter(Boolean);
  if (terms.length === 0) return icons;

  const indexedIcons = getOrCreateIndex(icons);
  const matches: SearchMatch[] = [];

  for (const item of indexedIcons) {
    let totalScore = 0;
    let matchedAllTerms = true;

    for (const term of terms) {
      let termScore = 0;

      // 1. Exact Name, Slug, or Legacy Slug match
      if (item.name === term || item.slug === term || item.legacySlugs.includes(term)) {
        termScore += 1000;
      }
      // 2. Exact Alias match
      else if (item.aliases.includes(term)) {
        termScore += 800;
      }
      // 3. Prefix Name / Slug match
      else if (item.name.startsWith(term) || item.slug.startsWith(term)) {
        termScore += 600;
      }
      // 4. Word Token Prefix in Name / Slug (e.g. "shield" matching "shield-check")
      else if (
        item.nameTokens.some((t) => t.startsWith(term)) ||
        item.slugTokens.some((t) => t.startsWith(term))
      ) {
        termScore += 450;
      }
      // 5. Name / Slug Substring match
      else if (item.name.includes(term) || item.slug.includes(term)) {
        termScore += 300;
      }

      // 6. Family Match
      if (item.family && (item.family === term || item.family.startsWith(term))) {
        termScore += 250;
      }

      // 7. Category Match
      const matchedCat = item.allCategoryTokens.some(
        (c) => c === term || c.replace(/-/g, ' ') === term || c.replace(/\s+/g, '-') === term
      );
      if (matchedCat) {
        termScore += 250;
      } else if (item.allCategoryTokens.some((c) => c.includes(term))) {
        termScore += 120;
      }

      // 8. Tags & Keywords
      for (const tag of item.tags) {
        if (tag === term) {
          termScore += 220;
          break;
        } else if (tag.startsWith(term)) {
          termScore += 150;
          break;
        } else if (tag.includes(term)) {
          termScore += 80;
          break;
        }
      }

      for (const kw of item.keywords) {
        if (kw === term) {
          termScore += 200;
          break;
        } else if (kw.startsWith(term)) {
          termScore += 140;
          break;
        } else if (kw.includes(term)) {
          termScore += 70;
          break;
        }
      }

      // 9. Use Case Match
      for (const uc of item.useCases) {
        if (uc === term) {
          termScore += 180;
          break;
        } else if (uc.includes(term)) {
          termScore += 90;
          break;
        }
      }

      // 10. Synonym & Token Expansion
      if (termScore === 0) {
        if (item.searchTokens.has(term)) {
          termScore += 180;
        } else {
          for (const token of item.searchTokens) {
            if (token.startsWith(term)) {
              termScore += 120;
              break;
            } else if (token.includes(term)) {
              termScore += 60;
              break;
            }
          }
        }
      }

      // 11. Fuzzy Typo Match (if no direct match was found)
      if (termScore === 0 && term.length >= 3) {
        // Check fuzzy against name, slug, aliases, and tags
        if (
          isFuzzyMatch(term, item.name) ||
          isFuzzyMatch(term, item.slug) ||
          item.nameTokens.some((t) => isFuzzyMatch(term, t)) ||
          item.slugTokens.some((t) => isFuzzyMatch(term, t))
        ) {
          termScore += 80;
        } else if (item.aliases.some((a) => isFuzzyMatch(term, a))) {
          termScore += 70;
        } else if (item.tags.some((t) => isFuzzyMatch(term, t))) {
          termScore += 50;
        }
      }

      if (termScore === 0) {
        matchedAllTerms = false;
        break;
      }

      totalScore += termScore;
    }

    if (matchedAllTerms && totalScore > 0) {
      // Add subtle popularity tie-breaker
      totalScore += (item.icon.popularity || 0) * 0.05;
      matches.push({ icon: item.icon, score: totalScore });
    }
  }

  // Sort strictly by descending relevance score
  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.icon);
}

/**
 * Finds an icon by slug, checking both current slug and legacy/alias slugs for backward compatibility.
 */
export function findIconBySlugOrAlias(icons: Icon[], slugToFind: string): Icon | undefined {
  const clean = slugToFind.toLowerCase().trim();
  const direct = icons.find((i) => i.slug.toLowerCase() === clean);
  if (direct) return direct;

  return icons.find((i) => (i.legacySlugs || []).some((l) => l.toLowerCase() === clean));
}

/**
 * Generates quick query suggestions based on available tags, categories, and matches.
 */
export function getSearchSuggestions(icons: Icon[], query: string = ''): SearchSuggestion[] {
  const clean = query.trim().toLowerCase();

  const defaultSuggestions: SearchSuggestion[] = [
    { text: 'Interface', category: 'interface', type: 'category' },
    { text: 'Security', category: 'security', type: 'category' },
    { text: 'Development', category: 'development', type: 'category' },
    { text: 'Design Tools', category: 'design-tools', type: 'category' },
    { text: 'Cloud', category: 'cloud', type: 'category' },
    { text: 'Communication', category: 'communication', type: 'category' },
    { text: 'user', type: 'keyword' },
    { text: 'settings', type: 'keyword' },
    { text: 'shield', type: 'keyword' },
    { text: 'arrow', type: 'keyword' },
    { text: 'cloud', type: 'keyword' },
    { text: 'delete', type: 'keyword' },
  ];

  if (!clean) return defaultSuggestions.slice(0, 8);

  const dynamic: SearchSuggestion[] = [];
  const added = new Set<string>();

  for (const icon of icons) {
    if (icon.name.toLowerCase().includes(clean) && !added.has(icon.name)) {
      dynamic.push({ text: icon.name, category: icon.category, type: 'icon' });
      added.add(icon.name);
    }
    for (const tag of icon.tags) {
      if (tag.toLowerCase().includes(clean) && !added.has(tag)) {
        dynamic.push({ text: tag, type: 'tag' });
        added.add(tag);
      }
    }
    if (dynamic.length >= 8) break;
  }

  return dynamic.length > 0 ? dynamic : defaultSuggestions.slice(0, 6);
}
