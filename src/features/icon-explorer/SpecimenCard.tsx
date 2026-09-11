import React, { memo, useCallback, useState } from 'react';
import type { Icon, IconStyle } from '@/types/icon';
import { Heart, Check, Copy, Download, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';

export interface SpecimenCardProps {
  icon: Icon;
  isSelected?: boolean;
  isFavorite?: boolean;
  activeStyle?: IconStyle | 'all';
  onSelect: (icon: Icon) => void;
  onToggleFavorite?: (icon: Icon) => void;
  className?: string;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = memo(({
  icon,
  isSelected,
  isFavorite,
  activeStyle,
  onSelect,
  onToggleFavorite,
  className,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const variant =
    (activeStyle && activeStyle !== 'all' && icon.variants.find((v) => v.style === activeStyle)) ||
    icon.variants[0] || {
      id: icon.id,
      style: 'outline',
      label: 'Outline',
      svg: icon.svg,
      viewBox: icon.viewBox || '0 0 24 24',
      supportsStroke: true,
      supportsColor: true,
    };

  const getActiveSvgMarkup = useCallback(() => {
    return transformSvgMarkup(variant, DEFAULT_CUSTOMIZATION);
  }, [variant]);

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
      downloadFile(svgCode, `${icon.slug}-${variant.style || 'outline'}.svg`, 'image/svg+xml');
      setDownloaded(true);
      success(`Downloaded ${icon.slug}.svg`);
      setTimeout(() => setDownloaded(false), 1400);
    },
    [icon.slug, variant.style, getActiveSvgMarkup, success]
  );

  const handleToggleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.(icon);
    },
    [icon, onToggleFavorite]
  );

  const isFilled = variant.style === 'filled';
  const variantCount = icon.variants?.length || 1;

  return (
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
      aria-label={`Inspect ${icon.name} vector specimen`}
      className={cn(
        'group relative flex flex-col justify-between aspect-[4/4.8] sm:aspect-[4/4.6] p-4 sm:p-5 rounded-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none cursor-pointer overflow-hidden',
        // Open, subtle surface with soft hairline border
        'bg-bg-secondary/30 hover:bg-bg-secondary/70 border border-border-subtle hover:border-border-strong hover:-translate-y-1 hover:shadow-dropdown',
        isSelected && 'border-accent bg-bg-secondary/90 ring-1 ring-accent shadow-dropdown',
        className
      )}
    >
      {/* Editorial Plate Corner Marks */}
      <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-border-strong opacity-40 group-hover:opacity-100 group-hover:border-accent transition-all duration-200 pointer-events-none" />
      <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-border-strong opacity-40 group-hover:opacity-100 group-hover:border-accent transition-all duration-200 pointer-events-none" />

      {/* Top Floating Strip: Subtle Domain Tag + Minimal Favorite Toggle */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary select-none">
        <span className="truncate max-w-[65%] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          {icon.category}
        </span>
        <button
          type="button"
          onClick={handleToggleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Bookmark icon'}
          className={cn(
            'p-2 -mr-2 -mt-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 z-20 cursor-pointer touch-manipulation',
            isFavorite
              ? 'text-accent opacity-100 scale-110'
              : 'text-text-tertiary opacity-70 sm:opacity-0 group-hover:opacity-100 hover:text-accent hover:scale-110 active:scale-95'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current text-accent')} />
        </button>
      </div>

      {/* Main Specimen Stage: Hero Scale with Smooth Optical Floating */}
      <div className="relative flex-1 flex items-center justify-center my-2 select-none">
        {/* Subtle crosshair reference guides on hover */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center text-text-primary transform group-hover:-translate-y-1.5 group-hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <IconPreviewSvg
            variant={variant}
            icon={icon}
            size={40}
            className="w-10 h-10 shrink-0"
          />
        </div>
      </div>

      {/* Floating Hover Action Pill */}
      <div className="absolute inset-x-4 bottom-14 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-auto z-20">
        <button
          type="button"
          onClick={handleCopySvg}
          title="Copy SVG markup"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-full hover:bg-accent-hover transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'SVG'}</span>
        </button>
        <button
          type="button"
          onClick={handleDownload}
          title="Download SVG file"
          className="p-1.5 text-[10px] font-mono bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary rounded-full hover:border-border-strong transition-colors shadow-sm"
        >
          {downloaded ? <Check className="w-3 h-3 text-accent" /> : <Download className="w-3 h-3" />}
        </button>
      </div>

      {/* Bottom Editorial Footnote: Typographic Hierarchy */}
      <div className="w-full pt-3 border-t border-border-subtle/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
            {icon.name}
          </span>
          <ArrowUpRight className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
        </div>

        {variantCount > 1 ? (
          <span className="shrink-0 type-icon-count text-text-tertiary px-1.5 py-0.5 rounded-full bg-bg-elevated/60 border border-border-subtle/60">
            {variantCount} styles
          </span>
        ) : isFilled ? (
          <span className="shrink-0 type-icon-count text-text-tertiary px-1.5 py-0.5 rounded-full bg-bg-elevated/60 border border-border-subtle/60">
            fill
          </span>
        ) : null}
      </div>
    </div>
  );
});

SpecimenCard.displayName = 'SpecimenCard';

