import type { IconStyle } from "@/types/icon";

export interface StyleMetadata {
  id: IconStyle;
  name: string;
  description: string;
  defaultStrokeWidth: number;
}

export const ICON_STYLES: StyleMetadata[] = [
  {
    id: "linear",
    name: "Linear (Outline)",
    description: "Crisp vector stroke outlines with customizable stroke weights",
    defaultStrokeWidth: 2,
  },
  {
    id: "bold",
    name: "Bold",
    description: "Heavy solid strokes for strong visual emphasis in dense UI",
    defaultStrokeWidth: 2.75,
  },
  {
    id: "filled",
    name: "Filled",
    description: "Solid filled geometry with maximum visual mass",
    defaultStrokeWidth: 0,
  },
  {
    id: "duotone",
    name: "Duotone",
    description: "Dual-tone layered geometry with 20% opacity primary fill",
    defaultStrokeWidth: 1.75,
  },
  {
    id: "two-tone",
    name: "Two-Tone",
    description: "High-contrast dual-colored accents with secondary tone support",
    defaultStrokeWidth: 2,
  },
  {
    id: "broken",
    name: "Broken",
    description: "Interrupted vector geometry for distinct architectural personality",
    defaultStrokeWidth: 2,
  },
  {
    id: "mono",
    name: "Monochrome",
    description: "Uniform flat mono vectors optimized for glyph fonts",
    defaultStrokeWidth: 2,
  },
];
