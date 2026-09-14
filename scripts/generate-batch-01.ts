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
 * Builds canonical variants for a Batch 01 icon definition
 * ONLY includes variants that actually have authentic author-crafted paths.
 */
export function buildBatchIconVariants(def: BatchIconDefinition): IconVariant[] {
  const variants: IconVariant[] = [];

  // 1. Regular Variant (2.0px stroke) - Always present in Batch definitions
  if (def.paths.regular) {
    const cleanRegular = extractInnerSvg(def.paths.regular).trim();
    variants.push({
      id: `${def.slug}-regular`,
      style: 'regular',
      label: 'Regular',
      svg: cleanRegular,
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
      supportsStroke: true,
      supportsColor: true,
      defaultStrokeWidth: 2,
    });
  }

  // 2. Light Variant (1.5px stroke) - ONLY if dedicated light path exists
  if (def.paths.light && def.paths.light.trim().length > 0) {
    const cleanLight = extractInnerSvg(def.paths.light).trim();
    variants.push({
      id: `${def.slug}-light`,
      style: 'light',
      label: 'Light',
      svg: cleanLight,
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
      supportsStroke: true,
      supportsColor: true,
      defaultStrokeWidth: 1.5,
    });
  }

  // 3. Filled Variant (solid fill) - ONLY if dedicated filled path exists
  if (def.paths.filled && def.paths.filled.trim().length > 0) {
    const cleanFilled = extractInnerSvg(def.paths.filled).trim();
    variants.push({
      id: `${def.slug}-filled`,
      style: 'filled',
      label: 'Filled',
      svg: cleanFilled,
      viewBox: '0 0 24 24',
      capabilities: {
        color: true,
        size: true,
        strokeWidth: false,
        lineCap: false,
        lineJoin: false,
        background: true,
        rotation: true,
        flip: true,
      },
      supportsStroke: false,
      supportsColor: true,
      defaultStrokeWidth: 0,
    });
  }

  // 4. Duotone Variant (2-tone layered) - ONLY if dedicated duotone path exists
  if (def.paths.duotone && def.paths.duotone.trim().length > 0) {
    const cleanDuotone = extractInnerSvg(def.paths.duotone).trim();
    variants.push({
      id: `${def.slug}-duotone`,
      style: 'duotone',
      label: 'Duotone',
      svg: cleanDuotone,
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
      supportsStroke: true,
      supportsColor: true,
      defaultStrokeWidth: 2,
    });
  }

  // 5. Duotone Line Variant - ONLY if dedicated duotoneLine path exists
  if (def.paths.duotoneLine && def.paths.duotoneLine.trim().length > 0) {
    const cleanDuotoneLine = extractInnerSvg(def.paths.duotoneLine).trim();
    variants.push({
      id: `${def.slug}-duotone-line`,
      style: 'duotone-line',
      label: 'Duotone Line',
      svg: cleanDuotoneLine,
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
      supportsStroke: true,
      supportsColor: true,
      defaultStrokeWidth: 1.5,
    });
  }

  return variants;
}

/**
 * Transforms a BatchIconDefinition into a complete Icon catalog entity
 */
export function transformBatchDefinitionToIcon(def: BatchIconDefinition): Icon {
  const canonicalCat = getCanonicalCategory(def.primaryCategory);
  const variants = buildBatchIconVariants(def);
  const regularVariant = variants.find((v) => v.style === 'regular') || variants[0];
  const regularInner = regularVariant.svg;

  return {
    id: def.slug,
    name: def.name,
    slug: def.slug,
    family: def.family || def.slug,
    familyId: def.family || def.slug,
    modifier: def.modifier || 'base',
    baseIcon: def.family || def.slug,
    category: canonicalCat.name,
    primaryCategory: canonicalCat.slug,
    secondaryCategories: def.secondaryCategories || [],
    otherReviewRequired: false,
    tags: Array.from(new Set([...def.tags, canonicalCat.slug, ...(def.secondaryCategories || [])])),
    keywords: Array.from(new Set([...def.keywords, def.name.toLowerCase(), canonicalCat.name.toLowerCase()])),
    aliases: def.aliases || [def.name.toLowerCase()],
    useCases: def.useCases || [`Vector icon for ${def.name.toLowerCase()}.`],
    defaultVariantId: regularVariant.id,
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
    popularity: 100,
    relatedIconIds: def.relatedIcons || [],
    source: {
      id: 'iconoir',
      name: 'Iconoir',
      version: '7.12.1',
      sourcePath: 'scripts/data/batch-01',
      license: 'MIT',
    },
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
