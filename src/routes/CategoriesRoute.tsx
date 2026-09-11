import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { ICON_CATEGORIES, getCategoryMetadata } from '@/data/categories';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Icon } from '@/types/icon';

export const CategoriesRoute: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const activeCategory = category || null;
  const activeCategoryMeta = activeCategory ? getCategoryMetadata(activeCategory) : undefined;
  const categoryDisplayName = activeCategoryMeta?.name || (activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : '');

  useDocumentTitle(
    activeCategory ? `${categoryDisplayName} Category` : 'Icon Categories',
    'Browse vector icons categorized by semantic design domains.'
  );

  const categoryIcons = useMemo(() => {
    if (!activeCategory) return [];
    const catLower = activeCategory.toLowerCase();
    return GRIDFRAME_ICONS.filter((i) => i.category.toLowerCase() === catLower);
  }, [activeCategory]);

  return (
    <WorkspaceShell>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-border-subtle/70 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="type-section-label text-accent font-bold">Domain Directory</span>
            </div>
            <h1 className="type-h1 text-text-primary">
              {activeCategory ? `${categoryDisplayName} Icons` : 'Categories Directory'}
            </h1>
            <p className="type-body text-text-secondary max-w-xl">
              {activeCategory
                ? activeCategoryMeta?.description || `Exploring all canonical ${categoryDisplayName.toLowerCase()} vector concepts.`
                : `Browse precision vector glyphs organized across ${ICON_CATEGORIES.length} distinct design domains.`}
            </p>
          </div>

          {activeCategory && (
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="type-button-sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>All Categories</span>
              </Button>
            </Link>
          )}
        </div>

        {/* If viewing single category, show specimen grid */}
        {activeCategory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>{categoryIcons.length} {categoryIcons.length === 1 ? 'icon concept' : 'icon concepts'}</span>
            </div>
            <SpecimenGrid
              icons={categoryIcons}
              selectedIconId={selectedIcon?.id}
              favoriteIds={favoriteSet}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onToggleFavorite={(icon) => toggleFavorite(icon.id)}
            />
          </div>
        ) : (
          /* Category cards directory */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {ICON_CATEGORIES.map((cat) => {
              return (
                <Link key={cat.id} to={`/categories/${cat.id}`}>
                  <div className="p-6 rounded-xs border border-border-subtle/70 bg-bg-secondary/30 hover:bg-bg-secondary/80 hover:border-border-strong hover:shadow-dropdown hover:-translate-y-1 transition-all duration-200 text-left space-y-3 group cursor-pointer h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="type-h3 text-text-primary group-hover:text-accent transition-colors">
                          {cat.name}
                        </span>
                        <span className="type-metadata-sm text-text-tertiary px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-subtle">
                          {cat.count} {cat.count === 1 ? 'icon' : 'icons'}
                        </span>
                      </div>
                      <p className="type-body-sm text-text-secondary leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <IconDetailModal
        isOpen={Boolean(selectedIcon)}
        onClose={() => setSelectedIcon(null)}
        icon={selectedIcon}
        isFavorite={selectedIcon ? favoriteSet.has(selectedIcon.id) : false}
        onToggleFavorite={(icon) => toggleFavorite(icon.id)}
      />
    </WorkspaceShell>
  );
};
export default CategoriesRoute;

