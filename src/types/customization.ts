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

export const COLOR_SWATCHES = [
  { label: "Default", value: "currentColor" },
  { label: "Primary Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Purple", value: "#a855f7" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Dark Gray", value: "#1e293b" },
  { label: "Light Gray", value: "#94a3b8" },
  { label: "Pure White", value: "#ffffff" },
];

export const SIZE_PRESETS = [16, 20, 24, 32, 48, 64];
