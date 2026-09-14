import React from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 200],
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-bg-secondary/30 border-t border-border-subtle text-xs text-text-secondary font-mono">
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-text-primary">{startItem.toLocaleString()}</strong> to{' '}
          <strong className="text-text-primary">{endItem.toLocaleString()}</strong> of{' '}
          <strong className="text-text-primary">{totalItems.toLocaleString()}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <label htmlFor="admin-page-size" className="text-text-tertiary">Per page:</label>
            <select
              id="admin-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-bg-surface border border-border-subtle rounded px-2 py-0.5 text-text-primary focus:outline-none focus:border-action-primary text-xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="px-2 py-1 bg-bg-surface border border-border-subtle rounded hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          ««
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 bg-bg-surface border border-border-subtle rounded hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          Prev
        </button>

        <span className="px-3 py-1 bg-bg-surface border border-border-subtle rounded text-text-primary font-bold">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 bg-bg-surface border border-border-subtle rounded hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="px-2 py-1 bg-bg-surface border border-border-subtle rounded hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          »»
        </button>
      </div>
    </div>
  );
};
