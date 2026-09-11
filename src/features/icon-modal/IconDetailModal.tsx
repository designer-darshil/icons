import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeModal } from '@/components/export/CodeModal';
import { CollectionModal } from '@/features/collections/CollectionModal';
import { useToast } from '@/components/ui/Toast';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, modalDialogVariants } from '@/lib/motion';
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
  Info,
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
  { label: 'Ivory', value: '#F6F3EC' },
  { label: 'Obsidian', value: '#141311' },
  { label: 'Orange', value: '#FF5024' },
  { label: 'Slate', value: '#726D63' },
  { label: 'Gold', value: '#E8A938' },
];

const SIZE_PRESETS = [16, 24, 32, 48, 64] as const;
const PADDING_PRESETS = [
  { label: '0px', value: 0 },
  { label: '8px', value: 8 },
  { label: '16px', value: 16 },
] as const;

type AnimationType = 'none' | 'spin' | 'pulse' | 'bounce' | 'float';

export const IconDetailModal: React.FC<IconDetailModalProps> = ({
  isOpen,
  onClose,
  icon,
  isFavorite,
  onToggleFavorite,
}) => {
  const { success } = useToast();
  const prefersReducedMotion = useReducedMotion();
  useScrollLock(isOpen);

  // Core state
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('regular');
  const [customization, setCustomization] = useState<IconCustomization>(DEFAULT_CUSTOMIZATION);
  const [padding, setPadding] = useState<number>(0);
  const [animation, setAnimation] = useState<AnimationType>('none');
  const [showInfo, setShowInfo] = useState(false);

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

  // Sync selected style when icon changes
  useEffect(() => {
    if (icon && icon.variants && icon.variants.length > 0) {
      const hasStyle = icon.variants.some((v) => v.style === selectedStyle);
      if (!hasStyle) {
        setSelectedStyle(icon.variants[0].style);
      }
    }
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
    setPadding(0);
    setAnimation('none');
  }, []);

  if (!isOpen || !icon) return null;

  return (
    <>
      <AnimatePresence>
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Dimmed & Softly Blurred Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalDialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#141413] border border-[#282724] rounded-2xl shadow-2xl z-10 my-auto overflow-hidden text-[#F6F3EC]"
          >
            {/* Top-Right Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-30 p-2 rounded-lg text-[#7A7770] hover:text-[#F6F3EC] hover:bg-white/[0.06] transition-colors cursor-pointer touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Main Two-Column Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-7">
              
              {/* ===================================================================
                  LEFT COLUMN: LARGE ICON PREVIEW CANVAS
                  =================================================================== */}
              <div className="md:col-span-6 flex flex-col">
                <div className="relative w-full aspect-square sm:aspect-auto sm:h-full min-h-[280px] sm:min-h-[360px] rounded-xl bg-[#0D0D0C] border border-[#22211F] flex items-center justify-center p-6 overflow-hidden select-none">
                  {/* Subtle 24×24 Dotted Grid Matrix */}
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #55534E 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      backgroundPosition: 'center center',
                    }}
                  />

                  {/* Centered Optical Icon Stage with Padding & Animation */}
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center transition-all duration-300',
                      animation === 'spin' && 'animate-spin',
                      animation === 'pulse' && 'animate-pulse',
                      animation === 'bounce' && 'animate-bounce'
                    )}
                    style={{
                      padding: `${padding}px`,
                      animation: animation === 'float' ? 'gridframe-float 3s ease-in-out infinite' : undefined,
                    }}
                  >
                    <IconPreviewSvg
                      variant={activeVariant}
                      icon={icon}
                      size={Math.min(136, Math.max(56, (customization.size || 24) * 3))}
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

                  {/* Bottom-Left: Small View Code Action */}
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(true)}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#181816] hover:bg-[#222220] border border-[#2B2A27] hover:border-[#3E3D39] text-[11px] font-mono text-[#A8A49C] hover:text-[#F6F3EC] transition-all cursor-pointer shadow-xs"
                    title="Inspect TSX, SVG and React code"
                  >
                    <Code className="w-3.5 h-3.5 text-accent" />
                    <span>View Code</span>
                  </button>

                  {/* Bottom-Right: 24×24 Specimen Dimension Footnote */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#5E5B54] tracking-wider select-none">
                    24×24 PX
                  </span>
                </div>
              </div>

              {/* ===================================================================
                  RIGHT COLUMN: ICON INFO + CONTROLS + ACTIONS
                  =================================================================== */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                
                {/* 1. Header: Category + Name + Quick Actions */}
                <div className="space-y-1.5 pr-8">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase block">
                    {icon.category}
                  </span>

                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F6F3EC] font-sans">
                      {icon.name}
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                      {icon.useCases && icon.useCases.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowInfo(!showInfo)}
                          title="View UI context info"
                          className={cn(
                            'p-1.5 rounded-md text-[#7A7770] hover:text-[#F6F3EC] hover:bg-white/[0.06] transition-colors cursor-pointer',
                            showInfo && 'text-accent bg-accent/10'
                          )}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      )}
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(icon)}
                          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          className={cn(
                            'p-1.5 rounded-md transition-colors cursor-pointer',
                            isFavorite
                              ? 'text-accent bg-accent/10'
                              : 'text-[#7A7770] hover:text-accent hover:bg-white/[0.06]'
                          )}
                        >
                          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current text-accent')} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info Context Popover (if toggled) */}
                  {showInfo && icon.useCases && icon.useCases.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#1A1917] border border-[#2A2926] text-xs text-[#B8B4AC] space-y-1 my-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
                        Context & Use Case
                      </span>
                      <p className="leading-relaxed">{icon.useCases[0]}</p>
                    </div>
                  )}

                  {/* Restrained Tags (Maximum 5 visible) */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {icon.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-[#8C8880] bg-[#1A1917] border border-[#262522] px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Compact Variant Selector (Only real authentic variants) */}
                <div className="pt-2 border-t border-[#242320]">
                  <div className="flex items-center gap-1.5 select-none">
                    {icon.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedStyle(v.style)}
                        className={cn(
                          'px-3 py-1 text-xs font-mono rounded-md border transition-all cursor-pointer',
                          activeVariant.id === v.id
                            ? 'bg-[#F6F3EC] text-[#141311] font-bold border-[#F6F3EC] shadow-xs'
                            : 'bg-transparent text-[#7A7770] border-[#262522] hover:text-[#F6F3EC] hover:border-[#383733]'
                        )}
                      >
                        {v.label || v.style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Essential Controls Grid */}
                <div className="space-y-3 pt-2 border-t border-[#242320]">
                  
                  {/* Color Controls */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7770]">
                      <span className="uppercase tracking-wider font-medium">Color</span>
                      <span className="text-[#B8B4AC] text-[10px]">
                        {customization.color === 'currentColor' ? 'Default' : customization.color}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {COLOR_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, color: p.value }))}
                          title={p.label}
                          className={cn(
                            'w-5 h-5 rounded-full border transition-all cursor-pointer shrink-0',
                            customization.color === p.value
                              ? 'ring-2 ring-accent ring-offset-2 ring-offset-[#141413] scale-110 border-white'
                              : 'border-[#33322E] hover:scale-105'
                          )}
                          style={{
                            backgroundColor: p.value === 'currentColor' ? '#F6F3EC' : p.value,
                          }}
                        />
                      ))}
                      <div className="relative ml-auto">
                        <input
                          type="color"
                          value={customization.color === 'currentColor' ? '#FF5024' : customization.color}
                          onChange={(e) => setCustomization((prev) => ({ ...prev, color: e.target.value }))}
                          className="w-5 h-5 rounded-full border border-[#33322E] bg-transparent cursor-pointer p-0 appearance-none overflow-hidden"
                          title="Custom color picker"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Presets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7770]">
                      <span className="uppercase tracking-wider font-medium">Size</span>
                      <span className="text-[#B8B4AC] text-[10px]">{customization.size}px</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {SIZE_PRESETS.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, size: sz }))}
                          className={cn(
                            'py-1 text-center text-xs font-mono rounded border transition-all cursor-pointer',
                            customization.size === sz
                              ? 'bg-[#2E2D2A] text-white font-bold border-[#44423E] shadow-xs'
                              : 'bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E]'
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding & Animation Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Padding (3 compact options) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7770]">
                        <span className="uppercase tracking-wider font-medium">Padding</span>
                        <span className="text-[#B8B4AC] text-[10px]">{padding}px</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {PADDING_PRESETS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPadding(opt.value)}
                            className={cn(
                              'py-1 text-center text-xs font-mono rounded border transition-all cursor-pointer',
                              padding === opt.value
                                ? 'bg-[#2E2D2A] text-white font-bold border-[#44423E] shadow-xs'
                                : 'bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E]'
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animation Dropdown */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7770]">
                        <span className="uppercase tracking-wider font-medium">Animation</span>
                      </div>
                      <select
                        value={animation}
                        onChange={(e) => setAnimation(e.target.value as AnimationType)}
                        className="w-full bg-[#181816] border border-[#242320] hover:border-[#33322E] focus:border-accent text-xs font-mono text-[#B8B4AC] py-1 px-2 rounded cursor-pointer outline-none transition-colors"
                      >
                        <option value="none">No Animation</option>
                        <option value="spin">Spin</option>
                        <option value="pulse">Pulse</option>
                        <option value="bounce">Bounce</option>
                        <option value="float">Float</option>
                      </select>
                    </div>
                  </div>

                  {/* Flip & Rotate Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Flip */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono text-[#7A7770] uppercase tracking-wider font-medium block">
                        Flip
                      </span>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, flipX: !prev.flipX }))}
                          className={cn(
                            'flex items-center justify-center gap-1 py-1 text-xs font-mono rounded border transition-all cursor-pointer',
                            customization.flipX
                              ? 'bg-[#2E2D2A] text-accent font-bold border-[#44423E]'
                              : 'bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E]'
                          )}
                          title="Flip Horizontal"
                        >
                          <FlipHorizontal className="w-3 h-3" />
                          <span>H</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, flipY: !prev.flipY }))}
                          className={cn(
                            'flex items-center justify-center gap-1 py-1 text-xs font-mono rounded border transition-all cursor-pointer',
                            customization.flipY
                              ? 'bg-[#2E2D2A] text-accent font-bold border-[#44423E]'
                              : 'bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E]'
                          )}
                          title="Flip Vertical"
                        >
                          <FlipVertical className="w-3 h-3" />
                          <span>V</span>
                        </button>
                      </div>
                    </div>

                    {/* Rotate */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7770]">
                        <span className="uppercase tracking-wider font-medium">Rotate</span>
                        <span className="text-[#B8B4AC] text-[10px]">{customization.rotation}°</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomization((prev) => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }))
                          }
                          className="flex items-center justify-center py-1 text-xs font-mono rounded border bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E] transition-all cursor-pointer"
                          title="Rotate 90° Left"
                        >
                          -90°
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, rotation: 0 }))}
                          className={cn(
                            'flex items-center justify-center py-1 text-xs font-mono rounded border transition-all cursor-pointer',
                            customization.rotation === 0
                              ? 'bg-[#2E2D2A] text-white font-bold border-[#44423E]'
                              : 'bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE]'
                          )}
                          title="Reset Rotation"
                        >
                          0°
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomization((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                          className="flex items-center justify-center py-1 text-xs font-mono rounded border bg-[#181816] text-[#7A7770] border-[#242320] hover:text-[#CCC8BE] hover:border-[#33322E] transition-all cursor-pointer"
                          title="Rotate 90° Right"
                        >
                          +90°
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 4. Primary Actions (Bottom-Right) */}
                <div className="space-y-2 pt-3 border-t border-[#242320]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopySvg}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-mono font-bold tracking-wider rounded-lg bg-[#F6F3EC] text-[#141311] hover:bg-white active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                    >
                      {copiedSvg ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSvg ? 'COPIED!' : 'SVG CODE'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSvg}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-mono font-bold tracking-wider rounded-lg bg-accent text-white hover:bg-accent-hover active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                    >
                      {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
                      <span>{downloaded ? 'DOWNLOADED!' : 'DOWNLOAD SVG'}</span>
                    </button>
                  </div>

                  {/* Subordinate Secondary Actions */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <button
                      type="button"
                      onClick={() => setIsCollectionModalOpen(true)}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-[#7A7770] hover:text-[#CCC8BE] transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-accent" />
                      <span>Add to Collection</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1 text-[11px] font-mono text-[#5E5B54] hover:text-[#A8A49C] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
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
