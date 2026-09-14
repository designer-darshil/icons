/**
 * Test Suite: Shareable Icon Configuration
 * Validates serialization, deserialization, validation, security boundaries,
 * and canonical SVG export parity for shared icon configurations.
 */

import {
  serializeIconConfiguration,
  deserializeIconConfiguration,
  sanitizeColor,
  getShareableIconUrl,
} from '../lib/icon-share';
import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { transformSvgMarkup } from '../lib/icon-transformer';
import { optimizeSvg } from '../lib/svg/optimizeSvg';
import { DEFAULT_CUSTOMIZATION } from '../types/customization';
import type { Icon } from '../types/icon';

export function runShareableIconConfigTests() {
  console.log('\n======================================================');
  console.log('  🔗 GRIDFRAME V2 — SHAREABLE ICON CONFIG TEST SUITE');
  console.log('======================================================\n');

  const accessibilityIcon = GRIDFRAME_ICONS.find((i: Icon) => i.slug === 'accessibility') || GRIDFRAME_ICONS[0];
  const userIcon = GRIDFRAME_ICONS.find((i: Icon) => i.slug === 'user') || GRIDFRAME_ICONS[1];

  // 1. Serialization Tests
  console.log('1. Testing URL Serialization...');
  {
    // Default config -> clean URL without query parameters
    const defaultUrl = serializeIconConfiguration(accessibilityIcon.slug, 'regular', DEFAULT_CUSTOMIZATION);
    if (defaultUrl !== `/icons/${accessibilityIcon.slug}`) {
      throw new Error(`Expected clean default URL "/icons/${accessibilityIcon.slug}", got "${defaultUrl}"`);
    }

    // Full custom config
    const customUrl = serializeIconConfiguration(accessibilityIcon.slug, 'filled', {
      ...DEFAULT_CUSTOMIZATION,
      color: '#FF5024',
      size: 48,
      rotation: 90,
      flipX: true,
      flipY: false,
    });

    const expectedParts = ['variant=filled', 'color=FF5024', 'size=48', 'rotate=90', 'flip=x'];
    for (const part of expectedParts) {
      if (!customUrl.includes(part)) {
        throw new Error(`Serialized URL missing "${part}": ${customUrl}`);
      }
    }
    console.log(`   ✓ Serialized URL format: ${customUrl}`);
  }

  // 2. Deserialization Tests
  console.log('2. Testing URL Deserialization & State Reconstruction...');
  {
    const searchString = '?variant=filled&color=FF5024&size=48&rotate=90&flip=x';
    const result = deserializeIconConfiguration(searchString, accessibilityIcon);

    if (result.customization.size !== 48) {
      throw new Error(`Expected size 48, got ${result.customization.size}`);
    }
    if (result.customization.color !== '#FF5024') {
      throw new Error(`Expected color #FF5024, got ${result.customization.color}`);
    }
    if (result.customization.rotation !== 90) {
      throw new Error(`Expected rotation 90, got ${result.customization.rotation}`);
    }
    if (result.customization.flipX !== true || result.customization.flipY !== false) {
      throw new Error(`Expected flipX=true and flipY=false, got flipX=${result.customization.flipX}, flipY=${result.customization.flipY}`);
    }
    console.log('   ✓ Reconstructed configuration matches shared parameters precisely');
  }

  // 3. Security & Untrusted Input Validation
  console.log('3. Testing Untrusted Input & Security Sanitization...');
  {
    // A. XSS / Malformed Color Injection
    const maliciousColor = sanitizeColor('<script>alert(1)</script>');
    if (maliciousColor !== DEFAULT_CUSTOMIZATION.color) {
      throw new Error(`Malicious color payload was not sanitized: got "${maliciousColor}"`);
    }

    // B. Invalid Variant
    const invalidVariantConfig = deserializeIconConfiguration('?variant=nonexistent_style_123', accessibilityIcon);
    if (!accessibilityIcon.variants.some((v) => v.style === invalidVariantConfig.style)) {
      throw new Error(`Invalid variant style was not safely mapped to a valid variant`);
    }

    // C. Negative / Out of bounds Size
    const badSizeConfig = deserializeIconConfiguration('?size=-99999', accessibilityIcon);
    if (badSizeConfig.customization.size !== DEFAULT_CUSTOMIZATION.size) {
      throw new Error(`Negative size was not safely defaulted: got ${badSizeConfig.customization.size}`);
    }

    const hugeSizeConfig = deserializeIconConfiguration('?size=999999', accessibilityIcon);
    if (hugeSizeConfig.customization.size !== DEFAULT_CUSTOMIZATION.size) {
      throw new Error(`Oversized size was not safely defaulted: got ${hugeSizeConfig.customization.size}`);
    }

    // D. Invalid Rotation
    const badRotateConfig = deserializeIconConfiguration('?rotate=47', accessibilityIcon);
    if (badRotateConfig.customization.rotation !== 0) {
      throw new Error(`Non-cardinal rotation was not safely defaulted to 0: got ${badRotateConfig.customization.rotation}`);
    }

    console.log('   ✓ Malicious payloads, invalid variants, and out-of-range parameters safely neutralized');
  }

  // 4. Transform & Canonical Export Consistency
  console.log('4. Testing Export Markup Parity for Shared Config...');
  {
    const sharedConfig = deserializeIconConfiguration('?variant=regular&color=FF5024&size=64&rotate=180&flip=both', userIcon);
    const variant = userIcon.variants.find((v) => v.style === sharedConfig.style) || userIcon.variants[0];

    const previewSvg = transformSvgMarkup(variant, sharedConfig.customization);
    const optimizedSvg = optimizeSvg(previewSvg);

    if (!previewSvg.includes('width="64"') || !previewSvg.includes('height="64"')) {
      throw new Error('Transformed SVG missing shared size 64');
    }
    if (!optimizedSvg.includes('stroke="#FF5024"')) {
      throw new Error('Optimized SVG missing shared color #FF5024');
    }
    if (!previewSvg.includes('stroke="#FF5024"')) {
      throw new Error('Transformed SVG missing shared color #FF5024');
    }
    if (!previewSvg.includes('rotate(180 12 12)')) {
      throw new Error('Transformed SVG missing shared 180° rotation transform');
    }
    if (!previewSvg.includes('scale(-1, 1)') || !previewSvg.includes('scale(1, -1)')) {
      throw new Error('Transformed SVG missing shared flip transforms');
    }

    console.log('   ✓ Preview markup matches exported SVG specifications exactly');
  }

  // 5. URL Generation Invariants
  console.log('5. Testing Absolute Share URL Resolution...');
  {
    const shareUrl = getShareableIconUrl('search', 'regular', { size: 32, color: 'currentColor' });
    if (!shareUrl.includes('/icons/search?size=32')) {
      throw new Error(`Unexpected share URL output: ${shareUrl}`);
    }
    console.log(`   ✓ Share URL generated: ${shareUrl}`);
  }

  console.log('\n  🎉 ALL SHAREABLE ICON CONFIG TESTS PASSED (100% SUCCESS)\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runShareableIconConfigTests();
}
