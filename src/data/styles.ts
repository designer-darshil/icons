import type { IconStyle } from "@/types/icon";

export interface StyleMetadata {
  id: IconStyle;
  name: string;
  description: string;
  defaultStrokeWidth: number;
  isCanonical: boolean;
}

export const ICON_STYLES: StyleMetadata[] = [
  {
    id: "regular",
    name: "Regular",
    description: "Canonical reference 1.5px vector stroke outline on a 24×24 grid with round linecaps and linejoins.",
    defaultStrokeWidth: 1.5,
    isCanonical: true,
  },
  {
    id: "filled",
    name: "Solid",
    description: "Authentic solid vector silhouette filled geometry preserving crisp silhouettes and optical bounds.",
    defaultStrokeWidth: 0,
    isCanonical: true,
  },
];

export function getStyleMetadata(style: IconStyle): StyleMetadata | undefined {
  return ICON_STYLES.find((s) => s.id === style);
}
