import type { Icon } from '@/types/icon';
import type { SearchSuggestion } from '@/types/filters';

export interface SearchMatch {
  icon: Icon;
  score: number;
}

// Synonyms mapping to improve search accuracy
const SYNONYMS: Record<string, string[]> = {
  settings: ['gear', 'cog', 'config', 'preference', 'options', 'parameters'],
  search: ['find', 'lookup', 'magnifier', 'explore', 'query', 'discover'],
  user: ['profile', 'account', 'person', 'avatar', 'member', 'human'],
  trash: ['delete', 'remove', 'bin', 'discard', 'recycle', 'rubbish'],
  heart: ['favorite', 'like', 'love', 'bookmark', 'save'],
  zap: ['lightning', 'bolt', 'flash', 'energy', 'power', 'fast', 'quick'],
  check: ['done', 'success', 'complete', 'ok', 'tick', 'verify', 'confirm'],
  close: ['cancel', 'dismiss', 'exit', 'cross', 'x', 'stop', 'remove'],
  folder: ['directory', 'collection', 'group', 'storage'],
  mail: ['email', 'message', 'envelope', 'inbox', 'letter', 'send'],
  edit: ['pencil', 'write', 'modify', 'update', 'compose', 'pen'],
  lock: ['secure', 'protect', 'safety', 'private', 'auth', 'password'],
  file: ['document', 'page', 'paper', 'sheet', 'note', 'article'],
  bell: ['notification', 'alert', 'alarm', 'reminder', 'notice'],
  eye: ['view', 'show', 'visible', 'preview', 'look', 'watch'],
  arrow: ['direction', 'navigate', 'pointer', 'move'],
};

/**
 * Pre-computed search document representation for high-speed indexing
 */
interface IndexedIcon {
  icon: Icon;
  name: string;
  slug: string;
  family: string;
  category: string;
  tags: string[];
  keywords: string[];
  aliases: string[];
  useCases: string[];
  legacySlugs: string[];
  styles: string[];
  searchTokens: string[];
}

let cachedIndex: { iconsRef: Icon[]; indexed: IndexedIcon[] } | null = null;

function getOrCreateIndex(icons: Icon[]): IndexedIcon[] {
  if (cachedIndex && cachedIndex.iconsRef === icons) {
    return cachedIndex.indexed;
  }

  const indexed = icons.map((icon) => {
    const nameLower = icon.name.toLowerCase();
    const slugLower = icon.slug.toLowerCase();
    const familyLower = (icon.family || '').toLowerCase();
    const categoryLower = icon.category.toLowerCase();
    const tagsLower = icon.tags.map((t) => t.toLowerCase());
    const keywordsLower = icon.keywords.map((k) => k.toLowerCase());
    const aliasesLower = (icon.aliases || []).map((a) => a.toLowerCase());
    const useCasesLower = (icon.useCases || []).map((u) => u.toLowerCase());
    const legacyLower = (icon.legacySlugs || []).map((l) => l.toLowerCase());
    const stylesLower = icon.variants.map((v) => v.style.toLowerCase());

    // Gather all tokens including synonyms
    const tokens = new Set<string>([
      nameLower,
      slugLower,
      familyLower,
      categoryLower,
      ...tagsLower,
      ...keywordsLower,
      ...aliasesLower,
      ...useCasesLower,
      ...legacyLower,
      ...stylesLower,
    ]);

    // Expand synonyms
    tokens.forEach((t) => {
      if (SYNONYMS[t]) {
        SYNONYMS[t].forEach((syn) => tokens.add(syn));
      }
    });

    return {
      icon,
      name: nameLower,
      slug: slugLower,
      family: familyLower,
      category: categoryLower,
      tags: tagsLower,
      keywords: keywordsLower,
      aliases: aliasesLower,
      useCases: useCasesLower,
      legacySlugs: legacyLower,
      styles: stylesLower,
      searchTokens: Array.from(tokens),
    };
  });

  cachedIndex = { iconsRef: icons, indexed };
  return indexed;
}

/**
 * High performance client-side search with multi-tier relevance ranking:
 * 1. Exact Name/Slug Match (+100)
 * 2. Prefix Name/Slug Match (+60)
 * 3. Family Match (+45)
 * 4. Alias Match (+35)
 * 5. Tag Match (+25)
 * 6. Use Case Match (+20)
 * 7. Category Match (+15)
 * 8. Conceptual / Synonym Match (+10)
 */
export function searchIconsWithScore(icons: Icon[], query: string): Icon[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return icons;

  const terms = cleanQuery.split(/\s+/).filter(Boolean);
  const indexedIcons = getOrCreateIndex(icons);
  const matches: SearchMatch[] = [];

  for (const item of indexedIcons) {
    let totalScore = 0;
    let matchedAllTerms = true;

    for (const term of terms) {
      let termScore = 0;

      // 1. Exact Name, Slug, or Legacy Slug match
      if (item.name === term || item.slug === term || item.legacySlugs.includes(term)) {
        termScore += 100;
      }
      // 2. Prefix Name / Slug match
      else if (item.name.startsWith(term) || item.slug.startsWith(term)) {
        termScore += 60;
      }
      // Name substring
      else if (item.name.includes(term) || item.slug.includes(term)) {
        termScore += 40;
      }

      // 3. Family Match
      if (item.family && (item.family === term || item.family.startsWith(term))) {
        termScore += 45;
      }

      // 4. Alias Match
      for (const alias of item.aliases) {
        if (alias === term) {
          termScore += 35;
          break;
        } else if (alias.startsWith(term)) {
          termScore += 25;
          break;
        }
      }

      // 5. Tag & Keyword Match
      for (const tag of item.tags) {
        if (tag === term) {
          termScore += 25;
          break;
        } else if (tag.startsWith(term)) {
          termScore += 18;
          break;
        } else if (tag.includes(term)) {
          termScore += 10;
          break;
        }
      }

      for (const kw of item.keywords) {
        if (kw === term) {
          termScore += 20;
          break;
        } else if (kw.startsWith(term)) {
          termScore += 12;
          break;
        }
      }

      // 6. Use Case Match
      for (const uc of item.useCases) {
        if (uc.includes(term)) {
          termScore += 20;
          break;
        }
      }

      // 7. Variant / Style Match (e.g. "duotone", "filled", "light", "regular")
      const isVariantQuery = ['light', 'regular', 'filled', 'duotone', 'duotone-line', 'outline', 'solid'].includes(term);
      if (isVariantQuery) {
        const matchesVariant = item.styles.some((s) => s === term || (term === 'solid' && s === 'filled') || (term === 'regular' && s === 'outline'));
        if (matchesVariant) {
          termScore += 50;
        }
      } else if (item.styles.includes(term)) {
        termScore += 20;
      }

      // 8. Category Match
      if (item.category === term) {
        termScore += 15;
      } else if (item.category.includes(term)) {
        termScore += 10;
      }

      // 8. Synonym & Token Fallback Match
      if (termScore === 0) {
        for (const token of item.searchTokens) {
          if (token.includes(term)) {
            termScore += 10;
            break;
          }
        }
      }

      if (termScore === 0) {
        matchedAllTerms = false;
        break;
      }

      totalScore += termScore;
    }

    if (matchedAllTerms && totalScore > 0) {
      // Add subtle popularity boost
      totalScore += (item.icon.popularity || 0) * 0.05;
      matches.push({ icon: item.icon, score: totalScore });
    }
  }

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
    { text: 'Arrows', category: 'arrows', type: 'category' },
    { text: 'Editor', category: 'editor', type: 'category' },
    { text: 'Security', category: 'security', type: 'category' },
    { text: 'zap', type: 'tag' },
    { text: 'search', type: 'tag' },
    { text: 'settings', type: 'tag' },
    { text: 'code', type: 'tag' },
    { text: 'heart', type: 'tag' },
    { text: 'download', type: 'tag' },
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
