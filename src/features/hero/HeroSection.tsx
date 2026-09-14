import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Search, X, CornerDownLeft, Maximize2, Check, Copy } from 'lucide-react';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { GRIDFRAME_ICONS, TOTAL_CONCEPTS_COUNT, TOTAL_VARIANTS_COUNT } from '@/data/icons/gridframe-catalog';
import { copyToClipboard } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import type { Icon, IconStyle } from '@/types/icon';

export interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  onSelectIcon?: (icon: Icon) => void;
  onOpenCommandPalette?: () => void;
  className?: string;
}

// Curated canonical Iconoir showcase slugs for the hero specimen workspace
const HERO_SPECIMEN_SLUGS = [
  'shield-check',
  'compass',
  'code',
  'cpu',
  'cursor-pointer',
  'heart',
] as const;

const QUICK_CATEGORIES = [
  { slug: 'interface', label: 'Interface' },
  { slug: 'security', label: 'Security' },
  { slug: 'system', label: 'System' },
  { slug: 'arrows', label: 'Arrows' },
  { slug: 'media', label: 'Media' },
  { slug: 'design', label: 'Design' },
] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({
  query,
  onQueryChange,
  onSelectCategory,
  onSelectIcon,
  onOpenCommandPalette,
  className,
}) => {
  const { success } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Selected specimen icon in the interactive hero specimen stage
  const [selectedSlug, setSelectedSlug] = useState<string>('shield-check');
  const [activeStyle, setActiveStyle] = useState<IconStyle>('regular');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Retrieve matching icons from the catalog
  const featuredIcons = useMemo(() => {
    return HERO_SPECIMEN_SLUGS.map((slug) => {
      const found = GRIDFRAME_ICONS.find((i) => i.slug === slug);
      return found || GRIDFRAME_ICONS[0];
    });
  }, []);

  const activeIcon = useMemo(() => {
    return (
      GRIDFRAME_ICONS.find((i) => i.slug === selectedSlug) ||
      featuredIcons[0] ||
      GRIDFRAME_ICONS[0]
    );
  }, [selectedSlug, featuredIcons]);

  // Resolve matching variant or fallback
  const currentVariant = useMemo(() => {
    if (!activeIcon) return undefined;
    return (
      activeIcon.variants.find((v) => v.style === activeStyle) ||
      activeIcon.variants.find((v) => v.style === 'regular') ||
      activeIcon.variants[0]
    );
  }, [activeIcon, activeStyle]);

  const handleCopyActiveSvg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentVariant || !activeIcon) return;
      copyToClipboard(currentVariant.svg);
      setCopiedSlug(activeIcon.slug);
      success(`Copied ${activeIcon.name} (${currentVariant.style}) SVG`);
      setTimeout(() => setCopiedSlug(null), 1600);
    },
    [currentVariant, activeIcon, success]
  );

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQueryChange('');
    searchInputRef.current?.focus();
  };

  return (
    <section
      aria-label="Gridframe Icon Discovery & Customization Workspace"
      className={cn(
        'relative border-b border-border-default/80 pb-8 sm:pb-12 md:pb-16 mb-8 sm:mb-12 transition-colors duration-200',
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* =========================================================================
            LEFT COLUMN: Editorial Index, Headline, Precision Search Tool
            ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Eyebrow / Technical Index Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono tracking-wider text-text-tertiary">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-3xs bg-accent/10 border border-accent/25 text-accent font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                WORKSPACE V3.0
              </span>
              <span className="hidden xs:inline text-border-strong">/</span>
              <span className="text-text-secondary font-medium">24×24 OPTICAL GRID</span>
              <span className="hidden sm:inline text-border-strong">/</span>
              <span className="hidden sm:inline font-mono">
                {TOTAL_CONCEPTS_COUNT.toLocaleString()} CONCEPTS · {TOTAL_VARIANTS_COUNT.toLocaleString()} ASSETS
              </span>
            </div>

            {/* 2. Editorial Headline (Disciplined, High-Contrast, Product-Centric) */}
            <div className="space-y-3">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-[-0.035em] leading-[1.04] text-text-primary text-balance">
                Icons, precisely made discoverable.
              </h1>
              <p className="text-sm sm:text-base text-text-secondary max-w-xl font-normal leading-relaxed text-pretty">
                A disciplined vector icon workspace engineered on a unified 24×24 coordinate frame. Search canonical concepts, inspect geometric properties, and export production assets.
              </p>
            </div>
          </div>

          {/* 3. Professional Tool-Grade Search Input */}
          <div className="space-y-3 pt-1">
            <div
              onClick={handleFocusSearch}
              className={cn(
                'group relative flex items-center justify-between w-full h-12 sm:h-14 px-3.5 sm:px-4 rounded-xs transition-all duration-200 cursor-text',
                'bg-bg-secondary/70 hover:bg-bg-secondary/95 focus-within:bg-bg-secondary',
                'border border-border-default hover:border-border-strong focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 shadow-xs'
              )}
            >
              {/* Left Search Glyph + Fluid Text Input */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-text-tertiary group-hover:text-text-secondary group-focus-within:text-accent transition-colors shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={`Search ${TOTAL_CONCEPTS_COUNT.toLocaleString()}+ icons (e.g. arrow, shield, code)...`}
                  aria-label="Search canonical vector icons"
                  className="w-full bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
                />
              </div>

              {/* Right Action Chips: Clear / Keyboard Shortcut */}
              <div className="flex items-center gap-1.5 shrink-0 pl-2 select-none">
                {query ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search query"
                    className="p-1 rounded-3xs text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCommandPalette?.();
                    }}
                    title="Open Command Palette"
                    className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors cursor-pointer"
                  >
                    <span className="text-[11px]">⌘</span>K
                  </button>
                )}
                {query && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-accent font-semibold px-1.5 py-0.5 rounded-3xs bg-accent/10">
                    <CornerDownLeft className="w-2.5 h-2.5" /> Filtered
                  </span>
                )}
              </div>
            </div>

            {/* Quick Domain Jump Navigation */}
            {onSelectCategory && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono text-text-tertiary overflow-x-auto no-scrollbar py-0.5">
                <span className="uppercase text-[10px] tracking-wider text-text-tertiary shrink-0">
                  Quick Jump:
                </span>
                {QUICK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className="px-2 py-0.5 rounded-3xs border border-border-subtle bg-bg-secondary/40 text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-bg-elevated transition-colors cursor-pointer shrink-0"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Technical Grounding Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-subtle/80 text-[11px] font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Matrix</span>
              <span className="font-semibold text-text-primary">24×24 px System</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Geometry</span>
              <span className="font-semibold text-text-primary">2.0px Center Stroke</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Variants</span>
              <span className="font-semibold text-text-primary">5 Canonical Styles</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">License</span>
              <span className="font-semibold text-text-primary">MIT / Open Monograph</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Interactive Specimen Workspace & Geometric Inspection Frame
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 bg-bg-secondary/40 border border-border-default rounded-xs p-4 sm:p-5 flex flex-col justify-between shadow-xs">
            {/* Specimen Frame Header with Technical Coordinates */}
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2.5 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent/80" />
                <span className="font-semibold uppercase tracking-wider text-text-primary">
                  Specimen #{activeIcon.slug}
                </span>
              </div>
              <span className="text-[10px] text-text-tertiary font-mono">
                X: 12.00 · Y: 12.00 · 24×24
              </span>
            </div>

            {/* Central Precision Specimen Stage */}
            <div className="relative my-4 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] w-full rounded-3xs bg-bg-primary/95 border border-border-subtle/90 flex items-center justify-center p-6 overflow-hidden select-none group">
              {/* 24x24 Pixel Crosshair & Dimension Rulers */}
              <div className="absolute inset-4 sm:inset-6 border border-dashed border-border-subtle/50 rounded-3xs pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/30 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/30 pointer-events-none" />

              {/* Corner Calibration Marks */}
              <span className="absolute top-2 left-2 text-[9px] font-mono text-text-tertiary/60 leading-none select-none">
                +0,0
              </span>
              <span className="absolute top-2 right-2 text-[9px] font-mono text-text-tertiary/60 leading-none select-none">
                +24,0
              </span>
              <span className="absolute bottom-2 left-2 text-[9px] font-mono text-text-tertiary/60 leading-none select-none">
                +0,24
              </span>
              <span className="absolute bottom-2 right-2 text-[9px] font-mono text-text-tertiary/60 leading-none select-none">
                +24,24
              </span>

              {/* Real Canonical SVG Rendering with Subtle Micro-Interaction */}
              <div
                onClick={() => onSelectIcon?.(activeIcon)}
                className="relative z-10 flex items-center justify-center p-4 rounded-xs cursor-pointer text-text-primary hover:scale-105 active:scale-95 transition-transform duration-150"
                title={`Click to inspect ${activeIcon.name}`}
              >
                <IconPreviewSvg
                  icon={activeIcon}
                  variant={currentVariant}
                  size={52}
                  className="text-text-primary drop-shadow-xs"
                />
              </div>

              {/* Live Specimen HUD Footer */}
              <div className="absolute bottom-2 inset-x-3.5 flex items-center justify-between text-[10px] font-mono text-text-tertiary bg-bg-primary/80 backdrop-blur-xs px-2 py-0.5 rounded-3xs border border-border-subtle/40">
                <span className="truncate max-w-[130px] sm:max-w-none">
                  {activeIcon.name} ({currentVariant?.style || 'regular'})
                </span>
                <span className="shrink-0 font-medium text-text-secondary">
                  {currentVariant?.viewBox || '0 0 24 24'}
                </span>
              </div>
            </div>

            {/* Interactive Showcase Specimen Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-text-tertiary">
                <span>Featured Canonical Specimens</span>
                <span>Select to inspect</span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {featuredIcons.map((icon) => {
                  const isSelected = icon.slug === selectedSlug;
                  return (
                    <button
                      key={icon.slug}
                      type="button"
                      onClick={() => setSelectedSlug(icon.slug)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2 rounded-3xs border transition-all duration-150 cursor-pointer min-h-[44px]',
                        isSelected
                          ? 'bg-accent/15 border-accent text-accent shadow-xs'
                          : 'bg-bg-elevated border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'
                      )}
                      title={icon.name}
                      aria-label={`Select ${icon.name} specimen`}
                    >
                      <IconPreviewSvg icon={icon} size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style Variant Selector & Quick Actions Strip */}
            <div className="pt-3.5 mt-3 border-t border-border-subtle/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              {/* Variant Style Switcher */}
              <div className="flex items-center gap-1 bg-bg-elevated p-0.5 border border-border-default rounded-3xs">
                {(['regular', 'light', 'filled', 'duotone'] as IconStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveStyle(st)}
                    className={cn(
                      'px-2 py-1 text-[10px] uppercase rounded-3xs transition-all cursor-pointer font-medium',
                      activeStyle === st
                        ? 'bg-accent text-white font-bold shadow-xs'
                        : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    {st === 'regular' ? 'Reg' : st === 'light' ? 'Light' : st === 'filled' ? 'Fill' : 'Duo'}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyActiveSvg}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-3xs bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-all cursor-pointer"
                  title="Copy Raw Canonical SVG"
                >
                  {copiedSlug === activeIcon.slug ? (
                    <>
                      <Check className="w-3 h-3 text-accent" />
                      <span className="text-accent font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SVG</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectIcon?.(activeIcon)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold rounded-3xs bg-accent text-white hover:bg-accent-hover transition-all cursor-pointer shadow-xs"
                  title="Open in full Inspector Modal"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
