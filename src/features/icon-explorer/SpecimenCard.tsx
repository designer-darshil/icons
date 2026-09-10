import React, { memo, useCallback, useState } from 'react';
import type { Icon } from '@/types/icon';
import { Heart, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';

export interface SpecimenCardProps {
  icon: Icon;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (icon: Icon) => void;
  onToggleFavorite?: (icon: Icon) => void;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = memo(({
  icon,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const getActiveSvgMarkup = useCallback(() => {
    const variant = icon.variants[0] || {
      id: icon.id,
      style: 'linear',
      label: 'Linear',
      svg: icon.svg,
      viewBox: icon.viewBox,
      supportsStroke: true,
      supportsColor: true,
    };
    return transformSvgMarkup(variant, DEFAULT_CUSTOMIZATION);
  }, [icon]);

  const handleCopySvg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const svgCode = getActiveSvgMarkup();
      copyToClipboard(svgCode);
      setCopied(true);
      success(`Copied ${icon.name} SVG`);
      setTimeout(() => setCopied(false), 1400);
    },
    [icon.name, getActiveSvgMarkup, success]
  );

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const svgCode = getActiveSvgMarkup();
      const variant = icon.variants[0];
      downloadFile(svgCode, `${icon.slug}-${variant?.style || 'linear'}.svg`, 'image/svg+xml');
      setDownloaded(true);
      success(`Downloaded ${icon.slug}.svg`);
      setTimeout(() => setDownloaded(false), 1400);
    },
    [icon, getActiveSvgMarkup, success]
  );

  const handleToggleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.(icon);
    },
    [icon, onToggleFavorite]
  );

  const variant = icon.variants[0];
  const innerSvg = variant?.svg || icon.svg;

  return (
    <div className="group flex flex-col items-center select-none w-full">
      {/* CAD Specimen Tile */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(icon)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(icon);
          }
        }}
        aria-label={`View icon ${icon.name}`}
        className={cn(
          'relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-120 cursor-pointer overflow-visible',
          'border bg-bg-elevated',
          isSelected
            ? 'border-text-primary ring-2 ring-focus'
            : 'border-border-default hover:border-text-primary'
        )}
      >
        {/* Style / Variant Badge (e.g. SOLID) at top right */}
        {variant?.style && variant.style !== 'linear' && (
          <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 text-[8.5px] font-bold font-mono uppercase tracking-wider rounded-md bg-bg-secondary text-text-tertiary border border-border-subtle group-hover:opacity-0 transition-opacity z-10">
            {variant.style}
          </span>
        )}

        {/* Favorite Heart (top-left) */}
        <button
          type="button"
          onClick={handleToggleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={cn(
            'absolute top-2 left-2 p-1 rounded-md transition-all z-10',
            isFavorite
              ? 'text-action-destructive opacity-100'
              : 'text-text-tertiary opacity-0 group-hover:opacity-100 hover:text-text-primary hover:bg-bg-secondary'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current')} />
        </button>

        {/* Normal State: Centered 24x24 Vector Icon */}
        <div className="w-full h-full flex items-center justify-center p-4 group-hover:opacity-0 transition-opacity duration-100 text-text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={icon.viewBox || '0 0 24 24'}
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: innerSvg }}
            className="w-7 h-7 shrink-0 transition-transform duration-120 group-hover:scale-105"
          />
        </div>

        {/* 4 CAD Anchor Point Handles (Visible on Hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none z-30">
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full border border-text-primary bg-bg-elevated shadow-xs" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-text-primary bg-bg-elevated shadow-xs" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full border border-text-primary bg-bg-elevated shadow-xs" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-text-primary bg-bg-elevated shadow-xs" />
        </div>

        {/* Hover Action Split: Top "Copy SVG" / Bottom "Download" */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-20">
          {/* Top Half: Copy SVG */}
          <button
            type="button"
            onClick={handleCopySvg}
            aria-label="Copy SVG Code"
            className="flex-1 w-full flex items-center justify-center font-sans font-semibold text-[12px] bg-white text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 transition-colors border-b border-neutral-300"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Copied</span>
              </span>
            ) : (
              <span>Copy SVG</span>
            )}
          </button>

          {/* Bottom Half: Download */}
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download SVG file"
            className="flex-1 w-full flex items-center justify-center font-sans font-semibold text-[12px] bg-[#1E232A] text-white hover:bg-[#282F38] active:bg-[#15191E] transition-colors"
          >
            {downloaded ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Saved</span>
              </span>
            ) : (
              <span>Download</span>
            )}
          </button>
        </div>
      </div>

      {/* Centered Icon Name Label Underneath */}
      <span className="mt-2 text-[11px] font-mono text-text-secondary group-hover:text-text-primary transition-colors truncate max-w-full text-center px-1 tracking-tight">
        {icon.slug || icon.name}
      </span>
    </div>
  );
});

SpecimenCard.displayName = 'SpecimenCard';

