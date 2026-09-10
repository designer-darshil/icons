import { extractInnerSvg } from "./icon-sanitizer";
import type { IconCustomization } from "@/types/icon";

export interface SvgRenderOptions {
  size?: number;
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

/**
 * Builds a standalone clean SVG string with applied customization options.
 */
export function buildCustomSvgString(
  svgMarkup: string,
  viewBox: string = "0 0 24 24",
  options: Partial<IconCustomization> = {}
): string {
  const inner = extractInnerSvg(svgMarkup);
  const size = options.size || 24;
  const color = options.color || "currentColor";
  const strokeWidth = options.strokeWidth !== undefined ? options.strokeWidth : 2;
  const strokeLinecap = options.strokeLinecap || "round";
  const strokeLinejoin = options.strokeLinejoin || "round";

  let transformString = "";
  if (options.rotation || options.flipX || options.flipY) {
    const transforms: string[] = [];
    if (options.rotation) transforms.push(`rotate(${options.rotation} 12 12)`);
    if (options.flipX) transforms.push(`scale(-1, 1) translate(-24, 0)`);
    if (options.flipY) transforms.push(`scale(1, -1) translate(0, -24)`);
    transformString = ` transform="${transforms.join(" ")}"`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}"${transformString}>
  ${inner}
</svg>`;
}
