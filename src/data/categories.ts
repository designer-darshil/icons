import { GRIDFRAME_ICONS } from './icons/gridframe-catalog';
import type { Icon } from '@/types/icon';

export interface CategoryMetadata {
  id: string;
  name: string;
  description: string;
  count: number;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Interface: 'General UI controls, interactive widgets, toggles, and layout elements',
  Arrows: 'Directional indicators, chevrons, expanding, and flow arrows',
  Communication: 'Mail, chat bubbles, messages, phone triggers, and signals',
  Security: 'Locks, shields, privacy, authentication, and keys',
  Files: 'Documents, directories, archives, clipboards, and folders',
  Maps: 'Location pins, compasses, navigation markers, and route paths',
  Media: 'Audio, video, cameras, volume, and playback controls',
  Social: 'Brands, network platforms, communication, reactions, and sharing badges',
  Time: 'Clocks, timers, calendars, and schedules',
  People: 'User avatars, profiles, teams, crowds, and human representations',
  Navigation: 'Chevrons, compass, pins, routes, and wayfinding',
  System: 'Core system controls, toggles, indicators, and configuration markers',
  Design: 'Color pickers, layers, vector tools, artboards, and layout assets',
  Devices: 'Computers, smartphones, hardware, peripherals, and electronics',
  Commerce: 'Shopping carts, price tags, checkout flows, and retail icons',
  Development: 'Code syntax, brackets, git branches, terminals, and databases',
  Editor: 'Text formatting, code blocks, cursors, drafting, and typography tools',
  Finance: 'Currencies, credit cards, bank notes, charts, and payment tokens',
  Health: 'Medical symbols, hearts, fitness markers, and emergency signs',
  Weather: 'Sun, clouds, precipitation, wind, astronomy, and moon phases',
  Transportation: 'Vehicles, cars, trains, aircraft, ships, and transit systems',
  Home: 'Furniture, domestic appliances, living spaces, and comfort items',
  Shapes: 'Polygons, geometric stars, badges, circular badges, and frames',
  Text: 'Alphabet characters, typography glyphs, and font symbols',
  Food: 'Cuisine, beverages, fruits, dining tools, and culinary symbols',
  Buildings: 'Architecture, landmarks, offices, factories, and warehouses',
  Nature: 'Flora, fauna, plants, leaves, and ecological indicators',
};

/**
 * Single canonical function to index category counts from an icon dataset.
 */
export function getCategoryCounts(icons: Icon[] = GRIDFRAME_ICONS): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const icon of icons) {
    const cat = icon.category || 'Interface';
    counts[cat] = (counts[cat] || 0) + 1;
    counts[cat.toLowerCase()] = (counts[cat.toLowerCase()] || 0) + 1;
  }
  return counts;
}

// Compute dynamic categories map based on canonical catalog
const catalogCategoryMap = new Map<string, number>();
for (const icon of GRIDFRAME_ICONS) {
  const cat = icon.category;
  catalogCategoryMap.set(cat, (catalogCategoryMap.get(cat) || 0) + 1);
}

// Sort alphabetically by category name
export const ICON_CATEGORIES: CategoryMetadata[] = Array.from(catalogCategoryMap.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => ({
    id: name.toLowerCase(),
    name,
    description: CATEGORY_DESCRIPTIONS[name] || `${name} vector icons for digital interfaces`,
    count,
  }));

export function getCategoryMetadata(categoryIdOrName: string): CategoryMetadata | undefined {
  const lower = categoryIdOrName.toLowerCase();
  return ICON_CATEGORIES.find((c) => c.id === lower || c.name.toLowerCase() === lower);
}


