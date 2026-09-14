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

// Curated canonical specimens for quick inspection
const FEATURED_SPECIMENS = [
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

  // Active specimen state
  const [selectedSlug, setSelectedSlug] = useState<string>('shield-check');
  const [activeStyle, setActiveStyle] = useState<IconStyle>('regular');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Retrieve featured icons from catalog
  const featuredIcons = useMemo(() => {
    return FEATURED_SPECIMENS.map((slug) => {
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

  // Available canonical styles on active icon
  const availableStyles: IconStyle[] = useMemo(() => {
    if (!activeIcon) return ['regular'];
    const styles = activeIcon.variants.map((v) => v.style);
    return (['regular', 'light', 'filled', 'duotone', 'duotone-line'] as IconStyle[]).filter((st) =>
      styles.includes(st)
    );
  }, [activeIcon]);

  // Resolve matching canonical variant
  const currentVariant = useMemo(() => {
    if (!activeIcon) return undefined;
    return (
      activeIcon.variants.find((v) => v.style === activeStyle) ||
      activeIcon.variants.find((v) => v.style === 'regular') ||
      activeIcon.variants[0]
    );
  }, [activeIcon, activeStyle]);

  const handleCopySvg = useCallback(
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* =========================================================================
            LEFT COLUMN: Editorial Index, Confident Headline, Tool-Grade Search
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Eyebrow Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono tracking-wider text-text-tertiary">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-3xs bg-accent/10 border border-accent/25 text-accent font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                SPECIMEN ARCHIVE
              </span>
              <span className="hidden xs:inline text-border-strong">/</span>
              <span className="text-text-secondary font-medium">24×24 OPTICAL GRID</span>
              <span className="hidden sm:inline text-border-strong">/</span>
              <span className="hidden sm:inline font-mono">
                {TOTAL_CONCEPTS_COUNT.toLocaleString()} ICONS · {TOTAL_VARIANTS_COUNT.toLocaleString()} ASSETS
              </span>
            </div>

            {/* 2. Editorial Headline & Product Message */}
            <div className="space-y-3">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[50px] font-bold tracking-[-0.035em] leading-[1.06] text-text-primary text-balance">
                Icons, precisely made discoverable.
              </h1>
              <p className="text-sm sm:text-base text-text-secondary max-w-xl font-normal leading-relaxed text-pretty">
                A disciplined vector workspace engineered on a unified 24×24 coordinate frame. Search canonical concepts, inspect geometric weights, and export production assets.
              </p>
            </div>
          </div>

          {/* 3. Professional Tool-Grade Search Input */}
          <div className="space-y-3">
            <div
              onClick={handleFocusSearch}
              className={cn(
                'group relative flex items-center justify-between w-full h-12 sm:h-14 px-3.5 sm:px-4 rounded-xs transition-all duration-200 cursor-text',
                'bg-bg-secondary/70 hover:bg-bg-secondary/95 focus-within:bg-bg-secondary',
                'border border-border-default hover:border-border-strong focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 shadow-xs'
              )}
            >
              {/* Search Icon + Text Input */}
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

              {/* Action Chips: Clear / Keyboard Shortcut */}
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

            {/* Quick Category Jump Navigation */}
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

          {/* 4. Technical Grounding Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border-subtle/80 text-[11px] font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Matrix</span>
              <span className="font-semibold text-text-primary">24×24 px Grid</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Stroke</span>
              <span className="font-semibold text-text-primary">2.0px Center</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">Styles</span>
              <span className="font-semibold text-text-primary">5 Canonical Weights</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase text-text-tertiary tracking-wider block">License</span>
              <span className="font-semibold text-text-primary">MIT / Open Monograph</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Clean, Icon-First Inspection Stage
            Hierarchy: Header (Specimen Title) → Large Icon Preview → Variant Switcher → Primary/Secondary Actions → Featured Thumbnails
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative bg-bg-secondary/40 border border-border-default rounded-xs p-5 sm:p-6 space-y-4 shadow-xs">
            {/* 1. Clean Specimen Header */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-bold uppercase tracking-wider text-text-primary">
                  SPECIMEN / {activeIcon.name.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
                24 × 24 · {currentVariant?.style || 'REGULAR'}
              </span>
            </div>

            {/* 2. Primary Icon Preview Stage (Clean Optical Focus) */}
            <div
              onClick={() => onSelectIcon?.(activeIcon)}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xs bg-bg-primary/90 border border-border-subtle/80 flex items-center justify-center p-6 overflow-hidden cursor-pointer select-none group transition-colors hover:border-border-strong"
              title={`Click to inspect ${activeIcon.name}`}
            >
              {/* Subtle 24x24 Optical Grid Crosshair Frame */}
              <div className="absolute inset-5 border border-dashed border-border-subtle/30 rounded-3xs pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/20 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/20 pointer-events-none" />

              {/* Large Optical Icon Hero */}
              <div className="relative z-10 transition-transform duration-200 group-hover:scale-105 text-text-primary">
                <IconPreviewSvg
                  icon={activeIcon}
                  variant={currentVariant}
                  size={92}
                  className="drop-shadow-xs"
                />
              </div>

              {/* Quiet Bottom Caption */}
              <div className="absolute bottom-2 inset-x-3.5 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                <span className="font-medium text-text-secondary truncate">
                  {activeIcon.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary shrink-0">
                  {activeIcon.category}
                </span>
              </div>
            </div>

            {/* 3. Compact Segmented Variant Selector */}
            {availableStyles.length > 1 && (
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-text-tertiary tracking-wider shrink-0 font-medium">
                  Style
                </span>
                <div className="flex items-center gap-1 bg-bg-elevated p-0.5 border border-border-default rounded-3xs flex-1 max-w-[280px]">
                  {availableStyles.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setActiveStyle(st)}
                      className={cn(
                        'flex-1 py-1 text-[10px] uppercase rounded-3xs transition-all cursor-pointer text-center font-medium',
                        activeStyle === st
                          ? 'bg-accent text-white font-bold shadow-xs'
                          : 'text-text-tertiary hover:text-text-primary'
                      )}
                    >
                      {st === 'regular'
                        ? 'Reg'
                        : st === 'light'
                        ? 'Light'
                        : st === 'filled'
                        ? 'Fill'
                        : st === 'duotone'
                        ? 'Duo'
                        : 'Line'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Action Buttons (Primary: Inspect, Secondary: Copy SVG) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSelectIcon?.(activeIcon)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 min-h-[42px] text-xs font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-xs hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer touch-manipulation"
                title="Open full inspector"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Inspect Icon</span>
              </button>

              <button
                type="button"
                onClick={handleCopySvg}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] text-xs font-mono font-medium uppercase tracking-wider bg-bg-elevated border border-border-default hover:border-border-strong text-text-primary rounded-xs hover:bg-bg-secondary active:scale-[0.98] transition-colors cursor-pointer touch-manipulation"
                title="Copy raw canonical SVG"
              >
                {copiedSlug === activeIcon.slug ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent" />
                    <span className="text-accent font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SVG</span>
                  </>
                )}
              </button>
            </div>

            {/* 5. Featured Specimens (Compact, Secondary Thumbnails) */}
            <div className="flex items-center justify-between gap-1 pt-2.5 border-t border-border-subtle/70">
              <span className="text-[10px] font-mono uppercase text-text-tertiary tracking-wider shrink-0 font-medium">
                Specimens
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {featuredIcons.map((icon) => {
                  const isSelected = icon.slug === selectedSlug;
                  return (
                    <button
                      key={icon.slug}
                      type="button"
                      onClick={() => setSelectedSlug(icon.slug)}
                      className={cn(
                        'w-7 h-7 rounded-3xs flex items-center justify-center transition-all cursor-pointer border',
                        isSelected
                          ? 'bg-accent/15 border-accent text-accent shadow-xs scale-105'
                          : 'bg-bg-elevated/60 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong'
                      )}
                      title={icon.name}
                      aria-label={`Select ${icon.name}`}
                    >
                      <IconPreviewSvg icon={icon} size={15} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
