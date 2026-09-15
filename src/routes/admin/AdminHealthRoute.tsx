import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { runCatalogAudit, type VisualOutlier } from '@/features/admin/services/catalogAudit';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const AdminHealthRoute: React.FC = () => {
  const { icons, categories } = useAdminCatalog();
  const auditData = useMemo(() => runCatalogAudit(icons), [icons]);
  const { healthSummary, visualOutliers } = auditData;

  const [selectedOutlier, setSelectedOutlier] = useState<VisualOutlier>(visualOutliers[0]);

  // Compute category-specific health metrics
  const categoryHealthStats = useMemo(() => {
    return categories.map((cat) => {
      const catIcons = icons.filter(
        (i) => i.primaryCategory === cat.slug || i.category.toLowerCase() === cat.slug.toLowerCase()
      );
      const validSvg = catIcons.filter((i) => i.viewBox === '0 0 24 24' && i.svg && i.svg.length >= 10).length;
      const validMeta = catIcons.filter((i) => (i.tags?.length || 0) >= 2 && (i.keywords?.length || 0) >= 1).length;

      const healthScore = catIcons.length
        ? Math.round(((validSvg / catIcons.length) * 0.6 + (validMeta / catIcons.length) * 0.4) * 100)
        : 100;

      return {
        slug: cat.slug,
        name: cat.name,
        count: catIcons.length,
        healthScore,
        validSvg,
        validMeta,
      };
    });
  }, [categories, icons]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-text-primary tracking-tight">
              ICON HEALTH INSPECTOR
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Audit Complete
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Full-spectrum catalog diagnostic covering SVG integrity, stroke weight distribution, and visual outliers.
          </p>
        </div>

        <Link
          to="/admin/svg-repair"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          <span>Open SVG Repair Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Health Dimension Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-sm bg-bg-surface border border-border-subtle">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            SVG Integrity
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{healthSummary.svgIntegrityPercent}%</span>
            <span className="text-[10px] text-text-tertiary">pass rate</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">
            Canonical 24×24 viewBox & closed XML structure
          </p>
        </div>

        <div className="p-4 rounded-sm bg-bg-surface border border-border-subtle">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            Metadata Quality
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">{healthSummary.metadataQualityPercent}%</span>
            <span className="text-[10px] text-text-tertiary">completeness</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">
            Search tags, keywords, and domain taxonomy
          </p>
        </div>

        <div className="p-4 rounded-sm bg-bg-surface border border-border-subtle">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            Variant Coverage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-400">{healthSummary.variantCoveragePercent}%</span>
            <span className="text-[10px] text-text-tertiary">multi-style</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">
            Light, Filled, Duotone authentic source styles
          </p>
        </div>

        <div className="p-4 rounded-sm bg-bg-surface border border-border-subtle">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            Geometric Consistency
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">{healthSummary.consistencyPercent}%</span>
            <span className="text-[10px] text-text-tertiary">aligned</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">
            Stroke widths, cap geometry, and bounding bounds
          </p>
        </div>
      </div>

      {/* Visual Outlier Detector Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              Visual Outlier Detector (Automated Heuristics)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-tertiary">
            Review tool only • Never silently modifies source SVG
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Outlier Selection List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2">
            {visualOutliers.map((outlier) => {
              const isSelected = selectedOutlier.slug === outlier.slug;
              return (
                <div
                  key={outlier.slug}
                  onClick={() => setSelectedOutlier(outlier)}
                  className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-bg-surface border-accent shadow-xs'
                      : 'bg-bg-surface/60 border-border-subtle hover:border-border-default'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded bg-bg-primary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                        <IconPreviewSvg
                          svgContent={outlier.svg}
                          viewBox="0 0 24 24"
                          size={20}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold font-mono text-text-primary truncate">{outlier.name}</h4>
                        <span className="text-[10px] font-mono text-text-tertiary">Category: {outlier.category}</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase font-bold rounded border border-amber-500/30 text-amber-400 bg-amber-500/10">
                      {outlier.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary font-sans mt-2 leading-relaxed">
                    {outlier.issue}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Outlier Diagnostic Specimen Comparison (7 Cols) */}
          <div className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                Outlier Specimen Diagnostic: /{selectedOutlier.slug}
              </span>
              <Link
                to={`/admin/icons/${selectedOutlier.slug}`}
                className="text-xs font-mono font-bold text-accent hover:underline flex items-center gap-1"
              >
                <span>Edit Source</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Side-by-side Visual Comparison Box */}
            <div className="grid grid-cols-2 gap-4">
              {/* Expected Median Baseline */}
              <div className="p-3 bg-bg-primary rounded-xs border border-border-default space-y-2 text-center">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Category Median Baseline
                </span>
                <div className="h-20 flex items-center justify-center text-text-secondary">
                  <IconPreviewSvg
                    svgContent={selectedOutlier.svg}
                    viewBox="0 0 24 24"
                    size={36}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-[11px] font-mono text-text-tertiary border-t border-border-subtle/40 pt-1.5">
                  Standard: <strong className="text-text-primary">{selectedOutlier.expected}</strong>
                </div>
              </div>

              {/* Detected Outlier Geometry */}
              <div className="p-3 bg-bg-primary rounded-xs border border-amber-500/30 space-y-2 text-center">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Detected Outlier Specimen
                </span>
                <div className="h-20 flex items-center justify-center text-amber-300">
                  <IconPreviewSvg
                    svgContent={selectedOutlier.svg}
                    viewBox="0 0 24 24"
                    size={36}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-[11px] font-mono text-text-tertiary border-t border-border-subtle/40 pt-1.5">
                  Detected: <strong className="text-amber-400">{selectedOutlier.actual}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-bg-secondary rounded-xs border border-border-subtle text-xs font-mono text-text-secondary space-y-1">
              <span className="font-bold text-text-primary block">Recommended Action:</span>
              <p className="text-[11px] font-sans">
                Review this icon in the SVG Diagnostic Workspace to adjust stroke calibration or bounds if visual alignment with adjacent category icons is desired.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Health Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
            Category Health Breakdown
          </h2>
          <span className="text-[10px] font-mono text-text-tertiary">
            {categoryHealthStats.length} taxonomy categories audited
          </span>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-sm overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-border-subtle">
            <thead className="bg-bg-primary text-[10px] uppercase text-text-tertiary tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Icon Count</th>
                <th className="px-4 py-2.5">SVG Integrity</th>
                <th className="px-4 py-2.5">Metadata Quality</th>
                <th className="px-4 py-2.5">Health Score</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {categoryHealthStats.map((stat) => (
                <tr key={stat.slug} className="hover:bg-bg-secondary/40 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-text-primary">
                    {stat.name}
                  </td>
                  <td className="px-4 py-2.5 text-text-secondary">
                    {stat.count} concepts
                  </td>
                  <td className="px-4 py-2.5 text-emerald-400">
                    {stat.validSvg} / {stat.count} ({stat.count ? Math.round((stat.validSvg / stat.count) * 100) : 100}%)
                  </td>
                  <td className="px-4 py-2.5 text-blue-400">
                    {stat.validMeta} / {stat.count} ({stat.count ? Math.round((stat.validMeta / stat.count) * 100) : 100}%)
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stat.healthScore >= 95
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : stat.healthScore >= 80
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {stat.healthScore}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to={`/admin/icons?category=${stat.slug}`}
                      className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-default rounded text-[10px] text-text-primary"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
