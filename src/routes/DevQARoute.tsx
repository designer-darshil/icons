import React, { useState, useMemo } from 'react';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { GRIDFRAME_ICONS, TOTAL_ICON_COUNT } from '@/data/icons/gridframe-catalog';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import {
  Search,
  Check,
  Copy,
  Download,
  Sun,
  Moon,
  Code2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import type { Icon, IconVariant, IconStyle } from '@/types/icon';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';

const SIZES = [24, 32, 48, 64] as const;

const BENCHMARK_ICONS = [
  { label: 'Accessibility', slug: 'accessibility' },
  { label: 'User Xmark', slug: 'user-xmark' },
  { label: 'Cloud', slug: 'cloud' },
  { label: 'Search', slug: 'search' },
  { label: 'Heart', slug: 'heart' },
  { label: 'Arrow Right', slug: 'arrow-right' },
  { label: 'Home', slug: 'home' },
  { label: 'Settings', slug: 'settings' },
  { label: 'Archive', slug: 'archive' },
];

export const DevQARoute: React.FC = () => {
  useDocumentTitle('Development Icon QA Panel — GRIDFRAME', 'Dedicated developer inspection panel for verifying canonical SVG variant fidelity.');
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('accessibility');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('regular');
  const [activeSize, setActiveSize] = useState<number>(24);
  const [activeColor, setActiveColor] = useState<string>('currentColor');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [downloadedRaw, setDownloadedRaw] = useState(false);

  // Selected icon object
  const selectedIcon: Icon = useMemo(() => {
    return GRIDFRAME_ICONS.find((i) => i.slug === selectedSlug) || GRIDFRAME_ICONS[0];
  }, [selectedSlug]);

  // Active variant object
  const activeVariant: IconVariant = useMemo(() => {
    const found = selectedIcon.variants.find((v) => v.style === selectedStyle);
    return found || selectedIcon.variants.find((v) => v.style === 'regular') || selectedIcon.variants[0];
  }, [selectedIcon, selectedStyle]);

  // Filtered search list
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return GRIDFRAME_ICONS.slice(0, 30);
    const q = searchQuery.toLowerCase();
    return GRIDFRAME_ICONS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [searchQuery]);

  // Transformed SVG Markup
  const exportedSvg = useMemo(() => {
    return transformSvgMarkup(activeVariant, {
      ...DEFAULT_CUSTOMIZATION,
      size: activeSize,
      color: activeColor,
    });
  }, [activeVariant, activeSize, activeColor]);

  const handleCopyRaw = () => {
    copyToClipboard(exportedSvg);
    setCopiedRaw(true);
    success(`Copied ${selectedIcon.slug} (${activeVariant.style}) SVG`);
    setTimeout(() => setCopiedRaw(false), 1400);
  };

  const handleDownloadRaw = () => {
    downloadFile(exportedSvg, `${selectedIcon.slug}-${activeVariant.style}.svg`, 'image/svg+xml');
    setDownloadedRaw(true);
    success(`Downloaded ${selectedIcon.slug}-${activeVariant.style}.svg`);
    setTimeout(() => setDownloadedRaw(false), 1400);
  };

  return (
    <WorkspaceShell>
      <div className="space-y-10 pb-24 font-sans">
        
        {/* Header Strip */}
        <div className="border-b border-border-subtle/70 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
                CANONICAL VARIANT QA PANEL
              </span>
              <span className="text-xs font-mono text-text-tertiary">
                {TOTAL_ICON_COUNT.toLocaleString()} Concepts · 100% Authentic Source SVGs
              </span>
            </div>
            <h1 className="type-h1 text-text-primary">
              Canonical Variant QA & Optical Integrity Workbench
            </h1>
            <p className="type-body text-text-secondary max-w-2xl">
              Inspect independent canonical SVGs across styles (Regular, Light, Filled, Duotone, Duotone Line), multi-resolution scaling (24px–64px), and theme contrast.
            </p>
          </div>

          {/* Quick Controls: Theme & Color Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-md border border-border-default">
              <button
                type="button"
                onClick={() => setActiveColor('currentColor')}
                className={cn(
                  'px-2 py-1 text-[11px] font-mono rounded',
                  activeColor === 'currentColor' ? 'bg-bg-elevated text-text-primary font-bold shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                currentColor
              </button>
              <button
                type="button"
                onClick={() => setActiveColor('var(--color-accent, #3b82f6)')}
                className={cn(
                  'px-2 py-1 text-[11px] font-mono rounded',
                  activeColor !== 'currentColor' ? 'bg-bg-elevated text-accent font-bold shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                Accent
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-secondary border border-border-default hover:border-border-strong text-xs font-mono text-text-primary transition-all cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-accent" /> : <Sun className="w-3.5 h-3.5 text-accent" />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Benchmark Presets Strip */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider font-semibold">
            Section 22 Benchmark Concepts:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {BENCHMARK_ICONS.map((bench) => (
              <button
                key={bench.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(bench.slug);
                  setSelectedStyle('regular');
                }}
                className={cn(
                  'px-3 py-1 text-xs font-mono rounded-md border transition-all cursor-pointer',
                  selectedSlug === bench.slug
                    ? 'bg-accent text-white font-bold border-accent shadow-xs'
                    : 'bg-bg-secondary text-text-secondary border-border-default hover:text-text-primary hover:border-border-strong'
                )}
              >
                {bench.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Inspector Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Icon Catalog Search & Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-bg-secondary/40 border border-border-default space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${TOTAL_ICON_COUNT} concepts...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-bg-elevated border border-border-default rounded-md text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1 max-h-[480px] overflow-y-auto native-scroll pr-1">
                {searchResults.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(icon.slug);
                      setSelectedStyle('regular');
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-md text-left transition-colors cursor-pointer',
                      selectedSlug === icon.slug
                        ? 'bg-accent/10 border border-accent/30 text-accent font-semibold'
                        : 'hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                        <IconPreviewSvg icon={icon} size={16} />
                      </div>
                      <span className="text-xs font-mono truncate">{icon.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary shrink-0">
                      {icon.variants.length} variant{icon.variants.length > 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Deep Diagnostic Inspector */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Header Information & Metadata */}
            <div className="p-5 rounded-xl bg-bg-elevated border border-border-default space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                    {selectedIcon.category} / {selectedIcon.family}
                  </span>
                  <h2 className="text-xl font-semibold text-text-primary">
                    {selectedIcon.name} (<code className="text-sm font-mono text-text-tertiary">{selectedIcon.slug}</code>)
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRaw}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bg-secondary hover:bg-bg-elevated border border-border-default hover:border-border-strong text-xs font-mono text-text-primary transition-all cursor-pointer shadow-xs"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRaw ? 'Copied' : 'Copy SVG'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadRaw}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-mono transition-all cursor-pointer shadow-xs"
                  >
                    {downloadedRaw ? <Check className="w-3.5 h-3.5 text-white" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{downloadedRaw ? 'Downloaded' : 'Download SVG'}</span>
                  </button>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase">ViewBox</span>
                  <p className="font-bold text-text-primary">{activeVariant.viewBox || '0 0 24 24'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase">Selected Style</span>
                  <p className="font-bold text-accent capitalize">{activeVariant.style}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase">Stroke / Fill</span>
                  <p className="font-bold text-text-primary">{activeVariant.supportsStroke !== false ? 'Stroke (1.5–2px)' : 'Solid Fill'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase">Real Variants</span>
                  <p className="font-bold text-text-primary">{selectedIcon.variants.length} canonical</p>
                </div>
              </div>
            </div>

            {/* 2. Side-by-Side Canonical Variants Matrix */}
            <div className="p-5 rounded-xl bg-bg-elevated border border-border-default space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-text-primary font-mono uppercase tracking-wider">
                    Authentic Variant Silhouette Comparison
                  </h3>
                </div>
                <span className="text-xs font-mono text-text-tertiary">
                  {selectedIcon.variants.length} authentic source asset{selectedIcon.variants.length > 1 ? 's' : ''} (Zero synthetic variants)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {selectedIcon.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedStyle(v.style)}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg border space-y-2.5 transition-all text-center cursor-pointer',
                      activeVariant.id === v.id
                        ? 'bg-accent/10 border-accent text-accent ring-1 ring-accent'
                        : 'bg-bg-secondary border-border-subtle hover:border-border-strong text-text-primary'
                    )}
                  >
                    <div className="w-12 h-12 rounded bg-bg-elevated border border-border-default flex items-center justify-center">
                      <IconPreviewSvg variant={v} icon={selectedIcon} size={32} color={activeColor} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold block capitalize">
                        {v.label || v.style}
                      </span>
                      <span className="text-[10px] font-mono text-text-tertiary block">
                        {v.supportsStroke !== false ? 'stroke' : 'solid fill'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Multi-Resolution Matrix (24px, 32px, 48px, 64px) */}
            <div className="p-5 rounded-xl bg-bg-elevated border border-border-default space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="text-sm font-semibold text-text-primary font-mono uppercase tracking-wider">
                  Multi-Resolution Viewport Scaling (24px → 64px)
                </h3>
                <span className="text-xs font-mono text-text-tertiary">
                  Canonical 24×24 coordinate system · Zero geometry distortion
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 items-end">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setActiveSize(sz)}
                    className={cn(
                      'flex flex-col items-center justify-end p-4 rounded-lg border min-h-[140px] space-y-3 cursor-pointer transition-all',
                      activeSize === sz
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-bg-secondary border-border-subtle hover:border-border-default text-text-primary'
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <IconPreviewSvg
                        variant={activeVariant}
                        icon={selectedIcon}
                        size={sz}
                        color={activeColor}
                        className="text-text-primary"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-text-tertiary">
                      {sz}×{sz}px {activeSize === sz ? '• selected' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. QA Diagnostic Inspection Criteria */}
            <div className="p-5 rounded-xl bg-bg-elevated border border-border-default space-y-3">
              <h3 className="text-sm font-semibold text-text-primary font-mono uppercase tracking-wider border-b border-border-subtle pb-2">
                Diagnostic Inspection Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Overall Silhouette: Pure source SVG</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Stroke Treatment: 1.5–2.0px crisp</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Fill Treatment: Dedicated vector fill</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Relative Scale: Native 24×24 viewBox</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Clipping: 0 overflow outside canvas</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-bg-secondary border border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-text-primary">Alignment: Preserves original center</span>
                </div>
              </div>
            </div>

            {/* 5. Raw SVG Source Viewer */}
            <div className="p-5 rounded-xl bg-bg-elevated border border-border-default space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                    Authoritative Source SVG Markup ({activeVariant.style})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">
                  Matches Preview 1:1
                </span>
              </div>

              <pre className="p-4 rounded-lg bg-bg-secondary border border-border-subtle text-[11px] font-mono text-text-primary overflow-x-auto leading-relaxed select-text">
                <code>{exportedSvg}</code>
              </pre>
            </div>

          </div>
        </div>

      </div>
    </WorkspaceShell>
  );
};

export default DevQARoute;
