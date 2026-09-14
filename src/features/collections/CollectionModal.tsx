import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCollections } from './useCollections';
import { useToast } from '@/components/ui/Toast';
import type { Icon } from '@/types/icon';
import { FolderPlus, Plus, Check, X, Folder } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, modalDialogVariants } from '@/lib/motion';

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
  const { success, info } = useToast();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useScrollLock(isOpen);

  if (!icon) return null;

  const handleToggle = (collectionId: string, collectionName: string) => {
    const isNowIn = toggleIconInCollection(collectionId, icon.id);
    if (isNowIn) {
      success(`Added "${icon.name}" to ${collectionName}`);
    } else {
      info(`Removed "${icon.name}" from ${collectionName}`);
    }
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const created = createCollection({
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim() || undefined,
      iconIds: [icon.id],
    });
    setNewCollectionName('');
    setNewCollectionDesc('');
    setIsCreating(false);
    success(`Created "${created.name}" and saved icon`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay backdrop-blur-xs cursor-pointer"
          />

          {/* Modal / Sheet Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalDialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-bg-elevated border border-border-default rounded-t-2xl sm:rounded-xl shadow-modal flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden z-10 text-text-primary"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-secondary/40 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold tracking-tight text-text-primary truncate">
                    Add to Set
                  </h2>
                  <p className="text-[11px] font-mono text-text-tertiary truncate">
                    {icon.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-5 flex-1 min-h-0 overflow-y-auto native-scroll space-y-4 overscroll-contain">
              {/* Existing Collections */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto native-scroll pr-0.5">
                {collections.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
                      <Folder className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-text-tertiary">
                      No collections yet. Create your first set below.
                    </p>
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
                          'w-full min-h-[44px] flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer touch-manipulation',
                          inCollection
                            ? 'border-accent bg-accent/10 text-text-primary font-medium'
                            : 'border-border-subtle bg-bg-primary hover:border-border-strong hover:bg-bg-secondary text-text-secondary'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className="w-3 h-3 rounded-xs shrink-0"
                            style={{ backgroundColor: col.color || '#3B82F6' }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-text-primary block truncate">
                              {col.name}
                            </span>
                            <span className="text-[10px] font-mono text-text-tertiary block">
                              {col.iconIds.length} {col.iconIds.length === 1 ? 'icon' : 'icons'}
                            </span>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                            inCollection
                              ? 'border-accent bg-accent text-white'
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

              {/* Create New Collection Form / Button */}
              <div className="pt-3 border-t border-border-subtle">
                {isCreating ? (
                  <form onSubmit={handleCreateAndAdd} className="space-y-3">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Collection name (e.g. Navigation)"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        autoFocus
                      />
                      <Input
                        type="text"
                        placeholder="Description (optional)"
                        value={newCollectionDesc}
                        onChange={(e) => setNewCollectionDesc(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCreating(false);
                          setNewCollectionName('');
                          setNewCollectionDesc('');
                        }}
                      >
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
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(true)}
                    className="w-full min-h-[40px] text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Collection</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Bottom Done Action Bar */}
            <div className="px-5 py-3 border-t border-border-subtle bg-bg-secondary/40 flex items-center justify-end pb-safe">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CollectionModal;
