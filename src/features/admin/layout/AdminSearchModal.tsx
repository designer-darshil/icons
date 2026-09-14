import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { AdminStatusBadge } from '../components/AdminStatusBadge';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { icons, categories, collections } = useAdminCatalog();
  const { users } = useAdminAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { icons: [], categories: [], collections: [], users: [] };

    return {
      icons: icons
        .filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.slug.toLowerCase().includes(q) ||
            i.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 5),
      categories: categories
        .filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
        .slice(0, 3),
      collections: collections
        .filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
        .slice(0, 3),
      users: users
        .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        .slice(0, 3),
    };
  }, [query, icons, categories, collections, users]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  const totalHits =
    results.icons.length + results.categories.length + results.collections.length + results.users.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-bg-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle bg-bg-secondary/40">
          <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons, categories, collections, users..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-text-tertiary bg-bg-surface border border-border-subtle rounded">
            ESC
          </kbd>
        </div>

        {/* Results Box */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border-subtle/50 text-xs">
          {query.trim() && totalHits === 0 ? (
            <div className="py-8 text-center text-text-tertiary font-mono">
              No matches found for &quot;{query}&quot;
            </div>
          ) : !query.trim() ? (
            <div className="py-6 px-4 text-text-tertiary font-mono text-center space-y-1">
              <p>Type to search across the entire GRIDFRAME catalog.</p>
              <p className="text-[11px] text-text-tertiary/70">Navigate with clicks or keyboard.</p>
            </div>
          ) : (
            <>
              {results.icons.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-text-tertiary font-semibold tracking-wider">
                    Icons ({results.icons.length})
                  </div>
                  {results.icons.map((icon) => (
                    <button
                      key={icon.slug}
                      onClick={() => handleSelect(`/admin/icons/${icon.slug}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-secondary text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded bg-bg-secondary p-1 flex items-center justify-center text-text-primary"
                          dangerouslySetInnerHTML={{
                            __html: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">${icon.svg}</svg>`,
                          }}
                        />
                        <div>
                          <p className="font-medium text-text-primary group-hover:text-action-primary">{icon.name}</p>
                          <p className="text-[11px] text-text-tertiary font-mono">{icon.slug}</p>
                        </div>
                      </div>
                      <AdminStatusBadge status={icon.status || 'published'} size="sm" />
                    </button>
                  ))}
                </div>
              )}

              {results.categories.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-text-tertiary font-semibold tracking-wider">
                    Categories ({results.categories.length})
                  </div>
                  {results.categories.map((cat) => {
                    const count = icons.filter((i) => i.primaryCategory === cat.slug || i.category.toLowerCase() === cat.slug.toLowerCase()).length;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => handleSelect(`/admin/categories?highlight=${cat.slug}`)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-secondary text-left transition-colors"
                      >
                        <span className="font-medium text-text-primary">{cat.name}</span>
                        <span className="text-[11px] font-mono text-text-tertiary">{count} icons</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {results.collections.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-text-tertiary font-semibold tracking-wider">
                    Collections ({results.collections.length})
                  </div>
                  {results.collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleSelect(`/admin/collections?id=${col.id}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-secondary text-left transition-colors"
                    >
                      <span className="font-medium text-text-primary">{col.name}</span>
                      <span className="text-[11px] font-mono text-text-tertiary">{col.iconSlugs.length} icons</span>
                    </button>
                  ))}
                </div>
              )}

              {results.users.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-text-tertiary font-semibold tracking-wider">
                    Users ({results.users.length})
                  </div>
                  {results.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelect(`/admin/users`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-bg-secondary text-left transition-colors"
                    >
                      <div>
                        <span className="font-medium text-text-primary">{u.name}</span>
                        <span className="text-[11px] text-text-tertiary ml-2 font-mono">({u.email})</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-bg-secondary rounded border border-border-subtle text-text-secondary">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
