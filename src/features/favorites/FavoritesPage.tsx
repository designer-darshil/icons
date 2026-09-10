import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useFavorites } from './useFavorites';
import { downloadFile } from '@/lib/export-svg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Download, Trash2, Search, Plus } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { Icon } from '@/types/icon';

export const FavoritesPage: React.FC = () => {
  const { favoriteIcons, favoriteIds, toggleFavorite, clearFavorites, count } = useFavorites();
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useDocumentTitle('Favorite Icons', 'View, manage, and batch download saved vector icons.');

  const displayedIcons = useMemo(() => {
    if (!searchQuery.trim()) return favoriteIcons;
    const q = searchQuery.toLowerCase().trim();
    return favoriteIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(q) ||
        icon.category.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [favoriteIcons, searchQuery]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const handleExportAll = useCallback(() => {
    if (favoriteIcons.length === 0) return;
    setIsDownloading(true);

    let delay = 0;
    favoriteIcons.forEach((icon) => {
      setTimeout(() => {
        const variant = icon.variants[0] || {
          id: icon.id,
          style: 'linear',
          label: 'Linear',
          svg: icon.svg,
          viewBox: icon.viewBox,
          supportsStroke: true,
          supportsColor: true,
        };
        const svgContent = transformSvgMarkup(variant, DEFAULT_CUSTOMIZATION);
        downloadFile(svgContent, `${icon.slug}-${variant.style}.svg`, 'image/svg+xml');
      }, delay);
      delay += 100;
    });

    setTimeout(() => setIsDownloading(false), delay + 200);
  }, [favoriteIcons]);

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-action-destructive fill-current" />
            <h1 className="text-base font-bold font-mono tracking-tight text-text-primary uppercase">
              Favorites
            </h1>
            <span className="text-xs font-mono text-text-tertiary">
              {count} {count === 1 ? 'saved icon' : 'saved icons'}
            </span>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportAll}
                disabled={isDownloading}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>{isDownloading ? 'Exporting...' : 'Export All SVGs'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Clear all favorite icons?')) {
                    clearFavorites();
                  }
                }}
                className="text-action-destructive hover:bg-status-error-bg"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Clear All</span>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {count === 0 ? (
          <div className="rounded-lg border border-dashed border-border-default bg-bg-secondary p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-md bg-bg-elevated border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-text-primary">No Favorite Icons Yet</h2>
              <p className="text-xs text-text-tertiary leading-relaxed">
                Click the heart icon on any vector specimen or detail canvas to bookmark icons here.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/icons">
                <Button variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  <span>Browse Icons</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter bar if many favorites */}
            {count > 6 && (
              <div className="max-w-xs">
                <Input
                  type="text"
                  placeholder="Filter favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  prefixIcon={<Search className="w-3.5 h-3.5" />}
                />
              </div>
            )}

            <SpecimenGrid
              icons={displayedIcons}
              selectedIconId={selectedIcon?.id}
              favoriteIds={favoriteSet}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onToggleFavorite={(icon) => toggleFavorite(icon.id)}
            />
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
export default FavoritesPage;
