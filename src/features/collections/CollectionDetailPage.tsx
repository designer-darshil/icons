import React, { useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { SpecimenGrid } from '@/features/icon-explorer/SpecimenGrid';
import { IconDetailModal } from '@/features/icon-modal/IconDetailModal';
import { useCollections } from './useCollections';
import { useFavorites } from '@/features/favorites/useFavorites';
import { CollectionDialog } from './CollectionDialog';
import { downloadFile } from '@/lib/export-svg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Folder,
  ArrowLeft,
  Download,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { Icon } from '@/types/icon';

export const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCollection,
    getCollectionIcons,
    updateCollection,
    deleteCollection,
  } = useCollections();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const collection = useMemo(() => {
    if (!id) return undefined;
    return getCollection(id);
  }, [id, getCollection]);

  const icons = useMemo(() => {
    if (!id) return [];
    return getCollectionIcons(id);
  }, [id, getCollectionIcons]);

  useDocumentTitle(
    collection ? `${collection.name} Collection` : 'Collection Not Found',
    collection?.description || 'Curated vector icon collection in Gridframe.'
  );

  const { success, info } = useToast();

  const handleToggleFavorite = useCallback(
    (icon: Icon) => {
      const isNowFav = toggleFavorite(icon.id);
      if (isNowFav) {
        success(`Saved "${icon.name}" to favorites`);
      } else {
        info(`Removed "${icon.name}" from favorites`, {
          label: 'Undo',
          onClick: () => toggleFavorite(icon.id),
        });
      }
    },
    [toggleFavorite, success, info]
  );

  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const displayedIcons = useMemo(() => {
    if (!searchQuery.trim()) return icons;
    const q = searchQuery.toLowerCase().trim();
    return icons.filter((icon: Icon) => {
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.category.toLowerCase().includes(q) ||
        icon.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    });
  }, [icons, searchQuery]);

  const handleExportAll = useCallback(() => {
    if (icons.length === 0) return;
    setIsDownloading(true);

    let delay = 0;
    icons.forEach((icon: Icon) => {
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
  }, [icons]);

  if (!collection) {
    return (
      <WorkspaceShell>
        <div className="p-8 text-center max-w-md mx-auto space-y-4 my-16">
          <div className="w-12 h-12 rounded-md bg-bg-elevated border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
            <Folder className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Collection Not Found</h2>
          <p className="text-xs text-text-tertiary">
            This collection may have been removed or does not exist.
          </p>
          <Link to="/collections">
            <Button variant="primary" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back to Collections</span>
            </Button>
          </Link>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
        </div>

        {/* Collection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-xs text-text-inverse"
                style={{ backgroundColor: collection.color || '#3B82F6' }}
              >
                <Folder className="w-3.5 h-3.5 fill-current" />
              </div>
              <h1 className="text-base font-bold font-mono tracking-tight text-text-primary uppercase">
                {collection.name}
              </h1>
              <span className="text-xs font-mono text-text-tertiary">
                {icons.length} {icons.length === 1 ? 'icon' : 'icons'}
              </span>
            </div>

            {collection.description && (
              <p className="text-xs text-text-tertiary max-w-xl leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {icons.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportAll}
                disabled={isDownloading}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>{isDownloading ? 'Exporting...' : 'Export All SVGs'}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm(`Delete "${collection.name}" collection?`)) {
                  deleteCollection(collection.id);
                  navigate('/collections');
                }
              }}
              className="text-action-destructive hover:bg-status-error-bg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Collection Icons */}
        {icons.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-default bg-bg-secondary p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-10 h-10 rounded-md bg-bg-elevated border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
              <Folder className="w-5 h-5 text-text-tertiary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-text-primary">
                This set is empty.
              </h2>
            </div>
            <div className="pt-2">
              <Link to="/icons">
                <Button variant="primary" size="sm">
                  <span>Browse icons</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {icons.length > 6 && (
              <div className="max-w-xs">
                <Input
                  type="text"
                  placeholder="Filter within collection..."
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
              forceRegular={true}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <CollectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => {
          updateCollection(collection.id, data);
        }}
        collection={collection}
      />

      <IconDetailModal
        isOpen={Boolean(selectedIcon)}
        onClose={() => setSelectedIcon(null)}
        icon={selectedIcon}
        isFavorite={selectedIcon ? favoriteSet.has(selectedIcon.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </WorkspaceShell>
  );
};
export default CollectionDetailPage;
