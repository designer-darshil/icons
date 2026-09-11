import type { CanonicalIconVariant, IconStyle } from "@/types/icon";

export interface StyleMetadata {
  id: CanonicalIconVariant;
  name: string;
  description: string;
  defaultStrokeWidth: number;
  isCanonical: boolean;
}

export const ICON_STYLES: StyleMetadata[] = [
  {
    id: "light",
    name: "Light",
    description: "Lightweight 1.5px stroke outline with minimal visual weight and airy interior",
    defaultStrokeWidth: 1.5,
    isCanonical: true,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Canonical reference 2.0px stroke outline with balanced visual weight and round geometry",
    defaultStrokeWidth: 2.0,
    isCanonical: true,
  },
  {
    id: "filled",
    name: "Filled",
    description: "Solid geometric fill interpretation preserving silhouette and interior counters",
    defaultStrokeWidth: 0,
    isCanonical: true,
  },
  {
    id: "duotone",
    name: "Duotone",
    description: "Two-tone visual hierarchy with 2.0px primary stroke and 20% opacity subordinate fill",
    defaultStrokeWidth: 2.0,
    isCanonical: true,
  },
  {
    id: "duotone-line",
    name: "Duotone Line",
    description: "Outlined dual-layer treatment with 2.0px primary stroke and 25% secondary line detail",
    defaultStrokeWidth: 2.0,
    isCanonical: true,
  },
];

export function getStyleMetadata(style: IconStyle): StyleMetadata | undefined {
  return ICON_STYLES.find((s) => s.id === style);
}
