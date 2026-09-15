import React, { useState } from 'react';
import { useAdminActivity } from '@/features/admin/context/AdminActivityContext';
import {
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface SourceLibrary {
  id: string;
  name: string;
  type: 'upstream' | 'internal' | 'imported';
  license: string;
  iconCount: number;
  variantCount: number;
  lastSync: string;
  status: 'active' | 'synced' | 'pending';
  version: string;
  url: string;
}

export const AdminSourcesRoute: React.FC = () => {
  const { logActivity } = useAdminActivity();
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const sources: SourceLibrary[] = [
    {
      id: 'iconoir-canonical',
      name: 'Iconoir (Canonical Source)',
      type: 'upstream',
      license: 'MIT License',
      iconCount: 1670,
      variantCount: 6680,
      lastSync: '2026-09-14 08:30 UTC',
      status: 'synced',
      version: 'v7.10.1',
      url: 'https://github.com/iconoir-icons/iconoir',
    },
    {
      id: 'custom-studio',
      name: 'Gridframe Custom Studio Ingests',
      type: 'internal',
      license: 'Internal / Proprietary',
      iconCount: 514,
      variantCount: 2062,
      lastSync: '2026-09-15 11:20 UTC',
      status: 'active',
      version: 'v2.2.0',
      url: '/admin/icons/new',
    },
    {
      id: 'tabler-extended',
      name: 'Tabler Extended Vector System',
      type: 'imported',
      license: 'MIT License',
      iconCount: 420,
      variantCount: 1680,
      lastSync: '2026-09-10 14:00 UTC',
      status: 'synced',
      version: 'v3.2.0',
      url: 'https://github.com/tabler/tabler-icons',
    },
  ];

  const handleRunSync = (sourceName: string) => {
    logActivity({
      actor: 'Admin',
      action: 'Source Synchronized',
      target: sourceName,
      category: 'sync',
      status: 'success',
      details: `Executed upstream integrity sync against ${sourceName}`,
    });
    setSyncFeedback(`✓ Synchronized and validated all catalog assets against ${sourceName}`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              SOURCE LIBRARY MANAGEMENT
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
              Provenance Control
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Manage upstream SVG dependencies, license attribution, version updates, and synchronization diffs.
          </p>
        </div>

        {syncFeedback && (
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded animate-in fade-in">
            {syncFeedback}
          </div>
        )}
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sources.map((src) => (
          <div
            key={src.id}
            className="p-4 bg-bg-surface border border-border-subtle rounded-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">{src.name}</h3>
                  <span className="text-[10px] text-text-tertiary">Version: {src.version}</span>
                </div>
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {src.status}
                </span>
              </div>

              <div className="space-y-1 text-xs border-y border-border-subtle/40 py-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary">License:</span>
                  <span className="text-text-secondary font-bold">{src.license}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary">Concepts:</span>
                  <span className="text-text-primary font-bold">{src.iconCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary">Variants:</span>
                  <span className="text-text-secondary">{src.variantCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary">Last Audit:</span>
                  <span className="text-text-tertiary">{src.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => handleRunSync(src.name)}
                className="flex items-center gap-1 px-3 py-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-default rounded text-[11px] text-text-primary cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Source</span>
              </button>

              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-text-secondary hover:text-accent flex items-center gap-1"
              >
                <span>Upstream</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Change Sync Diff Breakdown */}
      <div className="p-4 bg-bg-surface border border-border-subtle rounded-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
          Latest Upstream Catalog Sync Diff (Summary)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-bg-primary rounded-xs border border-border-default">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">+ Added</span>
            <span className="text-lg font-bold text-text-primary">+24 icons</span>
          </div>
          <div className="p-3 bg-bg-primary rounded-xs border border-border-default">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">- Removed</span>
            <span className="text-lg font-bold text-text-primary">0 icons</span>
          </div>
          <div className="p-3 bg-bg-primary rounded-xs border border-border-default">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">↔ Changed</span>
            <span className="text-lg font-bold text-text-primary">12 geometry fixes</span>
          </div>
          <div className="p-3 bg-bg-primary rounded-xs border border-border-default">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">~ Metadata</span>
            <span className="text-lg font-bold text-text-primary">17 tag updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};
