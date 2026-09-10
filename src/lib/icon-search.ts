import type { Icon } from '@/types/icon';
import type { SearchSuggestion } from '@/types/filters';

export interface SearchMatch {
  icon: Icon;
  score: number;
}

// Synonyms mapping to improve search accuracy
const SYNONYMS: Record<string, string[]> = {
  settings: ['gear', 'cog', 'config', 'preference', 'options'],
  search: ['find', 'lookup', 'magnifier', 'explore', 'query'],
  user: ['profile', 'account', 'person', 'avatar', 'member'],
  trash: ['delete', 'remove', 'bin', 'discard'],
  heart: ['favorite', 'like', 'love', 'bookmark'],
  zap: ['lightning', 'bolt', 'flash', 'energy', 'power', 'fast'],
  check: ['done', 'success', 'complete', 'ok', 'tick', 'verify'],
  close: ['cancel', 'dismiss', 'exit', 'cross', 'x'],
  folder: ['directory', 'collection', 'group'],
  mail: ['email', 'message', 'envelope', 'inbox'],
  edit: ['pencil', 'write', 'modify', 'update'],
};

/**
 * Pre-computed search document representation for high-speed indexing
 */
interface IndexedIcon {
  icon: Icon;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  keywords: string[];
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
    const categoryLower = icon.category.toLowerCase();
    const tagsLower = icon.tags.map((t) => t.toLowerCase());
    const keywordsLower = icon.keywords.map((k) => k.toLowerCase());
    const stylesLower = icon.variants.map((v) => v.style.toLowerCase());

    // Gather all tokens including synonyms
    const tokens = new Set<string>([
      nameLower,
      slugLower,
      categoryLower,
      ...tagsLower,
      ...keywordsLower,
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
      category: categoryLower,
      tags: tagsLower,
      keywords: keywordsLower,
      styles: stylesLower,
      searchTokens: Array.from(tokens),
    };
  });

  cachedIndex = { iconsRef: icons, indexed };
  return indexed;
}

/**
 * High performance client-side search with multi-term token matching, synonyms, and scoring.
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

      // Exact name/slug match
      if (item.name === term || item.slug === term) {
        termScore += 100;
      } else if (item.name.startsWith(term) || item.slug.startsWith(term)) {
        termScore += 60;
      } else if (item.name.includes(term) || item.slug.includes(term)) {
        termScore += 40;
      }

      // Tag & keyword matches
      for (const tag of item.tags) {
        if (tag === term) termScore += 35;
        else if (tag.startsWith(term)) termScore += 25;
        else if (tag.includes(term)) termScore += 15;
      }

      for (const kw of item.keywords) {
        if (kw === term) termScore += 30;
        else if (kw.startsWith(term)) termScore += 20;
        else if (kw.includes(term)) termScore += 10;
      }

      // Category match
      if (item.category === term) termScore += 25;
      else if (item.category.includes(term)) termScore += 15;

      // Style matches
      if (item.styles.includes(term)) {
        termScore += 20;
      }

      // Synonym expansion match
      if (termScore === 0) {
        for (const token of item.searchTokens) {
          if (token.includes(term)) {
            termScore += 12;
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
      // Add subtle popularity weighting
      totalScore += (item.icon.popularity || 0) * 0.1;
      matches.push({ icon: item.icon, score: totalScore });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.icon);
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
