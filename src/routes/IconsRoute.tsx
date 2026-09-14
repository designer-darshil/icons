import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { ExplorerToolbar } from '@/features/icon-explorer/ExplorerToolbar';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { CommandPalette } from '@/features/search/CommandPalette';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HeroSection } from '@/features/hero/HeroSection';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { filterAndSortIcons } from '@/lib/icon-filtering';
import { pageEntranceVariants } from '@/lib/motion';
import { Layers, Box, FileCode } from 'lucide-react';
import { MobileFilterDrawer } from '@/features/icon-explorer/MobileFilterDrawer';
import { useCollections } from '@/features/collections/useCollections';
import type { Icon, IconStyle } from '@/types/icon';
import type { SortOption } from '@/types/filters';

export const IconsRoute: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derived filter params from URL
  const queryParam = searchParams.get('search') || searchParams.get('query') || searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || searchParams.get('cat') || 'all';
  const styleParam = (searchParams.get('style') as IconStyle | 'all') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'popular';
  const favoritesParam = searchParams.get('favorites') === 'true' || searchParams.get('saved') === 'true';
  const collectionParam = searchParams.get('collection') || searchParams.get('set') || '';

  const [query, setQueryState] = useState(queryParam);
  const [category, setCategoryState] = useState(categoryParam);
  const [style, setStyleState] = useState<IconStyle | 'all'>(styleParam);
  const [sort, setSortState] = useState<SortOption>(sortParam);
  const [onlyFavorites, setOnlyFavorites] = useState(favoritesParam);
  const [collectionId, setCollectionId] = useState(collectionParam);

  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setQueryState(queryParam);
    setCategoryState(categoryParam);
    setStyleState(styleParam);
    setSortState(sortParam);
    setOnlyFavorites(favoritesParam);
    setCollectionId(collectionParam);
  }, [queryParam, categoryParam, styleParam, sortParam, favoritesParam, collectionParam]);

  // Sync changes back to URL searchParams
  const updateUrlParams = useCallback(
    (updates: {
      query?: string;
      category?: string;
      style?: IconStyle | 'all';
      sort?: SortOption;
      onlyFavorites?: boolean;
      collectionId?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const nextQuery = updates.query !== undefined ? updates.query : (prev.get('search') || prev.get('query') || prev.get('q') || '');
          const nextCategory = updates.category !== undefined ? updates.category : (prev.get('category') || prev.get('cat') || 'all');
          const nextStyle = updates.style !== undefined ? updates.style : ((prev.get('style') as IconStyle | 'all') || 'all');
          const nextSort = updates.sort !== undefined ? updates.sort : ((prev.get('sort') as SortOption) || 'popular');
          const nextFavorites = updates.onlyFavorites !== undefined ? updates.onlyFavorites : (prev.get('favorites') === 'true');
          const nextCollection = updates.collectionId !== undefined ? updates.collectionId : (prev.get('collection') || '');

          if (nextQuery && nextQuery.trim()) {
            next.set('search', nextQuery.trim());
            next.delete('query');
            next.delete('q');
          } else {
            next.delete('search');
            next.delete('query');
            next.delete('q');
          }

          if (nextCategory && nextCategory.toLowerCase() !== 'all') {
            next.set('category', nextCategory.toLowerCase());
            next.delete('cat');
          } else {
            next.delete('category');
            next.delete('cat');
          }

          if (nextStyle && nextStyle !== 'all') {
            next.set('style', nextStyle);
          } else {
            next.delete('style');
          }

          if (nextSort && nextSort !== 'popular') {
            next.set('sort', nextSort);
          } else {
            next.delete('sort');
          }

          if (nextFavorites) {
            next.set('favorites', 'true');
            next.delete('saved');
          } else {
            next.delete('favorites');
            next.delete('saved');
          }

          if (nextCollection) {
            next.set('collection', nextCollection);
            next.delete('set');
          } else {
            next.delete('collection');
            next.delete('set');
          }

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      updateUrlParams({ query: newQuery });
    },
    [updateUrlParams]
  );

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      setCategoryState(newCategory);
      updateUrlParams({ category: newCategory });
    },
    [updateUrlParams]
  );

  const handleStyleChange = useCallback(
    (newStyle: IconStyle | 'all') => {
      setStyleState(newStyle);
      updateUrlParams({ style: newStyle });
    },
    [updateUrlParams]
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSortState(newSort);
      updateUrlParams({ sort: newSort });
    },
    [updateUrlParams]
  );

  const { collections } = useCollections();
  const activeCollection = useMemo(() => {
    if (!collectionId) return null;
    return collections.find((c) => c.id === collectionId || c.name.toLowerCase() === collectionId.toLowerCase()) || null;
  }, [collectionId, collections]);

  const collectionIconSet = useMemo(() => {
    if (!activeCollection) return undefined;
    return new Set(activeCollection.iconIds);
  }, [activeCollection]);

  const handleToggleOnlyFavorites = useCallback(() => {
    setOnlyFavorites((prev) => {
      const next = !prev;
      updateUrlParams({ onlyFavorites: next });
      return next;
    });
  }, [updateUrlParams]);

  const handleResetFilters = useCallback(() => {
    setQueryState('');
    setCategoryState('all');
    setStyleState('all');
    setSortState('popular');
    setOnlyFavorites(false);
    setCollectionId('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

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

  // Filter & Search & Sort pipeline across COMPLETE ICON DATASET
  const filteredIcons = useMemo(() => {
    return filterAndSortIcons(
      GRIDFRAME_ICONS,
      {
        query,
        category,
        style,
        strokeWeight: 'all',
        sort,
        onlyFavorites,
        collectionId: activeCollection?.id,
      },
      {
        favoriteIds: favoriteSet,
        collectionIconIds: collectionIconSet,
      }
    );
  }, [query, category, style, sort, onlyFavorites, activeCollection, favoriteSet, collectionIconSet]);

  // Dynamic Document Title
  const dynamicTitle = useMemo(() => {
    if (query) return `Search: "${query}"`;
    if (onlyFavorites) return 'Saved Favorite Icons';
    if (activeCollection) return `Set: ${activeCollection.name}`;
    if (category !== 'all' && category !== 'ALL') return `${category.charAt(0).toUpperCase() + category.slice(1)} Icons`;
    if (style !== 'all') return `${style.toUpperCase()} Icons`;
    return 'Precision Vector Icon Archive';
  }, [query, onlyFavorites, activeCollection, category, style]);

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

  const prefersReducedMotion = useReducedMotion();

  return (
    <WorkspaceShell onOpenSearch={() => setIsCommandPaletteOpen(true)}>
      <motion.div
        variants={prefersReducedMotion ? undefined : pageEntranceVariants}
        initial="initial"
        animate="animate"
      >
        {/* =========================================================================
            1. HERO / PAGE INTRO: GRIDFRAME V3 EDITORIAL SPECIMEN WORKSPACE
            ========================================================================= */}
        <HeroSection
          query={query}
          onQueryChange={handleQueryChange}
          onSelectCategory={handleCategoryChange}
          onSelectIcon={handleSelectIcon}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* =========================================================================
            2. PRIMARY SEARCH, DOMAIN FILTERS, STYLE SWITCHER & SORT BAR
            ========================================================================= */}
        <ExplorerToolbar
          query={query}
          onQueryChange={handleQueryChange}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          selectedStyle={style}
          onStyleChange={handleStyleChange}
          sort={sort}
          onSortChange={handleSortChange}
          totalCount={GRIDFRAME_ICONS.length}
          filteredCount={filteredIcons.length}
          onlyFavorites={onlyFavorites}
          onToggleOnlyFavorites={handleToggleOnlyFavorites}
          favoritesCount={favoriteIds.length}
          onResetFilters={handleResetFilters}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* =========================================================================
            3. UNIFIED COMPLETE SPECIMEN ARCHIVE GRID (Zero Category Chapter Blocks)
            ========================================================================= */}
        <section aria-label="Icon Specimen Archive" className="min-h-[400px]">
          <SpecimenGrid
            icons={filteredIcons}
            selectedIconId={selectedIcon?.id}
            favoriteIds={favoriteSet}
            forceRegular={true}
            onSelectIcon={handleSelectIcon}
            onToggleFavorite={handleToggleFavorite}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* =========================================================================
            4. SUPPORTING VECTOR ARCHITECTURE MONOGRAPH
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
            5. EDITORIAL STUDIO FOOTER & ARCHIVE UTILITY AREA
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
        onSelectIcon={handleSelectIcon}
      />

      {/* Global Cmd+K Search Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectIcon={handleSelectIcon}
        onSelectCategory={(cat) => handleCategoryChange(cat)}
      />

      {/* Mobile Responsive Filter & Sort Bottom Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
        selectedStyle={style}
        onStyleChange={handleStyleChange}
        sort={sort}
        onSortChange={handleSortChange}
        totalCount={GRIDFRAME_ICONS.length}
        filteredCount={filteredIcons.length}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={handleToggleOnlyFavorites}
        favoritesCount={favoriteIds.length}
        onResetAll={handleResetFilters}
      />
    </WorkspaceShell>
  );
};

export default IconsRoute;
