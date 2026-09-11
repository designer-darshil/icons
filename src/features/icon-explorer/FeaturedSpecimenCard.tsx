import React, { memo, useCallback, useState } from 'react';
import type { Icon, IconStyle, IconVariant } from '@/types/icon';
import { Heart, Check, Copy, Download, Sparkles, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';

export interface FeaturedSpecimenCardProps {
  icon: Icon;
  isSelected?: boolean;
  isFavorite?: boolean;
  activeStyle?: IconStyle | 'all';
  onSelect: (icon: Icon) => void;
  onToggleFavorite?: (icon: Icon) => void;
  className?: string;
}

export const FeaturedSpecimenCard: React.FC<FeaturedSpecimenCardProps> = memo(({
  icon,
  isSelected,
  isFavorite,
  activeStyle,
  onSelect,
  onToggleFavorite,
  className,
}) => {
  const { success } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(
    (activeStyle !== 'all' && activeStyle) || (icon.variants[0]?.style as IconStyle) || 'outline'
  );
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const activeVariant: IconVariant =
    icon.variants.find((v) => v.style === selectedStyle) ||
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
    return transformSvgMarkup(activeVariant, DEFAULT_CUSTOMIZATION);
  }, [activeVariant]);

  const handleCopySvg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const svgCode = getActiveSvgMarkup();
      copyToClipboard(svgCode);
      setCopied(true);
      success(`Copied ${icon.name} (${activeVariant.style}) SVG`);
      setTimeout(() => setCopied(false), 1400);
    },
    [icon.name, activeVariant.style, getActiveSvgMarkup, success]
  );

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const svgCode = getActiveSvgMarkup();
      downloadFile(svgCode, `${icon.slug}-${activeVariant.style}.svg`, 'image/svg+xml');
      setDownloaded(true);
      success(`Downloaded ${icon.slug}.svg`);
      setTimeout(() => setDownloaded(false), 1400);
    },
    [icon.slug, activeVariant.style, getActiveSvgMarkup, success]
  );

  const handleToggleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.(icon);
    },
    [icon, onToggleFavorite]
  );

  const innerSvg = activeVariant.svg || icon.svg;
  const isFilled = activeVariant.style === 'filled';

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
      aria-label={`Inspect featured ${icon.name} specimen`}
      className={cn(
        'group relative col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 flex flex-col justify-between p-5 sm:p-6 rounded-sm select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden',
        // High-end warm neutral panel with subtle hairline accent
        'bg-bg-secondary/40 hover:bg-bg-secondary/80 border border-border-default hover:border-border-strong hover:shadow-dropdown',
        isSelected && 'border-accent bg-bg-secondary/95 ring-1 ring-accent shadow-dropdown',
        className
      )}
    >
      {/* Top Header: Featured Label & Favorite Action */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-border-subtle/40 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="type-section-label text-accent font-bold">
            Featured Specimen
          </span>
          <span className="text-text-tertiary">/</span>
          <span className="type-metadata-sm text-text-tertiary uppercase">
            {icon.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFav}
            aria-label={isFavorite ? 'Remove from favorites' : 'Bookmark icon'}
            className={cn(
              'p-2 -mr-2 -mt-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200 z-20 cursor-pointer touch-manipulation',
              isFavorite
                ? 'text-accent opacity-100 scale-110'
                : 'text-text-tertiary opacity-70 hover:opacity-100 hover:text-accent hover:scale-110 active:scale-95'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current text-accent')} />
          </button>
        </div>
      </div>

      {/* Center Showcase: Large Vector Canvas + Variant Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        {/* Left: Large 60px Vector Optical Stage */}
        <div className="md:col-span-5 relative aspect-square sm:aspect-[4/3] md:aspect-square rounded-xs bg-bg-primary/90 border border-border-subtle/60 flex items-center justify-center p-6 select-none overflow-hidden group-hover:border-border-strong transition-colors">
          {/* Optical crosshairs */}
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/30 pointer-events-none" />
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/30 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-center text-text-primary transform group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={icon.viewBox || '0 0 24 24'}
              width="60"
              height="60"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke={isFilled ? 'none' : 'currentColor'}
              strokeWidth={isFilled ? 0 : 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: innerSvg }}
              className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
            />
          </div>

          <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[9px] font-mono text-text-tertiary">
            <span>24×24 px</span>
            <span>{selectedStyle}</span>
          </div>
        </div>

        {/* Right: Specimen Information & Live Controls */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <h3 className="type-h3 text-text-primary group-hover:text-accent transition-colors">
              {icon.name}
            </h3>
            <p className="text-xs text-text-secondary line-clamp-2 mt-1 font-normal leading-relaxed">
              Canonical geometric vector concept with multi-weight stroke and fill variations.
            </p>
          </div>

          {/* Interactive Multi-Style Switcher */}
          {icon.variants && icon.variants.length > 1 && (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="type-section-label text-text-tertiary block">
                Available Styles ({icon.variants.length})
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {icon.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedStyle(v.style as IconStyle)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-mono uppercase rounded-3xs border transition-all cursor-pointer',
                      selectedStyle === v.style
                        ? 'bg-accent text-white font-bold border-accent shadow-2xs'
                        : 'bg-bg-elevated text-text-secondary hover:text-text-primary border-border-subtle hover:border-border-strong'
                    )}
                  >
                    {v.label || v.style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Action Strip */}
          <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleCopySvg}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-xs hover:bg-accent-hover transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markup' : 'Copy SVG'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-xs font-mono bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary rounded-xs hover:border-border-strong transition-colors cursor-pointer"
              title="Download SVG file"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-accent" /> : <Download className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onSelect(icon)}
              className="p-2 text-xs font-mono bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary rounded-xs hover:border-border-strong transition-colors cursor-pointer"
              title="Open full inspector"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Specification Footnote */}
      <div className="w-full pt-3 border-t border-border-subtle/40 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
        <span className="truncate">slug: <code className="text-text-secondary">{icon.slug}</code></span>
        <span>{icon.variants.length} VARIANT STYLES</span>
      </div>
    </div>
  );
});

FeaturedSpecimenCard.displayName = 'FeaturedSpecimenCard';
