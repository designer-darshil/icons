import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { Palette, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Icon, IconStyle } from '@/types/icon';

const ALL_STYLES: { id: IconStyle; name: string; desc: string; sample: string }[] = [
  {
    id: 'outline',
    name: 'Outline (Linear)',
    desc: 'Crisp 2px vector stroke outlines with rounded caps and joins. The standard Tabler design grid specimen style.',
    sample: '2px stroke',
  },
  {
    id: 'filled',
    name: 'Filled (Solid)',
    desc: 'Solid filled geometry with maximum visual mass and instant silhouette recognition.',
    sample: 'Solid fill',
  },
];

export const StylesRoute: React.FC = () => {
  const { style } = useParams<{ style?: string }>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const activeStyle = (style as IconStyle) || null;

  useDocumentTitle(
    activeStyle ? `${activeStyle.toUpperCase()} Style` : 'Icon Styles',
    'Filter vector icons by rendering style: Linear, Bold, Filled, Duotone, Two-tone, Broken, Mono.'
  );

  const styleIcons = useMemo(() => {
    if (!activeStyle) return [];
    return GRIDFRAME_ICONS.filter((i) =>
      i.variants.some((v) => v.style.toLowerCase() === activeStyle.toLowerCase())
    );
  }, [activeStyle]);

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-text-tertiary" />
            <h1 className="text-base font-bold font-mono tracking-tight text-text-primary uppercase">
              {activeStyle ? `${activeStyle} Icons` : 'Vector Styles Directory'}
            </h1>
            <span className="text-xs font-mono text-text-tertiary">
              {activeStyle ? `${styleIcons.length} icons` : `${ALL_STYLES.length} styles`}
            </span>
          </div>

          {activeStyle && (
            <Link to="/styles">
              <Button variant="ghost" size="xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>All Styles</span>
              </Button>
            </Link>
          )}
        </div>

        {/* If viewing single style, show specimen grid */}
        {activeStyle ? (
          <SpecimenGrid
            icons={styleIcons}
            selectedIconId={selectedIcon?.id}
            favoriteIds={favoriteSet}
            onSelectIcon={(icon) => setSelectedIcon(icon)}
            onToggleFavorite={(icon) => toggleFavorite(icon.id)}
          />
        ) : (
          /* Style cards directory */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_STYLES.map((st) => {
              const count = GRIDFRAME_ICONS.filter((i) =>
                i.variants.some((v) => v.style === st.id)
              ).length;

              return (
                <Link key={st.id} to={`/styles/${st.id}`}>
                  <div className="p-4 rounded-md border border-border-default bg-bg-primary hover:border-border-strong hover:bg-bg-secondary transition-colors text-left space-y-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-text-primary uppercase">
                        {st.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-tertiary">
                        {count} icons
                      </span>
                    </div>
                    <p className="text-[11px] text-text-tertiary leading-relaxed">
                      {st.desc}
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] font-mono text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-xs border border-border-default">
                        {st.sample}
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
