import React, { memo, useMemo } from 'react';
import { extractInnerSvg, isValidSvgMarkup } from '@/lib/icon-sanitizer';
import { cn } from '@/lib/cn';
import type { Icon, IconVariant } from '@/types/icon';

export interface IconPreviewSvgProps extends React.SVGAttributes<SVGSVGElement> {
  icon?: Icon;
  variant?: IconVariant;
  svgContent?: string;
  viewBox?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

/**
 * Canonical GRIDFRAME SVG Renderer
 * 
 * Single source of truth renderer used across:
 * - SpecimenCard (Homepage & category archives)
 * - IconPreview (Modal stage & customizers)
 * - IconDetailModal & Code exports
 * - QA Workbenches
 * 
 * Guarantees:
 * - 100% visual fidelity to canonical Iconoir vector artwork
 * - Respects source viewBox and coordinate system (24×24)
 * - Preserves individual stroke and fill attributes on internal paths
 * - Zero procedural deformation, fake blobs, or arbitrary path scaling
 */
export const IconPreviewSvg: React.FC<IconPreviewSvgProps> = memo(({
  icon,
  variant,
  svgContent,
  viewBox,
  size = 24,
  color = 'currentColor',
  strokeWidth,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  rotation = 0,
  flipX = false,
  flipY = false,
  className,
  style,
  ...rest
}) => {
  // 1. Resolve deterministic variant & source artwork
  const activeVariant =
    variant ||
    (icon?.variants
      ? icon.variants.find((v) => v.style === 'regular') ||
        icon.variants.find((v) => v.style === 'outline' || v.style === 'linear') ||
        icon.variants[0]
      : undefined);

  const rawSvg = svgContent || activeVariant?.svg || icon?.svg || '';
  const activeViewBox = viewBox || activeVariant?.viewBox || icon?.viewBox || '0 0 24 24';

  // 2. Validate and sanitize markup at data boundary
  const isValid = isValidSvgMarkup(rawSvg);

  const innerSvg = useMemo(() => {
    if (!isValid || !rawSvg) return '';
    return extractInnerSvg(rawSvg);
  }, [rawSvg, isValid]);

  // 3. Fallback error state: do NOT fake geometry with dots/circles
  if (!isValid || !innerSvg) {
    if (process.env.NODE_ENV !== 'production' && rawSvg) {
      console.warn(`[IconPreviewSvg] Invalid or missing SVG artwork for icon: ${icon?.slug || 'unknown'}, variant: ${activeVariant?.id || 'unknown'}`);
    }
    return (
      <span
        className={cn('inline-block shrink-0 aspect-square bg-border-subtle/10 border border-dashed border-border-default/40 rounded-xs', className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
        title="Invalid vector markup"
      />
    );
  }

  // 4. Determine stroke behavior based on variant capabilities
  const supportsStroke = activeVariant?.supportsStroke !== false;
  const computedStrokeWidth = strokeWidth ?? activeVariant?.defaultStrokeWidth ?? 1.5;

  // 5. Outer container transforms only (rotation, flip)
  const transforms: string[] = [];
  if (rotation) transforms.push(`rotate(${rotation}deg)`);
  if (flipX) transforms.push('scaleX(-1)');
  if (flipY) transforms.push('scaleY(-1)');
  const transformStyle = transforms.length > 0 ? transforms.join(' ') : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={activeViewBox}
      width={size}
      height={size}
      fill="none"
      color={color}
      strokeWidth={supportsStroke ? computedStrokeWidth : undefined}
      strokeLinecap={supportsStroke ? strokeLinecap : undefined}
      strokeLinejoin={supportsStroke ? strokeLinejoin : undefined}
      preserveAspectRatio="xMidYMid meet"
      className={cn('inline-block shrink-0 select-none aspect-square', className)}
      style={{
        transform: transformStyle,
        transformOrigin: 'center center',
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: innerSvg }}
      aria-hidden="true"
      {...rest}
    />
  );
});

IconPreviewSvg.displayName = 'IconPreviewSvg';
export default IconPreviewSvg;
