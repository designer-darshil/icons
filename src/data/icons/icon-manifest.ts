import { GRIDFRAME_ICONS } from "./gridframe-catalog";
import type { Icon, IconCategory, IconStyle } from "@/types/icon";

export const ICON_MANIFEST = {
  totalIcons: GRIDFRAME_ICONS.length,
  lastUpdated: "2026-09-14",
  version: "2.0.0",
  categories: Array.from(new Set(GRIDFRAME_ICONS.map((i) => i.category))) as IconCategory[],
  styles: ["regular", "light", "filled", "duotone", "duotone-line"] as IconStyle[],
  slugMap: new Map<string, Icon>(GRIDFRAME_ICONS.map((i) => [i.slug, i])),
  idMap: new Map<string, Icon>(GRIDFRAME_ICONS.map((i) => [i.id, i])),
};
