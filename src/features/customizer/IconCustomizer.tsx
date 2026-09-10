import React, { useState } from "react";
import type { IconVariant } from "@/types/icon";
import type { IconCustomization } from "@/types/customization";
import { ColorControl } from "./ColorControl";
import { SizeControl } from "./SizeControl";
import { StrokeControl } from "./StrokeControl";
import { StrokeOptions } from "./StrokeOptions";
import { TransformControls } from "./TransformControls";
import { BackgroundControl } from "./BackgroundControl";
import { CustomizationSummary } from "./CustomizationSummary";
import { Separator } from "@/components/ui/Separator";
import { SlidersHorizontal, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IconCustomizerProps {
  activeVariant: IconVariant | null;
  customization: IconCustomization;
  onUpdate: <K extends keyof IconCustomization>(key: K, value: IconCustomization[K]) => void;
  onReset: () => void;
  onRotate90: () => void;
  onToggleFlipX: () => void;
  onToggleFlipY: () => void;
  hasModifications: boolean;
  className?: string;
}

export const IconCustomizer: React.FC<IconCustomizerProps> = ({
  activeVariant,
  customization,
  onUpdate,
  onReset,
  onRotate90,
  onToggleFlipX,
  onToggleFlipY,
  hasModifications,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const supportsStroke = activeVariant?.supportsStroke ?? true;

  return (
    <div className={cn("space-y-4 rounded-xl bg-bg-surface border border-border-default p-4 shadow-xs", className)}>
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Vector Customizer</span>
        </div>
        <span className="text-[10px] uppercase font-mono text-text-muted bg-bg-surface-subtle px-1.5 py-0.5 rounded border border-border-subtle">
          Live Vector
        </span>
      </div>

      {/* Summary of Active Modifications */}
      <CustomizationSummary
        customization={customization}
        defaultStrokeWidth={activeVariant?.defaultStrokeWidth ?? 2}
        hasModifications={hasModifications}
        onReset={onReset}
      />

      {/* Basic Controls: Color, Size, Stroke Width */}
      <div className="space-y-4">
        <ColorControl
          color={customization.color}
          onChange={(col) => onUpdate("color", col)}
          disabled={!activeVariant?.supportsColor}
        />

        <Separator />

        <SizeControl
          size={customization.size}
          onChange={(sz) => onUpdate("size", sz)}
        />

        <Separator />

        <StrokeControl
          strokeWidth={customization.strokeWidth}
          onChange={(sw) => onUpdate("strokeWidth", sw)}
          disabled={!supportsStroke}
        />
      </div>

      <Separator />

      {/* Advanced Collapsible Accordion */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full flex items-center justify-between py-1.5 px-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Advanced Vector Parameters</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="pt-3 space-y-4 animate-fade-in">
            {/* Linecap & Linejoin */}
            <StrokeOptions
              linecap={customization.strokeLinecap}
              linejoin={customization.strokeLinejoin}
              onLinecapChange={(cap) => onUpdate("strokeLinecap", cap)}
              onLinejoinChange={(join) => onUpdate("strokeLinejoin", join)}
              disabled={!supportsStroke}
            />

            <Separator />

            {/* Rotation & Flip Transforms */}
            <TransformControls
              rotation={customization.rotation}
              flipX={customization.flipX}
              flipY={customization.flipY}
              onRotate={onRotate90}
              onToggleFlipX={onToggleFlipX}
              onToggleFlipY={onToggleFlipY}
            />

            <Separator />

            {/* Canvas Backdrop */}
            <BackgroundControl
              value={customization.background}
              onChange={(bg) => onUpdate("background", bg)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
