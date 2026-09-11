import type { Icon } from '@/types/icon';
import catalogData from './catalog.json';

export const GRIDFRAME_ICONS: Icon[] = catalogData as Icon[];
export const TOTAL_ICON_COUNT = GRIDFRAME_ICONS.length;
export const TOTAL_CONCEPTS_COUNT = GRIDFRAME_ICONS.length;
export const TOTAL_VARIANTS_COUNT = GRIDFRAME_ICONS.reduce(
  (sum, icon) => sum + (icon.variants ? icon.variants.length : 1),
  0
);

export default GRIDFRAME_ICONS;
