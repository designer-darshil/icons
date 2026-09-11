import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { CodeModal } from '@/components/export/CodeModal';
import { CollectionModal } from '@/features/collections/CollectionModal';
import { useToast } from '@/components/ui/Toast';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import type { Icon, IconVariant, IconStyle } from '@/types/icon';
import type { IconCustomization } from '@/types/customization';
import {
  Copy,
  Download,
  Code,
  FolderPlus,
  Heart,
  RotateCcw,
  Check,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface IconDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: Icon | null;
  isFavorite?: boolean;
  onToggleFavorite?: (icon: Icon) => void;
}

const COLOR_PRESETS = [
  { label: 'Current', value: 'currentColor' },
  { label: 'Ivory White', value: '#F6F3EC' },
  { label: 'Obsidian Black', value: '#141311' },
  { label: 'Vermilion Accent', value: '#FF5024' },
  { label: 'Slate Gray', value: '#726D63' },
  { label: 'Architectural Gold', value: '#E8A938' },
];

const SIZE_PRESETS = [16, 20, 24, 32, 48, 64];
const STROKE_PRESETS = [1.0, 1.5, 2.0, 2.5];

export const IconDetailModal: React.FC<IconDetailModalProps> = ({
  isOpen,
  onClose,
  icon,
  isFavorite,
  onToggleFavorite,
}) => {
  const { success } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('outline');
  const [customization, setCustomization] = useState<IconCustomization>(DEFAULT_CUSTOMIZATION);
  const [stageBg, setStageBg] = useState<'transparent' | 'dark' | 'light'>('transparent');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Sync selected style when icon changes
  React.useEffect(() => {
    if (icon && icon.variants && icon.variants.length > 0) {
      const hasStyle = icon.variants.some((v) => v.style === selectedStyle);
      if (!hasStyle) {
        setSelectedStyle(icon.variants[0].style);
      }
    }
  }, [icon]);

  // Active Variant
  const activeVariant: IconVariant = useMemo(() => {
    if (!icon || !icon.variants || icon.variants.length === 0) {
      return {
        id: 'fallback',
        style: 'outline',
        label: 'Outline',
        svg: icon?.svg || '',
        viewBox: icon?.viewBox || '0 0 24 24',
        supportsStroke: true,
        supportsColor: true,
      };
    }
    const found = icon.variants.find((v) => v.style === selectedStyle);
    return found || icon.variants[0];
  }, [icon, selectedStyle]);

  // Transformed SVG string
  const transformedSvg = useMemo(() => {
    return transformSvgMarkup(activeVariant, customization);
  }, [activeVariant, customization]);

  const handleCopySvg = useCallback(() => {
    if (!icon) return;
    copyToClipboard(transformedSvg);
    setCopiedSvg(true);
    success(`Copied ${icon.name} (${activeVariant.style}) SVG`);
    setTimeout(() => setCopiedSvg(false), 1500);
  }, [icon, activeVariant.style, transformedSvg, success]);

  const handleDownloadSvg = useCallback(() => {
    if (!icon) return;
    downloadFile(transformedSvg, `${icon.slug}-${activeVariant.style}.svg`, 'image/svg+xml');
    setDownloaded(true);
    success(`Downloaded ${icon.slug}-${activeVariant.style}.svg`);
    setTimeout(() => setDownloaded(false), 1500);
  }, [icon, activeVariant.style, transformedSvg, success]);

  const handleReset = useCallback(() => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSelectedStyle('outline');
    setStageBg('transparent');
  }, []);

  if (!icon) return null;

  const isFilled = activeVariant.style === 'filled';
  const displaySize = customization.size || 24;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="5xl"
        showCloseButton={true}
      >
        <div className="flex flex-col space-y-8 p-1 sm:p-3">
          {/* Header Taxonomy & Identity Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle/70">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
                  {icon.category}
                </span>
                <span className="text-[11px] font-mono text-text-tertiary">
                  slug: <code className="text-text-primary font-medium">{icon.slug}</code>
                </span>
                <span>·</span>
                <span className="text-[11px] font-mono text-text-tertiary">
                  {icon.variants?.length || 1} {icon.variants?.length === 1 ? 'Variant' : 'Variants'}
                </span>
              </div>
              <h2 className="type-h2 text-text-primary">
                {icon.name}
              </h2>
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(icon)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer select-none',
                    isFavorite
                      ? 'bg-accent/10 text-accent border-accent/30 font-semibold'
                      : 'bg-bg-secondary/50 text-text-secondary hover:text-text-primary border-border-default hover:border-border-strong'
                  )}
                >
                  <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current text-accent')} />
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                title="Reset customizations to defaults"
                className="p-2 text-text-tertiary hover:text-text-primary bg-bg-secondary/50 hover:bg-bg-secondary border border-border-default hover:border-border-strong rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Studio Workbench Two-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* =====================================================================
                LEFT COLUMN: LARGE VISUAL SPECIMEN STAGE
                ===================================================================== */}
            <div className="lg:col-span-6 space-y-4">
              <div className={cn(
                'relative w-full aspect-square rounded-xl border border-border-default/80 flex items-center justify-center p-8 overflow-hidden select-none shadow-inner transition-colors duration-200',
                stageBg === 'transparent' && 'bg-bg-secondary/30 gridframe-dot-matrix',
                stageBg === 'dark' && 'bg-[#0D0D0B]',
                stageBg === 'light' && 'bg-[#F8F6F0]'
              )}>
                {/* 24×24 Geometry Optical Crosshairs & Corner Guides */}
                <div className="absolute inset-8 border border-dashed border-border-subtle/50 rounded-lg pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/25 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/25 pointer-events-none" />

                {/* Rendered Live SVG Stage */}
                <div
                  dangerouslySetInnerHTML={{ __html: transformedSvg }}
                  className="relative z-10 flex items-center justify-center text-text-primary transition-transform duration-200"
                  style={{
                    transform: `scale(${Math.max(1, displaySize / 24)})`,
                  }}
                />

                {/* Floating Canvas Surface Switcher */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-bg-primary p-1 border border-border-subtle rounded-lg text-[10px] font-mono select-none">
                  <button
                    type="button"
                    onClick={() => setStageBg('transparent')}
                    className={cn(
                      'px-2 py-0.5 rounded-md transition-colors cursor-pointer',
                      stageBg === 'transparent' ? 'bg-bg-elevated text-text-primary font-bold shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageBg('dark')}
                    className={cn(
                      'px-2 py-0.5 rounded-md transition-colors cursor-pointer',
                      stageBg === 'dark' ? 'bg-[#171614] text-[#F6F3EC] font-bold shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageBg('light')}
                    className={cn(
                      'px-2 py-0.5 rounded-md transition-colors cursor-pointer',
                      stageBg === 'light' ? 'bg-[#ECE8DD] text-[#141311] font-bold shadow-xs' : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    Ivory
                  </button>
                </div>

                {/* Stage Metadata Footer */}
                <div className="absolute bottom-3 inset-x-5 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>CANVAS: 24×24 PX</span>
                  </span>
                  <span>RENDERED: {displaySize}PX / {isFilled ? 'SOLID' : `${customization.strokeWidth || 2}PX`}</span>
                </div>
              </div>

              {/* Stage Quick Geometry Details */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-bg-secondary/30 border border-border-subtle rounded-xl text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase block">Keyshape</span>
                  <span className="font-semibold text-text-primary capitalize">{icon.opticalMetrics?.keyshape || icon.metadata?.keyshape || 'square'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase block">Weight / Balance</span>
                  <span className="font-semibold text-accent uppercase">{icon.opticalMetrics?.visualWeight || 'regular'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase block">Center Score</span>
                  <span className="font-semibold text-text-primary">{icon.opticalMetrics?.centerScore || 90}/100</span>
                </div>
              </div>

              {/* Design System UI Use Cases */}
              {icon.useCases && icon.useCases.length > 0 && (
                <div className="p-4 bg-bg-secondary/20 border border-border-subtle rounded-xl space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary block">
                    UI Use Cases & Context
                  </span>
                  <div className="space-y-1.5">
                    {icon.useCases.slice(0, 3).map((uc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary leading-snug">
                        <span className="text-accent font-mono font-bold">›</span>
                        <span>{uc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                RIGHT COLUMN: CUSTOMIZATION WORKBENCH & EXPORT ACTIONS
                ===================================================================== */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* 1. Canonical Variant Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold uppercase tracking-widest text-text-tertiary">
                    1. Visual Variant
                  </span>
                  <span className="text-accent font-bold uppercase">{selectedStyle}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-bg-secondary/40 p-1 border border-border-subtle rounded-xl text-xs font-mono select-none">
                  {(['light', 'regular', 'filled', 'duotone', 'duotone-line'] as IconStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStyle(st)}
                      className={cn(
                        'py-2 px-1 rounded-lg uppercase tracking-wider transition-all text-center cursor-pointer text-[10px] sm:text-[11px] truncate',
                        selectedStyle === st
                          ? 'bg-bg-elevated text-text-primary font-bold shadow-xs border border-border-strong'
                          : 'text-text-tertiary hover:text-text-primary'
                      )}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold uppercase tracking-widest text-text-tertiary">2. Color</span>
                  <span className="text-text-primary font-medium">{customization.color}</span>
                </div>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setCustomization({ ...customization, color: p.value })}
                      title={p.label}
                      className={cn(
                        'w-7 h-7 rounded-full border transition-all cursor-pointer shrink-0',
                        customization.color === p.value
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary scale-110 border-text-primary'
                          : 'border-border-default hover:scale-105'
                      )}
                      style={{
                        backgroundColor: p.value === 'currentColor' ? 'var(--color-text-primary)' : p.value,
                      }}
                    />
                  ))}
                  <div className="relative ml-auto">
                    <input
                      type="color"
                      value={customization.color === 'currentColor' ? '#FF5024' : customization.color}
                      onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                      className="w-7 h-7 rounded-full border border-border-default bg-transparent cursor-pointer p-0 appearance-none overflow-hidden"
                      title="Custom color picker"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Size & Stroke Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Size Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold uppercase tracking-widest text-text-tertiary">Scale Size</span>
                    <span className="text-text-primary font-medium">{customization.size}px</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {SIZE_PRESETS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCustomization({ ...customization, size: s })}
                        className={cn(
                          'py-1.5 text-center text-xs font-mono rounded-lg transition-all border cursor-pointer',
                          customization.size === s
                            ? 'bg-accent text-white font-bold border-accent shadow-xs'
                            : 'bg-bg-secondary/40 text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-strong'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stroke Weight Presets (if linear/outline) */}
                {!isFilled ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold uppercase tracking-widest text-text-tertiary">Stroke</span>
                      <span className="text-text-primary font-medium">{customization.strokeWidth}px</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {STROKE_PRESETS.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setCustomization({ ...customization, strokeWidth: w })}
                          className={cn(
                            'py-1.5 text-center text-xs font-mono rounded-lg transition-all border cursor-pointer',
                            customization.strokeWidth === w
                              ? 'bg-accent text-white font-bold border-accent shadow-xs'
                              : 'bg-bg-secondary/40 text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-strong'
                          )}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-tertiary block">
                      Geometry Fill
                    </span>
                    <div className="py-1.5 px-3 bg-bg-secondary/40 border border-border-subtle rounded-lg text-xs font-mono text-text-secondary text-center">
                      Solid Geometric Fill
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Transform Tools (Rotate & Flip) */}
              <div className="flex items-center justify-between gap-3 p-3 bg-bg-secondary/30 border border-border-subtle rounded-xl text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-tertiary uppercase tracking-wider mr-1">Rotate:</span>
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setCustomization({ ...customization, rotation: deg })}
                      className={cn(
                        'px-2 py-1 text-[10px] rounded-md border transition-all cursor-pointer',
                        customization.rotation === deg
                          ? 'bg-accent text-white font-bold border-accent'
                          : 'bg-bg-elevated text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-strong'
                      )}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCustomization({ ...customization, flipX: !customization.flipX })}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-md border transition-all cursor-pointer',
                      customization.flipX
                        ? 'bg-accent text-white font-bold border-accent'
                        : 'bg-bg-elevated text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-strong'
                    )}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="w-3 h-3" />
                    <span>X</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomization({ ...customization, flipY: !customization.flipY })}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-md border transition-all cursor-pointer',
                      customization.flipY
                        ? 'bg-accent text-white font-bold border-accent'
                        : 'bg-bg-elevated text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-strong'
                    )}
                    title="Flip Vertical"
                  >
                    <FlipVertical className="w-3 h-3" />
                    <span>Y</span>
                  </button>
                </div>
              </div>

              {/* 5. Primary Export Actions */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCopySvg}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-text-primary text-text-inverse rounded-xl hover:opacity-90 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedSvg ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSvg ? 'Copied Markup' : 'Copy SVG Specimen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-accent text-white rounded-xl hover:bg-accent-hover transition-all shadow-sm cursor-pointer"
                  >
                    {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
                    <span>Download .SVG</span>
                  </button>
                </div>

                {/* Secondary Code Snippet & Set Additions */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-bg-secondary/40 hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong rounded-xl transition-all cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5 text-accent" />
                    <span>React / TSX Snippet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCollectionModalOpen(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-bg-secondary/40 hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong rounded-xl transition-all cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-accent" />
                    <span>Add to Set</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Modal>

      {/* Code Snippet Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        icon={icon}
        variant={activeVariant}
        customization={customization}
      />

      {/* Save to Collection Modal */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        icon={icon}
      />
    </>
  );
};

