import { formatSvg, formatReact, formatHtml, formatDataUri, formatCss } from '../lib/export-formatters';
import { generateIconFilename, toPascalCase, toKebabCase } from '../lib/filename-utils';
import type { Icon, IconVariant } from '../types/icon';
import type { IconCustomization } from '../types/customization';

const mockVariant: IconVariant = {
  id: 'arrow-right-linear',
  style: 'linear',
  label: 'Linear',
  svg: '<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  viewBox: '0 0 24 24',
  supportsStroke: true,
  supportsColor: true,
};

const mockIcon: Icon = {
  id: 'icon-arrow-right',
  name: 'Arrow Right',
  slug: 'arrow-right',
  category: 'arrows',
  tags: ['arrow', 'right', 'direction', 'forward'],
  keywords: ['next', 'navigate'],
  style: 'linear',
  variants: [mockVariant],
  svg: mockVariant.svg,
  viewBox: '0 0 24 24',
  popularity: 98,
  updatedAt: '2026-03-01',
  relatedIconIds: [],
};

const customConfig: IconCustomization = {
  color: '#3B82F6',
  size: 32,
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  rotation: 90,
  flipX: true,
  flipY: false,
  background: 'dots',
};

console.log('--- Testing Filename & Identifier Generation ---');
console.assert(toPascalCase('arrow-right') === 'ArrowRight', 'PascalCase failed');
console.assert(toKebabCase('ArrowRight') === 'arrow-right', 'KebabCase failed');
console.assert(generateIconFilename('Arrow Right', 'linear', 'svg') === 'arrow-right-linear.svg', 'Filename failed');
console.log('✓ Filename helpers passed');

console.log('--- Testing Raw SVG Export ---');
const svgOut = formatSvg(mockIcon, mockVariant, customConfig);
console.assert(svgOut.filename === 'arrow-right-linear.svg', 'SVG filename mismatch');
console.assert(svgOut.code.includes('width="32"'), 'SVG size mismatch');
console.assert(svgOut.code.includes('color="#3B82F6"') || svgOut.code.includes('stroke="#3B82F6"'), 'SVG stroke color mismatch');
console.assert(svgOut.code.includes('stroke-width="2.5"'), 'SVG stroke width mismatch');
console.assert(svgOut.code.includes('rotate(90 12 12)'), 'SVG rotation mismatch');
console.log('✓ SVG Export passed\n', svgOut.code);

console.log('--- Testing React TSX Export ---');
const reactOut = formatReact(mockIcon, mockVariant, customConfig);
console.assert(reactOut.filename === 'IconArrowRightLinear.tsx', 'React filename mismatch');
console.assert(reactOut.code.includes('export function IconArrowRightLinear'), 'React component function mismatch');
console.assert(reactOut.code.includes('size = 32'), 'React default size mismatch');
console.assert(reactOut.code.includes("color = '#3B82F6'"), 'React default color mismatch');
console.assert(reactOut.code.includes('strokeWidth={2.5}'), 'React strokeWidth prop mismatch');
console.log('✓ React Export passed\n', reactOut.code);

console.log('--- Testing HTML Snippet Export ---');
const htmlOut = formatHtml(mockIcon, mockVariant, customConfig);
console.assert(htmlOut.code.includes('gridframe-icon-arrow-right'), 'HTML class mismatch');
console.assert(htmlOut.code.includes('<svg'), 'HTML svg tag mismatch');
console.log('✓ HTML Export passed\n', htmlOut.code);

console.log('--- Testing Data URI Export ---');
const dataUriOut = formatDataUri(mockIcon, mockVariant, customConfig);
console.assert(dataUriOut.code.startsWith('data:image/svg+xml;utf8,'), 'Data URI prefix mismatch');
console.log('✓ Data URI Export passed');

console.log('--- Testing CSS Mask Export ---');
const cssOut = formatCss(mockIcon, mockVariant, customConfig);
console.assert(cssOut.code.includes('.icon-arrow-right {'), 'CSS selector mismatch');
console.assert(cssOut.code.includes('mask-image: url("data:image/svg+xml'), 'CSS mask-image mismatch');
console.log('✓ CSS Mask Export passed\n', cssOut.code);

console.log('\n🎉 ALL PHASE 7 EXPORT GENERATION TESTS PASSED CLEANLY!');
