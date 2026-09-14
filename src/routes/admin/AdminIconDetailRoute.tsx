import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { AdminCard } from '@/features/admin/components/AdminCard';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminInput, AdminSelect, AdminTextarea, AdminTagInput } from '@/features/admin/components/AdminFormControls';
import { validateSvg } from '@/lib/svg/validateSvg';

export const AdminIconDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getIconBySlug, updateIcon, categories } = useAdminCatalog();

  const icon = id ? getIconBySlug(id) : undefined;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [useCases, setUseCases] = useState('');
  const [selectedVariantStyle, setSelectedVariantStyle] = useState('regular');
  const [isSaved, setIsSaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (icon) {
      setName(icon.name);
      setSlug(icon.slug);
      setCategory(icon.primaryCategory || icon.category.toLowerCase());
      setStatus(icon.status || 'published');
      setTags(icon.tags || []);
      setKeywords(icon.keywords || []);
      setUseCases((icon.useCases || []).join('\n'));
    }
  }, [icon]);

  if (!icon) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h2 className="text-lg font-bold text-text-primary">Icon Concept Not Found</h2>
        <p className="text-xs text-text-tertiary">No icon with slug &quot;{id}&quot; exists in the catalog.</p>
        <Link
          to="/admin/icons"
          className="inline-block px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-semibold"
        >
          ← Return to Directory
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIcon(icon.slug, {
      name,
      primaryCategory: category,
      category: categories.find((c) => c.slug === category)?.name || category,
      status,
      tags,
      keywords,
      useCases: useCases.split('\n').filter((u) => u.trim().length > 0),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const currentVariant = icon.variants?.find((v) => v.style === selectedVariantStyle) || icon.variants?.[0];
  const fullSvgMarkup = currentVariant
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${currentVariant.viewBox || '0 0 24 24'}" width="24" height="24">${currentVariant.svg}</svg>`
    : '';

  const svgValidation = validateSvg(fullSvgMarkup);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(fullSvgMarkup);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/icons"
            className="p-1.5 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors text-xs font-mono"
            title="Back to Icons"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">{icon.name}</h2>
              <AdminStatusBadge status={status} size="sm" />
            </div>
            <p className="text-xs font-mono text-text-tertiary">{icon.slug} • Source: Iconoir Canonical</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-mono text-emerald-500 font-semibold animate-in fade-in">
              ✓ Changes Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-action-primary hover:bg-action-primary/90 text-text-inverse font-mono text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Save Icon Changes
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Variant Inspector Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata Edit Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <AdminCard title="Core Concept Metadata" subtitle="Canonical identifiers and descriptive taxonomy">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Display Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <AdminInput
                  label="Concept Slug"
                  required
                  readOnly
                  value={slug}
                  helpText="Immutable canonical identifier"
                  className="opacity-80"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminSelect
                  label="Primary Category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categories.map((c) => ({ value: c.slug, label: `${c.name} (${c.slug})` }))}
                />
                <AdminSelect
                  label="Publication Status"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  options={[
                    { value: 'published', label: 'Published (Live)' },
                    { value: 'draft', label: 'Draft (Internal Only)' },
                    { value: 'archived', label: 'Archived (Hidden)' },
                  ]}
                />
              </div>

              <AdminTagInput
                label="Tags & Classifiers"
                tags={tags}
                onChange={setTags}
                helpText="Search facets and domain classification keywords"
              />

              <AdminTagInput
                label="Keywords & Aliases"
                tags={keywords}
                onChange={setKeywords}
                helpText="Alternate names and semantic synonym triggers"
              />

              <AdminTextarea
                label="UI Use Cases (One per line)"
                rows={3}
                value={useCases}
                onChange={(e) => setUseCases(e.target.value)}
                helpText="Examples: Cloud server dashboard, Hosting status indicator"
              />
            </div>
          </AdminCard>
        </form>

        {/* Right Column: 5-Variant Visual & SVG Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Variant Visual Selector Card */}
          <AdminCard
            title="Coordinated Variant Family"
            subtitle={`${icon.variants?.length || 5} canonical vector styles`}
          >
            {/* Style Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-bg-secondary rounded-md text-[11px] font-mono mb-4">
              {['regular', 'light', 'filled', 'duotone', 'duotone-line'].map((st) => {
                const isSelected = selectedVariantStyle === st;
                const label = st === 'duotone-line' ? 'D-Line' : st.charAt(0).toUpperCase() + st.slice(1);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedVariantStyle(st)}
                    className={`py-1.5 px-1 rounded font-medium text-center transition-colors truncate ${
                      isSelected
                        ? 'bg-bg-surface text-text-primary shadow-xs font-bold border border-border-subtle'
                        : 'text-text-tertiary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Visual Canvas Display */}
            {currentVariant ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Dark Mode Preview */}
                  <div className="bg-[#121214] border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-white">
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      dangerouslySetInnerHTML={{
                        __html: `<svg viewBox="${currentVariant.viewBox || '0 0 24 24'}" width="48" height="48" fill="none" stroke="currentColor" stroke-width="${currentVariant.defaultStrokeWidth ?? 2}">${currentVariant.svg}</svg>`,
                      }}
                    />
                    <span className="text-[10px] font-mono text-zinc-400">Dark Preview</span>
                  </div>

                  {/* Light Mode Preview */}
                  <div className="bg-[#f8f8fa] border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-zinc-900">
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      dangerouslySetInnerHTML={{
                        __html: `<svg viewBox="${currentVariant.viewBox || '0 0 24 24'}" width="48" height="48" fill="none" stroke="currentColor" stroke-width="${currentVariant.defaultStrokeWidth ?? 2}">${currentVariant.svg}</svg>`,
                      }}
                    />
                    <span className="text-[10px] font-mono text-zinc-500">Light Preview</span>
                  </div>
                </div>

                {/* Validation Info Badge */}
                <div className="p-3 bg-bg-secondary rounded-md border border-border-subtle space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Canvas ViewBox:</span>
                    <strong className="text-text-primary">{currentVariant.viewBox || '0 0 24 24'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Validation Health:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span>✓</span>
                      <span>{svgValidation.isValid ? 'Conforming (0 errors)' : 'Issues Detected'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </AdminCard>

          {/* Read-Only Canonical SVG Inspector */}
          <AdminCard
            title="Read-Only SVG Geometry"
            subtitle="Verified vector source coordinates"
            action={
              <button
                type="button"
                onClick={handleCopySvg}
                className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                {copyFeedback ? '✓ Copied!' : 'Copy SVG'}
              </button>
            }
          >
            <pre className="p-3 bg-bg-secondary rounded-md border border-border-subtle text-[11px] font-mono text-text-secondary overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed select-all">
              {fullSvgMarkup}
            </pre>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};
