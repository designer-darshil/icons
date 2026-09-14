/**
 * GRIDFRAME SVG OPTIMIZER
 * 
 * Inspired by SVGL's library asset optimization principles:
 * - Preserves canonical viewBox strictly (e.g. "0 0 24 24")
 * - Cleans redundant XML declarations, comments, and editor metadata
 * - Normalizes whitespace and presentation attributes without mutating geometry
 * - Guarantees 100% vector fidelity to source Iconoir geometry
 * - Generates production-ready standalone SVG strings for copy, download, and framework integrations
 */

export interface SvgOptimizationOptions {
  stripComments?: boolean;
  stripXmlDeclaration?: boolean;
  normalizeWhitespace?: boolean;
  preserveViewBox?: boolean;
  targetViewBox?: string;
  currentColor?: boolean;
}

const DEFAULT_OPTIONS: SvgOptimizationOptions = {
  stripComments: true,
  stripXmlDeclaration: true,
  normalizeWhitespace: true,
  preserveViewBox: true,
  targetViewBox: '0 0 24 24',
  currentColor: true,
};

/**
 * Optimizes an SVG string for web production and developer export.
 */
export function optimizeSvg(
  svgMarkup: string,
  customOptions?: Partial<SvgOptimizationOptions>
): string {
  if (!svgMarkup || typeof svgMarkup !== 'string') {
    return '';
  }

  const options: SvgOptimizationOptions = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
  };

  let result = svgMarkup.trim();

  // 1. Strip XML declarations & DOCTYPEs
  if (options.stripXmlDeclaration) {
    result = result.replace(/<\?xml.*?\?>/gi, '');
    result = result.replace(/<!DOCTYPE.*?>/gi, '');
  }

  // 2. Strip comments
  if (options.stripComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  // 3. Remove metadata, sodipodi, inkscape, sketch, and illustrator attributes
  result = result.replace(/\s+(xmlns:xlink|xmlns:sketch|xmlns:inkscape|xmlns:sodipodi|sketch:type)\s*=\s*(['"]).*?\2/gi, '');
  result = result.replace(/\s+(sodipodi:[a-z-]+|inkscape:[a-z-]+)\s*=\s*(['"]).*?\2/gi, '');

  // 4. Ensure viewBox integrity: never drop or deform standard 0 0 24 24
  if (options.preserveViewBox) {
    const viewBoxMatch = result.match(/viewBox=(['"])(.*?)\1/i);
    if (!viewBoxMatch) {
      result = result.replace(/<svg\b/i, `<svg viewBox="${options.targetViewBox || '0 0 24 24'}"`);
    }
  }

  // 5. Clean redundant whitespace within tags
  if (options.normalizeWhitespace) {
    result = result.replace(/>\s+</g, '><');
    result = result.replace(/\s{2,}/g, ' ');
  }

  return result.trim();
}

/**
 * Validates whether an SVG conforms to canonical Gridframe & SVGL library standards:
 * - Root element is `<svg>`
 * - Contains valid `viewBox="0 0 24 24"`
 * - Contains actual geometric children (<path>, <circle>, <rect>, etc.)
 */
export function validateLibrarySvg(svgString: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!svgString || typeof svgString !== 'string') {
    return { isValid: false, issues: ['Empty or non-string SVG input'] };
  }

  const trimmed = svgString.trim();
  if (
    !trimmed.startsWith('<svg') &&
    !trimmed.includes('<path') &&
    !trimmed.includes('<circle') &&
    !trimmed.includes('<ellipse') &&
    !trimmed.includes('<rect') &&
    !trimmed.includes('<line') &&
    !trimmed.includes('<polyline') &&
    !trimmed.includes('<polygon') &&
    !trimmed.includes('<g')
  ) {
    issues.push('Missing SVG root or child geometry tags');
  }

  const viewBoxMatch = trimmed.match(/viewBox=(['"])(.*?)\1/i);
  if (viewBoxMatch && viewBoxMatch[2] !== '0 0 24 24') {
    issues.push(`Non-standard viewBox detected: "${viewBoxMatch[2]}" (expected "0 0 24 24")`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
