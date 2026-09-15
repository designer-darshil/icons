import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { Search, Sparkles, Wrench, Copy, Grid, Tag, Layers, Activity, Plus, ShieldCheck, Database } from 'lucide-react';

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { icons } = useAdminCatalog();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const baseCommands = [
    {
      id: 'cmd-new-icon',
      title: 'Add New SVG Icon',
      subtitle: 'Upload, validate, and preview new SVG concept',
      category: 'Actions',
      icon: <Plus className="w-4 h-4 text-accent" />,
      action: () => navigate('/admin/icons/new'),
    },
    {
      id: 'cmd-health',
      title: 'Icon Health Inspector',
      subtitle: 'Audit SVG integrity, stroke weights, and category coverage',
      category: 'Diagnostics',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => navigate('/admin/health'),
    },
    {
      id: 'cmd-svg-repair',
      title: 'SVG Repair Center',
      subtitle: 'Fix viewBox anomalies, broken paths, and stroke clipping',
      category: 'Diagnostics',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      action: () => navigate('/admin/svg-repair'),
    },
    {
      id: 'cmd-duplicates',
      title: 'Smart Duplicate Center',
      subtitle: 'Detect, review, and merge synonymous icon concepts',
      category: 'Intelligence',
      icon: <Copy className="w-4 h-4 text-blue-400" />,
      action: () => navigate('/admin/duplicates'),
    },
    {
      id: 'cmd-coverage',
      title: 'Category Coverage & Gap Map',
      subtitle: 'Inspect category health and missing domain concepts',
      category: 'Intelligence',
      icon: <Grid className="w-4 h-4 text-purple-400" />,
      action: () => navigate('/admin/coverage'),
    },
    {
      id: 'cmd-set-builder',
      title: 'Curated Set Builder',
      subtitle: 'Generate and curate domain icon sets with consistency scoring',
      category: 'Creation',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => navigate('/admin/set-builder'),
    },
    {
      id: 'cmd-taxonomy',
      title: 'Semantic Taxonomy Editor',
      subtitle: 'Manage canonical aliases, keywords, and semantic roles',
      category: 'Organization',
      icon: <Tag className="w-4 h-4 text-rose-400" />,
      action: () => navigate('/admin/taxonomy'),
    },
    {
      id: 'cmd-sources',
      title: 'Source Library Management',
      subtitle: 'Manage Iconoir, uploads, licensing, and upstream syncs',
      category: 'System',
      icon: <Database className="w-4 h-4 text-cyan-400" />,
      action: () => navigate('/admin/sources'),
    },
    {
      id: 'cmd-activity',
      title: 'Audit Log & Activity Timeline',
      subtitle: 'Review recent publishing, edits, and administrative actions',
      category: 'System',
      icon: <ShieldCheck className="w-4 h-4 text-text-tertiary" />,
      action: () => navigate('/admin/activity'),
    },
  ];

  // Dynamic icon search results
  const matchingIcons = query.trim().length > 1
    ? icons
        .filter((icon) =>
          icon.name.toLowerCase().includes(query.toLowerCase()) ||
          icon.slug.toLowerCase().includes(query.toLowerCase()) ||
          (icon.tags && icon.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
        )
        .slice(0, 6)
        .map((icon) => ({
          id: `icon-${icon.slug}`,
          title: icon.name,
          subtitle: `/${icon.slug} • ${icon.category} • ${icon.variants?.length || 1} variants`,
          category: 'Icons',
          icon: <Sparkles className="w-4 h-4 text-accent" />,
          action: () => navigate(`/admin/icons/${icon.slug}`),
        }))
    : [];

  const filteredCommands = query.trim()
    ? [
        ...baseCommands.filter((c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
        ),
        ...matchingIcons,
      ]
    : baseCommands;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div
        className="w-full max-w-2xl bg-bg-secondary border border-border-strong rounded-sm shadow-dropdown overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Command Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-primary">
          <Search className="w-4 h-4 text-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search 2,184+ icons (e.g. 'health', 'repair', 'user', 'trash')..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-tertiary bg-bg-secondary border border-border-default rounded">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-border-subtle/40">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-tertiary font-mono">
              No matching admin commands or icons found for "{query}".
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-accent/10 border-l-2 border-accent text-text-primary' : 'hover:bg-bg-primary/50 text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="text-xs font-semibold font-mono text-text-primary truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-text-tertiary font-sans truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-text-tertiary uppercase tracking-wider bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle ml-2">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-bg-surface border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>Gridframe Operations Studio 2.0</span>
        </div>
      </div>
    </div>
  );
};
