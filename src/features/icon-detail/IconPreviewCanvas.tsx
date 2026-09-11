import React from "react";
import type { Icon, IconVariant } from "@/types/icon";
import type { IconCustomization, CanvasBackgroundOption } from "@/types/customization";
import { SafeSvg } from "@/components/icons/SafeSvg";
import { IconButton } from "@/components/ui/IconButton";
import { Grid, Moon, Sun, Shield, Eye } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IconPreviewCanvasProps {
  icon: Icon;
  activeVariant: IconVariant | null;
  customization?: IconCustomization;
  canvasBg: CanvasBackgroundOption;
  onCanvasBgChange: (bg: CanvasBackgroundOption) => void;
  className?: string;
}

export const IconPreviewCanvas: React.FC<IconPreviewCanvasProps> = ({
  icon,
  activeVariant,
  customization,
  canvasBg,
  onCanvasBgChange,
  className,
}) => {
  const svgMarkup = activeVariant?.svg || icon.svg;
  const viewBox = activeVariant?.viewBox || icon.viewBox;

  // Customization derived values
  const strokeWidth = activeVariant?.supportsStroke
    ? customization?.strokeWidth ?? activeVariant?.defaultStrokeWidth ?? 2
    : 0;
  const color = customization?.color ?? "currentColor";
  const strokeLinecap = customization?.strokeLinecap ?? "round";
  const strokeLinejoin = customization?.strokeLinejoin ?? "round";
  const rotation = customization?.rotation ?? 0;
  const flipX = customization?.flipX ?? false;
  const flipY = customization?.flipY ?? false;

  // Scaled dimensions on the canvas
  const canvasSize = customization?.size ? Math.min(customization.size * 2, 84) : 56;

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-border-default flex flex-col items-center justify-center p-6 sm:p-8 transition-colors select-none overflow-hidden min-h-[220px]",
        canvasBg === "dots" &&
          "bg-bg-surface-subtle bg-[radial-gradient(var(--color-border-default)_1px,transparent_1px)] [background-size:16px_16px]",
        canvasBg === "dark" && "bg-[#0c0d0e] text-white",
        canvasBg === "light" && "bg-[#ffffff] text-black",
        canvasBg === "checkerboard" &&
          "bg-[linear-gradient(45deg,#1e2124_25%,transparent_25%),linear-gradient(-45deg,#1e2124_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e2124_75%),linear-gradient(-45deg,transparent_75%,#1e2124_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] bg-bg-surface",
        canvasBg === "primary-subtle" && "bg-primary-subtle border-primary/20",
        canvasBg === "transparent" && "bg-transparent",
        className
      )}
    >
      {/* Backdrop Toggle Controls */}
      <div
        role="group"
        aria-label="Canvas background selector"
        className="absolute top-3 left-3 flex items-center bg-bg-surface border border-border-default rounded-md p-0.5 shadow-xs z-10"
      >
        <IconButton
          aria-label="Dots Grid Canvas"
          tooltip="Grid Pattern"
          variant={canvasBg === "dots" ? "active" : "ghost"}
          size="sm"
          className="w-6 h-6 p-1"
          onClick={() => onCanvasBgChange("dots")}
        >
          <Grid className="w-3.5 h-3.5" />
        </IconButton>
        <IconButton
          aria-label="Dark Canvas"
          tooltip="Dark Canvas"
          variant={canvasBg === "dark" ? "active" : "ghost"}
          size="sm"
          className="w-6 h-6 p-1"
          onClick={() => onCanvasBgChange("dark")}
        >
          <Moon className="w-3.5 h-3.5" />
        </IconButton>
        <IconButton
          aria-label="Light Canvas"
          tooltip="Light Canvas"
          variant={canvasBg === "light" ? "active" : "ghost"}
          size="sm"
          className="w-6 h-6 p-1"
          onClick={() => onCanvasBgChange("light")}
        >
          <Sun className="w-3.5 h-3.5" />
        </IconButton>
        <IconButton
          aria-label="Checkerboard Canvas"
          tooltip="Checkerboard"
          variant={canvasBg === "checkerboard" ? "active" : "ghost"}
          size="sm"
          className="w-6 h-6 p-1"
          onClick={() => onCanvasBgChange("checkerboard")}
        >
          <Shield className="w-3.5 h-3.5" />
        </IconButton>
      </div>

      {/* Primary SVG Vector Presentation */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center shadow-md p-4">
          <SafeSvg
            svgContent={svgMarkup}
            viewBox={viewBox}
            size={canvasSize}
            color={color}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            rotation={rotation}
            flipX={flipX}
            flipY={flipY}
            className="transition-all duration-150"
          />
        </div>
      </div>

      {/* Bottom Info Pill */}
      <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono bg-bg-surface px-2.5 py-1 rounded-full border border-border-subtle shadow-xs">
        <Eye className="w-3 h-3 text-primary" />
        <span>{customization?.size ?? 24}px Scale</span>
        <span>•</span>
        <span>{viewBox}</span>
      </div>
    </div>
  );
};
