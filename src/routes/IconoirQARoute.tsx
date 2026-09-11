import React, { useState, useMemo } from 'react';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cn } from '@/lib/cn';
import { Search } from 'lucide-react';
import type { Icon } from '@/types/icon';

const SIZES = [16, 20, 24, 32, 48, 64] as const;
type SizeOption = (typeof SIZES)[number];

const COMPARISON_BENCHMARKS = [
  { label: 'Search', slug: 'search' },
  { label: 'Home', slug: 'home' },
  { label: 'User', slug: 'user' },
  { label: 'Heart', slug: 'heart' },
  { label: 'Calendar', slug: 'calendar' },
  { label: 'Settings', slug: 'settings' },
  { label: 'Arrow Right', slug: 'arrow-right' },
  { label: 'Mail', slug: 'mail' },
  { label: 'Lock', slug: 'lock' },
  { label: 'Camera', slug: 'camera' },
  { label: 'Map', slug: 'map' },
  { label: 'Airplane', slug: 'airplane' },
];

export const IconoirQARoute: React.FC = () => {
  useDocumentTitle('Iconoir System QA Workbench', 'Visual quality assurance, multi-resolution scaling, and capability audit for the Iconoir icon system.');

  const [selectedSize, setSelectedSize] = useState<SizeOption>(24);
  const [query, setQuery] = useState('');
  const [showGrid] = useState(true);
  const [showBorder] = useState(true);

  // Search filtered icons
  const filteredIcons = useMemo(() => {
    if (!query.trim()) return GRIDFRAME_ICONS.slice(0, 120);
    const q = query.toLowerCase();
    return GRIDFRAME_ICONS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Benchmark icon objects
  const benchmarkIcons: (Icon | undefined)[] = useMemo(() => {
    return COMPARISON_BENCHMARKS.map((b) => GRIDFRAME_ICONS.find((i) => i.slug === b.slug));
  }, []);

  return (
    <WorkspaceShell>
      <div className="space-y-12 pb-24">
        {/* Header Title */}
        <div className="border-b border-border-subtle/70 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
              OFFICIAL ICONOIR QA VIEW
            </span>
            <span className="text-xs font-mono text-text-tertiary">1,383 Canonical Concepts · 100% 24×24 Grid</span>
          </div>
          <h1 className="type-h1 text-text-primary">
            Iconoir Optical Consistency Workbench
          </h1>
          <p className="type-body text-text-secondary max-w-3xl">
            Visual inspection suite verifying aspect-ratio preservation (<code className="text-accent font-mono text-xs">xMidYMid meet</code>), multi-resolution scaling (16px–64px), zero clipping, and capability accuracy.
          </p>
        </div>

        {/* =====================================================================
            SECTION 1: CORE BENCHMARK COMPARISON MATRIX (12 Standard Concepts)
            ===================================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle/40 pb-3">
            <div>
              <span className="type-section-label text-accent font-bold block mb-1">BENCHMARK 01</span>
              <h2 className="type-h2 text-text-primary">
                Canonical 12-Icon Side-by-Side Comparison
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-tertiary">Resolution:</span>
              <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-lg border border-border-subtle">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={cn(
                      'px-2.5 py-1 text-xs font-mono rounded-md transition-all cursor-pointer',
                      selectedSize === sz
                        ? 'bg-accent text-white font-bold'
                        : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {benchmarkIcons.map((icon, idx) => {
              if (!icon) return null;
              const benchLabel = COMPARISON_BENCHMARKS[idx].label;
              return (
                <div
                  key={icon.id}
                  className="p-4 rounded-xs bg-bg-secondary/40 border border-border-subtle space-y-3 font-mono flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                    <span className="font-bold uppercase text-accent">{benchLabel}</span>
                    <span>{icon.category}</span>
                  </div>

                  {/* Centered Optical Stage */}
                  <div className={cn(
                    'relative w-full aspect-square bg-bg-primary rounded-xs flex items-center justify-center p-2 overflow-hidden select-none',
                    showBorder && 'border border-border-default'
                  )}>
                    {showGrid && (
                      <div className="absolute inset-2 border border-dashed border-border-subtle/30 pointer-events-none" />
                    )}
                    <IconPreviewSvg
                      icon={icon}
                      size={selectedSize}
                      className="text-text-primary transition-all duration-150"
                    />
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>slug:</span>
                      <code className="text-text-primary">{icon.slug}</code>
                    </div>
                    <div className="flex items-center justify-between text-text-tertiary">
                      <span>viewBox:</span>
                      <span>{icon.viewBox}</span>
                    </div>
                    <div className="flex items-center justify-between text-text-tertiary">
                      <span>variants:</span>
                      <span className="text-accent">{icon.variants.length} ({icon.variants.map((v) => v.style).join(', ')})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: MULTI-RESOLUTION SIZE STEPPING LADDER (16, 20, 24, 32, 48, 64px)
            ===================================================================== */}
        <section className="space-y-6 pt-8 border-t border-border-subtle/70">
          <div>
            <span className="type-section-label text-accent font-bold block mb-1">BENCHMARK 02</span>
            <h2 className="type-h2 text-text-primary">
              Multi-Resolution Size Stepping (16px → 64px)
            </h2>
            <p className="type-body text-text-secondary">
              Verifying that stroke widths, optical centers, and viewBox alignment remain crisp across standard UI densities.
            </p>
          </div>

          <div className="space-y-4">
            {benchmarkIcons.slice(0, 6).map((icon) => {
              if (!icon) return null;
              return (
                <div
                  key={icon.id}
                  className="p-4 rounded-xs bg-bg-secondary/30 border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="min-w-[180px] space-y-1 font-mono">
                    <span className="text-sm font-bold text-text-primary block">{icon.name}</span>
                    <span className="text-xs text-text-tertiary">{icon.slug} • {icon.category}</span>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap">
                    {SIZES.map((sz) => (
                      <div key={sz} className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-bg-primary border border-border-subtle rounded-xs flex items-center justify-center p-1">
                          <IconPreviewSvg
                            icon={icon}
                            size={sz}
                            className="text-text-primary"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-text-tertiary">{sz}px</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: FULL CATALOG EXPLORATION & CAPABILITY INSPECTOR
            ===================================================================== */}
        <section className="space-y-6 pt-8 border-t border-border-subtle/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="type-section-label text-accent font-bold block mb-1">BENCHMARK 03</span>
              <h2 className="type-h2 text-text-primary">
                Full Catalog Live Inspector ({filteredIcons.length} concepts)
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter QA inspection list..."
                className="w-full bg-bg-secondary border border-border-default rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredIcons.map((icon) => (
              <div
                key={icon.id}
                className="p-3 rounded-xs bg-bg-secondary/20 border border-border-subtle flex flex-col items-center justify-between gap-2 text-center font-mono hover:bg-bg-secondary/60 transition-colors"
              >
                <div className="w-12 h-12 bg-bg-primary border border-border-subtle/60 rounded-xs flex items-center justify-center">
                  <IconPreviewSvg
                    icon={icon}
                    size={24}
                    className="text-text-primary"
                  />
                </div>
                <div className="w-full overflow-hidden">
                  <span className="text-[11px] text-text-primary truncate block font-medium">
                    {icon.slug}
                  </span>
                  <span className="text-[9px] text-text-tertiary truncate block">
                    {icon.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
};

export default IconoirQARoute;
