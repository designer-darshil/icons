import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCatalog, type AdminIcon } from '@/features/admin/context/AdminCatalogContext';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminPagination } from '@/features/admin/components/AdminPagination';
import { AdminModal, AdminConfirmModal } from '@/features/admin/components/AdminModal';
import { AdminSelect } from '@/features/admin/components/AdminFormControls';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import {
  LayoutList,
  LayoutGrid,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';

export const AdminIconsRoute: React.FC = () => {
  const { icons, categories, collections, bulkUpdateStatus, bulkUpdateCategory, deleteIcon } = useAdminCatalog();

  // View Mode: Table vs Compact Grid
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [qualityFilter, setQualityFilter] = useState<'all' | 'valid' | 'issues'>('all');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(48);

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

      // Source library filter
      if (selectedSource !== 'all') {
        const src = icon.source?.id || 'iconoir';
        if (src !== selectedSource) return false;
      }

      // Quality filter
      if (qualityFilter === 'issues') {
        const hasViewBoxIssue = icon.viewBox && icon.viewBox !== '0 0 24 24';
        const hasEmptySvg = !icon.svg || icon.svg.length < 10;
        if (!hasViewBoxIssue && !hasEmptySvg) return false;
      } else if (qualityFilter === 'valid') {
        const isGood = icon.viewBox === '0 0 24 24' && icon.svg && icon.svg.length >= 10;
        if (!isGood) return false;
      }

      return true;
    });
  }, [icons, searchQuery, selectedCategory, selectedStatus, selectedStyle, selectedSource, qualityFilter]);

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
        <div className="w-8 h-8 rounded bg-bg-surface p-1 flex items-center justify-center text-text-primary border border-border-subtle">
          <IconPreviewSvg
            svgContent={icon.svg}
            viewBox={icon.viewBox || '0 0 24 24'}
            size={20}
            color="currentColor"
            strokeWidth={1.5}
          />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name & Slug',
      render: (icon: AdminIcon) => (
        <div className="min-w-0">
          <Link
            to={`/admin/icons/${icon.slug}`}
            className="font-semibold text-text-primary hover:text-accent transition-colors block truncate"
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
      key: 'source',
      header: 'Source',
      render: (icon: AdminIcon) => {
        return (
          <div className="font-mono text-[10px]">
            <span className="font-bold text-text-secondary block">
              {icon.source?.name || 'Iconoir'}
            </span>
            <span className="text-text-tertiary">{icon.source?.license || 'MIT'}</span>
          </div>
        );
      },
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
                      ? 'bg-accent/10 text-accent border border-accent/20'
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
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'right' as const,
      render: (icon: AdminIcon) => (
        <div className="flex items-center justify-end gap-1 font-mono text-[11px]">
          <Link
            to={`/admin/icons/${icon.slug}`}
            className="px-2 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => handleInitiateDelete(icon)}
            className="p-1 text-text-tertiary hover:text-rose-500 rounded transition-colors cursor-pointer"
            title="Archive Icon"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-text-primary tracking-tight">
              CATALOG EXPLORER
            </h1>
            <span className="text-xs font-mono text-text-tertiary px-2 py-0.5 rounded bg-bg-surface border border-border-subtle">
              {filteredIcons.length.toLocaleString()} matching
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Filter, inspect, and manage canonical concepts and multi-style SVG assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 bg-bg-surface border border-border-default rounded-sm">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-accent text-accent-fg shadow-xs' : 'text-text-tertiary hover:text-text-primary'
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-accent text-accent-fg shadow-xs' : 'text-text-tertiary hover:text-text-primary'
              }`}
              title="Compact Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            to="/admin/icons/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Icon</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 bg-bg-surface border border-border-subtle rounded-sm space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Instant Search Bar */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, slug, tag, keyword..."
              className="w-full pl-8 pr-3 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Category"
              className="w-full px-2.5 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Status"
              className="w-full px-2.5 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Variant Filter */}
          <div>
            <select
              value={selectedStyle}
              onChange={(e) => {
                setSelectedStyle(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Variant Style"
              className="w-full px-2.5 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Variant Styles</option>
              <option value="regular">Regular</option>
              <option value="light">Light</option>
              <option value="filled">Filled</option>
              <option value="duotone">Duotone</option>
              <option value="duotone-line">Duotone Line</option>
            </select>
          </div>

          {/* Quality State */}
          <div>
            <select
              value={qualityFilter}
              onChange={(e) => {
                setQualityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              aria-label="Filter by Quality Gate"
              className="w-full px-2.5 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Quality States</option>
              <option value="valid">100% Validated (24×24)</option>
              <option value="issues">Has Warnings / Non-24px</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Source"
              className="w-full px-2.5 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Sources</option>
              <option value="iconoir">Iconoir (Canonical)</option>
              <option value="custom">Custom Studio Ingests</option>
              <option value="tabler">Tabler Extended</option>
            </select>
          </div>
        </div>

        {/* Active Bulk Action Bar */}
        {selectedSlugs.size > 0 && (
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-text-primary font-bold">
              {selectedSlugs.size} icon{selectedSlugs.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkPublish}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                Publish Selected
              </button>
              <button
                type="button"
                onClick={() => setIsBulkCategoryModalOpen(true)}
                className="px-2.5 py-1 bg-bg-secondary hover:bg-bg-elevated text-text-primary border border-border-default rounded text-[11px] cursor-pointer transition-colors"
              >
                Assign Category
              </button>
              <button
                type="button"
                onClick={handleBulkArchive}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                Archive Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Table or Compact Grid */}
      {viewMode === 'table' ? (
        <AdminTable<AdminIcon>
          data={paginatedIcons}
          columns={columns}
          keyExtractor={(i) => i.slug}
          selectedKeys={selectedSlugs}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          emptyMessage={
            <div className="py-12 text-center text-xs font-mono text-text-tertiary">
              No matching icons found for the selected filters.
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {paginatedIcons.map((icon) => (
            <Link
              key={icon.slug}
              to={`/admin/icons/${icon.slug}`}
              className="p-3 bg-bg-surface border border-border-subtle hover:border-accent/80 rounded-sm flex flex-col items-center justify-between text-center group transition-all cursor-pointer aspect-square"
            >
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-text-tertiary">
                <span className="truncate">{icon.category}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${icon.status === 'draft' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              </div>

              <div className="w-10 h-10 flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform">
                <IconPreviewSvg
                  svgContent={icon.svg}
                  viewBox={icon.viewBox || '0 0 24 24'}
                  size={28}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </div>

              <div className="w-full truncate">
                <span className="text-[11px] font-mono font-semibold text-text-primary block truncate group-hover:text-accent transition-colors">
                  {icon.name}
                </span>
                <span className="text-[9px] font-mono text-text-tertiary block truncate">
                  {icon.variants?.length || 1} variants
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredIcons.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      {iconToDelete && (
        <AdminConfirmModal
          isOpen={true}
          title={`Archive Icon: /${iconToDelete.slug}`}
          confirmLabel="Archive Icon"
          variant="danger"
          onClose={() => setIconToDelete(null)}
          onConfirm={handleConfirmDelete}
          message={
            <div className="space-y-3 text-xs font-mono text-text-secondary">
              <p>
                Are you sure you want to archive <strong>{iconToDelete.name}</strong>?
              </p>
              {deleteWarnings.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Dependency Warnings:</span>
                  </div>
                  {deleteWarnings.map((w, idx) => (
                    <p key={idx} className="text-[11px]">{w}</p>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-text-tertiary">
                Archiving hides the icon from public search while preserving historical versions, favorites, and analytics.
              </p>
            </div>
          }
        />
      )}

      {/* Bulk Category Modal */}
      {isBulkCategoryModalOpen && (
        <AdminModal
          isOpen={true}
          title={`Assign Category to ${selectedSlugs.size} Icons`}
          onClose={() => setIsBulkCategoryModalOpen(false)}
        >
          <div className="space-y-4 text-xs font-mono">
            <AdminSelect
              label="Target Taxonomy Category"
              value={bulkTargetCategory}
              onChange={(e) => setBulkTargetCategory(e.target.value)}
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setIsBulkCategoryModalOpen(false)}
                className="px-3 py-1.5 bg-bg-surface border border-border-default rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkCategory}
                className="px-4 py-1.5 bg-accent text-accent-fg font-bold rounded uppercase cursor-pointer"
              >
                Update Category
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
