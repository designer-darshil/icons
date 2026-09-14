import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeModal } from '@/components/export/CodeModal';
import { CollectionModal } from '@/features/collections/CollectionModal';
import { useToast } from '@/components/ui/Toast';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { GridframeColorPicker } from '@/features/customizer/GridframeColorPicker';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, modalDialogVariants } from '@/lib/motion';
import { getRelatedIcons } from '@/lib/icon-relations';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Icon, IconVariant, IconStyle } from '@/types/icon';
import type { IconCustomization } from '@/types/customization';
import {
  X,
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

/* ─────────── Constants ─────────── */

export interface IconDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: Icon | null;
  isFavorite?: boolean;
  onToggleFavorite?: (icon: Icon) => void;
  onSelectIcon?: (icon: Icon) => void;
}

const SIZE_PRESETS = [16, 24, 32, 48, 64] as const;

/* ─────────── Component ─────────── */

export const IconDetailModal: React.FC<IconDetailModalProps> = ({
  isOpen,
  onClose,
  icon,
  isFavorite,
  onToggleFavorite,
  onSelectIcon,
}) => {
  const { success } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const { addRecentlyViewed } = useRecentlyViewed();
  useScrollLock(isOpen);

  // Core state
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('regular');
  const [customization, setCustomization] = useState<IconCustomization>(DEFAULT_CUSTOMIZATION);

  // Sub-modals & feedback states
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state and track recently viewed on icon change or modal opening (Strict State Isolation)
  useEffect(() => {
    if (icon && isOpen) {
      const defaultStyle = icon.variants?.some((v) => v.style === 'regular')
        ? 'regular'
        : icon.variants?.[0]?.style || 'regular';
      setSelectedStyle(defaultStyle);
      setCustomization(DEFAULT_CUSTOMIZATION);
      addRecentlyViewed(icon.id);
    }
  }, [icon?.id, isOpen, addRecentlyViewed]);

  // Compute related conceptual icons (secondary discovery)
  const relatedIcons = useMemo(() => {
    if (!icon) return [];
    return getRelatedIcons(icon, undefined, 5);
  }, [icon]);

  // Active Variant (Single source of truth)
  const activeVariant: IconVariant = useMemo(() => {
    if (!icon || !icon.variants || icon.variants.length === 0) {
      return {
        id: 'fallback',
        style: 'regular',
        label: 'Regular',
        svg: icon?.svg || '',
        viewBox: icon?.viewBox || '0 0 24 24',
        supportsStroke: true,
        supportsColor: true,
        defaultStrokeWidth: 1.5,
      };
    }
    const found = icon.variants.find((v) => v.style === selectedStyle);
    return found || icon.variants[0];
  }, [icon, selectedStyle]);

  // Canonical Export Markup
  const transformedSvg = useMemo(() => {
    return transformSvgMarkup(activeVariant, customization);
  }, [activeVariant, customization]);

  const handleCopySvg = useCallback(() => {
    if (!icon) return;
    copyToClipboard(transformedSvg);
    setCopiedSvg(true);
    success(`Copied ${icon.name} SVG`);
    setTimeout(() => setCopiedSvg(false), 1400);
  }, [icon, transformedSvg, success]);

  const handleDownloadSvg = useCallback(() => {
    if (!icon) return;
    downloadFile(transformedSvg, `${icon.slug}-${activeVariant.style}.svg`, 'image/svg+xml');
    setDownloaded(true);
    success(`Downloaded ${icon.slug}.svg`);
    setTimeout(() => setDownloaded(false), 1400);
  }, [icon, activeVariant.style, transformedSvg, success]);

  const handleReset = useCallback(() => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSelectedStyle('regular');
  }, []);

  const updateProp = useCallback(
    <K extends keyof IconCustomization>(key: K, value: IconCustomization[K]) => {
      setCustomization((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  if (!isOpen || !icon) return null;

  // ─── Preview Rendering ───
  // Fixed canvas area. Icon rendered at proportional display size.
  // This ensures every SIZE_PRESET step produces a visible change.
  // The actual exported SVG uses the real `customization.size`.
  const CANVAS_SIZE = 280; // px, fixed canvas
  const displaySize = Math.round((customization.size / 80) * CANVAS_SIZE * 0.85);
  const clampedDisplaySize = Math.max(28, Math.min(CANVAS_SIZE - 16, displaySize));

  return (
    <>
      <AnimatePresence>
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
        >
          {/* Dimmed & Softly Blurred Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalDialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[880px] max-h-[92vh] overflow-y-auto bg-bg-elevated border border-border-default rounded-2xl shadow-modal z-10 my-auto text-text-primary"
          >

            {/* ═══════════════════════════════════════════
                HEADER: Category + Name + Favorite + Close
                ═══════════════════════════════════════════ */}
            <div className="flex items-center justify-between px-4 sm:px-7 pt-4 sm:pt-6 pb-3 border-b border-border-subtle">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase block">
                  {icon.category}
                </span>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-text-primary font-sans truncate">
                  {icon.name}
                </h2>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(icon)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className={cn(
                      'p-2 rounded-lg transition-colors cursor-pointer touch-manipulation',
                      isFavorite
                        ? 'text-accent bg-accent/10'
                        : 'text-text-tertiary hover:text-accent hover:bg-bg-secondary'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isFavorite && 'fill-current text-accent')} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                MAIN TWO-COLUMN CONTENT
                ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">

              {/* ─── LEFT: PREVIEW CANVAS ─── */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:border-r md:border-border-subtle">
                <div className="relative w-full max-w-[320px] aspect-square rounded-xl bg-bg-secondary border border-border-subtle flex items-center justify-center overflow-hidden select-none">
                  {/* Subtle Dotted Grid */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      backgroundPosition: 'center center',
                    }}
                  />

                  {/* Centered Icon */}
                  <div className="relative z-10 flex items-center justify-center transition-all duration-200">
                    <IconPreviewSvg
                      variant={activeVariant}
                      icon={icon}
                      size={clampedDisplaySize}
                      color={customization.color}
                      strokeWidth={customization.strokeWidth}
                      strokeLinecap={customization.strokeLinecap}
                      strokeLinejoin={customization.strokeLinejoin}
                      rotation={customization.rotation}
                      flipX={customization.flipX}
                      flipY={customization.flipY}
                      className="text-text-primary drop-shadow-sm"
                    />
                  </div>

                  {/* Bottom-Left: View Code */}
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(true)}
                    className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-bg-elevated/80 hover:bg-bg-elevated border border-border-default hover:border-border-strong text-[10px] font-mono text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-xs touch-manipulation backdrop-blur-sm"
                    title="Inspect code"
                  >
                    <Code className="w-3 h-3 text-accent" />
                    <span>Code</span>
                  </button>

                  {/* Bottom-Right: Dimensions */}
                  <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-text-tertiary tracking-wider select-none">
                    {customization.size}px
                  </span>
                </div>
              </div>

              {/* ─── RIGHT: CONTROLS ─── */}
              <div className="flex flex-col justify-between p-4 sm:p-6 space-y-4">

                {/* VARIANT SELECTOR */}
                {icon.variants.length > 1 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider font-medium block">
                      Variant
                    </span>
                    <div className="flex items-center gap-1.5 select-none flex-wrap">
                      {icon.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedStyle(v.style)}
                          className={cn(
                            'px-3 py-1.5 text-xs font-mono rounded-md border transition-all cursor-pointer touch-manipulation',
                            activeVariant.id === v.id
                              ? 'bg-text-primary text-text-inverse font-bold border-text-primary shadow-xs'
                              : 'bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default'
                          )}
                        >
                          {v.label || v.style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLOR + SIZE ROW (side by side on desktop, stacked on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COLOR */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider font-medium block">
                      Color
                    </span>
                    <GridframeColorPicker
                      color={customization.color}
                      onChange={(c) => updateProp('color', c)}
                      disabled={!activeVariant.supportsColor}
                    />
                  </div>

                  {/* SIZE */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                      <span className="uppercase tracking-wider font-medium">Size</span>
                      <span className="text-text-secondary">{customization.size}px</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {SIZE_PRESETS.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => updateProp('size', sz)}
                          className={cn(
                            'py-2 text-center text-xs font-mono rounded border transition-all cursor-pointer touch-manipulation',
                            customization.size === sz
                              ? 'bg-bg-secondary text-text-primary font-bold border-border-strong shadow-xs'
                              : 'bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default'
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TRANSFORM (Flip + Rotate) */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                      <span className="uppercase tracking-wider font-medium">Transform</span>
                      <span className="text-text-secondary text-[9px]">
                        {customization.rotation}°
                        {customization.flipX && ' ↔'}
                        {customization.flipY && ' ↕'}
                      </span>
                    </div>

                    {/* Flip */}
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        type="button"
                        onClick={() => updateProp('flipX', !customization.flipX)}
                        className={cn(
                          'flex items-center justify-center gap-1 py-2 text-[10px] font-mono rounded border transition-all cursor-pointer touch-manipulation',
                          customization.flipX
                            ? 'bg-bg-secondary text-accent font-bold border-border-strong'
                            : 'bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default'
                        )}
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProp('flipY', !customization.flipY)}
                        className={cn(
                          'flex items-center justify-center gap-1 py-2 text-[10px] font-mono rounded border transition-all cursor-pointer touch-manipulation',
                          customization.flipY
                            ? 'bg-bg-secondary text-accent font-bold border-border-strong'
                            : 'bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default'
                        )}
                        title="Flip Vertical"
                      >
                        <FlipVertical className="w-3 h-3" />
                      </button>

                      {/* Rotate */}
                      <button
                        type="button"
                        onClick={() =>
                          updateProp('rotation', (customization.rotation - 90 + 360) % 360)
                        }
                        className="flex items-center justify-center py-2 text-[10px] font-mono rounded border bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default transition-all cursor-pointer touch-manipulation"
                        title="Rotate 90° Left"
                      >
                        −90
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateProp('rotation', (customization.rotation + 90) % 360)
                        }
                        className="flex items-center justify-center py-2 text-[10px] font-mono rounded border bg-transparent text-text-tertiary border-border-subtle hover:text-text-primary hover:border-border-default transition-all cursor-pointer touch-manipulation"
                        title="Rotate 90° Right"
                      >
                        +90
                      </button>
                    </div>
                </div>

                {/* ─── PRIMARY ACTIONS ─── */}
                <div className="space-y-2 pt-2 border-t border-border-subtle mt-auto">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopySvg}
                      className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-mono font-bold tracking-wider rounded-lg bg-bg-secondary dark:bg-[#F6F3EC] text-text-primary dark:text-[#141311] border border-border-default dark:border-transparent hover:bg-bg-secondary/80 dark:hover:bg-white active:scale-[0.98] transition-all shadow-xs cursor-pointer touch-manipulation"
                    >
                      {copiedSvg ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSvg ? 'COPIED!' : 'COPY SVG'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSvg}
                      className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-mono font-bold tracking-wider rounded-lg bg-accent text-white hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer touch-manipulation"
                    >
                      {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
                      <span>{downloaded ? 'DONE!' : 'DOWNLOAD SVG'}</span>
                    </button>
                  </div>

                  {/* Subordinate Actions */}
                  <div className="flex items-center justify-between px-0.5">
                    <button
                      type="button"
                      onClick={() => setIsCollectionModalOpen(true)}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer touch-manipulation py-1"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-accent" />
                      <span>Add to Collection</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1 text-[11px] font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer touch-manipulation py-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RELATED ICONS (Secondary Discovery) ─── */}
            {relatedIcons.length > 0 && (
              <div className="px-4 sm:px-7 py-3 border-t border-border-subtle bg-bg-secondary/30 flex items-center justify-between gap-3 overflow-x-auto native-scroll select-none">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider shrink-0">
                  Related
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {relatedIcons.map((relIcon) => (
                    <button
                      key={relIcon.id}
                      type="button"
                      onClick={() => onSelectIcon?.(relIcon)}
                      title={relIcon.name}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-bg-elevated border border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-xs"
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <IconPreviewSvg variant={relIcon.variants[0]} icon={relIcon} size={14} />
                      </div>
                      <span className="text-[11px] font-mono font-medium truncate max-w-[95px] sm:max-w-[120px]">
                        {relIcon.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Code Snippet Modal (TSX, JSX, SVG, CSS) */}
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

export default IconDetailModal;
