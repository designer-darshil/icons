import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { useAdminActivity } from '../context/AdminActivityContext';
import {
  Activity,
  Layers,
  Wrench,
  Copy,
  Grid,
  Tag,
  Database,
  ShieldCheck,
  Users,
  Settings,
  PlusCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { icons } = useAdminCatalog();
  const { activities } = useAdminActivity();

  const studioItems = [
    {
      label: 'Operations Home',
      path: '/admin',
      end: true,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: 'Health Inspector',
      path: '/admin/health',
      badge: '97.4%',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      label: 'SVG Repair Center',
      path: '/admin/svg-repair',
      badge: '12',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      label: 'Duplicate Center',
      path: '/admin/duplicates',
      badge: '4',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: <Copy className="w-4 h-4" />,
    },
    {
      label: 'Coverage & Gaps',
      path: '/admin/coverage',
      icon: <Grid className="w-4 h-4" />,
    },
  ];

  const catalogItems = [
    {
      label: 'Catalog Explorer',
      path: '/admin/icons',
      badge: icons.length.toLocaleString(),
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: 'Add SVG Icon',
      path: '/admin/icons/new',
      icon: <PlusCircle className="w-4 h-4 text-accent" />,
    },
    {
      label: 'Curated Set Builder',
      path: '/admin/set-builder',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: 'Taxonomy & Aliases',
      path: '/admin/taxonomy',
      icon: <Tag className="w-4 h-4" />,
    },
    {
      label: 'Sources & Sync',
      path: '/admin/sources',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  const systemItems = [
    {
      label: 'Audit & Activity',
      path: '/admin/activity',
      badge: activities.length > 0 ? activities.length.toString() : undefined,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      label: 'Team & Access',
      path: '/admin/users',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Studio Settings',
      path: '/admin/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-bg-surface border-r border-border-subtle flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-border-subtle flex items-center justify-between gap-3 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center text-accent-fg font-mono font-bold text-xs shadow-xs">
              GF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs tracking-tight text-text-primary group-hover:text-accent transition-colors">
                  OPERATIONS
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-accent/10 text-accent border border-accent/20 rounded font-semibold">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-text-tertiary font-mono">Catalog Control System</p>
            </div>
          </Link>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-text-tertiary hover:text-text-primary rounded cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-mono">
          {/* Section 1: Studio Operations */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] uppercase text-text-tertiary tracking-wider font-semibold">
              Operations & Health
            </div>
            {studioItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70'
                  }`
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono rounded border shrink-0 ${
                      item.badgeColor || 'bg-bg-surface/80 border-border-subtle/60 text-current'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section 2: Catalog Management */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] uppercase text-text-tertiary tracking-wider font-semibold">
              Catalog Management
            </div>
            {catalogItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70'
                  }`
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-bg-surface/80 border border-border-subtle/60 text-current shrink-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section 3: System & Security */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] uppercase text-text-tertiary tracking-wider font-semibold">
              System & Audit
            </div>
            {systemItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70'
                  }`
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-bg-surface/80 border border-border-subtle/60 text-current shrink-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border-subtle bg-bg-secondary/30 shrink-0 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-sm bg-bg-surface border border-border-subtle hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-mono transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Public Live Site</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
          </Link>
          <div className="flex items-center justify-between px-1 text-[10px] text-text-tertiary font-mono">
            <span>GRIDFRAME 2.0</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
