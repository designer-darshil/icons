/**
 * Filename and identifier generation utilities for export
 */

/**
 * Converts a string into PascalCase (e.g. 'arrow-up-right' -> 'ArrowUpRight')
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Converts a string into kebab-case (e.g. 'ArrowUpRight' -> 'arrow-up-right')
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generates standard file name for an icon asset download
 * Pattern: [icon-name]-[style].svg or [icon-name]-[style].[ext]
 */
export function generateIconFilename(
  iconName: string,
  styleName: string,
  extension: string = 'svg'
): string {
  const cleanName = toKebabCase(iconName);
  const cleanStyle = toKebabCase(styleName);
  const cleanExt = extension.replace(/^\./, '');
  return `${cleanName}-${cleanStyle}.${cleanExt}`;
}

/**
 * Generates a valid React component identifier name (e.g. 'IconArrowRight')
 */
export function generateComponentName(iconName: string, styleName?: string): string {
  const base = toPascalCase(iconName);
  const styleSuffix = styleName ? toPascalCase(styleName) : '';
  const name = `Icon${base}${styleSuffix}`;
  // Ensure valid JS identifier
  return name.replace(/^[^a-zA-Z_$]/, '_');
}
