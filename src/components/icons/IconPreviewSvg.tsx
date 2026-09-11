import React, { memo, useMemo } from 'react';
import { extractInnerSvg } from '@/lib/icon-sanitizer';
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
  isFilled?: boolean;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

export const IconPreviewSvg: React.FC<IconPreviewSvgProps> = memo(({
  icon,
  variant,
  svgContent,
  viewBox = '0 0 24 24',
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  isFilled: isFilledProp,
  rotation = 0,
  flipX = false,
  flipY = false,
  className,
  style,
  ...rest
}) => {
  // Determine active SVG source markup
  const activeVariant = variant || icon?.variants[0];
  const rawSvg = svgContent || activeVariant?.svg || icon?.svg || '';
  const activeViewBox = viewBox || activeVariant?.viewBox || icon?.viewBox || '0 0 24 24';

  const innerSvg = useMemo(() => {
    return extractInnerSvg(rawSvg);
  }, [rawSvg]);

  const isFilled = useMemo(() => {
    if (typeof isFilledProp === 'boolean') return isFilledProp;
    if (activeVariant?.style === 'filled') return true;
    if (activeVariant?.supportsStroke === false) return true;
    return (
      strokeWidth === 0 ||
      innerSvg.includes('fill="currentColor"') ||
      (innerSvg.includes('clip-rule="evenodd"') && !innerSvg.includes('stroke='))
    );
  }, [isFilledProp, activeVariant, strokeWidth, innerSvg]);

  const transformStyles = useMemo(() => {
    const transforms: string[] = [];
    if (rotation) transforms.push(`rotate(${rotation}deg)`);
    if (flipX) transforms.push('scaleX(-1)');
    if (flipY) transforms.push('scaleY(-1)');
    return transforms.length > 0 ? transforms.join(' ') : undefined;
  }, [rotation, flipX, flipY]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={activeViewBox}
      width={size}
      height={size}
      fill={isFilled ? color : 'none'}
      stroke={isFilled ? 'none' : color}
      strokeWidth={isFilled ? 0 : strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      preserveAspectRatio="xMidYMid meet"
      className={cn('inline-block shrink-0 select-none aspect-square', className)}
      style={{
        transform: transformStyles,
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
