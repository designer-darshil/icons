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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
                <div
                  data-lenis-prevent="true"
                  className="flex items-center bg-bg-secondary/50 p-1 border border-border-subtle/80 rounded-full text-xs font-mono select-none overflow-x-auto no-scrollbar touch-pan-x max-w-full"
                >
                  {(['all', 'light', 'regular', 'filled', 'duotone', 'duotone-line'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStyle(st)}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer capitalize shrink-0 ${
                        selectedStyle === st
                          ? 'bg-bg-elevated text-text-primary font-bold shadow-2xs border border-border-strong'
                          : 'text-text-tertiary hover:text-text-primary'
                      }`}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-text-tertiary px-2 py-1 bg-bg-elevated rounded border border-border-subtle shrink-0 text-center sm:text-left self-start sm:self-auto">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedCategories.map((rel) => (
                    <Link key={rel.slug} to={`/categories/${rel.slug}`}>
                      <div className="p-3.5 rounded-md border border-border-subtle/60 bg-bg-secondary/30 hover:bg-bg-secondary/70 hover:border-border-default hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-between group cursor-pointer">
                        <div className="space-y-1 min-w-0 pr-3">
                          <div className="flex items-baseline gap-2 min-w-0">
                            <span className="text-[10px] font-mono text-text-tertiary/70 group-hover:text-accent transition-colors font-semibold">
                              #{rel.order.toString().padStart(2, '0')}
                            </span>
                            <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                              {rel.name}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary/90 line-clamp-1">{rel.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-text-tertiary group-hover:text-accent shrink-0">
                          <span className="text-xs font-mono">{rel.count} icons</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {ICON_CATEGORIES.map((cat) => {
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
                >
                  <div className="h-full p-5 sm:p-6 rounded-xl border border-border-subtle/70 bg-bg-secondary/30 hover:bg-bg-secondary/70 hover:border-border-strong hover:-translate-y-1 hover:shadow-dropdown transition-all duration-200 flex flex-col justify-between min-h-[145px] sm:min-h-[155px] cursor-pointer select-none">
                    {/* Top Row: Index + Title + Count */}
                    <div className="flex items-baseline justify-between gap-3 min-w-0">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="text-xs font-mono text-accent font-bold tracking-wider shrink-0">
                          #{cat.order.toString().padStart(2, '0')}
                        </span>
                        <h2 className="text-base sm:text-[17px] font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
                          {cat.name}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-text-tertiary px-2 py-0.5 rounded-sm bg-bg-elevated/60 border border-border-subtle shrink-0 group-hover:text-text-primary transition-colors">
                        {cat.count} {cat.count === 1 ? 'icon' : 'icons'}
                      </span>
                    </div>

                    {/* Lower Area: Description */}
                    <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed line-clamp-2 pt-3">
                      {cat.description}
                    </p>
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
