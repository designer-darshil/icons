import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { CanvasGrid } from '@/components/preview/CanvasGrid';
import { CodeModal } from '@/components/export/CodeModal';
import { CollectionModal } from '@/features/collections/CollectionModal';
import { SkiperSegmentedTabs, SkiperButton } from '@/components/ui/skiper';
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
  FlipHorizontal,
  FlipVertical,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
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
  { label: 'White', value: '#FFFFFF' },
  { label: 'Primary', value: '#F5F5F2' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Rose', value: '#EF4444' },
  { label: 'Purple', value: '#8B5CF6' },
];

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Active Variant
  const activeVariant: IconVariant = useMemo(() => {
    if (!icon || !icon.variants || icon.variants.length === 0) {
      return {
        id: 'fallback',
        style: 'outline',
        label: 'Outline',
        svg: icon?.svg || '',
        viewBox: '0 0 24 24',
        capabilities: {
          color: true,
          size: true,
          strokeWidth: true,
          lineCap: true,
          lineJoin: true,
          background: true,
          rotation: true,
          flip: true,
        },
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
    success(`Copied ${icon.name} SVG`);
    setTimeout(() => setCopiedSvg(false), 1500);
  }, [icon, transformedSvg, success]);

  const handleDownloadSvg = useCallback(() => {
    if (!icon) return;
    downloadFile(transformedSvg, `${icon.slug}-${activeVariant.style}.svg`, 'image/svg+xml');
    success(`Downloaded ${icon.slug}-${activeVariant.style}.svg`);
  }, [icon, activeVariant.style, transformedSvg, success]);

  const handleReset = useCallback(() => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSelectedStyle('linear');
  }, []);

  if (!icon) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
              {icon.name}
            </span>
            <Badge variant="default" size="xs">
              {icon.category}
            </Badge>
          </div>
        }
        maxWidth="4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Large Precision Preview Canvas */}
          <div className="md:col-span-6 flex flex-col items-center gap-3">
            <CanvasGrid
              background={customization.background}
              className="w-full aspect-square max-h-[380px]"
            >
              <div
                dangerouslySetInnerHTML={{ __html: transformedSvg }}
                className="flex items-center justify-center transition-all duration-120"
                style={{
                  width: `${customization.size || 32}px`,
                  height: `${customization.size || 32}px`,
                }}
              />
            </CanvasGrid>

            {/* Specimen Metadata bar */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-text-tertiary px-1">
              <span>ViewBox: 0 0 24 24</span>
              <span>Size: {customization.size}px</span>
              <span>Stroke: {customization.strokeWidth}px</span>
            </div>
          </div>

          {/* Right Column: Controls, Style Switcher, and Export */}
          <div className="md:col-span-6 space-y-4">
            {/* Style Variant Switcher using SkiperSegmentedTabs */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-secondary uppercase tracking-wider block">
                Style Variant
              </label>
              <SkiperSegmentedTabs
                tabs={icon.variants.map((v) => ({
                  id: v.style,
                  label: v.label || (v.style.charAt(0).toUpperCase() + v.style.slice(1)),
                }))}
                activeId={selectedStyle}
                onChange={(id) => setSelectedStyle(id as IconStyle)}
                layoutId={`modal-variant-${icon.id}`}
                size="sm"
              />
            </div>

            {/* Essential Controls: Color, Size, Stroke Width */}
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              {/* Color Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary">
                  <span>Color</span>
                  <span className="text-text-primary">{customization.color}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setCustomization({ ...customization, color: p.value })}
                      title={p.label}
                      className={cn(
                        'w-5 h-5 rounded-xs border transition-transform cursor-pointer',
                        customization.color === p.value
                          ? 'ring-1 ring-focus scale-110 border-text-primary'
                          : 'border-border-default hover:scale-105'
                      )}
                      style={{
                        backgroundColor: p.value === 'currentColor' ? 'var(--color-text-primary)' : p.value,
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={customization.color === 'currentColor' ? '#F5F5F2' : customization.color}
                    onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                    className="w-5 h-5 rounded-xs border border-border-default bg-transparent cursor-pointer p-0 appearance-none"
                    title="Custom color"
                  />
                </div>
              </div>

              {/* Size Slider */}
              <Slider
                label="Size"
                min={16}
                max={64}
                step={2}
                value={customization.size}
                valueDisplay={`${customization.size}px`}
                onChange={(e) => setCustomization({ ...customization, size: Number(e.target.value) })}
              />

              {/* Stroke Width Slider (Capability-aware) */}
              {activeVariant.supportsStroke && (
                <Slider
                  label="Stroke Width"
                  min={0.5}
                  max={4.0}
                  step={0.25}
                  value={customization.strokeWidth || 2}
                  valueDisplay={`${customization.strokeWidth || 2}px`}
                  onChange={(e) =>
                    setCustomization({ ...customization, strokeWidth: Number(e.target.value) })
                  }
                />
              )}
            </div>

            {/* Primary Action Buttons: Copy SVG & Download SVG */}
            <div className="flex items-center gap-2 pt-2">
              <SkiperButton
                variant="primary"
                size="md"
                onClick={handleCopySvg}
                className="flex-1"
                icon={copiedSvg ? <Check className="w-3.5 h-3.5 text-status-success-text" /> : <Copy className="w-3.5 h-3.5" />}
              >
                <span>{copiedSvg ? 'Copied' : 'Copy SVG'}</span>
              </SkiperButton>

              <SkiperButton
                variant="secondary"
                size="md"
                onClick={handleDownloadSvg}
                className="flex-1"
                icon={<Download className="w-3.5 h-3.5" />}
              >
                <span>Download SVG</span>
              </SkiperButton>
            </div>

            {/* Collapsible Progressive Controls */}
            <div className="pt-2 border-t border-border-subtle space-y-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-[11px] font-mono text-text-tertiary hover:text-text-primary py-1"
              >
                <span>Advanced Transforms & Options</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="space-y-3 pt-2">
                  {/* Rotation & Flips */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-text-secondary w-16">Rotate:</span>
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setCustomization({ ...customization, rotation: deg })}
                        className={cn(
                          'px-2 py-0.5 text-[11px] font-mono rounded-xs border transition-colors',
                          customization.rotation === deg
                            ? 'bg-action-primary text-text-inverse border-action-primary'
                            : 'bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary'
                        )}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-text-secondary w-16">Flip:</span>
                    <button
                      type="button"
                      onClick={() => setCustomization({ ...customization, flipX: !customization.flipX })}
                      className={cn(
                        'flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-xs border transition-colors',
                        customization.flipX
                          ? 'bg-action-primary text-text-inverse border-action-primary'
                          : 'bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary'
                      )}
                    >
                      <FlipHorizontal className="w-3 h-3" />
                      <span>Horizontal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomization({ ...customization, flipY: !customization.flipY })}
                      className={cn(
                        'flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-xs border transition-colors',
                        customization.flipY
                          ? 'bg-action-primary text-text-inverse border-action-primary'
                          : 'bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary'
                      )}
                    >
                      <FlipVertical className="w-3 h-3" />
                      <span>Vertical</span>
                    </button>
                  </div>

                  {/* Reset button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-text-tertiary hover:text-text-primary"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset customizer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" onClick={() => setIsCodeModalOpen(true)}>
                  <Code className="w-3.5 h-3.5 mr-1" />
                  <span>View Code</span>
                </Button>

                <Button variant="ghost" size="xs" onClick={() => setIsCollectionModalOpen(true)}>
                  <FolderPlus className="w-3.5 h-3.5 mr-1" />
                  <span>Save to Collection</span>
                </Button>
              </div>

              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(icon)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={cn(
                    'p-1.5 rounded-sm border transition-colors',
                    isFavorite
                      ? 'border-status-error-border text-action-destructive bg-status-error-bg'
                      : 'border-border-default text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Focused Code Viewer Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        icon={icon}
        variant={activeVariant}
        customization={customization}
      />

      {/* Lightweight Save to Collection Modal */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        icon={icon}
      />
    </>
  );
};
