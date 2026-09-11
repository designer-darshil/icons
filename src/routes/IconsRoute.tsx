import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { ExplorerToolbar } from '@/features/icon-explorer/ExplorerToolbar';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { SpecimenCard } from '@/features/icon-explorer/SpecimenCard';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { CommandPalette } from '@/features/search/CommandPalette';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useToast } from '@/components/ui/Toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GRIDFRAME_ICONS, TOTAL_CONCEPTS_COUNT, TOTAL_VARIANTS_COUNT } from '@/data/icons/gridframe-catalog';
import { searchIconsWithScore } from '@/lib/icon-search';
import { copyToClipboard } from '@/lib/export-svg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { pageEntranceVariants } from '@/lib/motion';
import {
  ArrowUpRight,
  Copy,
  Check,
  Sparkles,
  Layers,
  Maximize2,
  Box,
  FileCode,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Icon, IconStyle, IconVariant } from '@/types/icon';
import type { SortOption } from '@/types/filters';
import { getCategoryCounts } from '@/data/categories';

const SPOTLIGHT_SLUGS = ['search', 'heart', 'lock', 'star', 'mail', 'globe', 'settings', 'grid'];

export const IconsRoute: React.FC = () => {
  const { success } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [style, setStyle] = useState<IconStyle | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Hero Interactive Specimen Studio State
  const [heroSpotlightSlug, setHeroSpotlightSlug] = useState('search');
  const [heroScale, setHeroScale] = useState(40);
  const [heroStroke, setHeroStroke] = useState(2.0);
  const [heroStyle, setHeroStyle] = useState<IconStyle>('outline');
  const [heroCopied, setHeroCopied] = useState(false);

  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const categoryCounts = useMemo(() => getCategoryCounts(GRIDFRAME_ICONS), []);

  // Global Cmd+K / / shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter & Search & Sort pipeline
  const filteredIcons = useMemo(() => {
    let list = [...GRIDFRAME_ICONS];

    // 1. Category filter
    if (category !== 'all' && category !== 'All') {
      const catLower = category.toLowerCase();
      list = list.filter((i) => i.category.toLowerCase() === catLower);
    }

    // 2. Style filter
    if (style !== 'all') {
      list = list.filter((i) => i.variants.some((v) => v.style === style));
    }

    // 3. Search query
    if (query.trim()) {
      list = searchIconsWithScore(list, query);
    } else {
      // 4. Sorting (only when not searching by score)
      if (sort === 'popular') {
        list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      } else if (sort === 'newest') {
        list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      } else if (sort === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'name-desc') {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    return list;
  }, [category, style, query, sort]);

  // Curated Editorial Section Slices (for default un-filtered state)
  const isDefaultState = !query.trim() && category === 'all' && style === 'all';

  const curatedSections = useMemo(() => {
    if (!isDefaultState) return null;

    const popular = GRIDFRAME_ICONS.slice(0, 6);
    const interfaceIcons = GRIDFRAME_ICONS.filter(
      (i) => i.category.toLowerCase() === 'interface' || i.category.toLowerCase() === 'navigation'
    ).slice(0, 6);
    const arrows = GRIDFRAME_ICONS.filter(
      (i) => i.category.toLowerCase() === 'arrows'
    ).slice(0, 6);
    const communication = GRIDFRAME_ICONS.filter(
      (i) => i.category.toLowerCase() === 'communication' || i.category.toLowerCase() === 'media'
    ).slice(0, 6);

    return {
      popular,
      interfaceIcons,
      arrows,
      communication,
    };
  }, [isDefaultState]);

  // Hero Spotlight Active Icon & Markup
  const heroSpotlightIcon = useMemo(() => {
    return (
      GRIDFRAME_ICONS.find((i) => i.slug === heroSpotlightSlug) ||
      GRIDFRAME_ICONS[0]
    );
  }, [heroSpotlightSlug]);

  const heroActiveVariant: IconVariant = useMemo(() => {
    if (!heroSpotlightIcon) {
      return {
        id: 'fallback',
        style: 'outline',
        label: 'Outline',
        svg: '',
        viewBox: '0 0 24 24',
        supportsStroke: true,
        supportsColor: true,
      };
    }
    const match = heroSpotlightIcon.variants.find((v) => v.style === heroStyle);
    return match || heroSpotlightIcon.variants[0];
  }, [heroSpotlightIcon, heroStyle]);

  const heroTransformedSvg = useMemo(() => {
    return transformSvgMarkup(heroActiveVariant, {
      ...DEFAULT_CUSTOMIZATION,
      size: heroScale,
      strokeWidth: heroStroke,
    });
  }, [heroActiveVariant, heroScale, heroStroke]);

  const handleHeroCopy = useCallback(() => {
    copyToClipboard(heroTransformedSvg);
    setHeroCopied(true);
    success(`Copied ${heroSpotlightIcon.name} (${heroActiveVariant.style}) SVG`);
    setTimeout(() => setHeroCopied(false), 1500);
  }, [heroTransformedSvg, heroSpotlightIcon.name, heroActiveVariant.style, success]);

  // Dynamic Document Title
  const dynamicTitle = useMemo(() => {
    if (query) return `Search: "${query}"`;
    if (category !== 'all') return `${category} Icons`;
    if (style !== 'all') return `${style.toUpperCase()} Icons`;
    return 'Precision Vector Icon Archive';
  }, [query, category, style]);

  useDocumentTitle(dynamicTitle, 'Precision vector icon archive for modern interfaces.');

  const handleSelectIcon = useCallback((icon: Icon) => {
    setSelectedIcon(icon);
  }, []);

  const handleToggleFavorite = useCallback(
    (icon: Icon) => {
      toggleFavorite(icon.id);
    },
    [toggleFavorite]
  );

  const handleResetFilters = useCallback(() => {
    setQuery('');
    setCategory('all');
    setStyle('all');
  }, []);

  const prefersReducedMotion = useReducedMotion();

  return (
    <WorkspaceShell onOpenSearch={() => setIsCommandPaletteOpen(true)}>
      <motion.div
        variants={prefersReducedMotion ? undefined : pageEntranceVariants}
        initial="initial"
        animate="animate"
      >
        {/* =========================================================================
            1 & 2. ASYMMETRIC LARGE EDITORIAL HERO SECTION
            ========================================================================= */}
        <section className="pt-2 pb-16 md:pb-24 border-b border-border-subtle/70 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Hero Column: Massive Typographic Statement & Lead */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status pill & Archive Metadata */}
            <div className="flex flex-wrap items-center gap-3 type-metadata uppercase tracking-widest text-text-tertiary">
              <span className="flex items-center gap-2 px-2.5 py-1 rounded-3xs bg-accent/10 border border-accent/20 text-accent font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                ARCHIVE V2
              </span>
              <span>{TOTAL_CONCEPTS_COUNT.toLocaleString()} CONCEPTS</span>
              <span>·</span>
              <span>{TOTAL_VARIANTS_COUNT.toLocaleString()} VARIANTS</span>
              <span>·</span>
              <span className="text-text-secondary font-medium">OPEN SPECIMEN ARCHIVE</span>
            </div>

            {/* Giant Editorial Headline */}
            <div className="space-y-4">
              <h1 className="type-hero text-text-primary uppercase sm:normal-case">
                Vector forms engineered for digital surfaces.
              </h1>
              <p className="type-body-lead text-text-secondary max-w-2xl font-normal leading-relaxed">
                An open vector monograph of geometric interface glyphs. Unified on a 24×24 pixel canvas, deduplicated by concept identity, and rendered across multiple stroke and fill weights.
              </p>
            </div>

            {/* Hero Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border-subtle/70">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">Grid Geometry</span>
                <span className="text-xs font-mono font-bold text-text-primary">24×24 px</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">Primary Stroke</span>
                <span className="text-xs font-mono font-bold text-text-primary">2.0px Center</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">Variants</span>
                <span className="text-xs font-mono font-bold text-text-primary">5 Styles / Item</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">Export Engines</span>
                <span className="text-xs font-mono font-bold text-text-primary">React · SVG · CSS</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Live Specimen Stage */}
          <div className="lg:col-span-5 bg-bg-secondary/40 border border-border-default/80 rounded-xs p-6 md:p-8 space-y-6 shadow-dropdown">
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                  Interactive Specimen Stage
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary uppercase">
                {heroSpotlightIcon.category}
              </span>
            </div>

            {/* Live Vector Stage Display */}
            <div className="relative w-full aspect-video rounded-xs bg-bg-primary/90 border border-border-subtle/60 flex items-center justify-center p-8 overflow-hidden select-none">
              {/* 24x24 Optical Grid Crosshair Frame */}
              <div className="absolute inset-8 border border-dashed border-border-subtle/40 rounded-3xs pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/20 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/20 pointer-events-none" />

              {/* Rendered SVG Element */}
              <div
                dangerouslySetInnerHTML={{ __html: heroTransformedSvg }}
                className="relative z-10 flex items-center justify-center text-text-primary transition-transform duration-150"
              />

              {/* Stage Sub-label */}
              <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span>{heroSpotlightIcon.slug}</span>
                <span>{heroScale}px / {heroStroke}px</span>
              </div>
            </div>

            {/* Spotlight Concept Selector Carousel */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">
                Select Featured Specimen
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x">
                {SPOTLIGHT_SLUGS.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setHeroSpotlightSlug(slug)}
                    className={cn(
                      'px-3 py-1.5 min-h-[36px] text-xs font-mono rounded-3xs border transition-all cursor-pointer shrink-0 touch-manipulation',
                      heroSpotlightSlug === slug
                        ? 'bg-accent text-white font-bold border-accent shadow-xs'
                        : 'bg-bg-elevated text-text-secondary hover:text-text-primary border-border-default hover:border-border-strong'
                    )}
                  >
                    {slug}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Customizer Toggles: Style & Stroke & Scale */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle/70 text-xs font-mono">
              <div className="space-y-1.5">
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider block">Style</span>
                <div className="flex items-center gap-1 bg-bg-elevated p-1 border border-border-default rounded-3xs">
                  {(['outline', 'filled', 'bold'] as IconStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setHeroStyle(st)}
                      className={cn(
                        'flex-1 py-1.5 min-h-[32px] text-[10px] uppercase rounded-3xs transition-all cursor-pointer touch-manipulation',
                        heroStyle === st
                          ? 'bg-accent text-white font-bold'
                          : 'text-text-tertiary hover:text-text-primary'
                      )}
                    >
                      {st.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider block truncate">Stroke: {heroStroke}px</span>
                <div className="flex items-center gap-1 bg-bg-elevated p-1 border border-border-default rounded-3xs">
                  {[1.5, 2.0, 2.5].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setHeroStroke(w)}
                      className={cn(
                        'flex-1 py-1.5 min-h-[32px] text-[10px] uppercase rounded-3xs transition-all cursor-pointer touch-manipulation',
                        heroStroke === w
                          ? 'bg-accent text-white font-bold'
                          : 'text-text-tertiary hover:text-text-primary'
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-text-tertiary uppercase">
                  <span>Size</span>
                  <span className="text-text-primary font-bold">{heroScale}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={64}
                  step={2}
                  value={heroScale}
                  onChange={(e) => setHeroScale(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-2 bg-bg-elevated rounded-xs mt-2"
                />
              </div>
            </div>

            {/* Copy Action Strip */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleHeroCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] text-xs font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-lg hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer touch-manipulation"
              >
                {heroCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{heroCopied ? 'Copied Markup' : 'Copy SVG Specimen'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIcon(heroSpotlightIcon)}
                className="px-3.5 py-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-mono text-text-secondary hover:text-text-primary bg-bg-elevated border border-border-default hover:border-border-strong rounded-lg transition-colors cursor-pointer touch-manipulation"
                title="Open full inspector"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. UNIFIED PRIMARY SEARCH & FILTER FOCAL POINT
          ========================================================================= */}
      <ExplorerToolbar
        query={query}
        onQueryChange={setQuery}
        selectedCategory={category}
        onCategoryChange={setCategory}
        selectedStyle={style}
        onStyleChange={setStyle}
        sort={sort}
        onSortChange={setSort}
        totalCount={GRIDFRAME_ICONS.length}
        filteredCount={filteredIcons.length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />


      {/* =========================================================================
          6. CURATED EDITORIAL CHAPTERS (DEFAULT VIEW) OR FILTERED SEARCH RESULTS
          ========================================================================= */}
      {isDefaultState && curatedSections ? (
        <div className="space-y-20 md:space-y-28">
          {/* Chapter 01 / Core Essentials */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-border-subtle/70 pb-3">
              <div>
                <span className="type-section-label text-accent font-bold block mb-1">
                  01 / CURATED CHAPTER
                </span>
                <h2 className="type-h2 text-text-primary">
                  Core Essentials
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSort('popular');
                  const el = document.getElementById('full-directory');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-1.5 type-nav text-text-secondary hover:text-accent transition-colors"
              >
                <span>View All Popular</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {curatedSections.popular.slice(0, 6).map((icon) => (
                <SpecimenCard
                  key={icon.id}
                  icon={icon}
                  isSelected={selectedIcon?.id === icon.id}
                  isFavorite={favoriteSet.has(icon.id)}
                  activeStyle={style}
                  onSelect={handleSelectIcon}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Chapter 02 / Interface & Controls */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-border-subtle/70 pb-3">
              <div>
                <span className="type-section-label text-accent font-bold block mb-1">
                  02 / DOMAIN CHAPTER
                </span>
                <h2 className="type-h2 text-text-primary">
                  Interface & System Controls
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategory('interface')}
                className="group flex items-center gap-1.5 type-nav text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <span>View Interface ({categoryCounts['interface'] || 15} icons)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {curatedSections.interfaceIcons.slice(0, 6).map((icon) => (
                <SpecimenCard
                  key={icon.id}
                  icon={icon}
                  isSelected={selectedIcon?.id === icon.id}
                  isFavorite={favoriteSet.has(icon.id)}
                  activeStyle={style}
                  onSelect={handleSelectIcon}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Chapter 03 / Arrows & Direction */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-border-subtle/70 pb-3">
              <div>
                <span className="type-section-label text-accent font-bold block mb-1">
                  03 / DOMAIN CHAPTER
                </span>
                <h2 className="type-h2 text-text-primary">
                  Arrows & Wayfinding
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategory('arrows')}
                className="group flex items-center gap-1.5 type-nav text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <span>View Arrows ({categoryCounts['arrows'] || 8} icons)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {curatedSections.arrows.slice(0, 6).map((icon) => (
                <SpecimenCard
                  key={icon.id}
                  icon={icon}
                  isSelected={selectedIcon?.id === icon.id}
                  isFavorite={favoriteSet.has(icon.id)}
                  activeStyle={style}
                  onSelect={handleSelectIcon}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* Chapter 04 / Communication & Signals */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-border-subtle/70 pb-3">
              <div>
                <span className="type-section-label text-accent font-bold block mb-1">
                  04 / DOMAIN CHAPTER
                </span>
                <h2 className="type-h2 text-text-primary">
                  Communication & Media
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategory('communication')}
                className="group flex items-center gap-1.5 type-nav text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <span>View Communication ({categoryCounts['communication'] || 6} icons)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {curatedSections.communication.slice(0, 6).map((icon) => (
                <SpecimenCard
                  key={icon.id}
                  icon={icon}
                  isSelected={selectedIcon?.id === icon.id}
                  isFavorite={favoriteSet.has(icon.id)}
                  activeStyle={style}
                  onSelect={handleSelectIcon}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* =====================================================================
              7. MASTER SPECIMEN DIRECTORY
          ===================================================================== */}
          <section id="full-directory" className="space-y-6 pt-12 border-t border-border-subtle/70">
            <div className="flex items-end justify-between pb-3">
              <div>
                <span className="type-section-label text-accent font-bold block mb-1">
                  05 / FULL ARCHIVE DIRECTORY
                </span>
                <h2 className="type-h2 text-text-primary">
                  Complete Canonical Directory
                </h2>
              </div>
              <span className="type-metadata text-text-tertiary">
                {GRIDFRAME_ICONS.length.toLocaleString()} unique concepts
              </span>
            </div>
            <SpecimenGrid
              icons={filteredIcons}
              selectedIconId={selectedIcon?.id}
              favoriteIds={favoriteSet}
              activeStyle={style}
              onSelectIcon={handleSelectIcon}
              onToggleFavorite={handleToggleFavorite}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      ) : (
        /* Mode B: Direct Search & Filtered Specimen Grid */
        <SpecimenGrid
          icons={filteredIcons}
          selectedIconId={selectedIcon?.id}
          favoriteIds={favoriteSet}
          activeStyle={style}
          onSelectIcon={handleSelectIcon}
          onToggleFavorite={handleToggleFavorite}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* =========================================================================
          8 & 9. SUPPORTING DISCOVERY & VECTOR ARCHITECTURE SPOTLIGHT
          ========================================================================= */}
      <section className="mt-24 md:mt-32 pt-16 border-t border-border-subtle/70 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="type-section-label text-accent font-bold block">
            STUDIO MONOGRAPH
          </span>
          <h2 className="type-h1 text-text-primary">
            Vector engineering principles.
          </h2>
          <p className="type-body text-text-secondary leading-relaxed font-normal">
            Every glyph in the Gridframe archive conforms to rigorous mathematical symmetry and zero-duplication taxonomies.
          </p>
        </div>

        {/* 3-Column Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xs bg-bg-secondary/40 border border-border-subtle/70 space-y-3">
            <div className="w-8 h-8 rounded-xs bg-bg-elevated border border-border-default flex items-center justify-center text-accent">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-text-primary uppercase">
              01 / Concept Model
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Strictly separates conceptual identity from style variations. The main directory never shows duplicate cards for style variations.
            </p>
          </div>

          <div className="p-6 rounded-xs bg-bg-secondary/40 border border-border-subtle/70 space-y-3">
            <div className="w-8 h-8 rounded-xs bg-bg-elevated border border-border-default flex items-center justify-center text-accent">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-text-primary uppercase">
              02 / 24×24 Geometry
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Constructed on a 24×24 pixel optical canvas with a standard 2.0px stroke center, ensuring pixel-crisp rendering on high-DPI displays.
            </p>
          </div>

          <div className="p-6 rounded-xs bg-bg-secondary/40 border border-border-subtle/70 space-y-3">
            <div className="w-8 h-8 rounded-xs bg-bg-elevated border border-border-default flex items-center justify-center text-accent">
              <FileCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-text-primary uppercase">
              03 / Multi-Format Export
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Instant 1-click export to React TSX components, clean SVGs, inline CSS masks, HTML snippets, and Data URIs with zero layout shift.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. EDITORIAL STUDIO FOOTER & ARCHIVE UTILITY AREA
          ========================================================================= */}
      <footer className="mt-24 md:mt-32 pt-12 border-t border-border-subtle/70 text-xs font-mono text-text-tertiary">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-3xs" />
              <span className="font-bold text-text-primary text-sm tracking-widest uppercase">
                GRIDFRAME STUDIO
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary max-w-sm">
              Open-source precision vector specimen archive crafted for modern interfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-text-secondary">
            <Link to="/icons" className="hover:text-text-primary transition-colors">
              Archive
            </Link>
            <Link to="/categories" className="hover:text-text-primary transition-colors">
              Domains
            </Link>
            <Link to="/styles" className="hover:text-text-primary transition-colors">
              Styles
            </Link>
            <Link to="/favorites" className="hover:text-text-primary transition-colors">
              Saved
            </Link>
            <Link to="/collections" className="hover:text-text-primary transition-colors">
              Sets
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-subtle/40 text-[11px] text-text-tertiary">
          <span>© 2026 GRIDFRAME ARCHIVE. All vector specimens distributed under MIT / Open License.</span>
          <div className="flex items-center gap-4">
            <span>PRESS ⌘K FOR QUICK COMMAND</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>V2.4.0</span>
          </div>
        </div>
      </footer>
      </motion.div>

      {/* Centered Two-Column Icon Detail Modal */}
      <IconDetailModal
        isOpen={Boolean(selectedIcon)}
        onClose={() => setSelectedIcon(null)}
        icon={selectedIcon}
        isFavorite={selectedIcon ? favoriteSet.has(selectedIcon.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Global Cmd+K Search Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectIcon={handleSelectIcon}
        onSelectCategory={(cat) => setCategory(cat)}
      />
    </WorkspaceShell>
  );
};
export default IconsRoute;

