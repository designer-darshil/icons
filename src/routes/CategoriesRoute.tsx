import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ICON_CATEGORIES, getCategoryMetadata, canonicalCategoryIndex } from '@/data/categories';
import { ArrowLeft, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Icon, IconStyle } from '@/types/icon';

export const CategoriesRoute: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle | 'all'>('all');
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
    let icons = canonicalCategoryIndex.getIconsByCategory(activeCategory);

    if (selectedStyle !== 'all') {
      icons = icons.filter((i) =>
        i.variants.some((v) => v.style.toLowerCase() === selectedStyle.toLowerCase())
      );
    }

    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase();
      icons = icons.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        (i.aliases && i.aliases.some((a) => a.toLowerCase().includes(q)))
      );
    }

    return icons;
  }, [activeCategory, categorySearch, selectedStyle]);

  // Related categories (next & previous in official taxonomy)
  const relatedCategories = useMemo(() => {
    if (!activeCategoryMeta) return [];
    const currentIndex = ICON_CATEGORIES.findIndex((c) => c.slug === activeCategoryMeta.slug);
    const related = [];
    if (currentIndex > 0) {
      related.push(ICON_CATEGORIES[currentIndex - 1]);
    }
    if (currentIndex < ICON_CATEGORIES.length - 1) {
      related.push(ICON_CATEGORIES[currentIndex + 1]);
    }
    return related;
  }, [activeCategoryMeta]);

  return (
    <WorkspaceShell>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border-subtle/70 pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="type-section-label text-accent font-bold">Domain Directory</span>
              {activeCategoryMeta && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">
                  Domain #{activeCategoryMeta.order} of {ICON_CATEGORIES.length}
                </span>
              )}
            </div>
            <h1 className="type-h1 text-text-primary">
              {activeCategory ? `${categoryDisplayName} Icons` : 'Categories Directory'}
            </h1>
            <p className="type-body text-text-secondary max-w-xl">
              {activeCategory
                ? activeCategoryMeta?.description || `Exploring all canonical ${categoryDisplayName.toLowerCase()} vector concepts.`
                : `Browse precision vector glyphs organized across all ${ICON_CATEGORIES.length} canonical design domains.`}
            </p>
          </div>

          {activeCategory && (
            <div className="flex items-center gap-2">
              <Link to="/categories">
                <Button variant="ghost" size="sm" className="type-button-sm">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>All Categories</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* If viewing single category, show specimen grid with controls */}
        {activeCategory ? (
          <div className="space-y-6">
            {/* Category Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-bg-secondary/30 border border-border-subtle/70 rounded-xl">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder={`Search ${categoryDisplayName} icons, aliases, tags...`}
                  className="w-full pl-9 pr-4 py-1.5 bg-bg-secondary/50 border border-border-subtle/80 rounded-full text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-bg-secondary/50 p-1 border border-border-subtle/80 rounded-full text-xs font-mono select-none">
                  {(['all', 'light', 'regular', 'filled', 'duotone', 'duotone-line'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStyle(st)}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer capitalize ${
                        selectedStyle === st
                          ? 'bg-bg-elevated text-text-primary font-bold shadow-2xs border border-border-strong'
                          : 'text-text-tertiary hover:text-text-primary'
                      }`}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-text-tertiary px-2 py-1 bg-bg-elevated rounded border border-border-subtle shrink-0">
                  {categoryIcons.length} {categoryIcons.length === 1 ? 'concept' : 'concepts'}
                </span>
              </div>
            </div>

            <SpecimenGrid
              icons={categoryIcons}
              selectedIconId={selectedIcon?.id}
              favoriteIds={favoriteSet}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onToggleFavorite={(icon) => toggleFavorite(icon.id)}
            />

            {/* Related Domains Navigation */}
            {relatedCategories.length > 0 && (
              <div className="pt-8 border-t border-border-subtle/70 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
                  Adjacent Domains in Taxonomy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedCategories.map((rel) => (
                    <Link key={rel.slug} to={`/categories/${rel.slug}`}>
                      <div className="p-4 rounded-xl border border-border-subtle bg-bg-secondary/30 hover:bg-bg-secondary hover:border-border-strong transition-all flex items-center justify-between group cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-accent">Domain #{rel.order}</span>
                            <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                              {rel.name}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-1">{rel.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-text-tertiary group-hover:text-accent">
                          <span className="text-xs font-mono">{rel.count} icons</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Category cards directory in official canonical order */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {ICON_CATEGORIES.map((cat) => {
              return (
                <Link key={cat.id} to={`/categories/${cat.slug}`}>
                  <div className="p-6 rounded-xl border border-border-subtle/70 bg-bg-secondary/30 hover:bg-bg-secondary/80 hover:border-border-strong hover:shadow-dropdown hover:-translate-y-1 transition-all duration-200 text-left space-y-3 group cursor-pointer h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-accent/80 font-bold">
                            #{cat.order.toString().padStart(2, '0')}
                          </span>
                          <span className="type-h3 text-text-primary group-hover:text-accent transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <span className="type-metadata-sm text-text-tertiary px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-subtle font-mono">
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
