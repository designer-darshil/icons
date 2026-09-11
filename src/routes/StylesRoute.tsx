import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { ICON_STYLES, getStyleMetadata } from '@/data/styles';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Icon, IconStyle } from '@/types/icon';

function resolveCanonicalStyle(styleParam?: string): IconStyle | null {
  if (!styleParam) return null;
  const lower = styleParam.toLowerCase();
  if (lower === 'outline' || lower === 'linear') return 'regular';
  if (lower === 'thin') return 'light';
  if (lower === 'bold') return 'regular';
  return lower as IconStyle;
}

export const StylesRoute: React.FC = () => {
  const { style } = useParams<{ style?: string }>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const activeStyle = resolveCanonicalStyle(style);
  const activeStyleMeta = activeStyle ? getStyleMetadata(activeStyle) : undefined;
  const styleDisplayName = activeStyleMeta?.name || (activeStyle ? activeStyle.toUpperCase() : '');

  useDocumentTitle(
    activeStyle ? `${styleDisplayName} Style` : 'Icon Styles',
    'Filter vector icons by canonical rendering styles: Light, Regular, Filled, Duotone, Duotone Line.'
  );

  const styleIcons = useMemo(() => {
    if (!activeStyle) return [];
    return GRIDFRAME_ICONS.filter((i) =>
      i.variants.some((v) => v.style.toLowerCase() === activeStyle.toLowerCase())
    );
  }, [activeStyle]);

  return (
    <WorkspaceShell>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-border-subtle/70 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="type-section-label text-accent font-bold">Vector Styles</span>
            </div>
            <h1 className="type-h1 text-text-primary">
              {activeStyle ? `${styleDisplayName} Style` : 'Vector Styles Directory'}
            </h1>
            <p className="type-body text-text-secondary max-w-xl">
              {activeStyle
                ? activeStyleMeta?.description || `Showing all glyphs rendered in the ${styleDisplayName} stylistic execution.`
                : `Explore vector geometry rendered across ${ICON_STYLES.length} distinct stroke weights, solid fills, and duotone layers.`}
            </p>
          </div>

          {activeStyle && (
            <Link to="/styles">
              <Button variant="ghost" size="sm" className="type-button-sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>All Styles</span>
              </Button>
            </Link>
          )}
        </div>

        {/* If viewing single style, show specimen grid */}
        {activeStyle ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>{styleIcons.length} {styleIcons.length === 1 ? 'icon concept' : 'icon concepts'} in {styleDisplayName} style</span>
            </div>
            <SpecimenGrid
              icons={styleIcons}
              activeStyle={activeStyle}
              selectedIconId={selectedIcon?.id}
              favoriteIds={favoriteSet}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onToggleFavorite={(icon) => toggleFavorite(icon.id)}
            />
          </div>
        ) : (
          /* Style cards directory */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {ICON_STYLES.map((st) => {
              const count = GRIDFRAME_ICONS.filter((i) =>
                i.variants.some((v) => v.style === st.id)
              ).length;

              return (
                <Link key={st.id} to={`/styles/${st.id}`}>
                  <div className="p-6 rounded-xs border border-border-subtle/70 bg-bg-secondary/30 hover:bg-bg-secondary/80 hover:border-border-strong hover:shadow-dropdown hover:-translate-y-1 transition-all duration-200 text-left space-y-3 group cursor-pointer h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="type-h3 text-text-primary group-hover:text-accent transition-colors">
                          {st.name}
                        </span>
                        <span className="type-metadata-sm text-text-tertiary px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-subtle">
                          {count} icons
                        </span>
                      </div>
                      <p className="type-body-sm text-text-secondary leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="type-metadata-sm text-accent font-semibold bg-accent/10 px-2 py-1 rounded-3xs border border-accent/20">
                        {st.defaultStrokeWidth ? `${st.defaultStrokeWidth}px stroke` : 'Solid fill'}
                      </span>
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
export default StylesRoute;

