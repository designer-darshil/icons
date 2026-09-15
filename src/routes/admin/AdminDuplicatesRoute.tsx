import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { useAdminActivity } from '@/features/admin/context/AdminActivityContext';
import { runCatalogAudit, type DuplicateGroup } from '@/features/admin/services/catalogAudit';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import {
  CheckCircle2,
  GitMerge,
  ArrowRight,
} from 'lucide-react';

export const AdminDuplicatesRoute: React.FC = () => {
  const { icons, updateIcon } = useAdminCatalog();
  const { logActivity } = useAdminActivity();
  const auditData = useMemo(() => runCatalogAudit(icons), [icons]);
  const [duplicateClusters, setDuplicateClusters] = useState<DuplicateGroup[]>(auditData.duplicateGroups);
  const [activeClusterId, setActiveClusterId] = useState<string>(duplicateClusters[0]?.id || '');
  const [mergeFeedback, setMergeFeedback] = useState<string | null>(null);

  const activeCluster = duplicateClusters.find((c) => c.id === activeClusterId) || duplicateClusters[0];

  // Action: Merge Duplicates into Primary Canonical Concept
  const handleMergeCluster = (cluster: DuplicateGroup) => {
    const primary = cluster.icons[0];
    const secondary = cluster.icons[1];

    if (!primary || !secondary) return;

    // Add secondary slug as alias/keyword to primary icon
    const targetIcon = icons.find((i) => i.slug === primary.slug);
    if (targetIcon) {
      const mergedAliases = Array.from(new Set([...(targetIcon.aliases || []), secondary.slug, secondary.name.toLowerCase()]));
      const mergedKeywords = Array.from(new Set([...(targetIcon.keywords || []), secondary.slug, secondary.name.toLowerCase()]));
      updateIcon(primary.slug, {
        aliases: mergedAliases,
        keywords: mergedKeywords,
      });
    }

    logActivity({
      actor: 'Admin',
      action: 'Duplicates Merged',
      target: `/${primary.slug}`,
      category: 'icons',
      status: 'success',
      details: `Merged duplicate concept /${secondary.slug} into canonical /${primary.slug}`,
    });

    // Remove from active cluster queue
    setDuplicateClusters((prev) => prev.filter((c) => c.id !== cluster.id));
    setMergeFeedback(`✓ Successfully merged /${secondary.slug} into canonical /${primary.slug}`);
    setTimeout(() => setMergeFeedback(null), 3000);
  };

  // Action: Ignore Duplicate Warning
  const handleIgnoreCluster = (clusterId: string) => {
    setDuplicateClusters((prev) => prev.filter((c) => c.id !== clusterId));
    setMergeFeedback(`Marked cluster as distinct canonical concepts`);
    setTimeout(() => setMergeFeedback(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              SMART DUPLICATE CENTER
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              {duplicateClusters.length} Clusters Detected
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Identify synonymous concepts and geometric twins with non-destructive aliasing and canonical redirection.
          </p>
        </div>

        <Link
          to="/admin/taxonomy"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg-surface hover:bg-bg-secondary border border-border-default rounded-sm text-xs text-text-primary transition-colors cursor-pointer"
        >
          <span>Taxonomy & Aliases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Split Layout */}
      {duplicateClusters.length === 0 ? (
        <div className="p-12 text-center bg-bg-surface border border-border-subtle rounded-sm space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h2 className="text-sm font-bold text-text-primary">No Unresolved Duplicates</h2>
          <p className="text-xs text-text-tertiary font-sans">
            The catalog has zero pending duplicate clusters. All synonymous concepts are properly aliased.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Cluster List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between pb-1 text-xs">
              <span className="font-bold uppercase text-text-secondary">
                Duplicate Groups ({duplicateClusters.length})
              </span>
              <span className="text-[10px] text-text-tertiary">Select to resolve</span>
            </div>

            <div className="space-y-2">
              {duplicateClusters.map((cluster) => {
                const isSelected = cluster.id === activeCluster?.id;
                return (
                  <div
                    key={cluster.id}
                    onClick={() => setActiveClusterId(cluster.id)}
                    className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-bg-surface border-accent shadow-xs'
                        : 'bg-bg-surface/60 border-border-subtle hover:border-border-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary text-xs">
                          {cluster.icons.map((i) => i.name).join(' ↔ ')}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded">
                        {cluster.similarityScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary font-sans mt-1.5">
                      {cluster.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Duplicate Resolution & Comparison Workbench (7 Cols) */}
          {activeCluster && (
            <div className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2.5 text-xs">
                  <div>
                    <h3 className="font-bold text-text-primary uppercase tracking-wider">
                      Cluster Resolution Workbench
                    </h3>
                    <span className="text-[10px] text-text-tertiary">
                      Similarity: {activeCluster.similarityScore}% • {activeCluster.reason}
                    </span>
                  </div>
                </div>

                {/* Candidate Side-by-Side Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCluster.icons.map((cand, idx) => (
                    <div
                      key={cand.slug}
                      className="p-4 bg-bg-primary rounded-xs border border-border-default space-y-3 text-center"
                    >
                      <span className="text-[10px] uppercase font-bold text-text-tertiary block">
                        {idx === 0 ? 'Primary Concept (A)' : 'Secondary Concept (B)'}
                      </span>

                      <div className="h-20 flex items-center justify-center text-text-primary">
                        <IconPreviewSvg
                          svgContent={cand.svg}
                          viewBox="0 0 24 24"
                          size={40}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="border-t border-border-subtle/40 pt-2 space-y-0.5">
                        <h4 className="text-xs font-bold text-text-primary">{cand.name}</h4>
                        <span className="text-[10px] text-text-tertiary block">/{cand.slug}</span>
                        <span className="text-[10px] text-text-secondary block">
                          Category: {cand.category} • {cand.variantCount} variants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback message banner */}
                {mergeFeedback && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center rounded animate-in fade-in">
                    {mergeFeedback}
                  </div>
                )}

                <div className="p-3 bg-bg-secondary rounded-xs border border-border-subtle text-xs text-text-secondary space-y-1">
                  <span className="font-bold text-text-primary block">Merge Behavior:</span>
                  <p className="text-[11px] font-sans">
                    Merging keeps Concept A as canonical, registers Concept B as a searchable alias, preserves bookmarks/favorites, and creates an audit record.
                  </p>
                </div>
              </div>

              {/* Action Resolution Toolbar */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleIgnoreCluster(activeCluster.id)}
                  className="px-3 py-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-default rounded text-xs text-text-secondary cursor-pointer transition-colors"
                >
                  Keep Both (Ignore Warning)
                </button>

                <button
                  type="button"
                  onClick={() => handleMergeCluster(activeCluster)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg font-bold text-xs rounded uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Merge into Canonical Concept</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
