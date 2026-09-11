/**
 * GRIDFRAME Native Catalog Compilation & Ingestion Pipeline
 * 
 * Compiles the 50-Family Golden Library into production catalog format:
 * - Computes optical bounds & center scores
 * - Validates safe zone compliance (22×22 within 24×24)
 * - Emits canonical catalog.json and system-report.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GOLDEN_LIBRARY_CONCEPTS } from '../src/data/native-icons/golden-library';
import { analyzeIconOpticalSystem } from '../src/lib/svg/opticalBounds';
import { validateIconConceptVariants } from '../src/lib/svg/variantValidator';
import type { Icon, IconVariant, CanonicalIconVariant } from '../src/types/icon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DATA_DIR = path.resolve(__dirname, '../src/data/icons');
const CATALOG_OUTPUT_PATH = path.join(OUTPUT_DATA_DIR, 'catalog.json');
const SYSTEM_REPORT_PATH = path.join(OUTPUT_DATA_DIR, 'system-report.json');

export function buildGridframeCatalog(): { catalog: Icon[]; totalVariants: number } {
  console.log('⚡ Compiling GRIDFRAME Native Golden Icon Library...');
  console.log(`📦 Processing ${GOLDEN_LIBRARY_CONCEPTS.length} canonical icon families...\n`);

  const catalog: Icon[] = [];
  let totalVariants = 0;

  for (const conceptDef of GOLDEN_LIBRARY_CONCEPTS) {
    const canonicalStyles: CanonicalIconVariant[] = ['light', 'regular', 'filled', 'duotone', 'duotone-line'];
    const variants: IconVariant[] = [];

    for (const style of canonicalStyles) {
      const vDef = conceptDef.variants[style];
      if (!vDef) {
        throw new Error(`Missing variant '${style}' for icon concept '${conceptDef.slug}'`);
      }

      variants.push({
        id: `${conceptDef.slug}-${style}`,
        style: style,
        label: style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' '),
        svg: vDef.svg.trim(),
        viewBox: '0 0 24 24',
        supportsStroke: vDef.supportsStroke,
        supportsColor: true,
        defaultStrokeWidth: vDef.defaultStrokeWidth,
      });
    }

    totalVariants += variants.length;

    // Regular is canonical baseline
    const regularVariant = variants.find((v) => v.style === 'regular')!;
    const optical = analyzeIconOpticalSystem(regularVariant.svg, 2.0);

    // Validate 5 variants
    const validation = validateIconConceptVariants(conceptDef.slug, variants);

    // Populate variant reports
    for (const v of variants) {
      const rep = validation.variantReports[v.style as CanonicalIconVariant];
      if (rep) {
        v.qualityStatus = rep.status;
        v.qualityReport = rep;
      }
    }

    const icon: Icon = {
      id: conceptDef.id,
      name: conceptDef.name,
      slug: conceptDef.slug,
      family: conceptDef.family,
      familyId: conceptDef.family,
      baseIcon: conceptDef.baseIcon,
      modifier: conceptDef.modifier,
      category: conceptDef.category,
      tags: conceptDef.tags,
      keywords: conceptDef.keywords,
      useCases: conceptDef.useCases,
      aliases: conceptDef.aliases,
      legacySlugs: [],
      style: 'regular',
      variants: variants,
      svg: regularVariant.svg,
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
      metadata: {
        viewBox: '0 0 24 24',
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
      qualityScore: validation.overallScore,
      variantReports: validation.variantReports,
      source: {
        id: 'gridframe-native',
        name: 'GRIDFRAME Native Design System',
        version: '2.0.0',
        sourcePath: 'src/data/native-icons/golden-library.ts',
        license: 'MIT',
      },
      relatedIconIds: [],
      popularity: conceptDef.popularity,
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    };

    catalog.push(icon);
  }

  // Populate related icon IDs within same family
  const familyMap = new Map<string, string[]>();
  for (const item of catalog) {
    const fam = item.family || item.slug;
    if (!familyMap.has(fam)) familyMap.set(fam, []);
    familyMap.get(fam)!.push(item.id);
  }

  for (const item of catalog) {
    const fam = item.family || item.slug;
    const siblings = familyMap.get(fam) || [];
    item.relatedIconIds = siblings.filter((id) => id !== item.id);
  }

  // Sort canonically by popularity & name
  catalog.sort((a, b) => {
    if ((b.popularity || 0) !== (a.popularity || 0)) {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    return a.name.localeCompare(b.name);
  });

  // Write catalog.json
  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  console.log(`💾 Writing ${CATALOG_OUTPUT_PATH}...`);
  fs.writeFileSync(CATALOG_OUTPUT_PATH, JSON.stringify(catalog, null, 2), 'utf-8');

  // Write system-report.json
  const categories = Array.from(new Set(catalog.map((i) => i.category))).sort();
  const systemReport = {
    generatedAt: new Date().toISOString(),
    edition: 'GRIDFRAME Golden Reference Library v2.0',
    totalConcepts: catalog.length,
    totalVariants,
    variantsPerConcept: 5.0,
    categories,
    familyCount: familyMap.size,
    statusSummary: {
      totalAudited: catalog.length,
      averageQualityScore: Math.round(catalog.reduce((sum, i) => sum + (i.qualityScore ?? 100), 0) / catalog.length),
      allFiveVariantsPresent: true,
    },
  };

  console.log(`💾 Writing ${SYSTEM_REPORT_PATH}...`);
  fs.writeFileSync(SYSTEM_REPORT_PATH, JSON.stringify(systemReport, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`  🎉 GRIDFRAME NATIVE CATALOG COMPILED`);
  console.log(`  - Unique Conceptual Icons:  ${catalog.length.toLocaleString()}`);
  console.log(`  - Total Vector Variants:    ${totalVariants.toLocaleString()}`);
  console.log(`  - Avg Variants per Concept: ${(totalVariants / catalog.length).toFixed(2)}`);
  console.log(`======================================================\n`);

  return { catalog, totalVariants };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildGridframeCatalog();
}
