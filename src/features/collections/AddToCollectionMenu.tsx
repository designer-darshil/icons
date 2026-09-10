import React, { useState } from 'react';
import { useCollections } from './useCollections';
import { CollectionDialog } from './CollectionDialog';
import { Icon } from '@/types/icon';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Check, Plus, X, FolderCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AddToCollectionMenuProps {
  icon: Icon;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionMenu: React.FC<AddToCollectionMenuProps> = ({
  icon,
  isOpen,
  onClose,
}) => {
  const {
    collections,
    createCollection,
    toggleIconInCollection,
    isIconInCollection,
  } = useCollections();
  const { success, info } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleToggle = (colId: string, colName: string) => {
    const isAdded = toggleIconInCollection(colId, icon.id);
    if (isAdded) {
      success(`Added "${icon.name}" to ${colName}`);
    } else {
      info(`Removed "${icon.name}" from ${colName}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-collection-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500">
                <FolderCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 id="add-to-collection-title" className="text-sm font-bold text-foreground">
                  Add to Collection
                </h2>
                <p className="text-xs text-foreground-muted truncate max-w-[200px]">
                  {icon.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Collections List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {collections.length === 0 ? (
              <p className="text-xs text-foreground-muted text-center py-4">
                No collections yet. Create your first one below!
              </p>
            ) : (
              collections.map((col) => {
                const inCol = isIconInCollection(col.id, icon.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleToggle(col.id, col.name)}
                    className={cn(
                      'flex items-center justify-between w-full p-2.5 rounded-xl border text-left transition-all',
                      inCol
                        ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 font-medium'
                        : 'border-border/60 hover:bg-surface-muted text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: col.color || '#3B82F6' }}
                      />
                      <span className="text-xs truncate max-w-[190px]">
                        {col.name}
                      </span>
                    </div>

                    <div
                      className={cn(
                        'flex items-center justify-center w-5 h-5 rounded-md border text-xs transition-colors',
                        inCol
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-border/80 text-transparent'
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Create New Collection Inline CTA */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Collection</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded Create Dialog */}
      <CollectionDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data) => {
          createCollection({
            ...data,
            iconIds: [icon.id],
          });
        }}
      />
    </>
  );
};
