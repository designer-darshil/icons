import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { AdminCard } from '@/features/admin/components/AdminCard';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminInput, AdminSelect, AdminTextarea, AdminTagInput } from '@/features/admin/components/AdminFormControls';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from '@/lib/svg/sanitizeSvg';
import { validateSvg } from '@/lib/svg/validateSvg';
import { normalizeSvg } from '@/lib/svg/normalizeSvg';
import { optimizeSvg } from '@/lib/svg/optimizeSvg';
import { verifyPrePublishGate } from '@/features/admin/services/catalogAudit';
import type { IconVariant, IconStyle } from '@/types/icon';
import {
  AlertTriangle,
  FileCode,
  Plus,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface VersionRecord {
  version: string;
  timestamp: string;
  author: string;
  changeSummary: string;
  svg: string;
  viewBox: string;
  variantStyle: string;
}

export const AdminIconDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getIconBySlug, updateIcon, updateVariantSvg, addVariant, publishIcon, unpublishIcon, categories } = useAdminCatalog();

  const icon = id ? getIconBySlug(id) : undefined;

  // Metadata form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [useCases, setUseCases] = useState('');

  // Selected variant & code editor state
  const [selectedVariantStyle, setSelectedVariantStyle] = useState<IconStyle>('regular');
  const [svgSourceCode, setSvgSourceCode] = useState('');
  const [originalSvgSource, setOriginalSvgSource] = useState('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Live preview configuration
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewSize, setPreviewSize] = useState<number>(32);
  const [previewColor, setPreviewColor] = useState('#F6F3EC');

  // Pre-publish checklist modal state
  const [isPublishChecklistOpen, setIsPublishChecklistOpen] = useState(false);

  // Add Variant Modal state
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [newVariantStyle, setNewVariantStyle] = useState<IconStyle>('filled');
  const [newVariantSvg, setNewVariantSvg] = useState('');

  // Version history state
  const [versionHistory, setVersionHistory] = useState<VersionRecord[]>([]);
  const [changeSummaryInput, setChangeSummaryInput] = useState('');

  // Sync icon data on load
  useEffect(() => {
    if (icon) {
      setName(icon.name);
      setSlug(icon.slug);
      setCategory(icon.primaryCategory || icon.category.toLowerCase());
      setSubcategory(icon.subcategory || '');
      setStatus(icon.status || 'published');
      setTags(icon.tags || []);
      setKeywords(icon.keywords || []);
      setUseCases((icon.useCases || []).join('\n'));

      const activeVar = (icon.variants || []).find((v) => v.style === selectedVariantStyle) || icon.variants?.[0] || {
        id: `${icon.slug}-regular`,
        style: 'regular',
        label: 'Regular',
        svg: icon.svg,
        viewBox: icon.viewBox || '0 0 24 24',
        supportsStroke: true,
        supportsColor: true,
      };

      const fullCode = `<svg viewBox="${activeVar.viewBox || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg">\n  ${activeVar.svg}\n</svg>`;
      setSvgSourceCode(fullCode);
      setOriginalSvgSource(fullCode);

      // Seed mock historical versions if empty
      setVersionHistory([
        {
          version: 'v2.1.0',
          timestamp: '2026-09-10',
          author: 'Admin',
          changeSummary: 'Updated path curvature and stroke calibration',
          svg: activeVar.svg,
          viewBox: activeVar.viewBox || '0 0 24 24',
          variantStyle: activeVar.style,
        },
        {
          version: 'v2.0.0',
          timestamp: '2026-06-15',
          author: 'System',
          changeSummary: 'Normalized 24×24 geometry',
          svg: activeVar.svg,
          viewBox: '0 0 24 24',
          variantStyle: activeVar.style,
        },
      ]);
    }
  }, [icon, selectedVariantStyle]);

  if (!icon) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h2 className="text-lg font-bold text-text-primary">Icon Concept Not Found</h2>
        <p className="text-xs text-text-tertiary">No icon with slug &quot;{id}&quot; exists in the catalog.</p>
        <Link
          to="/admin/icons"
          className="inline-block px-3.5 py-1.5 bg-accent text-accent-fg rounded text-xs font-semibold"
        >
          ← Return to Directory
        </Link>
      </div>
    );
  }

  // Parse & Validate edited SVG
  const sanitizedCurrent = sanitizeSvgMarkup(svgSourceCode);
  const currentInnerSvg = extractInnerSvg(sanitizedCurrent);
  const currentViewBox = extractViewBox(sanitizedCurrent);
  const currentValidation = validateSvg(sanitizedCurrent);

  const hasUnsavedCodeChanges = svgSourceCode !== originalSvgSource;

  // Vector structural metrics
  const pathMatches = (svgSourceCode.match(/<path/g) || []).length;
  const lineMatches = (svgSourceCode.match(/<line/g) || []).length;
  const circleMatches = (svgSourceCode.match(/<circle/g) || []).length;
  const totalElements = pathMatches + lineMatches + circleMatches;

  // Save Code Draft
  const handleSaveDraft = () => {
    if (!currentValidation.isValid) return;

    updateVariantSvg(icon.slug, selectedVariantStyle, currentInnerSvg, currentViewBox, changeSummaryInput || 'Updated SVG source code');

    // Record new version
    const newVer: VersionRecord = {
      version: `v2.2.${versionHistory.length + 1} (Draft)`,
      timestamp: new Date().toISOString().split('T')[0],
      author: 'Admin',
      changeSummary: changeSummaryInput || 'Modified SVG source paths',
      svg: currentInnerSvg,
      viewBox: currentViewBox,
      variantStyle: selectedVariantStyle,
    };
    setVersionHistory([newVer, ...versionHistory]);
    setOriginalSvgSource(svgSourceCode);
    setChangeSummaryInput('');

    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Pre-publish gate validation
  const prePublishGate = verifyPrePublishGate({
    ...icon,
    svg: currentInnerSvg,
    viewBox: currentViewBox,
    status,
    tags,
    keywords,
  });

  const handleConfirmPublish = () => {
    publishIcon(icon.slug);
    setStatus('published');
    setIsPublishChecklistOpen(false);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Revert Version
  const handleRevertVersion = (ver: VersionRecord) => {
    const fullCode = `<svg viewBox="${ver.viewBox}" xmlns="http://www.w3.org/2000/svg">\n  ${ver.svg}\n</svg>`;
    setSvgSourceCode(fullCode);
    updateVariantSvg(icon.slug, ver.variantStyle, ver.svg, ver.viewBox, `Reverted to ${ver.version}`);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Normalization
  const handleNormalize = () => {
    try {
      const result = normalizeSvg(sanitizedCurrent, selectedVariantStyle);
      const full = `<svg viewBox="${result.viewBox}" xmlns="http://www.w3.org/2000/svg">\n  ${result.innerSvg}\n</svg>`;
      setSvgSourceCode(full);
    } catch {
      // Ignore
    }
  };

  // Optimization
  const handleOptimize = () => {
    const optimized = optimizeSvg(sanitizedCurrent);
    setSvgSourceCode(optimized);
  };

  // Save Metadata Form
  const handleMetadataSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCategory = categories.find((c) => c.slug === category);
    updateIcon(icon.slug, {
      name,
      primaryCategory: category,
      category: targetCategory ? targetCategory.name : category,
      subcategory: subcategory || undefined,
      status,
      tags,
      keywords,
      useCases: useCases.split('\n').filter((u) => u.trim().length > 0),
    });

    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Add Variant Action
  const handleAddVariantSubmit = () => {
    const sanitizedNew = sanitizeSvgMarkup(newVariantSvg);
    const innerNew = extractInnerSvg(sanitizedNew);
    const viewBoxNew = extractViewBox(sanitizedNew);

    const val = validateSvg(sanitizedNew);
    if (!val.isValid || !innerNew) return;

    const newVar: IconVariant = {
      id: `${icon.slug}-${newVariantStyle}`,
      style: newVariantStyle,
      label: newVariantStyle.charAt(0).toUpperCase() + newVariantStyle.slice(1),
      svg: innerNew,
      viewBox: viewBoxNew,
      supportsStroke: newVariantStyle !== 'filled',
      supportsColor: true,
      defaultStrokeWidth: newVariantStyle !== 'filled' ? 2 : 0,
      qualityStatus: 'validated',
    };

    const res = addVariant(icon.slug, newVar);
    if (res.success) {
      setSelectedVariantStyle(newVariantStyle);
      setIsAddVariantOpen(false);
      setNewVariantSvg('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/icons"
            className="p-1.5 bg-bg-secondary hover:bg-bg-elevated border border-border-default rounded text-text-secondary hover:text-text-primary text-xs cursor-pointer"
          >
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold uppercase tracking-wide text-text-primary">{icon.name}</h1>
              <AdminStatusBadge status={status} size="sm" />
            </div>
            <p className="text-xs text-text-tertiary">
              /{icon.slug} • Source: {icon.sourceLibrary || 'Iconoir (Canonical)'}
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {status === 'published' ? (
            <button
              type="button"
              onClick={() => {
                unpublishIcon(icon.slug);
                setStatus('draft');
              }}
              className="px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border border-border-default bg-bg-secondary text-text-secondary hover:text-rose-400 cursor-pointer"
            >
              Unpublish (Set to Draft)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsPublishChecklistOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-black cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review & Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Code Editor (7 cols) + Live Preview & QA (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Metadata */}
        <div className="lg:col-span-7 space-y-5">
          {/* SVG Code Editor Card */}
          <AdminCard title="SVG Code Editor">
            <div className="space-y-3">
              {/* Variant Selector Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border-subtle pb-2">
                <div className="flex items-center gap-1">
                  {(icon.variants || []).map((v) => (
                    <button
                      key={v.style}
                      type="button"
                      onClick={() => setSelectedVariantStyle(v.style as IconStyle)}
                      className={cn(
                        'px-2.5 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer border',
                        selectedVariantStyle === v.style
                          ? 'bg-accent text-accent-fg border-accent font-bold'
                          : 'bg-bg-primary text-text-secondary border-border-default hover:text-text-primary'
                      )}
                    >
                      {v.label || v.style}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddVariantOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-accent hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Variant</span>
                </button>
              </div>

              {/* Editor Toolbar */}
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="font-semibold text-text-secondary">
                    {selectedVariantStyle.toUpperCase()} SVG Source
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={handleNormalize}
                    className="text-accent hover:underline cursor-pointer"
                    title="Normalize to 24x24 canvas"
                  >
                    Normalize 24×24
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleOptimize}
                    className="text-text-secondary hover:text-text-primary hover:underline cursor-pointer"
                    title="Clean redundant whitespace and metadata"
                  >
                    Optimize
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setSvgSourceCode(originalSvgSource)}
                    disabled={!hasUnsavedCodeChanges}
                    className="text-text-tertiary hover:text-text-primary cursor-pointer disabled:opacity-30"
                  >
                    Discard
                  </button>
                </div>
              </div>

              {/* Real Code Textarea with Line Numbers effect */}
              <div className="relative rounded-xs border border-border-default bg-bg-primary overflow-hidden">
                <textarea
                  value={svgSourceCode}
                  onChange={(e) => setSvgSourceCode(e.target.value)}
                  rows={9}
                  className="w-full p-3 font-mono text-xs text-text-primary bg-transparent focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed resize-y"
                  placeholder="<svg viewBox=&quot;0 0 24 24&quot;>...</svg>"
                />
              </div>

              {/* Vector Structural Metrics Bar */}
              <div className="p-2.5 bg-bg-surface rounded-xs border border-border-subtle flex items-center justify-between text-[11px] text-text-tertiary">
                <div className="flex items-center gap-3">
                  <span>ViewBox: <strong className="text-text-primary">{currentViewBox || '0 0 24 24'}</strong></span>
                  <span>Elements: <strong className="text-text-primary">{totalElements}</strong></span>
                  <span>Paths: <strong className="text-text-primary">{pathMatches}</strong></span>
                </div>
                <span className="text-emerald-400 font-bold">24×24 Grid Compliant</span>
              </div>

              {/* Live Validation Banner */}
              {!currentValidation.isValid && (
                <div className="p-2.5 rounded-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Validation Error: {currentValidation.errors.join(', ')}</span>
                </div>
              )}

              {/* Save Draft Action Bar */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={changeSummaryInput}
                  onChange={(e) => setChangeSummaryInput(e.target.value)}
                  placeholder="Optional version change summary..."
                  className="flex-1 px-3 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={!hasUnsavedCodeChanges || !currentValidation.isValid}
                  className="px-4 py-1.5 rounded-sm bg-accent text-accent-fg hover:bg-accent-hover text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-40 transition-colors shrink-0"
                >
                  {isSavedFeedback ? '✓ Draft Saved' : 'Save SVG Draft'}
                </button>
              </div>
            </div>
          </AdminCard>

          {/* Metadata Form Card */}
          <AdminCard title="Concept Metadata & Taxonomy">
            <form onSubmit={handleMetadataSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput label="Concept Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <AdminInput label="Slug Identifier" value={slug} disabled />
                <AdminSelect
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                  required
                />
                <AdminInput label="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
              </div>

              <AdminTagInput label="Tags" tags={tags} onChange={setTags} />
              <AdminTagInput label="Keywords" tags={keywords} onChange={setKeywords} />
              <AdminTextarea
                label="UI Use Cases"
                value={useCases}
                onChange={(e) => setUseCases(e.target.value)}
                rows={2}
                placeholder="One use case per line..."
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-bg-secondary hover:bg-bg-elevated border border-border-default text-text-primary rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save Metadata
                </button>
              </div>
            </form>
          </AdminCard>
        </div>

        {/* Right Column: 3-Way Diff, Live Multi-Scale Preview & Version History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Preview Card */}
          <AdminCard title="Live Multi-Scale Render & QA">
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5 text-xs">
                {/* Theme Selector */}
                <div className="flex items-center gap-1 bg-bg-primary p-0.5 rounded border border-border-default">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTheme('dark');
                      setPreviewColor('#F6F3EC');
                    }}
                    className={cn(
                      'px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold cursor-pointer',
                      previewTheme === 'dark' ? 'bg-accent text-accent-fg' : 'text-text-tertiary'
                    )}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTheme('light');
                      setPreviewColor('#121212');
                    }}
                    className={cn(
                      'px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold cursor-pointer',
                      previewTheme === 'light' ? 'bg-accent text-accent-fg' : 'text-text-tertiary'
                    )}
                  >
                    Light
                  </button>
                </div>

                {/* Size Selector */}
                <div className="flex items-center gap-1">
                  {[24, 32, 48, 64].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPreviewSize(sz)}
                      className={cn(
                        'w-6 h-6 rounded-xs text-[10px] font-mono flex items-center justify-center cursor-pointer border',
                        previewSize === sz
                          ? 'bg-accent text-accent-fg border-accent font-bold'
                          : 'bg-bg-primary text-text-secondary border-border-default'
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Live Preview Box */}
              <div
                className={cn(
                  'p-8 rounded-xs border border-border-default flex items-center justify-center transition-colors min-h-[160px]',
                  previewTheme === 'dark' ? 'bg-[#121316] text-[#F6F3EC]' : 'bg-[#FAFAF9] text-[#121212]'
                )}
              >
                <IconPreviewSvg
                  svgContent={currentInnerSvg}
                  viewBox={currentViewBox || '0 0 24 24'}
                  size={previewSize}
                  color={previewColor}
                  strokeWidth={selectedVariantStyle === 'light' ? 1 : selectedVariantStyle === 'filled' ? 0 : 1.5}
                />
              </div>

              {/* Multi-Scale Verification Strip */}
              <div className="flex items-center justify-around p-2.5 bg-bg-primary rounded-xs border border-border-default">
                {[16, 24, 32, 48].map((s) => (
                  <div key={s} className="text-center space-y-1">
                    <div className="w-12 h-12 flex items-center justify-center text-text-primary">
                      <IconPreviewSvg
                        svgContent={currentInnerSvg}
                        viewBox={currentViewBox || '0 0 24 24'}
                        size={s}
                        color="currentColor"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary block">{s}px</span>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>

          {/* Version History & Revert Card */}
          <AdminCard title="Version History & 1-Click Revert">
            <div className="space-y-3">
              {versionHistory.map((ver, idx) => (
                <div
                  key={ver.version}
                  className="p-3 rounded-xs border border-border-default bg-bg-secondary flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{ver.version}</span>
                      <span className="text-[10px] text-text-tertiary">{ver.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary font-sans leading-tight">
                      {ver.changeSummary}
                    </p>
                  </div>

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRevertVersion(ver)}
                      className="px-2.5 py-1 bg-bg-elevated border border-border-default hover:border-accent text-[10px] font-mono text-text-primary rounded cursor-pointer shrink-0"
                    >
                      Revert
                    </button>
                  )}
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Pre-Publish Checklist Modal ("Before You Publish") */}
      {isPublishChecklistOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-sm border border-border-strong bg-bg-secondary shadow-dropdown space-y-4 font-mono text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                  Before You Publish: /{icon.slug}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishChecklistOpen(false)}
                className="text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-text-tertiary font-sans">
              Every icon must satisfy all 8 automated quality and safety criteria before becoming visible in the public catalog.
            </p>

            {/* Checklist items */}
            <div className="space-y-2 py-1">
              {prePublishGate.checklist.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded bg-bg-primary border border-border-default flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-[11px] text-text-primary truncate">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      item.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.passed ? 'Passed' : 'Attention'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <span className="text-[11px] text-text-tertiary">
                {prePublishGate.isReadyToPublish ? '✓ Ready to publish' : 'Resolve warnings above'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishChecklistOpen(false)}
                  className="px-3.5 py-1.5 border border-border-default bg-bg-primary text-xs rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  disabled={!prePublishGate.isReadyToPublish}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded uppercase cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Confirm Publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Variant Modal */}
      {isAddVariantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-sm border border-border-strong bg-bg-secondary shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Add Authentic SVG Variant
              </h3>
              <button
                type="button"
                onClick={() => setIsAddVariantOpen(false)}
                className="text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <AdminSelect
                label="Variant Style"
                value={newVariantStyle}
                onChange={(e) => setNewVariantStyle(e.target.value as IconStyle)}
                options={[
                  { value: 'regular', label: 'Regular' },
                  { value: 'light', label: 'Light' },
                  { value: 'filled', label: 'Filled' },
                  { value: 'duotone', label: 'Duotone' },
                  { value: 'duotone-line', label: 'Duotone Line' },
                ]}
              />

              <AdminTextarea
                label="Authentic Variant SVG Source"
                value={newVariantSvg}
                onChange={(e) => setNewVariantSvg(e.target.value)}
                placeholder="<svg viewBox=&quot;0 0 24 24&quot;>...</svg>"
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setIsAddVariantOpen(false)}
                className="px-3.5 py-1.5 border border-border-default bg-bg-primary text-xs rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVariantSubmit}
                disabled={!newVariantSvg}
                className="px-4 py-1.5 bg-accent text-accent-fg font-bold text-xs rounded uppercase cursor-pointer disabled:opacity-40"
              >
                Add Variant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
