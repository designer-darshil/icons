import { extractInnerSvg } from "./icon-sanitizer";
import type { IconCustomization } from "@/types/customization";
import type { IconVariant } from "@/types/icon";

/**
 * Transforms an SVG variant markup applying live customization parameters without mutating source data.
 */
export function transformSvgMarkup(
  variant: IconVariant,
  customization: IconCustomization
): string {
  
  const inner = extractInnerSvg(variant.svg);
  const size = customization.size || 24;
  const color = customization.color || "currentColor";
  const strokeWidth = variant.supportsStroke ? customization.strokeWidth : 0;
  const strokeLinecap = customization.strokeLinecap || "round";
  const strokeLinejoin = customization.strokeLinejoin || "round";

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

  const transformAttr = transforms.length > 0 ? ` transform="${transforms.join(" ")}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${variant.viewBox}" fill="${variant.style === "filled" ? color : "none"}" stroke="${variant.supportsStroke ? color : "none"}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}"${transformAttr}>
  ${inner}
</svg>`;
}

/**
 * Checks whether any customization properties diverge from defaults.
 */
export function isCustomized(
  customization: IconCustomization,
  defaultStrokeWidth: number = 2
): boolean {
  return (
    customization.color !== "currentColor" ||
    customization.size !== 24 ||
    customization.strokeWidth !== defaultStrokeWidth ||
    customization.strokeLinecap !== "round" ||
    customization.strokeLinejoin !== "round" ||
    customization.rotation !== 0 ||
    customization.flipX !== false ||
    customization.flipY !== false
  );
}
