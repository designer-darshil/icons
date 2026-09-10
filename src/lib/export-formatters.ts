import { IconCustomization } from '@/types/customization';
import { Icon, IconVariant } from '@/types/icon';
import { ExportFormat, ExportResult } from '@/types/export';
import { transformSvgMarkup } from './icon-transformer';
import { extractInnerSvg, sanitizeSvgMarkup } from './icon-sanitizer';
import { generateComponentName, generateIconFilename, toKebabCase } from './filename-utils';

/**
 * Converts standard HTML/SVG attributes to React JSX camelCase equivalents
 */
function svgToJsxAttributes(svgString: string): string {
  return svgString
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/clip-path=/g, 'clipPath=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/stop-color=/g, 'stopColor=')
    .replace(/stop-opacity=/g, 'stopOpacity=')
    .replace(/class=/g, 'className=')
    .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
    .replace(/xlink:href=/g, 'xlinkHref=');
}

/**
 * Formats raw SVG string
 */
export function formatSvg(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  const rawSvg = transformSvgMarkup(variant, customization);
  const sanitized = sanitizeSvgMarkup(rawSvg);
  const filename = generateIconFilename(icon.name, variant.style, 'svg');

  return {
    code: sanitized.trim(),
    language: 'xml',
    filename,
    mimeType: 'image/svg+xml',
    sizeBytes: new Blob([sanitized]).size,
  };
}

export function generateSvgSnippet(variant: IconVariant, customization: IconCustomization): string {
  return sanitizeSvgMarkup(transformSvgMarkup(variant, customization)).trim();
}

/**
 * Formats modern React TypeScript component (TSX/JSX)
 */
export function formatReact(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  const code = generateReactJsx(icon, variant, customization);
  const componentName = generateComponentName(icon.name, variant.style);
  const filename = `${componentName}.tsx`;

  return {
    code: code.trim(),
    language: 'typescript',
    filename,
    mimeType: 'text/typescript',
    sizeBytes: new Blob([code]).size,
  };
}

export function generateReactJsx(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): string {
  const componentName = generateComponentName(icon.name, variant.style);
  const inner = extractInnerSvg(variant.svg);
  const jsxInner = svgToJsxAttributes(inner.trim());

  const size = customization.size || 24;
  const isFilled = variant.style === 'filled';
  const color = customization.color;
  const strokeWidth = variant.supportsStroke ? customization.strokeWidth : 0;
  const strokeLinecap = customization.strokeLinecap || 'round';
  const strokeLinejoin = customization.strokeLinejoin || 'round';

  const transforms: string[] = [];
  if (customization.rotation) {
    transforms.push(`rotate(${customization.rotation} 12 12)`);
  }
  if (customization.flipX) {
    transforms.push(`scale(-1, 1) translate(-24, 0)`);
  }
  if (customization.flipY) {
    transforms.push(`scale(1, -1) translate(0, -24)`);
  }
  const transformProp = transforms.length > 0 ? `\n      transform="${transforms.join(' ')}"` : '';

  const fillProp = isFilled
    ? color === 'currentColor'
      ? '"currentColor"'
      : `"${color}"`
    : '"none"';
  const strokeProp = variant.supportsStroke
    ? color === 'currentColor'
      ? '"currentColor"'
      : `"${color}"`
    : '"none"';

  return `import * as React from 'react';

export interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function ${componentName}({
  size = ${size},
  color = ${color === 'currentColor' ? "'currentColor'" : `'${color}'`},
  className,
  ...props
}: ${componentName}Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="${variant.viewBox}"
      fill={${isFilled ? 'color' : fillProp}}
      stroke={${variant.supportsStroke ? 'color' : strokeProp}}${
        variant.supportsStroke ? `\n      strokeWidth={${strokeWidth}}` : ''
      }${
        variant.supportsStroke ? `\n      strokeLinecap="${strokeLinecap}"` : ''
      }${
        variant.supportsStroke ? `\n      strokeLinejoin="${strokeLinejoin}"` : ''
      }${transformProp}
      className={className}
      {...props}
    >
      ${jsxInner}
    </svg>
  );
}

export default ${componentName};`;
}

/**
 * Formats HTML inline embed snippet
 */
export function formatHtml(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  const code = generateHtmlSnippet(icon, variant, customization);
  const filename = generateIconFilename(icon.name, variant.style, 'html');

  return {
    code: code.trim(),
    language: 'html',
    filename,
    mimeType: 'text/html',
    sizeBytes: new Blob([code]).size,
  };
}

export function generateHtmlSnippet(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): string {
  const rawSvg = transformSvgMarkup(variant, customization);
  const sanitized = sanitizeSvgMarkup(rawSvg).trim();
  return `<!-- Gridframe Icon: ${icon.name} (${variant.label || variant.style}) -->
<span class="gridframe-icon gridframe-icon-${toKebabCase(icon.name)}" aria-hidden="true">
  ${sanitized}
</span>`;
}

/**
 * Formats Data URI string
 */
export function formatDataUri(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  const dataUri = generateDataUri(variant, customization);
  const filename = generateIconFilename(icon.name, variant.style, 'txt');

  return {
    code: dataUri,
    language: 'text',
    filename,
    mimeType: 'text/plain',
    sizeBytes: new Blob([dataUri]).size,
  };
}

export function generateDataUri(variant: IconVariant, customization: IconCustomization): string {
  const rawSvg = transformSvgMarkup(variant, customization);
  const sanitized = sanitizeSvgMarkup(rawSvg).trim();
  const encoded = encodeURIComponent(sanitized)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;utf8,${encoded}`;
}

/**
 * Formats CSS Mask snippet
 */
export function formatCss(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  const className = `icon-${toKebabCase(icon.name)}`;
  const filename = `${className}.css`;
  const code = generateCssMaskSnippet(icon, variant, customization);

  return {
    code: code.trim(),
    language: 'css',
    filename,
    mimeType: 'text/css',
    sizeBytes: new Blob([code]).size,
  };
}

export function generateCssMaskSnippet(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): string {
  const className = `icon-${toKebabCase(icon.name)}`;
  const rawSvg = transformSvgMarkup(variant, customization);
  const sanitized = sanitizeSvgMarkup(rawSvg).trim();
  const encoded = encodeURIComponent(sanitized)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  const size = customization.size || 24;

  return `.${className} {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  background-color: ${customization.color === 'currentColor' ? 'currentColor' : customization.color};
  -webkit-mask-image: url("${`data:image/svg+xml;utf8,${encoded}`}");
  mask-image: url("${`data:image/svg+xml;utf8,${encoded}`}");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}`;
}

/**
 * Master dispatcher
 */
export function generateExport(
  format: ExportFormat,
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): ExportResult {
  switch (format) {
    case 'svg':
      return formatSvg(icon, variant, customization);
    case 'react':
      return formatReact(icon, variant, customization);
    case 'html':
      return formatHtml(icon, variant, customization);
    case 'data-uri':
      return formatDataUri(icon, variant, customization);
    case 'css':
      return formatCss(icon, variant, customization);
    default:
      return formatSvg(icon, variant, customization);
  }
}
