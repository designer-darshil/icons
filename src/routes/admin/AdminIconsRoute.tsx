import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminCatalog, type AdminIcon } from '@/features/admin/context/AdminCatalogContext';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminPagination } from '@/features/admin/components/AdminPagination';
import { AdminModal, AdminConfirmModal } from '@/features/admin/components/AdminModal';
import { AdminSelect } from '@/features/admin/components/AdminFormControls';

export const AdminIconsRoute: React.FC = () => {
  const { icons, categories, collections, bulkUpdateStatus, bulkUpdateCategory, deleteIcon } = useAdminCatalog();
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Selection States
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  // Action Modals
  const [iconToDelete, setIconToDelete] = useState<AdminIcon | null>(null);
  const [deleteWarnings, setDeleteWarnings] = useState<string[]>([]);
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const [bulkTargetCategory, setBulkTargetCategory] = useState(categories[0]?.slug || 'actions');

  // Filtered dataset
  const filteredIcons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return icons.filter((icon) => {
      // Search
      if (q) {
        const matchesName = icon.name.toLowerCase().includes(q);
        const matchesSlug = icon.slug.toLowerCase().includes(q);
        const matchesTag = icon.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesKeyword = icon.keywords?.some((k) => k.toLowerCase().includes(q));
        if (!matchesName && !matchesSlug && !matchesTag && !matchesKeyword) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCat =
          icon.primaryCategory === selectedCategory ||
          icon.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCat) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const currentStatus = icon.status || 'published';
        if (currentStatus !== selectedStatus) return false;
      }

      // Variant style filter
      if (selectedStyle !== 'all') {
        const hasVariant = icon.variants?.some((v) => v.style === selectedStyle);
        if (!hasVariant) return false;
      }

      return true;
    });
  }, [icons, searchQuery, selectedCategory, selectedStatus, selectedStyle]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredIcons.length / pageSize);
  const paginatedIcons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIcons.slice(start, start + pageSize);
  }, [filteredIcons, currentPage, pageSize]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSlugs(new Set(paginatedIcons.map((i) => i.slug)));
    } else {
      setSelectedSlugs(new Set());
    }
  };

  const handleSelectRow = (slug: string, checked: boolean) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (checked) next.add(slug);
      else next.delete(slug);
      return next;
    });
  };

  // Bulk Action Triggers
  const handleBulkPublish = () => {
    bulkUpdateStatus(Array.from(selectedSlugs), 'published');
    setSelectedSlugs(new Set());
  };

  const handleBulkArchive = () => {
    bulkUpdateStatus(Array.from(selectedSlugs), 'archived');
    setSelectedSlugs(new Set());
  };

  const handleConfirmBulkCategory = () => {
    bulkUpdateCategory(Array.from(selectedSlugs), bulkTargetCategory);
    setIsBulkCategoryModalOpen(false);
    setSelectedSlugs(new Set());
  };

  // Single Delete Trigger
  const handleInitiateDelete = (icon: AdminIcon) => {
    const colRefs = collections.filter((c) => c.iconSlugs.includes(icon.slug));
    const warns: string[] = [];
    if (colRefs.length > 0) {
      warns.push(`Referenced in ${colRefs.length} collection(s): ${colRefs.map((c) => c.name).join(', ')}`);
    }
    setDeleteWarnings(warns);
    setIconToDelete(icon);
  };

  const handleConfirmDelete = () => {
    if (iconToDelete) {
      deleteIcon(iconToDelete.slug);
      setIconToDelete(null);
    }
  };

  const columns = [
    {
      key: 'preview',
      header: 'Icon',
      width: '56px',
      render: (icon: AdminIcon) => (
        <div
          className="w-8 h-8 rounded bg-bg-secondary p-1.5 flex items-center justify-center text-text-primary border border-border-subtle"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">${icon.svg}</svg>`,
          }}
        />
      ),
    },
    {
      key: 'name',
      header: 'Name & Slug',
      render: (icon: AdminIcon) => (
        <div className="min-w-0">
          <Link
            to={`/admin/icons/${icon.slug}`}
            className="font-semibold text-text-primary hover:text-action-primary transition-colors block truncate"
          >
            {icon.name}
          </Link>
          <span className="text-[11px] font-mono text-text-tertiary block truncate">{icon.slug}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (icon: AdminIcon) => (
        <span className="inline-block px-2 py-0.5 bg-bg-secondary text-text-secondary text-[11px] font-mono rounded border border-border-subtle">
          {icon.category}
        </span>
      ),
    },
    {
      key: 'variants',
      header: 'Variants',
      render: (icon: AdminIcon) => {
        return (
          <div className="flex items-center gap-1 font-mono text-[10px]">
            {['light', 'regular', 'filled', 'duotone', 'duotone-line'].map((st) => {
              const has = icon.variants?.some((v) => v.style === st);
              const label = st === 'duotone-line' ? 'DL' : st.charAt(0).toUpperCase();
              return (
                <span
                  key={st}
                  title={`${st} style ${has ? 'available' : 'missing'}`}
                  className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                    has
                      ? 'bg-action-primary/10 text-action-primary border border-action-primary/20'
                      : 'bg-bg-secondary text-text-tertiary/40 border border-border-subtle'
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (icon: AdminIcon) => <AdminStatusBadge status={icon.status || 'published'} size="sm" />,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      width: '100px',
      render: (icon: AdminIcon) => <span className="font-mono text-[11px] text-text-tertiary">{icon.updatedAt || '2026-09-14'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'right' as const,
      render: (icon: AdminIcon) => (
        <div className="flex items-center justify-end gap-1 font-mono text-[11px]">
          <Link
            to={`/admin/icons/${icon.slug}`}
            className="px-2 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => handleInitiateDelete(icon)}
            className="p-1 text-text-tertiary hover:text-rose-500 rounded transition-colors"
            title="Delete / Archive"
          >
            🗑
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Icons Directory</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Manage {icons.length.toLocaleString()} canonical icons, metadata, and 5-style variant families.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-3 py-1.5 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary transition-colors"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-3.5 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by name, slug, tag..."
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary focus:outline-none focus:border-action-primary"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary focus:outline-none focus:border-action-primary"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Variant Style Filter */}
          <select
            value={selectedStyle}
            onChange={(e) => {
              setSelectedStyle(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary focus:outline-none focus:border-action-primary"
          >
            <option value="all">All Variant Styles</option>
            <option value="regular">Regular (2.0px)</option>
            <option value="light">Light (1.5px)</option>
            <option value="filled">Filled (Solid)</option>
            <option value="duotone">Duotone (2-Tone)</option>
            <option value="duotone-line">Duotone Line</option>
          </select>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedSlugs.size > 0 && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-action-primary/10 border border-action-primary/20 rounded-md animate-in fade-in">
            <span className="text-xs font-mono text-action-primary font-semibold">
              {selectedSlugs.size} icon(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkPublish}
                className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-xs font-mono text-text-primary transition-colors"
              >
                Publish Selected
              </button>
              <button
                type="button"
                onClick={handleBulkArchive}
                className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-xs font-mono text-text-primary transition-colors"
              >
                Archive Selected
              </button>
              <button
                type="button"
                onClick={() => setIsBulkCategoryModalOpen(true)}
                className="px-2.5 py-1 bg-action-primary text-text-inverse rounded text-xs font-mono font-medium hover:bg-action-primary/90 transition-colors"
              >
                Reassign Category
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={paginatedIcons}
        keyExtractor={(item) => item.slug}
        selectedKeys={selectedSlugs}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        emptyMessage="No icons match your filter criteria."
      />

      {/* Pagination Bar */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredIcons.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setCurrentPage(1);
        }}
      />

      {/* Bulk Category Modal */}
      <AdminModal
        isOpen={isBulkCategoryModalOpen}
        onClose={() => setIsBulkCategoryModalOpen(false)}
        title="Bulk Reassign Category"
        subtitle={`Reassign ${selectedSlugs.size} selected icons to a new primary category`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsBulkCategoryModalOpen(false)}
              className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBulkCategory}
              className="px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-mono font-semibold"
            >
              Apply to {selectedSlugs.size} Icons
            </button>
          </>
        }
      >
        <div className="space-y-3 py-2">
          <AdminSelect
            label="Target Primary Category"
            value={bulkTargetCategory}
            onChange={(e) => setBulkTargetCategory(e.target.value)}
            options={categories.map((c) => ({ value: c.slug, label: `${c.name} (${c.slug})` }))}
          />
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!iconToDelete}
        onClose={() => setIconToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Icon "${iconToDelete?.name}"`}
        variant="danger"
        confirmLabel="Confirm Delete"
        message={
          <div className="space-y-3">
            <p>
              Are you sure you want to delete the icon concept <strong>{iconToDelete?.slug}</strong>?
            </p>
            {deleteWarnings.length > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-500 font-mono space-y-1">
                <p className="font-bold">Dependencies Detected:</p>
                <ul className="list-disc list-inside">
                  {deleteWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-text-tertiary">
              Tip: Consider changing status to <strong>Archived</strong> instead of permanently removing the concept.
            </p>
          </div>
        }
      />
    </div>
  );
};
