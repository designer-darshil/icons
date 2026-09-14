/**
 * GRIDFRAME EXPANSION PIPELINE — BATCH 01
 * 
 * Generates +250 Canonical Icon Families (1,250 handcrafted 5-style vector assets)
 * across 14 high-impact domain categories.
 * 
 * Strict specifications:
 * - 24×24 canvas
 * - 5 coordinated styles: Light (1.5px), Regular (2.0px), Filled (solid), Duotone (2-tone), Duotone Line
 * - Full metadata with tags, keywords, aliases, useCases, relatedIcons, and primary/secondary categories
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Icon, IconVariant } from '../src/types/icon';
import { getCanonicalCategory } from '../src/data/category-registry';
import { extractInnerSvg } from '../src/lib/icon-sanitizer';

// Import all 14 Batch 01 domain modules
import { CLOUD_BATCH } from './data/batch-01/cloud';
import { DEVELOPMENT_BATCH } from './data/batch-01/development';
import { SECURITY_BATCH } from './data/batch-01/security';
import { COMMUNICATION_BATCH } from './data/batch-01/communication';
import { DESIGN_TOOLS_BATCH } from './data/batch-01/design-tools';
import { SHOPPING_BATCH } from './data/batch-01/shopping';
import { BUSINESS_BATCH } from './data/batch-01/business';
import { DEVICES_BATCH } from './data/batch-01/devices';
import { NAVIGATION_BATCH } from './data/batch-01/navigation';
import { USERS_BATCH } from './data/batch-01/users';
import { DOCS_BATCH } from './data/batch-01/docs';
import { ACTIONS_BATCH } from './data/batch-01/actions';
import { DATABASE_BATCH } from './data/batch-01/database';
import { HEALTH_SCIENCE_BATCH } from './data/batch-01/health-science';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

export interface BatchIconDefinition {
  id: string;
  name: string;
  slug: string;
  family: string;
  modifier?: string;
  primaryCategory: string;
  secondaryCategories: string[];
  tags: string[];
  keywords: string[];
  aliases: string[];
  useCases: string[];
  relatedIcons: string[];
  paths: {
    regular: string; // Inner SVG path/geometry for 2px regular
    light?: string;   // Optional custom light geometry
    filled: string;  // Dedicated solid filled geometry
    duotone: string; // 2-tone geometry with secondary opacity/tone
    duotoneLine?: string; // Duotone line geometry
  };
}

export const ALL_BATCH_01_DEFINITIONS: BatchIconDefinition[] = [
  ...CLOUD_BATCH,          // 15
  ...DEVELOPMENT_BATCH,    // 25
  ...SECURITY_BATCH,       // 20
  ...COMMUNICATION_BATCH,  // 20
  ...DESIGN_TOOLS_BATCH,   // 18
  ...SHOPPING_BATCH,       // 18
  ...BUSINESS_BATCH,       // 15
  ...DEVICES_BATCH,        // 15
  ...NAVIGATION_BATCH,     // 15
  ...USERS_BATCH,          // 15
  ...DOCS_BATCH,           // 18
  ...ACTIONS_BATCH,        // 20
  ...DATABASE_BATCH,       // 16
  ...HEALTH_SCIENCE_BATCH, // 20
];

/**
 * Builds canonical 5-variants for a Batch 01 icon definition
 */
export function buildBatchIconVariants(def: BatchIconDefinition): IconVariant[] {
  const cleanRegular = extractInnerSvg(def.paths.regular).trim();
  const cleanFilled = extractInnerSvg(def.paths.filled).trim();
  const cleanDuotone = extractInnerSvg(def.paths.duotone).trim();

  // 1. Regular Variant (2.0px stroke)
  const regularVariant: IconVariant = {
    id: `${def.slug}-regular`,
    style: 'regular',
    label: 'Regular',
    svg: cleanRegular,
    viewBox: '0 0 24 24',
    supportsStroke: true,
    supportsColor: true,
    defaultStrokeWidth: 2,
  };

  // 2. Light Variant (1.5px stroke)
  const lightVariant: IconVariant = {
    id: `${def.slug}-light`,
    style: 'light',
    label: 'Light',
    svg: def.paths.light ? extractInnerSvg(def.paths.light).trim() : cleanRegular,
    viewBox: '0 0 24 24',
    supportsStroke: true,
    supportsColor: true,
    defaultStrokeWidth: 1.5,
  };

  // 3. Filled Variant (solid fill)
  const filledVariant: IconVariant = {
    id: `${def.slug}-filled`,
    style: 'filled',
    label: 'Filled',
    svg: cleanFilled,
    viewBox: '0 0 24 24',
    supportsStroke: false,
    supportsColor: true,
    defaultStrokeWidth: 0,
  };

  // 4. Duotone Variant (2-tone layered)
  const duotoneVariant: IconVariant = {
    id: `${def.slug}-duotone`,
    style: 'duotone',
    label: 'Duotone',
    svg: cleanDuotone,
    viewBox: '0 0 24 24',
    supportsStroke: true,
    supportsColor: true,
    defaultStrokeWidth: 2,
  };

  // 5. Duotone Line Variant (dual-layer line stroke)
  const duotoneLineSvg = def.paths.duotoneLine
    ? extractInnerSvg(def.paths.duotoneLine).trim()
    : `<g opacity="0.25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">\n  ${cleanRegular}\n</g>\n<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n  ${cleanRegular}\n</g>`;

  const duotoneLineVariant: IconVariant = {
    id: `${def.slug}-duotone-line`,
    style: 'duotone-line',
    label: 'Duotone Line',
    svg: duotoneLineSvg,
    viewBox: '0 0 24 24',
    supportsStroke: true,
    supportsColor: true,
    defaultStrokeWidth: 1.5,
  };

  return [regularVariant, lightVariant, filledVariant, duotoneVariant, duotoneLineVariant];
}

/**
 * Transforms a BatchIconDefinition into a complete Icon catalog entity
 */
export function transformBatchDefinitionToIcon(def: BatchIconDefinition): Icon {
  const canonicalCat = getCanonicalCategory(def.primaryCategory);
  const variants = buildBatchIconVariants(def);
  const regularInner = variants[0].svg;

  return {
    id: def.slug,
    name: def.name,
    slug: def.slug,
    family: def.family,
    familyId: def.family,
    modifier: def.modifier,
    baseIcon: def.family,
    category: canonicalCat.name,
    primaryCategory: canonicalCat.slug,
    secondaryCategories: def.secondaryCategories.filter((s) => s !== canonicalCat.slug),
    otherReviewRequired: canonicalCat.slug === 'other',
    tags: Array.from(new Set([...def.tags, canonicalCat.slug, ...def.secondaryCategories])),
    keywords: Array.from(new Set([...def.keywords, def.name.toLowerCase(), canonicalCat.name.toLowerCase()])),
    aliases: def.aliases,
    useCases: def.useCases,
    defaultVariantId: `${def.slug}-regular`,
    style: 'regular',
    variants,
    svg: regularInner,
    viewBox: '0 0 24 24',
    capabilities: {
      color: true,
      size: true,
      strokeWidth: true,
      lineCap: true,
      lineJoin: true,
      background: true,
      rotation: true,
      flip: true,
    },
    popularity: 150,
    relatedIconIds: def.relatedIcons,
  };
}

/**
 * Executes Batch 01 ingestion into the main production catalog.
 */
export function executeBatch01Ingestion(): { totalCatalog: number; batchCount: number } {
  console.log('🚀 Starting GRIDFRAME Expansion Batch 01 Ingestion...');
  console.log(`📦 Loaded ${ALL_BATCH_01_DEFINITIONS.length} Batch 01 Icon Family Definitions.`);

  // Load existing catalog
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found at ${CATALOG_PATH}`);
  }

  const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog: Icon[] = JSON.parse(raw);
  const catalogMap = new Map<string, Icon>();
  
  for (const icon of catalog) {
    catalogMap.set(icon.slug, icon);
  }

  const existingCount = catalogMap.size;
  let addedCount = 0;
  let updatedCount = 0;

  for (const def of ALL_BATCH_01_DEFINITIONS) {
    const icon = transformBatchDefinitionToIcon(def);
    if (catalogMap.has(def.slug)) {
      updatedCount++;
    } else {
      addedCount++;
    }
    catalogMap.set(def.slug, icon);
  }

  const updatedCatalog = Array.from(catalogMap.values()).sort((a, b) => a.slug.localeCompare(b.slug));

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf8');

  console.log(`✅ Ingestion Complete!`);
  console.log(`   - Previous Catalog: ${existingCount} icons`);
  console.log(`   - Batch 01 Added:   ${addedCount} icons`);
  console.log(`   - Batch 01 Updated: ${updatedCount} icons`);
  console.log(`   - Total Catalog:    ${updatedCatalog.length} icons`);

  return { totalCatalog: updatedCatalog.length, batchCount: ALL_BATCH_01_DEFINITIONS.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  executeBatch01Ingestion();
}
