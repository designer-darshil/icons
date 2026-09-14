import React from 'react';

interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  selectedKeys?: Set<string>;
  onSelectAll?: (selected: boolean) => void;
  onSelectRow?: (key: string, selected: boolean) => void;
  className?: string;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found.',
  selectedKeys,
  onSelectAll,
  onSelectRow,
  className = '',
}: AdminTableProps<T>) {
  const isSelectable = !!(selectedKeys && onSelectRow);
  const allSelected = isSelectable && data.length > 0 && data.every((d) => selectedKeys.has(keyExtractor(d)));
  const someSelected = isSelectable && data.some((d) => selectedKeys.has(keyExtractor(d))) && !allSelected;

  return (
    <div className={`w-full overflow-hidden border border-border-subtle rounded-lg bg-bg-surface ${className}`}>
      {/* Scrollable Container owned by table with zero page overflow */}
      <div className="w-full overflow-x-auto max-w-full">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-bg-secondary/70 border-b border-border-subtle font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
              {isSelectable && (
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="rounded border-border-subtle text-action-primary focus:ring-0 cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 font-semibold ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (isSelectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-text-tertiary font-mono"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-action-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (isSelectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-text-tertiary font-mono"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys?.has(key);

                return (
                  <tr
                    key={key}
                    className={`hover:bg-bg-secondary/40 transition-colors ${
                      isSelected ? 'bg-action-primary/5' : ''
                    }`}
                  >
                    {isSelectable && (
                      <td className="w-10 px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow?.(key, e.target.checked)}
                          className="rounded border-border-subtle text-action-primary focus:ring-0 cursor-pointer"
                          aria-label={`Select row ${key}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-2.5 text-text-secondary align-middle ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render ? col.render(item, idx) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
