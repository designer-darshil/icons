import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { runCatalogAudit } from '@/features/admin/services/catalogAudit';
import {
  PlusCircle,
  ChevronRight,
} from 'lucide-react';

export const AdminCoverageRoute: React.FC = () => {
  const { icons } = useAdminCatalog();
  const auditData = useMemo(() => runCatalogAudit(icons), [icons]);
  const { coverageMap } = auditData;

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              CATEGORY COVERAGE & GAP MAP
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
              Domain Intelligence
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Identify category density imbalances, weak domains, and missing high-demand software iconography.
          </p>
        </div>

        <Link
          to="/admin/icons/new"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-sm text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Missing Concept</span>
        </Link>
      </div>

      {/* Coverage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coverageMap.map((cov) => {
          const percent = Math.min(100, Math.round((cov.currentCount / cov.recommendedCount) * 100));
          const statusBadge =
            cov.status === 'healthy'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : cov.status === 'needs-attention'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

          return (
            <div
              key={cov.categorySlug}
              className="p-4 bg-bg-surface border border-border-subtle hover:border-border-default rounded-sm space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-primary">{cov.categoryName}</h3>
                  <span className={`px-1.5 py-0.2 text-[9px] uppercase font-bold rounded border ${statusBadge}`}>
                    {cov.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                    <span>{cov.currentCount} / {cov.recommendedCount} concepts</span>
                    <span className="font-bold text-text-primary">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 90 ? 'bg-emerald-400' : percent >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Gap Recommendations */}
                {cov.missingConcepts.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle/40 space-y-1.5">
                    <span className="text-[10px] uppercase text-text-tertiary font-bold block">
                      Recommended Domain Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cov.missingConcepts.map((gap) => (
                        <Link
                          key={gap}
                          to={`/admin/icons/new?name=${encodeURIComponent(gap.replace(/-/g, ' '))}`}
                          className="px-1.5 py-0.5 bg-bg-primary hover:bg-accent/10 border border-border-subtle hover:border-accent text-[10px] text-text-secondary hover:text-accent rounded transition-colors"
                        >
                          + {gap}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px]">
                <Link
                  to={`/admin/icons?category=${cov.categorySlug}`}
                  className="text-text-secondary hover:text-text-primary flex items-center gap-1 hover:underline"
                >
                  <span>Browse Category</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
