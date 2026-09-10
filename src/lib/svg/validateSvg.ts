/**
 * SVG Validator for Gridframe Catalog Quality Assurance
 */

export interface SvgValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSvg(svgMarkup: string): SvgValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!svgMarkup || typeof svgMarkup !== 'string' || svgMarkup.trim().length === 0) {
    errors.push('SVG markup is empty or invalid string');
    return { isValid: false, errors, warnings };
  }

  // Check for forbidden executable elements
  if (/<script/i.test(svgMarkup)) {
    errors.push('Contains forbidden <script> element');
  }
  if (/\son[a-z]+\s*=/i.test(svgMarkup)) {
    errors.push('Contains forbidden inline event handlers (e.g. onload)');
  }
  if (/javascript:/i.test(svgMarkup)) {
    errors.push('Contains forbidden javascript: URI');
  }
  if (/<foreignObject/i.test(svgMarkup)) {
    warnings.push('Contains foreignObject element');
  }

  // Check for valid vector path/geometry
  const hasPathOrShape = /<(path|circle|rect|line|polyline|polygon|ellipse)/i.test(svgMarkup);
  if (!hasPathOrShape) {
    errors.push('No vector path, circle, rect, or shape elements found');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
