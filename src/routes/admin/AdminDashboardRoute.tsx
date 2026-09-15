import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { useAdminActivity } from '@/features/admin/context/AdminActivityContext';
import { runCatalogAudit, type AttentionIssue } from '@/features/admin/services/catalogAudit';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import {
  Activity,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Check,
  X,
  Edit,
  Eye,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardRoute: React.FC = () => {
  const navigate = useNavigate();
  const { icons, publishIcon, unpublishIcon } = useAdminCatalog();
  const { activities, logActivity } = useAdminActivity();

  // Run Catalog Audit
  const [auditData, setAuditData] = useState(() => runCatalogAudit(icons));
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [activePreviewIconSlug, setActivePreviewIconSlug] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // Recalculate audit when icons change
  useEffect(() => {
    setAuditData(runCatalogAudit(icons));
  }, [icons]);

  const { healthSummary, attentionIssues } = auditData;
  const currentIssue: AttentionIssue | undefined = attentionIssues[selectedIssueIndex];
  const activeIcon = activePreviewIconSlug
    ? icons.find((i) => i.slug === activePreviewIconSlug)
    : icons.find((i) => currentIssue?.iconSlugs?.includes(i.slug)) || icons[0];

  // Quick Action Handlers for One-Click Review
  const handleApprove = (slug: string) => {
    publishIcon(slug);
    logActivity({
      actor: 'Admin',
      action: 'Icon Approved',
      target: `/${slug}`,
      category: 'icons',
      status: 'success',
      details: `Approved and published icon /${slug} via Operations Studio`,
    });
    setReviewFeedback(`✓ Approved and published /${slug}`);
    setTimeout(() => setReviewFeedback(null), 2000);
  };

  const handleReject = (slug: string) => {
    unpublishIcon(slug);
    logActivity({
      actor: 'Admin',
      action: 'Icon Set to Draft',
      target: `/${slug}`,
      category: 'icons',
      status: 'warning',
      details: `Rejected and set /${slug} to draft status`,
    });
    setReviewFeedback(`✕ Marked /${slug} as Draft`);
    setTimeout(() => setReviewFeedback(null), 2000);
  };

  // One-Click Review Keyboard Shortcuts (J, K, A, R, M, E, P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        setSelectedIssueIndex((prev) => (prev + 1) % attentionIssues.length);
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        setSelectedIssueIndex((prev) => (prev - 1 + attentionIssues.length) % attentionIssues.length);
      } else if ((e.key === 'a' || e.key === 'A') && activeIcon) {
        e.preventDefault();
        handleApprove(activeIcon.slug);
      } else if ((e.key === 'r' || e.key === 'R') && activeIcon) {
        e.preventDefault();
        handleReject(activeIcon.slug);
      } else if ((e.key === 'e' || e.key === 'E') && activeIcon) {
        e.preventDefault();
        navigate(`/admin/icons/${activeIcon.slug}`);
      } else if ((e.key === 'm' || e.key === 'M') && currentIssue?.type === 'duplicate') {
        e.preventDefault();
        navigate('/admin/duplicates');
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (currentIssue?.iconSlugs?.[0]) {
          setActivePreviewIconSlug(currentIssue.iconSlugs[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [attentionIssues, activeIcon, currentIssue]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Compact Operations Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-text-primary tracking-tight">
              ICON OPERATIONS STUDIO
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              Live Monitor
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Real-time catalog health inspection, automated outlier detection, and rapid publication quality gates.
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuditData(runCatalogAudit(icons))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface hover:bg-bg-secondary border border-border-default rounded-sm text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Audit</span>
          </button>
          <Link
            to="/admin/icons/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add SVG Icon</span>
          </Link>
        </div>
      </div>

      {/* 2. Compact 4-Metric Studio Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Metric 1: Catalog */}
        <div className="p-3.5 rounded-sm bg-bg-surface border border-border-subtle hover:border-border-default transition-colors">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            Catalog Volume
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-text-primary">{healthSummary.totalConcepts.toLocaleString()}</span>
            <span className="text-xs text-text-secondary">concepts</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            {healthSummary.totalVariants.toLocaleString()} canonical variants
          </p>
        </div>

        {/* Metric 2: Health */}
        <Link
          to="/admin/health"
          className="p-3.5 rounded-sm bg-bg-surface border border-border-subtle hover:border-emerald-500/40 transition-colors group cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider">
              System Health
            </span>
            <span className="text-emerald-400 text-xs">↗</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{healthSummary.overallHealthPercent}%</span>
            <span className="text-[10px] text-emerald-500/80 font-bold uppercase">Optimal</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            {healthSummary.svgIntegrityPercent}% SVG • {healthSummary.metadataQualityPercent}% Metadata
          </p>
        </Link>

        {/* Metric 3: Attention Required */}
        <div className="p-3.5 rounded-sm bg-bg-surface border border-border-subtle hover:border-amber-500/40 transition-colors">
          <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider block">
            Needs Attention
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">{healthSummary.attentionRequiredCount}</span>
            <span className="text-xs text-text-secondary">items</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            {attentionIssues.length} actionable issue groups
          </p>
        </div>

        {/* Metric 4: Pending Drafts */}
        <Link
          to="/admin/icons?status=draft"
          className="p-3.5 rounded-sm bg-bg-surface border border-border-subtle hover:border-accent/40 transition-colors group cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider">
              Pending Drafts
            </span>
            <span className="text-accent text-xs">↗</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-accent">{healthSummary.pendingDraftsCount}</span>
            <span className="text-xs text-text-secondary">drafts</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Awaiting publication validation
          </p>
        </Link>
      </div>

      {/* 3. Main Operational Section: "WHAT NEEDS MY ATTENTION?" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              What Needs My Attention?
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-text-tertiary">
            <span>Shortcuts:</span>
            <kbd className="px-1 py-0.2 bg-bg-surface border rounded">J / K</kbd> navigate
            <kbd className="px-1 py-0.2 bg-bg-surface border rounded">A</kbd> approve
            <kbd className="px-1 py-0.2 bg-bg-surface border rounded">R</kbd> reject
            <kbd className="px-1 py-0.2 bg-bg-surface border rounded">E</kbd> edit
          </div>
        </div>

        {/* Operations Split: Attention Queue (Left) + Interactive Quick Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Issue Stream (7 Cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            {attentionIssues.map((issue, idx) => {
              const isSelected = idx === selectedIssueIndex;
              const severityColor =
                issue.severity === 'high'
                  ? 'border-rose-500/40 text-rose-400 bg-rose-500/5'
                  : issue.severity === 'medium'
                  ? 'border-amber-500/40 text-amber-400 bg-amber-500/5'
                  : 'border-blue-500/40 text-blue-400 bg-blue-500/5';

              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueIndex(idx)}
                  className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-bg-surface border-accent shadow-xs'
                      : 'bg-bg-surface/60 border-border-subtle hover:border-border-default hover:bg-bg-surface'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded border ${severityColor}`}>
                          {issue.severity} priority
                        </span>
                        <h3 className="text-xs font-bold font-mono text-text-primary truncate">
                          {issue.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 bg-bg-primary rounded border border-border-subtle text-text-primary">
                        {issue.count}
                      </span>
                      <Link
                        to={issue.actionRoute}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-bg-secondary hover:bg-bg-elevated text-text-primary border border-border-default rounded flex items-center gap-1 transition-colors"
                      >
                        <span>{issue.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Quick Action Inspection Box (5 Cols) */}
          <div className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                    Quick Review Specimen
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">
                  /{activeIcon?.slug || 'specimen'}
                </span>
              </div>

              {/* Specimen Live Preview Display */}
              {activeIcon ? (
                <div className="p-4 bg-bg-primary rounded-xs border border-border-default flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded border border-border-subtle bg-bg-surface flex items-center justify-center text-text-primary">
                    <IconPreviewSvg
                      svgContent={activeIcon.svg}
                      viewBox={activeIcon.viewBox || '0 0 24 24'}
                      size={40}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-bold font-mono text-text-primary">{activeIcon.name}</h4>
                    <p className="text-[10px] font-mono text-text-tertiary">
                      Category: {activeIcon.category} • Variants: {activeIcon.variants?.length || 1} • Status: {activeIcon.status || 'published'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-text-tertiary font-mono">
                  Select an issue on the left to preview target icons.
                </div>
              )}

              {/* Status or Action Feedback message */}
              {reviewFeedback && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono text-center rounded animate-in fade-in">
                  {reviewFeedback}
                </div>
              )}
            </div>

            {/* Interactive Review Action Bar */}
            {activeIcon && (
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApprove(activeIcon.slug)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve (A)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(activeIcon.slug)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Draft (R)</span>
                  </button>
                </div>

                <Link
                  to={`/admin/icons/${activeIcon.slug}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-bg-secondary hover:bg-bg-elevated text-text-primary border border-border-default rounded text-xs font-mono font-bold uppercase transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-accent" />
                  <span>Studio Edit (E)</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Secondary Operations Hub: Visual Outliers & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Visual Outlier Quick Cards (7 Cols) */}
        <div className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
                Visual Outlier Highlights
              </h3>
            </div>
            <Link to="/admin/health" className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1">
              <span>Full Health Audit</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {auditData.visualOutliers.map((outlier) => (
              <div
                key={outlier.slug}
                className="p-3 bg-bg-primary rounded-xs border border-border-default flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded bg-bg-surface border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                    <IconPreviewSvg
                      svgContent={outlier.svg}
                      viewBox="0 0 24 24"
                      size={22}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary truncate">{outlier.name}</span>
                      <span className="text-[10px] text-text-tertiary">[{outlier.category}]</span>
                    </div>
                    <p className="text-[11px] text-text-secondary font-sans truncate">{outlier.issue}</p>
                  </div>
                </div>

                <Link
                  to={`/admin/icons/${outlier.slug}`}
                  className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-default rounded text-[10px] font-bold uppercase tracking-wider text-text-primary shrink-0"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Live Administrative Activity Timeline (5 Cols) */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
                Operational Stream
              </h3>
            </div>
            <Link to="/admin/activity" className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1">
              <span>View Log</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto divide-y divide-border-subtle/30 pr-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="pt-2 first:pt-0 text-xs font-mono space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                  <span className="font-semibold text-text-secondary">{act.actor || 'Admin'}</span>
                  <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[11px] text-text-primary font-sans leading-tight">
                  {act.details || act.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
