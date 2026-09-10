import { MOCK_ICONS } from "./mock-icons";
import type { Icon, IconCategory, IconStyle } from "@/types/icon";

export const ICON_MANIFEST = {
  totalIcons: MOCK_ICONS.length,
  lastUpdated: "2026-03-01",
  version: "1.0.0",
  categories: Array.from(new Set(MOCK_ICONS.map((i) => i.category))) as IconCategory[],
  styles: ["linear", "bold", "filled", "duotone", "two-tone", "broken", "mono"] as IconStyle[],
  slugMap: new Map<string, Icon>(MOCK_ICONS.map((i) => [i.slug, i])),
  idMap: new Map<string, Icon>(MOCK_ICONS.map((i) => [i.id, i])),
};
