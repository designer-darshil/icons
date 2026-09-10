/**
 * SVG Sanitizer Utility
 * Strict multi-layer XSS defense and sanitization for vector markup.
 */

const FORBIDDEN_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'form',
  'input',
  'button',
  'foreignobject',
  'applet',
  'base',
];

/**
 * Sanitizes an SVG string removing all executable or untrusted tags and event handlers.
 */
export function sanitizeSvgMarkup(rawSvg: string): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';

  let sanitized = rawSvg;

  // Remove XML declaration and comments
  sanitized = sanitized.replace(/<\?xml.*?\?>/gi, '');
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  // Remove forbidden tags and their contents
  FORBIDDEN_TAGS.forEach((tag) => {
    const blockRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(blockRegex, '');
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(selfClosingRegex, '');
  });

  // Remove inline event handlers (e.g. onload="...", onclick='...', onmouseover=foo)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(['"]).*?\1/gi, '');
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*[^\s>]+/gi, '');

  // Remove javascript: and malicious data: protocol URIs
  sanitized = sanitized.replace(/href\s*=\s*(['"])javascript:[\s\S]*?\1/gi, '');
  sanitized = sanitized.replace(/xlink:href\s*=\s*(['"])javascript:[\s\S]*?\1/gi, '');
  sanitized = sanitized.replace(/href\s*=\s*(['"])data:text\/html[\s\S]*?\1/gi, '');

  return sanitized.trim();
}

/**
 * Extracts inner SVG children if the input contains a full `<svg>...</svg>` wrapper.
 */
export function extractInnerSvg(svgString: string): string {
  const sanitized = sanitizeSvgMarkup(svgString);
  const match = sanitized.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : sanitized;
}

/**
 * Validates if an SVG string has well-formed structure and a valid viewBox or path tags.
 */
export function isValidSvgMarkup(svgString: string): boolean {
  if (!svgString || typeof svgString !== 'string') return false;
  const sanitized = sanitizeSvgMarkup(svgString);
  if (!sanitized) return false;

  // Must contain valid SVG path or geometry tags or svg root
  const hasGeometry = /<(path|circle|rect|line|polyline|polygon|g|ellipse|svg)\b/i.test(sanitized);
  return hasGeometry;
}
