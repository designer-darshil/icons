import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Collection } from '@/types/collection';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FolderPlus, Palette } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; color?: string }) => void;
  collection?: Collection | null;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Rose
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#64748B', // Slate
];

export const CollectionDialog: React.FC<CollectionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  collection,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (collection) {
        setName(collection.name);
        setDescription(collection.description || '');
        setColor(collection.color || PRESET_COLORS[0]);
      } else {
        setName('');
        setDescription('');
        setColor(PRESET_COLORS[0]);
      }
      setError(null);
    }
  }, [isOpen, collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-text-tertiary" />
          <span>{collection ? 'Edit Collection' : 'Create New Collection'}</span>
        </div>
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1">
          <label htmlFor="col-name" className="text-xs font-mono font-semibold text-text-secondary">
            Name <span className="text-action-destructive">*</span>
          </label>
          <Input
            id="col-name"
            type="text"
            placeholder="e.g. Navigation Vectors"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
          />
          {error && <p className="text-xs text-status-error-text">{error}</p>}
        </div>

        {/* Description Field */}
        <div className="space-y-1">
          <label htmlFor="col-desc" className="text-xs font-mono font-semibold text-text-secondary">
            Description <span className="text-text-disabled text-[10px] font-normal">(optional)</span>
          </label>
          <Input
            id="col-desc"
            type="text"
            placeholder="Collection notes or purpose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Color Accent Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-text-secondary flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Color Tag</span>
          </label>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className={cn(
                  'w-5 h-5 rounded-xs transition-transform cursor-pointer border',
                  color === preset
                    ? 'ring-1 ring-focus scale-110 border-text-primary'
                    : 'border-border-default hover:scale-105'
                )}
                style={{ backgroundColor: preset }}
                aria-label={`Select color ${preset}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {collection ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
