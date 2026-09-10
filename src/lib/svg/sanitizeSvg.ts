/**
 * Strict SVG Sanitizer for Gridframe
 * Strips script tags, event handlers, foreignObject, iframe, embed, and dangerous URIs
 */

const FORBIDDEN_TAGS = [
  'script',
  'style',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'applet',
  'meta',
  'link',
  'base',
];

export function sanitizeSvgMarkup(svgMarkup: string): string {
  if (!svgMarkup || typeof svgMarkup !== 'string') return '';

  let sanitized = svgMarkup;

  // 1. Remove dangerous tags and their content
  for (const tag of FORBIDDEN_TAGS) {
    const tagRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(tagRegex, '').replace(selfClosingRegex, '');
  }

  // 2. Strip event handler attributes (e.g. onload, onclick, onerror)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Strip javascript: and vbscript: URIs from attributes
  sanitized = sanitized.replace(/\s+(href|src|xlink:href)\s*=\s*["']\s*(javascript|vbscript|data):[^"']*["']/gi, '');

  // 4. Strip XML comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  return sanitized.trim();
}

/**
 * Extract inner SVG markup (the child elements inside the <svg> wrapper)
 */
export function extractInnerSvg(svgMarkup: string): string {
  const sanitized = sanitizeSvgMarkup(svgMarkup);
  const match = sanitized.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!match || !match[1]) {
    // If no <svg> wrapper, assume it is already inner markup
    return sanitized.replace(/^<svg[^>]*>|<\/svg>$/gi, '').trim();
  }
  return match[1].trim();
}

export function extractViewBox(svgMarkup: string): string {
  const match = svgMarkup.match(/viewBox=["']([^"']+)["']/i);
  return match ? match[1] : '0 0 24 24';
}
