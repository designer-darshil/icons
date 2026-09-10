import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { ExplorerToolbar } from '@/features/icon-explorer/ExplorerToolbar';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { CommandPalette } from '@/features/search/CommandPalette';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { searchIconsWithScore } from '@/lib/icon-search';
import type { Icon, IconStyle } from '@/types/icon';
import type { SortOption } from '@/types/filters';

export const IconsRoute: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [style, setStyle] = useState<IconStyle | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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

  // Dynamic Document Title
  const dynamicTitle = useMemo(() => {
    if (query) return `Search: "${query}"`;
    if (category !== 'all') return `${category} Icons`;
    if (style !== 'all') return `${style.toUpperCase()} Icons`;
    return 'Icon Workstation';
  }, [query, category, style]);

  useDocumentTitle(dynamicTitle, 'Precision vector icon workstation for designers and developers.');

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

  return (
    <WorkspaceShell onOpenSearch={() => setIsCommandPaletteOpen(true)}>
      {/* Explorer Header & Controls Toolbar */}
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
      />

      {/* Specimen Icon Grid */}
      <SpecimenGrid
        icons={filteredIcons}
        selectedIconId={selectedIcon?.id}
        favoriteIds={favoriteSet}
        onSelectIcon={handleSelectIcon}
        onToggleFavorite={handleToggleFavorite}
        onResetFilters={handleResetFilters}
      />

      {/* Centered Two-Column Icon Detail Modal (NO right sidebar inspector!) */}
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
