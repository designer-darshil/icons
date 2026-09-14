import React, { useState } from 'react';
import { useAdminCatalog, type CuratedCollection } from '@/features/admin/context/AdminCatalogContext';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminModal, AdminConfirmModal } from '@/features/admin/components/AdminModal';
import { AdminInput, AdminTextarea, AdminToggle } from '@/features/admin/components/AdminFormControls';

export const AdminCollectionsRoute: React.FC = () => {
  const { collections, icons, createCollection, updateCollection, deleteCollection } = useAdminCatalog();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CuratedCollection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<CuratedCollection | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formIconSlugs, setFormIconSlugs] = useState<string[]>([]);
  const [iconSearchTerm, setIconSearchTerm] = useState('');

  const handleOpenCreate = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormIsPublished(true);
    setFormIconSlugs([]);
    setIconSearchTerm('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (col: CuratedCollection) => {
    setEditingCollection(col);
    setFormName(col.name);
    setFormSlug(col.slug);
    setFormDescription(col.description);
    setFormIsPublished(col.isPublished);
    setFormIconSlugs(col.iconSlugs || []);
    setIconSearchTerm('');
  };

  const handleToggleIconInCollection = (slug: string) => {
    setFormIconSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCollection({
      name: formName.trim(),
      slug: formSlug.trim().toLowerCase(),
      description: formDescription.trim(),
      isPublished: formIsPublished,
      iconSlugs: formIconSlugs,
      coverIconSlug: formIconSlugs[0] || 'cloud-server',
    });
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: formName.trim(),
        description: formDescription.trim(),
        isPublished: formIsPublished,
        iconSlugs: formIconSlugs,
        coverIconSlug: formIconSlugs[0] || editingCollection.coverIconSlug,
      });
      setEditingCollection(null);
    }
  };

  const handleConfirmDelete = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      setCollectionToDelete(null);
    }
  };

  const filteredIconsForPicker = icons
    .filter(
      (i) =>
        i.name.toLowerCase().includes(iconSearchTerm.toLowerCase()) ||
        i.slug.toLowerCase().includes(iconSearchTerm.toLowerCase())
    )
    .slice(0, 15);

  const columns = [
    {
      key: 'name',
      header: 'Collection Name & Slug',
      render: (col: CuratedCollection) => (
        <div>
          <span className="font-semibold text-text-primary block">{col.name}</span>
          <span className="text-[11px] font-mono text-text-tertiary block">{col.slug}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (col: CuratedCollection) => (
        <p className="text-xs text-text-secondary line-clamp-1 max-w-md">{col.description}</p>
      ),
    },
    {
      key: 'icons',
      header: 'Included Icons',
      width: '180px',
      render: (col: CuratedCollection) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-text-primary font-bold mr-1">
            {col.iconSlugs.length}
          </span>
          <div className="flex -space-x-1.5 overflow-hidden">
            {col.iconSlugs.slice(0, 4).map((slug) => {
              const ic = icons.find((i) => i.slug === slug);
              if (!ic) return null;
              return (
                <div
                  key={slug}
                  className="w-5 h-5 rounded-full bg-bg-surface border border-border-subtle p-0.5 flex items-center justify-center text-text-primary"
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">${ic.svg}</svg>`,
                  }}
                  title={ic.name}
                />
              );
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (col: CuratedCollection) => (
        <AdminStatusBadge status={col.isPublished ? 'published' : 'draft'} size="sm" />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'right' as const,
      render: (col: CuratedCollection) => (
        <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleOpenEdit(col)}
            className="px-2 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setCollectionToDelete(col)}
            className="p-1 text-text-tertiary hover:text-rose-500 rounded transition-colors"
            title="Delete Collection"
          >
            🗑
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Curated Collections</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Create and organize featured icon sets for specific industry themes and design kits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-action-primary hover:bg-action-primary/90 text-text-inverse rounded-md text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>+</span>
          <span>Create Collection</span>
        </button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={collections}
        keyExtractor={(item) => item.id}
        emptyMessage="No curated collections yet."
      />

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isCreateModalOpen || !!editingCollection}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCollection(null);
        }}
        title={editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create Curated Collection'}
        maxWidth="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCollection(null);
              }}
              className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={editingCollection ? handleSaveEdit : handleSaveCreate}
              className="px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-mono font-semibold"
            >
              {editingCollection ? 'Save Changes' : 'Create Collection'}
            </button>
          </>
        }
      >
        <form onSubmit={editingCollection ? handleSaveEdit : handleSaveCreate} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminInput
              label="Collection Name"
              required
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (!formSlug && !editingCollection) {
                  setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }
              }}
            />
            <AdminInput
              label="Collection Slug"
              required
              readOnly={!!editingCollection}
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          <AdminTextarea
            label="Description"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

          <AdminToggle
            label="Publish Collection to Public Website"
            description="When enabled, this collection appears in the public collections explorer."
            checked={formIsPublished}
            onChange={setFormIsPublished}
          />

          {/* Icon Selector Box */}
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-text-primary">
                Included Icons ({formIconSlugs.length})
              </label>
              <span className="text-[11px] text-text-tertiary font-mono">Click icon below to add/remove</span>
            </div>

            {/* Selected Pills */}
            <div className="p-2.5 bg-bg-secondary rounded-md border border-border-subtle min-h-[44px] flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {formIconSlugs.length === 0 ? (
                <span className="text-xs text-text-tertiary font-mono italic">No icons added to collection yet.</span>
              ) : (
                formIconSlugs.map((slug) => (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-bg-surface text-text-primary text-[11px] font-mono rounded border border-border-subtle"
                  >
                    <span>{slug}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleIconInCollection(slug)}
                      className="text-text-tertiary hover:text-rose-500 leading-none font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Icon Search & Quick Add */}
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={iconSearchTerm}
                onChange={(e) => setIconSearchTerm(e.target.value)}
                placeholder="Search icon to add..."
                className="w-full px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-md text-xs font-sans text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-action-primary"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-bg-secondary/40 rounded border border-border-subtle/50 text-xs">
                {filteredIconsForPicker.map((ic) => {
                  const isIncluded = formIconSlugs.includes(ic.slug);
                  return (
                    <button
                      key={ic.slug}
                      type="button"
                      onClick={() => handleToggleIconInCollection(ic.slug)}
                      className={`p-1.5 rounded flex items-center justify-between gap-1 text-left transition-colors ${
                        isIncluded
                          ? 'bg-action-primary/10 border border-action-primary text-action-primary font-bold'
                          : 'bg-bg-surface hover:bg-bg-secondary border border-border-subtle text-text-secondary'
                      }`}
                    >
                      <span className="truncate font-mono text-[11px]">{ic.name}</span>
                      <span className="font-mono text-xs">{isIncluded ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Collection "${collectionToDelete?.name}"`}
        variant="danger"
        confirmLabel="Confirm Delete"
        message={`Are you sure you want to delete the collection "${collectionToDelete?.name}"? Icons will not be deleted from the catalog.`}
      />
    </div>
  );
};
