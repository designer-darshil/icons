import React from 'react';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { AdminCard } from '@/features/admin/components/AdminCard';

export const AdminStylesRoute: React.FC = () => {
  const { icons } = useAdminCatalog();

  const STYLES_INFO = [
    {
      style: 'regular',
      name: 'Regular',
      strokeWidth: '2.0px',
      strokeCap: 'round',
      strokeJoin: 'round',
      description: 'The canonical baseline standard for all GRIDFRAME vector assets. 2px stroke on a 24×24 grid.',
      badge: 'Primary Baseline',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-500',
    },
    {
      style: 'light',
      name: 'Light',
      strokeWidth: '1.5px',
      strokeCap: 'round',
      strokeJoin: 'round',
      description: 'Delicate, refined line weight designed for high-density dashboards, data tables, and compact mobile views.',
      badge: 'Fine Density',
      color: 'border-sky-500/30 bg-sky-500/5 text-sky-500',
    },
    {
      style: 'filled',
      name: 'Filled (Solid)',
      strokeWidth: 'Solid Mass',
      strokeCap: 'N/A',
      strokeJoin: 'N/A',
      description: 'Authentic silhouette geometry with negative space preservation and evenodd rule geometry.',
      badge: 'Solid Silhouette',
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500',
    },
    {
      style: 'duotone',
      name: 'Duotone (2-Tone)',
      strokeWidth: '2.0px + Fill',
      strokeCap: 'round',
      strokeJoin: 'round',
      description: 'Two-tone layer structure combining primary outline with subordinate accent mass at 20% opacity.',
      badge: 'Layered Depth',
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
    },
    {
      style: 'duotone-line',
      name: 'Duotone Line',
      strokeWidth: '1.5px + 3.0px Halo',
      strokeCap: 'round',
      strokeJoin: 'round',
      description: 'Dual-stroke line architecture pairing primary stroke with an optical accent halo layer.',
      badge: 'Dual Stroke',
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-500',
    },
  ];

  // Sample icon for live preview
  const previewIcon = icons.find((i) => i.slug === 'cloud-server') || icons[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-border-subtle">
        <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Canonical Styles & Variants</h2>
        <p className="text-xs text-text-tertiary mt-0.5">
          GRIDFRAME&apos;s strict five-variant system architecture across all {icons.length.toLocaleString()} icon families.
        </p>
      </div>

      {/* Overview Banner */}
      <div className="p-4 bg-bg-surface border border-border-subtle rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs font-mono text-xs">
        <div>
          <span className="font-bold text-text-primary text-sm">Strict Five-Variant Architectural Guarantee</span>
          <p className="text-text-tertiary text-xs mt-0.5 font-sans">
            Every concept family in the catalog is required to provide exactly 5 authentic, coordinated vector variants.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-bold shrink-0">
          ✓ 100% Catalog Coverage
        </span>
      </div>

      {/* Style Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {STYLES_INFO.map((st) => {
          const variantObj = previewIcon?.variants?.find((v) => v.style === st.style) || previewIcon?.variants?.[0];

          return (
            <AdminCard key={st.style} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-sm text-text-primary">{st.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${st.color}`}>
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">{st.description}</p>
                </div>

                {/* Thumbnail Preview */}
                {variantObj && (
                  <div
                    className="w-12 h-12 rounded-lg bg-bg-secondary p-2 flex items-center justify-center text-text-primary shrink-0 border border-border-subtle"
                    dangerouslySetInnerHTML={{
                      __html: `<svg viewBox="${variantObj.viewBox || '0 0 24 24'}" width="32" height="32" fill="none" stroke="currentColor" stroke-width="${variantObj.defaultStrokeWidth ?? 2}">${variantObj.svg}</svg>`,
                    }}
                  />
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle/60 text-[11px] font-mono">
                <div>
                  <span className="text-text-tertiary block">Stroke:</span>
                  <strong className="text-text-primary">{st.strokeWidth}</strong>
                </div>
                <div>
                  <span className="text-text-tertiary block">Cap / Join:</span>
                  <strong className="text-text-primary">{st.strokeCap}</strong>
                </div>
                <div>
                  <span className="text-text-tertiary block">Coverage:</span>
                  <strong className="text-emerald-500">{icons.length.toLocaleString()} icons</strong>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
};
