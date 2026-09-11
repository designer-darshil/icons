import React, { useState, useMemo } from 'react';
import { useCollections } from './useCollections';
import { CollectionCard } from './CollectionCard';
import { CollectionDialog } from './CollectionDialog';
import { CollectionWithIcons } from '@/types/collection';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, FolderPlus } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const CollectionList: React.FC = () => {
  const {
    collectionsWithIcons,
    createCollection,
    updateCollection,
    deleteCollection,
    count,
  } = useCollections();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionWithIcons | null>(null);

  useDocumentTitle('Icon Collections', 'Organize and curate custom vector icon sets.');

  const displayedCollections = useMemo(() => {
    if (!searchQuery.trim()) return collectionsWithIcons;
    const q = searchQuery.toLowerCase().trim();
    return collectionsWithIcons.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [collectionsWithIcons, searchQuery]);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (col: CollectionWithIcons) => {
    setEditingCollection(col);
    setIsDialogOpen(true);
  };

  const handleSubmitDialog = (data: { name: string; description?: string; color?: string }) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, data);
    } else {
      createCollection(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle/70 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="type-section-label text-accent font-bold">Icon Sets</span>
          </div>
          <h1 className="type-h1 text-text-primary">
            Custom Collections
          </h1>
          <p className="type-body text-text-secondary">
            {count === 1 ? '1 organized collection' : `${count} organized icon suites for your projects.`}
          </p>
        </div>

        <Button variant="primary" size="sm" className="type-button-sm" onClick={handleOpenCreate}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>New Collection</span>
        </Button>
      </div>

      {/* Main Content */}
      {count === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default bg-bg-secondary p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-md bg-bg-elevated border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary">
              No Collections Yet
            </h2>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Group vector icons into named collections for specific apps, design systems, or projects.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Create Collection</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {count > 4 && (
            <div className="max-w-xs">
              <Input
                type="text"
                placeholder="Filter collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                prefixIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedCollections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                onEdit={handleOpenEdit}
                onDelete={deleteCollection}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <CollectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitDialog}
        collection={editingCollection}
      />
    </div>
  );
};
export default CollectionList;
