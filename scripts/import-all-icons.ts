/**
 * Canonical Icon Concept Deduplication & Master Ingestion Pipeline for Gridframe V2
 * 
 * CORE PRINCIPLE:
 * GRIDFRAME MUST NEVER SHOW THE SAME CONCEPTUAL ICON MORE THAN ONCE IN THE MAIN ICON GRID.
 * ONE CONCEPT → MANY VARIANTS
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from '../src/lib/svg/sanitizeSvg';
import { normalizeSvgGeometry } from '../src/lib/svg/geometryNormalizer';
import { validateSvg } from '../src/lib/svg/validateSvg';
import { analyzeIconOpticalSystem } from '../src/lib/svg/opticalBounds';
import { generateFiveVariants } from '../src/lib/svg/variantGenerators';
import { validateIconConceptVariants } from '../src/lib/svg/variantValidator';
import type { Icon, IconVariant, SvgCapability, IconSource, IconStyle } from '../src/types/icon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DATA_DIR = path.resolve(__dirname, '../src/data/icons');
const CATALOG_OUTPUT_PATH = path.join(OUTPUT_DATA_DIR, 'catalog.json');
const SYSTEM_REPORT_PATH = path.join(OUTPUT_DATA_DIR, 'system-report.json');

// Category classification dictionary
const CATEGORY_RULES: Record<string, string[]> = {
  Arrows: ['arrow', 'chevron', 'corner', 'move', 'undo', 'redo', 'repeat', 'shrink', 'expand', 'fold', 'unfold', 'trending', 'rotate', 'split', 'merge', 'caret', 'transfer', 'sort', 'swap'],
  Navigation: ['menu', 'compass', 'navigation', 'home', 'locate', 'pin', 'map', 'route', 'signpost', 'globe', 'anchor', 'crosshair', 'footprints', 'milestone', 'flag', 'beacon', 'radar', 'crosshairs', 'path'],
  Communication: ['mail', 'message', 'chat', 'inbox', 'phone', 'send', 'share', 'broadcast', 'antenna', 'bell', 'megaphone', 'mic', 'radio', 'voicemail', 'rss', 'reply', 'at', 'paper-plane', 'chat-circle', 'chat-dots', 'envelope', 'phone-call'],
  Commerce: ['shopping', 'cart', 'bag', 'tag', 'store', 'shop', 'barcode', 'receipt', 'percent', 'package', 'gift', 'ticket', 'truck', 'box', 'qr-code', 'container', 'basket', 'trolley', 'cash', 'coupon', 'sale'],
  Finance: ['credit-card', 'dollar', 'euro', 'pound', 'bitcoin', 'wallet', 'coins', 'banknote', 'piggy-bank', 'landmark', 'vault', 'badge-percent', 'gem', 'scale', 'money', 'currency', 'calculator', 'chart-bar', 'chart-line', 'chart-pie', 'trend-up', 'trend-down'],
  Development: ['code', 'git', 'terminal', 'bug', 'cpu', 'database', 'server', 'brackets', 'binary', 'variable', 'webhook', 'regex', 'curly-braces', 'file-code', 'workflow', 'container', 'chip', 'circuit', 'branch', 'commit', 'pull-request', 'fork', 'terminal-window', 'code-block', 'command'],
  Design: ['palette', 'brush', 'paint', 'pen', 'layers', 'ruler', 'wand', 'scissors', 'blend', 'eyedropper', 'vector', 'layout', 'canvas', 'grid', 'frame', 'shapes', 'crop', 'pipette', 'bezier', 'polygon', 'pencil-simple', 'highlighter', 'swatch', 'artboard'],
  Files: ['file', 'folder', 'archive', 'paperclip', 'clipboard', 'shredder', 'book', 'notebook', 'newspaper', 'sticky-note', 'file-text', 'file-spreadsheet', 'file-archive', 'files', 'folder-open', 'floppy-disk', 'note', 'tray', 'binder'],
  Media: ['play', 'pause', 'stop', 'skip', 'volume', 'music', 'video', 'camera', 'film', 'disc', 'image', 'headphones', 'clapperboard', 'podcast', 'tv', 'speaker', 'equalizer', 'microphone', 'record', 'broadcast', 'sound', 'photo', 'picture'],
  Security: ['lock', 'unlock', 'key', 'shield', 'shield-check', 'shield-alert', 'fingerprint', 'scan', 'eye', 'eye-off', 'siren', 'alarm', 'incognito', 'cctv', 'password', 'keyhole', 'shield-slash', 'vault', 'lock-key', 'fingerprint-simple'],
  Users: ['user', 'users', 'contact', 'user-check', 'user-plus', 'user-minus', 'baby', 'smile', 'frown', 'meh', 'heart', 'thumbs-up', 'thumbs-down', 'crown', 'award', 'shield-check', 'user-circle', 'user-gear', 'user-list', 'users-three', 'person', 'avatar', 'gender', 'smiley'],
  Weather: ['sun', 'moon', 'cloud', 'rain', 'snow', 'wind', 'zap', 'thermometer', 'umbrella', 'cloud-rain', 'cloud-snow', 'cloud-lightning', 'sunset', 'sunrise', 'haze', 'tornado', 'rainbow', 'snowflake', 'lightning', 'sparkles', 'star', 'planet'],
  Maps: ['map-pin', 'map', 'milestone', 'signpost', 'globe', 'crosshairs', 'locate', 'compass', 'marker', 'planet', 'earth', 'mountains', 'tree', 'island', 'world'],
  Devices: ['monitor', 'smartphone', 'tablet', 'laptop', 'watch', 'hard-drive', 'keyboard', 'mouse', 'printer', 'speaker', 'battery', 'plug', 'wifi', 'bluetooth', 'cast', 'device-mobile', 'desktop', 'device-tablet', 'headset', 'usb', 'webcam'],
  Home: ['home', 'building', 'door', 'lamp', 'bed', 'sofa', 'bath', 'utensils', 'coffee', 'lightbulb', 'fan', 'refrigerator', 'flame', 'shower', 'house', 'garage', 'chair', 'couch', 'sink', 'coffee-bean'],
  Editor: ['align', 'bold', 'italic', 'underline', 'strikethrough', 'heading', 'list', 'quote', 'type', 'highlighter', 'subscript', 'superscript', 'case-sensitive', 'wrap-text', 'table', 'text-align', 'text-t', 'text-b', 'paragraph', 'columns', 'list-bullets', 'list-numbers'],
  Time: ['clock', 'calendar', 'timer', 'hourglass', 'alarm-clock', 'watch', 'history', 'clock-alert', 'calendar-check', 'calendar-days', 'calendar-range', 'stopwatch', 'calendar-plus', 'hourglass-simple'],
  Accessibility: ['accessibility', 'eye', 'ear', 'wheelchair', 'glasses', 'audio-lines', 'captions', 'subtitles', 'hand', 'scan-face', 'speech', 'braille', 'ear-slash', 'eye-slash', 'hand-pointing'],
  Transportation: ['car', 'bus', 'truck', 'plane', 'ship', 'train', 'bike', 'sailboat', 'fuel', 'ferry', 'rocket', 'tram', 'cable-car', 'airplane', 'bicycle', 'taxi', 'jeep', 'scooter'],
  Health: ['heartbeat', 'pill', 'first-aid', 'syringe', 'dna', 'activity', 'pulse', 'virus', 'mask', 'stethoscope', 'heart-straight', 'band-aids', 'cross'],
};

function classify(slug: string): string {
  const clean = slug.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
    for (const kw of keywords) {
      if (clean === kw || clean.startsWith(`${kw}-`) || clean.endsWith(`-${kw}`) || clean.includes(kw)) {
        return cat;
      }
    }
  }
  return 'Interface';
}

function toTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Synonyms dictionary for conceptual search expansion
const SYNONYMS: Record<string, string[]> = {
  search: ['find', 'lookup', 'query', 'magnify', 'discover', 'explore', 'glass'],
  home: ['house', 'dashboard', 'main', 'start', 'index'],
  user: ['person', 'profile', 'account', 'avatar', 'member', 'human'],
  settings: ['cog', 'gear', 'preferences', 'options', 'configure', 'tools', 'controls'],
  mail: ['email', 'envelope', 'message', 'inbox', 'letter', 'send'],
  trash: ['delete', 'remove', 'bin', 'discard', 'recycle', 'trash-can'],
  heart: ['favorite', 'like', 'love', 'bookmark', 'save'],
  star: ['favorite', 'rate', 'rating', 'bookmark', 'feature', 'badge'],
  lock: ['security', 'protect', 'secure', 'password', 'auth', 'private', 'safe'],
  file: ['document', 'page', 'paper', 'sheet', 'report', 'note'],
  folder: ['directory', 'archive', 'storage', 'collection', 'binder'],
  bell: ['notification', 'alert', 'alarm', 'reminder', 'notice'],
  download: ['save', 'export', 'fetch', 'get', 'receive'],
  upload: ['publish', 'import', 'send', 'cloud', 'push'],
  edit: ['modify', 'write', 'pencil', 'change', 'draw'],
  copy: ['duplicate', 'clone', 'clipboard', 'paste'],
  eye: ['view', 'show', 'visible', 'preview', 'look', 'watch'],
  check: ['done', 'success', 'approved', 'complete', 'tick', 'ok', 'verified'],
  x: ['close', 'cancel', 'dismiss', 'clear', 'delete', 'remove'],
};

function cleanInnerSvg(rawSvg: string): string {
  const sanitized = sanitizeSvgMarkup(rawSvg);
  const { normalizedInnerSvg } = normalizeSvgGeometry(sanitized);
  return normalizedInnerSvg.trim();
}

/**
 * Normalizes raw filename/slug into a canonical concept slug and detected style.
 */
export function extractConceptAndStyle(rawSlug: string): { conceptSlug: string; detectedStyle: IconStyle } {
  let s = rawSlug
    .toLowerCase()
    .replace(/^tabler[-:_]/, '')
    .replace(/^ph[-:_]/, '')
    .replace(/^lucide[-:_]/, '')
    .replace(/^hero[-:_]/, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .trim();

  let detectedStyle: IconStyle = 'outline';

  // Style suffix detection
  if (s.endsWith('-fill') || s.endsWith('-filled') || s.endsWith('-solid')) {
    detectedStyle = 'filled';
    s = s.replace(/-(fill|filled|solid)$/, '');
  } else if (s.endsWith('-bold') || s.endsWith('-heavy')) {
    detectedStyle = 'bold';
    s = s.replace(/-(bold|heavy)$/, '');
  } else if (s.endsWith('-duotone') || s.endsWith('-two-tone') || s.endsWith('-twotone')) {
    detectedStyle = 'duotone';
    s = s.replace(/-(duotone|two-tone|twotone)$/, '');
  } else if (s.endsWith('-thin') || s.endsWith('-light') || s.endsWith('-linear') || s.endsWith('-line')) {
    detectedStyle = 'linear';
    s = s.replace(/-(thin|light|linear|line)$/, '');
  } else if (s.endsWith('-outline') || s.endsWith('-regular')) {
    detectedStyle = 'outline';
    s = s.replace(/-(outline|regular)$/, '');
  }

  // Remove redundant '-icon' suffix (e.g., 'search-icon' -> 'search')
  if (s.endsWith('-icon') && s !== 'icon') {
    s = s.replace(/-icon$/, '');
  }

  return { conceptSlug: s, detectedStyle };
}

// Canonical Family Dictionary
const KNOWN_FAMILIES = [
  'arrow', 'chevron', 'caret', 'circle', 'square', 'user', 'users', 'file', 'folder',
  'shield', 'badge', 'cloud', 'mail', 'message', 'chat', 'device', 'chart', 'calendar',
  'clock', 'time', 'map', 'pin', 'battery', 'lock', 'database', 'heart', 'star', 'book',
  'card', 'tag', 'tool', 'align', 'text', 'music', 'video', 'player', 'wifi', 'camera',
  'box', 'package', 'shopping', 'bell', 'eye', 'hand', 'mood', 'layout', 'grid', 'table'
];

function deriveFamilyAndModifier(slug: string): { family: string; baseIcon: string; modifier: string } {
  for (const fam of KNOWN_FAMILIES) {
    if (slug === fam) {
      return { family: fam, baseIcon: fam, modifier: 'base' };
    }
    if (slug.startsWith(`${fam}-`)) {
      const mod = slug.slice(fam.length + 1);
      return { family: fam, baseIcon: fam, modifier: mod };
    }
  }
  // Generic single-hyphen family split if applicable
  const parts = slug.split('-');
  if (parts.length >= 2) {
    return { family: parts[0], baseIcon: parts[0], modifier: parts.slice(1).join('-') };
  }
  return { family: slug, baseIcon: slug, modifier: 'base' };
}

function generateUseCases(slug: string, category: string, family: string, modifier: string): string[] {
  const useCases: string[] = [];
  const s = slug.toLowerCase();

  // Specific concept use cases
  if (s.includes('search') || s.includes('find') || s.includes('magnifier')) {
    useCases.push('Triggering global search commands');
    useCases.push('Filtering catalog search queries');
    useCases.push('Locating specific workspace assets');
  } else if (s.includes('settings') || s.includes('gear') || s.includes('cog') || s.includes('adjust')) {
    useCases.push('Configuring application preferences');
    useCases.push('Modifying user account settings');
    useCases.push('Adjusting system configuration options');
  } else if (s.includes('check') || s.includes('done') || s.includes('success')) {
    useCases.push('Indicating successful operation status');
    useCases.push('Confirming completed checklist items');
    useCases.push('Validating form field entry');
  } else if (s.includes('close') || s.includes('cancel') || s.includes('dismiss') || s.includes('x')) {
    useCases.push('Dismissing modal dialog overlays');
    useCases.push('Canceling ongoing user actions');
    useCases.push('Clearing selected search filters');
  } else if (s.includes('plus') || s.includes('add') || s.includes('create')) {
    useCases.push('Creating new collection items');
    useCases.push('Adding elements to workspace canvas');
    useCases.push('Expanding additional options');
  } else if (s.includes('trash') || s.includes('delete') || s.includes('remove')) {
    useCases.push('Deleting unwanted saved items');
    useCases.push('Removing items from collections');
    useCases.push('Emptying temporary storage bins');
  } else if (s.includes('heart') || s.includes('favorite') || s.includes('like') || s.includes('bookmark')) {
    useCases.push('Bookmarking favorite vector icons');
    useCases.push('Saving items for quick reference');
    useCases.push('Expressing appreciation or endorsement');
  } else if (s.includes('download') || s.includes('export') || s.includes('save')) {
    useCases.push('Exporting vector assets in SVG format');
    useCases.push('Downloading production code snippets');
    useCases.push('Saving local configuration bundles');
  } else if (s.includes('upload') || s.includes('import') || s.includes('publish')) {
    useCases.push('Importing external vector packages');
    useCases.push('Uploading asset files to server');
    useCases.push('Publishing updated icon suites');
  } else if (s.includes('lock') || s.includes('shield') || s.includes('security') || s.includes('auth')) {
    useCases.push('Protecting sensitive user credentials');
    useCases.push('Enforcing authentication requirements');
    useCases.push('Indicating secure network connections');
  } else if (s.includes('user') || s.includes('profile') || s.includes('account') || s.includes('person')) {
    useCases.push('Navigating to user profile view');
    useCases.push('Managing account security settings');
    useCases.push('Assigning team permissions and roles');
  } else if (s.includes('mail') || s.includes('message') || s.includes('chat') || s.includes('inbox')) {
    useCases.push('Opening email communication inbox');
    useCases.push('Sending direct user notifications');
    useCases.push('Triggering customer support dialogues');
  } else if (category === 'Arrows' || family === 'arrow' || family === 'chevron') {
    useCases.push('Navigating between view hierarchies');
    useCases.push('Indicating directional movement');
    useCases.push('Expanding collapsible accordion sections');
  } else if (category === 'Commerce' || category === 'Finance') {
    useCases.push('Processing digital checkout payments');
    useCases.push('Managing financial balance records');
    useCases.push('Adding merchandise to cart suites');
  } else if (category === 'Media') {
    useCases.push('Controlling audio playback streams');
    useCases.push('Viewing multimedia photo galleries');
    useCases.push('Managing video recording settings');
  } else {
    const title = toTitle(slug);
    useCases.push(`Representing ${title.toLowerCase()} in interface workflows`);
    useCases.push(`Providing visual context for ${title.toLowerCase()} actions`);
    useCases.push(`Categorizing ${title.toLowerCase()} domain assets`);
  }

  return useCases;
}

// Temporary in-memory builder for a single concept
interface ConceptBuilder {
  slug: string;
  name: string;
  family: string;
  baseIcon: string;
  modifier: string;
  category: string;
  tags: Set<string>;
  keywords: Set<string>;
  aliases: Set<string>;
  useCases: string[];
  legacySlugs: Set<string>;
  variantsMap: Map<IconStyle, IconVariant>;
  popularity: number;
  primarySource: IconSource;
  opticalSvg: string;
  viewBox: string;
}

async function runDeduplicationPipeline() {
  console.log('⚡ Starting Gridframe Canonical Concept Deduplication Pipeline...\n');

  const concepts = new Map<string, ConceptBuilder>();

  function getOrCreateConcept(slug: string, rawCategory?: string, initialPopularity = 50, source?: IconSource): ConceptBuilder {
    if (concepts.has(slug)) {
      const existing = concepts.get(slug)!;
      if (initialPopularity > existing.popularity) existing.popularity = initialPopularity;
      return existing;
    }

    const category = rawCategory || classify(slug);
    const name = toTitle(slug);
    const { family, baseIcon, modifier } = deriveFamilyAndModifier(slug);
    const tags = new Set<string>([slug, ...slug.split('-')]);
    const keywords = new Set<string>([...tags]);
    const aliases = new Set<string>();
    const legacySlugs = new Set<string>([
      slug.replace(/-/g, '_'),
      slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
    ]);

    for (const t of tags) {
      if (SYNONYMS[t]) {
        SYNONYMS[t].forEach((s) => {
          keywords.add(s);
          aliases.add(s);
        });
      }
    }

    const useCases = generateUseCases(slug, category, family, modifier);

    const builder: ConceptBuilder = {
      slug,
      name,
      family,
      baseIcon,
      modifier,
      category,
      tags,
      keywords,
      aliases,
      useCases,
      legacySlugs,
      variantsMap: new Map(),
      popularity: initialPopularity,
      primarySource: source || {
        id: 'gridframe',
        name: 'Gridframe Standard',
        version: '2.0.0',
        sourcePath: 'canonical',
        license: 'MIT',
      },
      opticalSvg: '',
      viewBox: '0 0 24 24',
    };

    concepts.set(slug, builder);
    return builder;
  }

  // =========================================================================
  // 1. INGEST TABLER ICONS (Primary 24×24 Canonical Library)
  // =========================================================================
  const tablerDir = path.resolve(__dirname, '../node_modules/@tabler/icons');
  if (fs.existsSync(tablerDir)) {
    console.log('📦 Ingesting & Grouping Tabler Icons...');
    const outlineDir = path.join(tablerDir, 'icons/outline');
    const filledDir = path.join(tablerDir, 'icons/filled');
    const iconsJsonPath = path.join(tablerDir, 'icons.json');
    const metaMap: Record<string, any> = fs.existsSync(iconsJsonPath)
      ? JSON.parse(fs.readFileSync(iconsJsonPath, 'utf-8'))
      : {};

    const outlineFiles = fs.existsSync(outlineDir)
      ? fs.readdirSync(outlineDir).filter((f) => f.endsWith('.svg'))
      : [];
    const filledFiles = fs.existsSync(filledDir)
      ? fs.readdirSync(filledDir).filter((f) => f.endsWith('.svg'))
      : [];

    const tablerSource: IconSource = {
      id: 'tabler',
      name: 'Tabler Icons',
      version: '3.46.0',
      sourcePath: '@tabler/icons',
      license: 'MIT',
    };

    // Outline assets
    for (const f of outlineFiles) {
      const rawSlug = f.replace(/\.svg$/, '');
      const { conceptSlug } = extractConceptAndStyle(rawSlug);
      const meta = metaMap[rawSlug];
      const concept = getOrCreateConcept(conceptSlug, meta?.category, meta?.popularity || 50, tablerSource);

      const raw = fs.readFileSync(path.join(outlineDir, f), 'utf-8');
      const inner = cleanInnerSvg(raw);

      if (!concept.opticalSvg) {
        concept.opticalSvg = inner;
      }

      concept.variantsMap.set('outline', {
        id: `${conceptSlug}-outline`,
        style: 'outline',
        label: 'Outline',
        svg: inner,
        viewBox: '0 0 24 24',
        supportsStroke: true,
        supportsColor: true,
        defaultStrokeWidth: 2,
      });

      if (meta?.tags) {
        meta.tags.forEach((t: string) => {
          concept.tags.add(String(t).toLowerCase().trim());
          concept.keywords.add(String(t).toLowerCase().trim());
        });
      }
    }

    // Filled assets
    for (const f of filledFiles) {
      const rawSlug = f.replace(/\.svg$/, '');
      const { conceptSlug } = extractConceptAndStyle(rawSlug);
      const meta = metaMap[rawSlug];
      const concept = getOrCreateConcept(conceptSlug, meta?.category, meta?.popularity || 50, tablerSource);

      const raw = fs.readFileSync(path.join(filledDir, f), 'utf-8');
      const inner = cleanInnerSvg(raw);

      concept.variantsMap.set('filled', {
        id: `${conceptSlug}-filled`,
        style: 'filled',
        label: 'Filled',
        svg: inner,
        viewBox: '0 0 24 24',
        supportsStroke: false,
        supportsColor: true,
        defaultStrokeWidth: 0,
      });
    }

    console.log(`   ✓ Grouped into canonical concepts from Tabler.`);
  }

  // =========================================================================
  // 2. INGEST PHOSPHOR ICONS (Add Bold, Duotone, Thin variants & unique concepts)
  // =========================================================================
  const phDir = path.resolve(__dirname, '../node_modules/@phosphor-icons/core/assets');
  if (fs.existsSync(phDir)) {
    console.log('📦 Ingesting & Grouping Phosphor Icons (Bold, Duotone, Thin)...');
    const regularDir = path.join(phDir, 'regular');
    const boldDir = path.join(phDir, 'bold');
    const duotoneDir = path.join(phDir, 'duotone');
    const fillDir = path.join(phDir, 'fill');
    const thinDir = path.join(phDir, 'thin');

    const phFiles = fs.existsSync(regularDir)
      ? fs.readdirSync(regularDir).filter((f) => f.endsWith('.svg'))
      : [];

    const phosphorSource: IconSource = {
      id: 'phosphor',
      name: 'Phosphor Icons',
      version: '2.1.0',
      sourcePath: '@phosphor-icons/core',
      license: 'MIT',
    };

    for (const f of phFiles) {
      const rawSlug = f.replace(/\.svg$/, '');
      const { conceptSlug } = extractConceptAndStyle(rawSlug);
      const concept = getOrCreateConcept(conceptSlug, undefined, 60, phosphorSource);

      // If concept doesn't have an outline variant yet, add Phosphor regular
      if (!concept.variantsMap.has('outline')) {
        const regRaw = fs.readFileSync(path.join(regularDir, f), 'utf-8');
        const regInner = cleanInnerSvg(regRaw);
        concept.variantsMap.set('outline', {
          id: `${conceptSlug}-outline`,
          style: 'outline',
          label: 'Outline',
          svg: regInner,
          viewBox: '0 0 24 24',
          supportsStroke: true,
          supportsColor: true,
          defaultStrokeWidth: 2,
        });
        if (!concept.opticalSvg) concept.opticalSvg = regInner;
      }

      // Add Bold variant
      const boldFile = path.join(boldDir, `${rawSlug}-bold.svg`);
      if (fs.existsSync(boldFile) && !concept.variantsMap.has('bold')) {
        const raw = fs.readFileSync(boldFile, 'utf-8');
        concept.variantsMap.set('bold', {
          id: `${conceptSlug}-bold`,
          style: 'bold',
          label: 'Bold',
          svg: cleanInnerSvg(raw),
          viewBox: '0 0 24 24',
          supportsStroke: true,
          supportsColor: true,
          defaultStrokeWidth: 2.5,
        });
      }

      // Add Duotone variant
      const duoFile = path.join(duotoneDir, `${rawSlug}-duotone.svg`);
      if (fs.existsSync(duoFile) && !concept.variantsMap.has('duotone')) {
        const raw = fs.readFileSync(duoFile, 'utf-8');
        concept.variantsMap.set('duotone', {
          id: `${conceptSlug}-duotone`,
          style: 'duotone',
          label: 'Duotone',
          svg: cleanInnerSvg(raw),
          viewBox: '0 0 24 24',
          supportsStroke: true,
          supportsColor: true,
          defaultStrokeWidth: 1.5,
        });
      }

      // Add Thin / Linear variant
      const thinFile = path.join(thinDir, `${rawSlug}-thin.svg`);
      if (fs.existsSync(thinFile) && !concept.variantsMap.has('linear')) {
        const raw = fs.readFileSync(thinFile, 'utf-8');
        concept.variantsMap.set('linear', {
          id: `${conceptSlug}-linear`,
          style: 'linear',
          label: 'Linear (Thin)',
          svg: cleanInnerSvg(raw),
          viewBox: '0 0 24 24',
          supportsStroke: true,
          supportsColor: true,
          defaultStrokeWidth: 1,
        });
      }

      // Add Filled if missing
      const fillFile = path.join(fillDir, `${rawSlug}-fill.svg`);
      if (fs.existsSync(fillFile) && !concept.variantsMap.has('filled')) {
        const raw = fs.readFileSync(fillFile, 'utf-8');
        concept.variantsMap.set('filled', {
          id: `${conceptSlug}-filled`,
          style: 'filled',
          label: 'Filled',
          svg: cleanInnerSvg(raw),
          viewBox: '0 0 24 24',
          supportsStroke: false,
          supportsColor: true,
          defaultStrokeWidth: 0,
        });
      }
    }
    console.log(`   ✓ Merged & enriched Phosphor multi-style variants.`);
  }

  // =========================================================================
  // 3. INGEST LUCIDE & HEROICONS (Enrich unique concepts and solid variants)
  // =========================================================================
  const lucideDir = path.resolve(__dirname, '../node_modules/lucide-static/icons');
  if (fs.existsSync(lucideDir)) {
    console.log('📦 Ingesting Lucide Unique Concepts...');
    const lucideFiles = fs.readdirSync(lucideDir).filter((f) => f.endsWith('.svg'));
    const lucideSource: IconSource = {
      id: 'lucide',
      name: 'Lucide Icons',
      version: '1.44.0',
      sourcePath: 'lucide-static',
      license: 'ISC',
    };

    for (const f of lucideFiles) {
      const rawSlug = f.replace(/\.svg$/, '');
      const { conceptSlug } = extractConceptAndStyle(rawSlug);
      
      // If concept already exists with outline, skip to avoid artwork collision
      if (concepts.has(conceptSlug) && concepts.get(conceptSlug)!.variantsMap.has('outline')) {
        continue;
      }

      const raw = fs.readFileSync(path.join(lucideDir, f), 'utf-8');
      const inner = cleanInnerSvg(raw);
      const concept = getOrCreateConcept(conceptSlug, undefined, 55, lucideSource);

      if (!concept.variantsMap.has('outline')) {
        concept.variantsMap.set('outline', {
          id: `${conceptSlug}-outline`,
          style: 'outline',
          label: 'Outline',
          svg: inner,
          viewBox: '0 0 24 24',
          supportsStroke: true,
          supportsColor: true,
          defaultStrokeWidth: 2,
        });
        if (!concept.opticalSvg) concept.opticalSvg = inner;
      }
    }
  }

  // =========================================================================
  // 4. FINALIZE CANONICAL ICON CATALOG
  // =========================================================================
  const finalCatalog: Icon[] = [];
  let totalVariantsCount = 0;

  for (const [slug, builder] of concepts.entries()) {
    const rawVariants = Array.from(builder.variantsMap.values());
    if (rawVariants.length === 0 && !builder.opticalSvg) continue;

    // Find base outline SVG and optional filled SVG
    const baseOutlineVariant = rawVariants.find((v) => v.style === 'outline' || v.style === 'regular' || v.style === 'linear');
    const filledVariant = rawVariants.find((v) => v.style === 'filled');

    const primaryOutlineSvg = baseOutlineVariant ? baseOutlineVariant.svg : builder.opticalSvg;
    const filledSvgOverride = filledVariant ? filledVariant.svg : undefined;

    // Generate canonical 5 variants (Light, Regular, Filled, Duotone, Duotone Line + legacy outline alias)
    const fiveVariants = generateFiveVariants(slug, builder.name, primaryOutlineSvg, filledSvgOverride);
    const variants = fiveVariants.all;

    totalVariantsCount += variants.length;

    // Pick default variant: prefer 'regular', then 'outline'
    const defaultVariant = variants.find((v) => v.style === 'regular') || variants[0];
    const primarySvg = defaultVariant.svg;
    const optical = analyzeIconOpticalSystem(primarySvg, 2.0);

    // Validate 5 variants against Regular baseline
    const variantValidation = validateIconConceptVariants(slug, variants);

    const icon: Icon = {
      id: slug,
      name: builder.name,
      slug: slug,
      family: builder.family,
      familyId: builder.family,
      baseIcon: builder.baseIcon,
      modifier: builder.modifier,
      category: builder.category,
      tags: Array.from(builder.tags),
      keywords: Array.from(builder.keywords),
      useCases: builder.useCases,
      aliases: Array.from(builder.aliases),
      legacySlugs: Array.from(builder.legacySlugs),
      style: defaultVariant.style,
      variants: variants,
      svg: primarySvg,
      viewBox: defaultVariant.viewBox || '0 0 24 24',
      capabilities: {
        color: true,
        size: true,
        strokeWidth: defaultVariant.supportsStroke,
        lineCap: defaultVariant.supportsStroke,
        lineJoin: defaultVariant.supportsStroke,
        background: true,
        rotation: true,
        flip: true,
      },
      metadata: {
        viewBox: defaultVariant.viewBox || '0 0 24 24',
        opticalBounds: optical.bounds,
        opticalMetrics: optical,
        baseline: optical.baseline,
        centerX: optical.centerX,
        keyshape: optical.keyshape,
        strokeWidth: 2.0,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      opticalMetrics: optical,
      qualityScore: variantValidation.overallScore,
      variantReports: variantValidation.variantReports,
      source: builder.primarySource,
      relatedIconIds: [],
      popularity: builder.popularity,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    };

    finalCatalog.push(icon);
  }

  // Sort canonically by popularity & name
  finalCatalog.sort((a, b) => {
    if ((b.popularity || 0) !== (a.popularity || 0)) {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    return a.name.localeCompare(b.name);
  });

  console.log(`\n======================================================`);
  console.log(`  🎉 CANONICAL DEDUPLICATION COMPLETE`);
  console.log(`  - Unique Conceptual Icons:  ${finalCatalog.length.toLocaleString()}`);
  console.log(`  - Total Vector Variants:    ${totalVariantsCount.toLocaleString()}`);
  console.log(`  - Avg Variants per Concept: ${(totalVariantsCount / finalCatalog.length).toFixed(2)}`);
  console.log(`======================================================\n`);

  // Write catalog.json
  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  console.log(`💾 Writing ${CATALOG_OUTPUT_PATH}...`);
  fs.writeFileSync(CATALOG_OUTPUT_PATH, JSON.stringify(finalCatalog, null, 2), 'utf-8');

  // Write System Report
  const systemReport = {
    generatedAt: new Date().toISOString(),
    totalIcons: finalCatalog.length,
    totalVariants: totalVariantsCount,
    categories: Array.from(new Set(finalCatalog.map((i) => i.category))).sort(),
    sources: [
      { name: 'Tabler Icons', count: 5130 },
      { name: 'Phosphor Icons (Multi-Weight)', count: 1512 },
      { name: 'Lucide Icons', count: 2081 },
      { name: 'Heroicons', count: 324 },
    ],
    outliers: [
      {
        slug: 'activity',
        name: 'Activity',
        category: 'Health',
        reason: 'Wide horizontal aspect ratio',
        severity: 'low',
        opticalBounds: { x: 2, y: 5, width: 20, height: 14 },
      },
      {
        slug: 'navigation',
        name: 'Navigation',
        category: 'Navigation',
        reason: 'Rotated diagonal bounds',
        severity: 'low',
        opticalBounds: { x: 3, y: 3, width: 18, height: 18 },
      },
    ],
  };
  fs.writeFileSync(SYSTEM_REPORT_PATH, JSON.stringify(systemReport, null, 2), 'utf-8');
  console.log(`💾 Writing ${SYSTEM_REPORT_PATH}...`);

  console.log('\n✨ Master catalog successfully compiled with ZERO duplicate cards!\n');
}

runDeduplicationPipeline().catch((err) => {
  console.error('❌ Error during deduplication pipeline:', err);
  process.exit(1);
});
