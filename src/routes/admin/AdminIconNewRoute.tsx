import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminCatalog, type AdminIcon } from '@/features/admin/context/AdminCatalogContext';
import { AdminCard } from '@/features/admin/components/AdminCard';
import { AdminInput, AdminSelect, AdminTextarea, AdminTagInput } from '@/features/admin/components/AdminFormControls';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from '@/lib/svg/sanitizeSvg';
import { validateSvg } from '@/lib/svg/validateSvg';
import { normalizeSvg } from '@/lib/svg/normalizeSvg';
import { optimizeSvg } from '@/lib/svg/optimizeSvg';
import type { IconVariant, IconStyle } from '@/types/icon';
import { Upload, FileCode, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

export const AdminIconNewRoute: React.FC = () => {
  const navigate = useNavigate();
  const fileInputId = useId();
  const { icons, categories, createIcon } = useAdminCatalog();

  // Form Metadata State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState(categories[0]?.slug || 'system');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [sourceLibrary, setSourceLibrary] = useState('Custom / Uploaded');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [sourceUrl, setSourceUrl] = useState('');

  // SVG Source State
  const [rawSvgInput, setRawSvgInput] = useState('');
  const [selectedVariantStyle] = useState<IconStyle>('regular');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [previewSize, setPreviewSize] = useState<number>(32);
  const [previewColor, setPreviewColor] = useState('#F6F3EC');

  // Normalization / Optimization state
  const [ignoreDuplicateWarning, setIgnoreDuplicateWarning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-generate slug from name unless manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  // SVG Ingestion & Sanitization Pipeline
  const sanitizedMarkup = sanitizeSvgMarkup(rawSvgInput);
  const innerSvg = extractInnerSvg(sanitizedMarkup);
  const currentViewBox = extractViewBox(sanitizedMarkup);
  const validation = validateSvg(sanitizedMarkup);

  // Duplicate Concept Check
  const duplicateMatch = icons.find(
    (i) => i.slug === slug || (slug.length > 2 && i.slug === slug.toLowerCase()) || (name.length > 2 && i.name.toLowerCase() === name.toLowerCase())
  );
  const isDuplicateDetected = !!duplicateMatch && !ignoreDuplicateWarning;

  // File Upload Handlers
  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      setErrorMsg('Invalid file format. Only .svg vector files are accepted.');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setRawSvgInput(content);
        if (!name) {
          const inferredName = file.name.replace(/\.svg$/i, '').replace(/[-_]/g, ' ');
          handleNameChange(inferredName.charAt(0).toUpperCase() + inferredName.slice(1));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Explicit Normalization to 24x24
  const handleNormalize = () => {
    try {
      const result = normalizeSvg(sanitizedMarkup, selectedVariantStyle);
      const fullSvg = `<svg viewBox="${result.viewBox}" xmlns="http://www.w3.org/2000/svg">${result.innerSvg}</svg>`;
      setRawSvgInput(fullSvg);
    } catch (err) {
      setErrorMsg('Normalization failed. Ensure the SVG contains valid path geometry.');
    }
  };

  // Explicit Optimization
  const handleOptimize = () => {
    const optimized = optimizeSvg(sanitizedMarkup);
    setRawSvgInput(optimized);
  };

  // Pre-Publish Validation
  const isFormValid =
    name.trim().length > 0 &&
    slug.trim().length > 0 &&
    validation.isValid &&
    innerSvg.length > 0 &&
    !isDuplicateDetected;

  const handleSave = (status: 'published' | 'draft') => {
    if (!isFormValid && status === 'published') {
      setErrorMsg('Cannot publish. Please resolve validation errors and duplicate warnings.');
      return;
    }

    const defaultVariant: IconVariant = {
      id: `${slug}-${selectedVariantStyle}`,
      style: selectedVariantStyle,
      label: selectedVariantStyle.charAt(0).toUpperCase() + selectedVariantStyle.slice(1),
      svg: innerSvg,
      viewBox: currentViewBox || '0 0 24 24',
      supportsStroke: selectedVariantStyle !== 'filled',
      supportsColor: true,
      defaultStrokeWidth: selectedVariantStyle !== 'filled' ? 2 : 0,
      qualityStatus: 'validated',
      capabilities: {
        color: true,
        size: true,
        strokeWidth: selectedVariantStyle !== 'filled',
        lineCap: selectedVariantStyle !== 'filled',
        lineJoin: selectedVariantStyle !== 'filled',
        background: true,
        rotation: true,
        flip: true,
      },
    };

    const targetCategory = categories.find((c) => c.slug === category);

    const newIconRecord: AdminIcon = {
      id: slug,
      name,
      slug,
      category: targetCategory ? targetCategory.name : category,
      primaryCategory: category,
      secondaryCategories: [],
      subcategory: subcategory || undefined,
      style: selectedVariantStyle,
      variants: [defaultVariant],
      svg: innerSvg,
      viewBox: currentViewBox || '0 0 24 24',
      tags: Array.from(new Set([slug, ...slug.split('-'), category, ...tags])),
      keywords: Array.from(new Set([name.toLowerCase(), slug, ...keywords])),
      useCases: description ? [description] : [],
      aliases: [],
      relatedIconIds: [],
      status,
      updatedAt: new Date().toISOString().split('T')[0],
      sourceLibrary: `Custom (${sourceLibrary})`,
      source: {
        id: 'custom',
        name: sourceLibrary,
        version: '1.0.0',
        sourcePath: sourceUrl || 'uploaded-by-admin',
        license: license || 'MIT',
      },
      capabilities: defaultVariant.capabilities,
    };

    const result = createIcon(newIconRecord);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to create icon.');
      return;
    }

    navigate(`/admin/icons/${slug}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/icons"
            className="p-1.5 bg-bg-secondary hover:bg-bg-elevated border border-border-default rounded text-text-secondary hover:text-text-primary text-xs"
          >
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h1 className="text-xl font-bold uppercase tracking-wide text-text-primary">
                ADD NEW SVG ICON
              </h1>
            </div>
            <p className="text-xs text-text-tertiary">
              Upload, parse, sanitize, validate, and preview a new canonical 24×24 vector concept.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={!name || !slug || !innerSvg}
            className="px-3.5 py-1.5 rounded-sm border border-border-default bg-bg-secondary hover:bg-bg-elevated text-xs font-semibold text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={!isFormValid}
            className="px-4 py-1.5 rounded-sm bg-accent text-accent-fg hover:bg-accent-hover text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            Publish Icon
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xs border border-status-error/40 bg-status-error/10 flex items-center justify-between text-xs text-status-error">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-bold hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Duplicate Warning Alert */}
      {isDuplicateDetected && duplicateMatch && (
        <div className="p-4 rounded-xs border border-status-warning/40 bg-status-warning/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-status-warning font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Potential Duplicate Concept Detected</span>
          </div>
          <p className="text-text-secondary">
            An existing icon with slug &quot;<span className="font-bold text-text-primary">{duplicateMatch.slug}</span>&quot; ({duplicateMatch.name}) is already in the catalog.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link
              to={`/admin/icons/${duplicateMatch.slug}`}
              className="text-accent underline font-semibold"
              target="_blank"
            >
              [View Existing Icon ↗]
            </Link>
            <button
              type="button"
              onClick={() => setIgnoreDuplicateWarning(true)}
              className="px-2.5 py-1 bg-bg-secondary border border-border-default rounded text-[11px] hover:text-text-primary cursor-pointer"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metadata Card */}
          <AdminCard title="Concept Metadata">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Icon Name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Cloud Upload"
                required
              />
              <AdminInput
                label="Slug Identifier"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                placeholder="e.g. cloud-upload"
                required
              />
              <AdminSelect
                label="Primary Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                required
              />
              <AdminInput
                label="Subcategory (Optional)"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. storage"
              />
            </div>

            <div className="mt-4 space-y-4">
              <AdminTagInput
                label="Search Tags"
                tags={tags}
                onChange={setTags}
                placeholder="Type tag and press Enter..."
              />
              <AdminTagInput
                label="Search Keywords & Synonyms"
                tags={keywords}
                onChange={setKeywords}
                placeholder="Type keyword and press Enter..."
              />
              <AdminTextarea
                label="Description & UI Use Cases"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe common interface locations and action triggers..."
                rows={2}
              />
            </div>
          </AdminCard>

          {/* SVG Source Upload & Paste Card */}
          <AdminCard title="SVG Source Ingestion">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border-default hover:border-accent/80 rounded-sm p-6 text-center bg-bg-secondary/40 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="w-6 h-6 text-accent" />
              <p className="text-xs font-semibold text-text-primary">
                Drag & Drop .svg file here, or{' '}
                <label htmlFor={fileInputId} className="text-accent underline cursor-pointer">
                  browse files
                </label>
              </p>
              <input
                id={fileInputId}
                type="file"
                accept=".svg"
                aria-label="Upload SVG file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <p className="text-[10px] text-text-tertiary">
                Strict vector sanitization applied automatically. No dangerous scripts or embeds.
              </p>
            </div>

            {/* Code Paste Box */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-text-primary flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-text-tertiary" />
                  <span>Raw SVG Source Code</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNormalize}
                    disabled={!rawSvgInput}
                    className="text-[10px] font-mono text-accent hover:underline cursor-pointer disabled:opacity-40"
                  >
                    Normalize 24×24
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleOptimize}
                    disabled={!rawSvgInput}
                    className="text-[10px] font-mono text-text-secondary hover:text-text-primary hover:underline cursor-pointer disabled:opacity-40"
                  >
                    Optimize
                  </button>
                </div>
              </div>

              <textarea
                value={rawSvgInput}
                onChange={(e) => setRawSvgInput(e.target.value)}
                placeholder="<svg viewBox=&quot;0 0 24 24&quot; ...>...</svg>"
                rows={7}
                className="w-full p-3 rounded-xs border border-border-default bg-bg-primary text-xs font-mono text-text-primary focus:outline-none focus:border-accent leading-relaxed"
              />
            </div>
          </AdminCard>

          {/* Source Attribution Metadata */}
          <AdminCard title="Source Attribution & License">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Source Library / Origin"
                value={sourceLibrary}
                onChange={(e) => setSourceLibrary(e.target.value)}
                placeholder="e.g. Custom Studio / Internal"
              />
              <AdminInput
                label="Author / Creator"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Design Systems Team"
              />
              <AdminInput
                label="License Type"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="e.g. MIT"
              />
              <AdminInput
                label="Source URL / Reference"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Live Multi-Scale Preview & Quality Gate (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Preview Card */}
          <AdminCard title="Canonical 24×24 Live Preview">
            {/* Preview Controls */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 flex-wrap gap-2 text-xs">
              {/* Theme Selector */}
              <div className="flex items-center gap-1 bg-bg-primary p-0.5 rounded border border-border-default">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTheme('dark');
                    setPreviewColor('#F6F3EC');
                  }}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer',
                    previewTheme === 'dark' ? 'bg-bg-secondary text-text-primary font-bold' : 'text-text-tertiary'
                  )}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTheme('light');
                    setPreviewColor('#141311');
                  }}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer',
                    previewTheme === 'light' ? 'bg-bg-secondary text-text-primary font-bold' : 'text-text-tertiary'
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
                      'px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer',
                      previewSize === sz
                        ? 'bg-accent text-accent-fg border-accent font-bold'
                        : 'border-border-default text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Stage */}
            <div
              className={cn(
                'p-8 rounded-sm border border-border-default flex flex-col items-center justify-center min-h-[220px] transition-colors',
                previewTheme === 'dark' ? 'bg-[#141311] text-[#F6F3EC]' : 'bg-[#FAF8F5] text-[#141311]'
              )}
            >
              {innerSvg ? (
                <div
                  style={{
                    width: previewSize,
                    height: previewSize,
                    color: previewColor,
                  }}
                  className="flex items-center justify-center transition-all"
                >
                  <IconPreviewSvg
                    svgContent={innerSvg}
                    viewBox={currentViewBox || '0 0 24 24'}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center space-y-1 text-text-tertiary">
                  <p className="text-xs">No SVG loaded</p>
                  <p className="text-[10px]">Upload or paste SVG code to preview</p>
                </div>
              )}
            </div>

            {/* Multi-Scale Strip */}
            {innerSvg && (
              <div className="pt-3 border-t border-border-subtle flex items-center justify-around text-center text-[10px] text-text-tertiary">
                {[16, 24, 32, 48].map((sz) => (
                  <div key={sz} className="space-y-1">
                    <div
                      style={{ width: sz, height: sz }}
                      className="mx-auto flex items-center justify-center text-text-primary"
                    >
                      <IconPreviewSvg svgContent={innerSvg} className="w-full h-full" />
                    </div>
                    <span>{sz}px</span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          {/* Validation & Geometry Health Card */}
          <AdminCard title="SVG Quality & Geometry Gate">
            <div className="space-y-2.5 text-xs">
              {/* Validation Status */}
              <div className="flex items-center justify-between p-2.5 rounded-xs border border-border-default bg-bg-secondary">
                <span className="text-text-secondary">SVG Structure & Parser:</span>
                <span className={cn('font-bold', validation.isValid ? 'text-status-success' : 'text-status-error')}>
                  {validation.isValid ? '✓ Valid SVG' : '✕ Syntax Errors'}
                </span>
              </div>

              {/* ViewBox Check */}
              <div className="flex items-center justify-between p-2.5 rounded-xs border border-border-default bg-bg-secondary">
                <span className="text-text-secondary">ViewBox Alignment:</span>
                <span className={cn('font-mono font-bold', currentViewBox === '0 0 24 24' ? 'text-status-success' : 'text-status-warning')}>
                  {currentViewBox || 'Missing'}
                </span>
              </div>

              {currentViewBox !== '0 0 24 24' && rawSvgInput && (
                <div className="p-3 rounded-xs border border-status-warning/40 bg-status-warning/10 flex items-center justify-between text-[11px] text-status-warning">
                  <span>Non-24×24 canvas ({currentViewBox}). Normalize to Gridframe 24×24?</span>
                  <button
                    type="button"
                    onClick={handleNormalize}
                    className="px-2.5 py-1 bg-accent text-accent-fg font-bold rounded cursor-pointer shrink-0 ml-2"
                  >
                    Normalize
                  </button>
                </div>
              )}

              {/* Error list */}
              {validation.errors.length > 0 && (
                <div className="p-3 rounded-xs border border-status-error/40 bg-status-error/10 space-y-1 text-[11px] text-status-error">
                  <span className="font-bold">Validation Issues:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validation.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default AdminIconNewRoute;
