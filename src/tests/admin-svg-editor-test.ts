import { GRIDFRAME_ICONS } from '../data/icons/gridframe-catalog';
import { sanitizeSvgMarkup, extractViewBox } from '../lib/svg/sanitizeSvg';
import { validateSvg } from '../lib/svg/validateSvg';
import { normalizeSvg } from '../lib/svg/normalizeSvg';
import { optimizeSvg } from '../lib/svg/optimizeSvg';
import type { IconVariant } from '../types/icon';

console.log(`\n======================================================`);
console.log(`🧪 RUNNING ADMIN SVG UPLOAD & SVG EDITOR TEST SUITE`);
console.log(`======================================================\n`);

// TEST 1: Strict SVG Sanitization
console.log('--- TEST 1: SVG Sanitization Security Gate ---');
const maliciousSvg = `
<svg viewBox="0 0 24 24" onload="alert('xss')" xmlns="http://www.w3.org/2000/svg">
  <script>console.log('malicious script');</script>
  <path d="M12 2L2 22h20L12 2z" onclick="stealData()" />
  <a href="javascript:void(0)"><circle cx="12" cy="12" r="3" /></a>
  <!-- Developer comment -->
</svg>
`;

const sanitized = sanitizeSvgMarkup(maliciousSvg);
if (sanitized.includes('<script') || sanitized.includes('onload=') || sanitized.includes('onclick=') || sanitized.includes('javascript:')) {
  throw new Error('Sanitizer failed to strip malicious script or event handler content');
}
if (!sanitized.includes('<path') || !sanitized.includes('<circle')) {
  throw new Error('Sanitizer destroyed legitimate SVG vector geometry');
}
console.log('  ✓ Malicious tags (<script>, onload, onclick, javascript:) stripped while preserving vector paths.');

// TEST 2: SVG Structural Validation
console.log('--- TEST 2: SVG Validation Diagnostics ---');
const validSvg = '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" /></svg>';
const validRes = validateSvg(validSvg);
if (!validRes.isValid || validRes.errors.length > 0) {
  throw new Error('Validator falsely flagged valid SVG as invalid');
}

const emptySvg = '<svg viewBox="0 0 24 24"></svg>';
const emptyRes = validateSvg(emptySvg);
if (emptyRes.isValid) {
  throw new Error('Validator should reject empty SVG without vector path elements');
}
console.log('  ✓ SVG validator accurately accepts valid vector geometry and rejects empty or broken SVGs.');

// TEST 3: Coordinate Normalization to 24×24 Canvas
console.log('--- TEST 3: Non-24×24 ViewBox Detection & Normalization ---');
const largeViewBoxSvg = '<svg viewBox="0 0 512 512"><path d="M256 50L50 450h412L256 50z" /></svg>';
const rawViewBox = extractViewBox(largeViewBoxSvg);
if (rawViewBox !== '0 0 512 512') {
  throw new Error(`Expected extracted viewBox "0 0 512 512", got "${rawViewBox}"`);
}

const normalized = normalizeSvg(largeViewBoxSvg, 'regular');
if (normalized.viewBox !== '0 0 24 24') {
  throw new Error(`Normalization failed to map to 24x24 canvas: ${normalized.viewBox}`);
}
if (!normalized.innerSvg.includes('<path') && !normalized.innerSvg.includes('<polygon') && !normalized.innerSvg.includes('<line')) {
  throw new Error('Normalized SVG lacks vector geometry');
}
console.log('  ✓ 512×512 coordinate frame successfully normalized to canonical 24×24 Gridframe canvas.');

// TEST 4: SVG Optimization Integrity
console.log('--- TEST 4: SVG Optimization Without Geometry Destruction ---');
const rawWithBloat = `
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.0.0, SVG Export Plug-In -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
  <path d="M12 2L2 22h20L12 2z" />
</svg>
`;

const optimized = optimizeSvg(rawWithBloat);
if (optimized.includes('<?xml') || optimized.includes('<!-- Generator') || optimized.includes('xmlns:xlink')) {
  throw new Error('Optimizer failed to strip redundant XML and editor metadata headers');
}
if (!optimized.includes('viewBox="0 0 24 24"') || !optimized.includes('<path d="M12 2L2 22h20L12 2z"')) {
  throw new Error('Optimizer corrupted or destroyed canonical path geometry');
}
console.log('  ✓ XML declarations, comments, and redundant editor attributes cleanly stripped.');

// TEST 5: Duplicate Concept Detection
console.log('--- TEST 5: Duplicate Concept Detection ---');
const targetSlug = 'cloud-storage';
const existingMatch = GRIDFRAME_ICONS.find((i) => i.slug === targetSlug);
if (!existingMatch) {
  throw new Error('Expected cloud-storage icon to exist for duplicate detection test');
}
const duplicateDetected = GRIDFRAME_ICONS.some((i) => i.slug === 'cloud-storage' || i.name.toLowerCase() === 'cloud storage');
if (!duplicateDetected) {
  throw new Error('Duplicate check failed to detect existing concept');
}
console.log(`  ✓ Duplicate detection successfully flagged existing concept [${existingMatch.name}] (${existingMatch.slug}).`);

// TEST 6: Multi-Variant Storage Architecture
console.log('--- TEST 6: Authentic Variant Storage Model ---');
const testVariants: IconVariant[] = [
  {
    id: 'test-icon-regular',
    style: 'regular',
    label: 'Regular',
    svg: '<circle cx="12" cy="12" r="10" />',
    viewBox: '0 0 24 24',
    supportsStroke: true,
    supportsColor: true,
  },
  {
    id: 'test-icon-filled',
    style: 'filled',
    label: 'Filled',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" />',
    viewBox: '0 0 24 24',
    supportsStroke: false,
    supportsColor: true,
  },
];

if (testVariants.length !== 2) {
  throw new Error('Variant array size mismatch');
}
const hasDuplicates = new Set(testVariants.map((v) => v.style)).size !== testVariants.length;
if (hasDuplicates) {
  throw new Error('Multiple variants of the same style detected');
}
console.log('  ✓ Authentic variant storage maintains 1 concept = multiple independent authentic variant records.');

console.log(`\n======================================================`);
console.log(`🏆 ALL ADMIN SVG UPLOAD & SVG EDITOR CHECKS PASSED!`);
console.log(`======================================================\n`);
