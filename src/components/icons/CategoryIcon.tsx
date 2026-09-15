import React, { memo, useMemo } from 'react';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { getCategoryIconId } from '@/data/category-registry';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';
import type { Icon, IconVariant } from '@/types/icon';

// Precomputed map for O(1) canonical icon lookup
const CATALOG_MAP = new Map<string, Icon>(GRIDFRAME_ICONS.map((i) => [i.id, i]));

export interface CategoryIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Canonical category slug, name, or alias (e.g. 'navigation', 'arrows', 'dev') */
  categorySlug?: string;
  /** Explicit Iconoir icon ID (e.g. 'compass', 'code', 'wallet') */
  iconId?: string;
  /** Visual display size in pixels (default: 20) */
  size?: number;
  /** Optional custom CSS classes for sizing and color styling */
  className?: string;
}

/**
 * Canonical GRIDFRAME Category Icon Component
 *
 * Renders the single canonical representative Iconoir icon for any category.
 *
 * Requirements:
 * - Uses ONLY real Iconoir icons from the catalog
 * - Canonical Regular variant is strictly rendered (no fake strokes or geometry modifications)
 * - Accessible: aria-hidden="true" to prevent duplicate screen reader noise
 * - Validates iconId in dev mode with a console warning if missing or invalid
 * - Does NOT silently render arbitrary decorative fallbacks
 */
export const CategoryIcon: React.FC<CategoryIconProps> = memo(({
  categorySlug,
  iconId: explicitIconId,
  size = 20,
  className,
  style,
  ...rest
}) => {
  // 1. Resolve canonical Iconoir icon ID
  const resolvedIconId = useMemo(() => {
    if (explicitIconId) return explicitIconId;
    if (categorySlug) return getCategoryIconId(categorySlug);
    return '';
  }, [explicitIconId, categorySlug]);

  // 2. Fetch canonical icon record
  const icon = useMemo(() => {
    if (!resolvedIconId) return undefined;
    return CATALOG_MAP.get(resolvedIconId);
  }, [resolvedIconId]);

  // 3. Resolve canonical regular variant
  const regularVariant = useMemo<IconVariant | undefined>(() => {
    if (!icon) return undefined;
    return (
      icon.variants.find((v) => v.style === 'regular') ||
      icon.variants.find((v) => v.style === 'outline' || v.style === 'linear') ||
      icon.variants[0]
    );
  }, [icon]);

  // 4. Data validation in development mode
  if (!icon || !regularVariant) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[CategoryIcon] Missing or invalid Iconoir icon reference:\n` +
        `  category: "${categorySlug || 'unspecified'}"\n` +
        `  resolved iconId: "${resolvedIconId || 'none'}"\n` +
        `  icon in catalog: ${Boolean(icon)}\n` +
        `  regular variant: ${Boolean(regularVariant)}`
      );
    }
    return (
      <span
        className={cn('inline-flex shrink-0 aspect-square opacity-0 pointer-events-none', className)}
        style={{ width: size, height: size, ...style }}
        aria-hidden="true"
        data-category-icon-missing={resolvedIconId || categorySlug || 'unknown'}
        {...rest}
      />
    );
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center shrink-0 select-none aspect-square', className)}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
      {...rest}
    >
      <IconPreviewSvg
        icon={icon}
        variant={regularVariant}
        size={size}
        color="currentColor"
        className="w-full h-full"
      />
    </span>
  );
});

CategoryIcon.displayName = 'CategoryIcon';
export default CategoryIcon;
