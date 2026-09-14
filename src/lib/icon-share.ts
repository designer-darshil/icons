import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import type { Icon, IconStyle, IconVariant } from '@/types/icon';
import type { IconCustomization } from '@/types/customization';
import { copyToClipboard } from './export-svg';

export interface SharedIconConfig {
  slug: string;
  variant?: IconStyle | string;
  color?: string;
  size?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

/**
 * Validates a color string. Must be 'currentColor' or a valid 3/6-character hex.
 * Returns normalized hex (e.g., '#FF5024') or 'currentColor'.
 */
export function sanitizeColor(colorStr: string | null | undefined): string {
  if (!colorStr) return DEFAULT_CUSTOMIZATION.color;
  const trimmed = colorStr.trim();
  if (trimmed === 'currentColor') return 'currentColor';

  const cleanHex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    return `#${cleanHex}`;
  }
  if (/^[0-9a-fA-F]{3}$/.test(cleanHex)) {
    return `#${cleanHex.split('').map((c) => c + c).join('')}`;
  }
  return DEFAULT_CUSTOMIZATION.color;
}

/**
 * Formats a color for URL query parameter (strips '#' to keep query string clean).
 */
export function formatColorForUrl(color: string): string {
  if (color === 'currentColor') return 'currentColor';
  if (color.startsWith('#')) return color.slice(1);
  return color;
}

/**
 * Serializes an icon customization into a compact, deterministic query string.
 * Only includes non-default values to keep URLs minimal and shareable.
 */
export function serializeIconConfiguration(
  slug: string,
  variantStyle: IconStyle | string,
  customization: Partial<IconCustomization>
): string {
  const params = new URLSearchParams();

  if (variantStyle && variantStyle !== 'regular') {
    params.set('variant', variantStyle);
  }

  const color = customization.color;
  if (color && color !== DEFAULT_CUSTOMIZATION.color) {
    params.set('color', formatColorForUrl(color));
  }

  const size = customization.size;
  if (size && size !== DEFAULT_CUSTOMIZATION.size) {
    params.set('size', size.toString());
  }

  const rotation = customization.rotation;
  if (rotation && rotation !== 0) {
    params.set('rotate', rotation.toString());
  }

  const flipX = customization.flipX;
  const flipY = customization.flipY;
  if (flipX && flipY) {
    params.set('flip', 'both');
  } else if (flipX) {
    params.set('flip', 'x');
  } else if (flipY) {
    params.set('flip', 'y');
  }

  const queryString = params.toString();
  return queryString ? `/icons/${encodeURIComponent(slug)}?${queryString}` : `/icons/${encodeURIComponent(slug)}`;
}

/**
 * Safely parses and validates untrusted URL search parameters into a valid
 * icon style and customization object against the icon's real available variants.
 */
export function deserializeIconConfiguration(
  searchParams: URLSearchParams | string,
  icon?: Icon | null
): { style: IconStyle; customization: IconCustomization } {
  const params = typeof searchParams === 'string' ? new URLSearchParams(searchParams) : searchParams;

  // 1. Variant Style Validation
  const rawVariant = params.get('variant')?.toLowerCase().trim();
  let validStyle: IconStyle = 'regular';

  if (icon && icon.variants && icon.variants.length > 0) {
    const hasVariant = icon.variants.some(
      (v: IconVariant) => v.style.toLowerCase() === rawVariant || v.id.toLowerCase() === rawVariant
    );
    if (hasVariant && rawVariant) {
      validStyle = rawVariant as IconStyle;
    } else {
      // Fall back to regular if available, or first variant
      const regularVariant = icon.variants.find((v) => v.style === 'regular');
      validStyle = regularVariant ? 'regular' : icon.variants[0].style;
    }
  } else if (rawVariant && ['regular', 'filled', 'duotone', 'light'].includes(rawVariant)) {
    validStyle = rawVariant as IconStyle;
  }

  // 2. Color Validation
  const rawColor = params.get('color');
  const validColor = rawColor ? sanitizeColor(rawColor) : DEFAULT_CUSTOMIZATION.color;

  // 3. Size Validation (clamped between 12 and 256)
  const rawSize = params.get('size');
  let validSize = DEFAULT_CUSTOMIZATION.size;
  if (rawSize) {
    const parsedSize = parseInt(rawSize, 10);
    if (!isNaN(parsedSize) && parsedSize >= 12 && parsedSize <= 256) {
      validSize = parsedSize;
    }
  }

  // 4. Rotation Validation (0, 90, 180, 270)
  const rawRotate = params.get('rotate') || params.get('rotation');
  let validRotation = 0;
  if (rawRotate) {
    const parsedRot = parseInt(rawRotate, 10);
    if (!isNaN(parsedRot)) {
      const normalized = ((parsedRot % 360) + 360) % 360;
      if ([0, 90, 180, 270].includes(normalized)) {
        validRotation = normalized;
      }
    }
  }

  // 5. Flip Validation (x, y, both, xy, horizontal, vertical)
  const rawFlip = params.get('flip')?.toLowerCase().trim();
  let flipX = false;
  let flipY = false;

  if (rawFlip === 'x' || rawFlip === 'horizontal') {
    flipX = true;
  } else if (rawFlip === 'y' || rawFlip === 'vertical') {
    flipY = true;
  } else if (rawFlip === 'both' || rawFlip === 'xy' || rawFlip === 'all') {
    flipX = true;
    flipY = true;
  }

  // Check explicit boolean query params if present
  if (params.get('flipX') === 'true' || params.get('flipX') === '1') flipX = true;
  if (params.get('flipY') === 'true' || params.get('flipY') === '1') flipY = true;

  const customization: IconCustomization = {
    ...DEFAULT_CUSTOMIZATION,
    color: validColor,
    size: validSize,
    rotation: validRotation,
    flipX,
    flipY,
  };

  return {
    style: validStyle,
    customization,
  };
}

/**
 * Builds a full absolute URL for sharing.
 */
export function getShareableIconUrl(
  slug: string,
  variantStyle: IconStyle | string,
  customization: Partial<IconCustomization>
): string {
  const relativePath = serializeIconConfiguration(slug, variantStyle, customization);
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${relativePath}`;
  }
  return `https://gridframe.dev${relativePath}`;
}

/**
 * Shares the icon configuration using the native Web Share API where supported,
 * falling back to clipboard copy.
 */
export async function shareIconConfiguration(
  icon: Icon,
  variantStyle: IconStyle | string,
  customization: Partial<IconCustomization>
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const shareUrl = getShareableIconUrl(icon.slug, variantStyle, customization);
  const shareData = {
    title: `${icon.name} Vector Icon — Gridframe`,
    text: `Customize and export the ${icon.name} icon on Gridframe.`,
    url: shareUrl,
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: unknown) {
      // If user cancelled, don't fall back to clipboard failure
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  const copied = await copyToClipboard(shareUrl);
  return { success: copied, method: 'clipboard' };
}
