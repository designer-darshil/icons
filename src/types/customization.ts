export type StrokeLinecap = "butt" | "round" | "square";
export type StrokeLinejoin = "miter" | "round" | "bevel";

export type CanvasBackgroundOption =
  | "dots"
  | "dark"
  | "light"
  | "transparent"
  | "checkerboard"
  | "primary-subtle";

export interface IconCustomization {
  color: string;
  size: number;
  strokeWidth: number;
  strokeLinecap: StrokeLinecap;
  strokeLinejoin: StrokeLinejoin;
  rotation: number; // 0, 90, 180, 270
  flipX: boolean;
  flipY: boolean;
  background: CanvasBackgroundOption;
}

export const DEFAULT_CUSTOMIZATION: IconCustomization = {
  color: "currentColor",
  size: 24,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  rotation: 0,
  flipX: false,
  flipY: false,
  background: "dots",
};

/**
 * Gridframe Curated Color Palette
 *
 * Restrained warm neutrals plus the Gridframe accent.
 * No rainbow. Controlled and premium.
 */
export const GRIDFRAME_PALETTE = [
  { label: "Default", value: "currentColor" },
  { label: "Warm White", value: "#F6F3EC" },
  { label: "Soft Black", value: "#141311" },
  { label: "Charcoal", value: "#3D3A33" },
  { label: "Warm Gray", value: "#726D63" },
  { label: "Mid Gray", value: "#9A9488" },
  { label: "Gridframe Orange", value: "#FF5024" },
  { label: "Warm Gold", value: "#E8A938" },
];

/** @deprecated Use GRIDFRAME_PALETTE instead */
export const COLOR_SWATCHES = GRIDFRAME_PALETTE;

export const SIZE_PRESETS = [16, 24, 32, 48, 64];
