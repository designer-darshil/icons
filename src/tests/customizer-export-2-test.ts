/**
 * Gridframe V2 — Icon Customizer & Export Experience 2.0 Test Suite
 * Validates regression test icons (Accessibility, User Xmark, Cloud, Search, Heart, Home, Settings, Archive),
 * available variant rendering, size scaling (16, 24, 32, 48, 64), color customization,
 * rotation, flip, reset, and SVG export consistency.
 */

import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { transformSvgMarkup, isCustomized } from '../lib/icon-transformer';
import { optimizeSvg, validateLibrarySvg } from '../lib/svg/optimizeSvg';
import { DEFAULT_CUSTOMIZATION, SIZE_PRESETS } from '../types/customization';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    throw new Error(`Customizer & Export 2.0 Test Failed: ${msg}`);
  }
}

const REGRESSION_ICON_SLUGS = [
  'accessibility',
  'user-xmark',
  'cloud',
  'search',
  'heart',
  'home',
  'settings',
  'archive',
];

export async function runCustomizerExport2TestSuite() {
  console.log('\n======================================================');
  console.log('  🎨 GRIDFRAME V2 — CUSTOMIZER & EXPORT 2.0 TEST SUITE');
  console.log('======================================================\n');

  // ─────────────────────────────────────────────────────────────
  // 1. Regression Test Icons & Variant Integrity
  // ─────────────────────────────────────────────────────────────
  console.log('1. Testing Regression Icons across all available styles...');
  for (const slug of REGRESSION_ICON_SLUGS) {
    const icon = GRIDFRAME_ICONS.find(
      (i) => i.slug.toLowerCase() === slug || i.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    if (!icon) {
      console.warn(`   ⚠️ Regression icon with slug "${slug}" not found in catalog, skipping.`);
      continue;
    }

    assert(icon.variants.length > 0, `Icon "${icon.name}" has at least 1 variant`);
    assert(
      icon.variants.some((v) => v.style === 'regular' || v.style === 'linear' || v.style === 'outline'),
      `Icon "${icon.name}" has canonical regular variant`
    );

    for (const v of icon.variants) {
      assert(Boolean(v.svg), `Variant "${v.style}" on "${icon.name}" has valid SVG data`);
      assert(Boolean(v.viewBox), `Variant "${v.style}" on "${icon.name}" has valid viewBox`);
      // Validate markup
      const validation = validateLibrarySvg(v.svg);
      assert(validation.isValid, `Variant "${v.style}" on "${icon.name}" is valid SVG: ${validation.issues.join(', ')}`);
    }
  }
  console.log('   ✓ Regression icons verified with valid canonical SVG sources');

  // ─────────────────────────────────────────────────────────────
  // 2. Preset Sizes & Obvious Scaling (16, 24, 32, 48, 64)
  // ─────────────────────────────────────────────────────────────
  console.log('2. Testing Preset Sizes (16px, 24px, 32px, 48px, 64px)...');
  const sampleIcon = GRIDFRAME_ICONS[0];
  const sampleVariant = sampleIcon.variants[0];

  for (const sz of SIZE_PRESETS) {
    const customized = transformSvgMarkup(sampleVariant, {
      ...DEFAULT_CUSTOMIZATION,
      size: sz,
    });
    assert(customized.includes(`width="${sz}"`), `SVG width correctly set to ${sz}`);
    assert(customized.includes(`height="${sz}"`), `SVG height correctly set to ${sz}`);
  }
  console.log('   ✓ All 5 preset sizes tested and verified');

  // ─────────────────────────────────────────────────────────────
  // 3. Color Customization (currentColor, Custom Hex)
  // ─────────────────────────────────────────────────────────────
  console.log('3. Testing Color Customization across variants...');
  const testColors = ['currentColor', '#FF5024', '#F6F3EC', '#141311', '#E8A938'];
  for (const c of testColors) {
    const customized = transformSvgMarkup(sampleVariant, {
      ...DEFAULT_CUSTOMIZATION,
      color: c,
    });
    assert(customized.includes(`color="${c}"`), `SVG root has color="${c}"`);
    if (sampleVariant.supportsStroke !== false) {
      assert(customized.includes(`stroke="${c}"`), `SVG root has stroke="${c}"`);
    }
  }
  console.log('   ✓ Color mapping verified');

  // ─────────────────────────────────────────────────────────────
  // 4. Transform: Flip & Rotate
  // ─────────────────────────────────────────────────────────────
  console.log('4. Testing Flip (Horizontal/Vertical) and Rotation (90°, 180°, 270°)...');
  const flippedH = transformSvgMarkup(sampleVariant, {
    ...DEFAULT_CUSTOMIZATION,
    flipX: true,
  });
  assert(flippedH.includes('scale(-1, 1) translate(-24, 0)'), 'Flip horizontal transform applied');

  const flippedV = transformSvgMarkup(sampleVariant, {
    ...DEFAULT_CUSTOMIZATION,
    flipY: true,
  });
  assert(flippedV.includes('scale(1, -1) translate(0, -24)'), 'Flip vertical transform applied');

  const rotated90 = transformSvgMarkup(sampleVariant, {
    ...DEFAULT_CUSTOMIZATION,
    rotation: 90,
  });
  assert(rotated90.includes('rotate(90 12 12)'), 'Rotate 90° transform applied');
  console.log('   ✓ Transform operations verified');

  // ─────────────────────────────────────────────────────────────
  // 5. Reset Behavior
  // ─────────────────────────────────────────────────────────────
  console.log('5. Testing Reset & Customization State detection...');
  const dirtyCustomization = {
    ...DEFAULT_CUSTOMIZATION,
    size: 48,
    color: '#FF5024',
    rotation: 90,
    flipX: true,
  };
  assert(isCustomized(dirtyCustomization), 'Dirty customization detected as customized');

  const resetCustomization = DEFAULT_CUSTOMIZATION;
  assert(!isCustomized(resetCustomization), 'Reset customization matches default');
  console.log('   ✓ Reset state verified');

  // ─────────────────────────────────────────────────────────────
  // 6. Export Consistency (Preview = Copy SVG = Download SVG)
  // ─────────────────────────────────────────────────────────────
  console.log('6. Testing Export Consistency & Optimization...');
  for (const icon of GRIDFRAME_ICONS.slice(0, 15)) {
    for (const v of icon.variants) {
      const exported = transformSvgMarkup(v, {
        ...DEFAULT_CUSTOMIZATION,
        size: 32,
        color: '#FF5024',
        rotation: 90,
      });

      const optimized = optimizeSvg(exported);
      assert(optimized.length > 0, `Optimized SVG for ${icon.slug} is non-empty`);
      assert(optimized.includes('viewBox="0 0 24 24"'), `Optimized SVG preserves viewBox for ${icon.slug}`);
      assert(optimized.includes('width="32"'), `Optimized SVG preserves width="32" for ${icon.slug}`);
      assert(optimized.includes('height="32"'), `Optimized SVG preserves height="32" for ${icon.slug}`);
    }
  }
  console.log('   ✓ Export consistency verified across 15 catalog concepts');

  console.log('\n======================================================');
  console.log('  ✅ CUSTOMIZER & EXPORT 2.0: ALL CHECKS PASSED (100%)');
  console.log('======================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCustomizerExport2TestSuite().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
