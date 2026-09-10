import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Icon } from '@/types/icon';

const ALL_CATEGORIES = [
  { name: 'Navigation', desc: 'Chevrons, compass, pins, routes, and wayfinding' },
  { name: 'Arrows', desc: 'Directions, trending, turns, expansion, and collapse' },
  { name: 'Communication', desc: 'Mail, messages, chat, broadcasting, and alerts' },
  { name: 'Commerce', desc: 'Shopping, carts, tags, products, and logistics' },
  { name: 'Development', desc: 'Code, git, terminal, servers, and architecture' },
  { name: 'Design', desc: 'Vector, brushes, layers, layout, and palettes' },
  { name: 'Files', desc: 'Documents, folders, archives, and spreadsheets' },
  { name: 'Finance', desc: 'Cards, currency, bank, wallets, and payments' },
  { name: 'Media', desc: 'Audio, playback, video, camera, and controls' },
  { name: 'Security', desc: 'Locks, shields, privacy, authentication, and keys' },
  { name: 'Social', desc: 'Sharing, likes, reactions, awards, and ratings' },
  { name: 'Users', desc: 'Accounts, profiles, avatars, and teams' },
  { name: 'Weather', desc: 'Sun, clouds, precipitation, and conditions' },
  { name: 'Maps', desc: 'Location, waypoints, vehicles, and geography' },
  { name: 'Devices', desc: 'Hardware, monitors, mobile, and peripherals' },
  { name: 'Home', desc: 'Smart home, buildings, furnishings, and rooms' },
  { name: 'Editor', desc: 'Typography, alignment, formatting, and tables' },
  { name: 'Time', desc: 'Clocks, timers, calendars, and schedules' },
  { name: 'Accessibility', desc: 'Assistive tech, vision, hearing, and inclusion' },
  { name: 'Transportation', desc: 'Cars, rail, aviation, marine, and transit' },
];

export const CategoriesRoute: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const activeCategory = category || null;

  useDocumentTitle(
    activeCategory ? `${activeCategory} Category` : 'Icon Categories',
    'Browse vector icons categorized by semantic design domains.'
  );

  const categoryIcons = useMemo(() => {
    if (!activeCategory) return [];
    const catLower = activeCategory.toLowerCase();
    return GRIDFRAME_ICONS.filter((i) => i.category.toLowerCase() === catLower);
  }, [activeCategory]);

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-text-tertiary" />
            <h1 className="text-base font-bold font-mono tracking-tight text-text-primary uppercase">
              {activeCategory ? `${activeCategory} Icons` : 'Categories Directory'}
            </h1>
            <span className="text-xs font-mono text-text-tertiary">
              {activeCategory ? `${categoryIcons.length} icons` : `${ALL_CATEGORIES.length} categories`}
            </span>
          </div>

          {activeCategory && (
            <Link to="/categories">
              <Button variant="ghost" size="xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>All Categories</span>
              </Button>
            </Link>
          )}
        </div>

        {/* If viewing single category, show specimen grid */}
        {activeCategory ? (
          <SpecimenGrid
            icons={categoryIcons}
            selectedIconId={selectedIcon?.id}
            favoriteIds={favoriteSet}
            onSelectIcon={(icon) => setSelectedIcon(icon)}
            onToggleFavorite={(icon) => toggleFavorite(icon.id)}
          />
        ) : (
          /* Category cards directory */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const count = GRIDFRAME_ICONS.filter(
                (i) => i.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <Link key={cat.name} to={`/categories/${cat.name.toLowerCase()}`}>
                  <div className="p-3.5 rounded-md border border-border-default bg-bg-primary hover:border-border-strong hover:bg-bg-secondary transition-colors text-left space-y-1 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-text-primary group-hover:text-text-primary uppercase">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-tertiary">
                        {count} icons
                      </span>
                    </div>
                    <p className="text-[11px] text-text-tertiary leading-relaxed">
                      {cat.desc}
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
