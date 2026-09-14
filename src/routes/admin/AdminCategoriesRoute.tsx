import React, { useState, useMemo } from 'react';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminModal, AdminConfirmModal } from '@/features/admin/components/AdminModal';
import { AdminInput, AdminTextarea } from '@/features/admin/components/AdminFormControls';
import type { CanonicalCategoryDefinition } from '@/data/category-registry';

export const AdminCategoriesRoute: React.FC = () => {
  const { categories, icons, createCategory, updateCategory, deleteCategory } = useAdminCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<CanonicalCategoryDefinition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CanonicalCategoryDefinition | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrdering, setFormOrdering] = useState(10);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const handleOpenCreate = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormOrdering(categories.length + 1);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (cat: CanonicalCategoryDefinition) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormOrdering(cat.order || 10);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({
      id: `cat-${formSlug}`,
      slug: formSlug.trim().toLowerCase(),
      name: formName.trim(),
      description: formDescription.trim(),
      order: formOrdering,
    });
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.slug, {
        name: formName.trim(),
        description: formDescription.trim(),
        order: formOrdering,
      });
      setEditingCategory(null);
    }
  };

  const handleInitiateDelete = (cat: CanonicalCategoryDefinition) => {
    setDeleteError(null);
    const assigned = icons.filter((i) => i.primaryCategory === cat.slug || i.category.toLowerCase() === cat.slug).length;
    if (assigned > 0) {
      setDeleteError(`Cannot delete category "${cat.name}" because ${assigned} icon concepts are currently assigned to it.`);
    }
    setCategoryToDelete(cat);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      const res = deleteCategory(categoryToDelete.slug);
      if (res.success) {
        setCategoryToDelete(null);
      } else {
        setDeleteError(res.error || 'Failed to delete category');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Category Name & Slug',
      render: (cat: CanonicalCategoryDefinition) => (
        <div>
          <span className="font-semibold text-text-primary block">{cat.name}</span>
          <span className="text-[11px] font-mono text-text-tertiary block">{cat.slug}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (cat: CanonicalCategoryDefinition) => (
        <p className="text-xs text-text-secondary line-clamp-1 max-w-md">
          {cat.description || 'Standard semantic taxonomy domain.'}
        </p>
      ),
    },
    {
      key: 'iconCount',
      header: 'Assigned Icons',
      width: '130px',
      render: (cat: CanonicalCategoryDefinition) => {
        const count = icons.filter((i) => i.primaryCategory === cat.slug || i.category.toLowerCase() === cat.slug).length;
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-primary font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-action-primary" />
            {count.toLocaleString()} icons
          </span>
        );
      },
    },
    {
      key: 'order',
      header: 'Order',
      width: '80px',
      align: 'center' as const,
      render: (cat: CanonicalCategoryDefinition) => <span className="font-mono text-xs text-text-tertiary">{cat.order || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'right' as const,
      render: (cat: CanonicalCategoryDefinition) => (
        <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleOpenEdit(cat)}
            className="px-2 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleInitiateDelete(cat)}
            className="p-1 text-text-tertiary hover:text-rose-500 rounded transition-colors"
            title="Delete Category"
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
          <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Category Taxonomy</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Manage the 44 official canonical categories and custom classification domains.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-action-primary hover:bg-action-primary/90 text-text-inverse rounded-md text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>+</span>
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-4 p-3 bg-bg-surface border border-border-subtle rounded-lg shadow-xs">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-8 pr-3 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-action-primary font-sans"
          />
          <svg
            className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
          {filteredCategories.length} Categories Total
        </span>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredCategories}
        keyExtractor={(item) => item.slug}
        emptyMessage="No categories match your search."
      />

      {/* Create Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Category"
        subtitle="Create a new official taxonomy domain"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCreate}
              className="px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-mono font-semibold"
            >
              Create Category
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCreate} className="space-y-3 py-2">
          <AdminInput
            label="Category Name"
            required
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (!formSlug) setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
            }}
          />
          <AdminInput
            label="Category Slug (lowercase-kebab-case)"
            required
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
          <AdminTextarea
            label="Description"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <AdminInput
            label="Display Ordering Position"
            type="number"
            value={formOrdering}
            onChange={(e) => setFormOrdering(Number(e.target.value))}
          />
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-mono font-semibold"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-3 py-2">
          <AdminInput
            label="Category Name"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <AdminInput
            label="Category Slug"
            readOnly
            value={formSlug}
            helpText="Slugs cannot be modified to protect icon associations"
            className="opacity-80"
          />
          <AdminTextarea
            label="Description"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <AdminInput
            label="Display Ordering Position"
            type="number"
            value={formOrdering}
            onChange={(e) => setFormOrdering(Number(e.target.value))}
          />
        </form>
      </AdminModal>

      {/* Delete / Dependency Warning Modal */}
      <AdminConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Category "${categoryToDelete?.name}"`}
        variant="danger"
        confirmLabel="Confirm Delete"
        message={
          <div className="space-y-3">
            {deleteError ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-500 text-xs font-mono">
                {deleteError}
              </div>
            ) : (
              <p>Are you sure you want to delete the empty category <strong>{categoryToDelete?.name}</strong>?</p>
            )}
          </div>
        }
      />
    </div>
  );
};
