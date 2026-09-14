import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { useCompare, MAX_COMPARE_ITEMS } from './useCompare';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useToast } from '@/components/ui/Toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { GridframeColorPicker } from '@/features/customizer/GridframeColorPicker';
import { CollectionModal } from '@/features/collections/CollectionModal';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { optimizeSvg } from '@/lib/svg/optimizeSvg';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import {
  Columns,
  ArrowLeft,
  Heart,
  Copy,
  Download,
  Check,
  Trash2,
  ArrowLeftRight,
  FolderPlus,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Icon, IconStyle } from '@/types/icon';
import type { IconCustomization } from '@/types/customization';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, info } = useToast();
  const {
    compareIcons,
    removeFromCompare,
    clearCompare,
    swapCompare,
    setCompareIds,
  } = useCompare();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // Synchronize state from URL query parameter ?icons=slug1,slug2...
  useEffect(() => {
    const iconsParam = searchParams.get('icons');
    if (iconsParam) {
      const slugsOrIds = iconsParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (slugsOrIds.length > 0) {
        // Find matching icon IDs
        const matchedIds: string[] = [];
        for (const query of slugsOrIds) {
          const found = GRIDFRAME_ICONS.find(
            (i) => i.slug.toLowerCase() === query || i.id.toLowerCase() === query
          );
          if (found && !matchedIds.includes(found.id)) {
            matchedIds.push(found.id);
          }
        }
        if (matchedIds.length > 0) {
          setCompareIds(matchedIds);
        }
      }
    }
  }, [searchParams, setCompareIds]);

  // Synchronize URL whenever compareIds change
  useEffect(() => {
    if (compareIcons.length > 0) {
      const nextParam = compareIcons.map((i) => i.slug).join(',');
      if (searchParams.get('icons') !== nextParam) {
        setSearchParams({ icons: nextParam }, { replace: true });
      }
    } else {
      if (searchParams.has('icons')) {
        setSearchParams({}, { replace: true });
      }
    }
  }, [compareIcons, searchParams, setSearchParams]);

  useDocumentTitle(
    compareIcons.length > 0
      ? `Compare ${compareIcons.map((i) => i.name).join(' vs ')}`
      : 'Icon Comparison Workstation',
    'Compare vector icons side-by-side: test size scaling, optical stroke weights, variants, and colors.'
  );

  // Global Sync Controls
  const [syncSize, setSyncSize] = useState(true);
  const [globalSize, setGlobalSize] = useState<number>(48);

  const [syncColor, setSyncColor] = useState(true);
  const [globalColor, setGlobalColor] = useState<string>('#FFFFFF');

  // Per-column local overrides (style, size, color)
  const [columnStates, setColumnStates] = useState<
    Record<string, { style: IconStyle; size: number; color: string; copied: boolean; downloaded: boolean }>
  >({});

  // Collection modal target
  const [collectionModalIcon, setCollectionModalIcon] = useState<Icon | null>(null);

  // Initialize or update column states
  useEffect(() => {
    setColumnStates((prev) => {
      const next = { ...prev };
      for (const icon of compareIcons) {
        if (!next[icon.id]) {
          const defaultStyle =
            icon.variants.find((v) => v.style === 'regular')?.style ||
            icon.variants[0]?.style ||
            'regular';
          next[icon.id] = {
            style: defaultStyle,
            size: globalSize,
            color: globalColor,
            copied: false,
            downloaded: false,
          };
        }
      }
      return next;
    });
  }, [compareIcons, globalSize, globalColor]);

  const handleStyleChange = (iconId: string, style: IconStyle) => {
    setColumnStates((prev) => ({
      ...prev,
      [iconId]: {
        ...(prev[iconId] || { size: globalSize, color: globalColor, copied: false, downloaded: false }),
        style,
      },
    }));
  };

  const handleCopySvg = (icon: Icon) => {
    const colState = columnStates[icon.id];
    const style = colState?.style || icon.variants[0]?.style || 'regular';
    const variant = icon.variants.find((v) => v.style === style) || icon.variants[0];
    const size = syncSize ? globalSize : (colState?.size || globalSize);
    const color = syncColor ? globalColor : (colState?.color || globalColor);

    const customization: IconCustomization = {
      ...DEFAULT_CUSTOMIZATION,
      size,
      color,
    };
    const transformed = transformSvgMarkup(variant, customization);
    const cleanSvg = optimizeSvg(transformed);
    copyToClipboard(cleanSvg);

    setColumnStates((prev) => ({
      ...prev,
      [icon.id]: {
        ...(prev[icon.id] || { style, size, color, downloaded: false }),
        copied: true,
      },
    }));
    success(`Copied ${icon.name} (${style}) SVG`);
    setTimeout(() => {
      setColumnStates((prev) => ({
        ...prev,
        [icon.id]: { ...prev[icon.id], copied: false },
      }));
    }, 1400);
  };

  const handleDownloadSvg = (icon: Icon) => {
    const colState = columnStates[icon.id];
    const style = colState?.style || icon.variants[0]?.style || 'regular';
    const variant = icon.variants.find((v) => v.style === style) || icon.variants[0];
    const size = syncSize ? globalSize : (colState?.size || globalSize);
    const color = syncColor ? globalColor : (colState?.color || globalColor);

    const customization: IconCustomization = {
      ...DEFAULT_CUSTOMIZATION,
      size,
      color,
    };
    const transformed = transformSvgMarkup(variant, customization);
    downloadFile(transformed, `${icon.slug}-${style}.svg`, 'image/svg+xml');

    setColumnStates((prev) => ({
      ...prev,
      [icon.id]: {
        ...(prev[icon.id] || { style, size, color, copied: false }),
        downloaded: true,
      },
    }));
    success(`Downloaded ${icon.slug}-${style}.svg`);
    setTimeout(() => {
      setColumnStates((prev) => ({
        ...prev,
        [icon.id]: { ...prev[icon.id], downloaded: false },
      }));
    }, 1400);
  };

  const handleToggleFavorite = (icon: Icon) => {
    const isNowFav = toggleFavorite(icon.id);
    if (isNowFav) {
      success(`Saved "${icon.name}" to favorites`);
    } else {
      info(`Removed "${icon.name}" from favorites`, {
        label: 'Undo',
        onClick: () => toggleFavorite(icon.id),
      });
    }
  };

  if (compareIcons.length === 0) {
    return (
      <WorkspaceShell>
        <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border-default text-text-tertiary flex items-center justify-center mx-auto">
            <Columns className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-base font-bold uppercase tracking-wider text-text-primary">
              Compare Icons Side-by-Side
            </h1>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Choose 2 to 4 vector icons from the archive to inspect optical alignments, variant fidelity, and scaling differences.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/icons"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Icons</span>
            </Link>
          </div>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <div className="space-y-8">
        {/* Navigation Breadcrumb & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-6">
          <div className="space-y-2">
            <Link
              to="/icons"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORKSPACE</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-text-primary uppercase">
                Icon Comparison Workstation
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-bg-secondary border border-border-default text-text-secondary">
                {compareIcons.length} / {MAX_COMPARE_ITEMS}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/icons"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary bg-bg-secondary hover:bg-bg-elevated border border-border-default transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Icon</span>
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-action-destructive hover:bg-status-error-bg border border-border-default transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Global Control Bar: Synchronized Size & Color */}
        <div className="p-4 sm:p-5 rounded-xl border border-border-default bg-bg-secondary/40 backdrop-blur-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Synchronized Size Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                Render Scale ({globalSize}px)
              </span>
              <button
                type="button"
                onClick={() => setSyncSize(!syncSize)}
                className={cn(
                  'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border transition-colors cursor-pointer',
                  syncSize
                    ? 'bg-accent/15 border-accent/30 text-accent font-semibold'
                    : 'bg-bg-elevated border-border-default text-text-tertiary'
                )}
              >
                {syncSize ? '✓ Sync Size' : 'Independent Size'}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {[24, 32, 48, 64].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setGlobalSize(size)}
                  className={cn(
                    'px-3 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer',
                    globalSize === size
                      ? 'border-accent bg-accent text-white font-bold'
                      : 'border-border-default bg-bg-elevated hover:bg-bg-secondary text-text-secondary'
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Synchronized Color Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                Color Tint
              </span>
              <button
                type="button"
                onClick={() => setSyncColor(!syncColor)}
                className={cn(
                  'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border transition-colors cursor-pointer',
                  syncColor
                    ? 'bg-accent/15 border-accent/30 text-accent font-semibold'
                    : 'bg-bg-elevated border-border-default text-text-tertiary'
                )}
              >
                {syncColor ? '✓ Sync Color' : 'Independent Color'}
              </button>
            </div>
            <GridframeColorPicker
              color={globalColor}
              onChange={setGlobalColor}
            />
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            2–4 COLUMN COMPARISON MATRIX
            ═════════════════════════════════════════════════════════════════════ */}
        <div className="w-full overflow-x-auto native-scroll pb-4">
          <div
            className={cn(
              'grid gap-6 min-w-[600px] md:min-w-0',
              compareIcons.length === 2 && 'grid-cols-2',
              compareIcons.length === 3 && 'grid-cols-3',
              compareIcons.length >= 4 && 'grid-cols-2 lg:grid-cols-4'
            )}
          >
            {compareIcons.map((icon, idx) => {
              const colState = columnStates[icon.id] || {
                style: icon.variants[0]?.style || 'regular',
                size: globalSize,
                color: globalColor,
                copied: false,
                downloaded: false,
              };
              const activeStyle = colState.style;
              const activeVariant =
                icon.variants.find((v) => v.style === activeStyle) || icon.variants[0];
              const isFav = favoriteSet.has(icon.id);
              const renderedSize = syncSize ? globalSize : colState.size;
              const renderedColor = syncColor ? globalColor : colState.color;

              return (
                <div
                  key={icon.id}
                  className="flex flex-col justify-between p-5 rounded-xl border border-border-default bg-bg-elevated/70 shadow-sm space-y-5"
                >
                  {/* Top Bar: Order + Category + Swap + Remove */}
                  <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-bg-secondary text-accent border border-border-default shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary truncate">
                        {icon.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {compareIcons.length > 1 && idx > 0 && (
                        <button
                          type="button"
                          onClick={() => swapCompare(idx, idx - 1)}
                          title="Swap with left icon"
                          aria-label={`Swap ${icon.name} left`}
                          className="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-bg-secondary transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(icon)}
                        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        className={cn(
                          'p-1.5 rounded transition-colors cursor-pointer',
                          isFav
                            ? 'text-accent bg-accent/10'
                            : 'text-text-tertiary hover:text-accent hover:bg-bg-secondary'
                        )}
                      >
                        <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-current text-accent')} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(icon.id)}
                        aria-label={`Remove ${icon.name} from comparison`}
                        className="p-1.5 text-text-tertiary hover:text-action-destructive rounded hover:bg-status-error-bg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Icon Identity Heading */}
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-text-primary truncate">
                      {icon.name}
                    </h2>
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {icon.variants.length} available {icon.variants.length === 1 ? 'style' : 'styles'}
                    </span>
                  </div>

                  {/* Real Variant Selection Tabs */}
                  <div className="flex flex-wrap items-center gap-1">
                    {icon.variants.map((v) => (
                      <button
                        key={v.style}
                        type="button"
                        onClick={() => handleStyleChange(icon.id, v.style)}
                        className={cn(
                          'px-2 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider transition-colors cursor-pointer',
                          activeStyle === v.style
                            ? 'bg-accent text-white font-bold'
                            : 'bg-bg-secondary text-text-tertiary hover:text-text-primary hover:bg-bg-elevated border border-border-subtle'
                        )}
                      >
                        {v.style}
                      </button>
                    ))}
                  </div>

                  {/* Main Specimen Preview Stage (Strict 24x24 Optical Canvas) */}
                  <div className="relative aspect-square w-full rounded-lg bg-bg-secondary/60 border border-border-default flex items-center justify-center p-4">
                    {/* Background Guideline Matrix */}
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/40 pointer-events-none" />
                    <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/40 pointer-events-none" />

                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-100"
                      style={{
                        width: renderedSize,
                        height: renderedSize,
                      }}
                    >
                      <IconPreviewSvg
                        icon={icon}
                        variant={activeVariant}
                        size={renderedSize}
                        color={renderedColor}
                        className="w-full h-full shrink-0"
                      />
                    </div>

                    <span className="absolute bottom-2 right-2 text-[9px] font-mono text-text-tertiary">
                      24×24 viewBox
                    </span>
                  </div>

                  {/* Action Bar: Copy SVG, Download SVG, Add to Set */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopySvg(icon)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer shadow-xs"
                      >
                        {colState.copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{colState.copied ? 'Copied' : 'Copy SVG'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadSvg(icon)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-medium bg-bg-secondary hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default transition-colors cursor-pointer"
                      >
                        {colState.downloaded ? <Check className="w-3.5 h-3.5 text-accent" /> : <Download className="w-3.5 h-3.5" />}
                        <span>Download</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCollectionModalIcon(icon)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-mono text-text-secondary hover:text-text-primary bg-bg-secondary/40 hover:bg-bg-secondary border border-border-subtle transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-accent" />
                      <span>Add to Set</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collection Modal for Set Assignment */}
      <CollectionModal
        isOpen={Boolean(collectionModalIcon)}
        onClose={() => setCollectionModalIcon(null)}
        icon={collectionModalIcon}
      />
    </WorkspaceShell>
  );
};

export default ComparePage;
