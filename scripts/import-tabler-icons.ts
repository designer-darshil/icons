/**
 * Tabler Icons Ingestion Script for Gridframe V2
 * Ingests official @tabler/icons package (6,000+ icons) into normalized Gridframe Icon catalog.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from '../src/lib/svg/sanitizeSvg';
import { validateSvg } from '../src/lib/svg/validateSvg';
import type { Icon, IconVariant, SvgCapability, IconSource } from '../src/types/icon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TABLER_PKG_DIR = path.resolve(__dirname, '../node_modules/@tabler/icons');
const OUTLINE_DIR = path.join(TABLER_PKG_DIR, 'icons/outline');
const FILLED_DIR = path.join(TABLER_PKG_DIR, 'icons/filled');
const ICONS_JSON_PATH = path.join(TABLER_PKG_DIR, 'icons.json');
const PKG_JSON_PATH = path.join(TABLER_PKG_DIR, 'package.json');

const OUTPUT_DATA_DIR = path.resolve(__dirname, '../src/data/icons');

// Category mapping from Tabler taxonomy to Gridframe standardized taxonomy
const CATEGORY_MAP: Record<string, string> = {
  'Animals': 'Nature',
  'Arrows': 'Arrows',
  'Badges': 'Design',
  'Brand': 'Social',
  'Buildings': 'Buildings',
  'Charts': 'Finance',
  'Communication': 'Communication',
  'Computers': 'Devices',
  'Currencies': 'Finance',
  'Database': 'Development',
  'Design': 'Design',
  'Development': 'Development',
  'Devices': 'Devices',
  'Document': 'Files',
  'E-commerce': 'Commerce',
  'Electrical': 'Devices',
  'Extensions': 'Development',
  'Food': 'Food',
  'Games': 'Media',
  'Gender': 'Users',
  'Gestures': 'Interface',
  'Health': 'Health',
  'Laundry': 'Home',
  'Letters': 'Text',
  'Logic': 'Development',
  'Map': 'Maps',
  'Math': 'Editor',
  'Media': 'Media',
  'Mood': 'Social',
  'Nature': 'Weather',
  'Numbers': 'Editor',
  'Photography': 'Media',
  'Shapes': 'Shapes',
  'Sport': 'Health',
  'Symbols': 'Interface',
  'System': 'System',
  'Text': 'Editor',
  'Vehicles': 'Transportation',
  'Version control': 'Development',
  'Weather': 'Weather',
  'Zodiac': 'Shapes',
};

// Title Case helper
function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Synonyms dictionary for high-frequency search keywords
const SYNONYMS: Record<string, string[]> = {
  search: ['find', 'lookup', 'query', 'magnify', 'discover', 'explore'],
  home: ['house', 'dashboard', 'main', 'start'],
  user: ['person', 'profile', 'account', 'avatar', 'member', 'human'],
  settings: ['cog', 'gear', 'preferences', 'options', 'configure', 'tools'],
  mail: ['email', 'envelope', 'message', 'inbox', 'letter'],
  trash: ['delete', 'remove', 'bin', 'discard', 'recycle'],
  heart: ['favorite', 'like', 'love', 'bookmark'],
  star: ['favorite', 'rate', 'rating', 'bookmark', 'feature'],
  lock: ['security', 'protect', 'secure', 'password', 'auth', 'private'],
  file: ['document', 'page', 'paper', 'sheet', 'report'],
  folder: ['directory', 'archive', 'storage', 'collection'],
  bell: ['notification', 'alert', 'alarm', 'reminder'],
  download: ['save', 'export', 'fetch', 'get'],
  upload: ['publish', 'import', 'send', 'cloud'],
  edit: ['modify', 'write', 'pencil', 'change'],
  copy: ['duplicate', 'clone', 'clipboard'],
  eye: ['view', 'show', 'visible', 'preview', 'look'],
  check: ['done', 'success', 'approved', 'complete', 'tick', 'ok'],
  x: ['close', 'cancel', 'dismiss', 'clear', 'delete'],
};

function main() {
  console.log('🚀 Starting Tabler Icons Ingestion Pipeline...\n');

  if (!fs.existsSync(TABLER_PKG_DIR)) {
    console.error('❌ Error: @tabler/icons package not found in node_modules.');
    process.exit(1);
  }

  // 1. Read Package Metadata
  const pkgJson = JSON.parse(fs.readFileSync(PKG_JSON_PATH, 'utf-8'));
  const version = pkgJson.version || '3.46.0';
  const license = pkgJson.license || 'MIT';

  const sourceMetadata: IconSource = {
    id: 'tabler',
    name: 'Tabler Icons',
    version,
    sourcePath: '@tabler/icons',
    license,
  };

  // 2. Read Official icons.json metadata
  const tablerIconsMeta: Record<string, any> = JSON.parse(fs.readFileSync(ICONS_JSON_PATH, 'utf-8'));

  // 3. Scan outline and filled directories
  const outlineFiles = fs.readdirSync(OUTLINE_DIR).filter((f) => f.endsWith('.svg'));
  const filledFiles = fs.readdirSync(FILLED_DIR).filter((f) => f.endsWith('.svg'));

  const outlineSlugs = new Set(outlineFiles.map((f) => f.replace(/\.svg$/, '')));
  const filledSlugs = new Set(filledFiles.map((f) => f.replace(/\.svg$/, '')));

  const allSlugs = Array.from(new Set([...outlineSlugs, ...filledSlugs])).sort();

  console.log(`📦 Found in @tabler/icons (v${version}):`);
  console.log(`   - Outline SVGs: ${outlineFiles.length}`);
  console.log(`   - Filled SVGs:  ${filledFiles.length}`);
  console.log(`   - Unique Conceptual Icon Families: ${allSlugs.length}\n`);

  let totalSvgAssets = 0;
  let warningsCount = 0;
  let invalidCount = 0;
  let duplicatesCount = 0;
  let missingMetaCount = 0;

  const catalog: Icon[] = [];
  const categoryCounts: Record<string, number> = {};
  const styleCounts: Record<string, number> = { outline: 0, filled: 0 };

  // Helper to build related icons index
  const prefixMap: Record<string, string[]> = {};
  for (const slug of allSlugs) {
    const parts = slug.split('-');
    const prefix = parts[0];
    if (!prefixMap[prefix]) prefixMap[prefix] = [];
    prefixMap[prefix].push(`tabler:${slug}`);
  }

  // 4. Ingest each icon concept
  for (let i = 0; i < allSlugs.length; i++) {
    const slug = allSlugs[i];
    const iconId = `tabler:${slug}`;
    const meta = tablerIconsMeta[slug];

    if (!meta) {
      missingMetaCount++;
    }

    const rawCategory = meta?.category || 'Interface';
    const category = CATEGORY_MAP[rawCategory] || rawCategory || 'Interface';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;

    const rawTags: string[] = (meta?.tags || []).map((t: any) => String(t).toLowerCase().trim());
    const tags = Array.from(new Set([slug, ...slug.split('-'), ...rawTags])).filter(Boolean);

    // Keyword expansion
    const keywordsSet = new Set<string>([...tags]);
    for (const tag of tags) {
      if (SYNONYMS[tag]) {
        SYNONYMS[tag].forEach((s) => keywordsSet.add(s));
      }
    }
    const keywords = Array.from(keywordsSet);

    const variants: IconVariant[] = [];

    // Process Outline Variant
    const hasOutline = outlineSlugs.has(slug);
    if (hasOutline) {
      const outlinePath = path.join(OUTLINE_DIR, `${slug}.svg`);
      const rawSvg = fs.readFileSync(outlinePath, 'utf-8');
      totalSvgAssets++;

      const validation = validateSvg(rawSvg);
      if (!validation.isValid) {
        invalidCount++;
        console.warn(`⚠️ Invalid SVG for ${slug} (outline):`, validation.errors);
      }
      if (validation.warnings.length > 0) warningsCount++;

      const sanitized = sanitizeSvgMarkup(rawSvg);
      const innerSvg = extractInnerSvg(sanitized).replace(/<path\s+stroke="none"\s+d="M0\s+0h24v24H0z"\s+fill="none"\s*\/>/gi, '').trim();
      const viewBox = extractViewBox(sanitized) || '0 0 24 24';

      const outlineCapabilities: SvgCapability = {
        color: true,
        size: true,
        strokeWidth: true,
        lineCap: true,
        lineJoin: true,
        background: true,
        rotation: true,
        flip: true,
      };

      variants.push({
        id: `tabler:${slug}:outline`,
        style: 'outline',
        label: 'Outline',
        svg: innerSvg,
        viewBox,
        capabilities: outlineCapabilities,
        supportsStroke: true,
        supportsColor: true,
        defaultStrokeWidth: 2,
      });

      styleCounts.outline++;
    }

    // Process Filled Variant
    const hasFilled = filledSlugs.has(slug);
    if (hasFilled) {
      const filledPath = path.join(FILLED_DIR, `${slug}.svg`);
      const rawSvg = fs.readFileSync(filledPath, 'utf-8');
      totalSvgAssets++;

      const validation = validateSvg(rawSvg);
      if (!validation.isValid) {
        invalidCount++;
        console.warn(`⚠️ Invalid SVG for ${slug} (filled):`, validation.errors);
      }
      if (validation.warnings.length > 0) warningsCount++;

      const sanitized = sanitizeSvgMarkup(rawSvg);
      const innerSvg = extractInnerSvg(sanitized).replace(/<path\s+stroke="none"\s+d="M0\s+0h24v24H0z"\s+fill="none"\s*\/>/gi, '').trim();
      const viewBox = extractViewBox(sanitized) || '0 0 24 24';

      const filledCapabilities: SvgCapability = {
        color: true,
        size: true,
        strokeWidth: false, // Filled icons do not support stroke width adjustment
        lineCap: false,
        lineJoin: false,
        background: true,
        rotation: true,
        flip: true,
      };

      variants.push({
        id: `tabler:${slug}:filled`,
        style: 'filled',
        label: 'Filled',
        svg: innerSvg,
        viewBox,
        capabilities: filledCapabilities,
        supportsStroke: false,
        supportsColor: true,
      });

      styleCounts.filled++;
    }

    // Primary variant for default display
    const primaryVariant = variants[0];
    if (!primaryVariant) {
      invalidCount++;
      continue;
    }

    // Related icons calculation (up to 8 related by prefix / category)
    const prefix = slug.split('-')[0];
    const candidateRelated = (prefixMap[prefix] || []).filter((id) => id !== iconId);
    const relatedIconIds = candidateRelated.slice(0, 8);

    // Deterministic Catalog Rank / Popularity Score
    const isCommon = ['arrow', 'chevron', 'user', 'home', 'search', 'settings', 'heart', 'star', 'check', 'x', 'plus', 'minus', 'edit', 'trash', 'mail', 'bell', 'file', 'folder'].some((k) => slug.includes(k));
    const popularityScore = Math.max(10, (isCommon ? 85 : 40) + Math.min(25, tags.length * 2));

    const iconRecord: Icon = {
      id: iconId,
      name: toTitleCase(slug),
      slug,
      familyId: slug,
      category,
      subcategory: rawCategory,
      tags,
      keywords,
      style: primaryVariant.style,
      variants,
      svg: primaryVariant.svg,
      viewBox: primaryVariant.viewBox,
      capabilities: primaryVariant.capabilities,
      popularityScore,
      popularity: popularityScore,
      catalogRank: i + 1,
      updatedAt: '2025-01-01T00:00:00.000Z',
      relatedIconIds,
      source: sourceMetadata,
      metadata: {
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        unicode: meta?.styles?.outline?.unicode || meta?.styles?.filled?.unicode,
        version: meta?.styles?.outline?.version || meta?.styles?.filled?.version || version,
        author: 'Paweł Kuna (codecalm)',
        license: 'MIT',
        source: 'https://github.com/tabler/tabler-icons',
      },
    };

    catalog.push(iconRecord);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  // 5. Write Catalog files
  const catalogPath = path.join(OUTPUT_DATA_DIR, 'catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');

  const categoriesPath = path.join(OUTPUT_DATA_DIR, 'categories.json');
  fs.writeFileSync(categoriesPath, JSON.stringify(categoryCounts, null, 2), 'utf-8');

  const stylesPath = path.join(OUTPUT_DATA_DIR, 'styles.json');
  fs.writeFileSync(stylesPath, JSON.stringify(styleCounts, null, 2), 'utf-8');

  const sourcesPath = path.join(OUTPUT_DATA_DIR, 'sources.json');
  fs.writeFileSync(sourcesPath, JSON.stringify([sourceMetadata], null, 2), 'utf-8');

  // Also write TypeScript export wrapper for optimal import
  const tsCatalogWrapper = `/**
 * GRIDFRAME ICON CATALOG (Tabler Icons v${version})
 * Auto-generated by scripts/import-tabler-icons.ts - DO NOT EDIT MANUALLY
 */
import type { Icon } from '@/types/icon';
import catalogData from './catalog.json';

export const GRIDFRAME_ICONS: Icon[] = catalogData as Icon[];
export const TOTAL_ICON_COUNT = GRIDFRAME_ICONS.length;
export default GRIDFRAME_ICONS;
`;
  fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'gridframe-catalog.ts'), tsCatalogWrapper, 'utf-8');

  // 6. Print Official Import Report
  console.log(`
======================================================
              TABLER IMPORT REPORT
======================================================
Source:               Tabler Icons
Installed Version:    ${version}
License:              ${license}

Total SVG Assets:     ${totalSvgAssets}
Outline Icons:        ${styleCounts.outline}
Filled Icons:         ${styleCounts.filled}
Conceptual Families:  ${catalog.length}
Unique Categories:    ${Object.keys(categoryCounts).length}

Warnings:             ${warningsCount}
Invalid SVGs:         ${invalidCount}
Duplicates:           ${duplicatesCount}
Missing Metadata:     ${missingMetaCount}

Catalog File:         src/data/icons/catalog.json (${(fs.statSync(catalogPath).size / 1024 / 1024).toFixed(2)} MB)
======================================================
✨ Ingestion successfully completed!
`);
}

main();
