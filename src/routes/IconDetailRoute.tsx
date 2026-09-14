import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { ExplorerToolbar } from '@/features/icon-explorer/ExplorerToolbar';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { CommandPalette } from '@/features/search/CommandPalette';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { deserializeIconConfiguration } from '@/lib/icon-share';
import type { Icon, IconStyle } from '@/types/icon';
import type { SortOption } from '@/types/filters';

export const IconDetailRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [style, setStyle] = useState<IconStyle | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // Find icon by slug
  const matchedIcon = useMemo(() => {
    if (!slug) return null;
    return GRIDFRAME_ICONS.find((i) => i.slug.toLowerCase() === slug.toLowerCase()) || null;
  }, [slug]);

  // Deserialize shareable configuration from query parameters
  const initialConfig = useMemo(() => {
    if (!matchedIcon) return null;
    return deserializeIconConfiguration(location.search, matchedIcon);
  }, [matchedIcon, location.search]);

  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(matchedIcon);

  useEffect(() => {
    setSelectedIcon(matchedIcon);
  }, [matchedIcon]);

  useDocumentTitle(
    matchedIcon
      ? `${matchedIcon.name} Vector Icon — Gridframe`
      : 'Icon Not Found',
    matchedIcon
      ? `Inspect, customize, and export the ${matchedIcon.name} vector icon in React JSX, SVG, and HTML.`
      : 'Vector icon not found.'
  );

  const handleCloseModal = useCallback(() => {
    setSelectedIcon(null);
    navigate('/icons');
  }, [navigate]);

  const handleSelectIcon = useCallback(
    (icon: Icon) => {
      setSelectedIcon(icon);
      navigate(`/icons/${icon.slug}`);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback(
    (icon: Icon) => {
      toggleFavorite(icon.id);
    },
    [toggleFavorite]
  );

  const filteredIcons = useMemo(() => {
    let list = [...GRIDFRAME_ICONS];
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') {
      const catLower = category.toLowerCase();
      list = list.filter((i) => i.category.toLowerCase() === catLower);
    }
    if (style !== 'all') {
      list = list.filter((i) => i.variants.some((v) => v.style === style));
    }
    return list;
  }, [query, category, style]);

  return (
    <WorkspaceShell onOpenSearch={() => setIsCommandPaletteOpen(true)}>
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

      <SpecimenGrid
        icons={filteredIcons}
        activeStyle={style}
        selectedIconId={selectedIcon?.id}
        favoriteIds={favoriteSet}
        onSelectIcon={handleSelectIcon}
        onToggleFavorite={handleToggleFavorite}
      />

      <IconDetailModal
        isOpen={Boolean(selectedIcon)}
        onClose={handleCloseModal}
        icon={selectedIcon}
        isFavorite={selectedIcon ? favoriteSet.has(selectedIcon.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onSelectIcon={handleSelectIcon}
        initialStyle={initialConfig?.style}
        initialCustomization={initialConfig?.customization}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectIcon={handleSelectIcon}
      />
    </WorkspaceShell>
  );
};
export default IconDetailRoute;
