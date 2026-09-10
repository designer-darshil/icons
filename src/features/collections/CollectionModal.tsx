import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCollections } from './useCollections';
import { useToast } from '@/components/ui/Toast';
import type { Icon } from '@/types/icon';
import { Folder, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: Icon | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  icon,
}) => {
  const { collections, createCollection, toggleIconInCollection, isIconInCollection } =
    useCollections();
  const { success } = useToast();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!icon) return null;

  const handleToggle = (collectionId: string, collectionName: string) => {
    const isNowIn = toggleIconInCollection(collectionId, icon.id);
    success(
      isNowIn
        ? `Added to "${collectionName}"`
        : `Removed from "${collectionName}"`
    );
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const created = createCollection({
      name: newCollectionName.trim(),
      iconIds: [icon.id],
    });
    setNewCollectionName('');
    setIsCreating(false);
    success(`Created "${created.name}" and added icon`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-text-tertiary" />
          <span>Save "{icon.name}" to Collection</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Existing Collections List */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto native-scroll pr-1">
          {collections.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-tertiary">
              No collections yet. Create your first set below.
            </div>
          ) : (
            collections.map((col) => {
              const inCollection = isIconInCollection(col.id, icon.id);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleToggle(col.id, col.name)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-md border text-left transition-colors cursor-pointer',
                    inCollection
                      ? 'border-action-primary bg-bg-secondary text-text-primary'
                      : 'border-border-default bg-bg-primary hover:border-border-strong hover:bg-bg-secondary text-text-secondary'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-xs shrink-0"
                      style={{ backgroundColor: col.color || '#3B82F6' }}
                    />
                    <div>
                      <span className="text-xs font-medium text-text-primary block">
                        {col.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-tertiary">
                        {col.iconIds.length} {col.iconIds.length === 1 ? 'icon' : 'icons'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-5 h-5 rounded-xs border flex items-center justify-center transition-colors',
                      inCollection
                        ? 'border-action-primary bg-action-primary text-text-inverse'
                        : 'border-border-default bg-transparent text-transparent'
                    )}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Create New Collection Form */}
        <div className="pt-3 border-t border-border-default">
          {isCreating ? (
            <form onSubmit={handleCreateAndAdd} className="space-y-2.5">
              <Input
                type="text"
                placeholder="Collection name (e.g. Navigation V2)"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newCollectionName.trim()}
                >
                  Create & Save
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(true)}
              className="w-full"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Create New Collection</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
